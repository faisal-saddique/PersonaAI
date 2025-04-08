"use client"

import type React from "react"
import { useState } from "react"
import {
  InputField,
  TextareaField,
  SelectField,
  CheckboxGroup,
  FormSection,
  ConditionalField,
  FormButton,
} from "../../components/form-components"

interface FormData {
  // Basic Information
  fullName: string
  age: string
  residence: string
  passion: string

  // Personality & Traits
  characterTraits: string[]
  otherTrait: string
  roleModel: string
  personalValues: string

  // Skills & Experience
  expertise: string
  experienceLevel: string
  achievements: string
  dailyRoutine: string

  // Challenges & Growth
  obstacles: string
  overcomingChallenges: string
  handlingPressure: string

  // Future Goals & Aspirations
  tenYearVision: string
  fieldChange: string
  bestAdvice: string

  conversationStarter1: string;
  conversationStarter2: string;
  conversationStarter3: string;
  conversationStarter4: string;
}

const initialFormData: FormData = {
  fullName: "",
  age: "",
  residence: "",
  passion: "",
  characterTraits: [],
  otherTrait: "",
  roleModel: "",
  personalValues: "",
  expertise: "",
  experienceLevel: "",
  achievements: "",
  dailyRoutine: "",
  obstacles: "",
  overcomingChallenges: "",
  handlingPressure: "",
  tenYearVision: "",
  fieldChange: "",
  bestAdvice: "",
  // Conversation Starters
  conversationStarter1: "",
  conversationStarter2: "",
  conversationStarter3: "",
  conversationStarter4: "",
}

const characterTraitOptions = [
  { value: "determined", label: "Determined" },
  { value: "creative", label: "Creative" },
  { value: "analytical", label: "Analytical" },
  { value: "kind", label: "Kind" },
  { value: "persevering", label: "Persevering" },
  { value: "self_demanding", label: "Self-demanding" },
  { value: "other", label: "Other" },
]

const experienceLevelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
]

export default function PersonaProfileForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    // Required fields validation
    if (!formData.fullName) newErrors.fullName = "Full name is required"
    if (!formData.age) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = "Age must be between 1 and 120"
    }
    if (!formData.residence) newErrors.residence = "Place of residence is required"
    if (!formData.passion) newErrors.passion = "Passion/Interest is required"
    if (!formData.personalValues) newErrors.personalValues = "Personal values are required"
    if (!formData.expertise) newErrors.expertise = "Field of expertise is required"
    if (!formData.experienceLevel) newErrors.experienceLevel = "Experience level is required"
    if (!formData.achievements) newErrors.achievements = "Achievements information is required"
    if (!formData.dailyRoutine) newErrors.dailyRoutine = "Daily routine is required"
    if (!formData.obstacles) newErrors.obstacles = "Obstacles information is required"
    if (!formData.overcomingChallenges) newErrors.overcomingChallenges = "Information about overcoming challenges is required"
    if (!formData.handlingPressure) newErrors.handlingPressure = "Information about handling pressure is required"
    if (!formData.tenYearVision) newErrors.tenYearVision = "Future vision is required"
    if (!formData.fieldChange) newErrors.fieldChange = "Field change information is required"
    if (!formData.bestAdvice) newErrors.bestAdvice = "Best advice received is required"
    // Add this to your validateForm function
    if (!formData.conversationStarter1) newErrors.conversationStarter1 = "At least one conversation starter is required"
    // Conditional validations
    if (formData.characterTraits.includes("other") && !formData.otherTrait) {
      newErrors.otherTrait = "Please specify your other character trait"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (validateForm()) {
      setIsSubmitting(true)
  
      try {
        const response = await fetch('/api/admin', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
  
        const result = await response.json()
        
        if (result.success) {
          setIsSubmitted(true)
        } else {
          // Handle error
          console.error('Error submitting form:', result.error)
          alert('There was an error submitting the form. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('There was an error submitting the form. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-card rounded-xl shadow-md mt-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Form Submitted Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for submitting your persona profile. We have received your information.
        </p>
        <FormButton
          onClick={() => {
            setFormData(initialFormData)
            setIsSubmitted(false)
          }}
        >
          Submit Another Profile
        </FormButton>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Persona Profile Form</h1>
        <p className="text-muted-foreground">
          Complete the form below to create a comprehensive persona profile. Fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <FormSection title="1. Basic Information">
          <InputField
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
            error={errors.fullName}
            required
          />

          <InputField
            id="age"
            label="Age"
            type="number"
            min={1}
            max={120}
            value={formData.age}
            onChange={(e) => updateFormData("age", e.target.value)}
            error={errors.age}
            required
          />

          <InputField
            id="residence"
            label="Place of Residence"
            value={formData.residence}
            onChange={(e) => updateFormData("residence", e.target.value)}
            error={errors.residence}
            required
          />

          <InputField
            id="passion"
            label="Passion / Interest"
            value={formData.passion}
            onChange={(e) => updateFormData("passion", e.target.value)}
            error={errors.passion}
            placeholder="e.g., Football, Science, Music"
            required
          />
        </FormSection>

        {/* Personality & Traits */}
        <FormSection title="2. Personality & Traits">
          <CheckboxGroup
            label="Character Traits"
            options={characterTraitOptions}
            values={formData.characterTraits}
            onChange={(values) => updateFormData("characterTraits", values)}
            error={errors.characterTraits}
          />

          <ConditionalField show={formData.characterTraits.includes("other")}>
            <InputField
              id="otherTrait"
              label="Specify Other Trait"
              value={formData.otherTrait}
              onChange={(e) => updateFormData("otherTrait", e.target.value)}
              error={errors.otherTrait}
            />
          </ConditionalField>

          <InputField
            id="roleModel"
            label="Role Model / Inspiration"
            value={formData.roleModel}
            onChange={(e) => updateFormData("roleModel", e.target.value)}
            placeholder="Optional"
          />

          <TextareaField
            id="personalValues"
            label="Personal Values / Philosophy"
            value={formData.personalValues}
            onChange={(e) => updateFormData("personalValues", e.target.value)}
            error={errors.personalValues}
            required
            placeholder="Describe the principles or beliefs that guide your actions and decisions..."
          />
        </FormSection>

        {/* Skills & Experience */}
        <FormSection title="3. Skills & Experience">
          <InputField
            id="expertise"
            label="Field of Expertise / Talent"
            value={formData.expertise}
            onChange={(e) => updateFormData("expertise", e.target.value)}
            error={errors.expertise}
            required
            placeholder="e.g., Football, Painting, Entrepreneurship"
          />

          <SelectField
            id="experienceLevel"
            label="Experience Level"
            options={experienceLevelOptions}
            value={formData.experienceLevel}
            onChange={(e) => updateFormData("experienceLevel", e.target.value)}
            error={errors.experienceLevel}
            required
          />

          <TextareaField
            id="achievements"
            label="Notable Achievements or Training"
            value={formData.achievements}
            onChange={(e) => updateFormData("achievements", e.target.value)}
            error={errors.achievements}
            required
            placeholder="Describe significant accomplishments, awards, competitions, or special training..."
          />

          <TextareaField
            id="dailyRoutine"
            label="Daily Routine / Practice Habits"
            value={formData.dailyRoutine}
            onChange={(e) => updateFormData("dailyRoutine", e.target.value)}
            error={errors.dailyRoutine}
            required
            placeholder="Describe how you spend time improving your skills or pursuing your passion..."
          />
        </FormSection>

        {/* Challenges & Growth */}
        <FormSection title="4. Challenges & Growth">
          <TextareaField
            id="obstacles"
            label="Major Obstacles Faced"
            value={formData.obstacles}
            onChange={(e) => updateFormData("obstacles", e.target.value)}
            error={errors.obstacles}
            required
            placeholder="Describe significant personal, societal, or physical challenges you have faced..."
          />

          <TextareaField
            id="overcomingChallenges"
            label="How You Overcame Challenges"
            value={formData.overcomingChallenges}
            onChange={(e) => updateFormData("overcomingChallenges", e.target.value)}
            error={errors.overcomingChallenges}
            required
            placeholder="Describe the strategies, mindset, or support systems you used to overcome obstacles..."
          />

          <TextareaField
            id="handlingPressure"
            label="Handling Pressure & Setbacks"
            value={formData.handlingPressure}
            onChange={(e) => updateFormData("handlingPressure", e.target.value)}
            error={errors.handlingPressure}
            required
            placeholder="Describe how you cope with stress, failure, or setbacks and continue moving forward..."
          />
        </FormSection>

        {/* Future Goals & Aspirations */}
        <FormSection title="5. Future Goals & Aspirations">
          <TextareaField
            id="tenYearVision"
            label="Where Do You See Yourself in 10 Years?"
            value={formData.tenYearVision}
            onChange={(e) => updateFormData("tenYearVision", e.target.value)}
            error={errors.tenYearVision}
            required
            placeholder="Describe your vision for the future, including professional or personal milestones..."
          />

          <TextareaField
            id="fieldChange"
            label="What You Want to Change in Your Field"
            value={formData.fieldChange}
            onChange={(e) => updateFormData("fieldChange", e.target.value)}
            error={errors.fieldChange}
            required
            placeholder="Describe your vision for improvement in your field..."
          />

          <TextareaField
            id="bestAdvice"
            label="Advice You Follow / Best Lesson Learned"
            value={formData.bestAdvice}
            onChange={(e) => updateFormData("bestAdvice", e.target.value)}
            error={errors.bestAdvice}
            required
            placeholder="Share the most valuable advice you've received or lesson you've learned..."
          />
        </FormSection>

        {/* Conversation Starters */}
        <FormSection title="6. Conversation Starters">
          <p className="text-sm text-muted-foreground mb-4">
            Add four conversation starters that would naturally come from this persona to engage in meaningful dialogue.
          </p>
          <InputField
            id="conversationStarter1"
            label="Conversation Starter 1"
            value={formData.conversationStarter1}
            onChange={(e) => updateFormData("conversationStarter1", e.target.value)}
            error={errors.conversationStarter1}
            required
            placeholder="e.g., What inspired you to pursue this career path?"
          />
          <InputField
            id="conversationStarter2"
            label="Conversation Starter 2"
            value={formData.conversationStarter2}
            onChange={(e) => updateFormData("conversationStarter2", e.target.value)}
            placeholder="e.g., How do you balance your passion with other aspects of your life?"
          />
          <InputField
            id="conversationStarter3"
            label="Conversation Starter 3"
            value={formData.conversationStarter3}
            onChange={(e) => updateFormData("conversationStarter3", e.target.value)}
            placeholder="e.g., What's the biggest misconception people have about your field?"
          />
          <InputField
            id="conversationStarter4"
            label="Conversation Starter 4"
            value={formData.conversationStarter4}
            onChange={(e) => updateFormData("conversationStarter4", e.target.value)}
            placeholder="e.g., If you could change one thing about your industry, what would it be?"
          />
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <FormButton type="submit" isLoading={isSubmitting} className="px-8 py-3 text-base">
            Submit Persona Profile
          </FormButton>
        </div>
      </form>
    </div>
  )
}