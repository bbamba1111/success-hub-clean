import type { Metadata } from "next"
import { CherryBlossomThankYouClient } from "@/components/cherry-blossom/cherry-blossom-thank-you-client"

export const metadata: Metadata = {
  title: "On-Ramp Complete | Harmony Lane™",
  description: "Cherry Blossom Thank-You™ — your Founder Profile and Business Context on-ramp is complete.",
}

/**
 * /welcome/cherry-blossom/complete — Cherry Blossom Thank-You™ / Transition.
 *
 * Shown once, after Founder Profile™ AND Business Context™ are both
 * complete — the closing ritual of the on-ramp before entering the current
 * Work-Life Balance Business Day™.
 */
export default function CherryBlossomThankYouPage() {
  return <CherryBlossomThankYouClient />
}
