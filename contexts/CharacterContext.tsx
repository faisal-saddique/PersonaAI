"use client"
import { createContext, useContext, useState } from "react"
import type React from "react"

import type { Character } from "../utils/characters"

interface CharacterContextProps {
  selectedCharacter: Character | null
  setSelectedCharacter: (character: Character | null) => void
}

const CharacterContext = createContext<CharacterContextProps | null>(null)

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  return (
    <CharacterContext.Provider value={{ selectedCharacter, setSelectedCharacter }}>
      {children}
    </CharacterContext.Provider>
  )
}

export const useCharacter = () => {
  const context = useContext(CharacterContext)
  if (context === null) {
    throw new Error("useCharacter must be used within a CharacterProvider")
  }
  return context
}

