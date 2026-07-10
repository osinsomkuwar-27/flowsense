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
    // Will integrate backend auth later
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-100 p-6">
      <div className="relative flex h-[85vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* Left panel — brand visual */}
        <div className="relative flex-1 overflow-hidden bg-[#0F172A] hidden md:block">
          <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_50%_100%,rgba(202,229,255,0.25)_0%,rgba(152,181,237,0.15)_28%,rgba(74,78,105,0.4)_54%,rgba(34,34,59,0.9)_100%)]" />
          <div className="absolute -bottom-24 left-1/2 h-[340px] w-[600px] -translate-x-1/2 rounded-full bg-[#64748B]/20 blur-3xl" />
          <div className="absolute top-[-80px] left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[#6f7bd2]/15 blur-3xl" />
          <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
            <Logo size={64} white />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
              Join teams that catch issues before they become incidents. Set up in under 5 minutes.
            </p>
            <div className="mt-8 space-y-3 w-full max-w-xs">
              {[
                "Connect GitHub, Jira & Notion",
                "AI-powered anomaly detection",
                "Workflow optimization suggestions",
                "Free tier — no credit card required",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6f7bd2]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

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

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center bg-white">
          <div className="w-full max-w-sm p-6">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-medium text-[#6f7bd2] hover:text-[#64748B] transition-colors"
                >
                  Sign in
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
                className="w-full"
              >
                Create account
              </Button>

              <p className="text-center text-xs text-gray-400">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
