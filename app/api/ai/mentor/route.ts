import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { aiRouter } from '@/lib/ai/router'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  let userProfile: any = null
  let messages: any[] = []
  let lastUserMessage: string = ''
  let userId: string | null = null
  
  try {
    const requestData = await request.json()
    messages = requestData.messages || []
    userProfile = requestData.userProfile
    userId = requestData.userId
    lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    
    // Track AI request
    if (userId) {
      try {
        await sql`
          INSERT INTO ai_activity (user_id, type, description, input_data, model)
          VALUES (${userId}, 'ai_request', 'AI mentor request', ${JSON.stringify({ userProfile, lastUserMessage })}, 'meta/llama-3.3-70b-instruct')
        `
      } catch (e) {
        console.error('Failed to track AI request:', e)
      }
    }
    
    // Use AI Router
    const result = await aiRouter({
      feature: 'mentor',
      userData: { userId: userId || undefined, userData: { userProfile } },
      input: lastUserMessage,
      messages: messages
    })
    
    // Track error or fallback
    if (!result.success || result.usedFallback) {
      if (userId) {
        try {
          await sql`
            INSERT INTO ai_activity (user_id, type, description, input_data, model)
            VALUES (${userId}, ${result.usedFallback ? 'ai_fallback' : 'ai_error'}, ${result.error || 'AI fallback used'}, ${JSON.stringify({ userProfile, lastUserMessage })}, 'meta/llama-3.3-70b-instruct')
          `
        } catch (e) {
          console.error('Failed to track AI error/fallback:', e)
        }
      }
    }
    
    return NextResponse.json({
      message: result.data,
      isFallback: result.usedFallback
    })
    
  } catch (error) {
    console.error('AI Mentor API error:', error)
    // Fallback to old fallback function
    const lowerMessage = lastUserMessage.toLowerCase()
    const role = userProfile?.role || 'participant'
    const skills = userProfile?.skills || ['problem-solving', 'creativity']
    const interests = userProfile?.interests || ['innovation', 'technology']
    
    const fallbackMsg = `Thanks for your question! Based on your interests in ${interests.slice(0, 2).join(' and ')} and skills in ${skills.slice(0, 2).join(' and ')}, here's some guidance:

1. Focus on the areas you're most passionate about
2. Break big problems down into smaller, manageable steps
3. Don't hesitate to reach out to others for help or collaboration
4. Remember that progress, not perfection, is what matters

Is there a specific area you'd like to dive deeper into?`
    
    return NextResponse.json({
      message: fallbackMsg,
      isFallback: true
    })
  }
}
