"use client"

import { useState, useEffect } from "react"
import { LogInIcon, Loader2, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { useRouter, usePathname } from "next/navigation"

export function LoginButton() {
  const { login, isLoading: authLoading, user, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Reset loading state if auth state changes
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
    }
  }, [authLoading])

  const handleLogin = () => {
    console.log("Login button clicked")
    
    // If already authenticated, redirect to chat
    if (isAuthenticated && user) {
      router.push("/chat")
      return
    }
    
    // Otherwise, proceed with login flow - use direct navigation to avoid client-side issues
    setIsLoading(true)
    const returnPath = pathname || "/chat"
    window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(returnPath)}`
  }

  // Display logged in state if authenticated
  if (isAuthenticated && user) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push("/chat")}
        className="flex items-center gap-2"
      >
        <UserIcon className="h-4 w-4" />
        <span>{user.name || user.email}</span>
      </Button>
    )
  }

  return (
    <Button 
      variant="default" 
      size="sm" 
      onClick={handleLogin}
      disabled={isLoading || authLoading}
      className="flex items-center gap-2 bg-[#00adb5] hover:bg-[#00adb5]/90"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogInIcon className="h-4 w-4" />
      )}
      <span>Login</span>
    </Button>
  )
} 