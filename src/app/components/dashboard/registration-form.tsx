"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, User } from "lucide-react"

interface Registration {
  id: number
  name: string
  email: string
  phone: string
  age: string
  gender: string
  address: string
  ministry: string
  hearAbout: string
  status: "pending" | "approved" | "contacted"
  submittedAt: string
}

export default function RegistrationForm() {
  const [registrations, setRegistrations] = useState<Registration[]>([])

  const [showPublicForm, setShowPublicForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    ministry: "",
    hearAbout: "",
  })

  const ministries = [
    "Youth Ministry",
    "Music Ministry",
    "Children's Ministry",
    "Outreach Ministry",
    "Prayer Ministry",
    "Teaching Ministry",
  ]

  const hearAboutOptions = ["Friend", "Website", "Social Media", "Advertisement", "Walk-in", "Other"]

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registration")
      if (response.ok) {
        const data: Registration[] = await response.json()
        setRegistrations(
          data.map((reg) => ({
            id: reg.id,
            name: reg.name,
            email: reg.email,
            phone: reg.phone,
            age: reg.age?.toString() || "",
            gender: reg.gender || "",
            address: reg.address || "",
            ministry: reg.ministry || "",
            hearAbout: reg.hearAbout || "",
            status: reg.status,
            submittedAt: reg.submittedAt?.split("T")[0] || "",
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching registrations:", error)
    }
  }

  const handleSubmitRegistration = async () => {
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: Number.parseInt(formData.age) || null,
          gender: formData.gender,
          address: formData.address,
          ministry: formData.ministry,
          hearAbout: formData.hearAbout,
        }),
      })

      if (response.ok) {
        await fetchRegistrations()
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: "",
          gender: "",
          address: "",
          ministry: "",
          hearAbout: "",
        })
        setShowPublicForm(false)
        alert("Registration submitted successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit registration")
      }
    } catch (error) {
      console.error("Error submitting registration:", error)
      alert("Failed to submit registration")
    }
  }

  const updateRegistrationStatus = async (id: number, status: "pending" | "approved" | "contacted") => {
    try {
      const response = await fetch(`/api/registration/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchRegistrations()
        if (status === "approved") {
          alert("Registration approved and member added!")
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating registration:", error)
      alert("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "contacted":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "contacted":
        return <User className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Registration Management</h2>
          <p className="text-gray-600">Manage new member registrations</p>
        </div>
        <button
          onClick={() => setShowPublicForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <User className="h-5 w-5" />
          <span>New Registration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {registrations.filter((r) => r.status === "pending").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {registrations.filter((r) => r.status === "approved").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total This Month</p>
              <p className="text-3xl font-bold text-blue-600">{registrations.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ministry Interest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{registration.name}</div>
                      <div className="text-sm text-gray-500">
                        {registration.age} years, {registration.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{registration.email}</div>
                    <div className="text-gray-500 text-sm">{registration.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{registration.ministry}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.status)}`}
                    >
                      {getStatusIcon(registration.status)}
                      <span className="capitalize">{registration.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{registration.submittedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={registration.status}
                      onChange={(e) =>
                        updateRegistrationStatus(
                          registration.id,
                          e.target.value as "pending" | "approved" | "contacted",
                        )
                      }
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-800/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPublicForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Join Our Church Family</h3>
            <p className="text-gray-600 mb-6">
              We&apos;re excited to welcome you! Please fill out this form to register with GKBJ Regency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <select
                value={formData.ministry}
                onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              >
                <option value="">Preferred Ministry</option>
                {ministries.map((ministry) => (
                  <option key={ministry} value={ministry}>
                    {ministry}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 mt-4"
              rows={2}
            />

            <select
              value={formData.hearAbout}
              onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 mt-4"
            >
              <option value="">How did you hear about us?</option>
              {hearAboutOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSubmitRegistration}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Submit Registration
              </button>
              <button
                onClick={() => {
                  setShowPublicForm(false)
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    age: "",
                    gender: "",
                    address: "",
                    ministry: "",
                    hearAbout: "",
                  })
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
