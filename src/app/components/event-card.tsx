"use client"
import type { Event } from "./events"
import { Calendar, Clock } from "lucide-react"

interface EventCardProps {
  event: Event
  setActiveSection: (section: string) => void
}

export default function EventCard({ event, setActiveSection }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-blue-800">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
        </div>

        <a
          href="contact"
          className="text-blue-800 font-semibold hover:text-blue-600 transition-colors duration-300 inline-flex items-center"
          onClick={() => setActiveSection("contact")}
        >
          Learn More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    </div>
  )
}
