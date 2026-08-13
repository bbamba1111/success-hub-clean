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

  const enterSpace = useCallback((blockId: string, sectionId: string) => {
    setExpandBlockId(blockId)
    setHighlightBlockId(blockId)

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => setHighlightBlockId(null), HIGHLIGHT_MS)

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
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
