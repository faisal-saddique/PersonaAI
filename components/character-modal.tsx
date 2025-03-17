import React from "react"
import { X } from "lucide-react"
import cx from "../utils/cx"

interface CharacterModalProps {
  isOpen: boolean
  onClose: () => void
  character: {
    name: string
    avatar: string
    description: string
    price: string
  }
}

export function CharacterModal({ isOpen, onClose, character }: CharacterModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">Character Details</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-4">
              <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xl font-bold text-foreground">{character.name}</h4>
            <p className="text-sm text-muted-foreground mt-1">{character.price}</p>
          </div>

          <div className="text-sm text-foreground">
            <p>{character.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            className={cx(
              "w-full py-2 px-4 rounded-md transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}