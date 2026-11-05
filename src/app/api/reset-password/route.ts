import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { hashPassword } from "better-auth/crypto";

let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!cachedClient) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient.db("booknook");
}

/**
 * POST /api/reset-password
 * Resets user password by updating the Better Auth credential account.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { message: "Please provide a new password." },
        { status: 400 }
      );
    }

    // Validate password rules (same as register)
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must contain at least one uppercase letter." },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { message: "Password must contain at least one lowercase letter." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const normalizedEmail = email.toLowerCase().trim();

    // Find the user in Better Auth user collection
    const user = await db.collection("user").findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { message: "No registered account found with this email address." },
        { status: 404 }
      );
    }

    // Hash the password with Better Auth's standard algorithm
    const hashedPassword = await hashPassword(newPassword);

    const userIdStr = user._id instanceof ObjectId ? user._id.toString() : String(user._id || user.id);

    // Update or insert credential account
    await db.collection("account").updateOne(
      {
        $or: [
          { userId: userIdStr, providerId: "credential" },
          { userId: user._id, providerId: "credential" },
          { accountId: normalizedEmail, providerId: "credential" },
        ],
      },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userIdStr,
          accountId: normalizedEmail,
          providerId: "credential",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully! You can now sign in with your new password.",
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

