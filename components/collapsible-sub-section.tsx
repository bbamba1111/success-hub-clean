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

import { useRef, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

export function CollapsibleSubSection({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  /**
   * When true, children stay mounted while collapsed (hidden with CSS) so any
   * unsaved draft state inside a segment survives collapse/reopen. Defaults to
   * true because the Business Day™ segment forms (Movement, Lunch, Power Down)
   * hold local draft state that must not reset when the founder pops a section
   * closed. Pass `false` for heavy render-only content that is safe to unmount.
   */
  keepMounted = true,
}: {
  title: string
  children: ReactNode | ((open: boolean) => ReactNode)
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  keepMounted?: boolean
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  // Once opened, remember that we've mounted the content so keepMounted can
  // hide-not-unmount it thereafter (avoids paying the first render until the
  // founder actually opens the section).
  const hasOpened = useRef(false)
  if (open) hasOpened.current = true

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
      {keepMounted
        ? hasOpened.current && (
            <div hidden={!open} className="border-t border-[#7FB069]/20 bg-white px-5 py-5">
              {typeof children === "function" ? children(open) : children}
            </div>
          )
        : open && (
            <div className="border-t border-[#7FB069]/20 bg-white px-5 py-5">
              {typeof children === "function" ? children(open) : children}
            </div>
          )}
    </div>
  )
}
