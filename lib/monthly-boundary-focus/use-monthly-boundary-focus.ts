"use client"

import useSWR from "swr"
import {
  getMonthlyBoundaryState,
  saveMonthlyBoundary,
  type SaveMonthlyBoundaryInput,
} from "@/app/actions/monthly-boundary-focus"

export function useMonthlyBoundaryFocus() {
  const { data, isLoading, mutate } = useSWR("monthly-boundary-focus", () => getMonthlyBoundaryState(), {
    revalidateOnFocus: false,
  })

  async function save(input: SaveMonthlyBoundaryInput) {
    const result = await saveMonthlyBoundary(input)
    if (result.ok && data && data.signedIn) {
      await mutate({ ...data, focus: result.focus }, { revalidate: false })
    }
    return result
  }

  return {
    isLoading,
    signedIn: data?.signedIn ?? false,
    entitled: data?.entitled ?? false,
    focus: data?.focus ?? null,
    save,
  }
}
