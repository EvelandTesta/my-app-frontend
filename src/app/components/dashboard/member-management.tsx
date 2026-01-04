"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Download, Filter } from "lucide-react"

interface Member {
  id: number
  name: string
  age: number
  gender: string
  email: string
  phone: string
  role: string
  joinDate: string
}

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    role: "",
  })

  const roles = ["Pastor", "Youth Leader", "Member", "Visitor", "Elder"]

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "" || member.role === filterRole
    return matchesSearch && matchesRole
  })


  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/member")
      if (response.ok) {
        const data: Member[] = await response.json() 
        setMembers(
          data.map((member) => ({
            id: member.id,
            name: member.name,
            age: member.age ?? 0,
            gender: member.gender ?? "",
            email: member.email ?? "",
            phone: member.phone ?? "",
            role: member.role ?? "Member",
            joinDate: member.joinDate ? member.joinDate.split("T")[0] : new Date().toISOString().split("T")[0],
          }))
        )
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    } finally {
      setLoading(false) 
    }
  }

  const handleAddMember = async () => {
    try {
      const response = await fetch("/api/member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number.parseInt(formData.age) || null,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        }),
      })

      if (response.ok) {
        await fetchMembers()
        setFormData({ name: "", age: "", gender: "", email: "", phone: "", role: "" })
        setShowAddForm(false)
        alert("Member added successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add member")
      }
    } catch (error) {
      console.error("Error adding member:", error)
      alert("Failed to add member")
    }
  }


  const handleEditMember = async () => {
    if (editingMember) {
      try {
        const response = await fetch(`/api/member/${editingMember.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            age: Number.parseInt(formData.age) || null,
            gender: formData.gender,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
          }),
        })

        if (response.ok) {
          await fetchMembers()
          setEditingMember(null)
          setFormData({ name: "", age: "", gender: "", email: "", phone: "", role: "" })
          setShowAddForm(false)
          alert("Member updated successfully!")
        } else {
          const error = await response.json()
          alert(error.error || "Failed to update member")
        }
      } catch (error) {
        console.error("Error updating member:", error)
        alert("Failed to update member")
      }
    }
  }


  const handleDeleteMember = async (id: number) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        const response = await fetch(`/api/member/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchMembers()
          alert("Member deleted successfully!")
        } else {
          const error = await response.json()
          alert(error.error || "Failed to delete member")
        }
      } catch (error) {
        console.error("Error deleting member:", error)
        alert("Failed to delete member")
      }
    }
  }

  const startEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      age: member.age.toString(),
      gender: member.gender,
      email: member.email,
      phone: member.phone,
      role: member.role,
    })
    setShowAddForm(true)
  }

  const exportMembers = () => {
    const csvContent = [
      ["Name", "Age", "Gender", "Email", "Phone", "Role", "Join Date"],
      ...members.map((member) => [
        member.name,
        member.age.toString(),
        member.gender,
        member.email,
        member.phone,
        member.role,
        member.joinDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "members.csv"
    a.click()
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading members...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Member Management</h2>
          <p className="text-gray-600">Manage church member information</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* search and filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={exportMembers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* members table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{member.email}</div>
                    <div className="text-gray-500 text-sm">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{member.joinDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(member)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* add/edit member modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingMember ? "Edit Member" : "Add New Member"}</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={editingMember ? handleEditMember : handleAddMember}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingMember ? "Update" : "Add"} Member
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingMember(null)
                  setFormData({ name: "", age: "", gender: "", email: "", phone: "", role: "" })
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
