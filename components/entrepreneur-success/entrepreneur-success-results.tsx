"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCcw, ArrowRight, TrendingUp, AlertCircle, Star } from "lucide-react"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { scoreLabel, scoreColor, lowestPractices, highestPractices } from "@/lib/entrepreneur-success/scoring"
import { getOperatingPillar, getOperatingPractice, OPERATING_PILLARS } from "@/lib/entrepreneur-success/esa-registry"
import { GPS_OUTCOMES } from "@/lib/entrepreneur-success/esa-registry"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"
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

  const topStrengths = highestPractices(results, 3)
  const topGaps = lowestPractices(results, 3)
  const label = scoreLabel(results.overallScore)
  const completedDate = new Date(results.completedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  /* Sort pillars by score ascending for growth section */
  const sortedPillarsByScore = [...results.pillarScores].sort((a, b) => a.percentage - b.percentage)
  const weakestPillar = getOperatingPillar(sortedPillarsByScore[0].pillarId)
  const strongestPillar = getOperatingPillar(
    [...results.pillarScores].sort((a, b) => b.percentage - a.percentage)[0].pillarId
  )

  /* Cherry Blossom context — dynamic based on results */
  const cherryBlossomMessage = {
    low: (
      <>
        <p>
          You&apos;ve just taken one of the most honest steps a founder can take &mdash; looking clearly at where things
          actually stand. This score is not a verdict. It&apos;s a starting line.
        </p>
        <p>
          I can see that your strongest area is {strongestPillar?.name} &mdash; that&apos;s a real foundation we
          build from. And I can see where the gaps are. Let&apos;s address those together, one pillar at a time.
        </p>
      </>
    ),
    mid: (
      <>
        <p>
          You&apos;re operating with real strength in several areas &mdash; and your score reflects that. What I see
          in these results is a founder who has built something real and is ready to build it better.
        </p>
        <p>
          Your {weakestPillar?.name} pillar has the most room to grow. That&apos;s your highest-leverage opportunity
          right now.
        </p>
      </>
    ),
    high: (
      <>
        <p>
          This score reflects exceptional operating discipline. You&apos;ve built real systems and real habits across
          most of the Operating Pillars™.
        </p>
        <p>
          Even at this level, there are areas worth refining. Your {weakestPillar?.name} pillar is where continued
          investment will create the most compounding return.
        </p>
      </>
    ),
  }

  const messageKey =
    results.overallScore < 50 ? "low" : results.overallScore < 75 ? "mid" : "high"

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

        {/* ── Cherry Blossom reflection ─────────────────────────────────── */}
        <div className="mb-10">
          <CherryBlossomGuidance
            greeting="I&apos;ve reviewed your Entrepreneur Success Assessment™."
            primaryAction={{ label: "Design my next week", href: "/sunday-design-day" }}
          >
            {cherryBlossomMessage[messageKey]}
          </CherryBlossomGuidance>
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

        {/* ── Two-column: strengths + growth areas ─────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Strengths */}
          <section aria-labelledby="strengths-heading" className="rounded-2xl border border-border bg-card p-6 shadow-ds">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-brand-green" aria-hidden />
              <h2 id="strengths-heading" className="font-display text-lg font-bold text-brand-ink">
                Your Strengths
              </h2>
            </div>
            <div className="space-y-4">
              {topStrengths.map((ps) => {
                const practice = getOperatingPractice(ps.practiceId)
                if (!practice) return null
                return (
                  <div key={ps.practiceId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-brand-ink">{practice.name}</span>
                      <span className="tabular-nums text-sm font-semibold" style={{ color: scoreColor(ps.percentage) }}>
                        {ps.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-brand-ink-soft leading-relaxed">{practice.idealState}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Growth areas */}
          <section aria-labelledby="growth-heading" className="rounded-2xl border border-border bg-card p-6 shadow-ds">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-brand-coral" aria-hidden />
              <h2 id="growth-heading" className="font-display text-lg font-bold text-brand-ink">
                Highest-Leverage Growth Areas
              </h2>
            </div>
            <div className="space-y-4">
              {topGaps.map((ps) => {
                const practice = getOperatingPractice(ps.practiceId)
                if (!practice) return null
                return (
                  <div key={ps.practiceId}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-brand-ink">{practice.name}</span>
                      <span className="tabular-nums text-sm font-semibold" style={{ color: scoreColor(ps.percentage) }}>
                        {ps.percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-brand-ink-soft leading-relaxed">{practice.gapCost}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* ── Founder GPS™ preview — architecture card ─────────────────── */}
        <section aria-labelledby="gps-heading" className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-ds">
          <div className="flex items-start gap-3 mb-5">
            <AlertCircle className="h-5 w-5 text-brand-coral mt-0.5 shrink-0" aria-hidden />
            <div>
              <p className="ds-eyebrow text-brand-coral mb-1">Founder GPS™</p>
              <h2 id="gps-heading" className="font-display text-xl font-bold text-brand-ink">
                The Intelligence Foundation Is Ready
              </h2>
            </div>
          </div>
          <p className="text-brand-ink-soft leading-relaxed mb-5">
            Your assessment results are now part of the Founder GPS™ signal set. As you continue using
            Harmony Lane™, the GPS will use your score, your weakest pillars, your Business Stage™, and your
            weekly design to continuously answer one question:
          </p>
          <blockquote className="border-l-4 border-brand-coral pl-5 mb-5">
            <p className="font-display text-lg font-semibold text-brand-ink italic">
              &ldquo;What is the highest-leverage next step for this founder right now?&rdquo;
            </p>
          </blockquote>
          <div className="grid sm:grid-cols-3 gap-4">
            {GPS_OUTCOMES.map((outcome) => (
              <div key={outcome.id} className="rounded-xl border border-border bg-muted/30 p-4">
                <h3 className="font-semibold text-sm text-brand-ink mb-1">{outcome.name}</h3>
                <p className="text-xs text-brand-ink-soft leading-relaxed">{outcome.tagline}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Next steps CTA ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sunday-design-day"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white shadow-ds hover:bg-brand-green-dark transition-colors"
          >
            Design My Week
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/entrepreneur-success-assessment"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-coral/40 px-8 py-3 text-sm font-semibold text-brand-coral-dark hover:bg-brand-blush/40 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  )
}
