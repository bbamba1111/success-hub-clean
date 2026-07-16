"use client"

/**
 * GPS Recommendation Card™ — Phase 8.1
 * ---------------------------------------------------------------------------
 * The universal display component for every Founder GPS™ recommendation.
 *
 * Anatomy:
 *   1. GPS Header — "Founder GPS™" label + outcome badge
 *   2. Question — the single executive question for this segment
 *   3. Cherry Blossom Framing — her one-sentence setup
 *   4. Recommendation — the single highest-leverage next step
 *   5. Why This Recommendation™ — expandable explainability panel
 *   6. Executive Assignment™ — who is assigned (always visible when present)
 *   7. Business Asset™ — the compounding value being built (when applicable)
 *
 * Used from: TodaysOperatingSystem™, CeoWorkdayWorkspace™
 * Data source: lib/founder-gps/engine.ts (pure, deterministic)
 */

import { useState } from "react"
import { ChevronDown, MapPin, Shield, Zap, TrendingUp, AlertCircle } from "lucide-react"
import type { GpsRecommendationCard as GpsCard } from "@/lib/founder-gps/engine"

// ─── Outcome colors ───────────────────────────────────────────────────────────

const OUTCOME_CONFIG = {
  "honor-non-negotiables": {
    label: "Honor Life\u2019s Non-Negotiables\u2122",
    color: "#5B835F",
    bg: "rgba(91,131,95,0.08)",
    border: "rgba(91,131,95,0.20)",
  },
  "build-compounding-assets": {
    label: "Build Compounding Business Assets\u2122",
    color: "#C13B6B",
    bg: "rgba(193,59,107,0.07)",
    border: "rgba(193,59,107,0.20)",
  },
  "reduce-execution-friction": {
    label: "Reduce Execution Friction\u2122",
    color: "#C9A24B",
    bg: "rgba(201,162,75,0.07)",
    border: "rgba(201,162,75,0.20)",
  },
} as const

// ─── Main component ───────────────────────────────────────────────────────────

export function GpsRecommendationCard({
  card,
  compact = false,
}: {
  card: GpsCard
  compact?: boolean
}) {
  const [explainOpen, setExplainOpen] = useState(false)
  const outcome = OUTCOME_CONFIG[card.primaryOutcome] ?? OUTCOME_CONFIG["honor-non-negotiables"]

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: outcome.border, background: outcome.bg }}
      role="region"
      aria-label={`Founder GPS\u2122 recommendation: ${card.recommendation.slice(0, 60)}`}
    >
      {/* GPS Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: outcome.border }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: outcome.color }} aria-hidden />
          <span
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: outcome.color }}
          >
            Founder GPS™
          </span>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{ background: outcome.color, color: "#fff" }}
        >
          {outcome.label}
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Executive Question™ */}
        {!compact && (
          <div>
            <p
              className="font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5"
              style={{ color: `${outcome.color}99` }}
            >
              Executive Question™
            </p>
            <p className="font-playfair text-lg font-medium italic leading-snug text-[#1A1A1A] text-balance">
              {card.question}
            </p>
          </div>
        )}

        {/* Cherry Blossom framing */}
        <div
          className="rounded-xl border px-4 py-3"
          style={{ borderColor: outcome.border, background: `${outcome.color}06` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src="/images/logo.png"
              alt=""
              className="h-5 w-5 rounded-full object-cover border border-white/50"
              aria-hidden
            />
            <span
              className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: outcome.color }}
            >
              Cherry Blossom™
            </span>
          </div>
          <p className="font-montserrat text-[13px] italic leading-relaxed text-[#3A2E33] text-pretty">
            &ldquo;{card.cbFraming}&rdquo;
          </p>
        </div>

        {/* Recommendation */}
        <div className="rounded-xl border border-white/60 bg-white/70 px-4 py-4">
          <p
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] mb-2"
            style={{ color: outcome.color }}
          >
            Today&apos;s Highest-Leverage Next Step™
          </p>
          <p className="font-montserrat text-[14px] leading-relaxed text-[#1A1A1A] text-pretty font-semibold">
            {card.recommendation}
          </p>
          {card.why && (
            <p className="mt-2 font-montserrat text-[12px] leading-relaxed text-[#6B5860] text-pretty">
              {card.why}
            </p>
          )}
        </div>

        {/* Executive Assignment™ */}
        {card.executive && (
          <ExecutiveAssignmentBadge executive={card.executive} outcomeColor={outcome.color} />
        )}

        {/* Business Asset Intelligence™ */}
        {card.businessAsset && (
          <BusinessAssetBadge asset={card.businessAsset} outcomeColor={outcome.color} />
        )}

        {/* Why This Recommendation™ — expandable explainability */}
        <WhyThisRecommendation
          explainability={card.explainability}
          open={explainOpen}
          onToggle={() => setExplainOpen((v) => !v)}
          outcomeColor={outcome.color}
          outcomeBorder={outcome.border}
        />

        {/* CTA */}
        {card.cta && (
          <a
            href={card.cta.href}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: outcome.color }}
          >
            {card.cta.label}
            <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" aria-hidden />
          </a>
        )}
      </div>
    </div>
  )
}

// ─── Executive Assignment Badge ───────────────────────────────────────────────

function ExecutiveAssignmentBadge({
  executive,
  outcomeColor,
}: {
  executive: GpsCard["executive"]
  outcomeColor: string
}) {
  if (!executive) return null
  return (
    <div
      className="flex items-start gap-3 rounded-xl border px-4 py-3"
      style={{ borderColor: `${outcomeColor}25`, background: `${outcomeColor}06` }}
    >
      <Zap
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color: outcomeColor }}
        aria-hidden
      />
      <div className="min-w-0">
        <p
          className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
          style={{ color: outcomeColor }}
        >
          Executive Assignment™
        </p>
        <p className="font-montserrat text-[13px] font-semibold text-[#1A1A1A]">
          {executive.executiveName}
        </p>
        <p className="font-montserrat text-[11px] text-[#6B5860]/80 mt-0.5">
          {executive.executiveTitle}
        </p>
        <p className="font-montserrat text-[12px] text-[#3A2E33] mt-1.5 leading-relaxed">
          {executive.mission}
        </p>
        {executive.deliverable && (
          <p className="mt-1.5 font-montserrat text-[11px] text-[#6B5860]">
            <span className="font-semibold">Available deliverable:</span> {executive.deliverable}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Business Asset Badge ─────────────────────────────────────────────────────

function BusinessAssetBadge({
  asset,
  outcomeColor,
}: {
  asset: NonNullable<GpsCard["businessAsset"]>
  outcomeColor: string
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border px-4 py-3"
      style={{ borderColor: `${outcomeColor}25`, background: `${outcomeColor}05` }}
    >
      <TrendingUp
        className="h-4 w-4 mt-0.5 shrink-0"
        style={{ color: outcomeColor }}
        aria-hidden
      />
      <div className="min-w-0">
        <p
          className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
          style={{ color: outcomeColor }}
        >
          Business Asset Intelligence™
        </p>
        <p className="font-montserrat text-[13px] font-semibold text-[#1A1A1A]">
          {asset.name}
        </p>
        <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33] mt-1">
          {asset.compoundingMechanism}
        </p>
      </div>
    </div>
  )
}

// ─── Why This Recommendation™ — expandable explainability ────────────────────

function WhyThisRecommendation({
  explainability,
  open,
  onToggle,
  outcomeColor,
  outcomeBorder,
}: {
  explainability: GpsCard["explainability"]
  open: boolean
  onToggle: () => void
  outcomeColor: string
  outcomeBorder: string
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: outcomeBorder }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-white/40 px-4 py-3 text-left transition-colors hover:bg-white/60"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" style={{ color: outcomeColor }} aria-hidden />
          <span
            className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: outcomeColor }}
          >
            Why This Recommendation™
          </span>
        </div>
        <ChevronDown
          className="h-3.5 w-3.5 text-[#6B5860]/60 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        />
      </button>

      {open && (
        <div
          className="divide-y px-4 pb-4 pt-1 space-y-0"
          style={{ borderColor: outcomeBorder, background: `${outcomeColor}04` }}
        >
          <ExplainRow
            label="Constitutional Principle™"
            value={explainability.constitutionalPrinciple}
            color={outcomeColor}
          />
          <ExplainRow
            label="Reasoning Rule™"
            value={explainability.reasoningRule}
            color={outcomeColor}
          />
          <ExplainRow
            label="Supporting Context™"
            value={explainability.supportingContext}
            color={outcomeColor}
          />
          <ExplainRow
            label="Expected Outcome™"
            value={explainability.expectedOutcome}
            color={outcomeColor}
          />
        </div>
      )}
    </div>
  )
}

function ExplainRow({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="py-3 first:pt-3">
      <p
        className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-1"
        style={{ color: `${color}CC` }}
      >
        {label}
      </p>
      <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33] text-pretty">
        {value}
      </p>
    </div>
  )
}
