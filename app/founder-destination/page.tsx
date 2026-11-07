import type { Metadata } from "next"
import { FounderDestinationForm } from "@/components/founder-destination/founder-destination-form"

export const metadata: Metadata = {
  title: "Founder Destination™ | Harmony Lane™",
  description:
    "Where you intend your business, your own role, your life, and your future workplace to end up — not where they are today.",
}

/**
 * /founder-destination — optional, revisitable. Reached from My Blueprint™,
 * never part of the required onboarding on-ramp (that's Founder Profile™ →
 * Business Context™). Distinction:
 *   - Founder Profile™     = who I am
 *   - Business Context™    = what I'm building now
 *   - Founder Destination™ = where I'm intentionally going
 *
 * Finishing (or leaving) always returns to My Blueprint™, and progress
 * resumes at the exact section the founder was on when they left.
 */
export default function FounderDestinationPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <FounderDestinationForm />
    </div>
  )
}
