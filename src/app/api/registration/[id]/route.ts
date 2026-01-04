import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"


function isPrismaError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error
}


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = verifyToken(token || "")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    const registrationId = parseInt(id)

    // Update registrasi
    const registration = await prisma.registrationRequest.update({
      where: { id: registrationId },
      data: {
        status,
        processedAt: new Date(),
        processedById: user.id,
      },
    })


    if (status === "approved") {
      await prisma.member.upsert({
        where: { email: registration.email },
        update: {
          name: registration.name,
          age: registration.age,
          gender: registration.gender,
          phone: registration.phone,
          address: registration.address,
        },
        create: {
          name: registration.name,
          age: registration.age,
          gender: registration.gender,
          email: registration.email,
          phone: registration.phone,
          address: registration.address,
          role: "Member",
        },
      })
    }

    return NextResponse.json(registration)
  } catch (error) {
    console.error("Error updating registration:", error)

    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Registration not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE registration
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const registrationId = parseInt(id)


    await prisma.registrationRequest.delete({
      where: { id: registrationId },
    })

    return NextResponse.json({ message: "Registration deleted successfully" })
  } catch (error) {
    console.error("Error deleting registration:", error)

    if (isPrismaError(error)) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Registration not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}