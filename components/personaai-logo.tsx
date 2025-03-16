import type { HTMLProps } from "react"

export interface Props extends HTMLProps<SVGSVGElement> {
  size?: number
}

export default function PersonaAILogo({ height = 20, ...props }: Props) {
  return (
    <svg role="img" height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" fill="none" {...props}>
      <image href="/anime-verse-logo.svg" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" />
    </svg>
  )
}

