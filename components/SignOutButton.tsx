"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface SignOutButtonProps {
  className?: string
  variant?: "icon" | "text" | "full"
}

export default function SignOutButton({ 
  className = "", 
  variant = "full" 
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false)
  
  const handleSignOut = async () => {
    setLoading(true)
    await signOut({ callbackUrl: '/' })
  }
  
  if (variant === "icon") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`p-2 rounded-full hover:bg-muted transition-colors ${className}`}
        title="Sign out"
      >
        <LogOut size={18} className={loading ? "animate-pulse" : ""} />
      </button>
    )
  }
  
  if (variant === "text") {
    return (
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`text-sm hover:text-primary transition-colors ${className}`}
      >
        {loading ? "Signing out..." : "Sign out"}
      </button>
    )
  }
  
  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors ${className}`}
    >
      <LogOut size={18} className={loading ? "animate-pulse" : ""} />
      <span>{loading ? "Signing out..." : "Sign out"}</span>
    </button>
  )
}