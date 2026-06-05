import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

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

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      )
    }

    // 1. Get current user data
    const currentUsers = await sql`
      SELECT 
        u.id,
        u.role,
        u.reputation,
        p.skills,
        p.interests
      FROM users u
      INNER JOIN profiles p ON u.id = p.user_id
      WHERE u.wallet_address = ${walletAddress}
    `

    if (currentUsers.length === 0) {
      // Return mock data if no current user found
      const mockTeammates = [
        { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
        { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
        { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
        { id: '4', name: 'David Kim', avatar: 'DK', role: 'AI/ML Engineer', skills: ['PyTorch', 'TensorFlow', 'Computer Vision'], compatibility: 85, status: 'online' },
        { id: '5', name: 'Lisa Wang', avatar: 'LW', role: 'DevOps Engineer', skills: ['AWS', 'Docker', 'Kubernetes'], compatibility: 82, status: 'offline' },
        { id: '6', name: 'James Brown', avatar: 'JB', role: 'Product Manager', skills: ['Strategy', 'Agile', 'Analytics'], compatibility: 78, status: 'online' },
      ]
      return NextResponse.json({ recommendations: mockTeammates })
    }

    const currentUser = currentUsers[0] as any
    const currentUserId = currentUser.id

    // 2. Get candidate users (excluding current user)
    const candidates = await sql`
      SELECT 
        u.id,
        u.name,
        u.role,
        u.reputation,
        p.skills,
        p.interests,
        u.avatar
      FROM users u
      INNER JOIN profiles p ON u.id = p.user_id
      WHERE u.id != ${currentUserId}
      LIMIT 50
    `

    // 3. Calculate compatibility scores for each candidate
    const recommendations = (candidates as any[]).map(candidate => {
      const compatibilityScore = calculateCompatibility(
        {
          skills: currentUser.skills || [],
          interests: currentUser.interests || [],
          role: currentUser.role,
          reputation: currentUser.reputation
        },
        {
          skills: candidate.skills || [],
          interests: candidate.interests || [],
          role: candidate.role,
          reputation: candidate.reputation
        }
      )

      // Generate avatar initials from name if no avatar
      let avatar = candidate.avatar
      if (!avatar && candidate.name) {
        const nameParts = candidate.name.split(' ')
        avatar = nameParts.map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)
      } else if (!avatar) {
        avatar = 'VN'
      }

      return {
        id: candidate.id,
        name: candidate.name || 'Anonymous User',
        avatar,
        role: suggestRole(candidate.skills || []),
        skills: candidate.skills || [],
        compatibility: compatibilityScore,
        status: 'online',
      }
    }).sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 10)

    // 4. Return results
    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('[api/team-match/recommendations] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get team recommendations' },
      { status: 500 }
    )
  }
}
