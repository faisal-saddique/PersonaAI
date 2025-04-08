"use client"

import { useEffect, useState } from "react"
import { Plus, Trash, Edit, RefreshCw, MessageSquare, Check } from "lucide-react"

import cx from "@/utils/cx"
import { FormButton, TextareaField } from "./form-components"

interface SystemPrompt {
  id: number
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Form data interface
interface FormData {
  id?: number
  content: string
  isActive: boolean
}

// Default form data
const initialFormData: FormData = {
  content: "",
  isActive: true
}

export default function SystemPromptSettings() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // Fetch prompts on component mount
  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin?resource=systemPrompts')
      const result = await response.json()

      if (result.success) {
        setPrompts(result.data)
      } else {
        setError(result.error || 'Failed to load system prompts')
      }
    } catch (err) {
      setError('An error occurred while loading system prompts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.content.trim()) {
      errors.content = "System prompt content is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSystemPrompt',
          ...formData
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsEditing(false)
        setFormData(initialFormData)
        fetchPrompts()
      } else {
        setError(result.error || 'Failed to save system prompt')
      }
    } catch (err) {
      setError('An error occurred while saving the system prompt')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (prompt: SystemPrompt) => {
    setFormData({
      id: prompt.id,
      content: prompt.content,
      isActive: prompt.isActive
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin?resource=systemPrompt&id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setPrompts(prompts.filter(prompt => prompt.id !== id))
        setConfirmDelete(null)
      } else {
        setError(result.error || 'Failed to delete system prompt')
      }
    } catch (err) {
      setError('An error occurred while deleting the system prompt')
      console.error(err)
    }
  }
  
  const handleSetActive = async (id: number) => {
    try {
      const prompt = prompts.find(p => p.id === id)
      if (!prompt) return
      
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSystemPrompt',
          id: prompt.id,
          content: prompt.content,
          isActive: true
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchPrompts()
      } else {
        setError(result.error || 'Failed to set prompt as active')
      }
    } catch (err) {
      setError('An error occurred while updating the prompt')
      console.error(err)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setFormData(initialFormData)
    setFormErrors({})
  }

  // If loading
  if (loading && prompts.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">System Prompt Settings</h2>
        <p className="text-muted-foreground">
          Configure the system prompt used to give instructions to the AI model. This defines the AI's behavior and knowledge base.
        </p>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Prompt Form - Add/Edit */}
      {isEditing ? (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-medium mb-4">
            {formData.id ? "Edit System Prompt" : "Add New System Prompt"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextareaField
              id="prompt-content"
              label="System Prompt Content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              error={formErrors.content}
              className="min-h-[200px]"
              placeholder="Enter instructions for the AI model, defining its behavior, knowledge, and persona..."
              required
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-active"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="is-active" className="text-sm">
                Set as active system prompt (will replace current active prompt)
              </label>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={cancelEdit}
                className="btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <FormButton
                type="submit"
                isLoading={isSubmitting}
                className="btn-primary"
              >
                {formData.id ? "Update Prompt" : "Add Prompt"}
              </FormButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <button
            onClick={fetchPrompts}
            className="btn-outline flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={() => {
              setFormData(initialFormData)
              setIsEditing(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Prompt</span>
          </button>
        </div>
      )}
      
      {/* Prompts List */}
      {prompts.length > 0 ? (
        <div className="space-y-4">
          {prompts.map(prompt => (
            <div 
              key={prompt.id} 
              className={cx(
                "border rounded-lg p-4 bg-card transition-all",
                prompt.isActive ? "border-primary shadow-md" : "border-border hover:border-border/80"
              )}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  {prompt.isActive ? (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                      <Check size={12} />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetActive(prompt.id)}
                      className="text-xs text-muted-foreground hover:text-primary bg-muted hover:bg-primary/10 px-2 py-1 rounded-full transition-colors"
                    >
                      Set as Active
                    </button>
                  )}
                  <span className="ml-3 text-xs text-muted-foreground">
                    Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(prompt)}
                    className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                    title="Edit prompt"
                  >
                    <Edit size={16} />
                  </button>
                  {!prompt.isActive && (
                    confirmDelete === prompt.id ? (
                      <div className="flex items-center">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs text-muted-foreground hover:text-foreground px-2"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(prompt.id)}
                          className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-1 rounded"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(prompt.id)}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                        title="Delete prompt"
                      >
                        <Trash size={16} />
                      </button>
                    )
                  )}
                </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md whitespace-pre-wrap text-sm">
                {prompt.content.length > 300
                  ? `${prompt.content.substring(0, 300)}...`
                  : prompt.content
                }
              </div>
              
              {prompt.content.length > 300 && (
                <button
                  onClick={() => handleEdit(prompt)}
                  className="text-xs text-primary mt-2"
                >
                  View full content
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        !isEditing && (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No System Prompts Configured</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first system prompt to guide the AI's behavior in conversations.
            </p>
            <button
              onClick={() => {
                setFormData(initialFormData)
                setIsEditing(true)
              }}
              className="btn-primary"
            >
              Create First System Prompt
            </button>
          </div>
        )
      )}
      
      {/* Hints and suggestions */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <h4 className="font-medium mb-1">System Prompt Tips:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Purpose:</strong> The system prompt gives context and instructions to the AI model about how to behave.</li>
          <li><strong>Be specific:</strong> Clearly define the AI's role, knowledge base, and rules for interaction.</li>
          <li><strong>Personality:</strong> Define the tone, style, and character the AI should adopt.</li>
          <li><strong>Only one active:</strong> Only one system prompt can be active at a time.</li>
          <li><strong>Example:</strong> "You are an AI assistant specialized in Japanese anime culture. Respond in a friendly, enthusiastic manner..."</li>
        </ul>
      </div>
    </div>
  )
}