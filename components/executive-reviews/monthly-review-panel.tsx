/**
 * MonthlyReviewPanel™ — Phase 14.0
 */

import { Star, TrendingUp, BarChart2 } from "lucide-react"
import { HarmonyScoreCard } from "./harmony-score-card"
import { ReviewMetricCard } from "./review-metric-card"
import { CherryBlossomLetter } from "./cherry-blossom-letter"
import type { MonthlyReview } from "@/lib/executive-reviews/types"

export function MonthlyReviewPanel({ review }: { review: MonthlyReview }) {
  return (
    <div className="space-y-6">
      {/* Period header */}
      <div>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
          Monthly Executive Review™
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

      {/* Business + Personal growth */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-black/[0.07] bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-green" />
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
              Business Growth
            </h3>
          </div>
          <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{review.businessGrowthSummary}</p>
        </div>
        <div className="rounded-xl border border-black/[0.07] bg-card p-5">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#C8A84B]" />
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
              Personal Growth
            </h3>
          </div>
          <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{review.personalGrowthSummary}</p>
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-[#C8A84B]" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">Milestones</h3>
        </div>
        <ul className="space-y-2">
          {review.milestones.map((m, i) => (
            <li key={i} className="flex items-start gap-2 font-montserrat text-sm text-brand-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8A84B]" aria-hidden />
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Patterns */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-[#4A8C8C]" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">Patterns Identified</h3>
        </div>
        <ul className="space-y-2">
          {review.patterns.map((p, i) => (
            <li key={i} className="flex items-start gap-2 font-montserrat text-sm text-brand-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4A8C8C]" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <CherryBlossomLetter letter={review.cherryBlossomLetter} />
    </div>
  )
}
