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
  BoundaryWorkflowTracker,
  CollisionHistoryWithLinks,
  MonthlyFocusSummary,
  MonthlyReviewAndHistory,
} from "@/components/my-blueprint/boundary-workflow"
import {
  ArrowRight,
  Heart,
  BarChart2,
  User,
  Briefcase,
  Hammer,
  ShieldCheck,
} from "lucide-react"

import { getEsaResults, getEsaHistory, type EsaHistoryEntry } from "@/lib/entrepreneur-success/esa-storage"
import { getBusinessContext, saveBusinessContext } from "@/lib/business-context/business-context-store"
import { getFounderProfile, saveFounderProfile } from "@/lib/founder-profile/founder-profile-store"
import { getBusinessContextFromDb } from "@/utils/business-context-storage"
import { getFounderProfileFromDb } from "@/utils/founder-profile-storage"
import { getFounderDestination } from "@/lib/founder-destination/founder-destination-store"
import { getFounderDestinationFromDb } from "@/utils/founder-destination-storage"

import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { BusinessContextProfile } from "@/lib/business-context/types"
import type { FounderDestinationProfile } from "@/lib/founder-destination/types"
import { InPlaceResultsReview } from "@/components/my-blueprint/in-place-results-review"
import { WeeklyAuditHistory } from "@/components/my-blueprint/weekly-audit-history"
import {
  getAllCompletedBusinessAssetBuilds,
  type BusinessAssetBuildRecord,
} from "@/utils/business-asset-build-storage"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"

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

export function MyBlueprintClient({
  boundaryReport,
  weeklyAuditHistory,
}: {
  boundaryReport?: React.ReactNode
  weeklyAuditHistory?: React.ReactNode
}) {

  const [bizData, setBizData] = useState<EsaResults | null>(null)
  const [esaHistory, setEsaHistory] = useState<EsaHistoryEntry[]>([])
  const [founder, setFounder] = useState<Record<string, unknown> | null>(null)
  const [bizContext, setBizContext] = useState<BusinessContextProfile | null>(null)
  const [destination, setDestination] = useState<FounderDestinationProfile | null>(null)
  const [completedBuilds, setCompletedBuilds] = useState<BusinessAssetBuildRecord[]>([])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setBizData(getEsaResults())
    setEsaHistory(getEsaHistory())
    // My Blueprint History™ — every real, saved Business Asset™ build the
    // founder has completed, across every asset and build mode. Read-only
    // view over the existing business_asset_builds table; no new data.
    getAllCompletedBusinessAssetBuilds()
      .then(setCompletedBuilds)
      .catch(() => setCompletedBuilds([]))
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
      {/* ── Hero header ─────���────────────────────────────────────────────── */}
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
            My Work-Life Harmony Blueprint™
          </h1>
          <p className="mt-2 font-serif italic text-xl text-brand-ink-soft sm:text-2xl text-balance">
            Your assessments, Business Week experience, and completed business assets — together in one place.
          </p>
          <p className="mt-6 font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty max-w-xl mx-auto">
            Your starting point. Your weekly check-ins. Your business-building record.
          </p>
        </div>
      </header>

      {/* ── Blueprint body ───────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-14 space-y-6">

        {/* 01 — One-time Reality Check and its Boundary Report */}
        <div id="boundary-report" className="scroll-mt-24">
          <BlueprintSection
            eyebrow="01 — One-Time Reality Check"
            icon={ShieldCheck}
            title="My Boundary Report™"
            subtitle="Your original 30-day baseline, selected Priority Focus Areas™, Alignment™ responses, and personalized findings"
            accent="#7FA37F"
            emphasize
          >
            {boundaryReport}
          </BlueprintSection>
        </div>

        {/* 02 — Optional weekly Work-Life Balance Audit */}
        <BlueprintSection
          eyebrow="02 — Optional Weekly Check-In"
          icon={Heart}
          title="Work-Life Balance Audit™"
          subtitle="Your one-time 30-day baseline stays in My Boundary Report™. The 7-day audit is optional and can be completed when you choose to review the past week."
          accent="#E26C73"
        >
          <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
            Your 30-day starting point is preserved in My Boundary Report™. This is a separate, optional check-in
            for the previous seven days; it does not replace or restart your one-time Reality Check™.
          </p>

          <Link
            href="/audit"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#C9545B]/30 bg-[#C9545B]/5 px-4 py-2.5 font-sans text-xs font-semibold text-[#C9545B] hover:bg-[#C9545B]/10"
          >
            Take the Optional 7-Day Audit™
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>

          <WeeklyAuditHistory />
          {weeklyAuditHistory && (
            <div className="mt-5 border-t border-brand-blush/60 pt-4">
              {weeklyAuditHistory}
            </div>
          )}
        </BlueprintSection>

        {/* 03 — Entrepreneur Success Assessment */}
        <BlueprintSection
          eyebrow="03 — Business Assessment"
          icon={BarChart2}
          title="Entrepreneur Success Assessment™"
          subtitle="Your business operating score and assessment history"
          accent="#5D9D61"
        >
          {bizData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ScoreRing score={bizData.overallScore} />
                <div>
                  <p className="font-sans text-sm font-semibold text-brand-ink">{scoreBand(bizData.overallScore)}</p>
                  <p className="font-sans text-xs text-brand-ink-soft">
                    Latest saved assessment · {formatDate(bizData.completedAt) ?? "date not recorded"}
                  </p>
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
                  <InPlaceResultsReview
                    rows={bizData.pillarScores.map((p) => ({ key: p.pillarId, label: p.pillarName, percentage: p.percentage }))}
                    accent="#5D9D61"
                  />
                </div>
              )}
              {esaHistory.length > 0 && (
                <details className="rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-4 py-3">
                  <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">
                    View weekly ESA history ({esaHistory.length})
                  </summary>
                  <ul className="mt-3 flex flex-col gap-2">
                    {esaHistory.map((entry) => (
                      <li key={entry.weekKey} className="flex items-center justify-between gap-3 border-t border-brand-blush/60 pt-2">
                        <span className="font-sans text-sm text-brand-ink-soft">Week of {entry.weekKey}</span>
                        <span className="font-sans text-sm font-semibold tabular-nums text-brand-ink">{entry.overallScore} / 100</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ) : (
            <EmptyState
              message="Your Entrepreneur Success Assessment™ results will appear here when you complete the assessment."
              href="/entrepreneur-success-assessment"
              cta="Open ESA™"
            />
          )}
          <Link
            href="/entrepreneur-success-assessment"
            className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-green-dark hover:underline"
          >
            Open Entrepreneur Success Assessment™
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </BlueprintSection>

        {/* 04 — Founder Profile, with destination nested as a supporting view */}
        <BlueprintSection
          eyebrow="04 — Founder Profile"
          icon={User}
          title="Founder Profile™"
          subtitle="Who you are, the life and responsibilities your business must support, and where you intend to go"
          accent="#E26C73"
        >
          {founder && founderName ? (
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

          <div className="mt-5 rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-ink-soft">Founder Destination™</p>
                <p className="mt-1 font-sans text-sm text-brand-ink">
                  {destinationCompletedCount > 0
                    ? `${destinationCompletedCount} of ${destinationLayers.length} direction areas started`
                    : "Where you're intentionally taking your business, role, life, and future workplace."}
                </p>
              </div>
              <Link
                href="/founder-destination"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-green-dark hover:underline"
              >
                {destinationCompletedCount === destinationLayers.length && destinationCompletedCount > 0
                  ? "Update Destination™"
                  : destinationCompletedCount > 0
                    ? "Continue Destination™"
                    : "Set Destination™"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
            {destinationLayers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {destinationLayers.map((layer) => (
                  <span
                    key={layer.label}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-semibold ${
                      layer.started ? "bg-brand-green/10 text-brand-green-dark" : "bg-brand-ink/[0.05] text-brand-ink-soft/60"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${layer.started ? "bg-brand-green" : "border border-brand-ink/30"}`} aria-hidden />
                    {layer.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </BlueprintSection>

        {/* 05 — Business Context */}
        <BlueprintSection
          eyebrow="05 — Business Context"
          icon={Briefcase}
          title="Business Context™"
          subtitle="The business you're building and the direction you want it to take"
          accent="#E8A84E"
        >
          {bizContext ? (
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
            </div>
          ) : (
            <EmptyState
              message="Tell us about the business you're building to complete your Blueprint."
              href="/business-context?from=/my-blueprint"
              cta="Build Business Context™"
            />
          )}
          {bizContext && (
            <Link
              href="/business-context?from=/my-blueprint"
              className="mt-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#B9822F] hover:underline"
            >
              Update Business Context™
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </BlueprintSection>

        <LayerDivider label="My Work-Life Balance Business Week™ Experience" />

        {/* The boundary workflow is one active Business Week experience, not four separate Blueprint chapters. */}
        <BlueprintSection
          eyebrow="Business Week Experience"
          icon={ShieldCheck}
          title="My Boundary & Business Week Experience"
          subtitle="Your current monthly boundary, recorded collisions, implementation milestones, and review history"
          accent="#5B835F"
        >
          <div className="flex flex-col gap-3">
            <details open className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
              <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">30-Day Boundary Workflow</summary>
              <div className="pt-4"><BoundaryWorkflowTracker /></div>
            </details>
            <details className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
              <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">My Monthly Boundary Focus™</summary>
              <div className="pt-4"><MonthlyFocusSummary /></div>
            </details>
            <details className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
              <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">My Collision History</summary>
              <div className="pt-4"><CollisionHistoryWithLinks /></div>
            </details>
            <details className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-4 py-3">
              <summary className="cursor-pointer font-sans text-sm font-semibold text-brand-ink">Monthly Boundary Review & History</summary>
              <div className="pt-4"><MonthlyReviewAndHistory /></div>
            </details>
          </div>
        </BlueprintSection>

        <LayerDivider label="Completed Business Assets" />

        {/* My Blueprint History™ — preserve the founder's completed outputs. */}
        <BlueprintSection
          eyebrow="My Blueprint History™"
          icon={Hammer}
          title="Completed Business Assets™"
          subtitle="The business assets you've actually finished building"
          accent="#5A7A45"
        >
          {completedBuilds.length > 0 ? (
            <div className="space-y-2.5">
              {completedBuilds.map((build) => {
                const asset = getBusinessAsset(build.businessAssetId)
                return (
                  <Link
                    key={build.id}
                    href={`/business-asset-library/${build.businessAssetId}${build.instanceKey ? `?instance=${build.instanceKey}` : ""}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-brand-blush/60 bg-brand-cream/60 px-4 py-3 hover:border-brand-green/40 hover:bg-brand-green/5 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-semibold text-brand-ink truncate">
                        {asset?.name ?? "Business Asset™"}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">
                        {asset?.category ? `${asset.category} · ` : ""}
                        Completed {formatDate(build.updatedAt) ?? "recently"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.08em] ${
                        build.reviewStatus === "approved"
                          ? "bg-brand-green/15 text-brand-green-dark"
                          : build.reviewStatus === "in-review"
                            ? "bg-[#E8A84E]/15 text-[#B9822F]"
                            : "bg-brand-ink/[0.05] text-brand-ink-soft"
                      }`}
                    >
                      {build.reviewStatus === "approved"
                        ? "Approved"
                        : build.reviewStatus === "in-review"
                          ? "In Review"
                          : "Draft"}
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <EmptyState
              message="Every completed Business Asset™ you build will appear here so you can return to it, revise it, and keep using it."
              href="/business-asset-library"
              cta="Browse Business Asset Library™"
            />
          )}
        </BlueprintSection>
      </section>
    </div>
  )
}
