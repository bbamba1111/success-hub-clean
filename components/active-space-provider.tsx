"use client"

/**
 * ActiveSpaceProvider — single source of truth for cross-component
 * "Enter the Space™" interactions.
 *
 * Responsibilities (and ONLY these):
 *  1. Track which block's accordion should be force-expanded right now.
 *  2. Track a transient highlight so the newly-expanded block visibly glows.
 *  3. Expose `enterSpace()`, the single scroll + expand action used by the
 *     Hero CTA, the Welcome CTA, and in-flow "Enter ___ Space™" buttons
 *     (e.g. Reflection Space™ → Work-Life Balance Debrief™).
 *
 * Monday's morning now runs in strict chronological order (Morning GIV•EN™
 * → Reality Check™ → Debrief™ → Movement™), so there is no gated countdown
 * transition anymore — every hand-off is a direct `enterSpace()` call.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

const HIGHLIGHT_MS = 1600

/**
 * The accordion's open animation (AnimatePresence, see business-day-block.tsx)
 * takes ~800ms. We re-run the scroll once it settles so the newly-revealed
 * content — not the still-collapsed card header — ends up at the top of the
 * viewport. Padded slightly beyond 800ms for render/paint slack.
 */
const EXPAND_ANIMATION_MS = 900

export interface ActiveSpaceApi {
  expandBlockId: string | null
  highlightBlockId: string | null
  /** Set when a block should force-close (e.g. collapsing a prior segment on hand-off). */
  collapseBlockId: string | null
  enterSpace: (blockId: string, sectionId: string) => void
}

const ActiveSpaceContext = createContext<ActiveSpaceApi | null>(null)

export function ActiveSpaceProvider({ children }: { children: ReactNode }) {
  const [expandBlockId, setExpandBlockId] = useState<string | null>(null)
  const [highlightBlockId, setHighlightBlockId] = useState<string | null>(null)
  const [collapseBlockId] = useState<string | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const correctionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enterSpace = useCallback((blockId: string, sectionId: string) => {
    setExpandBlockId(blockId)
    setHighlightBlockId(blockId)

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => setHighlightBlockId(null), HIGHLIGHT_MS)

    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    // Two-pass scroll: the accordion below hasn't expanded yet on the same
    // tick as this click, so scroll once now (double-RAF lets the `setOpen`
    // state above commit and paint first), then again once the ~800ms open
    // animation has fully settled — that second pass is what actually lands
    // the member on the revealed content instead of the still-collapsing card.
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToSection)
    })

    if (correctionTimerRef.current) clearTimeout(correctionTimerRef.current)
    correctionTimerRef.current = setTimeout(scrollToSection, EXPAND_ANIMATION_MS)
  }, [])

  const value = useMemo<ActiveSpaceApi>(
    () => ({
      expandBlockId,
      highlightBlockId,
      collapseBlockId,
      enterSpace,
    }),
    [expandBlockId, highlightBlockId, collapseBlockId, enterSpace],
  )

  return <ActiveSpaceContext.Provider value={value}>{children}</ActiveSpaceContext.Provider>
}

/** Read the shared "Enter the Space™" state. Returns `null` outside the provider. */
export function useActiveSpace(): ActiveSpaceApi | null {
  return useContext(ActiveSpaceContext)
}
