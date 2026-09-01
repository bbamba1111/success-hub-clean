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
}: {
  title: string
  children: ReactNode | ((open: boolean) => ReactNode)
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
    // Closed = soft sage green accent. Open ("selected") = white content
    // panel with a darker-sage header, so the active segment reads clearly
    // against its still-closed siblings.
    <div
      className={`rounded-2xl border overflow-hidden transition-colors ${
        open ? "border-[#7FB069] bg-white" : "border-[#BFDDA8] bg-[#EEF6E7]"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
          open ? "bg-[#5F8F47] hover:bg-[#548039]" : "hover:bg-[#E1EFD5]"
        }`}
      >
        <span className={`font-sans text-sm font-semibold ${open ? "text-white" : "text-[#2E1F27]"}`}>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180 text-white" : "text-[#6B5860]"}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-[#7FB069]/20 bg-white px-5 py-5">
          {typeof children === "function" ? children(open) : children}
        </div>
      )}
    </div>
  )
}
