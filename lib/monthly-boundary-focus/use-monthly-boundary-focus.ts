"use client"

import useSWR from "swr"
import {
  getMonthlyBoundaryState,
  saveMonthlyBoundary,
  saveMonthlyReview,
  setMonthlyMilestone,
  type MonthlyBoundaryRecord,
  type MonthlyMilestone,
  type SaveMonthlyBoundaryInput,
} from "@/app/actions/monthly-boundary-focus"

export function useMonthlyBoundaryFocus() {
  const { data, isLoading, mutate } = useSWR("monthly-boundary-focus", () => getMonthlyBoundaryState(), {
    revalidateOnFocus: false,
  })

  async function apply(result: { ok: true; focus: MonthlyBoundaryRecord } | { ok: false; error: string }) {
    if (result.ok && data && data.signedIn) {
      await mutate({ ...data, focus: result.focus }, { revalidate: false })
    }
    return result
  }

  const save = async (input: SaveMonthlyBoundaryInput) => apply(await saveMonthlyBoundary(input))
  const setMilestone = async (milestone: MonthlyMilestone, done: boolean) =>
    apply(await setMonthlyMilestone(milestone, done))
  const saveReview = async (notes: string) => apply(await saveMonthlyReview(notes))

  return {
    isLoading,
    signedIn: data?.signedIn ?? false,
    entitled: data?.entitled ?? false,
    cycleKey: data?.cycleKey ?? null,
    cycleStart: data?.cycleStart ?? null,
    cycleEnd: data?.cycleEnd ?? null,
    focus: data?.focus ?? null,
    history: data?.history ?? [],
    save,
    setMilestone,
    saveReview,
  }
}
