import type { Metadata } from "next"
import { BusinessStageCard } from "@/components/business-stage/business-stage-card"

export const metadata: Metadata = {
  title: "Member Profile | Make Time For More",
  description:
    "Your Member Profile — including your Business Stage™, the contextual signal that helps Harmony Lane™ adapt its guidance to where you are in your journey.",
}

/**
 * Member Profile (Phase 5.4).
 *
 * Home of Business Stage™ — the contextual signal that lets the Harmony Lane™
 * Operating System™ adapt its GUIDANCE (never the platform itself) to where a
 * founder is in their journey. Members view and manually change their stage
 * here; the founder is always in control. Architecture only: no recommendation
 * logic, detection, or adaptive behavior yet.
 */
export default function MemberProfilePage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            Your Member Profile
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            Everyone uses the same Operating System™. What changes is the guidance — not the platform. Your Business
            Stage™ helps Cherry Blossom™, your Executive Leadership Team™, and your advisors meet you exactly where you
            are.
          </p>
        </header>

        {/* Business Stage */}
        <section className="harmony-section pt-0" aria-labelledby="stage-section-heading">
          <h2 id="stage-section-heading" className="sr-only">
            Business Stage
          </h2>
          <BusinessStageCard />
        </section>

        {/* Reassurance note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-2xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Contextual, Not Hierarchical</p>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Moving between stages isn&apos;t about being &lsquo;better&rsquo; — it simply reflects different
              business needs. You&apos;re always in control of your stage.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-ink-soft">
              A future version may suggest when a stage change might help, but the choice always remains yours.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
