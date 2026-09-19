import type { Competency } from "@/lib/harmony-academy/competencies"

/**
 * CompetencyCard — a single Competency™ (demonstrated capability).
 *
 * Presentation only, and intentionally restrained: NO scores, progress bars,
 * badges, or gamification. A competency represents what a founder can DO, and
 * links to the lessons that develop it — recognition arrives in a future phase.
 */
export function CompetencyCard({ competency }: { competency: Competency }) {
  const lessonCount = competency.relatedLessons.length

  return (
    <article className="harmony-surface flex h-full flex-col p-5 sm:p-6">
      <h3 className="ds-section-title text-lg">{competency.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{competency.description}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.1em] text-brand-ink-soft/70">
        {lessonCount === 1 ? "Developed through 1 lesson" : `Developed through ${lessonCount} lessons`}
      </p>
    </article>
  )
}
