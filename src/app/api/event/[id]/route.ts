import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

// PUT update event
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, description, date, time, location, type } = await request.json()

    const event = await prisma.event.update({
      where: { id: Number.parseInt(id) },
      data: {
        title,
        description: description || null,
        eventDate: new Date(date),
        eventTime: time,
        location: location || null,
        eventType: type || "Service",
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error updating event:", error)
    
    if (error instanceof Error) {
      if ("code" in error && error.code === "P2025") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE event
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.event.delete({
      where: { id: Number.parseInt(id) },
    })

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)

    if (error instanceof Error) {
      if ("code" in error && error.code === "P2025") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}