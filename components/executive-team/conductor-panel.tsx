import { CHERRY_BLOSSOM } from "@/lib/executive-team/executive-registry"

/**
 * ConductorPanel — Cherry Blossom™, Chief of Staff & Executive Conductor™.
 * She is presented distinctly from the roster: the member's only primary guide
 * and the orchestrator of the entire team, never one option among many.
 */
export function ConductorPanel() {
  const { name, executiveTitle, mission, primaryResponsibilities } = CHERRY_BLOSSOM

  return (
    <section className="harmony-glass relative overflow-hidden p-8 sm:p-10" aria-labelledby="conductor-heading">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        {/* Identity */}
        <div>
          <p className="ds-eyebrow">Your Primary Guide</p>
          <h2 id="conductor-heading" className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            {name}
          </h2>
          <p className="mt-2 text-sm font-semibold text-brand-green">{executiveTitle}</p>
          <p className="mt-5 max-w-xl font-serif text-base italic leading-relaxed text-brand-ink-soft">{mission}</p>
        </div>

        {/* How she leads */}
        <div className="harmony-surface p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
            How Cherry Blossom leads the team
          </p>
          <ul className="mt-4 space-y-2.5">
            {primaryResponsibilities.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-brand-ink">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-black/[0.06] pt-4 text-sm leading-relaxed text-brand-ink-soft">
            You&apos;ll never browse assistants. Cherry Blossom brings in the right executive at the right moment, based
            on the week you designed and where you are today.
          </p>
        </div>
      </div>
    </section>
  )
}
