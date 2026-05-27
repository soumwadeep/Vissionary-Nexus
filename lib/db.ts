import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/db/schema'

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Create the Neon client
const sql = neon(process.env.DATABASE_URL)

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema })

/**
 * Type exports for database queries
 */
export type User = typeof schema.users.$inferSelect
export type NewUser = typeof schema.users.$inferInsert

export type Profile = typeof schema.profiles.$inferSelect
export type NewProfile = typeof schema.profiles.$inferInsert

export type NFTAchievement = typeof schema.nftAchievements.$inferSelect
export type NewNFTAchievement = typeof schema.nftAchievements.$inferInsert

export type Collaboration = typeof schema.collaborations.$inferSelect
export type NewCollaboration = typeof schema.collaborations.$inferInsert

export type AIActivity = typeof schema.aiActivity.$inferSelect
export type NewAIActivity = typeof schema.aiActivity.$inferInsert

export type WalletConnection = typeof schema.walletConnections.$inferSelect
export type NewWalletConnection = typeof schema.walletConnections.$inferInsert

export type OnboardingStatus = typeof schema.onboardingStatus.$inferSelect
export type NewOnboardingStatus = typeof schema.onboardingStatus.$inferInsert
