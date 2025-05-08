"use client"

import { useState } from "react"
import { LogInIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

export function LoginButton() {
  const { login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    console.log("Login button clicked")
    setIsLoading(true)
    login()
    // No need to reset loading as we're redirecting
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