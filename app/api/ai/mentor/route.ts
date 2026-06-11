import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { aiRouter } from '@/lib/ai/router'
import { db } from '@/lib/db'
import { aiActivity } from '@/db/schema'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const requestData = await request.json()
    const messages = requestData.messages || []
    const userProfile = requestData.userProfile
    const userId = session?.user?.id || requestData.userId
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || ''
    
    // Track AI request (Non-blocking in background)
    if (userId) {
      db.insert(aiActivity).values({
        userId,
        type: 'ai_request',
        description: 'AI mentor request',
        inputData: { userProfile, lastUserMessage },
        model: 'nvidia/nemotron-3-ultra-550b-a55b'
      }).catch(e => console.error('Failed to track AI request:', e))
    }
    
    // Fast single call via AI Router
    const result = await aiRouter({
      feature: 'mentor',
      userData: { userId: userId || undefined, userData: { userProfile } },
      input: lastUserMessage,
      messages: messages
    })
    
    return NextResponse.json({
      message: result.data,
      isFallback: result.usedFallback
    })
    
  } catch (error) {
    console.error('AI Mentor API error:', error)
    return NextResponse.json({
      message: "I'm having a bit of trouble connecting right now. How else can I help you?",
      isFallback: true
    })
  }
}
