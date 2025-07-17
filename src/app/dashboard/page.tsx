"use client"

import { useState } from "react"
import DashboardLayout from "../components/dashboard/dashboard-layout"
import DashboardHome from "../components/dashboard/dashboard-home"
import MemberManagement from "../components/dashboard/member-management"
import AttendanceTracking from "../components/dashboard/attendance-tracking"
import Calendar from "../components/dashboard/calendar"
import RegistrationForm from "../components/dashboard/registration-form"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome />
      case "members":
        return <MemberManagement />
      case "attendance":
        return <AttendanceTracking />
      case "calendar":
        return <Calendar />
      case "registration":
        return <RegistrationForm />
      default:
        return <DashboardHome />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}
