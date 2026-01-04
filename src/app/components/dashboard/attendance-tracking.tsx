"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, TrendingUp, Download } from "lucide-react"

interface AttendanceApiRecord {
  id: number
  date: string
  eventType: string
  attendees?: string[]
  totalAttendance?: number
}

interface Member {
  id: number
  name: string
}

export default function AttendanceTracking() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceApiRecord[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEvent, setSelectedEvent] = useState("Sunday Service")
  const [checkedMemberIds, setCheckedMemberIds] = useState<number[]>([])

  const eventTypes = ["Sunday Service", "Bible Study", "Youth Fellowship", "Prayer Meeting"]

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        await Promise.all([fetchAttendance(), fetchMembers()])
      } catch {
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const fetchAttendance = async () => {
    try {
      const response = await fetch("/api/attendance")
      if (!response.ok) throw new Error("Failed to fetch attendance")
      const data: AttendanceApiRecord[] = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error("Error fetching attendance:", error)
      throw error
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members")
      if (!response.ok) throw new Error("Failed to fetch members")
      const data: Member[] = await response.json()
      setMembers(data)
    } catch (error) {
      console.error("Error fetching members:", error)
      throw error
    }
  }

  const handleMemberCheck = (id: number) => {
    setCheckedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    )
  }

  const recordAttendance = async () => {
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          eventType: selectedEvent,
          memberIds: checkedMemberIds,
        }),
      })

      if (response.ok) {
        await fetchAttendance()
        setCheckedMemberIds([])
        alert("Attendance recorded successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to record attendance")
      }
    } catch (error) {
      console.error("Error recording attendance:", error)
      alert("Failed to record attendance")
    }
  }

  const generateReport = () => {
    const csvContent = [
      ["Date", "Event Type", "Total Attendance", "Attendees"],
      ...attendanceRecords.map((record) => [
        record.date,
        record.eventType,
        (record.totalAttendance ?? 0).toString(),
        (record.attendees?.join("; ") ?? ""),
      ]),
    ]
      .map((row) => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "attendance-report.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Compute stats dynamically
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday as start

  const weeklyRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate >= startOfWeek && recordDate <= today
  })

  const weeklyTotal = weeklyRecords.reduce((sum, r) => sum + (r.totalAttendance || 0), 0)
  const weeklyCount = weeklyRecords.length
  const averageAttendance = weeklyCount > 0 ? Math.round(weeklyTotal / weeklyCount) : 0
  const eventsThisMonth = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date)
    return (
      recordDate.getFullYear() === today.getFullYear() &&
      recordDate.getMonth() === today.getMonth()
    )
  }).length

  if (loading) return <div className="p-6">Loading attendance data...</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendance Tracking</h2>
          <p className="text-gray-600">Track service and event attendance</p>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-3xl font-bold text-gray-900">{weeklyTotal}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average</p>
              <p className="text-3xl font-bold text-gray-900">{averageAttendance}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events This Month</p>
              <p className="text-3xl font-bold text-gray-900">{eventsThisMonth}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Record New Attendance */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            >
              {eventTypes.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 mb-3">Check-in Members</h4>
          {members.length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={checkedMemberIds.includes(member.id)}
                    onChange={() => handleMemberCheck(member.id)}
                    className="h-4 w-4 text-blue-800 focus:ring-blue-800 border-gray-300 rounded"
                  />
                  <span className="text-gray-900">{member.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={recordAttendance}
          disabled={checkedMemberIds.length === 0}
          className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Record Attendance ({checkedMemberIds.length} members)
        </button>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
        </div>
        {attendanceRecords.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">No attendance records yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendees
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {record.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {record.totalAttendance ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      {record.attendees && record.attendees.length > 0 ? (
                        <>
                          <div className="text-sm text-gray-900">
                            {record.attendees.slice(0, 3).join(", ")}
                          </div>
                          {record.attendees.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{record.attendees.length - 3} more
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}