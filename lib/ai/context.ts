// AI context builder - collects user data and context for AI features
'use server'

import { db } from '@/lib/db'
import { 
  users, 
  profiles, 
  nftAchievements, 
  tasks, 
  eventRegistrations, 
  collaborations as collaborationsTable,
  teamMembers,
  walletConnections,
  userStats,
  events
} from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export interface UserContext {
  userId?: string
  profile?: any
  skills?: string[]
  reputation?: number
  walletConnected?: boolean
  nftBadges?: any[]
  pendingTasks?: any[]
  completedTasks?: any[]
  recommendations?: any[]
  teammates?: any[]
  events?: any[]
  collaborations?: any[]
  teamStatus?: string
  stats?: any
}

// Build a complete user context from database by userId
export async function buildUserContext(userId: string): Promise<UserContext> {
  try {
    // First, ensure user exists and create profile if needed
    let profileResult = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1)
    let profile = profileResult[0]

    if (!profile) {
      // Create a default profile if it doesn't exist
      const newProfile = await db.insert(profiles).values({
        userId
      }).returning()
      profile = newProfile[0]
    }

    // Ensure user stats exist
    let statsResult = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1)
    let stats = statsResult[0]

    if (!stats) {
      const newStats = await db.insert(userStats).values({
        userId
      }).returning()
      stats = newStats[0]
    }

    // Fetch all remaining data in parallel, with try/catch for each
    const [
      userResult,
      walletResult,
      nftBadgesResult,
      pendingTasksResult,
      completedTasksResult,
      teamMembershipsResult,
      eventRegsResult,
      collaborationsResult
    ] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).limit(1),
      db.select().from(walletConnections).where(eq(walletConnections.userId, userId)).limit(1),
      db.select().from(nftAchievements).where(eq(nftAchievements.ownerId, userId)),
      db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'pending'))),
      db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.status, 'completed'))),
      db.select().from(teamMembers).where(eq(teamMembers.userId, userId)),
      db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)),
      db.select().from(collaborationsTable).where(eq(collaborationsTable.createdBy, userId))
    ])

    const user = userResult[0]
    const wallet = walletResult[0]
    const nftBadges = nftBadgesResult
    const pendingTasks = pendingTasksResult
    const completedTasks = completedTasksResult
    const teamMemberships = teamMembershipsResult
    const eventRegs = eventRegsResult
    const userCollaborations = collaborationsResult

    // Fetch teammates if user is in a team
    let teammates: any[] = []
    if (teamMemberships.length > 0) {
      try {
        const teamIds = teamMemberships.map(tm => tm.teamId)
        const allTeamMembers = await db.select().from(teamMembers).where(inArray(teamMembers.teamId, teamIds))
        
        // Get user details for each team member
        const userIds = allTeamMembers.map(tm => tm.userId)
        const teamUsers = await db.select().from(users).where(inArray(users.id, userIds))
        
        teammates = allTeamMembers
          .filter(tm => tm.userId !== userId)
          .map(tm => {
            const teamUser = teamUsers.find(u => u.id === tm.userId)
            return {
              id: tm.userId,
              name: teamUser?.name,
              role: tm.role,
              teamId: tm.teamId,
              joinedAt: tm.joinedAt
            }
          })
      } catch (e) {
        console.warn("Error fetching teammates:", e)
      }
    }

    // Fetch registered events details
    let eventsData: any[] = []
    if (eventRegs.length > 0) {
      try {
        const eventIds = eventRegs.map(er => er.eventId)
        eventsData = await db.select().from(events).where(inArray(events.id, eventIds))
      } catch (e) {
        console.warn("Error fetching events data:", e)
      }
    }

    return {
      userId,
      profile: {
        name: user?.name,
        email: user?.email,
        bio: profile?.bio || user?.bio,
        avatar: user?.avatar,
        role: user?.role,
        website: profile?.website,
        location: profile?.location,
        socialLinks: profile?.socialLinks
      },
      skills: profile?.skills || [],
      reputation: user?.reputation || 0,
      walletConnected: !!wallet,
      nftBadges,
      pendingTasks,
      completedTasks,
      teammates,
      events: eventsData.length > 0 ? eventsData : eventRegs,
      collaborations: userCollaborations,
      teamStatus: teamMemberships.length > 0 ? 'in_team' : 'no_team',
      stats
    }
  } catch (error) {
    console.error("buildUserContext ERROR:", error)
    // Return a minimal valid context if anything fails
    return {
      userId,
      profile: { name: "User", email: "user@example.com" },
      skills: [],
      reputation: 0,
      walletConnected: false,
      nftBadges: [],
      pendingTasks: [],
      completedTasks: [],
      teammates: [],
      events: [],
      collaborations: [],
      teamStatus: "no_team",
      stats: null
    }
  }
}
