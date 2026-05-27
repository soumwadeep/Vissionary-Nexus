import { db } from "@/lib/db";
import { users, nftAchievements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, achievementType, points } = body;

    if (!address || !achievementType) {
      return NextResponse.json(
        { error: "Address and achievementType are required" },
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

    // Record achievement
    const achievement = await db
      .insert(nftAchievements)
      .values({
        id: uuidv4(),
        ownerId: userId,
        title: achievementType,
        description: `Achievement: ${achievementType}`,
        rarity: "common",
        earnedAt: new Date(),
      })
      .returning();

    // Update user reputation
    const newReputation = (user[0].reputation || 0) + (points || 10);

    await db
      .update(users)
      .set({
        reputation: newReputation,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      achievement: achievement[0],
      reputation: newReputation,
    });
  } catch (error) {
    console.error("Achievement error:", error);
    return NextResponse.json(
      { error: "Failed to record achievement" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    // Find user by wallet
    const user = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, address.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch user achievements
    const userAchievements = await db
      .select()
      .from(nftAchievements)
      .where(eq(nftAchievements.ownerId, user[0].id));

    return NextResponse.json(userAchievements);
  } catch (error) {
    console.error("Achievement fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 },
    );
  }
}
