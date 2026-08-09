"use client"

/**
 * ActiveSpaceProvider — single source of truth for cross-component
 * "Enter the Space™" interactions.
 *
 * Responsibilities (and ONLY these):
 *  1. Track which block's accordion should be force-expanded right now.
 *  2. Track a transient highlight so the newly-expanded block visibly glows.
 *  3. Own the one genuine gated transition on the platform — Monday's
 *     Reflection Space™ → Alignment Space™ countdown to 9:45 AM — so there
 *     is exactly one ticking clock for it instead of one per component.
 *  4. Expose `enterSpace()`, the single scroll + expand action used by the
 *     Hero CTA, the Welcome CTA, and the "Enter Alignment Space™" button
 *     inside ReflectionSpace once it unlocks.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

const HIGHLIGHT_MS = 1600

function getSecondsUntil945(): number {
  const now = new Date()
  const target = new Date(now)
  target.setHours(9, 45, 0, 0)
  const diff = Math.floor((target.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

export interface ActiveSpaceApi {
  expandBlockId: string | null
  highlightBlockId: string | null
  reflectionComplete: boolean
  setReflectionComplete: (done: boolean) => void
  secondsUntilAlignment: number
  alignmentUnlocked: boolean
  enterSpace: (blockId: string, sectionId: string) => void
}

const ActiveSpaceContext = createContext<ActiveSpaceApi | null>(null)

export function ActiveSpaceProvider({ children }: { children: ReactNode }) {
  const [expandBlockId, setExpandBlockId] = useState<string | null>(null)
  const [highlightBlockId, setHighlightBlockId] = useState<string | null>(null)
  const [reflectionComplete, setReflectionComplete] = useState(false)
  const [secondsUntilAlignment, setSecondsUntilAlignment] = useState(0)
  const [alignmentUnlocked, setAlignmentUnlocked] = useState(false)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Single shared 9:45 AM countdown for the Monday gate.
  useEffect(() => {
    const tick = () => {
      const s = getSecondsUntil945()
      setSecondsUntilAlignment(s)
      if (s === 0) setAlignmentUnlocked(true)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    }
  }, [])

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
      reflectionComplete,
      setReflectionComplete,
      secondsUntilAlignment,
      alignmentUnlocked,
      enterSpace,
    }),
    [expandBlockId, highlightBlockId, reflectionComplete, secondsUntilAlignment, alignmentUnlocked, enterSpace],
  )

  return <ActiveSpaceContext.Provider value={value}>{children}</ActiveSpaceContext.Provider>
}

/** Read the shared "Enter the Space™" state. Returns `null` outside the provider. */
export function useActiveSpace(): ActiveSpaceApi | null {
  return useContext(ActiveSpaceContext)
}
