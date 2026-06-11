import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, tasks as tasksTable, aiActivity } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return session.user.id
  }
  return null
}

export async function GET() {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.userId, userId))
      .orderBy(desc(tasksTable.createdAt))

    // Organize tasks by status
    const organizedTasks = {
      pending: userTasks.filter(t => t.status === 'pending'),
      inProgress: userTasks.filter(t => t.status === 'inProgress'),
      completed: userTasks.filter(t => t.status === 'completed')
    }

    return NextResponse.json({ tasks: organizedTasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log("🔵 [API] /api/tasks POST received")
  try {
    console.log("🔍 [API] Getting user ID...")
    const userId = await getUserId()
    console.log("🔍 [API] User ID retrieved:", userId)

    if (!userId) {
      console.error("❌ [API] Unauthorized - no user ID found!")
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log("🔍 [API] Parsing request body...")
    const body = await request.json()
    const { tasks: newTasks, action } = body
    console.log("🔍 [API] Request body:", { action, tasksCount: newTasks?.length })

    if (action === 'save') {
      console.log("🔍 [API] Saving tasks...")
      const savedTasks = []

      for (const task of newTasks) {
        console.log("🔍 [API] Saving task:", task)
        const taskId = uuidv4()
        const insertValues = {
          id: taskId,
          userId: userId,
          title: task.title,
          description: task.description,
          priority: task.priority || 'medium',
          category: task.category || 'Development',
          estimatedTime: task.estimatedTime || '1 Hour',
          aiSuggested: task.aiSuggested !== false,
          status: 'pending'
        }
        console.log("🔍 [API] Insert values:", insertValues)

        try {
          const inserted = await db
            .insert(tasksTable)
            .values(insertValues)
            .returning()

          console.log("✅ [API] Task saved to DB:", inserted[0])
          savedTasks.push(inserted[0])
        } catch (insertError) {
          console.error("❌ [API] Insert task failed:", insertError)
          throw insertError
        }
      }

      // Track ai_task_saved event
      try {
        await db
          .insert(aiActivity)
          .values({
            id: uuidv4(),
            userId: userId,
            type: 'ai_task_saved',
            description: `Saved ${savedTasks.length} AI suggested tasks`,
            inputData: { count: savedTasks.length },
            model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'
          })
      } catch (e) {
        console.error('Failed to track ai_task_saved:', e)
      }

      console.log("✅ [API] All tasks saved, returning success:", savedTasks)
      return NextResponse.json({ success: true, tasks: savedTasks })
    }

  } catch (error) {
    console.error(
      '❌ [API] Error saving tasks:',
      JSON.stringify(error, null, 2)
    )

    return NextResponse.json(
      {
        error: 'Failed to save tasks',
        fullError:
          error instanceof Error
            ? error.stack
            : JSON.stringify(error, null, 2)
      },
      { status: 500 }
    )
  }
}
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, status, action } = body

    if (action === 'move') {
      await db
        .update(tasksTable)
        .set({
          status: status,
          updatedAt: new Date()
        })
        .where(eq(tasksTable.id, taskId))

      // If moving to completed, track ai_task_completed
      if (status === 'completed') {
        try {
          await db
            .insert(aiActivity)
            .values({
              id: uuidv4(),
              userId: userId,
              type: 'ai_task_completed',
              description: 'Task marked as completed',
              inputData: { taskId },
              model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'
            })
        } catch (e) {
          console.error('Failed to track ai_task_completed:', e)
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
