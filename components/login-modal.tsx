"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Lock, User } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { UserRole } from "../utils/users"

interface LoginModalProps {
  isOpen: boolean
  onLogin: (success: boolean, role?: UserRole) => void
  requiredRole?: UserRole
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, requiredRole = "user" }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { status, data: session } = useSession()

  // Effect to handle session changes
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Determine role from session
      const role = session.user.email?.includes('admin') ? 'admin' as UserRole : 'user' as UserRole
      onLogin(true, role)
    }
  }, [status, session, onLogin])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // The session will be updated by the useEffect above
        router.refresh()
      }
    } catch (error) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
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
            <label htmlFor="email" className="text-sm font-medium text-foreground block">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="Enter your email"
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
        </form>
      </div>
    </div>
  )
}

export default LoginModal