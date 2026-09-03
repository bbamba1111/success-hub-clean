"use client"

/**
 * Founder GPS™ Workspace — the ONE canonical CEO Workday™.
 *
 * Answers "What should I work on today?" Founder GPS™ (`deriveNextBestMove`)
 * still does 100% of the reasoning — Business Destination™ + Business
 * Stage™ + ESA + Work-Life Balance™ → Next Best Move™ — this file just no
 * longer renders every intermediate artifact of that reasoning. When the
 * move maps to a real Business Asset™ (`getRecommendedBusinessAsset`,
 * existing/unchanged), it shows why THAT specific asset matters —
 * hand-written, asset-specific benefits from `audience-benefits.ts`, never a
 * generic paragraph.
 *
 * "Start Building" no longer navigates away from the workspace. It adds the
 * recommended asset to Today's Work™ (source: "gps") and the founder builds
 * it inline, right here — see `TodaysWorkQueue`. The
 * `/business-asset-library/{id}` route still exists for direct/deep-link
 * access; this workspace simply doesn't have to leave itself to reach it.
 *
 * Below the GPS recommendation, the full CEO Work category menu
 * (`CategorySelectorRow`) and the founder's execution queue
 * (`TodaysWorkQueue`) let the founder queue and work multiple items across
 * all 12 CEO Work categories — not just the one GPS surfaced.
 *
 * Everything this used to render inline — Business Destination™/Reality™/Gap
 * Map, the Decide·Delegate·Design/Build Path picker, the full Build
 * Blueprint™/Guide/Second Opinion/Education stack, and Ask Your AI Executive
 * Team™ — is UNCHANGED as an engine and still reachable from Build Command
 * Center™ once a build is underway. None of it was deleted; it simply isn't
 * the CEO Workday's job to show it all at once anymore.
 *
 * Mounted by `TodaysCeoWorkdayCard`.
 */

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Hammer, Navigation } from "lucide-react"

import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import { getActiveBuildStatusByCapabilityId, getBuildRecord } from "@/lib/build-record/build-record-store"
import { getRecommendedBusinessAsset } from "@/lib/business-asset-library/gps-recommendation-link"
import { getAudienceBenefits } from "@/lib/business-asset-library/audience-benefits"
import { addWorkItem, getTodaysWork, hasQueuedAsset } from "@/lib/ceo-workday/todays-work-store"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { CategorySelectorRow } from "@/components/ceo-workday/category-selector-row"
import { TodaysWorkQueue } from "@/components/ceo-workday/todays-work-queue"
import { CeoWorkdayLivePlan } from "@/components/ceo-workday/ceo-workday-live-plan"
import { ArticulationHighlightBanner } from "@/components/articulation/articulation-highlight-banner"

/** Plain-language status pill label for every real `BuildLifecycleStatus`. Falls back to "In Progress" for any other active, non-terminal state. */
const STATUS_LABEL: Record<string, string> = {
  "not-started": "Not Started",
  recommended: "Not Started",
  "path-selected": "In Progress",
  accepted: "In Progress",
  "in-progress": "In Progress",
  briefed: "In Progress",
  "awaiting-external": "In Progress",
  blocked: "In Progress",
  paused: "In Progress",
  review: "In Progress",
  "revision-requested": "In Progress",
  "ready-to-install": "In Progress",
  installing: "In Progress",
  installed: "Complete",
  measuring: "Complete",
}

export function FounderGpsWorkspace() {
  const harmony = useHarmonyContextOptional()
  const snapshot = harmony?.snapshot
  const founderDestination = harmony?.founderDestination
  const [queuedAssetId, setQueuedAssetId] = useState<string | null>(null)

  const nextBestMove =
    snapshot?.ready
      ? deriveNextBestMove(buildGpsContextFromSnapshot(snapshot), {
          founderDestination,
          esaResults: snapshot.business.esaResults,
          operatingHistory: snapshot.intelligence.operatingHistory,
          // Phase 10 — Build Record™ feedback loop: an already-building or
          // installed capability is never re-recommended here either.
          capabilityBuildStatusById: getActiveBuildStatusByCapabilityId(),
        })
      : null

  // The Business Asset™ this move maps to, if any — the existing, already
  // honest `getRecommendedBusinessAsset` link. No new matching logic. Guarded
  // with `nextBestMove &&` since GPS may not have a move yet (e.g. Founder
  // Destination™ isn't set) — the category menu and Today's Work queue
  // below still work either way, so the founder is never blocked from
  // choosing their own work just because GPS has nothing to say yet.
  const asset = nextBestMove ? getRecommendedBusinessAsset(nextBestMove) : null
  const recommendationId = nextBestMove?.readinessCapabilityId ?? nextBestMove?.id
  const buildRecord = recommendationId ? getBuildRecord(recommendationId) : null
  const statusLabel = STATUS_LABEL[buildRecord?.status ?? "not-started"] ?? "Not Started"

  // Hand-written, asset-specific "Why build this?" copy — never a generic
  // paragraph. Only present when we have a real asset match, so it's never
  // fabricated for a move that isn't actually tied to one.
  const benefits = asset ? getAudienceBenefits(asset.id) : undefined

  function handleStartBuilding() {
    if (!asset) return
    if (!hasQueuedAsset(asset.id)) {
      addWorkItem({
        category: "BUILD",
        selectedOptionLabel: asset.name,
        workflowId: getWorkflowEntry("BUILD").workflowId,
        availability: "available",
        source: "gps",
        sourceDetail: "Founder GPS™ Next Best Move™",
        relatedAssetId: asset.id,
        relatedGapId: recommendationId,
        tangibleOutcome: "Business Asset™",
      })
    }
    setQueuedAssetId(asset.id)
  }

  // A GPS move that has no Business Asset™ link yet is still real work.
  // Previously the CTA was a Link to "/?openSpace=ceo-workday" — which, from
  // inside the CEO Workday, just reloaded the home page at the hero and never
  // showed the move. Now the move is rendered inline (below) and this puts it
  // straight into Today's Work so the founder can start it.
  const moveQueued =
    !!recommendationId && getTodaysWork().some((w) => w.relatedGapId === recommendationId)
  function handleStartMove() {
    if (!nextBestMove || !recommendationId) return
    if (!moveQueued) {
      const wf = getWorkflowEntry("BUILD")
      addWorkItem({
        category: "BUILD",
        selectedOptionLabel: nextBestMove.capabilityName ?? nextBestMove.nextTurn,
        workflowId: wf.workflowId,
        availability: wf.availability,
        source: "gps",
        sourceDetail: "Founder GPS™ Next Best Move™",
        relatedGapId: recommendationId,
        tangibleOutcome: nextBestMove.expectedOutcome ?? nextBestMove.definitionOfDone,
        purpose: nextBestMove.reason,
        expectedEvidence: nextBestMove.expectedOutcome ?? nextBestMove.definitionOfDone,
      })
    }
    setQueuedAssetId(recommendationId)
  }

  return (
    <div className="space-y-6">
      {/* The CEO Workday™ plan designed in Decide & Design™ — arrival banner,
          declaration, adjust step, hour blocks and the deterministic hourly
          5-Minute Check-In™. Renders nothing when no plan was designed today,
          so the existing GPS recommendation + queue below are untouched. */}
      <CeoWorkdayLivePlan />

      {!nextBestMove ? (
        <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-10 text-center space-y-5">
          <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-sm mx-auto text-pretty">
            We&apos;ll show you what to work on today as soon as we know a little more about your business —
            complete a few sections of your Blueprint to get started. In the meantime, you can still choose your own
            work below.
          </p>
          <Link
            href="/founder-destination"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-6 py-3 font-sans text-sm font-bold text-white hover:opacity-90 transition-opacity"
          >
            Set Your Founder Destination™
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-7 sm:px-8 sm:py-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <Navigation className="h-5 w-5 text-[#5A7A45]" aria-hidden />
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
              Today&apos;s Next Best Move™
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8DFE2] bg-white px-6 py-6 space-y-6">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-2xl font-semibold text-[#2E1F27] text-pretty leading-tight">
                {asset ? <>Build Your {asset.name}</> : nextBestMove.capabilityName ?? "Your Next Move"}
              </p>
              {asset && (
                <span className="shrink-0 inline-flex items-center rounded-full bg-[#8DAE72]/15 px-3.5 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#5A7A45] whitespace-nowrap">
                  {statusLabel}
                </span>
              )}
            </div>

            {asset && benefits ? (
              <>
                <div className="space-y-4">
                  <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#6B5860]">
                    Why build this?
                  </p>

                  <div className="space-y-3">
                    <BenefitRow label="For You" text={benefits.founder} />
                    <BenefitRow label="For Your Business" text={benefits.business} />
                    <BenefitRow label="For Your Client" text={benefits.customer} />
                    {benefits.team && <BenefitRow label="For Your Team" text={benefits.team} />}
                  </div>
                </div>

                <p className="font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
                  Your AI Executive will help you build it, step by step.
                </p>

                <button
                  type="button"
                  onClick={handleStartBuilding}
                  disabled={queuedAssetId === asset.id}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-7 py-3.5 font-sans text-base font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-default"
                >
                  {queuedAssetId === asset.id ? "Added to Today's Work" : "Start Building"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            ) : (
              <>
                {/* The move itself — rendered here, never behind a link that
                    leaves the CEO Workday. */}
                <div className="space-y-4">
                  <p className="font-sans text-base leading-relaxed text-[#2E1F27] text-pretty">{nextBestMove.nextTurn}</p>
                  <BenefitRow label="Why now" text={nextBestMove.whyNow ?? nextBestMove.reason} />
                  {nextBestMove.currentState && nextBestMove.targetState && (
                    <BenefitRow label="From → To" text={`${nextBestMove.currentState} → ${nextBestMove.targetState}`} />
                  )}
                  {(nextBestMove.expectedOutcome ?? nextBestMove.definitionOfDone) && (
                    <BenefitRow label="Expected outcome" text={nextBestMove.expectedOutcome ?? nextBestMove.definitionOfDone!} />
                  )}
                  {nextBestMove.sequencing && nextBestMove.sequencing.length > 0 && (
                    <div className="flex gap-3">
                      <span className="w-28 shrink-0 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5A7A45] pt-0.5">
                        Steps
                      </span>
                      <ol className="space-y-1 font-sans text-sm leading-relaxed text-[#3A2E33]">
                        {nextBestMove.sequencing.map((s, i) => (
                          <li key={i}>
                            {i + 1}. {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStartMove}
                  disabled={moveQueued || queuedAssetId === recommendationId}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-7 py-3.5 font-sans text-base font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-default"
                >
                  {moveQueued || queuedAssetId === recommendationId ? "Added to Today's Work" : "Start This Move"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ArticulationHighlightBanner />

      <div className="space-y-4">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#6B5860]">
          What do you need to work on?
        </p>
        <CategorySelectorRow onItemAdded={() => setQueuedAssetId(null)} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Hammer className="h-4 w-4 text-[#5A7A45]" aria-hidden />
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
            Today&apos;s Work™
          </p>
        </div>
        <TodaysWorkQueue />
      </div>
    </div>
  )
}

/** One "For ___" benefit line — bold label, then the plain-language sentence(s). */
function BenefitRow({ label, text }: { label: string; text: string }) {
  return (
    <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
      <span className="font-bold text-[#2E1F27]">{label}: </span>
      {text}
    </p>
  )
}
