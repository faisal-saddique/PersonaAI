"use client"

import type React from "react"
import { forwardRef } from "react"
import cx from "../utils/cx"

// Input Field
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="text-sm font-medium text-foreground block">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
          <input
            ref={ref}
            className={cx(
              "input",
              icon ? "pl-10" : "pl-4",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              className,
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)
InputField.displayName = "InputField"

// Textarea Field
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="text-sm font-medium text-foreground block">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          ref={ref}
          className={cx(
            "input min-h-[100px]",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            className,
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)
TextareaField.displayName = "TextareaField"

// Select Field
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="text-sm font-medium text-foreground block">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <select
          ref={ref}
          className={cx(
            "input appearance-none",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            className,
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  },
)
SelectField.displayName = "SelectField"

// Checkbox Field
interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(({ label, className, ...props }, ref) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        ref={ref}
        className={cx("h-4 w-4 rounded border-border text-primary focus:ring-primary", className)}
        {...props}
      />
      <label htmlFor={props.id} className="text-sm text-foreground">
        {label}
      </label>
    </div>
  )
})
CheckboxField.displayName = "CheckboxField"

// Radio Group
interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, error, required }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
            />
            <label htmlFor={`${name}-${option.value}`} className="text-sm text-foreground">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

// Checkbox Group
interface CheckboxOption {
  value: string
  label: string
}

interface CheckboxGroupProps {
  label: string
  options: CheckboxOption[]
  values: string[]
  onChange: (values: string[]) => void
  error?: string
  required?: boolean
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, values, onChange, error, required }) => {
  const handleChange = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value))
    } else {
      onChange([...values, value])
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`checkbox-${option.value}`}
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor={`checkbox-${option.value}`} className="text-sm text-foreground">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

// Form Section
interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// Conditional Field
interface ConditionalFieldProps {
  show: boolean
  children: React.ReactNode
}

export const ConditionalField: React.FC<ConditionalFieldProps> = ({ show, children }) => {
  if (!show) return null
  return <div className="mt-2 ml-6">{children}</div>
}

// Form Button
interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  isLoading?: boolean
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  variant = "primary",
  isLoading,
  className,
  ...props
}) => {
  const baseClasses = "btn"
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
  }

  return (
    <button
      className={cx(baseClasses, variantClasses[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
}

