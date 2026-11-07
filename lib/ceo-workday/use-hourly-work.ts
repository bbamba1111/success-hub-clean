"use client"

/**
 * useHourlyWork — reactive read/write access to the What Must Happen Today™
 * hourly plan. The four-hour panel and each 5-Minute Check-In™ both read from
 * the same localStorage store, so a statement typed in the panel is the same
 * one the check-in shows. Writes broadcast HOURLY_WORK_EVENT; every subscriber
 * refreshes, so state stays consistent across refresh, navigation, and
 * opening/closing an hourly check-in.
 */

import { useCallback, useEffect, useState } from "react"
import type { HourBlockIndex } from "./hour-blocks"
import {
  emptyHourlyWorkMap,
  getHourlyWork,
  HOURLY_WORK_EVENT,
  setHourAffirmation as persistAffirmation,
  setHourWork as persistWork,
  type HourlyWorkMap,
} from "./hourly-work-store"

export function useHourlyWork() {
  const [hours, setHours] = useState<HourlyWorkMap>(() => emptyHourlyWorkMap())
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const refresh = () => setHours(getHourlyWork())
    refresh()
    setHydrated(true)
    window.addEventListener(HOURLY_WORK_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(HOURLY_WORK_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  const setWork = useCallback((index: HourBlockIndex, work: string) => {
    persistWork(index, work)
  }, [])

  const setAffirmation = useCallback((index: HourBlockIndex, affirmation: string) => {
    persistAffirmation(index, affirmation)
  }, [])

  return { hours, hydrated, setWork, setAffirmation }
}
