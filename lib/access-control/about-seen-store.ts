"use client"

import { useCallback, useEffect, useState } from "react"

/**
 * About This Segment™ "seen" memory (spec §18).
 *
 * In the pre-Monday preview, every workspace is locked but its About This
 * Segment™ / Work-Life Balance Time & Space Boundary™ explanation is available.
 * We deliberately do NOT auto-open every explanation on every visit — that
 * would bombard the founder. The founder chooses which segment to learn about,
 * and once they open one we remember that interaction so the card can show a
 * quiet "Reviewed" marker. About This Segment™ always remains available; this
 * only records that it was opened at least once.
 *
 * Local to the device by design: it's a lightweight UX affordance for the
 * orientation phase, not member data, so there's no server round-trip.
 */

const STORAGE_KEY = "hl-about-seen"

function readSeen(): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function writeSeen(seen: Set<string>) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)))
  } catch {
    // Storage unavailable — the "Reviewed" marker simply won't persist; the
    // preview still works and About This Segment™ stays available.
  }
}

/**
 * Tracks whether the given segment's About This Segment™ has been opened.
 * Pass `undefined` (e.g. when the segment isn't locked) to disable tracking.
 */
export function useAboutSeen(segmentId?: string) {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (!segmentId) {
      setSeen(false)
      return
    }
    setSeen(readSeen().has(segmentId))
  }, [segmentId])

  const markSeen = useCallback(() => {
    if (!segmentId) return
    const current = readSeen()
    if (!current.has(segmentId)) {
      current.add(segmentId)
      writeSeen(current)
    }
    setSeen(true)
  }, [segmentId])

  return { seen, markSeen }
}
