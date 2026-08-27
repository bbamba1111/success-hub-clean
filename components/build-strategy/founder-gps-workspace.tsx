"use client"

/**
 * Founder GPS™ Workspace — the CEO Workday's simple front door.
 *
 * Answers exactly one question: "What should I work on today?" Founder
 * GPS™ (`deriveNextBestMove`) still does 100% of the reasoning — Business
 * Destination™ + Business Stage™ + ESA + Work-Life Balance™ → Next Best
 * Move™ — this file just no longer renders every intermediate artifact of
 * that reasoning. It shows the move, which Business Asset™ that move maps
 * to (`getRecommendedBusinessAsset`, existing/unchanged), who owns it, and
 * one "Start Building" action into the real build experience at
 * `/business-asset-library/{id}` — where Comprehension Level™/Communication
 * Style™, the owning Executive™, and Cherry Blossom™ already take over.
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

import Link from "next/link"
import { ArrowRight, Navigation } from "lucide-react"

import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import { getActiveBuildStatusByCapabilityId, getBuildRecord } from "@/lib/build-record/build-record-store"
import { getRecommendedBusinessAsset } from "@/lib/business-asset-library/gps-recommendation-link"
import { getExecutive } from "@/lib/executive-team/executive-registry"

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

  if (!nextBestMove) {
    return (
      <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-9 text-center space-y-4">
        <p className="font-sans text-sm leading-relaxed text-[#6B5860] max-w-sm mx-auto text-pretty">
          Your Founder GPS™ Next Best Move™ will appear here once your Blueprint has enough signal to reason over —
          complete a few sections there to activate it.
        </p>
        <Link
          href="/founder-destination"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C13B6B] px-5 py-2.5 font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          Set Your Founder Destination™
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    )
  }

  // The Business Asset™ this move maps to, if any — the existing, already
  // honest `getRecommendedBusinessAsset` link. No new matching logic.
  const asset = getRecommendedBusinessAsset(nextBestMove)
  const owningExecutive = asset?.ownerExecutiveIds?.[0] ? getExecutive(asset.ownerExecutiveIds[0]) : undefined
  const recommendationId = nextBestMove.readinessCapabilityId ?? nextBestMove.id
  const buildRecord = recommendationId ? getBuildRecord(recommendationId) : null
  const statusLabel = STATUS_LABEL[buildRecord?.status ?? "not-started"] ?? "Not Started"

  // Prefer a direct link into the real Business Asset™ build experience;
  // fall back to the move's own CTA only when no asset match exists.
  const startBuildingHref = asset ? `/business-asset-library/${asset.id}` : nextBestMove.cta.href
  const startBuildingLabel = asset ? "Start Building →" : nextBestMove.cta.label

  return (
    <div className="rounded-3xl border border-[#C13B6B]/25 bg-[#FBF1F5] px-6 py-6 sm:px-7 sm:py-7 space-y-5">
      <div className="flex items-center gap-2">
        <Navigation className="h-4 w-4 text-[#C13B6B]" aria-hidden />
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
          Today&apos;s Next Best Move™
        </p>
      </div>

      <div>
        <p className="font-display text-lg font-semibold text-[#2E1F27] text-pretty">{nextBestMove.nextTurn}</p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">{nextBestMove.reason}</p>
      </div>

      <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-3">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B5860]">Build This Today</p>

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-sans text-base font-semibold text-[#2E1F27] text-pretty">
              {asset?.name ?? nextBestMove.nextTurn}
            </p>
            {owningExecutive && (
              <p className="font-sans text-xs text-[#6B5860]">Owned by {owningExecutive.name}</p>
            )}
            {nextBestMove.estimatedTime && (
              <p className="font-sans text-xs text-[#6B5860]">Estimated focus: {nextBestMove.estimatedTime}</p>
            )}
          </div>
          <span className="shrink-0 inline-flex items-center rounded-full bg-[#C13B6B]/10 px-3 py-1 font-montserrat text-[9px] font-bold uppercase tracking-[0.12em] text-[#C13B6B] whitespace-nowrap">
            {statusLabel}
          </span>
        </div>

        <Link
          href={startBuildingHref}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#C13B6B] px-5 py-2.5 font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity"
        >
          {startBuildingLabel}
          {asset && <ArrowRight className="h-3.5 w-3.5" aria-hidden />}
        </Link>
      </div>
    </div>
  )
}
