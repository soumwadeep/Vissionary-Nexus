// AI Router for routing requests to the right AI feature
import { callNVIDIA } from "./client"
import { SYSTEM_PROMPTS } from "./system-prompts"
import { checkInputGuardrails, checkOutputGuardrails } from "./guardrails"
import { getFallbackRecommendations, getFallbackTasks, FallbackData } from "./fallback"
import { AIMessage, elapsedMs, estimateMessageTokens, estimateTokenCount } from "./performance"

export type AIFeature = "mentor" | "team_match" | "recommendations" | "task_planner" | "nexus_agent"

export interface AIRouterRequest {
  feature: AIFeature
  userData?: FallbackData
  input?: string
  messages?: any[]
}

export interface AIRouterResponse {
  success: boolean
  data?: any
  error?: string
  usedFallback: boolean
  metrics?: {
    nvidiaMs: number
    model?: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

const INTERACTIVE_MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b"
const MAX_CONVERSATION_MESSAGES = 10

// Fallback function for mentor
function getFallbackMentorResponse(userData: any, lastUserMessage: string): string {
  const lowerMessage = lastUserMessage.toLowerCase()
  const userProfile = userData?.userProfile || userData
  const role = userProfile?.role || 'participant'
  const skills = userProfile?.skills || ['problem-solving', 'creativity']
  const interests = userProfile?.interests || ['innovation', 'technology']
  
  // Keywords for smart fallback matching
  const hackathonKeywords = ['hackathon', 'competition', 'event', 'team', 'idea']
  const web3Keywords = ['web3', 'blockchain', 'solidity', 'ethereum', 'somnia', 'nft', 'smart contract']
  const projectKeywords = ['project', 'architecture', 'design', 'plan', 'build']
  const careerKeywords = ['career', 'job', 'resume', 'interview', 'skill']
  const startupKeywords = ['startup', 'company', 'business', 'funding', 'pitch']
  
  if (hackathonKeywords.some(k => lowerMessage.includes(k))) {
    return `Great question about hackathons! As a ${role}, you should focus on ${skills.slice(0, 2).join(' and ')}. 

Here are some quick tips for hackathon success:
1. Start brainstorming early based on your interests in ${interests.slice(0, 2).join(' and ')}
2. Keep your idea simple and focused on solving one problem well
3. Build a minimum viable product first, then add features
4. Remember to test, iterate, and have fun!

Want to dive deeper into any of these areas?`
  }
  
  if (web3Keywords.some(k => lowerMessage.includes(k))) {
    return `I see you're asking about Web3 and blockchain! With your background in ${skills.slice(0, 2).join(' and ')}, this could be a great area for you to explore.

Quick tips for Web3 development:
1. Start with Solidity basics if you're new
2. Test everything on testnets like Somnia Testnet first
3. Pay close attention to security best practices
4. Keep your smart contracts simple and well-audited

Would you like to know more about any specific Web3 topic?`
  }
  
  if (projectKeywords.some(k => lowerMessage.includes(k))) {
    return `Perfect question about project architecture and design! Given your skills in ${skills.slice(0, 2).join(' and ')}, here are some things to consider:

1. Start by clearly defining your problem and goals
2. Choose the right tech stack for your needs
3. Break your project into small, manageable components
4. Focus on user experience and simplicity

Would you like to walk through your specific project idea in more detail?`
  }
  
  if (careerKeywords.some(k => lowerMessage.includes(k))) {
    return `Career development is so important! With your skills in ${skills.slice(0, 2).join(' and ')}, you're already in a great position.

Here are some tips for your career journey:
1. Keep building projects that show off your skills
2. Network with others who share your interests in ${interests.slice(0, 2).join(' and ')}
3. Don't be afraid to share your work and ask for feedback
4. Stay curious and keep learning new things

What specific aspect of career development are you most interested in?`
  }
  
  if (startupKeywords.some(k => lowerMessage.includes(k))) {
    return `Startups are such an exciting journey! With your interests in ${interests.slice(0, 2).join(' and ')}, you could build something really impactful.

Startup tips to remember:
1. Solve a real problem that people care about
2. Talk to potential users early and often
3. Keep your initial product simple (MVP)
4. Be prepared to pivot based on feedback

Would you like to brainstorm some startup ideas together?`
  }
  
  // Default fallback
  return `Thanks for your question! Based on your interests in ${interests.slice(0, 2).join(' and ')} and skills in ${skills.slice(0, 2).join(' and ')}, here's some guidance:

1. Focus on the areas you're most passionate about
2. Break big problems down into smaller, manageable steps
3. Don't hesitate to reach out to others for help or collaboration
4. Remember that progress, not perfection, is what matters

Is there a specific area you'd like to dive deeper into?`
}

export async function aiRouter(request: AIRouterRequest): Promise<AIRouterResponse> {
  const { feature, userData, input, messages } = request
  let nvidiaStartedAt = 0

  // Step 1: Input guardrails check
  if (input) {
    const inputCheck = checkInputGuardrails(input)
    if (!inputCheck.passed) {
      return {
        success: false,
        error: inputCheck.reason,
        usedFallback: true,
        data: getFallbackData(feature, userData, input)
      }
    }
  }

  try {
    // Step 2: Call NVIDIA AI
    let systemPrompt: string
    const promptValue = SYSTEM_PROMPTS[feature]
    if (typeof promptValue === "function") {
      systemPrompt = promptValue(userData?.userData || userData)
    } else {
      systemPrompt = (promptValue as string) || (typeof SYSTEM_PROMPTS.mentor === "function" ? SYSTEM_PROMPTS.mentor(userData?.userData || userData) : SYSTEM_PROMPTS.mentor)
    }
    
    let nVidiaMessages: AIMessage[]
    const usesInteractiveModel = feature === "mentor" || feature === "nexus_agent"
    const conversationHistory = usesInteractiveModel && messages
      ? messages.slice(-MAX_CONVERSATION_MESSAGES)
      : []

    if (conversationHistory.length > 0) {
      nVidiaMessages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ]
    } else {
      nVidiaMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: input || JSON.stringify(userData) }
      ]
    }

    console.log(
      `[AI Prompt Size] feature=${feature} ` +
      `systemPromptTokensEstimated=${estimateTokenCount(systemPrompt)} ` +
      `conversationHistoryTokensEstimated=${estimateMessageTokens(conversationHistory)} ` +
      `finalRequestTokensEstimated=${estimateMessageTokens(nVidiaMessages)} ` +
      `historyMessagesSent=${conversationHistory.length} ` +
      `historyMessagesDiscarded=${Math.max((messages?.length || 0) - conversationHistory.length, 0)}`
    )

    nvidiaStartedAt = performance.now()
    const response = await callNVIDIA(nVidiaMessages, {
      model: usesInteractiveModel ? INTERACTIVE_MODEL : undefined,
      maxTokens: 512
    })
    console.log(`📥 callNVIDIA returned for feature ${feature}`)

    // Step 3: Output guardrails check
    const outputCheck = checkOutputGuardrails(response.content)
    if (!outputCheck.passed) {
      console.warn(`⚠️ Output guardrails failed for feature ${feature}`)
      return {
        success: false,
        error: outputCheck.reason,
        usedFallback: true,
        data: getFallbackData(feature, userData, input),
        metrics: {
          nvidiaMs: response.durationMs,
          model: response.model,
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens
        }
      }
    }

    // Step 4: Parse and return response
    const parsedData = parseAIResponse(response.content, feature, userData, input)
    console.log(`✅ Parsed AI response for feature ${feature}`)
    
    return {
      success: true,
      data: parsedData,
      usedFallback: false,
      metrics: {
        nvidiaMs: response.durationMs,
        model: response.model,
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens
      }
    }
  } catch (error) {
    // Fallback on error
    console.error(`❌ AI Router error for feature ${feature}:`)
    console.error("  - Error message:", (error as any).message)
    console.error("  - Full stack trace:", (error as any).stack)
    return {
      success: false,
      error: "AI service unavailable, using fallback",
      usedFallback: true,
      data: getFallbackData(feature, userData, input),
      metrics: {
        nvidiaMs: nvidiaStartedAt ? elapsedMs(nvidiaStartedAt) : 0
      }
    }
  }
}

// Get fallback data based on feature
function getFallbackData(feature: AIFeature, userData?: FallbackData, input?: string) {
  switch (feature) {
    case "recommendations":
      return getFallbackRecommendations(userData || {})
    case "task_planner":
      return getFallbackTasks(userData?.userData || {})
    case "mentor":
    case "nexus_agent":
      return getFallbackMentorResponse(userData, input || "")
    default:
      return []
  }
}

// Parse AI response
function parseAIResponse(content: string, feature: AIFeature, userData?: FallbackData, input?: string) {
  if (feature === "mentor" || feature === "nexus_agent") {
    // Mentor and Nexus Agent just return the string response
    return content
  }
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error("No JSON found in response")
  } catch (error) {
    console.error("Failed to parse AI response:", error)
    return getFallbackData(feature, userData, input)
  }
}
