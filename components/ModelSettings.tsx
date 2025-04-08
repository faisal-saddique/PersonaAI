"use client"

import { useEffect, useState } from "react"
import { Plus, Trash, Edit, RefreshCw, Settings, Check } from "lucide-react"

import cx from "@/utils/cx"
import { FormButton, InputField, SelectField } from "./form-components"

interface ModelConfig {
  id: number
  name: string
  provider: string
  modelId: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

// Form data interface
interface FormData {
  id?: number
  name: string
  provider: string
  modelId: string
  isDefault: boolean
}

// Default form data
const initialFormData: FormData = {
  name: "",
  provider: "openai",
  modelId: "",
  isDefault: false
}

// Provider options
const providerOptions = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "openrouter", label: "OpenRouter" },
]

export default function ModelSettings() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // Fetch models on component mount
  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin?resource=models')
      const result = await response.json()

      if (result.success) {
        setModels(result.data)
      } else {
        setError(result.error || 'Failed to load models')
      }
    } catch (err) {
      setError('An error occurred while loading models')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Model name is required"
    }
    
    if (!formData.modelId.trim()) {
      errors.modelId = "Model ID is required"
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
          action: 'updateModelConfig',
          ...formData
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsEditing(false)
        setFormData(initialFormData)
        fetchModels()
      } else {
        setError(result.error || 'Failed to save model configuration')
      }
    } catch (err) {
      setError('An error occurred while saving the model configuration')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (model: ModelConfig) => {
    setFormData({
      id: model.id,
      name: model.name,
      provider: model.provider,
      modelId: model.modelId,
      isDefault: model.isDefault
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin?resource=model&id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setModels(models.filter(model => model.id !== id))
        setConfirmDelete(null)
      } else {
        setError(result.error || 'Failed to delete model')
      }
    } catch (err) {
      setError('An error occurred while deleting the model')
      console.error(err)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      const model = models.find(m => m.id === id)
      if (!model) return
      
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateModelConfig',
          id: model.id,
          name: model.name,
          provider: model.provider,
          modelId: model.modelId,
          isDefault: true
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        fetchModels()
      } else {
        setError(result.error || 'Failed to set model as default')
      }
    } catch (err) {
      setError('An error occurred while updating the model')
      console.error(err)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setFormData(initialFormData)
    setFormErrors({})
  }

  // If loading
  if (loading && models.length === 0) {
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
        <h2 className="text-xl font-semibold mb-2">AI Model Configuration</h2>
        <p className="text-muted-foreground">
          Configure the AI models used for chat interactions. Set the default model that will be used for all conversations.
        </p>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Model Form - Add/Edit */}
      {isEditing ? (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-medium mb-4">
            {formData.id ? "Edit Model" : "Add New Model"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="model-name"
              label="Display Name"
              value={formData.name}
              onChange={(e: { target: { value: string | boolean } }) => handleInputChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="e.g., GPT-4o, Claude Opus"
              required
            />
            
            <SelectField
              id="model-provider"
              label="Provider"
              options={providerOptions}
              value={formData.provider}
              onChange={(e: { target: { value: string | boolean } }) => handleInputChange("provider", e.target.value)}
              error={formErrors.provider}
              required
            />
            
            <InputField
              id="model-id"
              label="Model ID"
              value={formData.modelId}
              onChange={(e: { target: { value: string | boolean } }) => handleInputChange("modelId", e.target.value)}
              error={formErrors.modelId}
              placeholder="e.g., gpt-4o, claude-3-opus-20240229"
              required
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is-default"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="is-default" className="text-sm">
                Set as default model
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
                {formData.id ? "Update Model" : "Add Model"}
              </FormButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <button
            onClick={fetchModels}
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
            <span>Add Model</span>
          </button>
        </div>
      )}
      
      {/* Models List */}
      {models.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-left">
                <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Model ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models.map(model => (
                <tr key={model.id} className="border-b border-border hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3">{model.name}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{model.provider}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="bg-muted px-2 py-1 rounded text-xs">{model.modelId}</code>
                  </td>
                  <td className="px-4 py-3">
                    {model.isDefault ? (
                      <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(model.id)}
                        className="text-xs text-muted-foreground hover:text-primary"
                      >
                        Set Default
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmDelete === model.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
                          className="btn-outline border-red-500 text-red-500 hover:bg-red-500/10 text-sm px-2 py-1"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(model)}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                          title="Edit model"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(model.id)}
                          className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete model"
                          disabled={model.isDefault}
                        >
                          <Trash size={16} className={model.isDefault ? "opacity-50" : ""} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isEditing && (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Models Configured</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your first AI model configuration to start personalizing your chat experience.
            </p>
            <button
              onClick={() => {
                setFormData(initialFormData)
                setIsEditing(true)
              }}
              className="btn-primary"
            >
              Add First Model
            </button>
          </div>
        )
      )}
      
      {/* Hints and suggestions */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <h4 className="font-medium mb-1">Model Suggestions:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>OpenAI:</strong> gpt-4o, gpt-3.5-turbo</li>
          <li><strong>Anthropic:</strong> claude-3-opus-20240229, claude-3-sonnet-20240229</li>
          <li><strong>Default model:</strong> Only one model can be set as default. This model will be used for all conversations.</li>
        </ul>
      </div>
    </div>
  )
}