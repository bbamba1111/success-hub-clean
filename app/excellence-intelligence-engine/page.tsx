import type { Metadata } from "next"
import Link from "next/link"
import { BackLink } from "@/components/navigation/page-nav"
import { KnowledgeDomainCard } from "@/components/excellence-intelligence/knowledge-domain-card"
import { KnowledgeObjectCard } from "@/components/excellence-intelligence/knowledge-object-card"
import { ReasoningHierarchy } from "@/components/excellence-intelligence/reasoning-hierarchy"
import {
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_OBJECTS,
  getKnowledgeObjectsByDomain,
} from "@/lib/excellence-intelligence/excellence-intelligence-registry"

export const metadata: Metadata = {
  title: "Excellence Intelligence Engine™ | Make Time For More",
  description:
    "The Canonical Knowledge Layer™ of the Harmony Lane™ Operating System — the single source of enduring business knowledge that powers Cherry Blossom™, the Executive Leadership Team™, the Academy™, and Deliverables™. Not an AI engine, search engine, or content library.",
}

/**
 * Excellence Intelligence Engine™ (Phase 5.8).
 *
 * An INTERNAL architectural view of the Canonical Knowledge Layer™ — not a
 * public learning center. Presents the Four Knowledge Domains™, the canonical
 * Knowledge Objects and their cross-system connections, and the documented
 * Cherry Blossom™ Reasoning Hierarchy™.
 *
 * Architecture only: no AI, no search, no editing, no recommendation logic. The
 * registry (lib/excellence-intelligence/*) is the single source of truth.
 */
export default function ExcellenceIntelligenceEnginePage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/" label="Back to Live Today" />
        </div>

        {/* Hero */}
        <header className="harmony-section text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            Excellence Intelligence Engine™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            The Canonical Knowledge Layer™ — the single source of enduring business knowledge from which every other
            system learns. Not an AI engine, a search engine, or a content library, but the curated body of executive
            knowledge that powers every recommendation across Harmony Lane™.
          </p>
        </header>

        {/* Core philosophy */}
        <section className="harmony-section pt-0" aria-labelledby="philosophy-heading">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">Core Philosophy</p>
            <h2 id="philosophy-heading" className="sr-only">
              Core Philosophy
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;Harmony Lane™ does not teach personalities. It teaches enduring business principles.&rdquo;
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              The principle stays constant for every founder — regardless of industry, Business Stage™, size, Business
              Comprehension™, language, or location. The Harmony Context Engine™ adapts the explanation, examples, and
              recommendations to each founder&apos;s context. One unified operating system, one body of knowledge, many
              contexts.
            </p>
          </div>
        </section>

        {/* The Four Knowledge Domains */}
        <section className="harmony-section pt-0" aria-labelledby="domains-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="domains-heading" className="ds-page-title">
              The Four Knowledge Domains™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Every unit of knowledge belongs to one permanent domain — from research-supported foundations to Harmony
              Lane&apos;s own proprietary methodology.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {KNOWLEDGE_DOMAINS.map((domain) => (
              <KnowledgeDomainCard
                key={domain.id}
                domain={domain}
                count={getKnowledgeObjectsByDomain(domain.id).length}
              />
            ))}
          </div>
        </section>

        {/* Knowledge Objects, grouped by domain */}
        <section className="harmony-section pt-0" aria-labelledby="objects-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="objects-heading" className="ds-page-title">
              Canonical Knowledge Objects
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Each object is a unit of executive knowledge that connects to the systems it powers. Definitions are never
              duplicated — every connection references one canonical source.
            </p>
          </div>

          <div className="mt-12 space-y-14">
            {KNOWLEDGE_DOMAINS.map((domain) => {
              const objects = getKnowledgeObjectsByDomain(domain.id)
              if (objects.length === 0) return null
              return (
                <div key={domain.id}>
                  <div className="mb-6 flex items-baseline gap-3">
                    <h3 className="ds-section-title">{domain.name}</h3>
                    <span className="text-sm text-brand-ink-soft">
                      {objects.length} {objects.length === 1 ? "object" : "objects"}
                    </span>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {objects.map((object) => (
                      <KnowledgeObjectCard key={object.id} object={object} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Canonical knowledge principle */}
        <section className="harmony-section pt-0" aria-labelledby="canonical-heading">
          <div className="harmony-panel mx-auto max-w-4xl p-8 sm:p-10">
            <div className="text-center">
              <p className="ds-eyebrow">The Canonical Knowledge Principle</p>
              <h2 id="canonical-heading" className="ds-page-title mt-3">
                One Source. No Duplication.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
                {KNOWLEDGE_OBJECTS.length} knowledge objects connect outward to Business Concepts™, the Executive
                Leadership Team™, the Professional Advisory Network™, Harmony Business Academy™, and Deliverables™ — each
                referenced by id, never copied. The Academy™ consumes this knowledge rather than owning it, so the whole
                platform speaks one business language.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Business Concepts™", href: "/harmony-business-academy" },
                { label: "Executive Leadership Team™", href: "/executive-leadership-team" },
                { label: "Professional Advisory Network™", href: "/professional-advisory-network" },
                { label: "Harmony Business Academy™", href: "/harmony-business-academy" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-lg border border-black/[0.07] bg-card p-4 text-center text-sm font-medium text-brand-ink shadow-ds-sm ds-transition hover:-translate-y-0.5 hover:text-brand-green hover:shadow-ds-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Cherry Blossom Reasoning Hierarchy */}
        <section className="harmony-section pt-0" aria-labelledby="reasoning-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="reasoning-heading" className="ds-page-title">
              The Cherry Blossom™ Reasoning Hierarchy™
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              The order in which Cherry Blossom™ will one day reason — from who the founder is, through the canonical
              knowledge, to a single contextualized next step. Documented now; no reasoning is implemented yet.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <ReasoningHierarchy />
          </div>
        </section>

        {/* Closing note */}
        <section className="harmony-section pt-0">
          <div className="harmony-surface mx-auto max-w-3xl p-8 text-center sm:p-10">
            <p className="ds-eyebrow">The Brain of the Operating System</p>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-brand-ink">
              &ldquo;One canonical source of enduring knowledge — so every founder, from first business to mature
              organization, is guided by the same principles.&rdquo;
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-brand-ink-soft">
              Future Deliverables™, the AI Augmentation Hour™, and every executive and advisory interaction will inherit
              their knowledge here before the Harmony Context Engine™ adapts it to the founder&apos;s stage,
              communication style, language, and operating context.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
