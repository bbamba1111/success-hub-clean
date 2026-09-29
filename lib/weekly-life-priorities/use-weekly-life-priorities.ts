"use client"

/**
 * Client state for this week's Weekly Life Priorities™ (SWR-cached).
 * The whole set is saved at once with `save(selections)` — a replace-all for
 * the week. Optimistic so selections feel instant.
 */

import { useCallback } from "react"
import useSWR from "swr"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { getWeeklyLifePriorities, setWeeklyLifePriorities } from "./server"
import type { LifePrioritySelection, WeeklyLifePriority } from "./types"

export function useWeeklyLifePriorities(weekKey: string = getWeekKey()) {
  const key = ["weekly-life-priorities", weekKey] as const

  const { data, mutate, isLoading } = useSWR(key, () => getWeeklyLifePriorities(weekKey), {
    fallbackData: [] as WeeklyLifePriority[],
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 10_000,
  })

  const priorities = data ?? []

  const save = useCallback(
    async (selections: LifePrioritySelection[]) => {
      // Optimistic: reflect the selection order immediately.
      void mutate(
        selections.map((s, i) => ({
          id: `optimistic-${i}`,
          weekKey,
          optionId: s.optionId,
          label: s.label,
          sortOrder: i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        { revalidate: false },
      )
      const res = await setWeeklyLifePriorities(weekKey, selections)
      if (res.ok && res.priorities) void mutate(res.priorities, { revalidate: false })
      return res
    },
    [mutate, weekKey],
  )

  return { priorities, save, isLoading }
}
