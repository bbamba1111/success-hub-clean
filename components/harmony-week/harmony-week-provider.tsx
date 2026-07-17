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
import { getHarmonyDayTheme } from "@/lib/harmony-week/harmony-week-engine"
import type { HarmonyDayTheme } from "@/lib/harmony-week/types"

const HarmonyWeekContext = createContext<HarmonyDayTheme | null>(null)

export function HarmonyWeekProvider({ children }: { children: ReactNode }) {
  const experience = useOperatingEngine()

  const theme = useMemo<HarmonyDayTheme | null>(() => {
    if (!experience) return null
    return getHarmonyDayTheme(experience.time.dayOfWeek)
  }, [experience])

  return (
    <HarmonyWeekContext.Provider value={theme}>
      {children}
    </HarmonyWeekContext.Provider>
  )
}

/**
 * Returns the current HarmonyDayTheme, or `null` before the first client tick.
 * Must be used within `HarmonyWeekProvider`.
 */
export function useHarmonyWeek(): HarmonyDayTheme | null {
  return useContext(HarmonyWeekContext)
}
