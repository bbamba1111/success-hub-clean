import type { Metadata } from "next"
import { CherryBlossomWelcomeClient } from "@/components/cherry-blossom/cherry-blossom-welcome-client"

export const metadata: Metadata = {
  title: "Welcome | Harmony Lane™",
  description: "Cherry Blossom Welcome™ — the start of your Harmony Lane™ on-ramp.",
}

/**
 * /welcome/cherry-blossom — Cherry Blossom Welcome™.
 *
 * First screen after login for any member who hasn't completed Founder
 * Profile™ yet, shown once per device. Leads into the required on-ramp:
 *   Cherry Blossom Welcome™ → /founder-profile → /business-context
 *     → /boundary-report (Reality Check™) → Cherry Blossom Thank-You™
 */
export default function CherryBlossomWelcomePage() {
  return <CherryBlossomWelcomeClient />
}
