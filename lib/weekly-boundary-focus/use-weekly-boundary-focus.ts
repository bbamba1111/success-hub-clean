"use client"

/**
 * Client state for this week's single Weekly Work-Life Balance Boundary
 * Focus™ (SWR-cached). Optimistic save so choosing feels instant.
 */

import { useCallback } from "react"
import useSWR from "swr"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { getWeeklyBoundaryFocus, saveWeeklyBoundaryFocus } from "./server"
import { emptyBoundaryFocus, type WeeklyBoundaryFocus } from "./types"

export function useWeeklyBoundaryFocus(weekKey: string = getWeekKey()) {
  const key = ["weekly-boundary-focus", weekKey] as const

  const { data, mutate, isLoading } = useSWR(key, () => getWeeklyBoundaryFocus(weekKey), {
    fallbackData: emptyBoundaryFocus(weekKey),
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 10_000,
  })

  const focus = data ?? emptyBoundaryFocus(weekKey)

  const save = useCallback(
    async (next: Partial<WeeklyBoundaryFocus>) => {
      const merged: WeeklyBoundaryFocus = { ...(data ?? emptyBoundaryFocus(weekKey)), ...next, weekKey }
      void mutate(merged, { revalidate: false })
      const res = await saveWeeklyBoundaryFocus(merged)
      if (res.ok && res.focus) void mutate(res.focus, { revalidate: false })
      return res
    },
    [data, mutate, weekKey],
  )

  return { focus, save, isLoading }
}
