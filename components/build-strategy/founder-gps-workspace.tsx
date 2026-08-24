"use client"

/**
 * Founder GPS™ Workspace — the founder's full Next Best Move™ → Build
 * Path™ → Build Blueprint™ → Business-Building Guide™ experience.
 *
 * This is a straight extraction of what was My Blueprint's Section 07
 * ("07 — Founder GPS™"). It creates no new recommendation, scoring, or
 * guidance logic — every engine call here (`deriveNextBestMove`,
 * `deriveBuildBlueprint`, `deriveRecommendedBuildPath`, `deriveSecondOpinion`,
 * `deriveBusinessBuildingGuide`, etc.) is the SAME canonical engine call that
 * lived in My Blueprint, moved here so it lives inside the live 4-Hour CEO
 * Workday™ segment — where the founder actually acts on it — instead of only
 * as a read-only summary on a separate page.
 *
 * Mounted by `TodaysCeoWorkdayCard`. My Blueprint now shows a lightweight
 * read-only summary linking back into this workspace instead of hosting the
 * full interactive flow itself.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Navigation } from "lucide-react"

import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import { buildGpsContextFromSnapshot, deriveNextBestMove } from "@/lib/founder-gps/next-best-move-engine"
import { BuildPathPicker } from "@/components/build-strategy/build-path-picker"
import { BuildBlueprintCard } from "@/components/build-strategy/build-blueprint-card"
import { SecondOpinionPanel } from "@/components/build-strategy/second-opinion-panel"
import { deriveBuildBlueprint } from "@/lib/build-strategy/blueprint-engine"
import { deriveRecommendedBuildPath, deriveSecondOpinion } from "@/lib/build-strategy/build-path-recommendation"
import { getBuildStrategy, saveBuildStrategy, clearBuildStrategy } from "@/lib/build-strategy/storage"
import type { BuildPathId } from "@/lib/build-strategy/types"
import {
  getActiveBuildStatusByCapabilityId,
  getBuildRecord,
  saveBuildRecord,
} from "@/lib/build-record/build-record-store"
import { deriveBuildRecord, appendActivityLogEntry } from "@/lib/build-record/build-record-engine"
import type { BuildRecord } from "@/lib/build-record/types"
import { upsertBuildRecordToDb } from "@/utils/build-record-storage"
import { getReadinessCapability } from "@/lib/excellence-intelligence/excellence-intelligence-registry"
import { getUnderstandingLevel, UNDERSTANDING_LEVEL_EVENT } from "@/lib/founder-guidance/understanding-level"
import {
  deriveBusinessBuildingGuide,
  filterSectionsForLevel,
  deriveDecisionSnapshot,
  deriveBuildPathEducation,
  deriveCoBuildDivision,
  deriveAiBuildBoundaries,
  deriveFounderOwnershipGuidance,
  deriveHandoffEducation,
  showMeAnExample,
  goDeeper,
  teachMeThis,
} from "@/lib/founder-guidance/business-building-guide-engine"
import { UnderstandingLevelPicker } from "@/components/founder-guidance/understanding-level-picker"
import { DecisionSnapshotCard } from "@/components/founder-guidance/decision-snapshot-card"
import { BusinessBuildingGuidePanel } from "@/components/founder-guidance/business-building-guide-panel"
import { BuildPathEducationPanel } from "@/components/founder-guidance/build-path-education-panel"
import { HandoffEducationPanel } from "@/components/founder-guidance/handoff-education-panel"
import { TeachMeThisPanel } from "@/components/founder-guidance/teach-me-this-panel"

function fmt(val: string) {
  return val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

const LEVERAGE_LABEL: Record<string, string> = {
  keep: "Keep — do it yourself",
  delegate: "Delegate — hand it to your team",
  automate: "Automate — build the system",
  eliminate: "Eliminate — stop doing this",
}

const CONFIDENCE_LABEL: Record<string, string> = {
  high: "Strong",
  medium: "Good",
  low: "Building context…",
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]/80 mb-0.5">{label}</p>
      <p className="font-sans text-sm font-semibold text-[#2E1F27] leading-snug">{value}</p>
    </div>
  )
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

  // Build Strategy™ / Build Blueprint™ (Phase 9F) — the founder's chosen
  // Build Path™ for the current Next Best Move™, and the resulting
  // blueprint. Read/written via localStorage only, keyed by the
  // recommendation's id so it resets naturally as the recommendation changes.
  const recommendationId = nextBestMove?.readinessCapabilityId ?? nextBestMove?.id ?? null
  const [buildPath, setBuildPath] = useState<BuildPathId | null>(null)
  // Phase 11 — the current Build Record™, kept in sync so the UI can show
  // the founder's saved `pathSelectionReason` without re-deriving it.
  const [buildRecord, setBuildRecordState] = useState<BuildRecord | null>(null)

  // Phase 12 — Founder Understanding Level™. A thin alias of the existing
  // Business Comprehension™ preference (same sessionStorage key/event) so it
  // stays in sync everywhere else that preference is shown or changed.
  const [understandingLevel, setUnderstandingLevelState] = useState<ReturnType<typeof getUnderstandingLevel>>("founder")

  useEffect(() => {
    if (!recommendationId) {
      setBuildPath(null)
      setBuildRecordState(null)
      return
    }
    const saved = getBuildStrategy(recommendationId)
    setBuildPath(saved?.buildPath ?? null)
    setBuildRecordState(getBuildRecord(recommendationId))
  }, [recommendationId])

  useEffect(() => {
    setUnderstandingLevelState(getUnderstandingLevel())
    function onChange() {
      setUnderstandingLevelState(getUnderstandingLevel())
    }
    window.addEventListener(UNDERSTANDING_LEVEL_EVENT, onChange)
    return () => window.removeEventListener(UNDERSTANDING_LEVEL_EVENT, onChange)
  }, [])

  const buildBlueprint =
    nextBestMove && recommendationId && buildPath && snapshot
      ? deriveBuildBlueprint(nextBestMove, buildPath, { businessModelProfile: snapshot.businessModelProfile, founderDestination })
      : null

  // Phase 11 — Build Path Selection™ + Second Opinion™. Both explain the
  // existing Founder GPS™/EDE recommendation; neither is a new engine, and
  // neither blocks the founder from choosing a different path.
  const recommendedPath = nextBestMove ? deriveRecommendedBuildPath(nextBestMove) : null
  const secondOpinion = nextBestMove && recommendedPath ? deriveSecondOpinion(nextBestMove, recommendedPath, buildPath, buildBlueprint) : null

  // Phase 12 — Founder Business-Building Guidance™. A pure explanation layer
  // over the Phase 5–11 recommendation/blueprint — no new scoring, no new
  // recommendation logic. The founder's chosen Understanding Level™ controls
  // how much of the (always-fully-derived) guide is shown.
  const readinessCapability = nextBestMove?.readinessCapabilityId ? getReadinessCapability(nextBestMove.readinessCapabilityId) : undefined
  const decisionSnapshot =
    nextBestMove && recommendedPath ? deriveDecisionSnapshot(nextBestMove, recommendedPath, buildPath, buildBlueprint, secondOpinion) : null
  const fullGuide =
    nextBestMove && recommendedPath && buildBlueprint
      ? deriveBusinessBuildingGuide({ recommendation: nextBestMove, blueprint: buildBlueprint, capability: readinessCapability })
      : null
  const guide = fullGuide ? filterSectionsForLevel(fullGuide, understandingLevel) : null
  const buildPathEducation = buildBlueprint ? deriveBuildPathEducation(buildBlueprint) : null
  const coBuildDivision = buildBlueprint ? deriveCoBuildDivision(buildBlueprint) : null
  const aiBuildBoundaries = buildBlueprint ? deriveAiBuildBoundaries(buildBlueprint) : null
  const ownershipGuidance = buildBlueprint ? deriveFounderOwnershipGuidance(buildBlueprint, readinessCapability) : null
  const handoffEducation = buildBlueprint ? deriveHandoffEducation(buildBlueprint) : null
  const example = buildBlueprint ? showMeAnExample(buildBlueprint) : null
  const deeper =
    nextBestMove && buildBlueprint ? goDeeper(nextBestMove, buildBlueprint, snapshot?.businessOperatingFingerprint) : null
  const teachMeThisConcepts = teachMeThis(readinessCapability, understandingLevel)
  // Forces `TeachMeThisPanel` open (and scrolls to it) when the founder clicks
  // "Teach Me This" from the Decision Snapshot™ — the panel manages its own
  // open/close state afterward, so a key bump is the simplest re-mount trigger.
  const [teachMeThisSignal, setTeachMeThisSignal] = useState(0)
  const teachMeThisRef = useRef<HTMLDivElement | null>(null)
  const secondOpinionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (teachMeThisSignal > 0) teachMeThisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [teachMeThisSignal])

  function handleSelectBuildPath(id: BuildPathId) {
    if (!nextBestMove || !recommendationId || !snapshot) return
    const blueprint = deriveBuildBlueprint(nextBestMove, id, {
      businessModelProfile: snapshot.businessModelProfile,
      founderDestination,
    })
    saveBuildStrategy(recommendationId, id, blueprint)
    setBuildPath(id)

    // Phase 10 — the moment a Build Path™ is chosen, a Build Record™ is
    // created (or re-derived, preserving its existing id) so the founder can
    // act once here and then track execution from Build Command Center™.
    // Phase 11 — the recommended path/reason are carried through so the
    // record can show recommended-vs-selected without re-deriving it later.
    const existing = getBuildRecord(recommendationId)
    const record = deriveBuildRecord(
      blueprint,
      {
        prerequisiteCapabilityIds: nextBestMove.prerequisites?.map((p) => p.id),
        recommendedBuildPath: recommendedPath?.buildPath ?? null,
        recommendedBuildPathReason: recommendedPath?.reason ?? null,
      },
      existing?.id,
    )
    saveBuildRecord(record)
    setBuildRecordState(record)
    void upsertBuildRecordToDb(record)
  }

  function handleChooseDifferentPath() {
    if (!recommendationId) return
    clearBuildStrategy(recommendationId)
    setBuildPath(null)
    setBuildRecordState(null)
  }

  // Phase 11 — optional, founder-entered explanation when the chosen path
  // differs from the recommendation. Never required, never invented.
  function handleSavePathSelectionReason(reason: string) {
    if (!recommendationId) return
    const existing = getBuildRecord(recommendationId)
    if (!existing) return
    const updated = appendActivityLogEntry(
      { ...existing, pathSelectionReason: reason },
      "path-change",
      `Reason for choosing "${existing.buildPath}" over the recommended "${existing.recommendedBuildPath}": ${reason}`,
    )
    saveBuildRecord(updated)
    setBuildRecordState(updated)
    void upsertBuildRecordToDb(updated)
  }

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

  return (
    <div className="rounded-3xl border border-[#C13B6B]/25 bg-[#FBF1F5] px-6 py-6 sm:px-7 sm:py-7 space-y-5">
      <div className="flex items-center gap-2">
        <Navigation className="h-4 w-4 text-[#C13B6B]" aria-hidden />
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
          Founder GPS™ — Your Next Best Move™
        </p>
      </div>

      {/* Phase 12 — Founder Business-Building Guidance™: a pure explanation
          layer over this same recommendation. Nothing below changes what's
          recommended, only how it's explained. */}
      <UnderstandingLevelPicker />

      {decisionSnapshot && (
        <DecisionSnapshotCard
          snapshot={decisionSnapshot}
          onTeachMeThis={teachMeThisConcepts.length > 0 ? () => setTeachMeThisSignal((n) => n + 1) : undefined}
          onSecondOpinion={
            secondOpinion ? () => secondOpinionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) : undefined
          }
        />
      )}

      {teachMeThisConcepts.length > 0 && (
        <div ref={teachMeThisRef}>
          <TeachMeThisPanel key={teachMeThisSignal} concepts={teachMeThisConcepts} defaultOpen={teachMeThisSignal > 0} />
        </div>
      )}

      <div>
        <p className="font-display text-lg font-semibold text-[#2E1F27] text-pretty">{nextBestMove.nextTurn}</p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">{nextBestMove.reason}</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {nextBestMove.destinationAlignment && (
          <DataChip label="Advances Your Destination™" value={nextBestMove.destinationAlignment} />
        )}
        {nextBestMove.executiveDomain && <DataChip label="Executive Domain™" value={nextBestMove.executiveDomain} />}
        {nextBestMove.leverageMode && (
          <DataChip label="Leverage Class™" value={LEVERAGE_LABEL[nextBestMove.leverageMode] ?? fmt(nextBestMove.leverageMode)} />
        )}
        {nextBestMove.confidence && (
          <DataChip label="Confidence" value={CONFIDENCE_LABEL[nextBestMove.confidence] ?? fmt(nextBestMove.confidence)} />
        )}
      </div>

      {Array.isArray(nextBestMove.sequencing) && nextBestMove.sequencing.length > 0 && (
        <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/80 mb-3">
            How To Install This
          </p>
          <ol className="space-y-1.5">
            {nextBestMove.sequencing.map((step, i) => (
              <li key={i} className="flex gap-2 font-sans text-sm text-[#2E1F27]">
                <span className="font-semibold text-[#6B5860] shrink-0">{i + 1}.</span>
                <span className="text-pretty">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Link
        href={nextBestMove.cta.href}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#C13B6B] px-5 py-2.5 font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity"
      >
        {nextBestMove.cta.label}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>

      {/* Build Strategy™ / Build Blueprint™ (Phase 9F) — begins only when
          the founder explicitly chooses a Build Path™; the recommendation
          above is never modified by this. */}
      {buildBlueprint ? (
        <div className="space-y-3">
          <BuildBlueprintCard
            blueprint={buildBlueprint}
            onChooseDifferentPath={handleChooseDifferentPath}
            recommendedBuildPath={buildRecord?.recommendedBuildPath ?? recommendedPath?.buildPath ?? null}
            recommendedBuildPathReason={buildRecord?.recommendedBuildPathReason ?? recommendedPath?.reason ?? null}
            pathSelectionReason={buildRecord?.pathSelectionReason ?? null}
            onSavePathSelectionReason={handleSavePathSelectionReason}
          />
          {/* Phase 11 — Second Opinion™: explains the existing recommendation
              signals against the founder's actual choice; never a second
              recommendation engine. */}
          {secondOpinion ? (
            <div ref={secondOpinionRef}>
              <SecondOpinionPanel secondOpinion={secondOpinion} />
            </div>
          ) : null}

          {/* Phase 12 — Business-Building Guide™: explains the SAME blueprint
              above at the founder's chosen Understanding Level™, plus Build
              Path™ / Handoff education for the path actually chosen. */}
          {guide && (
            <BusinessBuildingGuidePanel
              guide={guide}
              coBuildDivision={coBuildDivision}
              aiBuildBoundaries={aiBuildBoundaries}
              ownershipGuidance={ownershipGuidance ?? undefined}
              exampleText={example?.text}
              exampleStatus={example?.status}
              goDeeperItems={deeper?.items}
            />
          )}
          {buildPathEducation && <BuildPathEducationPanel education={buildPathEducation} />}
          {handoffEducation && <HandoffEducationPanel education={handoffEducation} />}
          {/* Phase 10 — once a Build Path™ is chosen, the founder acts once
              here, then leaves to track execution in Build Command Center™
              rather than only seeing a static card. */}
          {recommendationId ? (
            <Link
              href={`/build-command-center?id=${encodeURIComponent(recommendationId)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] px-4 py-2 font-sans text-xs font-semibold text-[#6B5860] hover:border-[#C13B6B]/40 hover:text-[#C13B6B] transition-colors"
            >
              View build in Build Command Center™
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      ) : (
        <BuildPathPicker
          selected={buildPath}
          onSelect={handleSelectBuildPath}
          recommendedPath={recommendedPath?.buildPath ?? null}
          recommendedReason={recommendedPath?.reason ?? null}
        />
      )}
    </div>
  )
}
