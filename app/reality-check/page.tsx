"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { getAuditResults } from "@/utils/audit-storage"
import { getBbaRealityCheckSnapshot, type BbaRealityCheckSnapshot } from "@/lib/business-bottleneck-audit/bba-storage"
import { getStoredAssessmentWindow } from "@/lib/assessment-cadence"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import { CherryBlossomTransitionCard } from "@/components/cherry-blossom/cherry-blossom-transition-card"
import type { AuditData } from "@/utils/audit-storage"

/** Any area at or below this score becomes a "Focus This Week™" candidate. */
const FOCUS_THRESHOLD = 60

/** Seconds the branded loading state holds before the scores reveal — gives the founder a deliberate pause instead of an instant, jarring reveal. */
const LOADING_DURATION = 15

interface FocusArea {
  name: string
  score: number
  source: "Life" | "Business"
}

// ── Score ring ────────────────────────────────────────────────────────────

function ScoreRing({
  score,
  color,
  label,
  size = 130,
  stroke = 9,
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
          <span className="font-sans text-2xl font-bold tabular-nums" style={{ color }}>
            {score}
          </span>
          <span className="font-sans text-xs text-brand-ink-soft">/100</span>
        </div>
      </div>
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">
        {label}
      </p>
    </div>
  )
}

function EmptyRing({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 opacity-40">
      <div className="h-[130px] w-[130px] rounded-full border-8 border-dashed border-brand-blush" />
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft text-center">
        {label}
      </p>
    </div>
  )
}

function realityColor(score: number): string {
  if (score > 60) return "#5B835F"
  if (score >= 40) return "#E8A84E"
  return "#E26C73"
}

// ── Focus area row ──────────────────────────────────────────────────────────

function FocusAreaRow({ area }: { area: FocusArea }) {
  const accent = area.source === "Life" ? "#E26C73" : "#5B835F"
  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ backgroundColor: accent + "15", color: accent }}
          >
            {area.source === "Life" ? "Life" : "Business"}
          </span>
          <p className="font-sans text-sm font-semibold text-brand-ink">{area.name}</p>
        </div>
        <span className="font-sans text-sm font-bold tabular-nums" style={{ color: accent }}>
          {area.score}/100
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-brand-cream overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${area.score}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

// ── Branded loading state — holds for LOADING_DURATION so the founder has a
// deliberate pause before the scores reveal, rather than an instant jump. ──

function RealityCheckLoading({ secondsLeft }: { secondsLeft: number }) {
  const pct = ((LOADING_DURATION - secondsLeft) / LOADING_DURATION) * 100
  return (
    <div className="mx-auto w-full max-w-md px-4 py-24 flex flex-col items-center text-center gap-6">
      <span className="relative inline-flex h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-brand-blush shadow-md">
        <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
      </span>
      <Loader2 className="h-6 w-6 animate-spin text-brand-coral" aria-hidden />
      <div className="space-y-1.5">
        <p className="font-playfair text-xl font-bold text-brand-ink">
          Bringing your life and business together&hellip;
        </p>
        <p className="font-sans text-sm text-brand-ink-soft">
          Your Work-Life Balance Reality Check™ is almost ready.
        </p>
      </div>
      <div className="w-full">
        <div className="h-1.5 w-full rounded-full bg-brand-green/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-coral via-[#E8A84E] to-brand-green transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 font-sans text-xs font-semibold tabular-nums text-brand-ink-soft">
          {secondsLeft}s
        </p>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function RealityCheckPage() {
  const [lifeData, setLifeData] = useState<AuditData | null>(null)
  const [bizData, setBizData] = useState<BbaRealityCheckSnapshot | null>(null)
  const [period, setPeriod] = useState("7 days")
  const [ready, setReady] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(LOADING_DURATION)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
    setLifeData(getAuditResults())
    getBbaRealityCheckSnapshot().then(setBizData)
    setPeriod(getStoredAssessmentWindow() === "30-day" ? "30 days" : "7 days")

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setReady(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const lifeScore = lifeData?.overallScore ?? null
  const bizScore = bizData?.overallScore ?? null
  const realityScore =
    lifeScore !== null && bizScore !== null
      ? Math.round((lifeScore + bizScore) / 2)
      : lifeScore ?? bizScore ?? 0
  const rColor = realityColor(realityScore)

  const focusAreas: FocusArea[] = [
    ...(lifeData?.results ?? [])
      .filter((r) => r.percentage <= FOCUS_THRESHOLD)
      .map((r) => ({ name: r.label, score: r.percentage, source: "Life" as const })),
    ...(bizData?.pillarScores ?? [])
      .filter((p) => p.percentage <= FOCUS_THRESHOLD)
      .map((p) => ({ name: p.pillarName, score: p.percentage, source: "Business" as const })),
  ].sort((a, b) => a.score - b.score)

  const bothComplete = lifeData !== null && bizData !== null

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <CherryBlossomScene variant="pond" minHeight="min-h-[60vh]">
        <CherryBlossomSceneCard
          title="Your Work-Life Balance Reality Check™"
          scrollPrompt="See My Reality Check™"
        >
          <p>
            Your life and business reflections from the past <strong>{period}</strong> have been
            brought together into one Work-Life Balance Reality Check™.
          </p>
          <p>
            Below, you&apos;ll see exactly which areas are working well — and which ones are worth
            your attention this week.
          </p>
          <p className="text-brand-ink-soft">
            This updates every Monday, so it always reflects how your life and business have
            really been operating — not how you wish they were.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      {!ready ? (
        <RealityCheckLoading secondsLeft={secondsLeft} />
      ) : (
      <section className="mx-auto w-full max-w-4xl px-4 py-14 space-y-8">
        {/* Score snapshot */}
        {ready && (
          <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-brand-coral via-[#E8A84E] to-brand-green" aria-hidden />
            <div className="px-7 py-9">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-1">
                This Week&apos;s Reality Check™
              </p>
              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-8">
                How life and business are operating together
              </h2>
              <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-around">
                {lifeScore !== null ? (
                  <ScoreRing score={lifeScore} color="#E26C73" label="Life Balance Score™" />
                ) : (
                  <EmptyRing label="Life Balance Score™" />
                )}
                <ScoreRing score={realityScore} color={rColor} label="Reality Check Score™" size={160} stroke={10} />
                {bizScore !== null ? (
                  <ScoreRing score={bizScore} color="#5B835F" label="Business Score™" />
                ) : (
                  <EmptyRing label="Business Score™" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Focus areas */}
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-1">
            Focus This Week™
          </p>
          <h2 className="font-playfair text-2xl font-bold text-brand-ink mb-2 text-balance">
            {focusAreas.length > 0
              ? "Here's what to choose from this week"
              : "Every area is holding steady"}
          </h2>
          <p className="font-sans text-sm text-brand-ink-soft mb-6 max-w-xl text-pretty">
            {focusAreas.length > 0
              ? `Any area at ${FOCUS_THRESHOLD} or below is listed here — not as a judgment, but as a shortlist. Pick one or two to design intentional time around this week.`
              : "Nothing scored at or below 60 this week. Use this momentum to design a week that protects what's already working."}
          </p>

          {ready && bothComplete ? (
            focusAreas.length > 0 ? (
              <div className="space-y-3">
                {focusAreas.map((area) => (
                  <FocusAreaRow key={`${area.source}-${area.name}`} area={area} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-brand-green/40 bg-brand-green/5 py-8 text-center">
                <p className="font-sans text-sm text-brand-ink-soft">
                  No focus areas this week — every area scored above {FOCUS_THRESHOLD}.
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-brand-blush py-10 text-center">
              <p className="font-sans text-sm text-brand-ink-soft max-w-sm">
                {lifeData === null && bizData === null
                  ? "Complete your Work-Life Balance Audit™ and Business Bottleneck Audit™ to see your Reality Check™."
                  : lifeData === null
                    ? "Complete your Work-Life Balance Audit™ to finish your Reality Check™."
                    : "Complete your Business Bottleneck Audit™ to finish your Reality Check™."}
              </p>
              <Link
                href={lifeData === null ? "/audit" : "/entrepreneur-success-assessment"}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-4 py-2 font-sans text-xs font-bold text-brand-green hover:bg-brand-green/20 transition-colors"
              >
                {lifeData === null ? "Take the Audit™" : "Take the Assessment™"}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          )}
        </div>

        {/* Transition into the week */}
        <CherryBlossomTransitionCard
          greeting="Now let's design your week."
          ctaLabel="Design My Week™"
          ctaHref="/?openSpace=monday-debrief"
        >
          <p>
            {focusAreas.length > 0
              ? "Awareness only matters if it shapes what happens next."
              : "Every high-performing founder protects what's working."}
          </p>
          <p>
            Let&apos;s turn what you just saw into intentional time on your calendar for the week
            ahead.
          </p>
        </CherryBlossomTransitionCard>
      </section>
      )}
    </div>
  )
}
