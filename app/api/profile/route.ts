import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    console.log('GET /api/profile - Starting...')
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('GET /api/profile - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user and profile data
    const userData = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1)
    const profileData = await db.select().from(profiles).where(eq(profiles.userId, session.user.id)).limit(1)
    console.log('GET /api/profile - userData from DB:', userData[0])
    console.log('GET /api/profile - profileData from DB:', profileData[0])

    if (userData.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Combine user and profile data
    const user = userData[0]
    const profile = profileData[0] || {}

    // Helper function to sanitize values (null -> "")
    const sanitize = (value: any) => value ?? "";
    const sanitizeArray = (value: any) => value ?? [];
    const sanitizeObject = (value: any) => value ?? {};

    const resultData = {
      user: {
        id: user.id,
        name: sanitize(user.name),
        email: user.email,
        avatar: sanitize(user.avatar),
        bio: sanitize(user.bio),
      },
      profile: {
        college: sanitize(profile.college),
        degree: sanitize(profile.degree),
        branch: sanitize(profile.branch),
        year: sanitize(profile.year),
        passoutYear: sanitize(profile.passoutYear),
        dateOfBirth: sanitize(profile.dateOfBirth),
        resume: sanitize(profile.resume),
        portfolio: sanitize(profile.portfolio),
        github: sanitize(profile.github),
        linkedin: sanitize(profile.linkedin),
        twitter: sanitize(profile.twitter),
        skills: sanitizeArray(profile.skills),
        interests: sanitizeArray(profile.interests),
        website: sanitize(profile.website),
        location: sanitize(profile.location),
        socialLinks: sanitizeObject(profile.socialLinks),
        primaryDomain: sanitize(profile.primaryDomain),
        lookingFor: sanitizeArray(profile.lookingFor),
      }
    }
    console.log('GET /api/profile - returning:', resultData)
    return NextResponse.json(resultData)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/profile - Starting')
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.log('PUT /api/profile - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('PUT /api/profile - FULL Request body:', JSON.stringify(body, null, 2))
    const { user: userUpdates, profile: profileUpdates } = body
    console.log('PUT /api/profile - userUpdates:', userUpdates)
    console.log('PUT /api/profile - profileUpdates:', profileUpdates)

    // Update user data if provided
    if (userUpdates) {
      // Sanitize user updates to replace null with undefined
      const sanitizedUser: any = {};
      Object.keys(userUpdates).forEach(key => {
        if (userUpdates[key] !== null) {
          sanitizedUser[key] = userUpdates[key];
        }
      });
      console.log('PUT /api/profile - Sanitized user:', sanitizedUser)
      await db.update(users)
        .set({
          ...sanitizedUser,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id))
    }

    // Check if profile exists
    const existingProfile = await db.select().from(profiles).where(eq(profiles.userId, session.user.id)).limit(1)
    console.log('PUT /api/profile - Existing profile:', existingProfile)

    // Sanitize profile updates to replace null with undefined
    const sanitizedProfile: any = {};
    Object.keys(profileUpdates).forEach(key => {
      if (profileUpdates[key] !== null) {
        sanitizedProfile[key] = profileUpdates[key];
      }
    });
    console.log('PUT /api/profile - Sanitized profile:', sanitizedProfile)

    if (existingProfile.length > 0) {
      // Update existing profile
      console.log('PUT /api/profile - Updating profile:', sanitizedProfile)
      await db.update(profiles)
        .set({
          ...sanitizedProfile,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, session.user.id))
    } else {
      // Create new profile
      console.log('PUT /api/profile - Creating profile:', sanitizedProfile)
      await db.insert(profiles).values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        ...sanitizedProfile,
      })
    }

    console.log('PUT /api/profile - Success')
    return NextResponse.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('PUT /api/profile - Error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
