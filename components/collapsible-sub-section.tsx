"use client"

/**
 * CollapsibleSubSection — shared accordion-style panel used both inside
 * Decide & Design™ (`DebriefSpace`) and inside the real segment cards
 * (`TodaysMovementCard`, `TodaysLunchCard`, `PowerDownReleaseCard`) so a
 * founder can pop open a Step 1 intention setter without leaving the space
 * she's currently in.
 *
 * Supports two usage modes:
 *   - Uncontrolled — pass `defaultOpen` and it manages its own open state
 *     (used by `DebriefSpace`'s weekly-menu collapsibles).
 *   - Controlled — pass `open` + `onOpenChange` so a parent card can expand
 *     it programmatically (e.g. "Change My Intention™" buttons).
 */

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

export function CollapsibleSubSection({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  containerClassName,
  headerHoverClassName,
}: {
  title: string
  children: ReactNode | ((open: boolean) => ReactNode)
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Overrides the default border/background — used to give a group of tabs varying accent shades. */
  containerClassName?: string
  /** Overrides the default header hover background — pairs with `containerClassName`. */
  headerHoverClassName?: string
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const toggle = () => {
    const next = !open
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${containerClassName ?? "border-[#E8DFE2] bg-[#FDFBF9]"}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${headerHoverClassName ?? "hover:bg-[#F7F3EE]"}`}
      >
        <span className="font-sans text-sm font-semibold text-[#2E1F27]">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#6B5860] transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-[#E8DFE2] px-5 py-5">
          {typeof children === "function" ? children(open) : children}
        </div>
      )}
    </div>
  )
}
