import React from "react"

interface PesoIconProps {
  className?: string
}

export function PesoIcon({ className = "w-5 h-5" }: PesoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Peso sign (₱) */}
      <path d="M6 4v16" />
      <path d="M6 8h8a4 4 0 0 1 0 8H6" />
      <path d="M3 8h6" />
      <path d="M3 12h6" />
    </svg>
  )
}
