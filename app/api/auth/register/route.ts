import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcryptjs from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

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

    // Hash password using bcryptjs
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create new user with hashed password
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        role: 'member',
      })
      .returning()

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          name: newUser[0].name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    )
  }
}
