"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronDown,
  User,
  Heart,
  BarChart2,
  Briefcase,
  Compass,
  Search,
} from "lucide-react"
import { getAuditResults } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { getBusinessContext, saveBusinessContext } from "@/lib/business-context/business-context-store"
import { getBusinessContextFromDb } from "@/utils/business-context-storage"
import { scoreLabel } from "@/lib/entrepreneur-success/scoring"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { MonthlyHarmonyCalendar } from "@/components/harmony-blueprint/monthly-harmony-calendar"
import type { AuditData } from "@/utils/audit-storage"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import type { BusinessContextProfile } from "@/lib/business-context/types"

/** Any area at or below this score becomes a "Focus This Week™" candidate. */
const FOCUS_THRESHOLD = 60

// ── Score ring ──────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  color,
  label,
  size = 120,
  stroke = 8,
}: {
  score: number
  color: string
  label: string
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-2xl font-bold tabular-nums" style={{ color }}>{score}</span>
          <span className="font-sans text-xs text-brand-ink-soft">/100</span>
        </div>
      </div>
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">{label}</p>
    </div>
  )
}

// ── Harmony scoring helpers ─────────────────────────────────────────────────

function harmonyColor(score: number): string {
  if (score >= 70) return "#5B835F"
  if (score >= 45) return "#E8A84E"
  return "#E26C73"
}

function harmonyLabel(score: number): string {
  if (score >= 80) return "Thriving"
  if (score >= 60) return "Building"
  if (score >= 40) return "Establishing"
  if (score >= 20) return "Foundation"
  return "Starting Point"
}

// ── Blueprint Card™ accordion wrapper ───────────────────────────────────────

function BlueprintCard({
  icon: Icon,
  cardNumber,
  title,
  subtitle,
  accentColor = "#5B835F",
  defaultOpen = false,
  children,
}: {
  icon: React.ElementType
  cardNumber: string
  title: string
  subtitle: string
  accentColor?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-3xl border border-brand-blush bg-white overflow-hidden shadow-sm">
      {/* Blueprint Card™ accent bar */}
      <div className="h-1" style={{ backgroundColor: accentColor }} aria-hidden />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-7 py-6 text-left hover:bg-brand-cream/40 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: accentColor + "15" }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} aria-hidden />
          </div>
          <div className="text-left">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: accentColor }}>
              {cardNumber}
            </p>
            <h3 className="font-playfair text-xl font-bold text-brand-ink leading-tight">{title}</h3>
            <p className="font-sans text-sm text-brand-ink-soft mt-0.5 text-pretty">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-brand-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div className="border-t border-brand-blush/60 px-7 pb-8 pt-6">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Data row helper ─────────────────────────────────────────────────────────

function DataCard({ label, value, accent = "#5B835F" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl bg-brand-cream/70 px-4 py-3 border border-brand-blush/40">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] mb-1" style={{ color: accent }}>
        {label}
      </p>
      <p className="font-sans text-sm font-semibold text-brand-ink leading-snug capitalize">
        {value}
      </p>
    </div>
  )
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ label, href, hrefLabel }: { label: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-blush py-10 text-center">
      <p className="font-sans text-sm text-brand-ink-soft">{label}</p>
      {href && hrefLabel && (
        <Link href={href} className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-4 py-2 font-sans text-xs font-bold text-brand-green hover:bg-brand-green/20 transition-colors">
          {hrefLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  )
}

function fmt(val: string) {
  return val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Main client component ───────────────────────────────────────────────────

export function HarmonyBlueprintClient() {
  const [lifeData, setLifeData] = useState<AuditData | null>(null)
  const [bizData, setBizData] = useState<EsaResults | null>(null)
  const [bcData, setBcData] = useState<BusinessContextProfile | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setLifeData(getAuditResults())
    setBizData(getEsaResults())
    // Instant paint from the local cache, then reconcile with the database —
    // the account's canonical Business Context Profile™ — once it resolves.
    setBcData(getBusinessContext())
    setReady(true)
    getBusinessContextFromDb().then((record) => {
      if (!record) return
      const { updatedAt: _updatedAt, ...profile } = record
      setBcData(profile)
      saveBusinessContext(profile)
    })
  }, [])

  const lifeScore = lifeData?.overallScore ?? null
  const bizScore = bizData?.overallScore ?? null
  const harmonyScore =
    lifeScore !== null && bizScore !== null
      ? Math.round((lifeScore + bizScore) / 2)
      : lifeScore ?? bizScore ?? 0

  const hColor = harmonyColor(harmonyScore)
  const hLabel = harmonyLabel(harmonyScore)

  const focusAreas = [
    ...(lifeData?.results ?? [])
      .filter((r) => r.percentage <= FOCUS_THRESHOLD)
      .map((r) => ({ name: r.label, score: r.percentage, source: "Life" as const })),
    ...(bizData?.pillarScores ?? [])
      .filter((p) => p.percentage <= FOCUS_THRESHOLD)
      .map((p) => ({ name: p.pillarName, score: p.percentage, source: "Business" as const })),
  ].sort((a, b) => a.score - b.score)

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* ── Hero ───────────────────���─────────────────────────────────────── */}
      <CherryBlossomScene variant="garden" minHeight="min-h-[60vh]" noBackground>
        <CherryBlossomSceneCard
          title="My Work-Life Harmony Blueprint™"
          scrollPrompt="Open My Blueprint™"
        >
          <p>
            This is your <strong>permanent executive record</strong> — the complete operating
            record of your life, leadership, and business.
          </p>
          <p>
            Every assessment you complete, every week you design, every decision you make, and
            every asset you create inside Harmony Lane™ lives here.
          </p>
          <p className="text-brand-ink-soft">
            Cherry Blossom™ reads from and writes to this Blueprint™ continuously — so every
            recommendation you receive is personalized to your exact reality.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Blueprint body ────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14 space-y-5">

        {/* Harmony Snapshot™ — always shown first */}
        {ready && (
          <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-brand-coral via-[#E8A84E] to-brand-green" aria-hidden />
            <div className="px-7 py-9">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-1">
                Harmony Snapshot™
              </p>
              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-8">
                {hLabel} — Your Starting Point
              </h2>
              <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-around">
                {lifeScore !== null ? (
                  <ScoreRing score={lifeScore} color="#E26C73" label="Life Balance Score™" size={130} />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="h-[130px] w-[130px] rounded-full border-8 border-dashed border-brand-blush" />
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">Life Balance Score™</p>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing score={harmonyScore} color={hColor} label="Overall Harmony Score™" size={160} stroke={10} />
                  <span className="font-sans text-sm font-semibold text-brand-ink-soft">{scoreLabel(harmonyScore)}</span>
                </div>
                {bizScore !== null ? (
                  <ScoreRing score={bizScore} color="#5B835F" label="Business Score™" size={130} />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="h-[130px] w-[130px] rounded-full border-8 border-dashed border-brand-blush" />
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">Business Score™</p>
                  </div>
                )}
              </div>
              <p className="mt-8 font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty text-center max-w-xl mx-auto">
                Every high-performing founder began here.{" "}
                <strong className="text-brand-ink">Now let&apos;s build.</strong>
              </p>
            </div>
          </div>
        )}

        {/* ── Blueprint Card 1: Work-Life Balance Reality Check™ ───────────── */}
        <BlueprintCard
          icon={Compass}
          cardNumber="Blueprint Card 1"
          title="Work-Life Balance Reality Check™"
          subtitle="Where you currently stand — a condensed read of your latest measurements."
          accentColor="#E8A84E"
          defaultOpen
        >
          {ready && (lifeData || bizData) ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-around">
                {lifeScore !== null ? (
                  <ScoreRing score={lifeScore} color="#E26C73" label="Life Balance Score™" size={100} />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="h-[100px] w-[100px] rounded-full border-8 border-dashed border-brand-blush" />
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">Life Balance Score™</p>
                  </div>
                )}
                <ScoreRing score={harmonyScore} color={hColor} label="Overall Harmony Score™" size={120} stroke={9} />
                {bizScore !== null ? (
                  <ScoreRing score={bizScore} color="#5B835F" label="Business Score™" size={100} />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <div className="h-[100px] w-[100px] rounded-full border-8 border-dashed border-brand-blush" />
                    <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">Business Score™</p>
                  </div>
                )}
              </div>
              {focusAreas.length > 0 && (
                <div className="rounded-2xl border border-brand-coral/20 bg-brand-coral/[0.04] px-5 py-5">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-coral mb-3">
                    Focus This Week™
                  </p>
                  <ul className="space-y-2">
                    {focusAreas.slice(0, 3).map((f) => (
                      <li key={`${f.source}-${f.name}`} className="flex items-center justify-between font-sans text-sm text-brand-ink">
                        <span>{f.name}</span>
                        <span className="font-semibold text-brand-ink-soft">{f.score} / 100</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/reality-check" className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#E8A84E] hover:underline">
                View Full Reality Check™
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          ) : (
            <EmptyState
              label="Complete your Work-Life Balance Audit™ and Entrepreneur Success Assessment™ to unlock your Reality Check™."
              href="/audit"
              hrefLabel="Take the Audit™"
            />
          )}
        </BlueprintCard>

        {/* ── Blueprint Card 2: Work-Life Balance Audit™ ───────────────────── */}
        <BlueprintCard
          icon={Heart}
          cardNumber="Blueprint Card 2"
          title="Work-Life Balance Audit™"
          subtitle="Your weekly life audit history, Harmony Score, and trends over time."
          accentColor="#E26C73"
        >
          {ready && lifeData ? (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <DataCard label="Overall Life Score™" value={`${lifeData.overallScore} / 100`} accent="#E26C73" />
                {Array.isArray(lifeData.results) && lifeData.results.slice(0, 5).map((r) => (
                  <DataCard key={r.category} label={fmt(r.category)} value={`${r.percentage} / 100`} accent="#E26C73" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-brand-ink-soft">Current week — audited 7 days</p>
                <Link href="/audit" className="font-sans text-xs font-semibold text-[#E26C73] hover:underline">
                  Retake Audit
                </Link>
              </div>
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-coral mb-3">
                  This Month, at a Glance
                </p>
                <MonthlyHarmonyCalendar />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <EmptyState
                label="Complete your Work-Life Balance Audit™ to populate this card."
                href="/audit"
                hrefLabel="Take the Audit™"
              />
              <MonthlyHarmonyCalendar />
            </div>
          )}
        </BlueprintCard>

        {/* ── Blueprint Card 3: Entrepreneur Success Assessment™ ───────────── */}
        <BlueprintCard
          icon={BarChart2}
          cardNumber="Blueprint Card 3"
          title="Entrepreneur Success Assessment™"
          subtitle="Your business measurements, historical results, and retake schedule."
          accentColor="#5B835F"
        >
          <div className="space-y-5">
            {ready && bizData ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <DataCard label="Business Score™" value={`${bizData.overallScore} / 100`} accent="#5B835F" />
                {Array.isArray(bizData.pillarScores) && bizData.pillarScores.slice(0, 5).map((p) => (
                  <DataCard key={p.pillarId} label={p.pillarName} value={`${p.percentage} / 100`} accent="#5B835F" />
                ))}
              </div>
            ) : (
              <EmptyState
                label="Complete your Entrepreneur Success Assessment™ to populate this card."
                href="/entrepreneur-success-assessment"
                hrefLabel="Take Assessment™"
              />
            )}
            <div className="flex items-center justify-between">
              <p className="font-sans text-xs text-brand-ink-soft">Current week</p>
              <Link href="/entrepreneur-success-assessment" className="font-sans text-xs font-semibold text-brand-green hover:underline">
                Retake
              </Link>
            </div>
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green mb-3">
                This Month, at a Glance
              </p>
              <MonthlyHarmonyCalendar />
            </div>
          </div>
        </BlueprintCard>

        {/* ── Blueprint Card 4: Founder Profile™ ───────────────────────────── */}
        <BlueprintCard
          icon={User}
          cardNumber="Blueprint Card 4"
          title="Founder Profile™"
          subtitle="Everything about you — the person behind the business."
          accentColor="#E26C73"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Personal Profile", href: "/founder-profile" },
                { label: "Relationships", href: "/founder-profile" },
                { label: "Family", href: "/founder-profile" },
                { label: "Pets", href: "/founder-profile" },
                { label: "Hobbies & Interests", href: "/founder-profile" },
                { label: "Vision & Goals", href: "/founder-profile" },
                { label: "Support System", href: "/founder-profile" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="inline-flex items-center gap-1.5 rounded-full border border-[#E26C73]/20 bg-[#E26C73]/5 px-4 py-2 font-sans text-xs font-semibold text-brand-ink hover:bg-[#E26C73]/10 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
            <EmptyState
              label="Complete your Founder Profile™ to personalize every recommendation Cherry Blossom™ makes."
              href="/founder-profile"
              hrefLabel="Complete Founder Profile™"
            />
          </div>
        </BlueprintCard>

        {/* ── Blueprint Card 5: Business Context™ ──────────────────────────── */}
        <BlueprintCard
          icon={Briefcase}
          cardNumber="Blueprint Card 5"
          title="Business Context™"
          subtitle="What you're building — foundational information about your business."
          accentColor="#C9A96E"
        >
          <div className="rounded-2xl border border-[#C9A96E]/25 bg-[#FBF7EE] px-5 py-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A96E]">
                Business Context™
              </p>
              <Link href="/business-context?from=/harmony-blueprint" className="font-sans text-xs font-semibold text-[#C9A96E] hover:underline">
                {bcData ? "Edit" : "Complete"}
              </Link>
            </div>
            {ready && bcData ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Business Name", value: bcData.businessName },
                  { label: "Business Stage™", value: fmt(bcData.businessStage) },
                  { label: "Founder Role™", value: fmt(bcData.founderRole) },
                  { label: "Revenue Stage™", value: fmt(bcData.revenueStage) },
                  bcData.operatingEnvironment ? { label: "Operating Environment™", value: fmt(bcData.operatingEnvironment) } : null,
                  { label: "Growth Vision™", value: fmt(bcData.growthVision) },
                  bcData.biggestGoals?.length ? { label: "Primary Goal™", value: fmt(bcData.biggestGoals[0]) } : null,
                  bcData.biggestChallenges?.length ? { label: "Primary Challenge™", value: fmt(bcData.biggestChallenges[0]) } : null,
                  bcData.biggestOpportunities?.length ? { label: "Greatest Opportunity™", value: fmt(bcData.biggestOpportunities[0]) } : null,
                ].filter((item): item is { label: string; value: string } => item !== null && !!item?.value)
                  .map(({ label, value }) => (
                    <DataCard key={label} label={label} value={value} accent="#C9A96E" />
                  ))}
              </div>
            ) : (
              <EmptyState
                label="Complete your Business Context™ to unlock personalized recommendations."
                href="/business-context?from=/harmony-blueprint"
                hrefLabel="Complete Business Context™"
              />
            )}
          </div>
        </BlueprintCard>

              {/* ── Blueprint Card 6: Entrepreneur Gap Assessment™ ──────────────────
                  EGA is NOT a third recurring weekly assessment. Founders already
                  capture their initial "What is getting in your way?" signal during
                  onboarding (Founder Profile™ → Business Context™ → EGA Screen 1 →
                  Cherry Blossom Thank-You™ — see business-context-onboarding-flow.tsx
                  and utils/reality-check-storage.ts). This card is the diagnostic
                  revisit surface: it lets the founder diagnose the obstacle behind
                  a signal they already recognized, or flag a new one as things
                  change. EGA otherwise operates quietly, reacting to ESA/Business
                  Context signals and surfacing targeted follow-ups only when
                  relevant. */}
              <BlueprintCard
                icon={Search}
                cardNumber="Blueprint Card 6"
                title="Entrepreneur Gap Assessment™"
                subtitle="What is getting in your way — Harmony Lane™ diagnoses only what needs attention."
                accentColor="#5B835F"
              >
                <div className="rounded-2xl border border-[#5B835F]/25 bg-[#F4F8F4] px-5 py-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
                      Entrepreneur Gap Assessment™
                    </p>
                    <Link href="/entrepreneur-gap-assessment" className="font-sans text-xs font-semibold text-[#5B835F] hover:underline">
                      Review
                    </Link>
                  </div>
                  <EmptyState
                    label="Diagnose what's already been recognized, or flag something new getting in your way."
                    href="/entrepreneur-gap-assessment"
                    hrefLabel="What Is Getting In My Way?™"
                  />
                </div>
              </BlueprintCard>

        {/* ── Cherry Blossom forward guidance ──────────────────────────────── */}
        <div className="rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden relative">
          <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />
          <div className="relative px-7 py-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
                <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
              </span>
              <span className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
                Cherry Blossom™
              </span>
            </div>
            <p className="font-playfair font-bold text-xl text-brand-ink mb-4">
              Now let&apos;s design your operating system.
            </p>
            <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-7">
              <p>
                We now understand your life, how you operate, and the business you are building.
              </p>
              <p>
                Now I&apos;ll guide you through designing your{" "}
                <strong className="text-brand-ink">Work-Life Balance Business Week™</strong> — the
                eight <strong className="text-brand-ink">Operating Segments™</strong> that structure
                your Mon–Thu 4-Hour CEO Workday and protect your Time Freedom™.
              </p>
            </div>
            <Link
              href="/design-my-week"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
            >
              Begin Designing My Week™
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

      </section>
    </div>
  )
}
