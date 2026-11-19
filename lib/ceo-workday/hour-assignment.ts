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
import { queueDayStatePush } from "./day-state-sync"

export type HourOverrides = Record<string, HourBlockIndex>

/** Assign one selected task to each hour in founder-selected order. */
export function autoAssignHours(items: CeoPlanItem[]): Record<string, HourBlockIndex> {
  const map: Record<string, HourBlockIndex> = {}
  const selected = items.filter((item) => item.founderDecision !== "remove" && item.status !== "eliminated" && item.status !== "saved-for-later" && item.status !== "delegated").sort((a, b) => a.position - b.position).slice(0, 4)
  selected.forEach((item, index) => { map[item.id] = (index + 1) as HourBlockIndex })
  return map
}

export function resolveHour(itemId: string, auto: Record<string, HourBlockIndex>, _overrides?: HourOverrides): HourBlockIndex {
  return auto[itemId] ?? 1
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
    queueDayStatePush("hour_overrides", dateKey, value)
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
