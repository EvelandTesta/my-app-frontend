"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// 🔹 Definisikan skema validasi dengan Zod
const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

// 🔹 Tipe dari skema
type LoginFormInputs = z.infer<typeof loginSchema>

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    })

    const [serverError, setServerError] = useState("")
    const router = useRouter()

    const onSubmit = async (data: LoginFormInputs) => {
        setServerError("")

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setServerError(result.error || "Login failed")
                return
            }

            // 🔐 Simpan token di cookie
            document.cookie = `auth-token=${result.token}; path=/`

            // 🚀 Redirect ke dashboard
            router.push("/dashboard")
        } catch (err) {
            setServerError("Something went wrong. Please try again.")
            console.error("Login error:", err)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {/* ✅ Akses error.message dengan aman */}
                {errors.email?.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {/* ✅ Akses error.message dengan aman */}
                {errors.password?.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Server Error Message */}
            {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 transition-colors duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
            >
                {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
        </form>
    )
}