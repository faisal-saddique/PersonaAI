"use client"

import { type ComponentProps, forwardRef } from "react"
import { ArrowUp } from "lucide-react"
import cx from "../utils/cx"

export interface Props extends ComponentProps<"form"> {
  inputProps: ComponentProps<"input">
  buttonProps: ComponentProps<"button">
}

const Form = ({ inputProps, buttonProps, onSubmit }: Props, ref: any) => {
  return (
    <form onSubmit={onSubmit} className="relative w-full" ref={ref}>
      <div className="relative flex items-center">
        <input
          placeholder="Message your character..."
          required
          {...inputProps}
          className={cx(
            "input pl-4 pr-12 py-3 h-12 md:h-14 rounded-full",
            "text-base placeholder:text-muted-foreground/70",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            "transition-all duration-200",
            inputProps.disabled ? "opacity-70" : "",
          )}
          type="text"
        />

        <button
          {...buttonProps}
          type="submit"
          tabIndex={-1}
          className={cx(
            "absolute right-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 transition-colors",
            buttonProps.disabled ? "opacity-70 cursor-not-allowed" : "",
          )}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  )
}

export default forwardRef(Form)

