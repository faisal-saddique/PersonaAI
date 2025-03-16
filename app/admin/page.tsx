"use client"

import type React from "react"
import { useState } from "react"
import {
  InputField,
  TextareaField,
  SelectField,
  RadioGroup,
  CheckboxGroup,
  FormSection,
  ConditionalField,
  FormButton,
} from "../../components/form-components"

interface FormData {
  // Personal Information
  fullName: string
  age: string
  residence: string
  passion: string

  // Football Information
  idol: string
  characterTraits: string[]
  otherTrait: string
  footballClub: string
  footballKnowledge: string
  professionalExperience: string
  professionalExperienceDetails: string

  // Playing Style
  primaryPosition: string
  otherPrimaryPosition: string
  secondaryPosition: string
  otherSecondaryPosition: string
  playingStyleDescription: string

  // Ambition & Motivation
  ambition: string
  firstMotivation: string
  memorableMoment: string

  // Challenges & Growth
  facedJudgment: string
  judgmentReaction: string
  physicalChanges: string
  physicalChangesDescription: string

  // Health & Well-being
  specificDiet: string
  dietHabits: string
  preMealMatch: string
  recoveryRoutine: string
  relaxationActivities: string
  injuryHandling: string

  // Pressure & Challenges
  genderSuccess: string
  genderSuccessReaction: string
  pressureHandling: string

  // Future Goals
  tenYearVision: string
  changeForGirls: string

  // Support System
  parentalSupport: string
  parentalSupportImpact: string
  bestAdvice: string
}

const initialFormData: FormData = {
  fullName: "",
  age: "",
  residence: "",
  passion: "Football",
  idol: "",
  characterTraits: [],
  otherTrait: "",
  footballClub: "",
  footballKnowledge: "",
  professionalExperience: "",
  professionalExperienceDetails: "",
  primaryPosition: "",
  otherPrimaryPosition: "",
  secondaryPosition: "",
  otherSecondaryPosition: "",
  playingStyleDescription: "",
  ambition: "",
  firstMotivation: "",
  memorableMoment: "",
  facedJudgment: "",
  judgmentReaction: "",
  physicalChanges: "",
  physicalChangesDescription: "",
  specificDiet: "",
  dietHabits: "",
  preMealMatch: "",
  recoveryRoutine: "",
  relaxationActivities: "",
  injuryHandling: "",
  genderSuccess: "",
  genderSuccessReaction: "",
  pressureHandling: "",
  tenYearVision: "",
  changeForGirls: "",
  parentalSupport: "",
  parentalSupportImpact: "",
  bestAdvice: "",
}

const positionOptions = [
  { value: "attacking_midfielder", label: "Attacking Midfielder" },
  { value: "winger", label: "Winger" },
  { value: "defender", label: "Defender" },
  { value: "striker", label: "Striker" },
  { value: "goalkeeper", label: "Goalkeeper" },
  { value: "other", label: "Other" },
]

const characterTraitOptions = [
  { value: "determined", label: "Determined" },
  { value: "lively", label: "Lively" },
  { value: "persevering", label: "Persevering" },
  { value: "self_demanding", label: "Self-demanding" },
  { value: "other", label: "Other" },
]

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]

const parentalSupportOptions = [
  { value: "strongly_supportive", label: "Strongly Supportive" },
  { value: "somewhat_supportive", label: "Somewhat Supportive" },
  { value: "not_supportive", label: "Not Supportive" },
]

function AdminPage() {
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
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 100) {
      newErrors.age = "Age must be between 1 and 100"
    }
    if (!formData.residence) newErrors.residence = "Place of residence is required"
    if (!formData.footballKnowledge) newErrors.footballKnowledge = "Football knowledge is required"
    if (!formData.playingStyleDescription) newErrors.playingStyleDescription = "Playing style description is required"
    if (!formData.firstMotivation) newErrors.firstMotivation = "First motivation is required"
    if (!formData.memorableMoment) newErrors.memorableMoment = "Memorable moment is required"
    if (!formData.recoveryRoutine) newErrors.recoveryRoutine = "Recovery routine is required"
    if (!formData.relaxationActivities) newErrors.relaxationActivities = "Relaxation activities are required"
    if (!formData.injuryHandling) newErrors.injuryHandling = "Injury handling information is required"
    if (!formData.pressureHandling) newErrors.pressureHandling = "Pressure handling information is required"
    if (!formData.tenYearVision) newErrors.tenYearVision = "Future vision is required"
    if (!formData.changeForGirls) newErrors.changeForGirls = "Change for girls in sports is required"
    if (!formData.parentalSupportImpact) newErrors.parentalSupportImpact = "Parental support impact is required"
    if (!formData.bestAdvice) newErrors.bestAdvice = "Best advice received is required"

    // Conditional validations
    if (formData.professionalExperience === "yes" && !formData.professionalExperienceDetails) {
      newErrors.professionalExperienceDetails = "Please provide details about your professional experience"
    }

    if (formData.primaryPosition === "other" && !formData.otherPrimaryPosition) {
      newErrors.otherPrimaryPosition = "Please specify your primary position"
    }

    if (formData.secondaryPosition === "other" && !formData.otherSecondaryPosition) {
      newErrors.otherSecondaryPosition = "Please specify your secondary position"
    }

    if (formData.characterTraits.includes("other") && !formData.otherTrait) {
      newErrors.otherTrait = "Please specify your other character trait"
    }

    if (formData.facedJudgment === "yes" && !formData.judgmentReaction) {
      newErrors.judgmentReaction = "Please describe your reaction to judgment"
    }

    if (formData.physicalChanges === "yes" && !formData.physicalChangesDescription) {
      newErrors.physicalChangesDescription = "Please describe the physical changes"
    }

    if (formData.specificDiet === "yes" && !formData.dietHabits) {
      newErrors.dietHabits = "Please describe your diet habits"
    }

    if (formData.genderSuccess === "yes" && !formData.genderSuccessReaction) {
      newErrors.genderSuccessReaction = "Please describe your reaction"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", formData)
        setIsSubmitting(false)
        setIsSubmitted(true)
      }, 1500)
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
          Thank you for submitting your player profile. We have received your information.
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
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-4">Player Profile Form</h1>
        <p className="text-muted-foreground">
          Complete the form below to create your player profile. Fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <FormSection title="1. Personal Information">
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
            max={100}
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
            label="Passion (Sport/Activity)"
            value={formData.passion}
            onChange={(e) => updateFormData("passion", e.target.value)}
            error={errors.passion}
          />
        </FormSection>

        {/* Football Information */}
        <FormSection title="2. Football Information">
          <InputField
            id="idol"
            label="Idol/Role Model"
            value={formData.idol}
            onChange={(e) => updateFormData("idol", e.target.value)}
            placeholder="e.g., Kylian Mbappé"
          />

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
            id="footballClub"
            label="Football Club"
            value={formData.footballClub}
            onChange={(e) => updateFormData("footballClub", e.target.value)}
            placeholder="Optional"
          />

          <TextareaField
            id="footballKnowledge"
            label="Football Knowledge"
            value={formData.footballKnowledge}
            onChange={(e) => updateFormData("footballKnowledge", e.target.value)}
            error={errors.footballKnowledge}
            required
            placeholder="Describe your knowledge of football..."
          />

          <RadioGroup
            label="Experience in Professional Training Camps?"
            name="professionalExperience"
            options={yesNoOptions}
            value={formData.professionalExperience}
            onChange={(value) => updateFormData("professionalExperience", value)}
            error={errors.professionalExperience}
          />

          <ConditionalField show={formData.professionalExperience === "yes"}>
            <TextareaField
              id="professionalExperienceDetails"
              label="Details of Professional Experience"
              value={formData.professionalExperienceDetails}
              onChange={(e) => updateFormData("professionalExperienceDetails", e.target.value)}
              error={errors.professionalExperienceDetails}
              placeholder="Describe your experience..."
            />
          </ConditionalField>
        </FormSection>

        {/* Playing Style */}
        <FormSection title="3. Playing Style">
          <SelectField
            id="primaryPosition"
            label="Primary Position"
            options={positionOptions}
            value={formData.primaryPosition}
            onChange={(e) => updateFormData("primaryPosition", e.target.value)}
            error={errors.primaryPosition}
            required
          />

          <ConditionalField show={formData.primaryPosition === "other"}>
            <InputField
              id="otherPrimaryPosition"
              label="Specify Other Primary Position"
              value={formData.otherPrimaryPosition}
              onChange={(e) => updateFormData("otherPrimaryPosition", e.target.value)}
              error={errors.otherPrimaryPosition}
            />
          </ConditionalField>

          <SelectField
            id="secondaryPosition"
            label="Secondary Position (If Any)"
            options={positionOptions}
            value={formData.secondaryPosition}
            onChange={(e) => updateFormData("secondaryPosition", e.target.value)}
          />

          <ConditionalField show={formData.secondaryPosition === "other"}>
            <InputField
              id="otherSecondaryPosition"
              label="Specify Other Secondary Position"
              value={formData.otherSecondaryPosition}
              onChange={(e) => updateFormData("otherSecondaryPosition", e.target.value)}
              error={errors.otherSecondaryPosition}
            />
          </ConditionalField>

          <TextareaField
            id="playingStyleDescription"
            label="Playing Style Description"
            value={formData.playingStyleDescription}
            onChange={(e) => updateFormData("playingStyleDescription", e.target.value)}
            error={errors.playingStyleDescription}
            required
            placeholder="Describe your playing style..."
          />
        </FormSection>

        {/* Ambition & Motivation */}
        <FormSection title="4. Ambition & Motivation">
          <TextareaField
            id="ambition"
            label="Ambition in Football"
            value={formData.ambition}
            onChange={(e) => updateFormData("ambition", e.target.value)}
            placeholder="e.g., To become team captain and play for the national team"
          />

          <TextareaField
            id="firstMotivation"
            label="First Motivation to Play Football"
            value={formData.firstMotivation}
            onChange={(e) => updateFormData("firstMotivation", e.target.value)}
            error={errors.firstMotivation}
            required
            placeholder="What motivated you to start playing football?"
          />

          <TextareaField
            id="memorableMoment"
            label="First Memorable Moment in Football"
            value={formData.memorableMoment}
            onChange={(e) => updateFormData("memorableMoment", e.target.value)}
            error={errors.memorableMoment}
            required
            placeholder="Describe your first memorable moment in football..."
          />
        </FormSection>

        {/* Challenges & Growth */}
        <FormSection title="5. Challenges & Growth">
          <RadioGroup
            label="Ever Faced Judgment for Playing as a Girl?"
            name="facedJudgment"
            options={yesNoOptions}
            value={formData.facedJudgment}
            onChange={(value) => updateFormData("facedJudgment", value)}
          />

          <ConditionalField show={formData.facedJudgment === "yes"}>
            <TextareaField
              id="judgmentReaction"
              label="Reaction to Judgment"
              value={formData.judgmentReaction}
              onChange={(e) => updateFormData("judgmentReaction", e.target.value)}
              error={errors.judgmentReaction}
              placeholder="How did you react to this judgment?"
            />
          </ConditionalField>

          <RadioGroup
            label="Physical Changes Since Playing Football?"
            name="physicalChanges"
            options={yesNoOptions}
            value={formData.physicalChanges}
            onChange={(value) => updateFormData("physicalChanges", value)}
          />

          <ConditionalField show={formData.physicalChanges === "yes"}>
            <TextareaField
              id="physicalChangesDescription"
              label="Describe Adaptation to Physical Changes"
              value={formData.physicalChangesDescription}
              onChange={(e) => updateFormData("physicalChangesDescription", e.target.value)}
              error={errors.physicalChangesDescription}
              placeholder="How have you adapted to these physical changes?"
            />
          </ConditionalField>
        </FormSection>

        {/* Health & Well-being */}
        <FormSection title="6. Health & Well-being">
          <RadioGroup
            label="Do You Follow a Specific Diet?"
            name="specificDiet"
            options={yesNoOptions}
            value={formData.specificDiet}
            onChange={(value) => updateFormData("specificDiet", value)}
          />

          <ConditionalField show={formData.specificDiet === "yes"}>
            <TextareaField
              id="dietHabits"
              label="Describe Diet Habits"
              value={formData.dietHabits}
              onChange={(e) => updateFormData("dietHabits", e.target.value)}
              error={errors.dietHabits}
              placeholder="Describe your diet habits..."
            />
          </ConditionalField>

          <InputField
            id="preMealMatch"
            label="Favorite Pre-Match Meal?"
            value={formData.preMealMatch}
            onChange={(e) => updateFormData("preMealMatch", e.target.value)}
          />

          <TextareaField
            id="recoveryRoutine"
            label="Recovery Routine After Matches/Training"
            value={formData.recoveryRoutine}
            onChange={(e) => updateFormData("recoveryRoutine", e.target.value)}
            error={errors.recoveryRoutine}
            required
            placeholder="Describe your recovery routine..."
          />

          <TextareaField
            id="relaxationActivities"
            label="Favorite Relaxation Activities Outside Football"
            value={formData.relaxationActivities}
            onChange={(e) => updateFormData("relaxationActivities", e.target.value)}
            error={errors.relaxationActivities}
            required
            placeholder="What activities help you relax outside of football?"
          />

          <TextareaField
            id="injuryHandling"
            label="How Do You Handle Injuries or Fatigue?"
            value={formData.injuryHandling}
            onChange={(e) => updateFormData("injuryHandling", e.target.value)}
            error={errors.injuryHandling}
            required
            placeholder="Describe how you handle injuries or fatigue..."
          />
        </FormSection>

        {/* Dealing with Pressure & Challenges */}
        <FormSection title="7. Dealing with Pressure & Challenges">
          <RadioGroup
            label="Ever Been Told You Can't Succeed Because of Gender?"
            name="genderSuccess"
            options={yesNoOptions}
            value={formData.genderSuccess}
            onChange={(value) => updateFormData("genderSuccess", value)}
          />

          <ConditionalField show={formData.genderSuccess === "yes"}>
            <TextareaField
              id="genderSuccessReaction"
              label="Reaction to It"
              value={formData.genderSuccessReaction}
              onChange={(e) => updateFormData("genderSuccessReaction", e.target.value)}
              error={errors.genderSuccessReaction}
              placeholder="How did you react to this?"
            />
          </ConditionalField>

          <TextareaField
            id="pressureHandling"
            label="How Do You Handle Performance Pressure?"
            value={formData.pressureHandling}
            onChange={(e) => updateFormData("pressureHandling", e.target.value)}
            error={errors.pressureHandling}
            required
            placeholder="Describe how you handle performance pressure..."
          />
        </FormSection>

        {/* Future Goals & Sports Impact */}
        <FormSection title="8. Future Goals & Sports Impact">
          <TextareaField
            id="tenYearVision"
            label="Where Do You See Yourself in 10 Years?"
            value={formData.tenYearVision}
            onChange={(e) => updateFormData("tenYearVision", e.target.value)}
            error={errors.tenYearVision}
            required
            placeholder="Describe your vision for the future..."
          />

          <TextareaField
            id="changeForGirls"
            label="One Thing You Would Change for Girls in Sports?"
            value={formData.changeForGirls}
            onChange={(e) => updateFormData("changeForGirls", e.target.value)}
            error={errors.changeForGirls}
            required
            placeholder="What would you change for girls in sports?"
          />
        </FormSection>

        {/* Personal Life & Support System */}
        <FormSection title="9. Personal Life & Support System">
          <RadioGroup
            label="Parental Support in Sports"
            name="parentalSupport"
            options={parentalSupportOptions}
            value={formData.parentalSupport}
            onChange={(value) => updateFormData("parentalSupport", value)}
          />

          <TextareaField
            id="parentalSupportImpact"
            label="Impact of Parental Support on Your Journey"
            value={formData.parentalSupportImpact}
            onChange={(e) => updateFormData("parentalSupportImpact", e.target.value)}
            error={errors.parentalSupportImpact}
            required
            placeholder="Describe the impact of parental support on your journey..."
          />

          <TextareaField
            id="bestAdvice"
            label="Best Advice You've Received About Football?"
            value={formData.bestAdvice}
            onChange={(e) => updateFormData("bestAdvice", e.target.value)}
            error={errors.bestAdvice}
            required
            placeholder="What's the best advice you've received about football?"
          />
        </FormSection>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <FormButton type="submit" isLoading={isSubmitting} className="px-8 py-3 text-base">
            Submit Player Profile
          </FormButton>
        </div>
      </form>
    </div>
  )
}

export default function AdminPageWrapper() {
  return <AdminPage />
}

