"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  anonymousId: string
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  anonymousId: "",
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [anonymousId, setAnonymousId] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Generate or retrieve anonymous ID
    const storedAnonymousId = localStorage.getItem("anonymousId")
    if (storedAnonymousId) {
      setAnonymousId(storedAnonymousId)
    } else {
      const newAnonymousId = `anon_${Math.random().toString(36).substring(2, 15)}`
      localStorage.setItem("anonymousId", newAnonymousId)
      setAnonymousId(newAnonymousId)
    }

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const userData = await res.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  const login = () => {
    router.push("/api/auth/login")
  }

  const logout = async () => {
    await fetch("/api/auth/logout")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        anonymousId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
