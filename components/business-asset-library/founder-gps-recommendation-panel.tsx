"use client"

/**
 * FounderGpsRecommendationPanel — Business Asset Library™ "Decision 1"
 * ("What should I work on?").
 *
 * Pure read of the existing Founder GPS™ / Next Best Move™ engine — the
 * exact same two calls `FounderGpsWorkspace` makes
 * (`buildGpsContextFromSnapshot` + `deriveNextBestMove`). No new
 * recommendation logic lives here. If the founder's current Next Best
 * Move™ maps to a real Business Asset™ (see gps-recommendation-link.ts),
 * this offers a direct "Build This Now" shortcut. Otherwise it points back
 * to Founder GPS™, where the recommendation actually lives.
 *
 * Renders nothing until the Harmony Context™ snapshot is ready, so it never
 * flashes an empty or wrong state.
 */

import Link from "next/link"
import { Compass, ArrowRight } from "lucide-react"
import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import { getRecommendedBusinessAsset } from "@/lib/business-asset-library/gps-recommendation-link"

export function FounderGpsRecommendationPanel() {
  const harmony = useHarmonyContextOptional()
  const snapshot = harmony?.snapshot

  const nextBestMove =
    snapshot?.ready
      ? deriveNextBestMove(buildGpsContextFromSnapshot(snapshot), {
          founderDestination: harmony?.founderDestination,
          esaResults: snapshot.business.esaResults,
          operatingHistory: snapshot.intelligence.operatingHistory,
        })
      : null

  if (!nextBestMove) return null

  const matchedAsset = getRecommendedBusinessAsset(nextBestMove)

  return (
    <section aria-labelledby="gps-recommendation-heading" className="mt-10">
      <div className="harmony-panel border-brand-green/30 bg-brand-green/5 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/15">
            <Compass className="h-5 w-5 text-brand-green" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="ds-eyebrow">Founder GPS™ Recommends</p>
            <h2
              id="gps-recommendation-heading"
              className="mt-1 text-balance font-display text-xl font-semibold tracking-tight text-brand-ink"
            >
              {nextBestMove.nextTurn}
            </h2>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink-soft">{nextBestMove.reason}</p>

            <div className="mt-4">
              {matchedAsset ? (
                <Link
                  href={`/business-asset-library/${matchedAsset.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green/90"
                >
                  Build This Now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : (
                <Link
                  href={nextBestMove.cta.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-white px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5"
                >
                  {nextBestMove.cta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-medium text-brand-ink-soft">— or browse and choose it yourself —</p>
    </section>
  )
}
