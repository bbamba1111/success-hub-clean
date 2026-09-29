"use client"

/**
 * CEO Workday™ — hour assignment for designed work.
 * ---------------------------------------------------------------------------
 * The work the founder designs with the Business Function tool populates the
 * four protected hours two ways, together:
 *   1. Auto-fill — items are packed in plan order into 60-minute hours by their
 *      estimated minutes (computed, never stored).
 *   2. Founder assignment — an explicit per-item hour override the founder can
 *      set from inside the hour workspace. Persisted in localStorage keyed by
 *      the plan date so it survives reloads until the founder changes it.
 *
 * resolveHour(item) = override ?? auto ?? hour 1.
 */

import { useCallback, useEffect, useState } from "react"
import type { CeoPlanItem } from "./plan-types"
import type { HourBlockIndex } from "./hour-blocks"

const MINUTES_PER_HOUR = 60
const STORAGE_KEY = (dateKey: string) => `ceo-workday-hour-overrides:${dateKey}`
const CHANGED_EVENT = "ceo-workday-hour-overrides-changed"

export type HourOverrides = Record<string, HourBlockIndex>

/** Packs active items in plan order into the four hours by estimated minutes. */
export function autoAssignHours(items: CeoPlanItem[]): Record<string, HourBlockIndex> {
  const map: Record<string, HourBlockIndex> = {}
  let consumed = 0
  for (const item of items) {
    const hour = Math.min(4, Math.floor(consumed / MINUTES_PER_HOUR) + 1) as HourBlockIndex
    map[item.id] = hour
    // Removed / eliminated work still gets a home hour, but never consumes time.
    if (item.founderDecision !== "remove" && item.status !== "eliminated") {
      consumed += Math.max(15, Math.min(240, Math.round(item.estimatedMinutes || 0) || MINUTES_PER_HOUR))
    }
  }
  return map
}

export function resolveHour(
  itemId: string,
  auto: Record<string, HourBlockIndex>,
  overrides: HourOverrides,
): HourBlockIndex {
  return overrides[itemId] ?? auto[itemId] ?? 1
}

function read(dateKey: string): HourOverrides {
  if (typeof window === "undefined") return {}
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY(dateKey)) || "{}") as HourOverrides) ?? {}
  } catch {
    return {}
  }
}

function write(dateKey: string, value: HourOverrides) {
  try {
    localStorage.setItem(STORAGE_KEY(dateKey), JSON.stringify(value))
    window.dispatchEvent(new Event(CHANGED_EVENT))
  } catch {
    // storage can be unavailable; fail quietly
  }
}

export function useHourOverrides(dateKey: string) {
  const [overrides, setOverrides] = useState<HourOverrides>({})

  useEffect(() => {
    const load = () => setOverrides(read(dateKey))
    load()
    window.addEventListener(CHANGED_EVENT, load)
    window.addEventListener("storage", load)
    return () => {
      window.removeEventListener(CHANGED_EVENT, load)
      window.removeEventListener("storage", load)
    }
  }, [dateKey])

  const setHour = useCallback(
    (itemId: string, hour: HourBlockIndex) => {
      const next = { ...read(dateKey), [itemId]: hour }
      write(dateKey, next)
      setOverrides(next)
    },
    [dateKey],
  )

  return { overrides, setHour }
}
