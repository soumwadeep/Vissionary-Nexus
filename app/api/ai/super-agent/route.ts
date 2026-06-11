import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiActivity } from "@/db/schema";
import { orchestrateAI } from "@/lib/ai/orchestrator";
import { elapsedMs } from "@/lib/ai/performance";

export async function POST(request: NextRequest) {
  const totalStartedAt = performance.now();
  let sessionMs = 0;
  let dbInsertMs = 0;
  let nvidiaMs = 0;
  console.log("SUPER_AGENT_ROUTE_START");
  try {
    const sessionStartedAt = performance.now();
    const session = await getServerSession(authOptions);
    sessionMs = elapsedMs(sessionStartedAt);
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
      const dbStartedAt = performance.now();
      await db.insert(aiActivity).values({
        userId,
        type: 'ai_request',
        description: 'Super agent request',
        inputData: {
          query: userQuery,
          userId,
          goalIdToResume,
        },
        model: process.env.NVIDIA_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b'
      });
      dbInsertMs = elapsedMs(dbStartedAt);
    } catch (e) {
      console.error("Failed to track super agent request:", e);
    }

    // Run orchestrator with userId and query
    console.log("CALLING_ORCHESTRATOR");
    const result = await orchestrateAI(userId, userQuery, goalIdToResume);
    nvidiaMs = result.performance?.nvidiaMs || 0;
    const { performance: _performance, ...responseResult } = result;
    console.log(
      `[Nexus Agent Latency] Session: ${sessionMs}ms | DB Insert: ${dbInsertMs}ms | ` +
      `NVIDIA: ${nvidiaMs}ms | Total: ${elapsedMs(totalStartedAt)}ms`
    );
    console.log("ORCHESTRATOR_SUCCESS");

    return NextResponse.json({
      success: true,
      data: responseResult,
    });
  } catch (error) {
    console.error("SUPER_AGENT_ROUTE_ERROR", error);
    console.log(
      `[Nexus Agent Latency] Session: ${sessionMs}ms | DB Insert: ${dbInsertMs}ms | ` +
      `NVIDIA: ${nvidiaMs}ms | Total: ${elapsedMs(totalStartedAt)}ms | Failed`
    );
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 })
  }
}
