"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Church } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Simpan token di cookie
        document.cookie = `auth-token=${data.token}; path=/`

        // ✅ Redirect ke dashboard
        router.push("/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Church className="h-8 w-8 text-blue-800" />
            <span className="text-2xl font-bold text-blue-800">GKBJ REGENCY</span>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-blue-800 hover:text-blue-600 transition-colors">
                Contact Admin
              </a>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-colors"
                  placeholder="member@gkbjregency.org"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <a href="#" className="text-sm font-medium text-blue-800 hover:text-blue-600 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-colors duration-300"
            >
              Sign in
            </button>

            {/* Demo Credentials */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Use <span className="font-semibold">member@gkbjregency.org</span> with password{" "}
                    <span className="font-semibold">Faith2024!</span>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Welcome Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <div className="flex items-center justify-center w-full px-12">
          <div className="max-w-md text-center">
            {/* Welcome Text */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                GKBJ Regency
              </span>
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              A spiritual platform designed for our church community with member management and event coordination.
            </p>

            {/* Feature Preview Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Church className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Member Dashboard</p>
                    <p className="text-sm text-gray-500">Manage your church activities</p>
                  </div>
                </div>
                <div className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg">Join Service</div>
              </div>
              <div className="flex items-center justify-between text-white/80 text-sm">
                <span>Services attended: 24</span>
                <span>Next: Sunday Worship</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}