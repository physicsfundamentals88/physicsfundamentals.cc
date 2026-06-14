import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    // Check if user already registered
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.username, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }

    const name = body.name?.trim() || email.split("@")[0] || "Subscriber";
    const password = body.password || "earlyaccess123";
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    // Insert user
    await db.insert(users).values({
      username: email,
      name: name,
      password: hashedPassword,
      role: "editor", // default role so they appear in dashboard
    });

    return NextResponse.json({ success: true, message: "Thank you for joining the early access list!" });
  } catch (error: any) {
    console.error("Early Access Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

