"use client"
import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"

import type { Character } from "../utils/characters"
import { transformProfileToCharacter } from "../utils/characters"

interface CharacterContextProps {
  selectedCharacter: Character | null
  setSelectedCharacter: (character: Character | null) => void
  characters: Character[]
  loading: boolean
  error: string | null
  refreshCharacters: () => Promise<void>
}

const CharacterContext = createContext<CharacterContextProps | null>(null)

export const CharacterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCharacters = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin')
      const result = await response.json()
      
      if (result.success) {
        // Transform the profile data to Character format
        const characterData = transformProfileToCharacter(result.data)
        setCharacters([characterData])
        
        // If no character is selected yet, select this one
        if (!selectedCharacter) {
          setSelectedCharacter(characterData)
        }
      } else {
        setError('No character profile found')
        setCharacters([])
      }
    } catch (err) {
      setError('Failed to load character data')
      console.error('Error fetching characters:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load characters on initial mount
  useEffect(() => {
    fetchCharacters()
  }, [])

  return (
    <CharacterContext.Provider 
      value={{ 
        selectedCharacter, 
        setSelectedCharacter, 
        characters, 
        loading, 
        error,
        refreshCharacters: fetchCharacters
      }}
    >
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