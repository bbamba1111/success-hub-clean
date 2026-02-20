import type React from "react"

// Create a ButtonLink component that combines Button styling with anchor functionality
export const ButtonLink = ({
  href,
  className,
  children,
}: { href: string; className?: string; children: React.ReactNode }) => {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full ${className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
