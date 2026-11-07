"use client"

/**
 * Shared client state for this week's three commitments (SWR-cached).
 * The Decide & Design™ designer and the "This Week's Work-Life Balance
 * Commitments™" summary both read from the same key, so edits in one appear
 * in the other immediately. Saves are optimistic and debounced.
 */

import { useCallback, useEffect, useRef } from "react"
import useSWR from "swr"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { getWeeklyCommitments, saveWeeklyCommitments, updateCommitmentStatus } from "./server"
import {
  emptyWeeklyCommitments,
  type DelegationStatus,
  type LifePriorityStatus,
  type OperatingRuleStatus,
  type WeeklyCommitments,
} from "./types"

const AUTOSAVE_MS = 900

export function useWeeklyCommitments(weekKey: string = getWeekKey()) {
  const key = ["weekly-commitments", weekKey] as const

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef<WeeklyCommitments | null>(null)
  const errorRef = useRef<string | null>(null)

  const { data, mutate, isLoading } = useSWR(key, () => getWeeklyCommitments(weekKey), {
    fallbackData: emptyWeeklyCommitments(weekKey),
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 10_000,
    // The founder's unsaved choices are authoritative. A second subscriber
    // mounting (e.g. the CEO Workday accordion summary) must not trigger a
    // refetch that overwrites the optimistic draft before the debounced save
    // lands — or after a save failed and the draft is being kept for retry.
    isPaused: () => pending.current !== null,
  })
  const commitments = data ?? emptyWeeklyCommitments(weekKey)

  const flush = useCallback(async () => {
    const c = pending.current
    if (!c) return
    const res = await saveWeeklyCommitments(c)
    if (res.ok) {
      errorRef.current = null
      // Only clear if nothing newer was queued while the request was in flight.
      if (pending.current === c) pending.current = null
      if (res.commitments) void mutate(res.commitments, { revalidate: false })
    } else {
      // Keep the draft (and stay paused) so the choices survive the failure.
      errorRef.current = res.error ?? "Could not save."
    }
  }, [mutate])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
      void flush()
    },
    [flush],
  )

  /** Optimistic local update + debounced persist. */
  const update = useCallback(
    (patch: Partial<WeeklyCommitments> | ((c: WeeklyCommitments) => Partial<WeeklyCommitments>)) => {
      void mutate(
        (prev) => {
          const base = prev ?? emptyWeeklyCommitments(weekKey)
          const p = typeof patch === "function" ? patch(base) : patch
          const next = { ...base, ...p }
          pending.current = next
          if (timer.current) clearTimeout(timer.current)
          timer.current = setTimeout(() => void flush(), AUTOSAVE_MS)
          return next
        },
        { revalidate: false },
      )
    },
    [mutate, weekKey, flush],
  )

  /** "Save My Week" — persist now and stamp designedAt. */
  const saveWeek = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current)
    const c = pending.current ?? commitments
    const res = await saveWeeklyCommitments(c, { markDesigned: true })
    if (res.ok) {
      errorRef.current = null
      if (pending.current === c) pending.current = null
      if (res.commitments) void mutate(res.commitments, { revalidate: false })
    } else {
      errorRef.current = res.error ?? "Could not save."
    }
    return res
  }, [commitments, mutate])

  const setStatus = useCallback(
    async (patch: Partial<{ lifeStatus: LifePriorityStatus; delegationStatus: DelegationStatus; operatingRuleStatus: OperatingRuleStatus }>) => {
      void mutate((prev) => ({ ...(prev ?? emptyWeeklyCommitments(weekKey)), ...patch }), { revalidate: false })
      await updateCommitmentStatus(weekKey, patch)
    },
    [mutate, weekKey],
  )

  return { commitments, update, saveWeek, setStatus, isLoading, lastError: errorRef.current }
}
