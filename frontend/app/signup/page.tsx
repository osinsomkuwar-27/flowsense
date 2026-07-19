"use client"

import { useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function SignUp() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== "undefined") {
      localStorage.setItem("userFullName", formData.fullName)
    }
    // Will integrate backend auth later
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-100 p-6">
      <div className="relative flex h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Left panel — form */}
        <div className="flex flex-1 flex-col items-center justify-center bg-white z-10 py-12 overflow-y-auto">
          <div className="w-full max-w-sm px-6">
            <div className="mb-8 text-center">
              <div className="mb-6 flex justify-center">
                <Logo size={48} />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-medium text-[#6f7bd2] hover:text-[#64748B] transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm outline-none transition-all focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#0F172A] focus:ring-2 focus:ring-[#0F172A]/20"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
              >
                Create account
              </Button>
            </form>
          </div>
        </div>

        {/* Right panel — brand visual */}
        <div 
          className="relative flex-1 overflow-hidden bg-cover bg-center hidden md:block"
          style={{ backgroundImage: "url('/auth-side-bg.png')" }}
        >
          {/* Subtle overlay gradient for aesthetic depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 via-slate-900/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}
