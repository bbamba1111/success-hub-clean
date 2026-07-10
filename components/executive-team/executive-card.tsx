import type { Executive } from "@/lib/executive-team/executive-registry"

/**
 * ExecutiveCard — an elegant executive profile for the boardroom.
 * Presentation only: no chat, prompts, tools, or recommendation logic.
 * Warm neutrals, editorial typography, restrained borders — a member of a
 * private executive team, not a chatbot tile.
 */
export function ExecutiveCard({ executive }: { executive: Executive }) {
  const { name, executiveTitle, department, mission, primaryResponsibilities, availableDeliverables } = executive

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      {/* Department + reserved status marker */}
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">{department}</p>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-brand-ink-soft/70">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green/50" aria-hidden />
          In Residence
        </span>
      </div>

      {/* Name + formal title */}
      <div className="mt-4">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-brand-ink">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-brand-green">{executiveTitle}</p>
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

      {/* Example deliverables — restrained tokens, pushed to the base of the card */}
      <div className="mt-6 pt-1">
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
    </article>
  )
}
