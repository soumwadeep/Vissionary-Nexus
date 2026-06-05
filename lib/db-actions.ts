'use server'

import { db } from '@/lib/db'
import { users, onboardingStatus } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Sync or create a user wallet profile in the database
 * Called after wallet connection
 */
export async function syncWalletProfile(
  walletAddress: string,
  email?: string,
  name?: string
) {
  try {
    // Check if user exists by wallet address
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1)

    if (existingUser.length > 0) {
      return {
        success: true,
        user: existingUser[0],
        isNew: false,
      }
    }

    // Create new user with wallet
    const newUser = await db
      .insert(users)
      .values({
        walletAddress,
        email: email || `wallet-${walletAddress.slice(0, 6)}@nexus.local`,
        name: name || `User ${walletAddress.slice(0, 6)}`,
        role: 'member',
        reputation: 0,
      })
      .returning()

    // Create onboarding status record
    await db.insert(onboardingStatus).values({
      userId: newUser[0].id,
      walletConnected: true,
    })

    return {
      success: true,
      user: newUser[0],
      isNew: true,
    }
  } catch (error) {
    console.error('[v0] syncWalletProfile error:', error)
    return {
      success: false,
      error: 'Failed to sync wallet profile',
    }
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByWallet(walletAddress: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress))
      .limit(1)

    return user.length > 0 ? user[0] : null
  } catch (error) {
    console.error('[v0] getUserByWallet error:', error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    bio?: string
    avatar?: string
    role?: string
  }
) {
  try {
    const updated = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    return {
      success: true,
      user: updated[0],
    }
  } catch (error) {
    console.error('[v0] updateUserProfile error:', error)
    return {
      success: false,
      error: 'Failed to update profile',
    }
  }
}

/**
 * Update onboarding status
 */
export async function updateOnboardingStatus(
  userId: string,
  updates: {
    roleSelected?: boolean
    profileCompleted?: boolean
    aiInitialized?: boolean
    onboardingComplete?: boolean
  }
) {
  try {
    const statusUpdates: any = {
      ...updates,
      updatedAt: new Date(),
    }

    // If onboarding is complete, set completedAt
    if (updates.onboardingComplete) {
      statusUpdates.completedAt = new Date()
    }

    const updated = await db
      .update(onboardingStatus)
      .set(statusUpdates)
      .where(eq(onboardingStatus.userId, userId))
      .returning()

    return {
      success: true,
      status: updated[0],
    }
  } catch (error) {
    console.error('[v0] updateOnboardingStatus error:', error)
    return {
      success: false,
      error: 'Failed to update onboarding status',
    }
  }
}

/**
 * Get user onboarding status
 */
export async function getOnboardingStatus(userId: string) {
  try {
    const status = await db
      .select()
      .from(onboardingStatus)
      .where(eq(onboardingStatus.userId, userId))
      .limit(1)

    return status.length > 0 ? status[0] : null
  } catch (error) {
    console.error('[v0] getOnboardingStatus error:', error)
    return null
  }
}
