"use client"
import EventCard from "./event-card"

interface EventsProps {
  setActiveSection: (section: string) => void
}

export interface Event {
  title: string
  description: string
  image: string
  date: string
  time: string
}

export default function Events({ setActiveSection }: EventsProps) {
  const events: Event[] = [
    {
      title: "Sunday Worship Service",
      description: "Join us for our weekly worship service with inspiring messages and uplifting music.",
      image: "https://picsum.photos/id/1026/600/400",
      date: "Every Sunday",
      time: "10:00 AM",
    },
    {
      title: "Youth Fellowship",
      description: "A vibrant community for young people to grow in faith and friendship.",
      image: "https://picsum.photos/id/1027/600/400",
      date: "Every Friday",
      time: "7:00 PM",
    },
    {
      title: "Bible Study Group",
      description: "Deep dive into God's word with our weekly Bible study sessions.",
      image: "https://picsum.photos/id/1028/600/400",
      date: "Every Wednesday",
      time: "7:30 PM",
    },
    {
      title: "Community Outreach",
      description: "Serving our local community through various charitable activities.",
      image: "https://picsum.photos/id/1029/600/400",
      date: "Monthly",
      time: "9:00 AM",
    },
    {
      title: "Prayer Meeting",
      description: "Come together in prayer for our church, community, and world.",
      image: "https://picsum.photos/id/1030/600/400",
      date: "Every Tuesday",
      time: "6:30 PM",
    },
    {
      title: "Children's Ministry",
      description: "Fun and engaging programs designed to teach children about God's love.",
      image: "https://picsum.photos/id/1031/600/400",
      date: "Every Sunday",
      time: "10:00 AM",
    },
  ]

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-blue-800">Church Events</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for our regular services and special events as we worship, learn, and grow together in faith.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} event={event} setActiveSection={setActiveSection} />
          ))}
        </div>
      </div>
    </section>
  )
}
