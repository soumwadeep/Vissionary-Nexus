import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, moderationActions } from '@/db/schema'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { eq } from 'drizzle-orm'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, params.id))
      .limit(1)

    if (submission.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const moderationHistory = await db
      .select()
      .from(moderationActions)
      .where(eq(moderationActions.submissionId, params.id))

    return NextResponse.json({ submission: submission[0], moderationHistory })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json({ error: 'Failed to fetch submission' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: RouteParams) {
  try {
    const params = await props.params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, reason, score } = body

    const submission = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, params.id))
      .limit(1)

    if (submission.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Update submission status
    let newStatus = submission[0].status
    if (action === 'approve') {
      newStatus = 'approved'
    } else if (action === 'reject') {
      newStatus = 'rejected'
    }

    await db
      .update(submissions)
      .set({
        status: newStatus,
        score,
        rejectionReason: action === 'reject' ? reason : null,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, params.id))

    // Record moderation action
    await db.insert(moderationActions).values({
      submissionId: params.id,
      moderatorId: session.user.id,
      action,
      reason,
      details: { score },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}
