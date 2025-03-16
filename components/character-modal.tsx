"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, Star, X } from "lucide-react"

interface CharacterModalProps {
  isOpen: boolean
  onClose: () => void
  character: {
    name: string
    avatar: string
    rating?: number
    price?: string
    description: string
  }
}

export function CharacterModal({ isOpen, onClose, character }: CharacterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Handle ESC key to close
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscKey)
      document.body.style.overflow = "hidden" // Prevent scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-card rounded-2xl max-w-sm w-full overflow-hidden shadow-xl animate-fade-in relative"
      >
        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Hero Image/Banner */}
        <div className="h-32 bg-gradient-to-r from-primary via-accent to-secondary relative">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-card bg-muted overflow-hidden shadow-lg">
              <img
                src={character.avatar || "/placeholder.svg"}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center pt-20 p-6">
          {/* Title and Rating */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-display font-bold text-foreground">{character.name}</h3>
            <div className="flex items-center bg-muted px-2 py-1 rounded-full">
              <Star size={16} className="text-yellow-400" />
              <span className="ml-1 text-foreground text-sm font-medium">{character.rating || "5.0"}</span>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center gap-1 text-emerald-500 mb-4">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Verified Character</span>
          </div>

          {/* Price Badge */}
          <div className="mb-6 bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-medium">
            {character.price || "Premium Character"}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6">{character.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <button className="btn-outline flex-1">View Details</button>
            <button className="btn-primary flex-1">Start Chat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

