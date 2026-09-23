"use client"

/**
 * useTimeFreedomDeclaration — reactive read/write for My Time Freedom
 * Declaration™. Auto-persists to localStorage on every change so the
 * declaration is always saved until the founder changes, edits, or rebuilds it.
 */

import { useCallback, useEffect, useState } from "react"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import {
  emptyDeclaration,
  getTimeFreedomDeclaration,
  setTimeFreedomDeclaration,
  TIME_FREEDOM_DECLARATION_EVENT,
  type TimeFreedomDeclaration,
} from "./store"

export function useTimeFreedomDeclaration(weekKey: string = getWeekKey()) {
  const [declaration, setDeclaration] = useState<TimeFreedomDeclaration>(() => emptyDeclaration(weekKey))
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const refresh = () => setDeclaration(getTimeFreedomDeclaration(weekKey))
    refresh()
    setHydrated(true)
    window.addEventListener(TIME_FREEDOM_DECLARATION_EVENT, refresh)
    window.addEventListener("storage", refresh)
    return () => {
      window.removeEventListener(TIME_FREEDOM_DECLARATION_EVENT, refresh)
      window.removeEventListener("storage", refresh)
    }
  }, [weekKey])

  const save = useCallback(
    (patch: Partial<Omit<TimeFreedomDeclaration, "weekKey">>) => {
      const current = getTimeFreedomDeclaration(weekKey)
      const next: TimeFreedomDeclaration = { ...current, ...patch, weekKey }
      setTimeFreedomDeclaration(next)
      setDeclaration(next)
    },
    [weekKey],
  )

  return { declaration, hydrated, save }
}
