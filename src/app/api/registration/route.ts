import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// GET registration requests
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const registrations = await sql`
      SELECT id, name, email, phone, age, gender, address, ministry_interest, 
             hear_about, status, submitted_at
      FROM registration_requests
      ORDER BY submitted_at DESC
    `

    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST new registration
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, age, gender, address, ministry, hearAbout } = await request.json()

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO registration_requests 
      (name, email, phone, age, gender, address, ministry_interest, hear_about)
      VALUES (${name}, ${email}, ${phone}, ${age || null}, ${gender || null}, 
              ${address || null}, ${ministry || null}, ${hearAbout || null})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
