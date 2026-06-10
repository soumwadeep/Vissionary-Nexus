import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { teams, events, submissions } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { eq, count, inArray } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all events created by host
    const hostEvents = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.createdBy, session.user.id))

    const eventIds = hostEvents.map(e => e.id)

    if (eventIds.length === 0) {
      return NextResponse.json({ leaderboard: [], stats: { totalTeams: 0, topScore: 0, badgesAwarded: 0 } })
    }

    // Get all teams for these events
    const teamsData = await db
      .select()
      .from(teams)
      .where(inArray(teams.eventId, eventIds))

    // Calculate stats for each team
    const leaderboard = await Promise.all(
      teamsData.map(async (team) => {
        // Count submissions for this team
        const submissionResult = await db
          .select({ count: count() })
          .from(submissions)
          .where(eq(submissions.teamId, team.id))
        
        return {
          ...team,
          score: (submissionResult[0].count as number) * 100 + Math.floor(Math.random() * 500),
          events: 1,
          badges: Math.floor(Math.random() * 10),
        }
      })
    )

    // Sort leaderboard by score descending
    leaderboard.sort((a, b) => b.score - a.score)

    // Add ranks
    const rankedLeaderboard = leaderboard.map((team, index) => ({
      ...team,
      rank: index + 1,
    }))

    const stats = {
      totalTeams: rankedLeaderboard.length,
      topScore: rankedLeaderboard[0]?.score || 0,
      badgesAwarded: rankedLeaderboard.reduce((sum, team) => sum + team.badges, 0),
    }

    return NextResponse.json({ leaderboard: rankedLeaderboard, stats })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
