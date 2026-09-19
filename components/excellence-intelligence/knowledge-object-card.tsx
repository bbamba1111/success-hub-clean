import type { KnowledgeObject, EvidenceLevel } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import { getBusinessConcept } from "@/lib/business-concepts/business-concepts-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import { getAdvisor } from "@/lib/advisory-network/advisor-registry"
import { getAcademyItem } from "@/lib/harmony-academy/academy-registry"
import { getDeliverable } from "@/lib/output-architecture/deliverable-registry"

const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  foundational: "Foundational",
  "well-established": "Well-Established",
  emerging: "Emerging",
  proprietary: "Harmony Lane™ IP",
}

/** A small labeled group of connection chips. Renders nothing when empty. */
function ConnectionGroup({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-black/[0.07] bg-muted px-2 py-0.5 text-xs text-brand-ink-soft"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * KnowledgeObjectCard — one canonical unit of executive knowledge in the
 * Excellence Intelligence Engine™.
 *
 * Presentation only. Resolves every cross-reference (Business Concepts™,
 * Executives™, Advisors™, Academy™, Deliverables™) to its display name from the
 * source registry — knowledge is never duplicated here, only referenced.
 */
export function KnowledgeObjectCard({ object }: { object: KnowledgeObject }) {
  const concepts = object.businessConcepts.map((id) => getBusinessConcept(id)?.term ?? id)
  const executives = object.relatedExecutives.map((id) => getExecutive(id)?.name ?? id)
  const advisors = object.relatedAdvisors.map((id) => getAdvisor(id)?.name ?? id)
  const academy = object.relatedAcademyItems.map((id) => getAcademyItem(id)?.title ?? id)
  const deliverables = object.relatedDeliverables.map((id) => getDeliverable(id)?.name ?? id)

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">Knowledge Object</p>
        <span className="rounded-full border border-black/[0.07] bg-card px-2.5 py-0.5 text-xs font-medium text-brand-green">
          {EVIDENCE_LABEL[object.evidenceLevel]}
        </span>
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-brand-ink">{object.title}</h3>

      <p className="mt-2 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{object.description}</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{object.summary}</p>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Key Principles</p>
        <ul className="mt-2 space-y-1.5">
          {object.keyPrinciples.map((principle) => (
            <li key={principle} className="flex gap-2 text-sm leading-relaxed text-brand-ink">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
              {principle}
            </li>
          ))}
        </ul>
      </div>

      <hr className="harmony-divider my-6" />

      <div className="mt-auto space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink">Powers</p>
        <ConnectionGroup label="Business Concepts" items={concepts} />
        <ConnectionGroup label="Executives" items={executives} />
        <ConnectionGroup label="Advisors" items={advisors} />
        <ConnectionGroup label="Academy" items={academy} />
        <ConnectionGroup label="Deliverables" items={deliverables} />
      </div>
    </article>
  )
}
