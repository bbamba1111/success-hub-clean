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
 *  5. Choreograph the ceremonial opening: once Reflection Space™ is
 *     complete, auto-scroll to the top of the page as the countdown enters
 *     its final 30 seconds, so the Hero itself becomes the "opens in
 *     30…29…1" moment — then, on `enterAlignmentCeremony()`, expand +
 *     highlight Morning GIV•EN™ and collapse Reflection Space™.
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
/** Ceremonial "opening countdown" window before Alignment Space™ unlocks. */
const OPENING_COUNTDOWN_SECONDS = 30

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
  /** Set when a block should force-close (used to collapse Reflection Space™ on ceremony entry). */
  collapseBlockId: string | null
  reflectionComplete: boolean
  setReflectionComplete: (done: boolean) => void
  secondsUntilAlignment: number
  alignmentUnlocked: boolean
  /**
   * True during the last `OPENING_COUNTDOWN_SECONDS` before Alignment Space™
   * unlocks (and while it's open but not yet entered) — the window during
   * which the Hero takes over with the ceremonial "Opens In" countdown /
   * "Now Open" CTA instead of its normal heading.
   */
  ceremonyActive: boolean
  /** True once the member has clicked "Enter Alignment Space™" — Hero returns to normal. */
  ceremonyEntered: boolean
  enterSpace: (blockId: string, sectionId: string) => void
  /** The one ceremonial "Enter Alignment Space™" action — expands + highlights
   *  morning-given, collapses Reflection Space™, and ends the ceremony. */
  enterAlignmentCeremony: (sectionId: string) => void
}

const ActiveSpaceContext = createContext<ActiveSpaceApi | null>(null)

export function ActiveSpaceProvider({ children }: { children: ReactNode }) {
  const [expandBlockId, setExpandBlockId] = useState<string | null>(null)
  const [highlightBlockId, setHighlightBlockId] = useState<string | null>(null)
  const [collapseBlockId, setCollapseBlockId] = useState<string | null>(null)
  const [reflectionComplete, setReflectionComplete] = useState(false)
  const [secondsUntilAlignment, setSecondsUntilAlignment] = useState(0)
  const [alignmentUnlocked, setAlignmentUnlocked] = useState(false)
  const [ceremonyEntered, setCeremonyEntered] = useState(false)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasScrolledForCeremonyRef = useRef(false)

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

  // Ceremonial entrance — the 30 seconds before Alignment Space™ opens.
  const ceremonyActive =
    reflectionComplete && !ceremonyEntered && secondsUntilAlignment <= OPENING_COUNTDOWN_SECONDS

  // The moment the ceremony window opens, return the member to the top of
  // the page — once — so they experience the Hero's opening countdown
  // instead of staying on the Reflection Space™ completion screen.
  useEffect(() => {
    if (ceremonyActive && !hasScrolledForCeremonyRef.current) {
      hasScrolledForCeremonyRef.current = true
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [ceremonyActive])

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
    }
  }, [])

  const enterSpace = useCallback((blockId: string, sectionId: string) => {
    setExpandBlockId(blockId)
    setHighlightBlockId(blockId)

    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    highlightTimerRef.current = setTimeout(() => setHighlightBlockId(null), HIGHLIGHT_MS)

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const enterAlignmentCeremony = useCallback(
    (sectionId: string) => {
      setCeremonyEntered(true)
      setCollapseBlockId("monday-reality-check")
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = setTimeout(() => setCollapseBlockId(null), HIGHLIGHT_MS)
      enterSpace("morning-given", sectionId)
    },
    [enterSpace],
  )

  const value = useMemo<ActiveSpaceApi>(
    () => ({
      expandBlockId,
      highlightBlockId,
      collapseBlockId,
      reflectionComplete,
      setReflectionComplete,
      secondsUntilAlignment,
      alignmentUnlocked,
      ceremonyActive,
      ceremonyEntered,
      enterSpace,
      enterAlignmentCeremony,
    }),
    [
      expandBlockId,
      highlightBlockId,
      collapseBlockId,
      reflectionComplete,
      secondsUntilAlignment,
      alignmentUnlocked,
      ceremonyActive,
      ceremonyEntered,
      enterSpace,
      enterAlignmentCeremony,
    ],
  )

  return <ActiveSpaceContext.Provider value={value}>{children}</ActiveSpaceContext.Provider>
}

/** Read the shared "Enter the Space™" state. Returns `null` outside the provider. */
export function useActiveSpace(): ActiveSpaceApi | null {
  return useContext(ActiveSpaceContext)
}
