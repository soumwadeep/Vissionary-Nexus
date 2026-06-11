import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { aiRouter } from '@/lib/ai/router'
import { db } from '@/lib/db'
import { aiActivity } from '@/db/schema'
import { elapsedMs } from '@/lib/ai/performance'

export async function POST(request: NextRequest) {
  const totalStartedAt = performance.now()
  let sessionMs = 0
  let dbInsertMs = 0
  let nvidiaMs = 0

  try {
    const sessionStartedAt = performance.now()
    const session = await getServerSession(authOptions)
    sessionMs = elapsedMs(sessionStartedAt)
    const requestData = await request.json()
    const messages = requestData.messages || []
    const userProfile = requestData.userProfile
    const userId = session?.user?.id || requestData.userId
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || ''
    
    let trackingPromise: Promise<void> = Promise.resolve()
    if (userId) {
      trackingPromise = (async () => {
        const dbStartedAt = performance.now()
        try {
          await db.insert(aiActivity).values({
            userId,
            type: 'ai_request',
            description: 'AI mentor request',
            inputData: { userProfile, lastUserMessage },
            model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'
          })
        } catch (error) {
          console.error('Failed to track AI request:', error)
        } finally {
          dbInsertMs = elapsedMs(dbStartedAt)
        }
      })()
    }
    
    // Fast single call via AI Router
    const result = await aiRouter({
      feature: 'mentor',
      userData: { userId: userId || undefined, userData: { userProfile } },
      input: lastUserMessage,
      messages: messages
    })
    nvidiaMs = result.metrics?.nvidiaMs || 0
    await trackingPromise

    console.log(
      `[AI Mentor Latency] Session: ${sessionMs}ms | DB Insert: ${dbInsertMs}ms | ` +
      `NVIDIA: ${nvidiaMs}ms | Total: ${elapsedMs(totalStartedAt)}ms`
    )
    
    return NextResponse.json({
      message: result.data,
      isFallback: result.usedFallback
    })
    
  } catch (error) {
    console.error('AI Mentor API error:', error)
    console.log(
      `[AI Mentor Latency] Session: ${sessionMs}ms | DB Insert: ${dbInsertMs}ms | ` +
      `NVIDIA: ${nvidiaMs}ms | Total: ${elapsedMs(totalStartedAt)}ms | Failed`
    )
    return NextResponse.json({
      message: "I'm having a bit of trouble connecting right now. How else can I help you?",
      isFallback: true
    })
  }
}
