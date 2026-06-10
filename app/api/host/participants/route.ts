import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, events, eventRegistrations, teams, teamMembers } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { eq, desc, like, or, inArray, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Get all events created by this host
    const hostEvents = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.createdBy, session.user.id))

    const eventIds = hostEvents.map(e => e.id)

    if (eventIds.length === 0) {
      return NextResponse.json({ participants: [] })
    }

    let participants
    if (!search) {
      const query = db
        .selectDistinct({
          id: users.id,
          name: users.name,
          email: users.email,
          walletAddress: users.walletAddress,
          reputation: users.reputation,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(eventRegistrations, eq(users.id, eventRegistrations.userId))
        .where(inArray(eventRegistrations.eventId, eventIds))

      participants = await query.orderBy(desc(users.createdAt))
    } else {
      const query = db
        .selectDistinct({
          id: users.id,
          name: users.name,
          email: users.email,
          walletAddress: users.walletAddress,
          reputation: users.reputation,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(eventRegistrations, eq(users.id, eventRegistrations.userId))
        .where(and(
          inArray(eventRegistrations.eventId, eventIds),
          or(
            like(users.name, `%${search}%`),
            like(users.email, `%${search}%`)
          )
        ))

      participants = await query.orderBy(desc(users.createdAt))
    }

    // For each participant, count events joined and submissions
    const participantsWithStats = await Promise.all(
      participants.map(async (p) => {
        const registrations = await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, p.id))
        const userSubmissions = await db.select().from(teams).innerJoin(teamMembers, eq(teams.id, teamMembers.teamId)).where(eq(teamMembers.userId, p.id))
        
        return {
          ...p,
          eventsJoined: registrations.length,
          submissions: userSubmissions.length,
        }
      })
    )

    return NextResponse.json({ participants: participantsWithStats })
  } catch (error) {
    console.error('Error fetching participants:', error)
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 })
  }
}
