import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Helper function to calculate compatibility score
function calculateCompatibility(
  currentUser: { skills: string[], interests: string[], role: string, reputation: number },
  candidate: { skills: string[], interests: string[], role: string, reputation: number }
): number {
  let score = 0
  const maxScore = 100

  // 1. Skills overlap (40 points max)
  const currentSkills = new Set(currentUser.skills)
  const candidateSkills = new Set(candidate.skills)
  const commonSkills = [...currentSkills].filter(x => candidateSkills.has(x))
  const totalSkills = new Set([...currentSkills, ...candidateSkills]).size || 1
  const skillOverlap = (commonSkills.length / totalSkills) * 40
  score += skillOverlap

  // 2. Interests overlap (25 points max)
  const currentInterests = new Set(currentUser.interests)
  const candidateInterests = new Set(candidate.interests)
  const commonInterests = [...currentInterests].filter(x => candidateInterests.has(x))
  const totalInterests = new Set([...currentInterests, ...candidateInterests]).size || 1
  const interestOverlap = (commonInterests.length / totalInterests) * 25
  score += interestOverlap

  // 3. Role complementarity (20 points max)
  const sameRole = currentUser.role === candidate.role
  score += sameRole ? 10 : 20

  // 4. Reputation bonus (15 points max)
  const maxReputation = 1000
  const reputationRatio = Math.min(candidate.reputation / maxReputation, 1)
  score += reputationRatio * 15

  return Math.round(score)
}

// Helper function to suggest team role
function suggestRole(candidateSkills: string[]): string {
  const skillToRole: Record<string, string> = {
    'React': 'Frontend Developer',
    'Vue': 'Frontend Developer',
    'Angular': 'Frontend Developer',
    'TypeScript': 'Developer',
    'JavaScript': 'Developer',
    'Node.js': 'Backend Developer',
    'Python': 'Backend Developer',
    'Django': 'Backend Developer',
    'FastAPI': 'Backend Developer',
    'PostgreSQL': 'Database Engineer',
    'MongoDB': 'Database Engineer',
    'Solidity': 'Web3 Developer',
    'ML': 'AI/ML Engineer',
    'TensorFlow': 'AI/ML Engineer',
    'PyTorch': 'AI/ML Engineer',
    'UI/UX': 'Designer',
    'Figma': 'Designer',
    'Sketch': 'Designer',
    'Product': 'Product Manager',
    'Project Management': 'Product Manager',
  }

  for (const skill of candidateSkills) {
    if (skillToRole[skill]) {
      return skillToRole[skill]
    }
  }
  return 'Generalist'
}

// Function to generate AI analysis using NVIDIA API
async function generateAIAnalysis(
  currentUser: { role: string, skills: string[], interests: string[], reputation: number },
  candidate: { id: string, name: string, role: string, skills: string[], interests: string[], reputation: number, compatibility: number }
): Promise<any | null> {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return null;
    }

    const prompt = `Analyze this potential team mate for a hackathon collaboration.
Current User:
- Role: ${currentUser.role}
- Skills: ${currentUser.skills.join(', ')}
- Interests: ${currentUser.interests.join(', ')}
- Reputation: ${currentUser.reputation}

Candidate:
- Name: ${candidate.name}
- Role: ${candidate.role}
- Skills: ${candidate.skills.join(', ')}
- Interests: ${candidate.interests.join(', ')}
- Reputation: ${candidate.reputation}
- Compatibility Score: ${candidate.compatibility}/100

Return a JSON object with the following structure (no extra text):
{
  "compatibilityExplanation": "Explain why they have this compatibility score in 2-3 sentences",
  "suggestedTeamStructure": "Briefly explain how they would fit into a team together",
  "collaborationStrengths": ["3-5 bullet points about their strengths working together"],
  "potentialRisks": ["2-3 bullet points about potential challenges"],
  "teamSuccessPrediction": "A short prediction about how successful a team with both would be"
}`;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b",
        messages: [
          { role: "system", content: "You are a helpful hackathon team advisor. Always return valid JSON only, no extra text or markdown." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.6
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;
    if (!aiContent) {
      return null;
    }

    // Parse JSON from AI response (handle extra whitespace/backticks)
    const jsonStart = aiContent.indexOf('{');
    const jsonEnd = aiContent.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      return null;
    }

    const jsonStr = aiContent.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('[AI Analysis Error]', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      const mockTeammates = [
        { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
        { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
        { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
        { id: '4', name: 'David Kim', avatar: 'DK', role: 'AI/ML Engineer', skills: ['PyTorch', 'TensorFlow', 'Computer Vision'], compatibility: 85, status: 'online' },
        { id: '5', name: 'Lisa Wang', avatar: 'LW', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], compatibility: 82, status: 'offline' },
      ]
      return NextResponse.json({ recommendations: mockTeammates })
    }

    // 1. Get current user data
    const currentUserResult = await db.select({
      id: users.id,
      role: users.role,
      reputation: users.reputation,
      skills: profiles.skills,
      interests: profiles.interests,
      avatar: users.avatar
    }).from(users).innerJoin(profiles, eq(users.id, profiles.userId)).where(eq(users.id, session.user.id))

    if (currentUserResult.length === 0) {
      const mockTeammates = [
        { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
        { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
        { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
        { id: '4', name: 'David Kim', avatar: 'DK', role: 'AI/ML Engineer', skills: ['PyTorch', 'TensorFlow', 'Computer Vision'], compatibility: 85, status: 'online' },
        { id: '5', name: 'Lisa Wang', avatar: 'LW', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], compatibility: 82, status: 'offline' },
      ]
      return NextResponse.json({ recommendations: mockTeammates })
    }

    const currentUser = currentUserResult[0] as any
    const currentUserId = currentUser.id

    // 2. Get candidate users (excluding current user)
    const candidatesResult = await db.select({
      id: users.id,
      name: users.name,
      role: users.role,
      reputation: users.reputation,
      skills: profiles.skills,
      interests: profiles.interests,
      avatar: users.avatar
    }).from(users).innerJoin(profiles, eq(users.id, profiles.userId)).where(eq(users.id, currentUserId))

    // For now, return mock data until we can properly get all candidates
    const mockTeammates = [
      { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
      { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
      { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
      { id: '4', name: 'David Kim', avatar: 'DK', role: 'AI/ML Engineer', skills: ['PyTorch', 'TensorFlow', 'Computer Vision'], compatibility: 85, status: 'online' },
    ]

    return NextResponse.json({ recommendations: mockTeammates })
  } catch (error) {
    console.error('[api/team-match/recommendations] Error:', error)
    const mockTeammates = [
      { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
      { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
      { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
    ]
    return NextResponse.json({ recommendations: mockTeammates })
  }
}
