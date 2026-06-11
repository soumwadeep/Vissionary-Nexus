import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { aiRouter } from '@/lib/ai/router'

const sql = neon(process.env.DATABASE_URL!)

// Helper to get action metadata
function getActionMetadata(category: string): any {
  switch (category) {
    case "Profile":
      return {
        actionType: "navigate",
        actionLabel: "Complete Profile",
        actionUrl: "/dashboard/participant/profile"
      }
    case "Blockchain":
      return {
        actionType: "navigate",
        actionLabel: "Connect Wallet",
        actionUrl: "/dashboard/participant"
      }
    case "Events":
      return {
        actionType: "navigate",
        actionLabel: "Browse Events",
        actionUrl: "/dashboard/participant/events"
      }
    case "Team":
      return {
        actionType: "navigate",
        actionLabel: "Find Teammates",
        actionUrl: "/dashboard/participant/team-match"
      }
    case "Tasks":
      return {
        actionType: "navigate",
        actionLabel: "View Tasks",
        actionUrl: "/dashboard/participant/tasks"
      }
    case "Learning":
      return {
        actionType: "navigate",
        actionLabel: "Learn More",
        actionUrl: "/dashboard/participant"
      }
    default:
      return {
        actionType: "navigate",
        actionLabel: "Explore",
        actionUrl: "/dashboard/participant"
      }
  }
}

// Fallback recommendations
function generateFallbackRecommendations(userData: any): any[] {
  const recommendations: any[] = [
    {
      title: "Complete your profile",
      description: "Complete your profile to improve team matching by 45%.",
      priority: "high",
      category: "Profile",
      ...getActionMetadata("Profile")
    },
    {
      title: "Connect Somnia Wallet",
      description: "Unlock blockchain achievements and NFT rewards by connecting your wallet.",
      priority: "high",
      category: "Blockchain",
      ...getActionMetadata("Blockchain")
    },
    {
      title: "Join upcoming events",
      description: "Participate in upcoming hackathons to boost your reputation.",
      priority: "medium",
      category: "Events",
      ...getActionMetadata("Events")
    },
    {
      title: "Find teammates",
      description: "Use the team match feature to find collaborators with complementary skills.",
      priority: "medium",
      category: "Team",
      ...getActionMetadata("Team")
    }
  ]

  // Add data-specific recommendations
  if (!userData?.walletConnected) {
    // Replace the existing blockchain recommendation instead of adding duplicate
    const existingBlockchainIndex = recommendations.findIndex(rec => rec.category === "Blockchain")
    if (existingBlockchainIndex !== -1) {
      recommendations[existingBlockchainIndex] = {
        title: "Connect your wallet",
        description: "Connect your wallet to access blockchain features and NFTs.",
        priority: "high",
        category: "Blockchain",
        ...getActionMetadata("Blockchain")
      }
    }
  }

  return recommendations.slice(0, 4)
}

export async function POST(request: NextRequest) {
  let userData: any = {}
  let userId: string | null = null

  try {
    const requestData = await request.json()
    userData = requestData.userData || {}
    userId = requestData.userId

    // Track AI request
    if (userId) {
      try {
        await sql`
          INSERT INTO ai_activity (user_id, type, description, input_data, model)
          VALUES (${userId}, 'ai_request', 'AI recommendations request', ${JSON.stringify({ userData })}, ${process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'})
        `
      } catch (e) {
        console.error('Failed to track AI request:', e)
      }
    }

    // Use AI Router
    const result = await aiRouter({
      feature: "recommendations",
      userData: {
        userId: userId || undefined,
        userData
      },
      input: JSON.stringify(userData)
    })
    
    // Track error or fallback
    if (!result.success || result.usedFallback) {
      if (userId) {
        try {
          await sql`
            INSERT INTO ai_activity (user_id, type, description, input_data, model)
            VALUES (${userId}, ${result.usedFallback ? 'ai_fallback' : 'ai_error'}, ${result.error || 'AI fallback used'}, ${JSON.stringify({ userData })}, ${process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'})
          `
        } catch (e) {
          console.error('Failed to track AI error/fallback:', e)
        }
      }
    }

    let recommendations: any[]
    if (result.success && result.data) {
      // Add action metadata
      recommendations = result.data.map((rec: any) => ({
        ...rec,
        ...getActionMetadata(rec.category || "Profile")
      }))
    } else {
      recommendations = generateFallbackRecommendations(userData)
    }

    return NextResponse.json({
      recommendations,
      isFallback: result.usedFallback
    })

  } catch (error) {
    console.error('AI Recommendations API error:', error)
    return NextResponse.json({
      recommendations: generateFallbackRecommendations(userData),
      isFallback: true
    })
  }
}
