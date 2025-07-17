import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

// GET all members
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Menggunakan Prisma ORM
    const members = await prisma.member.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        email: true,
        phone: true,
        role: true,
        address: true,
        joinDate: true,
        createdAt: true,
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST new member
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      name,
      age,
      gender,
      email,
      phone,
      role,
      address,
    }: {
      name?: string
      age?: number | null
      gender?: string | null
      email?: string
      phone?: string | null
      role?: string
      address?: string | null
    } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Menggunakan Prisma ORM
    const newMember = await prisma.member.create({
      data: {
        name,
        age: age || null,
        gender: gender || null,
        email,
        phone: phone || null,
        role: role || "Member",
        address: address || null,
      },
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}