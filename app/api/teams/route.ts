import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { teams, teamMembers, teamInvitations, users } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Generate random invite code
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, teamId, inviteCode, email, message, eventId } = body

    // 1. Create a new team
    if (action === 'create') {
      const { name, description } = body
      let inviteCodeVal = generateInviteCode()
      
      // Check if invite code already exists, regenerate if needed
      let existingTeam = await db.select().from(teams).where(eq(teams.inviteCode, inviteCodeVal))
      while (existingTeam.length > 0) {
        inviteCodeVal = generateInviteCode()
        existingTeam = await db.select().from(teams).where(eq(teams.inviteCode, inviteCodeVal))
      }

      const newTeam = await db.insert(teams).values({
        name,
        description,
        leaderId: session.user.id,
        eventId,
        inviteCode: inviteCodeVal,
      }).returning()

      // Add leader as team member
      await db.insert(teamMembers).values({
        teamId: newTeam[0].id,
        userId: session.user.id,
        role: 'leader',
      })

      return NextResponse.json({ success: true, team: newTeam[0] })
    }

    // 2. Regenerate invite code for a team
    if (action === 'regenerate-code') {
      // Check if user is team leader
      const team = await db.select().from(teams).where(eq(teams.id, teamId))
      if (!team.length || team[0].leaderId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      let newInviteCode = generateInviteCode()
      let existingTeam = await db.select().from(teams).where(eq(teams.inviteCode, newInviteCode))
      while (existingTeam.length > 0) {
        newInviteCode = generateInviteCode()
        existingTeam = await db.select().from(teams).where(eq(teams.inviteCode, newInviteCode))
      }

      await db.update(teams).set({ inviteCode: newInviteCode, updatedAt: new Date() }).where(eq(teams.id, teamId))
      return NextResponse.json({ success: true, inviteCode: newInviteCode })
    }

    // 3. Invite teammate by email
    if (action === 'invite') {
      // Check if user is team leader
      const team = await db.select().from(teams).where(eq(teams.id, teamId))
      if (!team.length || team[0].leaderId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (!team[0].eventId) {
        return NextResponse.json({ error: 'Team is not associated with an event' }, { status: 400 })
      }

      // Find user by email
      const invitee = await db.select().from(users).where(eq(users.email, email))
      if (!invitee.length) {
        return NextResponse.json({ error: 'User not found with this email' }, { status: 404 })
      }

      // Check if already invited or member
      const existingMember = await db.select().from(teamMembers).where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, invitee[0].id)))
      if (existingMember.length > 0) {
        return NextResponse.json({ error: 'User is already a team member' }, { status: 400 })
      }

      const existingInvite = await db.select().from(teamInvitations).where(and(eq(teamInvitations.teamId, teamId), eq(teamInvitations.inviteeId, invitee[0].id), eq(teamInvitations.status, 'pending')))
      if (existingInvite.length > 0) {
        return NextResponse.json({ error: 'User already has a pending invite' }, { status: 400 })
      }

      const newInvitation = await db.insert(teamInvitations).values({
        teamId,
        inviterId: session.user.id,
        inviteeId: invitee[0].id,
        eventId: team[0].eventId,
        message,
      }).returning()

      return NextResponse.json({ success: true, invitation: newInvitation[0] })
    }

    // 4. Join team using invite code
    if (action === 'join') {
      const team = await db.select().from(teams).where(eq(teams.inviteCode, inviteCode))
      if (!team.length) {
        return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
      }

      // Check if team is full
      if ((team[0].currentMembers ?? 0) >= (team[0].maxMembers ?? 5)) {
        return NextResponse.json({ error: 'Team is full' }, { status: 400 })
      }

      // Check if user is already a member
      const existingMember = await db.select().from(teamMembers).where(and(eq(teamMembers.teamId, team[0].id), eq(teamMembers.userId, session.user.id)))
      if (existingMember.length > 0) {
        return NextResponse.json({ error: 'Already a member of this team' }, { status: 400 })
      }

      await db.insert(teamMembers).values({
        teamId: team[0].id,
        userId: session.user.id,
        role: 'member',
      })

      // Increment current members
      await db.update(teams).set({
        currentMembers: (team[0].currentMembers ?? 0) + 1,
        updatedAt: new Date(),
      }).where(eq(teams.id, team[0].id))

      return NextResponse.json({ success: true, team: team[0] })
    }

    // 5. Accept/Reject invitation
    if (action === 'respond') {
      const { invitationId, accept } = body

      const invitation = await db.select().from(teamInvitations).where(eq(teamInvitations.id, invitationId))
      if (!invitation.length || invitation[0].inviteeId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (invitation[0].status !== 'pending') {
        return NextResponse.json({ error: 'Invitation already processed' }, { status: 400 })
      }

      const newStatus = accept ? 'accepted' : 'rejected'
      await db.update(teamInvitations).set({
        status: newStatus,
        respondedAt: new Date(),
      }).where(eq(teamInvitations.id, invitationId))

      // If accepted, add as member
      if (accept) {
        const team = await db.select().from(teams).where(eq(teams.id, invitation[0].teamId))
        if (!team.length) {
          return NextResponse.json({ error: 'Team not found' }, { status: 404 })
        }
        await db.insert(teamMembers).values({
          teamId: invitation[0].teamId,
          userId: session.user.id,
          role: 'member',
        })

        // Increment current members
        await db.update(teams).set({
          currentMembers: (team[0].currentMembers ?? 0) + 1,
          updatedAt: new Date(),
        }).where(eq(teams.id, invitation[0].teamId))
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Teams API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const teamId = searchParams.get('teamId')

    // Get user's teams
    if (action === 'my-teams') {
      const memberRecords = await db.select().from(teamMembers).where(eq(teamMembers.userId, session.user.id))
      const teamIds = memberRecords.map(m => m.teamId)
      
      if (teamIds.length === 0) {
        return NextResponse.json({ teams: [] })
      }

      const myTeams = await db.select().from(teams).where(inArray(teams.id, teamIds))
      return NextResponse.json({ teams: myTeams })
    }

    // Get team details
    if (action === 'team-details' && teamId) {
      const team = await db.select().from(teams).where(eq(teams.id, teamId))
      if (!team.length) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      // Get members
      const members = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
          role: teamMembers.role,
        })
        .from(teamMembers)
        .leftJoin(users, eq(teamMembers.userId, users.id))
        .where(eq(teamMembers.teamId, teamId))

      // Get pending invitations (if user is leader)
      const invitations = team[0].leaderId === session.user.id
        ? await db
          .select({
            id: teamInvitations.id,
            teamId: teamInvitations.teamId,
            inviterId: teamInvitations.inviterId,
            inviteeId: teamInvitations.inviteeId,
            status: teamInvitations.status,
            message: teamInvitations.message,
            inviteeName: users.name,
            inviteeEmail: users.email,
          })
          .from(teamInvitations)
          .leftJoin(users, eq(teamInvitations.inviteeId, users.id))
          .where(and(eq(teamInvitations.teamId, teamId), eq(teamInvitations.status, 'pending')))
        : []

      return NextResponse.json({
        team: team[0],
        members,
        invitations,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Teams API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
