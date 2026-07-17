"use client"

/**
 * GPS Recommendation Card™ — Phase 10.2 (Executive Intelligence Engine™)
 * ---------------------------------------------------------------------------
 * The universal display component for every Founder GPS™ recommendation.
 *
 * Anatomy:
 *   1. GPS Header — "Founder GPS™" label + outcome badge
 *   2. Momentum Context Banner™ — when building on recent wins (Phase 10.2)
 *   3. Question — the single executive question for this segment
 *   4. Cherry Blossom Framing — her one-sentence setup
 *   5. Recommendation — the single highest-leverage next step
 *   6. Why This Recommendation™ — expandable explainability panel
 *   7. Executive Assignment™ — who is assigned (always visible when present)
 *   8. Business Asset Intelligence™ — with expandable downstream chain (Phase 10.2)
 *   9. Confidence Panel™ — signal categories contributing to this rec (Phase 10.2)
 *  10. Adaptive Learning™ micro-actions — accept / complete / skip (Phase 10.2)
 *
 * Used from: TodaysOperatingSystem™, CeoWorkdayWorkspace™
 * Data source: lib/founder-gps/engine.ts (pure, deterministic)
 */

import { useState } from "react"
import {
  ChevronDown,
  MapPin,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import type { GpsRecommendationCard as GpsCard } from "@/lib/founder-gps/engine"
import {
  recordRecommendationOutcome,
  SKIP_REASON_LABELS,
  type SkipReason,
} from "@/lib/founder-gps/history/recommendation-history-store"
import { ExecutiveBriefCard } from "@/components/executive-office/executive-brief-card"
import { ExecutiveBriefingTrigger } from "@/components/executive-capability/executive-briefing-trigger"

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
  const [chainOpen, setChainOpen] = useState(false)
  const [adaptiveState, setAdaptiveState] = useState<"idle" | "skip-prompt" | "recorded">("idle")
  const [outcome, setOutcome] = useState<"accepted" | "completed" | "skipped" | null>(null)

  const outcomeConfig = OUTCOME_CONFIG[card.primaryOutcome] ?? OUTCOME_CONFIG["honor-non-negotiables"]

  function handleAccept() {
    recordRecommendationOutcome({
      id: card.id,
      recommendationTitle: card.recommendation,
      segmentId: "gps",
      primaryOutcome: card.primaryOutcome,
      outcome: "accepted",
    })
    setOutcome("accepted")
  }

  function handleComplete() {
    recordRecommendationOutcome({
      id: card.id,
      recommendationTitle: card.recommendation,
      segmentId: "gps",
      primaryOutcome: card.primaryOutcome,
      outcome: "completed",
      businessAssetCreated: card.businessAsset?.name,
    })
    setOutcome("completed")
  }

  function handleSkip(reason: SkipReason) {
    recordRecommendationOutcome({
      id: card.id,
      recommendationTitle: card.recommendation,
      segmentId: "gps",
      primaryOutcome: card.primaryOutcome,
      outcome: "skipped",
      skipReason: reason,
    })
    setOutcome("skipped")
    setAdaptiveState("recorded")
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: outcomeConfig.border, background: outcomeConfig.bg }}
      role="region"
      aria-label={`Founder GPS\u2122 recommendation: ${card.recommendation.slice(0, 60)}`}
    >
      {/* GPS Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: outcomeConfig.border }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: outcomeConfig.color }} aria-hidden />
          <span
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: outcomeConfig.color }}
          >
            Founder GPS\u2122
          </span>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.14em]"
          style={{ background: outcomeConfig.color, color: "#fff" }}
        >
          {outcomeConfig.label}
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">

        {/* Momentum Context Banner™ */}
        {card.buildingOnMomentum && card.momentumContext && (
          <MomentumBanner
            message={card.momentumContext}
            outcomeColor={outcomeConfig.color}
            outcomeBorder={outcomeConfig.border}
          />
        )}

        {/* Executive Question™ */}
        {!compact && (
          <div>
            <p
              className="font-montserrat text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5"
              style={{ color: `${outcomeConfig.color}99` }}
            >
              Executive Question\u2122
            </p>
            <p className="font-playfair text-lg font-medium italic leading-snug text-[#1A1A1A] text-balance">
              {card.question}
            </p>
          </div>
        )}

        {/* Cherry Blossom framing */}
        <div
          className="rounded-xl border px-4 py-3"
          style={{ borderColor: outcomeConfig.border, background: `${outcomeConfig.color}06` }}
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
              style={{ color: outcomeConfig.color }}
            >
              Cherry Blossom\u2122
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
            style={{ color: outcomeConfig.color }}
          >
            Today&apos;s Highest-Leverage Next Step\u2122
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
          <ExecutiveAssignmentBadge executive={card.executive} outcomeColor={outcomeConfig.color} />
        )}

        {/* Executive Brief™ — Phase 10.3 */}
        {card.executiveBrief && (
          <ExecutiveBriefCard
            brief={card.executiveBrief}
            outcomeColor={outcomeConfig.color}
            outcomeBorder={outcomeConfig.border}
          />
        )}

        {/* Business Asset Intelligence™ with chain */}
        {card.businessAsset && (
          <BusinessAssetBadge
            asset={card.businessAsset}
            chain={card.assetChain}
            outcomeColor={outcomeConfig.color}
            chainOpen={chainOpen}
            onToggleChain={() => setChainOpen((v) => !v)}
          />
        )}

        {/* Why This Recommendation™ — expandable explainability */}
        <WhyThisRecommendation
          explainability={card.explainability}
          open={explainOpen}
          onToggle={() => setExplainOpen((v) => !v)}
          outcomeColor={outcomeConfig.color}
          outcomeBorder={outcomeConfig.border}
        />

        {/* Confidence Panel™ */}
        {card.confidence && (
          <ConfidencePanel
            confidence={card.confidence}
            outcomeColor={outcomeConfig.color}
            outcomeBorder={outcomeConfig.border}
          />
        )}

        {/* Executive Capability Briefing™ — Phase 10.4 */}
        {card.capabilityBriefing && (
          <ExecutiveBriefingTrigger
            topicId={card.capabilityBriefing}
            outcomeColor={outcomeConfig.color}
            outcomeBorder={outcomeConfig.border}
          />
        )}

        {/* CTA */}
        {card.cta && (
          <a
            href={card.cta.href}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: outcomeConfig.color }}
          >
            {card.cta.label}
            <ChevronDown className="h-3.5 w-3.5 rotate-[-90deg]" aria-hidden />
          </a>
        )}

        {/* Adaptive Learning™ micro-actions */}
        <AdaptiveLearningActions
          card={card}
          outcome={outcome}
          adaptiveState={adaptiveState}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onSkipRequest={() => setAdaptiveState("skip-prompt")}
          onSkip={handleSkip}
          outcomeColor={outcomeConfig.color}
        />
      </div>
    </div>
  )
}

// ─── Momentum Context Banner™ ─────────────────────────────────────────────────

function MomentumBanner({
  message,
  outcomeColor,
  outcomeBorder,
}: {
  message: string
  outcomeColor: string
  outcomeBorder: string
}) {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border px-4 py-3"
      style={{ borderColor: outcomeBorder, background: `${outcomeColor}08` }}
    >
      <Sparkles
        className="h-3.5 w-3.5 mt-0.5 shrink-0"
        style={{ color: outcomeColor }}
        aria-hidden
      />
      <div className="min-w-0">
        <p
          className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
          style={{ color: outcomeColor }}
        >
          Building on Your Momentum\u2122
        </p>
        <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33] text-pretty">
          {message}
        </p>
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
          Executive Assignment\u2122
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

// ─── Business Asset Badge (with expandable chain) ─────────────────────────────

function BusinessAssetBadge({
  asset,
  chain,
  outcomeColor,
  chainOpen,
  onToggleChain,
}: {
  asset: NonNullable<GpsCard["businessAsset"]>
  chain?: GpsCard["assetChain"]
  outcomeColor: string
  chainOpen: boolean
  onToggleChain: () => void
}) {
  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: `${outcomeColor}25` }}
    >
      <div
        className="flex items-start gap-3 px-4 py-3"
        style={{ background: `${outcomeColor}05` }}
      >
        <TrendingUp
          className="h-4 w-4 mt-0.5 shrink-0"
          style={{ color: outcomeColor }}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <p
            className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
            style={{ color: outcomeColor }}
          >
            Business Asset Intelligence\u2122
          </p>
          <p className="font-montserrat text-[13px] font-semibold text-[#1A1A1A]">
            {asset.name}
          </p>
          <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33] mt-1">
            {asset.compoundingMechanism}
          </p>
          {chain && (
            <button
              type="button"
              onClick={onToggleChain}
              className="mt-2 flex items-center gap-1.5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
              style={{ color: outcomeColor }}
              aria-expanded={chainOpen}
            >
              <ArrowRight className="h-3 w-3" aria-hidden />
              {chainOpen ? "Hide" : "See"} compounding chain
            </button>
          )}
        </div>
      </div>

      {/* Expandable downstream chain */}
      {chain && chainOpen && (
        <div
          className="border-t px-4 py-3 space-y-0"
          style={{ borderColor: `${outcomeColor}20`, background: `${outcomeColor}03` }}
        >
          <p
            className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-3"
            style={{ color: outcomeColor }}
          >
            {chain.chainLabel}
          </p>
          {/* Chain nodes */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span
              className="rounded-full px-2.5 py-1 font-montserrat text-[10px] font-semibold"
              style={{ background: outcomeColor, color: "#fff" }}
            >
              {chain.sourceAsset}
            </span>
            {chain.downstreamAssets.map((node, i) => (
              <span key={i} className="flex items-center gap-1">
                <ArrowRight className="h-2.5 w-2.5 text-[#6B5860]/40" aria-hidden />
                <span
                  className="rounded-full border px-2.5 py-1 font-montserrat text-[10px] font-medium text-[#3A2E33]"
                  style={{ borderColor: `${outcomeColor}40`, background: `${outcomeColor}08` }}
                >
                  {node.name}
                </span>
              </span>
            ))}
          </div>
          {/* Cherry Blossom chain insight */}
          <div
            className="rounded-lg border px-3 py-2.5"
            style={{ borderColor: `${outcomeColor}20`, background: `${outcomeColor}06` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <img
                src="/images/logo.png"
                alt=""
                className="h-4 w-4 rounded-full object-cover"
                aria-hidden
              />
              <span
                className="font-montserrat text-[8px] font-bold uppercase tracking-[0.18em]"
                style={{ color: outcomeColor }}
              >
                Cherry Blossom\u2122
              </span>
            </div>
            <p className="font-montserrat text-[11px] italic leading-relaxed text-[#3A2E33] text-pretty">
              &ldquo;{chain.cherryBlossomInsight}&rdquo;
            </p>
          </div>
        </div>
      )}
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
            Why This Recommendation\u2122
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
          className="divide-y px-4 pb-4 pt-1"
          style={{ borderColor: outcomeBorder, background: `${outcomeColor}04` }}
        >
          <ExplainRow
            label="Constitutional Principle\u2122"
            value={explainability.constitutionalPrinciple}
            color={outcomeColor}
          />
          <ExplainRow
            label="Reasoning Rule\u2122"
            value={explainability.reasoningRule}
            color={outcomeColor}
          />
          <ExplainRow
            label="Supporting Context\u2122"
            value={explainability.supportingContext}
            color={outcomeColor}
          />
          <ExplainRow
            label="Expected Outcome\u2122"
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

// ─── Confidence Panel™ ────────────────────────────────────────────────────────

function ConfidencePanel({
  confidence,
  outcomeColor,
  outcomeBorder,
}: {
  confidence: NonNullable<GpsCard["confidence"]>
  outcomeColor: string
  outcomeBorder: string
}) {
  const levelLabel =
    confidence.level === "very-high"
      ? "Very High"
      : confidence.level === "high"
      ? "Strong"
      : confidence.level === "medium"
      ? "Good"
      : "Building context\u2026"

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: outcomeBorder, background: `${outcomeColor}04` }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: outcomeBorder }}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" style={{ color: outcomeColor }} aria-hidden />
          <span
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: outcomeColor }}
          >
            Recommendation Confidence\u2122
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-montserrat text-[10px] font-semibold"
            style={{ color: outcomeColor }}
          >
            {levelLabel}
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-montserrat text-[11px] font-bold"
            style={{ background: outcomeColor, color: "#fff" }}
          >
            {confidence.score}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="h-1.5 w-full rounded-full bg-black/8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${confidence.score}%`, background: outcomeColor }}
          />
        </div>
      </div>

      {/* Signal grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-4 py-3">
        {confidence.signalsUsed.map((signal) => (
          <div key={signal.category} className="flex items-start gap-1.5">
            {signal.populated ? (
              <CheckCircle2
                className="h-3 w-3 mt-0.5 shrink-0"
                style={{ color: outcomeColor }}
                aria-hidden
              />
            ) : (
              <Circle
                className="h-3 w-3 mt-0.5 shrink-0 text-[#6B5860]/25"
                aria-hidden
              />
            )}
            <span
              className="font-montserrat text-[10px] leading-tight"
              style={{
                color: signal.populated ? "#3A2E33" : "#6B5860",
                opacity: signal.populated ? 1 : 0.5,
                fontWeight: signal.populated ? 500 : 400,
              }}
            >
              {signal.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Adaptive Learning™ micro-actions ────────────────────────────────────────

const SKIP_REASONS = Object.entries(SKIP_REASON_LABELS) as [SkipReason, string][]

function AdaptiveLearningActions({
  card,
  outcome,
  adaptiveState,
  onAccept,
  onComplete,
  onSkipRequest,
  onSkip,
  outcomeColor,
}: {
  card: GpsCard
  outcome: "accepted" | "completed" | "skipped" | null
  adaptiveState: "idle" | "skip-prompt" | "recorded"
  onAccept: () => void
  onComplete: () => void
  onSkipRequest: () => void
  onSkip: (reason: SkipReason) => void
  outcomeColor: string
}) {
  // After recording any outcome, show a quiet confirmation
  if (adaptiveState === "recorded" || outcome === "accepted" || outcome === "completed") {
    const msg =
      outcome === "completed"
        ? "Marked as complete. Your GPS will build on this."
        : outcome === "accepted"
        ? "Noted. Your GPS is tracking your momentum."
        : "Got it. Your GPS will route better tomorrow."
    return (
      <div className="flex items-center gap-2 pt-1">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: outcomeColor }} aria-hidden />
        <p className="font-montserrat text-[11px] text-[#6B5860]">{msg}</p>
      </div>
    )
  }

  // Skip reason prompt
  if (adaptiveState === "skip-prompt") {
    return (
      <div className="pt-1 space-y-2">
        <p
          className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: outcomeColor }}
        >
          {card.adaptiveLearningPrompt ?? "What got in the way today?"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SKIP_REASONS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => onSkip(key)}
              className="rounded-full border px-3 py-1 font-montserrat text-[10px] font-medium text-[#3A2E33] transition-colors hover:bg-white/60"
              style={{ borderColor: `${outcomeColor}35` }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Idle state — three quiet ghost actions below the CTA
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 border-t border-black/5">
      <button
        type="button"
        onClick={onAccept}
        className="font-montserrat text-[10px] font-medium text-[#6B5860] transition-colors hover:text-[#3A2E33]"
      >
        Mark as accepted
      </button>
      <button
        type="button"
        onClick={onComplete}
        className="font-montserrat text-[10px] font-medium text-[#6B5860] transition-colors hover:text-[#3A2E33]"
      >
        Mark as complete
      </button>
      <button
        type="button"
        onClick={onSkipRequest}
        className="font-montserrat text-[10px] font-medium text-[#6B5860]/60 transition-colors hover:text-[#6B5860]"
      >
        Skip today
      </button>
    </div>
  )
}
