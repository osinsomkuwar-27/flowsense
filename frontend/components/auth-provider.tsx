"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  fullName?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Initial load from localStorage
    const storedToken = localStorage.getItem("auth_token")
    const storedUser = localStorage.getItem("auth_user")
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  useEffect(() => {
    // Protect dashboard routes
    if (!loading) {
      const isDashboardRoute = pathname.startsWith("/dashboard")
      if (isDashboardRoute && !token) {
        router.push("/login")
      }
    }
  }, [loading, token, pathname, router])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    
    const body = await res.json()
    if (!res.ok || !body.success) {
      throw new Error(body.error || "Login failed")
    }

    const { token: jwtToken, user: userData } = body.data
    
    localStorage.setItem("auth_token", jwtToken)
    localStorage.setItem("auth_user", JSON.stringify(userData))
    localStorage.setItem("userFullName", userData.fullName || "Demo User")
    
    setToken(jwtToken)
    setUser(userData)
    
    router.push("/dashboard")
  }

  const signup = async (email: string, password: string, fullName?: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    })
    
    const body = await res.json()
    if (!res.ok || !body.success) {
      throw new Error(body.error || "Signup failed")
    }

    const { token: jwtToken, user: userData } = body.data
    
    localStorage.setItem("auth_token", jwtToken)
    localStorage.setItem("auth_user", JSON.stringify(userData))
    localStorage.setItem("userFullName", userData.fullName || "Demo User")
    
    setToken(jwtToken)
    setUser(userData)
    
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    localStorage.removeItem("userFullName")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
