"use client"

/**
 * Client state for the founder's CUSTOM boundaries (SWR-cached).
 * The seeded library content is static and imported directly from ./catalog;
 * only custom boundaries need a data hook.
 */

import { useCallback } from "react"
import useSWR from "swr"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { deleteCustomBoundary, listCustomBoundaries, saveCustomBoundary } from "./server"
import type { CustomBoundary, CustomBoundaryInput } from "./types"

export function useCustomBoundaries(weekKey?: string) {
  const key = ["custom-boundaries", weekKey ?? "all"] as const

  const { data, mutate, isLoading } = useSWR(key, () => listCustomBoundaries(weekKey), {
    fallbackData: [] as CustomBoundary[],
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  })

  const boundaries = data ?? []

  const save = useCallback(
    async (input: CustomBoundaryInput & { id?: string }) => {
      const res = await saveCustomBoundary({ weekKey: weekKey ?? getWeekKey(), ...input })
      if (res.ok) void mutate()
      return res
    },
    [mutate, weekKey],
  )

  const remove = useCallback(
    async (id: string) => {
      const res = await deleteCustomBoundary(id)
      if (res.ok) void mutate()
      return res
    },
    [mutate],
  )

  return { boundaries, save, remove, isLoading }
}
