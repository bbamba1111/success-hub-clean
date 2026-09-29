/**
 * living-moments-store.ts
 * Tiny SWR-based event bus for passing the Living Moments™ copy
 * from the hero image to the BarbaraWelcome intro section.
 *
 * Usage:
 *   // To publish:
 *   import { publishMomentMessage } from "@/components/living-moments-store"
 *   publishMomentMessage({ headline: "...", subline: "..." })
 *
 *   // To subscribe:
 *   import { useMomentMessage } from "@/components/living-moments-store"
 *   const msg = useMomentMessage()
 */

import useSWR, { mutate } from "swr"

export const MOMENT_MSG_KEY = "living-moments-message"

export interface MomentCopy {
  headline: string
  subline: string
}

/** Subscribe to the current moment message. Returns null until one is published. */
export function useMomentMessage(): MomentCopy | null {
  const { data } = useSWR<MomentCopy | null>(MOMENT_MSG_KEY, null, {
    fallbackData: null,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return data ?? null
}

/** Publish a moment message — picked up by any useMomentMessage() subscriber. */
export function publishMomentMessage(copy: MomentCopy) {
  mutate(MOMENT_MSG_KEY, copy, false)
}

/** Clear the moment message. */
export function clearMomentMessage() {
  mutate(MOMENT_MSG_KEY, null, false)
}
