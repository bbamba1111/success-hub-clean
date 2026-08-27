"use client"

/**
 * Founder GPS™ Workspace — the CEO Workday's simple front door.
 *
 * Answers exactly one question: "What should I work on today?" Founder
 * GPS™ (`deriveNextBestMove`) still does 100% of the reasoning — Business
 * Destination™ + Business Stage™ + ESA + Work-Life Balance™ → Next Best
 * Move™ — this file just no longer renders every intermediate artifact of
 * that reasoning. When the move maps to a real Business Asset™
 * (`getRecommendedBusinessAsset`, existing/unchanged), it shows why THAT
 * specific asset matters — hand-written, asset-specific benefits from
 * `audience-benefits.ts`, never a generic paragraph — plus one "Start
 * Building" action that routes directly to `/business-asset-library/{id}`,
 * where Comprehension Level™/Communication Style™, the owning Executive™,
 * and Cherry Blossom™ already take over. When there's no asset match, it
 * shows a plain review prompt instead of a misleading Start Building button.
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
import { getAudienceBenefits } from "@/lib/business-asset-library/audience-benefits"

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
      <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-10 text-center space-y-5">
        <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-sm mx-auto text-pretty">
          We&apos;ll show you what to work on today as soon as we know a little more about your business — complete a
          few sections of your Blueprint to get started.
        </p>
        <Link
          href="/founder-destination"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-6 py-3 font-sans text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Set Your Founder Destination™
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    )
  }

  // The Business Asset™ this move maps to, if any — the existing, already
  // honest `getRecommendedBusinessAsset` link. No new matching logic.
  const asset = getRecommendedBusinessAsset(nextBestMove)
  const recommendationId = nextBestMove.readinessCapabilityId ?? nextBestMove.id
  const buildRecord = recommendationId ? getBuildRecord(recommendationId) : null
  const statusLabel = STATUS_LABEL[buildRecord?.status ?? "not-started"] ?? "Not Started"

  // Hand-written, asset-specific "Why build this?" copy — never a generic
  // paragraph. Only present when we have a real asset match, so it's never
  // fabricated for a move that isn't actually tied to one.
  const benefits = asset ? getAudienceBenefits(asset.id) : undefined

  return (
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
            {asset ? <>Build Your {asset.name}</> : "Review Your Next Move"}
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

            <Link
              href={`/business-asset-library/${asset.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-7 py-3.5 font-sans text-base font-bold text-white hover:opacity-90 transition-opacity"
            >
              Start Building
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        ) : (
          <>
            <p className="font-sans text-base leading-relaxed text-[#6B5860] text-pretty">
              Founder GPS™ has a recommendation for you, but it isn&apos;t linked to a specific Business Asset™ yet.
              Review it before deciding what to build next.
            </p>
            <Link
              href={nextBestMove.cta.href}
              className="inline-flex items-center gap-2 rounded-full border border-[#5A7A45] px-7 py-3.5 font-sans text-base font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5 transition-colors"
            >
              {nextBestMove.cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </>
        )}
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
