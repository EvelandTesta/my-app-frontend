"use client"

import { useState, useEffect } from "react"
import Navigation from "./components/navigation"
import Hero from "./components/hero"
import About from "./components/about"
import Events from "./components/events"
import Contact from "./components/contact"
import Footer from "./components/footer"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll to show navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Navigation items
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "events", label: "Events" },
    { id: "ministries", label: "Ministries" },
    { id: "contact", label: "Contact" },
    { id: "login", label: "Login"}
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation
        navItems={navItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        scrolled={scrolled}
      />
      <Hero setActiveSection={setActiveSection} />
      <About setActiveSection={setActiveSection} />
      <Events setActiveSection={setActiveSection} />
      <Contact />
      <Footer navItems={navItems} setActiveSection={setActiveSection} />
    </div>
  )
}
