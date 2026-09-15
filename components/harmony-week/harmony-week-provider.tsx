"use client"

/**
 * HarmonyWeekProvider — React context for the Harmony Week™ Engine.
 * ---------------------------------------------------------------------------
 * Reads `dayOfWeek` from the existing `useOperatingEngine()` snapshot
 * (which already ticks every 30s and applies Developer Mode overrides).
 * Derives a `HarmonyDayTheme` and shares it via `useHarmonyWeek()`.
 *
 * Must be placed inside `OperatingEngineProvider` so the engine snapshot
 * is available. In practice both providers sit at the root layout level.
 *
 * Returns `null` until the Operating Engine has produced its first tick
 * (i.e. until client hydration completes) — all consumers guard for this.
 */

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { getHarmonyDayTheme, isTimeFreedomNow } from "@/lib/harmony-week/harmony-week-engine"
import type { HarmonyDayTheme } from "@/lib/harmony-week/types"

/** The full context value exposed by HarmonyWeekProvider. */
export interface HarmonyWeekContextValue extends HarmonyDayTheme {
  /**
   * True when the founder is inside the Time Freedom™ window.
   * Encodes Thu 17:00 → Mon 07:00, including the exact half-day boundaries.
   * Always `false` before the first client tick.
   */
  isTimeFreedomNow: boolean
}

const HarmonyWeekContext = createContext<HarmonyWeekContextValue | null>(null)

export function HarmonyWeekProvider({ children }: { children: ReactNode }) {
  const experience = useOperatingEngine()

  const value = useMemo<HarmonyWeekContextValue | null>(() => {
    if (!experience) return null
    const theme = getHarmonyDayTheme(experience.time.dayOfWeek)
    return {
      ...theme,
      isTimeFreedomNow: isTimeFreedomNow(
        experience.time.dayOfWeek,
        experience.time.minutesSinceMidnight,
      ),
    }
  }, [experience])

  return (
    <HarmonyWeekContext.Provider value={value}>
      {children}
    </HarmonyWeekContext.Provider>
  )
}

/**
 * Returns the current HarmonyWeekContextValue (HarmonyDayTheme + isTimeFreedomNow),
 * or `null` before the first client tick. Must be used within `HarmonyWeekProvider`.
 */
export function useHarmonyWeek(): HarmonyWeekContextValue | null {
  return useContext(HarmonyWeekContext)
}
