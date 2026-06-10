import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '10')
    const walletAddress = request.headers.get('x-wallet-address')

    // Get collaborations with creator info
    const collaborations = await sql`
      SELECT 
        c.*,
        u.display_name as creator_name,
        u.avatar_url as creator_avatar
      FROM collaborations c
      LEFT JOIN users u ON c.created_by = u.id
      WHERE c.status = ${status}
      ORDER BY c.created_at DESC
      LIMIT ${limit}
    `

    // Mark user's own collaborations if wallet provided
    if (walletAddress) {
      const users = await sql`
        SELECT id FROM users WHERE wallet_address = ${walletAddress}
      `
      
      if (users.length > 0) {
        const userId = users[0].id
        return NextResponse.json({
          collaborations: collaborations.map(c => ({
            ...c,
            isOwner: c.created_by === userId
          }))
        })
      }
    }

    return NextResponse.json({ collaborations })
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    return NextResponse.json({ error: 'Failed to fetch collaborations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 401 })
    }

    const body = await request.json()
    const { projectName, description, category, tags } = body

    // Get user
    const users = await sql`
      SELECT id FROM users WHERE wallet_address = ${walletAddress}
    `
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users[0].id

    // Create collaboration
    const result = await sql`
      INSERT INTO collaborations (project_name, description, category, tags, created_by, participants)
      VALUES (${projectName}, ${description}, ${category}, ${JSON.stringify(tags || [])}, ${userId}, ${JSON.stringify([userId])})
      RETURNING *
    `

    return NextResponse.json({ success: true, collaboration: result[0] })
  } catch (error) {
    console.error('Error creating collaboration:', error)
    return NextResponse.json({ error: 'Failed to create collaboration' }, { status: 500 })
  }
}
