/**
 * WeeklyReviewPanel™ — Phase 14.0
 * Full display of a single WeeklyReview.
 */

import { CheckCircle, Lightbulb, TrendingUp, AlertTriangle, Flower2 } from "lucide-react"
import { HarmonyScoreCard } from "./harmony-score-card"
import { ReviewMetricCard } from "./review-metric-card"
import { CherryBlossomLetter } from "./cherry-blossom-letter"
import type { WeeklyReview } from "@/lib/executive-reviews/types"

export function WeeklyReviewPanel({ review }: { review: WeeklyReview }) {
  return (
    <div className="space-y-6">
      {/* Period header */}
      <div>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
          Executive Review™
        </p>
        <h2 className="font-playfair text-2xl font-semibold text-brand-ink sm:text-3xl">
          {review.period.label}
        </h2>
        <p className="mt-1 font-montserrat text-xs text-brand-ink-soft">
          Generated {new Date(review.period.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Harmony Score */}
      <HarmonyScoreCard score={review.harmonyScore} />

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {review.metrics.map((m) => (
          <ReviewMetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Wins */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-brand-green" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
            This Week&apos;s Wins
          </h3>
        </div>
        <ul className="space-y-2">
          {review.wins.map((win, i) => (
            <li key={i} className="flex items-start gap-2 font-montserrat text-sm text-brand-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
              {win}
            </li>
          ))}
        </ul>
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[#C8874A]" />
          <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-ink">
            Insights
          </h3>
        </div>
        <ul className="space-y-2">
          {review.insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 font-montserrat text-sm text-brand-ink">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8874A]" aria-hidden />
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunity + Risk */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-green" />
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-brand-green">
              Top Opportunity
            </h3>
          </div>
          <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{review.topOpportunity}</p>
        </div>
        <div className="rounded-xl border border-[#E26C73]/30 bg-[#E26C73]/5 p-5">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#E26C73]" />
            <h3 className="font-montserrat text-xs font-bold uppercase tracking-wide text-[#E26C73]">
              Protect Against
            </h3>
          </div>
          <p className="font-montserrat text-sm leading-relaxed text-brand-ink">{review.topRisk}</p>
        </div>
      </div>

      {/* Cherry Blossom letter */}
      <CherryBlossomLetter letter={review.cherryBlossomLetter} />
    </div>
  )
}
