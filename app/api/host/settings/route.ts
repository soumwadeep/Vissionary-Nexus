import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hostSettings } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await db
      .select()
      .from(hostSettings)
      .where(eq(hostSettings.userId, session.user.id))
      .limit(1)

    if (settings.length === 0) {
      return NextResponse.json({
        organizationName: '',
        organizationDescription: '',
        emailNotifications: true,
        pushNotifications: true,
        weeklyDigest: false,
        twoFactorEnabled: false,
      })
    }

    return NextResponse.json(settings[0])
  } catch (error) {
    console.error('Error fetching host settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { organizationName, organizationDescription, emailNotifications, pushNotifications, weeklyDigest, twoFactorEnabled } = body

    const existingSettings = await db
      .select()
      .from(hostSettings)
      .where(eq(hostSettings.userId, session.user.id))
      .limit(1)

    if (existingSettings.length === 0) {
      await db.insert(hostSettings).values({
        userId: session.user.id,
        organizationName,
        organizationDescription,
        emailNotifications,
        pushNotifications,
        weeklyDigest,
        twoFactorEnabled,
      })
    } else {
      await db
        .update(hostSettings)
        .set({
          organizationName,
          organizationDescription,
          emailNotifications,
          pushNotifications,
          weeklyDigest,
          twoFactorEnabled,
          updatedAt: new Date(),
        })
        .where(eq(hostSettings.userId, session.user.id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating host settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
