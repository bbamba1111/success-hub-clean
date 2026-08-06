import type { Metadata } from "next"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { FounderProfileForm } from "@/components/founder-profile/founder-profile-form"

export const metadata: Metadata = {
  title: "Founder & Business Profile™ | Harmony Lane™",
  description:
    "Tell us about yourself and the business you're building so Harmony Lane™ can personalize your experience from day one.",
}

/**
 * /founder-profile — Step 1 of the Harmony Lane™ onboarding flow.
 *
 * One-time onboarding experience — Founder & Business Profile™.
 * After saving, the member returns to / (Harmony Lane™ home).
 *
 * Business Context™ is NOT part of this flow. It belongs exclusively to
 * the Measure Monthly™ process.
 *
 * Flow:
 *   /begin → /founder-profile → /  (home — Reflection Space™ reads profile on first Monday)
 */
export default function FounderProfilePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── Cherry Blossom™ Hero — CEO Executive Office ─────────────── */}
      <CherryBlossomScene variant="ceo-office" minHeight="min-h-[72vh]">
        <CherryBlossomSceneCard
          title="Welcome to Harmony Lane™"
          time="10 – 15 mins"
          scrollPrompt="Begin My Founder & Business Profile™"
          maxWidth="max-w-2xl"
        >
          {/* Badge */}
          <div className="flex justify-center mb-1 -mt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-ink/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral shrink-0" aria-hidden />
              Founder &amp; Business Profile™
            </span>
          </div>

          <p>
            Tell us about yourself and the business you&apos;re building so Harmony Lane™ can
            personalize your experience from day one.
          </p>
          <p>
            This information will be saved to your{" "}
            <strong>My Work-Life Harmony Blueprint™</strong> and can be updated at any time.
            Every field is optional — complete as much or as little as you like.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Founder & Business Profile™ Form ────────────────────────── */}
      <FounderProfileForm />

    </div>
  )
}
