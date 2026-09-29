import type { LearningPath } from "@/lib/harmony-academy/learning-paths"

/**
 * LearningPathCard — an outcome-based Learning Path™.
 *
 * Presentation only. A path is named for the OUTCOME a founder wants, then
 * shows the ordered steps that lead there. No enrollment or progress tracking.
 */
export function LearningPathCard({ path }: { path: LearningPath }) {
  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      <p className="ds-eyebrow">Learning Path™</p>

      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-ink text-balance">
        {path.title}
      </h3>

      <p className="mt-3 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{path.description}</p>

      {/* Outcome */}
      <div className="mt-5 rounded-lg border border-brand-green/20 bg-brand-green/[0.06] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-green-dark">Outcome</p>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-ink">{path.outcome}</p>
      </div>

      <hr className="harmony-divider my-6" />

      {/* Ordered steps */}
      <div className="mt-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">The Journey</p>
        <ol className="mt-3 space-y-2">
          {path.steps.map((step, i) => (
            <li key={step.title} className="flex items-center gap-3 text-sm text-brand-ink-soft">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-semibold text-brand-green-dark"
              >
                {i + 1}
              </span>
              <span>{step.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}
