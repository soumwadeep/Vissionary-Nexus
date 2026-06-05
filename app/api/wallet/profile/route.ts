import { db } from '@/lib/db'
import { users, walletConnections } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, role, interests, onboardingComplete } = body

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const normalizedAddress = address.toLowerCase()

    // Find or create user by wallet address
    let user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, normalizedAddress))
      .limit(1)

    if (user.length === 0) {
      // Create new user
      const userId = uuidv4()
      const newUser = await db
        .insert(users)
        .values({
          id: userId,
          email: `${normalizedAddress}@wallet.local`,
          walletAddress: normalizedAddress,
          role: role || 'member',
          name: `User ${normalizedAddress.slice(-4)}`,
        })
        .returning()

      user = newUser
    } else {
      // Update existing user
      if (role) {
        await db
          .update(users)
          .set({
            role,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user[0].id))
      }
    }

    return NextResponse.json({
      success: true,
      user: user[0],
    })
  } catch (error) {
    console.error('[v0] Profile sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, address.toLowerCase()))
      .limit(1)

    if (user.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json(user[0])
  } catch (error) {
    console.error('[v0] Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
