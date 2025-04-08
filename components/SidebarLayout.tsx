"use client"

import React, { useEffect, useRef, useState } from "react"
import Sidebar from "./Sidebar"
import cx from "../utils/cx"
import { PanelLeftOpen } from "lucide-react"
import LoginModal from "./login-modal"
import type { UserRole } from "../utils/users"
import { useSession } from "next-auth/react"

interface SidebarLayoutProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export default function SidebarLayout({ children, requiredRole = "user" }: SidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined)
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const { data: session, status } = useSession()
  
  const mainContentRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  // Check if user is already logged in using Next Auth
  useEffect(() => {
    // Determine if user needs to be shown login modal based on session status
    if (status === 'loading') return;
    
    // Show login modal if not authenticated
    if (status === 'unauthenticated') {
      setShowLoginModal(true);
      return;
    }
    
    // User is authenticated
    if (session?.user) {
      // For now we'll use a simple role determination
      // In a real app, you'd store the role in the session
      const role = session.user.email?.includes('admin') ? 'admin' : 'user';
      setUserRole(role);
      setShowLoginModal(false);
    }
  }, [session, status, requiredRole]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        mainContentRef.current &&
        mainContentRef.current.contains(event.target as Node) &&
        window.innerWidth < 768 // Only on mobile
      ) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isSidebarOpen])

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogin = (success: boolean, role?: UserRole) => {
    if (success && role) {
      setUserRole(role)
      setShowLoginModal(false)
    }
  }

  // Check if user has required role
  const hasRequiredRole = userRole === requiredRole || (requiredRole === "user" && userRole === "admin")
  const isAuthenticated = status === 'authenticated'
  const shouldShowLoginModal = showLoginModal || !isAuthenticated || !hasRequiredRole

  return (
    <div className="relative min-h-screen md:flex">
      <LoginModal 
        isOpen={shouldShowLoginModal} 
        onLogin={handleLogin} 
        requiredRole={requiredRole} 
      />

      {/* Sidebar component - Only render if logged in or hidden by CSS */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggleSidebar={toggleSidebar} 
        isDisabled={shouldShowLoginModal} 
      />

      {/* Mobile-only toggle button when sidebar is closed */}
      {!isSidebarOpen && isAuthenticated && hasRequiredRole && (
        <button
          onClick={toggleSidebar}
          className="fixed left-0 top-0 p-2 bg-primary/10 text-primary z-20 md:hidden"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      {/* Main content */}
      <div
        ref={mainContentRef}
        className={cx(
          "flex-1 transition-all duration-300 ease-in-out flex flex-col items-center min-h-screen",
          isSidebarOpen ? "md:ml-80" : "md:ml-14",
          shouldShowLoginModal ? "blur-sm pointer-events-none" : "",
        )}
      >
        {React.cloneElement(children as React.ReactElement, {
          isSidebarOpen, // Pass the sidebar state to children
          isLoggedIn: isAuthenticated,
          userRole,
        })}
      </div>
    </div>
  )
}