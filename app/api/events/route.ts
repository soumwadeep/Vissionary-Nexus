import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events, eventRegistrations } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')
    const createdByFilter = searchParams.get('createdBy')

    let allEvents: any[]
    if (statusFilter && createdByFilter) {
      allEvents = await db.select().from(events)
        .where(and(eq(events.status, statusFilter), eq(events.createdBy, createdByFilter)))
        .orderBy(events.startDate)
    } else if (statusFilter) {
      allEvents = await db.select().from(events)
        .where(eq(events.status, statusFilter))
        .orderBy(events.startDate)
    } else if (createdByFilter) {
      allEvents = await db.select().from(events)
        .where(eq(events.createdBy, createdByFilter))
        .orderBy(events.startDate)
    } else {
      allEvents = await db.select().from(events).orderBy(events.startDate)
    }

    let eventsWithRegistration = allEvents
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const registrations = await db.select({ eventId: eventRegistrations.eventId })
        .from(eventRegistrations)
        .where(eq(eventRegistrations.userId, session.user.id))
      
      const registeredIds = new Set(registrations.map(r => r.eventId))
      eventsWithRegistration = allEvents.map(event => ({
        ...event,
        isRegistered: registeredIds.has(event.id)
      }))
    }

    return NextResponse.json({ events: eventsWithRegistration })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("EVENT_POST_START")
  try {
    const session = await getServerSession(authOptions)
    console.log("EVENT_SESSION", session)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { eventId, action } = body

    if (action === 'register') {
      console.log("EVENT_QUERY_START")
      const existing = await db.select()
        .from(eventRegistrations)
        .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, session.user.id)))
        .limit(1)
      
      if (existing.length === 0) {
        console.log("EVENT_QUERY_START")
        await db.insert(eventRegistrations).values({
          id: crypto.randomUUID(),
          eventId,
          userId: session.user.id,
          status: 'registered'
        })
      }
      return NextResponse.json({ success: true, message: 'Registered for event' })
    } else if (action === 'unregister') {
      console.log("EVENT_QUERY_START")
      await db.delete(eventRegistrations)
        .where(and(eq(eventRegistrations.eventId, eventId), eq(eventRegistrations.userId, session.user.id)))
      return NextResponse.json({ success: true, message: 'Unregistered from event' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error("EVENT_ROUTE_ERROR", error)
    return NextResponse.json( 
      { 
        error: "Failed to process request", 
        details: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 } 
    )
  }
}
