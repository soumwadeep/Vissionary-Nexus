import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, events, users, teams } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { eq, desc, like, inArray, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const search = searchParams.get('search')

    // Get all events created by this host
    const hostEvents = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.createdBy, session.user.id))

    const eventIds = hostEvents.map(e => e.id)

    if (eventIds.length === 0) {
      return NextResponse.json({ submissions: [] })
    }

    // Build conditions
    const conditions = [inArray(submissions.eventId, eventIds)]
    if (statusFilter) {
      conditions.push(eq(submissions.status, statusFilter))
    }
    if (search) {
      conditions.push(like(submissions.title, `%${search}%`))
    }

    // Build query
    const query = db
      .select({
        id: submissions.id,
        title: submissions.title,
        description: submissions.description,
        status: submissions.status,
        score: submissions.score,
        createdAt: submissions.createdAt,
        eventId: submissions.eventId,
        eventTitle: events.title,
        teamId: submissions.teamId,
        teamName: teams.name,
        userId: submissions.userId,
        userName: users.name,
      })
      .from(submissions)
      .leftJoin(events, eq(submissions.eventId, events.id))
      .leftJoin(teams, eq(submissions.teamId, teams.id))
      .leftJoin(users, eq(submissions.userId, users.id))
      .where(and(...conditions))

    const results = await query.orderBy(desc(submissions.createdAt))

    return NextResponse.json({ submissions: results })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
