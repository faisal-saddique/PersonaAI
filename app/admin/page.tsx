"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import PersonaProfileForm from "./PersonaProfileForm"
import { Shield, AlertTriangle } from "lucide-react"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false)
    }
  }, [status])

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated, redirect to home
  if (status === 'unauthenticated') {
    router.push('/')
    return null
  }

  // Check if user has admin role
  const isAdmin = session?.user?.role === 'admin'

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 rounded-xl bg-card border border-border text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-500/10 p-3 rounded-full">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this area. Admin privileges are required.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Return to Home
        </button>
      </div>
    )
  }

  // If admin, show the admin form
  return (
    <div>
      <div className="max-w-4xl mx-auto pt-6 mb-6 flex items-center justify-center gap-2">
        <Shield className="text-primary" size={24} />
        <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
          Admin Area - Authenticated as {session.user?.email}
        </span>
      </div>
      <PersonaProfileForm />
    </div>
  )
}