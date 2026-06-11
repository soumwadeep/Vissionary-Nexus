import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { userId, recommendation } = await request.json()
    
    if (userId) {
      try {
        await sql`
          INSERT INTO ai_activity (user_id, type, description, input_data, model)
          VALUES (${userId}, 'ai_recommendation_clicked', 'AI recommendation clicked', ${JSON.stringify({ recommendation })}, ${process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'})
        `
      } catch (e) {
        console.error('Failed to track ai_recommendation_clicked:', e)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recommendations track API error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
