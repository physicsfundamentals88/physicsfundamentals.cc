import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import crypto from "crypto";

// GET all users
export async function GET() {
  try {
    const db = getDb();
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return NextResponse.json(allUsers);
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new user
export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();

    if (!body.username || !body.name) {
      return NextResponse.json({ error: "Username and Name are required" }, { status: 400 });
    }

    const rawPassword = body.password || "password123";
    const hashedPassword = crypto.createHash("sha256").update(rawPassword).digest("hex");

    const newUser = await db.insert(users).values({
      username: body.username,
      name: body.name,
      password: hashedPassword,
      role: body.role || "editor",
    }).returning();

    return NextResponse.json(newUser[0]);
  } catch (error: any) {
    console.error("Save User Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

