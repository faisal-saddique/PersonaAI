import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import cx from "../utils/cx"
import SidebarLayout from "../components/SidebarLayout"
import { CharacterProvider } from "../contexts/CharacterContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PersonaAI",
  description: "PersonaAI ChatBot",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className={cx(inter.className, "text-sm md:text-base bg-body")}>
        <CharacterProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </CharacterProvider>
      </body>
    </html>
  )
}

