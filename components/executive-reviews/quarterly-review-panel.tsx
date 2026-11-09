/**
 * QuarterlyReviewPanel™ — Phase 14.0
 */

import { Compass, Lightbulb, Award } from "lucide-react"
import { HarmonyScoreCard } from "./harmony-score-card"
import { ReviewMetricCard } from "./review-metric-card"
import { CherryBlossomLetter } from "./cherry-blossom-letter"
import type { QuarterlyReview } from "@/lib/executive-reviews/types"

export function QuarterlyReviewPanel({ review }: { review: QuarterlyReview }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
          Quarterly Executive Review™
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-brand-ink sm:text-3xl">
          {review.period.label}
        </h2>
        <p className="mt-1 font-montserrat text-xs text-brand-ink-soft">
          Generated {new Date(review.period.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <HarmonyScoreCard score={review.harmonyScore} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {review.metrics.map((m) => (
          <ReviewMetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Strategic narrative */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-2 flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#4A8C8C]" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
            Strategic Narrative
          </h3>
        </div>
        <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{review.strategicNarrative}</p>
      </div>

      {/* Defining Moments */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-[#C8A84B]" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
            Defining Moments
          </h3>
        </div>
        <ul className="space-y-2">
          {review.definingMoments.map((m, i) => (
            <li key={i} className="flex items-start gap-2 font-montserrat text-sm text-brand-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A84B]" aria-hidden />
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Executive Recommendations */}
      <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-brand-green" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-green">
            Executive Recommendations
          </h3>
        </div>
        <ol className="space-y-3">
          {review.executiveRecommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green font-montserrat text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{rec}</p>
            </li>
          ))}
        </ol>
      </div>

      <CherryBlossomLetter letter={review.cherryBlossomLetter} />
    </div>
  )
}
