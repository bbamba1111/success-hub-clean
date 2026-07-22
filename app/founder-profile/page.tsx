import type { Metadata } from "next"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { FounderProfileForm } from "@/components/founder-profile/founder-profile-form"

export const metadata: Metadata = {
  title: "Founder Profile™ | Harmony Lane™",
  description:
    "Before we personalize your Harmony Lane™ experience, let's get to know you. Your Founder Profile™ helps us tailor your journey and generate your Work-Life Harmony Blueprint™.",
}

/**
 * /founder-profile — Step 1 of the Harmony Lane™ onboarding flow.
 *
 * Flow:
 *   /begin → /founder-profile → /audit → /entrepreneur-success-assessment
 *   → /harmony-blueprint → /design-my-week → /live-today
 */
export default function FounderProfilePage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">

      {/* ── Cherry Blossom™ Hero — CEO Executive Office ─────────────── */}
      <CherryBlossomScene variant="ceo-office" minHeight="min-h-[72vh]">
        <CherryBlossomSceneCard
          title="Welcome to Harmony Lane™"
          time="5 – 10 mins"
          scrollPrompt="Begin My Founder Profile™"
          maxWidth="max-w-2xl"
        >
          {/* Badge */}
          <div className="flex justify-center mb-1 -mt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-ink/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-coral shrink-0" aria-hidden />
              The Work-Life Balance Reality Check™
            </span>
          </div>

          <p>
            Before we personalize your Harmony Lane™ experience, let&apos;s get to know you.
          </p>
          <p>
            Your <strong>Founder Profile™</strong> helps us tailor your journey, generate your
            personalized <strong>Work-Life Harmony Blueprint™</strong>, and prepare you to design
            and install your <strong>Work-Life Balance Business Week™</strong>.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Founder Profile™ Form ────────────────────────────────────── */}
      <FounderProfileForm />

    </div>
  )
}
