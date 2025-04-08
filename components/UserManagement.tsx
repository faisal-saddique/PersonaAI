"use client"

import { useEffect, useState } from "react"
import { Plus, Trash, Edit, RefreshCw, Users, User, Shield } from "lucide-react"
import {
  InputField,
  SelectField,
  FormSection,
  FormButton,
} from "@/components/form-components"
import cx from "@/utils/cx"

interface UserData {
  id: string
  name: string | null
  email: string
  type: "user" | "admin"
  createdAt: string
}

// Form data interface
interface FormData {
  id?: string
  name: string
  email: string
  type: "user" | "admin"
  password: string
  confirmPassword: string
}

// User update payload interface with optional password
interface UserUpdatePayload {
  action: string
  id?: string
  name: string
  email: string
  type: "user" | "admin"
  password?: string
}

// Default form data
const initialFormData: FormData = {
  name: "",
  email: "",
  type: "user",
  password: "",
  confirmPassword: ""
}

// User type options
const userTypeOptions = [
  { value: "user", label: "Regular User" },
  { value: "admin", label: "Administrator" },
]

export default function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin?resource=users')
      const result = await response.json()

      if (result.success) {
        setUsers(result.data)
      } else {
        setError(result.error || 'Failed to load users')
      }
    } catch (err) {
      setError('An error occurred while loading users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    // Password validation only required for new users
    if (!formData.id) {
      if (!formData.password) {
        errors.password = "Password is required for new users"
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    } else {
      // For existing users, if password is provided, validate it
      if (formData.password) {
        if (formData.password.length < 6) {
          errors.password = "Password must be at least 6 characters"
        }
        
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Passwords do not match"
        }
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
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
      // Create the base user data payload with proper typing
      const userData: UserUpdatePayload = {
        action: 'updateUser',
        id: formData.id,
        name: formData.name,
        email: formData.email,
        type: formData.type,
      }
      
      // Only include password if one was provided
      if (formData.password) {
        userData.password = formData.password // Server will handle hashing
      }
      
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsEditing(false)
        setFormData(initialFormData)
        fetchUsers()
      } else {
        setError(result.error || 'Failed to save user')
      }
    } catch (err) {
      setError('An error occurred while saving the user')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (user: UserData) => {
    setFormData({
      id: user.id,
      name: user.name || "",
      email: user.email,
      type: user.type,
      password: "",
      confirmPassword: ""
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin?resource=user&id=${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUsers(users.filter(user => user.id !== id))
        setConfirmDelete(null)
      } else {
        setError(result.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('An error occurred while deleting the user')
      console.error(err)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setFormData(initialFormData)
    setFormErrors({})
  }

  // If loading
  if (loading && users.length === 0) {
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
        <h2 className="text-xl font-semibold mb-2">User Management</h2>
        <p className="text-muted-foreground">
          Manage users who can access the system. Administrators have full access to all features including this admin panel.
        </p>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {/* User Form - Add/Edit */}
      {isEditing ? (
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-medium mb-4">
            {formData.id ? "Edit User" : "Add New User"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="user-name"
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="Full name"
              required
            />
            
            <InputField
              id="user-email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={formErrors.email}
              placeholder="Email address"
              required
            />
            
            <SelectField
              id="user-type"
              label="User Type"
              options={userTypeOptions}
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value as "user" | "admin")}
              error={formErrors.type}
              required
            />
            
            <InputField
              id="user-password"
              label={formData.id ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={formErrors.password}
              placeholder="••••••••"
              required={!formData.id}
            />
            
            <InputField
              id="user-confirm-password"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              error={formErrors.confirmPassword}
              placeholder="••••••••"
              required={!formData.id || formData.password.length > 0}
            />
            
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
                {formData.id ? "Update User" : "Add User"}
              </FormButton>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <button
            onClick={fetchUsers}
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
            <span>Add User</span>
          </button>
        </div>
      )}
      
      {/* Users List */}
      {users.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted text-muted-foreground text-left">
                <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-card/60 transition-colors">
                  <td className="px-4 py-3">{user.name || "-"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.type === "admin" ? (
                      <div className="flex items-center gap-1 text-primary">
                        <Shield size={14} />
                        <span>Administrator</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User size={14} />
                        <span>Regular User</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {confirmDelete === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-outline border-red-500 text-red-500 hover:bg-red-500/10 text-sm px-2 py-1"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                          title="Edit user"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-1.5 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete user"
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
      ) : (
        !isEditing && (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Users Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your first user to give them access to the system.
            </p>
            <button
              onClick={() => {
                setFormData(initialFormData)
                setIsEditing(true)
              }}
              className="btn-primary"
            >
              Add First User
            </button>
          </div>
        )
      )}
      
      {/* Hints and suggestions */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <h4 className="font-medium mb-1">User Management Tips:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Administrator:</strong> Can access this admin panel and manage all aspects of the system</li>
          <li><strong>Regular User:</strong> Can only access the chat functionality</li>
          <li><strong>Passwords:</strong> For security, passwords are securely hashed before being stored</li>
          <li><strong>Editing:</strong> When editing a user, leave the password blank to keep the current password</li>
        </ul>
      </div>
    </div>
  )
}