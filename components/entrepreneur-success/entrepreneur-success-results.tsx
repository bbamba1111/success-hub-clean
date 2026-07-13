"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { scoreLabel, scoreColor } from "@/lib/entrepreneur-success/scoring"
import { getOperatingPillar, OPERATING_PILLARS } from "@/lib/entrepreneur-success/esa-registry"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"
import { CherryBlossomTransitionCard } from "@/components/cherry-blossom/cherry-blossom-transition-card"
import type { EsaResults } from "@/lib/entrepreneur-success/types"

/* ── Score ring SVG — a simple arc showing the overall score ───────────── */
function ScoreRing({
  score,
  size = 160,
  stroke = 10,
}: {
  score: number
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = scoreColor(score)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rotate-[-90deg]"
      aria-hidden
    >
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
  )
}

/* ── Horizontal bar for pillar/practice scores ─────────────────────────── */
function ScoreBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
            backgroundColor: scoreColor(percentage),
          }}
        />
      </div>
      <span className="tabular-nums text-sm font-semibold text-brand-ink w-10 text-right">
        {percentage}%
      </span>
    </div>
  )
}

export default function EntrepreneurSuccessResults() {
  const [results, setResults] = useState<EsaResults | null>(null)

  useEffect(() => {
    setResults(getEsaResults())
  }, [])

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-3">No Assessment Found</h1>
          <p className="text-brand-ink-soft mb-6">
            Complete the Entrepreneur Success Assessment™ to see your results.
          </p>
          <Link
            href="/entrepreneur-success-assessment"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-white shadow-ds hover:bg-brand-green-dark"
          >
            Take the Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const label = scoreLabel(results.overallScore)
  const completedDate = new Date(results.completedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  /* Sort pillars by score ascending to find weakest for the pillar section */
  const sortedPillarsByScore = [...results.pillarScores].sort((a, b) => a.percentage - b.percentage)
  // weakestPillar retained for pillar section aria usage
  const _weakestPillar = getOperatingPillar(sortedPillarsByScore[0].pillarId)

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-background/95 px-4 py-3">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-coral hover:text-brand-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/entrepreneur-success-assessment"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink-soft hover:text-brand-ink transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retake
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">

        {/* ── Title block ──────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="ds-eyebrow text-brand-coral mb-3">Entrepreneur Success Assessment™</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink text-balance mb-2">
            Your Operating Baseline
          </h1>
          <p className="text-sm text-brand-ink-soft">Completed {completedDate}</p>
        </div>

        {/* ── Overall score ─────────────────────────────────────────────── */}
        <div className="mb-10 rounded-2xl border border-border bg-card shadow-ds p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Ring */}
            <div className="relative shrink-0">
              <ScoreRing score={results.overallScore} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: scoreColor(results.overallScore) }}
                >
                  {results.overallScore}
                </span>
                <span className="text-xs font-medium text-brand-ink-soft uppercase tracking-widest mt-0.5">
                  / 100
                </span>
              </div>
            </div>
            {/* Copy */}
            <div className="text-center sm:text-left">
              <p className="ds-eyebrow text-brand-coral mb-1">Overall Entrepreneur Success Score™</p>
              <h2 className="font-display text-2xl font-bold text-brand-ink mb-2">{label}</h2>
              <p className="text-brand-ink-soft leading-relaxed max-w-sm">
                {results.overallScore >= 75
                  ? "You demonstrate strong operating practices across the Eight Pillars™."
                  : results.overallScore >= 55
                  ? "Your foundation is in place. Targeted practice in key pillars will accelerate your operating excellence."
                  : "This is your starting point. Every high-performing founder began here. Let&apos;s build."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Eight Pillars breakdown ───────────────────────────────────── */}
        <section className="mb-10" aria-labelledby="pillars-heading">
          <h2
            id="pillars-heading"
            className="font-display text-2xl font-bold text-brand-ink mb-6"
          >
            Eight Operating Pillars™
          </h2>
          <div className="space-y-4">
            {OPERATING_PILLARS.map((pillar) => {
              const pillarScore = results.pillarScores.find((s) => s.pillarId === pillar.id)
              if (!pillarScore) return null
              const pct = pillarScore.percentage
              return (
                <div key={pillar.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-brand-ink">{pillar.name}</h3>
                      <p className="text-xs text-brand-ink-soft mt-0.5">{pillar.tagline}</p>
                    </div>
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${scoreColor(pct)}18`,
                        color: scoreColor(pct),
                      }}
                    >
                      {scoreLabel(pct)}
                    </span>
                  </div>
                  <ScoreBar percentage={pct} />
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Cherry Blossom Transition Card — single CTA into the journey ── */}
        <div className="mb-16">
          <CherryBlossomTransitionCard
            greeting="Excellent."
            ctaLabel="Continue"
            ctaHref="/begin"
          >
            <p>
              We now understand how your business has been operating during the past 30 days.
            </p>
            <p>
              Combined with your Work-Life Balance Audit™, I now have everything I need to personalize
              your journey through Harmony Lane™.
            </p>
            <p>
              Next we&apos;ll begin installing the operating practices that will help you build your business
              while protecting the life you&apos;re building it for.
            </p>
          </CherryBlossomTransitionCard>
        </div>
      </div>
    </div>
  )
}
