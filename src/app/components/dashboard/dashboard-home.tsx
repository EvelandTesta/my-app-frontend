"use client"

import { Users, Calendar, TrendingUp, Heart } from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardHome() {
  const stats = [
    { label: "Total Members", value: "248", icon: Users, color: "bg-blue-500" },
    { label: "This Week's Attendance", value: "186", icon: TrendingUp, color: "bg-green-500" },
    { label: "Upcoming Events", value: "5", icon: Calendar, color: "bg-purple-500" },
    { label: "New Registrations", value: "12", icon: Heart, color: "bg-pink-500" },
  ]

  // Add state and useEffect for quote:
  const [todayQuote, setTodayQuote] = useState("")

  useEffect(() => {
    fetchQuote()
  }, [])

  const fetchQuote = async () => {
    try {
      const response = await fetch("/api/quotes")
      if (response.ok) {
        const data = await response.json()
        setTodayQuote(`${data.quote_text} - ${data.scripture_reference}`)
      }
    } catch (error) {
      console.error("Error fetching quote:", error)
      setTodayQuote(
        "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future. - Jeremiah 29:11",
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening at GKBJ Regency.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quote of the Day */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h3 className="text-xl font-bold mb-4">Quote of the Day</h3>
        <blockquote className="text-lg italic leading-relaxed">{todayQuote}</blockquote>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {[
              { name: "Sarah Johnson", date: "2 hours ago" },
              { name: "Michael Chen", date: "1 day ago" },
              { name: "Emily Davis", date: "2 days ago" },
            ].map((registration, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-900">{registration.name}</span>
                <span className="text-sm text-gray-500">{registration.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {[
              { event: "Sunday Worship", date: "Tomorrow 10:00 AM" },
              { event: "Youth Fellowship", date: "Friday 7:00 PM" },
              { event: "Bible Study", date: "Wednesday 7:30 PM" },
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-900">{event.event}</span>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
