"use client"

import { useState } from "react"
import { Church } from "lucide-react"

interface NavItem {
  id: string
  label: string
}

interface NavigationProps {
  navItems: NavItem[]
  activeSection: string
  setActiveSection: (section: string) => void
  scrolled: boolean
}

export default function Navigation({ navItems, activeSection, setActiveSection, scrolled }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeSection !== "home" ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Church className="h-8 w-8 text-blue-800" />
          <span className="text-2xl font-bold text-blue-800">GKBJ REGENCY</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`${item.id}`}
                className={`font-medium hover:text-blue-600 transition-colors duration-300 ${
                  activeSection === item.id ? "text-blue-800 border-b-2 border-blue-800" : "text-gray-600"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-blue-800 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2 pb-4 px-4">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`${item.id}`}
                  className={`block font-medium ${
                    activeSection === item.id ? "text-blue-800 font-semibold" : "text-gray-600"
                  }`}
                  onClick={() => {
                    setActiveSection(item.id)
                    setIsMenuOpen(false)
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
