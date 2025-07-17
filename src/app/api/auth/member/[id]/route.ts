import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

// Utility type guard untuk error Prisma
function isPrismaError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error
}

// PUT update member
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    const updatedMember = await prisma.member.update({
      where: {
        id: parseInt(id),
      },
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

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating member:", error)

    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Member not found" }, { status: 404 })
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE member
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.member.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ message: "Member deleted successfully" })
  } catch (error) {
    console.error("Error deleting member:", error)

    if (isPrismaError(error) && error.code === "P2025") {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}