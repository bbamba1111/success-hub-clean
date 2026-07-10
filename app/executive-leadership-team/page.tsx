import type { Metadata } from "next"
import Link from "next/link"
import { BackLink } from "@/components/navigation/page-nav"
import { ConductorPanel } from "@/components/executive-team/conductor-panel"
import { ExecutiveCard } from "@/components/executive-team/executive-card"
import { EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"

export const metadata: Metadata = {
  title: "Executive Leadership Team™ | Make Time For More",
  description:
    "The permanent executive leadership architecture of the Harmony Lane™ Operating System — conducted by Cherry Blossom™.",
}

/**
 * The Executive Leadership Team™ (Phase 5.1).
 *
 * A private executive boardroom — NOT a directory of AI chatbots. It establishes
 * the organizational architecture and an elegant presentation layer: Cherry
 * Blossom™ as Chief of Staff & Executive Conductor™, and the permanent executive
 * roster she coordinates. No chat, prompts, tools, or recommendation logic this
 * phase; the registry (lib/executive-team/executive-registry.ts) is the single
 * source of truth future phases plug into.
 */
export default function ExecutiveLeadershipTeamPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/live-today" label="Back to Live Today" />
        </div>
        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            The Executive Leadership Team™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            A private executive team for your founder-led business. Each executive represents a permanent leadership
            function — coordinated entirely by Cherry Blossom™, your only primary guide.
          </p>
        </header>

        {/* The Conductor */}
        <ConductorPanel />

        {/* The roster */}
        <section className="harmony-section" aria-labelledby="roster-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="roster-heading" className="ds-page-title">
              The Executives
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Nine executive functions, always in residence. Cherry Blossom™ introduces the right one when your work
              calls for it — you never have to choose.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EXECUTIVE_TEAM.map((executive) => (
              <ExecutiveCard key={executive.id} executive={executive} />
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">One Guide. A Full Team.</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;You lead the business. I&apos;ll coordinate the team.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              This page is here for reference and trust. In your day-to-day work, Cherry Blossom™ orchestrates the
              Executive Leadership Team™ on your behalf — bringing in each executive based on your Harmony Context™.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              The executives run your business. To see the advisors who help{" "}
              <span className="italic">protect</span> it, visit your{" "}
              <Link
                href="/professional-advisory-network"
                className="font-semibold text-brand-green underline-offset-4 hover:underline"
              >
                Professional Advisory Network™
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
