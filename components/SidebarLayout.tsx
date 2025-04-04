"use client"

import React, { useEffect, useRef, useState } from "react"
import Sidebar from "./Sidebar"
import cx from "../utils/cx"
import { PanelLeftOpen } from "lucide-react"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"

interface SidebarLayoutProps {
  children: React.ReactNode
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const router = useRouter()
  const pathname = usePathname()

  const mainContentRef = useRef<HTMLDivElement>(null)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

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

  // Check if admin is trying to access admin page
  const isAdmin = session?.user?.role === "admin"
  const isAdminRoute = pathname.startsWith("/admin")
  const isAuthorized = !isAdminRoute || (isAdminRoute && isAdmin)

  if (pathname !== "/login" && !isLoading && !session) {
    // If not on login page and not logged in, this should be handled by middleware
    return null
  }

  // When logged in but trying to access login page
  if (pathname === "/login" && session) {
    router.push("/")
    return null
  }

  return (
    <div className="relative min-h-screen md:flex">
      {/* Sidebar component */}
      {session && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggleSidebar={toggleSidebar} 
          isDisabled={false}
          userRole={session.user?.role}
          userName={session.user?.name || "User"}
        />
      )}

      {/* Mobile-only toggle button when sidebar is closed */}
      {!isSidebarOpen && session && (
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
          isSidebarOpen && session ? "md:ml-80" : "md:ml-14",
          isLoading ? "blur-sm pointer-events-none" : "",
        )}
      >
        {React.cloneElement(children as React.ReactElement, {
          isSidebarOpen, // Pass the sidebar state to children
          isLoggedIn: !!session,
          userRole: session?.user?.role,
        })}
      </div>
    </div>
  )
}