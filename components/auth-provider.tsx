"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
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
    const initializeAnonymousId = () => {
      try {
        const storedAnonymousId = localStorage.getItem("anonymousId")
        if (storedAnonymousId) {
          setAnonymousId(storedAnonymousId)
        } else {
          const newAnonymousId = `anon_${Math.random().toString(36).substring(2, 15)}`
          localStorage.setItem("anonymousId", newAnonymousId)
          setAnonymousId(newAnonymousId)
        }
      } catch (error) {
        console.error("Error managing anonymous ID:", error)
        // Generate temporary ID without storing
        setAnonymousId(`anon_${Math.random().toString(36).substring(2, 15)}`)
      }
    }

    initializeAnonymousId()

    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // First check the client-side cookie to see if we're authenticated
        const authStatus = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-status='))
          ?.split('=')[1]

        // If there's no auth cookie, skip the API call
        if (authStatus !== 'authenticated') {
          setUser(null)
          setIsLoading(false)
          return
        }

        console.log("Auth cookie found, checking session")
        const res = await fetch("/api/auth/me")

        if (res.ok) {
          const userData = await res.json()
          if (userData) {
            console.log("User authenticated:", userData.email)
            setUser(userData)
          } else {
            setUser(null)
          }
        } else {
          // If API returns error, clear user
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname])

  const login = () => {
    console.log("Login button clicked")
    
    // If user is already authenticated, redirect directly to the return path
    if (user) {
      console.log("User already authenticated, redirecting to current page or chat")
      const returnPath = pathname || "/chat"
      router.push(returnPath)
      return
    }
    
    // Otherwise, redirect to login endpoint
    console.log("Navigating to login endpoint")
    const returnPath = pathname || "/chat"
    router.push(`/api/auth/login?returnTo=${encodeURIComponent(returnPath)}`)
  }

  const logout = async () => {
    console.log("Logging out")
    router.push("/api/auth/logout")
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
