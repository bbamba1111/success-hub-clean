"use client"

import { useCallback } from "react"
import useSWR from "swr"
import { listBoundaryCheckIns, saveBoundaryCheckIn, type BoundaryCheckIn, type SaveBoundaryCheckInInput } from "./server"

const KEY = "boundary-check-ins"

/** Local calendar date (YYYY-MM-DD) — the day the member actually lived the segment. */
export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function useBoundaryCheckIns() {
  const { data, mutate, isLoading } = useSWR<BoundaryCheckIn[]>(KEY, () => listBoundaryCheckIns(), {
    revalidateOnFocus: false,
    dedupingInterval: 5_000,
  })

  const save = useCallback(
    async (input: SaveBoundaryCheckInInput) => {
      const res = await saveBoundaryCheckIn(input)
      if (res.ok && res.checkIn) {
        const saved = res.checkIn
        await mutate(
          (current = []) => [saved, ...current.filter((c) => c.id !== saved.id)],
          { revalidate: false },
        )
      }
      return res
    },
    [mutate],
  )

  return { checkIns: data ?? [], isLoading, save }
}

export function formatCheckInDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}
