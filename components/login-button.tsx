"use client"

import { LogInIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"

export function LoginButton() {
  const { login } = useAuth()

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={login}
      className="flex items-center gap-2"
    >
      <LogInIcon className="h-4 w-4" />
      <span>Login</span>
    </Button>
  )
} 