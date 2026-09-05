import type { Metadata } from "next"
import { BackLink } from "@/components/navigation/page-nav"
import { AdvisorCard } from "@/components/advisory-network/advisor-card"
import { ADVISORY_NETWORK } from "@/lib/advisory-network/advisor-registry"

export const metadata: Metadata = {
  title: "Professional Advisory Network™ | Make Time For More",
  description:
    "The advisory layer of the Harmony Lane™ Leadership Ecosystem — trusted specialists Cherry Blossom™ brings in to protect your business.",
}

/**
 * The Professional Advisory Network™ (Phase 5.2).
 *
 * The second layer of the Harmony Lane™ Leadership Ecosystem. Where the
 * Executive Leadership Team™ RUNS the business, the Advisory Network™ PROTECTS
 * it — trusted legal, tax, funding, insurance, and compliance specialists Cherry
 * Blossom™ brings in contextually. NOT a directory of AI chatbots and NOT a
 * place members browse during normal workflow: architecture + trust only. The
 * registry (lib/advisory-network/advisor-registry.ts) is the single source of
 * truth future phases plug into.
 */
export default function ProfessionalAdvisoryNetworkPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/executive-leadership-team" label="Back to Executive Leadership Team" />
        </div>
        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Leadership Ecosystem</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            The Professional Advisory Network™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            Beyond the executives who run your business, you have a network of trusted advisors who protect it. When
            legal, financial, funding, insurance, or compliance expertise is needed, Cherry Blossom™ brings in the right
            advisor — you never have to go looking.
          </p>
        </header>

        {/* Executives run it, advisors protect it — the defining distinction */}
        <section className="harmony-glass relative overflow-hidden p-8 sm:p-10" aria-labelledby="distinction-heading">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div>
              <p className="ds-eyebrow">A Different Kind of Support</p>
              <h2
                id="distinction-heading"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl"
              >
                The executives run the business. The advisors protect it.
              </h2>
              <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-brand-ink-soft">
                &ldquo;I&apos;ll bring in the right advisor at the right moment — before a risk becomes a problem.&rdquo;
              </p>
            </div>

            <div className="harmony-surface p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
                How Cherry Blossom brings in an advisor
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-brand-ink">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                  &ldquo;Based on today&apos;s priorities, I&apos;d like to bring in our Business Credit Advisor™ to help
                  you strengthen your funding readiness before applying for financing.&rdquo;
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                  &ldquo;Because you&apos;re preparing to hire your first employee, I&apos;ll also invite our AI Legal
                  Advisor™ to help you prepare draft employment documentation for professional legal review.&rdquo;
                </li>
              </ul>
              <p className="mt-5 border-t border-black/[0.06] pt-4 text-sm leading-relaxed text-brand-ink-soft">
                You&apos;ll never browse advisors. Cherry Blossom introduces them contextually, in coordination with your
                Executive Leadership Team™.
              </p>
            </div>
          </div>
        </section>

        {/* The network */}
        <section className="harmony-section" aria-labelledby="network-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="network-heading" className="ds-page-title">
              The Advisors
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Five trusted advisors, on call across the areas that protect a founder-led business. Each provides
              education and drafting assistance — always paired with a clear note on when professional review is
              required.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVISORY_NETWORK.map((advisor) => (
              <AdvisorCard key={advisor.id} advisor={advisor} />
            ))}
          </div>
        </section>

        {/* Closing note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Education & Drafting, Not Licensed Advice</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Your advisors help you understand, prepare, and get ready — then hand you off to the right licensed
              professional with confidence.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              This page is here for reference and trust. In your day-to-day work, Cherry Blossom™ orchestrates the
              Professional Advisory Network™ on your behalf — bringing in each advisor based on your Harmony Context™.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
