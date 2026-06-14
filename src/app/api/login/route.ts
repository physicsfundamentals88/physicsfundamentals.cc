import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json({ error: "Email/Username and Password are required" }, { status: 400 });
    }

    // Try finding the user by username (email)
    const userList = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({ error: "Invalid credentials. Please try again." }, { status: 401 });
    }

    const userObj = userList[0];
    const hashedInputPassword = crypto.createHash("sha256").update(password).digest("hex");

    if (userObj.password !== hashedInputPassword) {
      return NextResponse.json({ error: "Invalid credentials. Please try again." }, { status: 401 });
    }

    // Successful login
    return NextResponse.json({
      success: true,
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.username,
        role: userObj.role, // "admin" or "editor"
      }
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
