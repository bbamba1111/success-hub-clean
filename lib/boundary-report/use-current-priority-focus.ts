"use client"

import useSWR from "swr"
import { getCurrentPriorityFocus } from "@/lib/boundary-report/weekly-actions"

export const CURRENT_PRIORITY_FOCUS_KEY = "current-priority-focus"

/** Shared across Decide & Design™ so saving weekly priorities updates every consumer at once. */
export function useCurrentPriorityFocus() {
  return useSWR(CURRENT_PRIORITY_FOCUS_KEY, () => getCurrentPriorityFocus(), { revalidateOnFocus: false })
}
