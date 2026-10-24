"use client"

/**
 * CommunityProvider — Phase 16.1
 * ---------------------------------------------------------------------------
 * Context for the Community™ page. Loads check-ins and wins from localStorage,
 * listens for store updates, and exposes addCheckIn / addWin actions that
 * auto-bridge to the Founder Memory™ store.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { CheckIn, FounderWin } from "@/lib/community/types"

interface CommunityContextValue {
  checkIns: CheckIn[]
  wins: FounderWin[]
  addCheckIn: (checkIn: CheckIn) => void
  addWin: (win: FounderWin) => void
  isLoaded: boolean
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [wins, setWins] = useState<FounderWin[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const load = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getCommunityStore } = require("@/lib/community/community-store")
      const store = getCommunityStore()
      setCheckIns(store.checkIns)
      setWins(store.wins)
      setIsLoaded(true)
    } catch {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    load()
    window.addEventListener("hl:community:updated", load)
    return () => window.removeEventListener("hl:community:updated", load)
  }, [load])

  const addCheckIn = useCallback((checkIn: CheckIn) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveCheckIn } = require("@/lib/community/community-store")
      saveCheckIn(checkIn)

      // Bridge to Founder Memory™
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { recordMemory } = require("@/lib/founder-memory/founder-memory-store")
        const labelMap: Record<CheckIn["type"], string> = {
          "morning-routine": "Morning GIV-EN™ Check-In",
          "focus-block": "CEO Workday™ Focus Block",
          "time-freedom": "Time Freedom™ Check-In",
          "executive-review": "Executive Review™ Check-In",
        }
        recordMemory({
          id: `community-checkin-${checkIn.id}`,
          category: "community",
          title: labelMap[checkIn.type],
          summary:
            checkIn.reflectionNote ??
            `Checked in for ${labelMap[checkIn.type]} on ${checkIn.date}.`,
          date: checkIn.date,
          timestamp: checkIn.timestamp,
          ctaLabel: "View Community",
          ctaHref: "/community",
        })
      } catch {
        // Memory bridge is non-critical
      }
    } catch {
      // store unavailable
    }
  }, [])

  const addWin = useCallback((win: FounderWin) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { saveWin } = require("@/lib/community/community-store")
      saveWin(win)

      // Bridge to Founder Memory™
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { recordMemory } = require("@/lib/founder-memory/founder-memory-store")
        recordMemory({
          id: `community-win-${win.id}`,
          category: "community",
          title: win.title,
          summary: win.description,
          date: win.date,
          timestamp: win.timestamp,
          ctaLabel: "View Community",
          ctaHref: "/community",
        })
      } catch {
        // Memory bridge is non-critical
      }
    } catch {
      // store unavailable
    }
  }, [])

  return (
    <CommunityContext.Provider
      value={{ checkIns, wins, addCheckIn, addWin, isLoaded }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider")
  return ctx
}
