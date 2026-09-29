import type { EvidenceLevel, ReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import { getReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import { getBusinessConcept } from "@/lib/business-concepts/business-concepts-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import { getAdvisor } from "@/lib/advisory-network/advisor-registry"
import { getAcademyItem } from "@/lib/harmony-academy/academy-registry"
import { getDeliverable } from "@/lib/output-architecture/deliverable-registry"
import { getBusinessStage } from "@/lib/business-stage/business-stage"

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
 * ReadinessCapabilityCard — one "what must exist before the next Business
 * Stage™" knowledge unit (Phase 3: Proactive Start, Growth & Scale
 * Readiness™).
 *
 * Mirrors `KnowledgeObjectCard`'s cross-reference resolution exactly — every
 * connection resolves to its display name from the source registry, never
 * duplicated here. Adds the one thing plain Knowledge Objects™ don't express:
 * the Business Stage™ sequence this capability installs across.
 */
export function ReadinessCapabilityCard({ capability }: { capability: ReadinessCapability }) {
  const concepts = capability.businessConcepts.map((id) => getBusinessConcept(id)?.term ?? id)
  const executives = capability.relatedExecutives.map((id) => getExecutive(id)?.name ?? id)
  const advisors = capability.relatedAdvisors.map((id) => getAdvisor(id)?.name ?? id)
  const academy = capability.relatedAcademyItems.map((id) => getAcademyItem(id)?.title ?? id)
  const deliverables = capability.relatedDeliverables.map((id) => getDeliverable(id)?.name ?? id)
  const practices = capability.relatedPractices.map((id) => getReadinessCapability(id)?.title ?? id)
  const installDuring = capability.businessStages.map((stage) => getBusinessStage(stage).name)
  const preparesFor = getBusinessStage(capability.nextReadinessStage).name

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">Readiness Capability</p>
        <span className="rounded-full border border-black/[0.07] bg-card px-2.5 py-0.5 text-xs font-medium text-brand-green">
          {EVIDENCE_LABEL[capability.evidenceLevel]}
        </span>
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-brand-ink">{capability.title}</h3>

      <p className="mt-2 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{capability.principle}</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{capability.capability}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-brand-ink-soft">
        <span className="rounded-md border border-black/[0.07] bg-muted px-2.5 py-1">
          Install during {installDuring.join(" / ")}™
        </span>
        <span aria-hidden>→</span>
        <span className="rounded-md border border-black/[0.07] bg-muted px-2.5 py-1">Prepares for {preparesFor}™</span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Leading Indicators</p>
        <ul className="mt-2 space-y-1.5">
          {capability.leadingIndicators.map((indicator) => (
            <li key={indicator} className="flex gap-2 text-sm leading-relaxed text-brand-ink">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-green" />
              {indicator}
            </li>
          ))}
        </ul>
      </div>

      {capability.externalSource ? (
        <p className="mt-4 text-xs leading-relaxed text-brand-ink-soft">
          <span className="font-semibold">External synthesis. </span>
          {capability.externalSource.sourceDescriptor}
        </p>
      ) : null}

      <hr className="harmony-divider my-6" />

      <div className="mt-auto space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-ink">Powers</p>
        <ConnectionGroup label="Business Concepts" items={concepts} />
        <ConnectionGroup label="Executives" items={executives} />
        <ConnectionGroup label="Advisors" items={advisors} />
        <ConnectionGroup label="Academy" items={academy} />
        <ConnectionGroup label="Deliverables" items={deliverables} />
        <ConnectionGroup label="Sequences With" items={practices} />
      </div>
    </article>
  )
}
