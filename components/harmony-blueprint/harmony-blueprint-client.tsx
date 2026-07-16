"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { getAuditResults } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import { scoreLabel } from "@/lib/entrepreneur-success/scoring"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"
import type { AuditData } from "@/utils/audit-storage"
import type { EsaResults } from "@/lib/entrepreneur-success/types"

/* ── Thin score ring — consistent with ESA results ───────────────────────── */
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

/* ── Harmony score blended from both assessments ─────────────────────────── */
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

export function HarmonyBlueprintClient() {
  const [lifeData, setLifeData] = useState<AuditData | null>(null)
  const [bizData, setBizData] = useState<EsaResults | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Hero-first: always begin at the top of the page.
    window.scrollTo({ top: 0, behavior: "instant" })
    setLifeData(getAuditResults())
    setBizData(getEsaResults())
    setReady(true)
  }, [])

  const lifeScore = lifeData?.overallScore ?? null
  const bizScore = bizData?.overallScore ?? null
  const harmonyScore =
    lifeScore !== null && bizScore !== null
      ? Math.round((lifeScore + bizScore) / 2)
      : lifeScore ?? bizScore ?? 0

  const hColor = harmonyColor(harmonyScore)
  const hLabel = harmonyLabel(harmonyScore)

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ── Scene: warm cherry blossom garden matching /begin ───────────── */}
      <CherryBlossomScene variant="garden" minHeight="min-h-[65vh]">
        <CherryBlossomSceneCard title="My Work-Life Harmony Blueprint™" scrollPrompt="Review My Work-Life Harmony Blueprint™">
          <p>
            Beautiful. We now understand how both your <strong>life</strong> and your{" "}
            <strong>business</strong> have been operating over the past 30 days.
          </p>
          <p>
            Together, these two assessments form your personal{" "}
            <strong>Harmony Blueprint™</strong> — the foundation of everything Harmony Lane™ will
            build with you.
          </p>
          <p className="text-brand-ink-soft">
            From this point forward, every recommendation I make will be personalized to you.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* ── Blueprint summary ────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14">

        {/* Completion checkmarks */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-8">
          {[
            { label: "Work-Life Balance Audit™", href: "/my-results" },
            { label: "Entrepreneur Success Assessment™", href: "/my-results/entrepreneur-success" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-brand-green/20 bg-white px-5 py-3.5 shadow-sm hover:shadow transition-shadow"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" aria-hidden />
              <span className="font-sans text-sm font-semibold text-brand-ink">{label}</span>
            </Link>
          ))}
        </div>

        {/* Score summary card */}
        {ready && (
          <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden mb-12">
            <div className="px-8 py-10">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
                Your Harmony Snapshot™
              </p>
              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-8 text-balance">
                {hLabel}
              </h2>

              <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-around">
                {lifeScore !== null && (
                  <ScoreRing
                    score={lifeScore}
                    color="#E26C73"
                    label="Life Balance Score™"
                    size={130}
                  />
                )}

                {/* Overall harmony ring — larger, center */}
                <div className="flex flex-col items-center gap-2">
                  <ScoreRing
                    score={harmonyScore}
                    color={hColor}
                    label="Overall Harmony Score™"
                    size={160}
                    stroke={10}
                  />
                  <span className="font-sans text-sm font-semibold text-brand-ink-soft">
                    {scoreLabel(harmonyScore)}
                  </span>
                </div>

                {bizScore !== null && (
                  <ScoreRing
                    score={bizScore}
                    color="#5B835F"
                    label="Business Score™"
                    size={130}
                  />
                )}
              </div>

              <p className="mt-8 font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty text-center max-w-xl mx-auto">
                This is your starting point. Every high-performing founder began here.{" "}
                <strong className="text-brand-ink">Now let&apos;s build.</strong>
              </p>
            </div>
          </div>
        )}

        {/* Cherry Blossom forward guidance */}
        <div className="rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-ds overflow-hidden relative">
          <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-blush/50 blur-3xl" />

          <div className="relative px-8 py-9 sm:px-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
                <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
                Cherry Blossom™
              </span>
            </div>

            <p className="font-sans font-bold text-xl text-brand-ink mb-4">
              Now let&apos;s install your operating system.
            </p>

            <div className="font-sans font-medium text-[15px] leading-relaxed text-brand-ink-soft space-y-3 text-pretty mb-7">
              <p>
                Now I&apos;ll guide you through installing your{" "}
                <strong className="text-brand-ink">Daily Non-Negotiables™</strong> — the personal
                commitments and business rhythms that will structure each day of your{" "}
                <strong className="text-brand-ink">Work-Life Balance Business Week™</strong>.
              </p>
              <p>
                For each segment of your day, you&apos;ll define what matters most — and I&apos;ll
                transform each one into an <em>Intention Declaration™</em> you can live from.
              </p>
              <p className="text-brand-ink-soft">
                This takes about 10 minutes and only happens once.
              </p>
            </div>

            <Link
              href="/design-my-week"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
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
