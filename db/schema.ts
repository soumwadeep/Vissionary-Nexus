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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Users table - core user data
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    walletAddress: varchar("wallet_address", { length: 42 }).unique(),
    role: varchar("role", { length: 50 }).default("member"), // member, investor, builder, creator
    reputation: integer("reputation").default(0),
    bio: text("bio"),
    avatar: text("avatar"),
    emailVerified: boolean("email_verified").default(false),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    walletIdx: index("idx_users_wallet").on(table.walletAddress),
    createdAtIdx: index("idx_users_created_at").on(table.createdAt),
  }),
);

/**
 * User profiles - extended profile information
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bio: text("bio"),
    skills: jsonb("skills").$type<string[]>().default([]), // array of skills
    interests: jsonb("interests").$type<string[]>().default([]), // array of interests
    achievements: jsonb("achievements").$type<string[]>().default([]), // array of achievement IDs
    socialLinks: jsonb("social_links")
      .$type<Record<string, string>>()
      .default({}), // twitter, github, etc
    website: text("website"),
    location: text("location"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_profiles_user_id").on(table.userId),
  }),
);

/**
 * NFT Achievements - blockchain-verified achievements
 */
export const nftAchievements = pgTable(
  "nft_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    rarity: varchar("rarity", { length: 50 }).notNull(), // common, rare, epic, legendary
    image: text("image"),
    contractAddress: varchar("contract_address", { length: 42 }),
    tokenId: varchar("token_id", { length: 255 }),
    chainId: integer("chain_id"), // blockchain network ID
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    ownerIdIdx: index("idx_achievements_owner_id").on(table.ownerId),
    earnedAtIdx: index("idx_achievements_earned_at").on(table.earnedAt),
  }),
);

/**
 * Collaborations - project collaborations between users
 */
export const collaborations = pgTable(
  "collaborations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectName: varchar("project_name", { length: 255 }).notNull(),
    description: text("description"),
    participants: jsonb("participants")
      .$type<Array<{ userId: string; role: string }>>()
      .notNull(),
    status: varchar("status", { length: 50 }).default("active"), // active, completed, paused
    category: varchar("category", { length: 100 }),
    tags: jsonb("tags").$type<string[]>().default([]),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    createdByIdx: index("idx_collaborations_created_by").on(table.createdBy),
    statusIdx: index("idx_collaborations_status").on(table.status),
    createdAtIdx: index("idx_collaborations_created_at").on(table.createdAt),
  }),
);

/**
 * AI Activity - track AI interactions and generated content
 */
export const aiActivity = pgTable(
  "ai_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 100 }).notNull(), // analysis, generation, recommendation, etc
    description: text("description").notNull(),
    confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0.0 to 1.0
    inputData: jsonb("input_data").$type<Record<string, any>>().default({}),
    outputData: jsonb("output_data").$type<Record<string, any>>().default({}),
    model: varchar("model", { length: 255 }), // which AI model was used
    tokensUsed: integer("tokens_used"),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_ai_activity_user_id").on(table.userId),
    typeIdx: index("idx_ai_activity_type").on(table.type),
    timestampIdx: index("idx_ai_activity_timestamp").on(table.timestamp),
  }),
);

/**
 * Wallet Connections - track user wallet connections
 */
export const walletConnections = pgTable(
  "wallet_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
    chainId: integer("chain_id").notNull(),
    verified: boolean("verified").default(false),
    signature: text("signature"),
    connectedAt: timestamp("connected_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_wallet_connections_user_id").on(table.userId),
    walletAddressIdx: index("idx_wallet_connections_wallet_address").on(
      table.walletAddress,
    ),
  }),
);

/**
 * Onboarding Status - track user onboarding progress
 */
export const onboardingStatus = pgTable(
  "onboarding_status",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    walletConnected: boolean("wallet_connected").default(false),
    roleSelected: boolean("role_selected").default(false),
    profileCompleted: boolean("profile_completed").default(false),
    aiInitialized: boolean("ai_initialized").default(false),
    onboardingComplete: boolean("onboarding_complete").default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_onboarding_user_id").on(table.userId),
  }),
);

/**
 * Relations
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles),
  achievements: many(nftAchievements),
  aiActivity: many(aiActivity),
  walletConnections: many(walletConnections),
  onboarding: one(onboardingStatus),
  collaborationsCreated: many(collaborations),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const nftAchievementsRelations = relations(
  nftAchievements,
  ({ one }) => ({
    owner: one(users, {
      fields: [nftAchievements.ownerId],
      references: [users.id],
    }),
  }),
);

export const aiActivityRelations = relations(aiActivity, ({ one }) => ({
  user: one(users, {
    fields: [aiActivity.userId],
    references: [users.id],
  }),
}));

export const walletConnectionsRelations = relations(
  walletConnections,
  ({ one }) => ({
    user: one(users, {
      fields: [walletConnections.userId],
      references: [users.id],
    }),
  }),
);

export const onboardingStatusRelations = relations(
  onboardingStatus,
  ({ one }) => ({
    user: one(users, {
      fields: [onboardingStatus.userId],
      references: [users.id],
    }),
  }),
);

export const collaborationsRelations = relations(collaborations, ({ one }) => ({
  creator: one(users, {
    fields: [collaborations.createdBy],
    references: [users.id],
  }),
}));
