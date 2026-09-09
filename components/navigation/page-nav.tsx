"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"

/**
 * Visual Design System™ navigation primitives (Phase 5.4.2).
 *
 * Consistent, restrained wayfinding across every workspace so members always
 * know how to move up a level (Back) or leave an overlay (Close). Editorial and
 * quiet — never competing with Cherry Blossom or the primary action.
 */

export interface BackLinkProps {
  /** Where "up a level" goes. Omit to fall back to browser history. */
  href?: string
  /** Label after the arrow. Defaults to "Back". */
  label?: string
  className?: string
}

/** ← Back — use whenever navigation moves down a level into a sub-view. */
export function BackLink({ href, label = "Back", className = "" }: BackLinkProps) {
  const router = useRouter()

  const classes =
    "inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink-soft ds-transition hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"

  const content = (
    <>
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {label}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${classes} ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={() => router.back()} className={`${classes} ${className}`}>
      {content}
    </button>
  )
}

export interface CloseButtonProps {
  /** Called when the member closes the overlay/dialog/planner. */
  onClose?: () => void
  /** Where to navigate on close instead of calling onClose. */
  href?: string
  /** Accessible label. Defaults to "Close". */
  label?: string
  className?: string
}

/** ✕ Close — use for overlays, full-screen planners, dialogs, and modals. */
export function CloseButton({ onClose, href, label = "Close", className = "" }: CloseButtonProps) {
  const router = useRouter()

  const classes =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-card text-brand-ink-soft shadow-ds-sm ds-transition hover:text-brand-ink hover:shadow-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  const handleClick = () => {
    if (onClose) return onClose()
    if (href) return router.push(href)
    return router.back()
  }

  return (
    <button type="button" onClick={handleClick} aria-label={label} className={`${classes} ${className}`}>
      <X className="h-4 w-4" aria-hidden />
    </button>
  )
}
