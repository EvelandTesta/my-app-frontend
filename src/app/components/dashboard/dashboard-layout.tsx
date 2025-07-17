"use client"

import type React from "react"

import { Church, Users, Calendar, ClipboardList, UserPlus, Home, LogOut } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const menuItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "members", label: "Members", icon: Users },
    { id: "attendance", label: "Attendance", icon: ClipboardList },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "registration", label: "Registration", icon: UserPlus },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/login"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Church className="h-8 w-8 text-blue-800" />
              <div>
                <h1 className="text-2xl font-bold text-blue-800">GKBJ REGENCY</h1>
                <p className="text-sm text-gray-600">Church Management Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
