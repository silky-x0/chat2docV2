"use client"

import { useState, useEffect } from "react"
import { UserPlusIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"

export function SignupButton() {
  const { isLoading: authLoading, isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset loading state if auth state changes
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
    }
  }, [authLoading])

  const handleSignup = () => {
    console.log("Signup button clicked")
    
    // If already authenticated, redirect to chat
    if (isAuthenticated && user) {
      router.push("/chat")
      return
    }
    
    // Otherwise, proceed with signup flow
    setIsLoading(true)
    window.location.href = '/api/auth/login?screen_hint=signup'
  }

  // If already authenticated, don't show signup button
  if (isAuthenticated && user) {
    return null
  }

  return (
    <Button 
      variant="outline"
      size="sm" 
      onClick={handleSignup}
      disabled={isLoading || authLoading}
      className="bg-white text-[#000000] px-6 py-2 h-auto rounded-full border border-[#000000] hover:bg-gray-50 transition-all"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <UserPlusIcon className="h-4 w-4 mr-2" />
      )}
      <span>Sign up</span>
    </Button>
  )
} 