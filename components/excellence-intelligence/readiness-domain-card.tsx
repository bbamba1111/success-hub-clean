import type { ReadinessDomain } from "@/lib/excellence-intelligence/excellence-intelligence-registry"

/**
 * ReadinessDomainCard — one of the four Readiness domains™ (Phase 3:
 * Proactive Start, Growth & Scale Readiness™).
 *
 * Mirrors `KnowledgeDomainCard` exactly. Presentation only: no editing, AI,
 * or search. `count` is the number of Readiness Capabilities™ currently
 * architected in this domain.
 */
export function ReadinessDomainCard({ domain, count }: { domain: ReadinessDomain; count: number }) {
  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">Readiness Domain</p>
        <span className="rounded-full border border-black/[0.07] bg-muted px-2.5 py-0.5 text-xs font-medium text-brand-ink-soft">
          {count} {count === 1 ? "capability" : "capabilities"}
        </span>
      </div>

      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-ink">{domain.name}</h3>

      <p className="mt-3 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{domain.tagline}</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{domain.description}</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-ink">
        <span className="font-semibold">Purpose. </span>
        {domain.purpose}
      </p>

      <hr className="harmony-divider my-6" />

      <div className="mt-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Covers</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {domain.examples.map((example) => (
            <span
              key={example}
              className="rounded-md border border-black/[0.07] bg-muted px-2.5 py-1 text-xs text-brand-ink-soft"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
