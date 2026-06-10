import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id
    const body = await request.json()
    const {
      title,
      description,
      type,
      start_date,
      end_date,
      registration_deadline,
      participation_mode,
      min_team_size,
      max_team_size,
      max_participants,
      required_skills,
      prize_pool,
      location,
      image,
      tags,
      status
    } = body

    // Verify the event exists and is created by this user
    const existingEvent = await db.select().from(events).where(eq(events.id, eventId)).limit(1)
    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (existingEvent[0].createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to edit this event' }, { status: 403 })
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (start_date) updateData.startDate = new Date(start_date)
    if (end_date) updateData.endDate = new Date(end_date)
    if (registration_deadline) updateData.registrationDeadline = new Date(registration_deadline)
    if (participation_mode) updateData.participationMode = participation_mode
    if (min_team_size !== undefined) updateData.minTeamSize = min_team_size
    if (max_team_size !== undefined) updateData.maxTeamSize = max_team_size
    if (max_participants !== undefined) updateData.maxParticipants = max_participants
    if (required_skills) updateData.requiredSkills = required_skills
    if (prize_pool !== undefined) updateData.prizePool = prize_pool
    if (location !== undefined) updateData.location = location
    if (image !== undefined) updateData.image = image
    if (tags) updateData.tags = tags
    if (status !== undefined) updateData.status = status
    updateData.updatedAt = new Date()

    const updatedEvent = await db.update(events)
      .set(updateData)
      .where(eq(events.id, eventId))
      .returning()

    return NextResponse.json({ event: updatedEvent[0], success: true })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventId = params.id

    // Verify the event exists and is created by this user
    const existingEvent = await db.select().from(events).where(eq(events.id, eventId)).limit(1)
    if (existingEvent.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (existingEvent[0].createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this event' }, { status: 403 })
    }

    await db.delete(events).where(eq(events.id, eventId))
    return NextResponse.json({ success: true, message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
