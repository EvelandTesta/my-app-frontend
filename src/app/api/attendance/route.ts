import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth"

// GET attendance records
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attendance = await prisma.attendance.groupBy({
      by: ["attendedDate", "eventType"],
      _count: {
        memberId: true,
      },
      orderBy: {
        attendedDate: "desc",
      },
    })

    // Get attendee names for each attendance record
    const attendanceWithNames = await Promise.all(
      attendance.map(async (record) => {
        const attendees = await prisma.attendance.findMany({
          where: {
            attendedDate: record.attendedDate,
            eventType: record.eventType,
          },
          include: {
            member: {
              select: { name: true },
            },
          },
        })

        return {
          id: `${record.attendedDate.toISOString()}-${record.eventType}`,
          date: record.attendedDate.toISOString().split("T")[0],
          eventType: record.eventType,
          totalAttendance: record._count.memberId,
          attendees: attendees.map((a) => a.member.name),
        }
      }),
    )

    return NextResponse.json(attendanceWithNames)
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST new attendance record
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    const user = verifyToken(token || "")
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date, eventType, memberIds } = await request.json()

    if (!date || !eventType || !memberIds || memberIds.length === 0) {
      return NextResponse.json({ error: "Date, event type, and member IDs are required" }, { status: 400 })
    }

    // Create event first
    const event = await prisma.event.create({
      data: {
        title: eventType,
        eventDate: new Date(date),
        eventTime: "10:00",
        eventType: eventType,
        createdById: user.id,
      },
    })

    // Create attendance records
    const attendanceRecords = await prisma.attendance.createMany({
      data: memberIds.map((memberId: number) => ({
        eventId: event.id,
        memberId: memberId,
        attendedDate: new Date(date),
        eventType: eventType,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json(
      {
        message: "Attendance recorded successfully",
        eventId: event.id,
        attendeeCount: attendanceRecords.count,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error recording attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
