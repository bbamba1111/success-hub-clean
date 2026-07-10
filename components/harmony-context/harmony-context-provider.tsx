"use client"

/**
 * Harmony Context Engine™ — React boundary (Phase 4B.2).
 *
 * The single context layer every workspace reads to know where the member is
 * inside the Operating System and what they designed on Sunday. It composes
 * two existing sources of truth (it never re-implements either):
 *
 *   1. The Operating Engine snapshot (useOperatingEngine) — current day,
 *      current segment, time of day. MUST be nested inside
 *      <OperatingEngineProvider>.
 *   2. The installed week (getInstalledWeek) — Weekly Intention™, Operating
 *      Rules™, Daily Non-Negotiables™, Priority Focus Areas™, CEO context.
 *
 * SESSION-ONLY this pass. When persistence arrives, only this provider changes
 * its data source (sessionStorage → Supabase) — the HarmonyContextValue
 * contract, and therefore every consumer, stays exactly the same.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useOperatingEngine } from "@/components/operating-engine-provider"
import { getInstalledWeek, type InstalledWeek } from "@/lib/sunday-design-day/installed-week"
import { DESIGN_SEGMENTS, FOCUS_AREA_OPTIONS } from "@/components/sunday-design-day/sdd-config"
import { sddSegmentIdFor } from "@/lib/harmony-context/segment-map"
import type { HarmonyContextValue, HarmonySegment, TimeOfDay } from "@/lib/harmony-context/types"

/** id → human label / config lookups (built once). */
const FOCUS_LABEL = new Map(FOCUS_AREA_OPTIONS.map((o) => [o.id, o.label]))
const SEGMENT_CFG = new Map(DESIGN_SEGMENTS.map((s) => [s.id, s]))

const EMPTY_CEO = {
  priorities: "",
  aiAugmentation: "",
  businessOperatingRule: "",
  humanZoneOfGenius: "",
  executionFriction: "",
}

/** Four-way time-of-day split (adds "Night" beyond the engine's greeting period). */
function timeParts(hour: number): { timeOfDay: TimeOfDay; greeting: string } {
  if (hour < 12) return { timeOfDay: "Morning", greeting: "Good Morning" }
  if (hour < 17) return { timeOfDay: "Afternoon", greeting: "Good Afternoon" }
  if (hour < 21) return { timeOfDay: "Evening", greeting: "Good Evening" }
  return { timeOfDay: "Night", greeting: "Good Night" }
}

const HarmonyContext = createContext<HarmonyContextValue | null>(null)

export function HarmonyProvider({ children }: { children: ReactNode }) {
  const engine = useOperatingEngine()

  // Installed week is browser session state — read after mount to keep SSR
  // markup stable and avoid hydration mismatch.
  const [installed, setInstalled] = useState<InstalledWeek | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setInstalled(getInstalledWeek())
    setLoaded(true)
  }, [])

  const value = useMemo<HarmonyContextValue>(() => {
    const ready = Boolean(engine) && loaded
    const { timeOfDay, greeting } = timeParts(engine?.time.hour ?? 0)
    const currentBlock = engine?.businessDay.current

    const rawName = engine?.member.firstName
    const firstName = rawName && rawName !== "Friend" ? rawName : null

    // All designed segments with a rule, in canonical lived order. Falls back to
    // the suggested Non-Negotiable™ when the member left one blank.
    const installedById = new Map((installed?.segments ?? []).map((s) => [s.id, s]))
    const segments: HarmonySegment[] = DESIGN_SEGMENTS.flatMap((cfg) => {
      const s = installedById.get(cfg.id)
      if (!s || !s.rule) return []
      return [
        {
          id: cfg.id,
          title: cfg.title,
          rule: s.rule,
          nonNegotiable: s.nonNegotiable || cfg.defaultNonNegotiable,
        },
      ]
    })

    // Resolve the current designed segment via the engine block → SDD mapping.
    let currentSegment: HarmonySegment | null = null
    if (currentBlock) {
      const sddId = sddSegmentIdFor(currentBlock.id)
      if (sddId) currentSegment = segments.find((s) => s.id === sddId) ?? null
    }

    const focusAreas = (installed?.focusAreas ?? []).map((id) => FOCUS_LABEL.get(id) ?? id)

    return {
      ready,
      hasDesignedWeek: Boolean(installed),
      dayName: engine?.time.dayName ?? "",
      timeOfDay,
      greeting,
      firstName,
      currentSegment,
      currentBlockTitle: currentBlock?.title ?? "",
      weeklyIntention: installed?.intention ?? "",
      weeklyDeclaration: installed?.declaration ?? "",
      focusAreas,
      segments,
      ceo: installed?.ceo ?? EMPTY_CEO,
    }
  }, [engine, installed, loaded])

  return <HarmonyContext.Provider value={value}>{children}</HarmonyContext.Provider>
}

/**
 * Read the shared Harmony Context Engine™ snapshot. Must be called inside
 * <HarmonyProvider> (which itself must be inside <OperatingEngineProvider>).
 */
export function useHarmonyContext(): HarmonyContextValue {
  const ctx = useContext(HarmonyContext)
  if (!ctx) throw new Error("useHarmonyContext must be used within HarmonyProvider")
  return ctx
}

/** Non-throwing variant for optional consumers. Returns null outside a provider. */
export function useHarmonyContextOptional(): HarmonyContextValue | null {
  return useContext(HarmonyContext)
}
