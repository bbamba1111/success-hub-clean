"use client"

/**
 * My Blueprint™ — the founder's central Work-Life Harmony Blueprint™.
 *
 * A new VIEW over five already-existing member systems — it creates no new
 * data, scoring, or assessment logic. Every score, label, and record here is
 * read directly from the same storage layers the rest of the app already
 * writes to:
 *
 *   1. Weekly Reality Check™        → utils/reality-check-storage.ts (Supabase)
 *   2. Work-Life Balance Audit™     → utils/audit-storage.ts (localStorage)
 *   3. Entrepreneur Success Assessment™ → lib/entrepreneur-success/esa-storage.ts (localStorage)
 *   4. Founder Profile™             → lib/founder-profile/founder-profile-store.ts (localStorage)
 *   5. Business Context™            → lib/business-context/business-context-store.ts (localStorage)
 *
 * Section 07 (Phase 7) is a sixth view, not a sixth data source: it reads the
 * canonical Founder GPS™ / Next Best Move™ (`deriveNextBestMove`, already
 * built in Phases 5–6) through the existing Harmony Context Engine™
 * (`useHarmonyContext()` → `snapshot`), via `<HarmonyProvider>` now wrapping
 * this page. No new recommendation logic is added here.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Compass,
  Heart,
  BarChart2,
  User,
  Briefcase,
  MapPin,
  Navigation,
} from "lucide-react"

import { getAuditResults, type AuditData } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { getBusinessContext, saveBusinessContext } from "@/lib/business-context/business-context-store"
import { getFounderProfile, saveFounderProfile } from "@/lib/founder-profile/founder-profile-store"
import { getBusinessContextFromDb } from "@/utils/business-context-storage"
import { getFounderProfileFromDb } from "@/utils/founder-profile-storage"
import { getFounderDestination } from "@/lib/founder-destination/founder-destination-store"
import { getFounderDestinationFromDb } from "@/utils/founder-destination-storage"
import { getOperatingCenterData, type OperatingCenterData } from "@/utils/reality-check-storage"
import { CADENCES } from "@/lib/assessment-cadence"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
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

// ── Small formatting helpers ─────────────────────────────────────────────────

function fmt(val: string) {
  return val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return null
  }
}

function scoreColor(score: number): string {
  if (score >= 70) return "#5D9D61"
  if (score >= 45) return "#E8A84E"
  return "#E26C73"
}

function scoreBand(score: number): string {
  if (score >= 80) return "Thriving"
  if (score >= 60) return "Building"
  if (score >= 40) return "Establishing"
  if (score >= 20) return "Foundation"
  return "Starting Point"
}

// ── Next Best Move™ label helpers (Section 07) ─────────────────────────────

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

// ── Score ring ────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 96, stroke = 8 }: { score: number; size?: number; stroke?: number }) {
  const color = scoreColor(score)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1E9E3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-sans text-xl font-bold tabular-nums text-brand-ink">{score}</span>
        <span className="font-sans text-[10px] text-brand-ink-soft">/ 100</span>
      </div>
    </div>
  )
}

// ── Delta pill (this week vs. last) ─────────────────────────────────────────

function DeltaPill({ delta }: { delta: number | null }) {
  if (delta === null) return null
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-blush px-2.5 py-1 font-sans text-xs font-semibold text-brand-ink-soft">
        <Minus className="h-3 w-3" aria-hidden />
        Holding steady
      </span>
    )
  }
  const up = delta > 0
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-semibold ${
        up ? "bg-brand-green/10 text-brand-green-dark" : "bg-brand-coral/10 text-brand-coral-dark"
      }`}
    >
      {up ? <ArrowUpRight className="h-3 w-3" aria-hidden /> : <ArrowDownRight className="h-3 w-3" aria-hidden />}
      {up ? "+" : ""}
      {delta} vs. last week
    </span>
  )
}

// ── Cadence badge ("30-Day Baseline" / "7-Day Check-In") ───────────────────

function CadenceBadge({ assessmentType }: { assessmentType?: keyof typeof CADENCES }) {
  const cadence = assessmentType ? CADENCES[assessmentType] : undefined
  if (!cadence) return null
  return (
    <span className="inline-block rounded-full bg-brand-ink/[0.05] px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-ink-soft">
      {cadence.window === "30-day" ? "30-Day Baseline" : "7-Day Check-In"}
    </span>
  )
}

// ── Data chip ────────────────────────────────────────────────────────────

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/60 px-3.5 py-2.5">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-0.5">{label}</p>
      <p className="font-sans text-sm font-semibold text-brand-ink leading-snug">{value}</p>
    </div>
  )
}

function TagPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 font-sans text-xs font-semibold text-brand-green-dark">
      {children}
    </span>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────

function EmptyState({ message, href, cta }: { message: string; href: string; cta: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-blush py-9 px-6 text-center">
      <p className="font-sans text-sm leading-relaxed text-brand-ink-soft max-w-sm text-pretty">{message}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 font-sans text-xs font-bold text-white hover:bg-brand-green-dark transition-colors"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  )
}

// ── Section chrome shared by all five Blueprint sections ───────────────────

function BlueprintSection({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  accent,
  emphasize = false,
  children,
}: {
  eyebrow: string
  icon: React.ElementType
  title: string
  subtitle: string
  accent: string
  emphasize?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-3xl border bg-white overflow-hidden ${
        emphasize ? "border-brand-blush shadow-lg" : "border-brand-blush/70 shadow-sm"
      }`}
    >
      <div className="h-1" style={{ backgroundColor: accent }} aria-hidden />
      <div className={emphasize ? "px-6 py-8 sm:px-9 sm:py-9" : "px-6 py-7"}>
        <div className="flex items-start gap-3.5 mb-6">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accent + "17" }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} aria-hidden />
          </div>
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: accent }}>
              {eyebrow}
            </p>
            <h2 className={`font-display font-semibold text-brand-ink leading-tight ${emphasize ? "text-2xl sm:text-3xl" : "text-xl"}`}>
              {title}
            </h2>
            <p className="font-sans text-sm text-brand-ink-soft mt-1 text-pretty">{subtitle}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Divider between conceptual layers ───────────────────────────────────────

function LayerDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-1" aria-hidden>
      <span className="h-px w-10 bg-brand-blush" />
      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-brand-ink-soft/70">{label}</span>
      <span className="h-px w-10 bg-brand-blush" />
    </div>
  )
}

// ── Main client component ───────────────────────────────────────────────────

export function MyBlueprintClient() {
  // Canonical Founder GPS™ / Next Best Move™ (Phase 7) — read-only, via the
  // Harmony Context Engine™. `snapshot.intelligence.gpsContext` and
  // `founderDestination` are already assembled by <HarmonyProvider>; this
  // calls the same, already-built `deriveNextBestMove()` engine, never a
  // second one.
  const { snapshot, founderDestination } = useHarmonyContext()
  const nextBestMove = snapshot.ready
    ? deriveNextBestMove(buildGpsContextFromSnapshot(snapshot), {
        founderDestination,
        esaResults: snapshot.business.esaResults,
        // Phase 10 — Build Record™ feedback loop: an already-building or
        // installed capability is never re-recommended here either.
        capabilityBuildStatusById: getActiveBuildStatusByCapabilityId(),
      })
    : null

  const [reality, setReality] = useState<OperatingCenterData | null>(null)
  const [lifeData, setLifeData] = useState<AuditData | null>(null)
  const [bizData, setBizData] = useState<EsaResults | null>(null)
  const [founder, setFounder] = useState<Record<string, unknown> | null>(null)
  const [bizContext, setBizContext] = useState<BusinessContextProfile | null>(null)
  const [destination, setDestination] = useState<FounderDestinationProfile | null>(null)
  const [ready, setReady] = useState(false)

  // Build Strategy™ / Build Blueprint™ (Phase 9F) — the founder's chosen
  // Build Path™ for the current Next Best Move™, and the resulting
  // blueprint. Read/written via localStorage only this phase, keyed by the
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
    nextBestMove && recommendationId && buildPath
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
    nextBestMove && buildBlueprint ? goDeeper(nextBestMove, buildBlueprint, snapshot.businessOperatingFingerprint) : null
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
    if (!nextBestMove || !recommendationId) return
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setLifeData(getAuditResults())
    setBizData(getEsaResults())
    // Instant paint from the local cache, then reconcile with the database —
    // the account's canonical Founder Profile™ / Business Context Profile™ /
    // Founder Destination™ — once each resolves.
    setFounder(getFounderProfile())
    setBizContext(getBusinessContext())
    setDestination(getFounderDestination())
    getFounderProfileFromDb().then((record) => {
      if (!record) return
      const { completedAt: _completedAt, updatedAt: _updatedAt, ...profile } = record
      setFounder(profile)
      saveFounderProfile(profile as unknown as Record<string, unknown>)
    })
    getBusinessContextFromDb().then((record) => {
      if (!record) return
      const { updatedAt: _updatedAt, ...profile } = record
      setBizContext(profile)
      saveBusinessContext(profile)
    })
    getFounderDestinationFromDb().then((record) => {
      if (!record) return
      const { completedAt: _completedAt, ...profile } = record
      setDestination(profile)
    })
    getOperatingCenterData()
      .then(setReality)
      .finally(() => setReady(true))
  }, [])

  // Which of the four Founder Destination™ layers have been started —
  // mirrors the section-completion logic in the destination form itself.
  const destinationLayers = destination
    ? [
        {
          label: "Business",
          started: Boolean(
            destination.desiredBusinessSize ||
              destination.desiredTeamSize ||
              destination.desiredGeographicReach ||
              destination.desiredMarketPosition ||
              destination.revenueAmbition,
          ),
        },
        {
          label: "Founder",
          started: Boolean(
            destination.desiredFounderRole ||
              destination.remainResponsibleFor?.length ||
              destination.notResponsibleFor?.length ||
              destination.desiredWorkingHoursPerWeek ||
              destination.desiredFounderInvolvement ||
              destination.desiredZoneOfGenius ||
              destination.desiredFounderIndependence,
          ),
        },
        {
          label: "Life",
          started: Boolean(
            destination.desiredWorkLifeBalanceModel ||
              destination.desiredTimeFreedomLevel ||
              destination.desiredLifestyle ||
              destination.nonNegotiableLifeBoundaries?.length ||
              destination.businessLifePurpose,
          ),
        },
        {
          label: "Future Workplace",
          started: Boolean(
            destination.desiredWorkplaceType ||
              destination.desiredEmployeeExperience ||
              destination.desiredWorkDesign ||
              destination.desiredAiHumanRelationship ||
              destination.desiredLeadershipCulture ||
              destination.desiredHumanSustainabilityStandard,
          ),
        },
      ]
    : []
  const destinationCompletedCount = destinationLayers.filter((l) => l.started).length

  const founderName = (founder?.fullName as string) || (founder?.preferredName as string) || null
  const founderTitle = (founder?.customTitle as string) || (founder?.professionalTitle as string) || null
  const founderLocation = [founder?.city, founder?.stateProvince].filter(Boolean).join(", ")
  const founderHobbies = founder?.hobbies as string | undefined
  const founderChildren = Array.isArray(founder?.children) ? (founder!.children as unknown[]).length : 0
  const founderPets = Array.isArray(founder?.pets) ? (founder!.pets as unknown[]).length : 0

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <header className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/my-blueprint-hero-bg.png)" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-white/78" aria-hidden />
        <div className="relative mx-auto w-full max-w-3xl px-6 py-16 sm:py-20 text-center">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brand-coral-dark mb-4">
            Harmony Lane™
          </p>
          <h1 className="font-display text-4xl font-semibold text-brand-ink sm:text-5xl text-balance">
            My Blueprint™
          </h1>
          <p className="mt-2 font-serif italic text-xl text-brand-ink-soft sm:text-2xl text-balance">
            Your Work-Life Harmony Blueprint™
          </p>
          <p className="mt-6 font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty max-w-xl mx-auto">
            Your Life. Your Business. Your Founder Context. Your Current Reality.
          </p>
        </div>
      </header>

      {/* ── Blueprint body ───────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-14 space-y-6">

        {/* 01 — CURRENT REALITY ────────────────────────────────────────── */}
        <BlueprintSection
          eyebrow="01 — Current Reality"
          icon={Compass}
          title="Weekly Reality Check™"
          subtitle="How You're Operating Right Now"
          accent="#E8A84E"
          emphasize
        >
          {ready && reality?.current ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-5">
                  <ScoreRing score={reality.current.overall_score ?? 0} size={110} stroke={9} />
                  <div>
                    <p className="font-display text-lg font-semibold text-brand-ink">
                      {scoreBand(reality.current.overall_score ?? 0)}
                    </p>
                    <p className="font-sans text-xs text-brand-ink-soft mt-0.5">
                      {reality.currentIsThisWeek ? "This week" : "Most recent"} ·{" "}
                      {formatDate(reality.current.scored_at ?? reality.current.completed_at) ?? "recently"}
                    </p>
                    <div className="mt-2">
                      <DeltaPill delta={reality.scoreDelta} />
                    </div>
                  </div>
                </div>
                <Link
                  href="/reality-check"
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#E8A84E]/30 bg-[#E8A84E]/10 px-4 py-2 font-sans text-xs font-bold text-[#B9822F] hover:bg-[#E8A84E]/20 transition-colors"
                >
                  View Full Reality Check™
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
              {Array.isArray(reality.current.life_value_scores) && reality.current.life_value_scores.length > 0 && (
                <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-5 py-4">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-3">
                    Latest Signals
                  </p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {reality.current.life_value_scores.slice(0, 4).map((r) => (
                      <li key={r.category} className="flex items-center justify-between font-sans text-sm text-brand-ink">
                        <span>{r.label ?? fmt(r.category)}</span>
                        <span className="font-semibold text-brand-ink-soft">{r.percentage} / 100</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              message="Your current reality will appear here after you complete your Weekly Reality Check™."
              href="/audit"
              cta="Take the Audit™"
            />
          )}
        </BlueprintSection>

        <LayerDivider label="Life + Business" />

        {/* 02 + 03 — LIFE & BUSINESS ─────────────────────────���─────────── */}
        <div className="grid gap-6 sm:grid-cols-2">
          <BlueprintSection
            eyebrow="02 — Life"
            icon={Heart}
            title="Work-Life Balance Audit™"
            subtitle="Your Life"
            accent="#E26C73"
          >
            {ready && lifeData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ScoreRing score={lifeData.overallScore} />
                  <div>
                    <p className="font-sans text-sm font-semibold text-brand-ink">{scoreBand(lifeData.overallScore)}</p>
                    <div className="mt-1.5">
                      <CadenceBadge assessmentType={lifeData.assessmentType} />
                    </div>
                  </div>
                </div>
                {Array.isArray(lifeData.results) && lifeData.results.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {lifeData.results.slice(0, 4).map((r) => (
                      <div key={r.category} className="flex items-center justify-between font-sans text-sm text-brand-ink">
                        <span className="text-brand-ink-soft">{fmt(r.category)}</span>
                        <span className="font-semibold">{r.percentage} / 100</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href="/audit"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#C9545B] hover:underline"
                >
                  Open Your Audit™
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ) : (
              <EmptyState
                message="Your Life Blueprint will appear here after you complete your Work-Life Balance Audit™."
                href="/audit"
                cta="Take the Audit™"
              />
            )}
          </BlueprintSection>

          <BlueprintSection
            eyebrow="03 — Business"
            icon={BarChart2}
            title="Entrepreneur Success Assessment™ (ESA)"
            subtitle="Your Business"
            accent="#5D9D61"
          >
            {ready && bizData ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <ScoreRing score={bizData.overallScore} />
                  <div>
                    <p className="font-sans text-sm font-semibold text-brand-ink">{scoreBand(bizData.overallScore)}</p>
                  </div>
                </div>
                {Array.isArray(bizData.pillarScores) && bizData.pillarScores.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {bizData.pillarScores.slice(0, 4).map((p) => (
                      <div key={p.pillarId} className="flex items-center justify-between font-sans text-sm text-brand-ink">
                        <span className="text-brand-ink-soft">{p.pillarName}</span>
                        <span className="font-semibold">{p.percentage} / 100</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href="/entrepreneur-success-assessment"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-green-dark hover:underline"
                >
                  Open Your ESA™
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ) : (
              <EmptyState
                message="Your Business Blueprint will appear here after you complete your Entrepreneur Success Assessment™."
                href="/entrepreneur-success-assessment"
                cta="Take Assessment™"
              />
            )}
          </BlueprintSection>
        </div>

        <LayerDivider label="Founder + Business Context" />

        {/* 04 + 05 — FOUNDER & BUSINESS CONTEXT ────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2">
          <BlueprintSection
            eyebrow="04 — Founder"
            icon={User}
            title="Founder Profile™"
            subtitle="Who Is Building It"
            accent="#E26C73"
          >
            {ready && founder && founderName ? (
              <div className="space-y-4">
                <div>
                  <p className="font-display text-lg font-semibold text-brand-ink">{founderName}</p>
                  {founderTitle && <p className="font-sans text-sm text-brand-ink-soft">{fmt(founderTitle)}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {founderLocation && <DataChip label="Location" value={founderLocation} />}
                  {founderHobbies && <DataChip label="Hobbies & Interests" value={founderHobbies} />}
                  {founderChildren > 0 && <DataChip label="Family" value={`${founderChildren} child${founderChildren > 1 ? "ren" : ""}`} />}
                  {founderPets > 0 && <DataChip label="Pets" value={`${founderPets} pet${founderPets > 1 ? "s" : ""}`} />}
                </div>
                <Link
                  href="/founder-profile"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#C9545B] hover:underline"
                >
                  Update Founder Profile™
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ) : (
              <EmptyState
                message="Complete your Founder Profile™ to personalize your Harmony Lane™ experience."
                href="/founder-profile"
                cta="Complete Founder Profile™"
              />
            )}
          </BlueprintSection>

          <BlueprintSection
            eyebrow="05 — Business Context"
            icon={Briefcase}
            title="Business Context™"
            subtitle="What You're Building"
            accent="#E8A84E"
          >
            {ready && bizContext ? (
              <div className="space-y-4">
                <p className="font-display text-lg font-semibold text-brand-ink">{bizContext.businessName}</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <DataChip label="Business Stage™" value={fmt(bizContext.businessStage)} />
                  <DataChip label="Founder Role™" value={fmt(bizContext.founderRole)} />
                  <DataChip label="Revenue Stage™" value={fmt(bizContext.revenueStage)} />
                  <DataChip label="Team Size™" value={fmt(bizContext.teamSize)} />
                </div>
                {bizContext.biggestGoals?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bizContext.biggestGoals.slice(0, 4).map((g) => (
                      <TagPill key={g}>{fmt(g)}</TagPill>
                    ))}
                  </div>
                )}
                <Link
                  href="/business-context"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#B9822F] hover:underline"
                >
                  Update Business Context™
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            ) : (
              <EmptyState
                message="Tell us about the business you're building to complete your Blueprint."
                href="/business-context"
                cta="Build Business Context™"
              />
            )}
          </BlueprintSection>
        </div>

        <LayerDivider label="Where I'm Going" />

        {/* 06 — FOUNDER DESTINATION ────────────────���────────────────────── */}
        <BlueprintSection
          eyebrow="06 — Destination"
          icon={MapPin}
          title="Founder Destination™"
          subtitle="Where You're Intentionally Going"
          accent="#5D9D61"
          emphasize
        >
          {ready && destinationCompletedCount > 0 ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {destinationLayers.map((layer) => (
                    <span
                      key={layer.label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-semibold ${
                        layer.started
                          ? "bg-brand-green/10 text-brand-green-dark"
                          : "bg-brand-ink/[0.05] text-brand-ink-soft/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${layer.started ? "bg-brand-green" : "border border-brand-ink/30"}`}
                        aria-hidden
                      />
                      {layer.label}
                    </span>
                  ))}
                </div>
                <p className="font-sans text-sm font-semibold text-brand-ink-soft shrink-0">
                  {destinationCompletedCount} of {destinationLayers.length} complete
                </p>
              </div>
              <Link
                href="/founder-destination"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-green-dark hover:underline"
              >
                {destinationCompletedCount === destinationLayers.length
                  ? "Update Your Founder Destination™"
                  : "Continue Your Founder Destination™"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ) : (
            <EmptyState
              message="Founder Profile™ is who you are. Business Context™ is what you're building now. Founder Destination™ is where you're intentionally going — set it to help Cherry Blossom™ guide what matters next."
              href="/founder-destination"
              cta="Set Your Founder Destination™"
            />
          )}
        </BlueprintSection>

        <LayerDivider label="What Should I Build Next" />

        {/* 07 — FOUNDER GPS™ NEXT BEST MOVE™ ─────────────────────────────── */}
        <BlueprintSection
          eyebrow="07 — Founder GPS™"
          icon={Navigation}
          title="Your Next Best Move™"
          subtitle="The Single Highest-Leverage Next Step, Right Now"
          accent="#C13B6B"
          emphasize
        >
          {nextBestMove ? (
            <div className="space-y-5">
              {/* Phase 12 — Founder Business-Building Guidance™: a pure
                  explanation layer over this same recommendation. Nothing
                  below changes what's recommended, only how it's explained. */}
              <UnderstandingLevelPicker />

              {decisionSnapshot && (
                <DecisionSnapshotCard
                  snapshot={decisionSnapshot}
                  onTeachMeThis={teachMeThisConcepts.length > 0 ? () => setTeachMeThisSignal((n) => n + 1) : undefined}
                  onSecondOpinion={
                    secondOpinion
                      ? () => secondOpinionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                      : undefined
                  }
                />
              )}

              {teachMeThisConcepts.length > 0 && (
                <div ref={teachMeThisRef}>
                  <TeachMeThisPanel key={teachMeThisSignal} concepts={teachMeThisConcepts} defaultOpen={teachMeThisSignal > 0} />
                </div>
              )}

              <div>
                <p className="font-display text-lg font-semibold text-brand-ink text-pretty">
                  {nextBestMove.nextTurn}
                </p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
                  {nextBestMove.reason}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {nextBestMove.destinationAlignment && (
                  <DataChip label="Advances Your Destination™" value={nextBestMove.destinationAlignment} />
                )}
                {nextBestMove.executiveDomain && (
                  <DataChip label="Executive Domain™" value={nextBestMove.executiveDomain} />
                )}
                {nextBestMove.leverageMode && (
                  <DataChip
                    label="Leverage Class™"
                    value={LEVERAGE_LABEL[nextBestMove.leverageMode] ?? fmt(nextBestMove.leverageMode)}
                  />
                )}
                {nextBestMove.confidence && (
                  <DataChip
                    label="Confidence"
                    value={CONFIDENCE_LABEL[nextBestMove.confidence] ?? fmt(nextBestMove.confidence)}
                  />
                )}
              </div>

              {Array.isArray(nextBestMove.sequencing) && nextBestMove.sequencing.length > 0 && (
                <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-5 py-4">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-3">
                    How To Install This
                  </p>
                  <ol className="space-y-1.5">
                    {nextBestMove.sequencing.map((step, i) => (
                      <li key={i} className="flex gap-2 font-sans text-sm text-brand-ink">
                        <span className="font-semibold text-brand-ink-soft shrink-0">{i + 1}.</span>
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

              {/* Build Strategy™ / Build Blueprint™ (Phase 9F) — begins only
                  when the founder explicitly chooses a Build Path™; the
                  recommendation above is never modified by this. */}
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
                  {/* Phase 11 — Second Opinion™: explains the existing
                      recommendation signals against the founder's actual
                      choice; never a second recommendation engine. */}
                  {secondOpinion ? (
                    <div ref={secondOpinionRef}>
                      <SecondOpinionPanel secondOpinion={secondOpinion} />
                    </div>
                  ) : null}

                  {/* Phase 12 — Business-Building Guide™: explains the SAME
                      blueprint above at the founder's chosen Understanding
                      Level™, plus Build Path™ / Handoff education for the
                      path actually chosen. */}
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
                  {/* Phase 10 — once a Build Path™ is chosen, the founder acts
                      once here, then leaves to track execution in Build
                      Command Center™ rather than only seeing a static card. */}
                  {recommendationId ? (
                    <Link
                      href={`/build-command-center?id=${encodeURIComponent(recommendationId)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush/70 px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:border-[#C13B6B]/40 hover:text-[#C13B6B] transition-colors"
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
          ) : (
            <EmptyState
              message="Your Founder GPS™ Next Best Move™ will appear here once your Blueprint has enough signal to reason over — complete a few of the sections above to activate it."
              href="/founder-destination"
              cta="Set Your Founder Destination™"
            />
          )}
        </BlueprintSection>
      </section>
    </div>
  )
}
