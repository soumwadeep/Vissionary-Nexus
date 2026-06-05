import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcryptjs from 'bcryptjs'

/**
 * Seed a test user for development
 * POST /api/auth/seed-user
 */
export async function POST(request: NextRequest) {
  try {
    const email = 'shreshthadas01@gmail.com'
    const password = '@madmax12@12'
    const name = 'Shreshtha Das'

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create test user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        emailVerified: true,
        role: 'member',
      })
      .returning()

    return NextResponse.json(
      {
        message: 'Test user created successfully',
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          name: newUser[0].name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Seed user error:', error)
    return NextResponse.json(
      { message: 'Failed to create seed user', error: String(error) },
      { status: 500 }
    )
  }
}
