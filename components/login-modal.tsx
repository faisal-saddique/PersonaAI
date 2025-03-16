"use client"

import type React from "react"
import { useState } from "react"
import { Lock, User } from "lucide-react"
import { authenticateUser, type UserRole } from "../utils/users"

interface LoginModalProps {
  isOpen: boolean
  onLogin: (success: boolean, role?: UserRole) => void
  requiredRole?: UserRole
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, requiredRole = "user" }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const user = authenticateUser(username, password)

      if (user) {
        if (requiredRole === "admin" && user.role !== "admin") {
          setError("You need admin privileges to access this area")
          setIsLoading(false)
          return
        }

        onLogin(true, user.role)
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl max-w-md w-full overflow-hidden shadow-xl animate-fade-in">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Welcome to PersonaAI</h2>
          <p className="text-white/80 mt-2">
            {requiredRole === "admin" ? "Sign in with admin credentials to continue" : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground block">
              Username
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User size={18} />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-10"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground block">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full btn-primary py-3 rounded-lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Available accounts:</p>
            <p className="font-medium text-foreground">User: john/1234 | Admin: admin/admin123</p>
          </div> */}
        </form>
      </div>
    </div>
  )
}

export default LoginModal

