"use client"

import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "./logout-button"

export function UserProfile() {
  const { user } = useAuth()

  if (!user) return null

  // Get first letter of first and last name for the avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{user.name}</span>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
      
      <Avatar className="h-9 w-9">
        {user.picture && <AvatarImage src={user.picture} alt={user.name} />}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      
      <LogoutButton />
    </div>
  )
} 