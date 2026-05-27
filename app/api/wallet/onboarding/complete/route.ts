import { db } from "@/lib/db";
import { users, onboardingStatus } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, role, interests } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 },
      );
    }

    const normalizedAddress = address.toLowerCase();

    // Find user by wallet
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, normalizedAddress))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user[0].id;

    // Check if onboarding status exists
    const existing = await db
      .select()
      .from(onboardingStatus)
      .where(eq(onboardingStatus.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      // Update existing onboarding status
      const updated = await db
        .update(onboardingStatus)
        .set({
          onboardingComplete: true,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(onboardingStatus.userId, userId))
        .returning();

      return NextResponse.json({
        success: true,
        onboarding: updated[0],
      });
    } else {
      // Create new onboarding status
      const newStatus = await db
        .insert(onboardingStatus)
        .values({
          id: uuidv4(),
          userId,
          walletConnected: true,
          roleSelected: !!role,
          profileCompleted: true,
          aiInitialized: true,
          onboardingComplete: true,
          completedAt: new Date(),
        })
        .returning();

      return NextResponse.json({
        success: true,
        onboarding: newStatus[0],
      });
    }
  } catch (error) {
    console.error("Onboarding complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
