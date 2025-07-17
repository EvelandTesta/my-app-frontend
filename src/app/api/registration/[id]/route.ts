import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

// PUT update registration status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = verifyToken(token || "")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    const result = await sql`
      UPDATE registration_requests 
      SET status = ${status}, processed_at = CURRENT_TIMESTAMP, processed_by = ${user.id}
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // If approved, create member record
    if (status === "approved") {
      const registration = result[0]
      await sql`
        INSERT INTO members (name, age, gender, email, phone, address, role)
        VALUES (${registration.name}, ${registration.age}, ${registration.gender}, 
                ${registration.email}, ${registration.phone}, ${registration.address}, 'Member')
        ON CONFLICT (email) DO NOTHING
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE registration
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const result = await sql`
      DELETE FROM registration_requests WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Registration deleted successfully" })
  } catch (error) {
    console.error("Error deleting registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
