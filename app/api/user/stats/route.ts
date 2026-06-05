import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 401 })
    }

    // Get user by wallet address
    const users = await sql`
      SELECT id FROM users WHERE wallet_address = ${walletAddress}
    `
    
    if (users.length === 0) {
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

    const userId = users[0].id

    // Get hackathons joined count
    const hackathons = await sql`
      SELECT COUNT(*) as count FROM event_registrations WHERE user_id = ${userId}
    `

    // Get collaborations count
    const collabs = await sql`
      SELECT COUNT(*) as count FROM collaborations WHERE created_by = ${userId}
    `

    // Get achievements count
    const achievementsCount = await sql`
      SELECT COUNT(*) as count FROM achievements WHERE user_id = ${userId}
    `

    // Get total points from achievements
    const points = await sql`
      SELECT COALESCE(SUM(points), 0) as total FROM achievements WHERE user_id = ${userId}
    `

    // Get user reputation
    const userRep = await sql`
      SELECT reputation_score FROM users WHERE id = ${userId}
    `

    // Get teams (projects) count
    const teams = await sql`
      SELECT COUNT(*) as count FROM team_members WHERE user_id = ${userId}
    `

    return NextResponse.json({
      hackathonsJoined: parseInt(hackathons[0]?.count || '0'),
      projectsCreated: parseInt(teams[0]?.count || '0'),
      collaborations: parseInt(collabs[0]?.count || '0'),
      achievements: parseInt(achievementsCount[0]?.count || '0'),
      reputationScore: userRep[0]?.reputation_score || 0,
      totalPoints: parseInt(points[0]?.total || '0')
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
