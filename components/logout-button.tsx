"use client"

import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-provider"
import { signOut } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

export function LogoutButton() {
  const { logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      // First sign out from Firebase
      await signOut()
      
      // Then use Auth0 logout from context
      logout()
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLogout}
      className="h-8 w-8 rounded-full"
      title="Logout"
    >
      <LogOutIcon className="h-4 w-4" />
    </Button>
  )
} 