import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, eventRegistrations, collaborations, nftAchievements, teamMembers } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 401 })
    }

    // Get user by wallet address
    const userResult = await db.select({ id: users.id, reputation: users.reputation }).from(users).where(eq(users.walletAddress, walletAddress)).limit(1)
    
    if (userResult.length === 0) {
      // Return default stats for new users
      return NextResponse.json({
        hackathonsJoined: 0,
        projectsCreated: 0,
        collaborations: 0,
        achievements: 0,
        reputationScore: 0,
        totalPoints: 0
      })
    }

    const userId = userResult[0].id

    // Get hackathons joined count
    const hackathonsCount = await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId))
    
    // Get collaborations count
    const collabsCount = await db.select().from(collaborations).where(eq(collaborations.createdBy, userId))

    // Get achievements count and points from nft_achievements (join with achievements)
    const userAchievements = await db.select().from(nftAchievements).where(eq(nftAchievements.ownerId, userId))

    // Get teams (projects) count
    const teamsCount = await db.select().from(teamMembers).where(eq(teamMembers.userId, userId))

    return NextResponse.json({
      hackathonsJoined: hackathonsCount.length,
      projectsCreated: teamsCount.length,
      collaborations: collabsCount.length,
      achievements: userAchievements.length,
      reputationScore: userResult[0].reputation || 0,
      totalPoints: 0 // TODO: Calculate total points from achievements if needed
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
