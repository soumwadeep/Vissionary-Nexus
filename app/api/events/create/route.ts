import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      status = 'upcoming'
    } = body

    if (!title || !start_date || !end_date) {
      return NextResponse.json({ error: 'Title, start date, and end date are required' }, { status: 400 })
    }

    const newEvent = await db.insert(events).values({
      title,
      description,
      type,
      startDate: new Date(start_date),
      endDate: new Date(end_date),
      registrationDeadline: registration_deadline ? new Date(registration_deadline) : null,
      participationMode: participation_mode,
      minTeamSize: min_team_size,
      maxTeamSize: max_team_size,
      maxParticipants: max_participants,
      requiredSkills: required_skills || [],
      prizePool: prize_pool,
      location,
      image,
      tags: tags || [],
      createdBy: session.user.id,
      status
    }).returning()

    return NextResponse.json({ event: newEvent[0], success: true })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
