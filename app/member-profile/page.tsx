import type { Metadata } from "next"
import { BusinessStageCard } from "@/components/business-stage/business-stage-card"
import { LanguageRegionCard } from "@/components/i18n/language-region-card"
import { CherryGuidance } from "@/components/cherry-blossom/cherry-guidance"
import { BackLink } from "@/components/navigation/page-nav"

export const metadata: Metadata = {
  title: "Member Profile | Make Time For More",
  description:
    "Your Member Profile — set your Business Stage™ and your Preferred Language™ & Region so Harmony Lane™ can meet you where you are, in your language and part of the world.",
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
        <div className="pt-8">
          <BackLink href="/live-today" label="Back to Live Today" />
        </div>
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

        {/* Cherry Blossom introduces the choice — the focal point of the page. */}
        <section className="harmony-section pt-0">
          <CherryGuidance tone="spotlight" title="Let's meet you where you are.">
            Your Business Stage™ tells me how to guide you — the priorities to protect, the executives to bring in
            first, and the deliverables that matter most right now. It never changes what you can access; it only shapes
            my guidance. You&apos;re always in control, so set the stage that feels true today.
          </CherryGuidance>
        </section>

        {/* Business Stage */}
        <section className="harmony-section pt-0" aria-labelledby="stage-section-heading">
          <h2 id="stage-section-heading" className="sr-only">
            Business Stage
          </h2>
          <BusinessStageCard />
        </section>

        {/* Language & Region — Global Language Architecture™ */}
        <section className="harmony-section pt-0" aria-labelledby="language-section-heading">
          <h2 id="language-section-heading" className="sr-only">
            Language and Region
          </h2>
          <CherryGuidance title="Every entrepreneur, everywhere.">
            Harmony Lane™ is being built to meet you in your language and your part of the world — because access
            shouldn&apos;t depend on where you live. Choose how you&apos;d like to work and how information should
            appear. Translation is still on its way, so the interface stays in English for now, but your region
            settings take effect right away.
          </CherryGuidance>
          <div className="mt-6">
            <LanguageRegionCard />
          </div>
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
