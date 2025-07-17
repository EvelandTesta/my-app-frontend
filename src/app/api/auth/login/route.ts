import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/auth"

const bcrypt = require('bcrypt')
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role })

    return NextResponse.json({ token, user: { id: user.id, name: user.name, role: user.role } })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}