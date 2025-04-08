"use client"

import { useEffect, useState } from "react"
import { Plus, Trash, Edit, RefreshCw, User } from "lucide-react"

import cx from "@/utils/cx"
import PersonaProfileForm from "@/app/admin/PersonaProfileForm"

interface Persona {
  id: number
  fullName: string
  age: number
  expertise: string
  experienceLevel: string
  createdAt: string
  updatedAt: string
}

export default function PersonaManagement() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // Fetch personas on component mount
  useEffect(() => {
    fetchPersonas()
  }, [])

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin?resource=personas')
      const result = await response.json()

      if (result.success) {
        setPersonas(result.data)
      } else {
        setError(result.error || 'Failed to load personas')
      }
    } catch (err) {
      setError('An error occurred while loading personas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin?resource=persona&id=${id}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (result.success) {
        setPersonas(personas.filter(persona => persona.id !== id))
        setConfirmDelete(null)
        
        // If the deleted persona was selected, clear selection
        if (selectedPersona === id) {
          setSelectedPersona(null)
        }
      } else {
        setError(result.error || 'Failed to delete persona')
      }
    } catch (err) {
      setError('An error occurred while deleting persona')
      console.error(err)
    }
  }

  // Reset state when form submission is complete
  const handleFormComplete = () => {
    setSelectedPersona(null)
    setIsCreating(false)
    fetchPersonas()
  }

  // Show loading state
  if (loading && personas.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If viewing/editing an existing persona or creating a new one
  if (selectedPersona !== null || isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedPersona(null)
              setIsCreating(false)
            }}
            className="btn-outline flex items-center gap-2"
          >
            <span>← Back to Personas</span>
          </button>
          <h2 className="text-xl font-semibold">
            {isCreating ? "Create New Persona" : "Edit Persona"}
          </h2>
        </div>
        
        <PersonaProfileForm
          personaId={isCreating ? null : selectedPersona}
          onComplete={handleFormComplete}
        />
      </div>
    )
  }

  // List of personas
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Personas</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchPersonas}
            className="btn-outline flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            <span>New Persona</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Empty state */}
      {personas.length === 0 && !loading && (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={24} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Personas Created Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first persona profile to start giving your AI a unique character and personality.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            Create First Persona
          </button>
        </div>
      )}

      {/* Personas list */}
      {personas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-left">
                <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Expertise</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Last Updated</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {personas.map((persona) => (
                <tr 
                  key={persona.id} 
                  className="border-b border-border hover:bg-card/60 transition-colors"
                >
                  <td className="px-4 py-3">{persona.fullName}</td>
                  <td className="px-4 py-3">{persona.age}</td>
                  <td className="px-4 py-3">{persona.expertise}</td>
                  <td className="px-4 py-3">
                    <span className={cx(
                      "px-2 py-1 rounded-full text-xs",
                      persona.experienceLevel === "beginner" && "bg-blue-500/10 text-blue-500",
                      persona.experienceLevel === "intermediate" && "bg-green-500/10 text-green-500",
                      persona.experienceLevel === "advanced" && "bg-purple-500/10 text-purple-500",
                      persona.experienceLevel === "expert" && "bg-orange-500/10 text-orange-500",
                    )}>
                      {persona.experienceLevel.charAt(0).toUpperCase() + persona.experienceLevel.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(persona.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmDelete === persona.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(persona.id)}
                          className="btn-outline border-red-500 text-red-500 hover:bg-red-500/10 text-sm px-2 py-1"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPersona(persona.id)}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                          title="Edit persona"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(persona.id)}
                          className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete persona"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}