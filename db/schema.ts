import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
  varchar,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/**
 * Users table - core user data
 */
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name'),
    email: text('email').notNull().unique(),
    password: text('password'), // hashed password (optional for OAuth users)
    walletAddress: varchar('wallet_address', { length: 42 }).unique(),
    role: varchar('role', { length: 50 }).default('member'), // member, investor, builder, creator
    reputation: integer('reputation').default(0),
    bio: text('bio'),
    avatar: text('avatar'),
    emailVerified: boolean('email_verified').default(false),
    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    walletIdx: index('idx_users_wallet').on(table.walletAddress),
    createdAtIdx: index('idx_users_created_at').on(table.createdAt),
  })
)

/**
 * User profiles - extended profile information
 */
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    bio: text('bio'),
    college: text('college'), // College / School name
    degree: text('degree'), // Degree type
    branch: text('branch'), // Branch / Stream
    year: text('year'), // Current Year
    passoutYear: varchar('passout_year', { length: 4 }), // Passout Year
    dateOfBirth: varchar('date_of_birth', { length: 10 }), // YYYY-MM-DD
    resume: text('resume'), // Resume URL
    portfolio: text('portfolio'), // Portfolio URL
    github: text('github'), // GitHub username/URL
    linkedin: text('linkedin'), // LinkedIn URL
    twitter: text('twitter'), // Twitter/X username/URL
    skills: jsonb('skills').$type<string[]>().default([]),
    interests: jsonb('interests').$type<string[]>().default([]),
    achievements: jsonb('achievements').$type<string[]>().default([]),
    socialLinks: jsonb('social_links').$type<Record<string, string>>().default({}),
    website: text('website'),
    location: text('location'),
    primaryDomain: varchar('primary_domain', { length: 100 }),
    lookingFor: jsonb('looking_for').$type<string[]>().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_profiles_user_id').on(table.userId),
  })
)

/**
 * User Stats - track user statistics
 */
export const userStats = pgTable(
  'user_stats',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventsParticipated: integer('events_participated').default(0),
    eventsWon: integer('events_won').default(0),
    projectsCompleted: integer('projects_completed').default(0),
    collaborationsCount: integer('collaborations_count').default(0),
    totalEarnings: decimal('total_earnings', { precision: 18, scale: 2 }).default('0'),
    totalPoints: integer('total_points').default(0),
    rank: integer('rank'),
    streak: integer('streak').default(0),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_user_stats_user_id').on(table.userId),
    rankIdx: index('idx_user_stats_rank').on(table.rank),
  })
)

/**
 * Achievements - achievements/badges system
 */
export const achievements = pgTable(
  'achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    category: varchar('category', { length: 100 }), // participation, winning, collaboration, etc
    icon: text('icon'),
    points: integer('points').default(0),
    rarity: varchar('rarity', { length: 50 }).default('common'), // common, rare, epic, legendary
    requirements: jsonb('requirements').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('idx_achievements_category').on(table.category),
    rarityIdx: index('idx_achievements_rarity').on(table.rarity),
  })
)

/**
 * NFT Achievements - blockchain-verified achievements (user earned achievements)
 */
export const nftAchievements = pgTable(
  'nft_achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    achievementId: uuid('achievement_id')
      .references(() => achievements.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    rarity: varchar('rarity', { length: 50 }).notNull(),
    image: text('image'),
    contractAddress: varchar('contract_address', { length: 42 }),
    tokenId: varchar('token_id', { length: 255 }),
    chainId: integer('chain_id'),
    earnedAt: timestamp('earned_at', { withTimezone: true }).notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    ownerIdIdx: index('idx_nft_achievements_owner_id').on(table.ownerId),
    earnedAtIdx: index('idx_nft_achievements_earned_at').on(table.earnedAt),
    achievementIdIdx: index('idx_nft_achievements_achievement_id').on(table.achievementId),
  })
)

/**
 * Events - hackathons, challenges, etc
 */
export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    type: varchar('type', { length: 100 }).default('hackathon'), // hackathon, challenge, workshop, etc
    status: varchar('status', { length: 50 }).default('upcoming'), // upcoming, active, completed, cancelled
    startDate: timestamp('start_date', { withTimezone: true }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    registrationDeadline: timestamp('registration_deadline', { withTimezone: true }),
    maxParticipants: integer('max_participants'),
    currentParticipants: integer('current_participants').default(0),
    prizePool: decimal('prize_pool', { precision: 18, scale: 2 }),
    currency: varchar('currency', { length: 10 }).default('USD'),
    image: text('image'),
    location: text('location'), // virtual or physical location
    isVirtual: boolean('is_virtual').default(true),
    tags: jsonb('tags').$type<string[]>().default([]),
    requirements: jsonb('requirements').$type<string[]>().default([]),
    prizes: jsonb('prizes').$type<Array<{ place: number; amount: string; description?: string }>>().default([]),
    judges: jsonb('judges').$type<Array<{ name: string; title?: string; avatar?: string }>>().default([]),
    sponsors: jsonb('sponsors').$type<Array<{ name: string; logo?: string; tier?: string }>>().default([]),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    // NEW FIELDS FOR EVENT REGISTRATION REDESIGN
    participationMode: varchar('participation_mode', { length: 20 }).default('solo'), // solo, team, solo_or_team
    minTeamSize: integer('min_team_size').default(2),
    maxTeamSize: integer('max_team_size').default(5),
    requiredSkills: jsonb('required_skills').$type<string[]>().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index('idx_events_status').on(table.status),
    typeIdx: index('idx_events_type').on(table.type),
    startDateIdx: index('idx_events_start_date').on(table.startDate),
    createdByIdx: index('idx_events_created_by').on(table.createdBy),
    participationModeIdx: index('idx_events_participation_mode').on(table.participationMode),
  })
)

/**
 * Event Registrations - user registrations for events
 */
export const eventRegistrations = pgTable(
  'event_registrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 50 }).default('registered'), // registered, confirmed, cancelled, completed
    role: varchar('role', { length: 50 }).default('participant'), // participant, mentor, judge, organizer
    submissionId: uuid('submission_id'),
    score: decimal('score', { precision: 5, scale: 2 }),
    rank: integer('rank'),
    feedback: text('feedback'),
    registeredAt: timestamp('registered_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    eventIdIdx: index('idx_event_registrations_event_id').on(table.eventId),
    userIdIdx: index('idx_event_registrations_user_id').on(table.userId),
    teamIdIdx: index('idx_event_registrations_team_id').on(table.teamId),
    statusIdx: index('idx_event_registrations_status').on(table.status),
  })
)

/**
 * Teams - groups of users working together
 */
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    avatar: text('avatar'),
    eventId: uuid('event_id').references(() => events.id, { onDelete: 'set null' }),
    leaderId: uuid('leader_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    maxMembers: integer('max_members').default(5),
    currentMembers: integer('current_members').default(1),
    isOpen: boolean('is_open').default(true), // accepting new members
    tags: jsonb('tags').$type<string[]>().default([]),
    lookingFor: jsonb('looking_for').$type<string[]>().default([]), // skills they're looking for
    inviteCode: varchar('invite_code', { length: 20 }).unique(), // unique invite code for team
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    eventIdIdx: index('idx_teams_event_id').on(table.eventId),
    leaderIdIdx: index('idx_teams_leader_id').on(table.leaderId),
    isOpenIdx: index('idx_teams_is_open').on(table.isOpen),
    inviteCodeIdx: index('idx_teams_invite_code').on(table.inviteCode),
  })
)

/**
 * Team Members - users belonging to teams
 */
export const teamMembers = pgTable(
  'team_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).default('member'), // leader, member
    status: varchar('status', { length: 50 }).default('active'), // active, invited, left
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    teamIdIdx: index('idx_team_members_team_id').on(table.teamId),
    userIdIdx: index('idx_team_members_user_id').on(table.userId),
    uniqueTeamUser: index('idx_team_members_unique').on(table.teamId, table.userId),
  })
)

/**
 * Collaborations - project collaborations between users
 */
export const collaborations = pgTable(
  'collaborations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    projectName: varchar('project_name', { length: 255 }).notNull(),
    description: text('description'),
    participants: jsonb('participants').$type<Array<{ userId: string; role: string }>>().notNull(),
    status: varchar('status', { length: 50 }).default('active'),
    category: varchar('category', { length: 100 }),
    tags: jsonb('tags').$type<string[]>().default([]),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    createdByIdx: index('idx_collaborations_created_by').on(table.createdBy),
    statusIdx: index('idx_collaborations_status').on(table.status),
    createdAtIdx: index('idx_collaborations_created_at').on(table.createdAt),
  })
)

/**
 * AI Activity - track AI interactions and generated content
 */
export const aiActivity = pgTable(
  'ai_activity',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 100 }).notNull(),
    description: text('description').notNull(),
    confidence: decimal('confidence', { precision: 3, scale: 2 }),
    inputData: jsonb('input_data').$type<Record<string, any>>().default({}),
    outputData: jsonb('output_data').$type<Record<string, any>>().default({}),
    model: varchar('model', { length: 255 }),
    tokensUsed: integer('tokens_used'),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_activity_user_id').on(table.userId),
    typeIdx: index('idx_ai_activity_type').on(table.type),
    timestampIdx: index('idx_ai_activity_timestamp').on(table.timestamp),
  })
)

/**
 * Wallet Connections - track user wallet connections
 */
export const walletConnections = pgTable(
  'wallet_connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    walletAddress: varchar('wallet_address', { length: 42 }).notNull(),
    chainId: integer('chain_id').notNull(),
    verified: boolean('verified').default(false),
    signature: text('signature'),
    connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_wallet_connections_user_id').on(table.userId),
    walletAddressIdx: index('idx_wallet_connections_wallet_address').on(table.walletAddress),
  })
)

/**
 * Onboarding Status - track user onboarding progress
 */
export const onboardingStatus = pgTable(
  'onboarding_status',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    walletConnected: boolean('wallet_connected').default(false),
    roleSelected: boolean('role_selected').default(false),
    profileCompleted: boolean('profile_completed').default(false),
    aiInitialized: boolean('ai_initialized').default(false),
    onboardingComplete: boolean('onboarding_complete').default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_onboarding_user_id').on(table.userId),
  })
)

/**
 * Tasks - hackathon tasks for users/teams
 */
export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id').references(() => events.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    priority: varchar('priority', { length: 20 }).default('medium'), // low, medium, high
    status: varchar('status', { length: 20 }).default('pending'), // pending, inProgress, completed
    category: varchar('category', { length: 50 }), // planning, development, blockchain, testing, deployment, presentation
    estimatedTime: varchar('estimated_time', { length: 50 }), // e.g., "2 Hours"
    dueDate: timestamp('due_date', { withTimezone: true }),
    aiSuggested: boolean('ai_suggested').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_tasks_user_id').on(table.userId),
    teamIdIdx: index('idx_tasks_team_id').on(table.teamId),
    eventIdIdx: index('idx_tasks_event_id').on(table.eventId),
    statusIdx: index('idx_tasks_status').on(table.status),
  })
)

/**
 * AI Goal History - store user goals and Nexus responses
 */
export const aiGoalHistory = pgTable(
  'ai_goal_history',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    goal: text('goal').notNull(),
    goalType: varchar('goal_type', { length: 100 }),
    generatedRoadmap: jsonb('generated_roadmap').$type<any>(),
    recommendations: jsonb('recommendations').$type<any[]>(),
    progress: jsonb('progress').$type<any>(),
    status: varchar('status', { length: 50 }).default('active'), // active, completed, paused
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_goal_history_user_id').on(table.userId),
    statusIdx: index('idx_ai_goal_history_status').on(table.status),
  })
)

/**
 * AI Event Match Scores - Store AI generated event match scores
 */
export const aiEventMatchScores = pgTable(
  'ai_event_match_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
    score: decimal('score', { precision: 5, scale: 2 }).notNull(),
    breakdown: jsonb('breakdown').$type<{
      skills: number;
      profile: number;
      resume: number;
      previousParticipation: number;
    }>().notNull(),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_event_match_user_id').on(table.userId),
    eventIdIdx: index('idx_ai_event_match_event_id').on(table.eventId),
  })
)

/**
 * AI Team Match Scores - Store AI generated team match scores
 */
export const aiTeamMatchScores = pgTable(
  'ai_team_match_scores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
    score: decimal('score', { precision: 5, scale: 2 }).notNull(),
    breakdown: jsonb('breakdown').$type<any>(),
    generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_team_match_user_id').on(table.userId),
    teamIdIdx: index('idx_ai_team_match_team_id').on(table.teamId),
    eventIdIdx: index('idx_ai_team_match_event_id').on(table.eventId),
  })
)

/**
 * Team Invitations - Track team invitations
 */
export const teamInvitations = pgTable(
  'team_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
    inviterId: uuid('inviter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    inviteeId: uuid('invitee_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 20 }).default('pending'), // pending, accepted, rejected, expired
    message: text('message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => ({
    teamIdIdx: index('idx_team_invitation_team_id').on(table.teamId),
    inviteeIdIdx: index('idx_team_invitation_invitee_id').on(table.inviteeId),
    eventIdIdx: index('idx_team_invitation_event_id').on(table.eventId),
  })
)

/**
 * Submissions - event submissions
 */
export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    submissionUrl: text('submission_url'),
    demoUrl: text('demo_url'),
    repoUrl: text('repo_url'),
    status: varchar('status', { length: 50 }).default('pending'), // pending, reviewed, approved, rejected
    score: decimal('score', { precision: 5, scale: 2 }),
    rejectionReason: text('rejection_reason'),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    eventIdIdx: index('idx_submissions_event_id').on(table.eventId),
    teamIdIdx: index('idx_submissions_team_id').on(table.teamId),
    userIdIdx: index('idx_submissions_user_id').on(table.userId),
    statusIdx: index('idx_submissions_status').on(table.status),
  })
)

/**
 * Moderation Actions - moderation actions on submissions
 */
export const moderationActions = pgTable(
  'moderation_actions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    submissionId: uuid('submission_id').notNull().references(() => submissions.id, { onDelete: 'cascade' }),
    moderatorId: uuid('moderator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    action: varchar('action', { length: 50 }).notNull(), // approve, reject, flag
    reason: text('reason'),
    details: jsonb('details').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    submissionIdIdx: index('idx_moderation_submission_id').on(table.submissionId),
    moderatorIdIdx: index('idx_moderation_moderator_id').on(table.moderatorId),
  })
)

/**
 * Host Settings - host-specific settings
 */
export const hostSettings = pgTable(
  'host_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    organizationName: varchar('organization_name', { length: 255 }),
    organizationDescription: text('organization_description'),
    emailNotifications: boolean('email_notifications').default(true),
    pushNotifications: boolean('push_notifications').default(true),
    weeklyDigest: boolean('weekly_digest').default(false),
    twoFactorEnabled: boolean('two_factor_enabled').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_host_settings_user_id').on(table.userId),
  })
)

// ==================== ALL RELATIONS ====================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  stats: one(userStats),
  nftAchievements: many(nftAchievements),
  aiActivity: many(aiActivity),
  walletConnections: many(walletConnections),
  onboarding: one(onboardingStatus),
  collaborationsCreated: many(collaborations),
  eventRegistrations: many(eventRegistrations),
  teamsLed: many(teams),
  teamMemberships: many(teamMembers),
  eventsCreated: many(events),
  tasks: many(tasks),
  aiEventMatchScores: many(aiEventMatchScores),
  aiTeamMatchScores: many(aiTeamMatchScores),
  sentTeamInvitations: many(teamInvitations, { relationName: 'sentInvitations' }),
  receivedTeamInvitations: many(teamInvitations, { relationName: 'receivedInvitations' }),
  submissions: many(submissions),
  moderationActions: many(moderationActions),
  hostSettings: one(hostSettings),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}))

export const achievementsRelations = relations(achievements, ({ many }) => ({
  nftAchievements: many(nftAchievements),
}))

export const nftAchievementsRelations = relations(nftAchievements, ({ one }) => ({
  owner: one(users, {
    fields: [nftAchievements.ownerId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [nftAchievements.achievementId],
    references: [achievements.id],
  }),
}))

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  registrations: many(eventRegistrations),
  teams: many(teams),
  aiEventMatchScores: many(aiEventMatchScores),
  teamInvitations: many(teamInvitations),
  submissions: many(submissions),
}))

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  event: one(events, {
    fields: [submissions.eventId],
    references: [events.id],
  }),
  team: one(teams, {
    fields: [submissions.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  moderationActions: many(moderationActions),
}))

export const moderationActionsRelations = relations(moderationActions, ({ one }) => ({
  submission: one(submissions, {
    fields: [moderationActions.submissionId],
    references: [submissions.id],
  }),
  moderator: one(users, {
    fields: [moderationActions.moderatorId],
    references: [users.id],
  }),
}))

export const hostSettingsRelations = relations(hostSettings, ({ one }) => ({
  user: one(users, {
    fields: [hostSettings.userId],
    references: [users.id],
  }),
}))

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [eventRegistrations.teamId],
    references: [teams.id],
  }),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  event: one(events, {
    fields: [teams.eventId],
    references: [events.id],
  }),
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
  }),
  members: many(teamMembers),
  registrations: many(eventRegistrations),
  aiTeamMatchScores: many(aiTeamMatchScores),
  invitations: many(teamInvitations),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}))

export const collaborationsRelations = relations(collaborations, ({ one }) => ({
  creator: one(users, {
    fields: [collaborations.createdBy],
    references: [users.id],
  }),
}))

export const aiActivityRelations = relations(aiActivity, ({ one }) => ({
  user: one(users, {
    fields: [aiActivity.userId],
    references: [users.id],
  }),
}))

export const walletConnectionsRelations = relations(walletConnections, ({ one }) => ({
  user: one(users, {
    fields: [walletConnections.userId],
    references: [users.id],
  }),
}))

export const onboardingStatusRelations = relations(onboardingStatus, ({ one }) => ({
  user: one(users, {
    fields: [onboardingStatus.userId],
    references: [users.id],
  }),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [tasks.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [tasks.eventId],
    references: [events.id],
  }),
}))

export const aiGoalHistoryRelations = relations(aiGoalHistory, ({ one }) => ({
  user: one(users, {
    fields: [aiGoalHistory.userId],
    references: [users.id],
  }),
}))

export const aiEventMatchScoresRelations = relations(aiEventMatchScores, ({ one }) => ({
  user: one(users, {
    fields: [aiEventMatchScores.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [aiEventMatchScores.eventId],
    references: [events.id],
  }),
}))

export const aiTeamMatchScoresRelations = relations(aiTeamMatchScores, ({ one }) => ({
  user: one(users, {
    fields: [aiTeamMatchScores.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [aiTeamMatchScores.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [aiTeamMatchScores.eventId],
    references: [events.id],
  }),
}))

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
  inviter: one(users, {
    fields: [teamInvitations.inviterId],
    references: [users.id],
  }),
  invitee: one(users, {
    fields: [teamInvitations.inviteeId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [teamInvitations.eventId],
    references: [events.id],
  }),
}))
