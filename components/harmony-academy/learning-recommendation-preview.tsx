import { CherryGuidance } from "@/components/cherry-blossom/cherry-guidance"

/**
 * LearningRecommendationPreview — architecture preview of how Cherry Blossom™
 * will recommend learning contextually inside the workday.
 *
 * IMPORTANT: architecture only. There is NO recommendation engine this phase.
 * This is a static illustration of the intended pattern — "learning finds the
 * founder" — so the shape is established before any logic is built. The buttons
 * are intentionally non-interactive and marked as such.
 */
export function LearningRecommendationPreview() {
  return (
    <div>
      <CherryGuidance title="Before we begin today…">
        <p>
          Today&apos;s CEO Workday includes hiring your first Operations Coordinator. Before we begin, I&apos;d like to
          recommend a short Executive Insight™:{" "}
          <span className="font-semibold text-brand-ink">How High-Performing Companies Design Roles Before Hiring.</span>{" "}
          It&apos;s five minutes, and it will make today&apos;s work noticeably easier.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-disabled="true"
            className="ds-btn-primary cursor-default"
            title="Preview — not yet interactive"
          >
            Learn First
          </button>
          <button
            type="button"
            aria-disabled="true"
            className="ds-btn-ghost cursor-default"
            title="Preview — not yet interactive"
          >
            Skip &amp; Implement
          </button>
        </div>
      </CherryGuidance>

      <p className="mt-3 text-center text-xs italic leading-relaxed text-brand-ink-soft/80">
        Preview — contextual learning recommendations arrive in a future phase. Today, this shows how learning will find
        the founder inside the workday.
      </p>
    </div>
  )
}
