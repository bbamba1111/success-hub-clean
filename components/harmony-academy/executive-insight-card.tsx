import type { AcademyItem } from "@/lib/harmony-academy/academy-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import { getAdvisor } from "@/lib/advisory-network/advisor-registry"
import { getBusinessConcept } from "@/lib/business-concepts/business-concepts-registry"

/**
 * ExecutiveInsightCard — a single Academy Item™ (typically an Executive
 * Insight™). Presentation only: no player, no content, no enrollment.
 *
 * Every card makes the Academy's promise visible: what you'll understand, and
 * what you'll be able to DO. Concepts are referenced from the canonical
 * Business Concepts™ registry (never redefined), and the Executive/Advisor
 * owners come from their registries.
 */
export function ExecutiveInsightCard({ item }: { item: AcademyItem }) {
  const owner = getExecutive(item.executiveOwner)
  const advisor = item.advisorOwner ? getAdvisor(item.advisorOwner) : null
  const concepts = item.businessConcepts
    .map((id) => getBusinessConcept(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      {/* Duration + type marker */}
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">Executive Insight™</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-2.5 py-0.5 text-xs font-semibold text-brand-green-dark">
          {item.estimatedDuration}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-brand-ink text-balance">
        {item.title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{item.description}</p>

      {/* Owner */}
      {owner ? (
        <p className="mt-4 text-sm text-brand-ink-soft">
          With <span className="font-semibold text-brand-green">{owner.name}</span>
          {advisor ? (
            <>
              {" "}
              &amp; <span className="font-semibold text-brand-green">{advisor.name}</span>
            </>
          ) : null}
        </p>
      ) : null}

      <hr className="harmony-divider my-6" />

      {/* Learning objectives — what you'll be able to do */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">You&apos;ll be able to</p>
        <ul className="mt-3 space-y-1.5">
          {item.learningObjectives.map((obj) => (
            <li key={obj} className="flex gap-2 text-sm leading-relaxed text-brand-ink-soft">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green/50" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Concepts referenced */}
      {concepts.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Business Concepts™</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {concepts.map((c) => (
              <span
                key={c.id}
                className="rounded-md border border-black/[0.07] bg-muted px-2.5 py-1 text-xs text-brand-ink-soft"
              >
                {c.term}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Execution promise */}
      <p className="mt-auto pt-6 text-xs italic leading-relaxed text-brand-ink-soft/80">
        Every insight leads to execution — not just understanding.
      </p>
    </article>
  )
}
