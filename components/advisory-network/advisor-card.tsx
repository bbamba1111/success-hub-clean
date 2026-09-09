import type { Advisor } from "@/lib/advisory-network/advisor-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"

/**
 * AdvisorCard — an elegant advisor profile for the Professional Advisory
 * Network™. Presentation only: no chat, prompts, tools, or recommendation logic.
 *
 * It shares the visual language of the ExecutiveCard, with two advisor-specific
 * additions: the "Works with" executive links (advisors are brought in BY the
 * executives) and the Professional Review Notice (the protection disclaimer that
 * accompanies every output).
 */
export function AdvisorCard({ advisor }: { advisor: Advisor }) {
  const {
    name,
    advisorTitle,
    category,
    mission,
    primaryResponsibilities,
    availableDeliverables,
    professionalReviewNotice,
    relatedExecutives,
  } = advisor

  const executiveNames = relatedExecutives
    .map((id) => getExecutive(id)?.name)
    .filter((n): n is string => Boolean(n))

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      {/* Category + reserved status marker */}
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">{category}</p>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-brand-ink-soft/70">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green/50" aria-hidden />
          On Call
        </span>
      </div>

      {/* Name + advisory title */}
      <div className="mt-4">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-brand-ink">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-green">{advisorTitle}</p>
      </div>

      {/* Mission — editorial serif for warmth */}
      <p className="mt-4 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{mission}</p>

      <hr className="harmony-divider my-6" />

      {/* Responsibilities */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Responsibilities</p>
        <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
          {primaryResponsibilities.map((item, i) => (
            <li key={item} className="flex items-center text-sm text-brand-ink-soft">
              <span>{item}</span>
              {i < primaryResponsibilities.length - 1 && (
                <span className="ml-2 text-brand-green/40" aria-hidden>
                  &middot;
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Example deliverables */}
      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Example Deliverables</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableDeliverables.map((d) => (
            <span
              key={d}
              className="rounded-md border border-black/[0.07] bg-brand-cream px-2.5 py-1 text-xs text-brand-ink-soft"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Works with — advisors are brought in by the executives */}
      {executiveNames.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Works With</p>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{executiveNames.join(" · ")}</p>
        </div>
      )}

      {/* Professional Review Notice — the protection disclaimer, pushed to the base */}
      <div className="mt-auto pt-6">
        <p className="rounded-lg border border-brand-green/20 bg-brand-green/[0.06] px-4 py-3 text-xs leading-relaxed text-brand-ink-soft">
          <span className="font-semibold text-brand-ink">Professional Review Notice.</span> {professionalReviewNotice}
        </p>
      </div>
    </article>
  )
}
