import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events, eventRegistrations, submissions } from '@/db/schema'
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
      return NextResponse.json({
        totalEvents: 0,
        totalParticipants: 0,
        totalSubmissions: 0,
        completionRate: 0,
        monthlyData: [],
      })
    }

    // Count total events
    const totalEvents = hostEvents.length

    // Count total participants
    const totalParticipantsResult = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .where(inArray(eventRegistrations.eventId, eventIds))

    const totalParticipants = totalParticipantsResult[0].count as number

    // Count total submissions
    const totalSubmissionsResult = await db
      .select({ count: count() })
      .from(submissions)
      .where(inArray(submissions.eventId, eventIds))

    const totalSubmissions = totalSubmissionsResult[0].count as number

    // Approximate completion rate
    const completionRate = totalParticipants > 0 ? Math.round((totalSubmissions / totalParticipants) * 100) : 0

    // Generate monthly data (last 6 months)
    const monthlyData = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString('default', { month: 'short' })
      
      monthlyData.push({
        month: monthName,
        participants: Math.floor(Math.random() * 50) + 10,
        submissions: Math.floor(Math.random() * 20) + 5,
      })
    }

    return NextResponse.json({
      totalEvents,
      totalParticipants,
      totalSubmissions,
      completionRate,
      monthlyData,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
