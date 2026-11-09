"use client"

/**
 * Client state for the week's single Human SOS™ (SWR-cached). The Builder
 * writes through here so persistence and step transitions survive reloads.
 */

import { useCallback } from "react"
import useSWR from "swr"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { deleteStakeholder, getHumanSos, saveHumanSos, saveStakeholder, type HumanSosBundle } from "./server"
import { emptyHumanSos, type HumanSos, type SosStakeholder } from "./types"

export function useHumanSos(weekKey: string = getWeekKey(), boundaryFocusText = "") {
  const key = ["human-sos", weekKey] as const

  const { data, mutate, isLoading } = useSWR<HumanSosBundle>(key, () => getHumanSos(weekKey, boundaryFocusText), {
    fallbackData: { sos: emptyHumanSos(weekKey, boundaryFocusText), stakeholders: [] },
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 5_000,
  })

  const sos = data?.sos ?? emptyHumanSos(weekKey, boundaryFocusText)
  const stakeholders = data?.stakeholders ?? []

  /** Save (upsert) the whole SOS record. Optimistic so the flow feels instant. */
  const saveSos = useCallback(
    async (next: Partial<HumanSos>) => {
      const merged: HumanSos = { ...sos, ...next, weekKey }
      void mutate({ sos: merged, stakeholders }, { revalidate: false })
      const res = await saveHumanSos(merged)
      if (res.ok && res.sos) void mutate({ sos: res.sos, stakeholders }, { revalidate: false })
      return res
    },
    [sos, stakeholders, mutate, weekKey],
  )

  const upsertStakeholder = useCallback(
    async (stakeholder: SosStakeholder) => {
      const res = await saveStakeholder(stakeholder)
      if (res.ok && res.stakeholder) {
        const saved = res.stakeholder
        const nextList = stakeholders.some((s) => s.id === stakeholder.id)
          ? stakeholders.map((s) => (s.id === stakeholder.id ? saved : s))
          : [...stakeholders, saved]
        void mutate({ sos, stakeholders: nextList }, { revalidate: false })
      }
      return res
    },
    [sos, stakeholders, mutate],
  )

  const removeStakeholder = useCallback(
    async (id: string) => {
      void mutate({ sos, stakeholders: stakeholders.filter((s) => s.id !== id) }, { revalidate: false })
      const res = await deleteStakeholder(id)
      if (!res.ok) void mutate()
      return res
    },
    [sos, stakeholders, mutate],
  )

  return { sos, stakeholders, isLoading, saveSos, upsertStakeholder, removeStakeholder, refresh: () => mutate() }
}
