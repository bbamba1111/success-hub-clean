import type { College } from "@/lib/harmony-academy/academy-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"

/**
 * CollegeCard — one of the Five Colleges™ of Harmony Business Academy™.
 *
 * Presentation only: no lessons, enrollment, or progress. An editorial panel
 * that names the College, its Executive Owner™ (referenced from the Executive
 * Leadership Team™ registry — never duplicated), and the subjects it develops.
 */
export function CollegeCard({ college }: { college: College }) {
  const owner = getExecutive(college.executiveOwnerId)

  return (
    <article className="harmony-panel flex h-full flex-col p-6 ds-transition hover:-translate-y-0.5 hover:shadow-ds-md sm:p-7">
      <p className="ds-eyebrow">College</p>

      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-brand-ink">{college.name}</h3>

      <p className="mt-3 font-serif text-[0.95rem] italic leading-relaxed text-brand-ink-soft">{college.tagline}</p>

      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{college.description}</p>

      {owner ? (
        <p className="mt-5 text-sm text-brand-ink-soft">
          Led by <span className="font-semibold text-brand-green">{owner.name}</span>
        </p>
      ) : null}

      <hr className="harmony-divider my-6" />

      <div className="mt-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Subjects</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {college.subjects.map((subject) => (
            <span
              key={subject}
              className="rounded-md border border-black/[0.07] bg-muted px-2.5 py-1 text-xs text-brand-ink-soft"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
