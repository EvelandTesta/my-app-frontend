"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react"

interface Event {
  id: number
  title: string
  description: string
  eventDate: string
  eventTime: string
  location: string 
  eventType: string
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    type: "Service",
  })

  const eventTypes = ["Service", "Event", "Meeting", "Study", "Outreach"]

  useEffect(() => {
    fetchEvents()
  }, [])

    const fetchEvents = async () => {
    try {
      const response = await fetch("/api/event")
      if (response.ok) {
        const data: Event[] = await response.json() 
        setEvents(
          data.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description || "",
            eventDate: event.eventDate.split("T")[0], 
            eventTime: event.eventTime,
            location: event.location || "",
            eventType: event.eventType,
          }))
        )
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []


    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }


    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventsForDate = (day: number | null) => {
    if (!day) return []
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.eventDate === dateStr)
  }

  const handleAddEvent = async () => {
    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          type: formData.type,
        }),
      })

      if (response.ok) {
        await fetchEvents()
        setFormData({ title: "", description: "", date: "", time: "", location: "", type: "Service" })
        setShowEventForm(false)
        alert("Event added successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add event")
      }
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event")
    }
  }

  const handleEditEvent = async () => {
    if (selectedEvent) {
      try {
        const response = await fetch(`/api/event/${selectedEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            type: formData.type,
          }),
        })

        if (response.ok) {
          await fetchEvents()
          setSelectedEvent(null)
          setFormData({ title: "", description: "", date: "", time: "", location: "", type: "Service" })
          setShowEventForm(false)
          alert("Event updated successfully!")
        } else {
          const error = await response.json()
          alert(error.error || "Failed to update event")
        }
      } catch (error) {
        console.error("Error updating event:", error)
        alert("Failed to update event")
      }
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/event/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchEvents()
          alert("Event deleted successfully!")
        } else {
          const error = await response.json()
          alert(error.error || "Failed to delete event")
        }
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event")
      }
    }
  }

  const startEdit = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.eventDate,
      time: event.eventTime,
      location: event.location,
      type: event.eventType,
    })
    setShowEventForm(true)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Church Calendar</h2>
          <p className="text-gray-600">Manage events and services</p>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="px-4 py-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {getDaysInMonth(currentDate).map((day, index) => {
            const dayEvents = getEventsForDate(day)
            return (
              <div key={index} className="min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0">
                {day && (
                  <>
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                          onClick={() => startEdit(event)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="truncate">{event.eventTime}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {events
              .filter((event) => new Date(event.eventDate) >= new Date())
              .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      {event.eventDate} at {event.eventTime} - {event.location}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(event)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{selectedEvent ? "Edit Event" : "Add New Event"}</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                rows={3}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={selectedEvent ? handleEditEvent : handleAddEvent}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedEvent ? "Update" : "Add"} Event
              </button>
              <button
                onClick={() => {
                  setShowEventForm(false)
                  setSelectedEvent(null)
                  setFormData({ title: "", description: "", date: "", time: "", location: "", type: "Service" })
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
