"use client"

/**
 * Decision Snapshot™ card (Phase 12)
 * ---------------------------------------------------------------------------
 * An at-a-glance summary of the founder's existing recommendation. Every
 * field comes from `deriveDecisionSnapshot()`, which restates real Founder
 * GPS™/Build Strategy™ signals — never a second recommendation.
 */

import { Compass, MessageCircleQuestion, BookOpen } from "lucide-react"

import type { DecisionSnapshot } from "@/lib/founder-guidance/types"

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/60 px-3.5 py-2.5">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-0.5">{label}</p>
      <p className="font-sans text-sm font-semibold text-brand-ink leading-snug text-pretty">{value}</p>
    </div>
  )
}

export function DecisionSnapshotCard({
  snapshot,
  onTeachMeThis,
  onSecondOpinion,
}: {
  snapshot: DecisionSnapshot
  onTeachMeThis?: () => void
  onSecondOpinion?: () => void
}) {
  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-1">
        Decision Snapshot™
      </p>
      <h3 className="font-display text-lg font-semibold text-brand-ink text-pretty mb-4">{snapshot.what}</h3>

      <div className="space-y-3 mb-4">
        <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{snapshot.why}</p>
        <p className="font-sans text-sm leading-relaxed text-brand-ink-soft/90 text-pretty">
          <span className="font-semibold text-brand-ink">Why now: </span>
          {snapshot.whyNow}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mb-4">
        <Field label="Recommended Path" value={snapshot.recommendedPath.label} />
        <Field label="Who Owns This" value={snapshot.owner} />
        <Field
          label="Confidence"
          value={snapshot.confidence.status === "unknown" ? "Not yet determined" : snapshot.confidence.label}
        />
        <Field label="Risk Of Doing Nothing" value={snapshot.riskOfDoingNothing} />
      </div>

      <div className="rounded-xl border border-[#C13B6B]/25 bg-[#C13B6B]/[0.05] px-4 py-3 mb-4 flex items-start gap-2.5">
        <Compass className="mt-0.5 h-4 w-4 shrink-0 text-[#C13B6B]" aria-hidden />
        <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">
          <span className="font-semibold">{snapshot.nextAction.label}: </span>
          {snapshot.nextAction.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {onTeachMeThis && (
          <button
            type="button"
            onClick={onTeachMeThis}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush/70 px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink-soft hover:border-[#C13B6B]/40 hover:text-[#C13B6B] transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Teach Me This
          </button>
        )}
        {onSecondOpinion && (
          <button
            type="button"
            onClick={onSecondOpinion}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush/70 px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink-soft hover:border-[#C13B6B]/40 hover:text-[#C13B6B] transition-colors"
          >
            <MessageCircleQuestion className="h-3.5 w-3.5" aria-hidden />
            Get a Second Opinion™
          </button>
        )}
      </div>
    </div>
  )
}
