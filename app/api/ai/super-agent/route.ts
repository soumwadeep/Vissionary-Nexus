import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiActivity } from "@/db/schema";
import { orchestrateAI } from "@/lib/ai/orchestrator";

export async function POST(request: NextRequest) {
  console.log("SUPER_AGENT_ROUTE_START");
  try {
    const session = await getServerSession(authOptions);
    console.log("SESSION_USER_ID", session?.user?.id);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestData = await request.json();
    const userQuery = requestData.query || "";
    const goalIdToResume = requestData.goalIdToResume;
    const userId = session.user.id;

    // Track super agent request using Drizzle
    try {
      await db.insert(aiActivity).values({
        userId,
        type: 'ai_request',
        description: 'Super agent request',
        inputData: {
          query: userQuery,
          userId,
          goalIdToResume,
        },
        model: 'meta/llama-3.3-70b-instruct'
      });
    } catch (e) {
      console.error("Failed to track super agent request:", e);
    }

    // Run orchestrator with userId and query
    console.log("CALLING_ORCHESTRATOR");
    const result = await orchestrateAI(userId, userQuery, goalIdToResume);
    console.log("ORCHESTRATOR_SUCCESS");

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("SUPER_AGENT_ROUTE_ERROR", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
