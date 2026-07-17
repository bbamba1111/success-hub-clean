"use client"

/**
 * Scenario Comparison View — Phase 11.0
 * ---------------------------------------------------------------------------
 * The core two-column analysis surface. Receives a fully analyzed scenario
 * and renders all panels: impact bars, executive perspectives, advantages,
 * risks, tradeoffs, asset opportunities, confidence, and Cherry Blossom summary.
 */

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import type { ScenarioAnalysis, ImpactScore, ExecutivePerspective } from "@/lib/digital-twin/types"
import { DecisionRecordModal } from "@/components/decision-workspace/decision-record-modal"

// ─── Design helpers ────────────────────────────────────────────────────────

const ROSE    = "#C13B6B"
const GREEN   = "#5B835F"
const GOLD    = "#C9A96E"
const INK     = "#3A2E33"
const SOFT    = "#6B5860"

function scoreColor(score: number): string {
  if (score > 0) return GREEN
  if (score < 0) return ROSE
  return "#9E9289"
}

function ScoreDot({ score }: { score: number }) {
  return (
    <span
      className="inline-flex h-2 w-2 rounded-full"
      style={{ backgroundColor: scoreColor(score) }}
      aria-hidden
    />
  )
}

// ─── Impact bar ───────────────────────────────────────────────────────────

function ImpactBar({ score, option }: { score: number; option: "A" | "B" }) {
  const pct = Math.abs(score) / 2 * 100
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.07]">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          backgroundColor: scoreColor(score),
        }}
        role="presentation"
      />
    </div>
  )
}

// ─── Impact scores grid ────────────────────────────────────────────────────

function ImpactScoresPanel({ scores, optionALabel, optionBLabel }: {
  scores: ImpactScore[]
  optionALabel: string
  optionBLabel: string
}) {
  return (
    <div className="rounded-xl border border-[#E8DFE1] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E8DFE1]">
        <TrendingUp className="h-4 w-4 text-[#5B835F]" aria-hidden />
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#6B5860]">
          Nine-Dimension Impact Comparison
        </p>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr] px-4 py-2 border-b border-[#E8DFE1]/60 bg-[#FAF7F8]">
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B5860]">Dimension</p>
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B835F] text-center">{optionALabel}</p>
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#C13B6B] text-center">{optionBLabel}</p>
      </div>

      <div className="divide-y divide-[#E8DFE1]/50">
        {scores.map((s) => (
          <div key={s.dimensionId} className="grid grid-cols-[1fr_1fr_1fr] items-center gap-3 px-4 py-3">
            <p className="font-montserrat text-[12px] font-semibold text-[#3A2E33] leading-tight">{s.label}</p>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <ScoreDot score={s.scoreA} />
                <span className="font-montserrat text-[11px] text-[#6B5860]">
                  {s.scoreA > 0 ? `+${s.scoreA}` : s.scoreA}
                </span>
              </div>
              <ImpactBar score={s.scoreA} option="A" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <ScoreDot score={s.scoreB} />
                <span className="font-montserrat text-[11px] text-[#6B5860]">
                  {s.scoreB > 0 ? `+${s.scoreB}` : s.scoreB}
                </span>
              </div>
              <ImpactBar score={s.scoreB} option="B" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 bg-[#FAF7F8] border-t border-[#E8DFE1]/60">
        <p className="font-montserrat text-[11px] text-[#9E9289]">
          Scale: +2 significant positive · 0 neutral · -2 significant negative.
          Scores reflect your Digital Twin™ snapshot and operating context.
        </p>
      </div>
    </div>
  )
}

// ─── Executive perspective accordion ──────────────────────────────────────

function ExecutivePerspectiveAccordion({
  perspective,
  optionALabel,
  optionBLabel,
}: {
  perspective: ExecutivePerspective
  optionALabel: string
  optionBLabel: string
}) {
  const [open, setOpen] = useState(false)

  const recLabel =
    perspective.recommendation === "option-a" ? optionALabel :
    perspective.recommendation === "option-b" ? optionBLabel :
    "Context-dependent"

  const recColor =
    perspective.recommendation === "option-a" ? GREEN :
    perspective.recommendation === "option-b" ? ROSE :
    GOLD

  return (
    <div className="border-b border-[#E8DFE1]/60 last:border-0">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#FAF7F8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C13B6B]/30"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="font-montserrat text-[12px] font-bold text-[#3A2E33] truncate">
            {perspective.executiveName}
          </span>
          <span className="shrink-0 font-montserrat text-[10px] text-[#9E9289] hidden sm:inline">
            {perspective.executiveTitle}
          </span>
        </div>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[10px] font-bold"
          style={{ backgroundColor: `${recColor}18`, color: recColor }}
        >
          {recLabel}
        </span>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
        }
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-[#5B835F]/20 bg-[#5B835F]/[0.04] px-3 py-2.5">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#5B835F] mb-1">
                {optionALabel}
              </p>
              <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33]">
                {perspective.analysisA}
              </p>
            </div>
            <div className="rounded-lg border border-[#C13B6B]/20 bg-[#C13B6B]/[0.04] px-3 py-2.5">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#C13B6B] mb-1">
                {optionBLabel}
              </p>
              <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33]">
                {perspective.analysisB}
              </p>
            </div>
          </div>

          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">
              Key Considerations
            </p>
            <ul className="space-y-1">
              {perspective.keyConsiderations.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-[#9E9289]" aria-hidden />
                  <span className="font-montserrat text-[12px] text-[#6B5860]">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {perspective.recommendationRationale && (
            <p className="font-montserrat text-[12px] italic text-[#9E9289] border-t border-[#E8DFE1]/60 pt-2">
              {perspective.recommendationRationale}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Confidence panel ──────────────────────────────────────────────────────

function ConfidencePanel({ analysis }: { analysis: ScenarioAnalysis }) {
  const [open, setOpen] = useState(false)
  const c = analysis.confidence

  const strengthColor =
    c.evidenceStrength === "strong" ? GREEN :
    c.evidenceStrength === "moderate" ? GOLD :
    c.evidenceStrength === "limited" ? "#D97706" :
    ROSE

  return (
    <div className="rounded-xl border border-[#E8DFE1] bg-white overflow-hidden">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[#FAF7F8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C13B6B]/30"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Shield className="h-4 w-4 text-[#C9A96E] shrink-0" aria-hidden />
        <span className="flex-1 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#6B5860] text-left">
          Confidence & Evidence
        </span>

        {/* Confidence bar preview */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-black/[0.07]">
            <div
              className="h-full rounded-full"
              style={{ width: `${c.overallConfidence}%`, backgroundColor: strengthColor }}
            />
          </div>
          <span
            className="font-montserrat text-[11px] font-bold"
            style={{ color: strengthColor }}
          >
            {c.overallConfidence}%
          </span>
        </div>

        {open
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
        }
      </button>

      {open && (
        <div className="px-4 pb-5 space-y-4 border-t border-[#E8DFE1]/60">
          <div className="pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289]">
                Evidence Strength
              </p>
              <span
                className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ backgroundColor: `${strengthColor}18`, color: strengthColor }}
              >
                {c.evidenceStrength}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.07]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${c.overallConfidence}%`, backgroundColor: strengthColor }}
              />
            </div>
          </div>

          {c.supportingEvidence.length > 0 && (
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-2">
                Supporting Evidence
              </p>
              <ul className="space-y-1.5">
                {c.supportingEvidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: e.relevance === "primary" ? GREEN : e.relevance === "supporting" ? GOLD : "#C0B5B8" }}
                    />
                    <span className="font-montserrat text-[12px] text-[#6B5860]">{e.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {c.keyAssumptions.length > 0 && (
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">
                Key Assumptions
              </p>
              <ul className="space-y-1">
                {c.keyAssumptions.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-[#5B835F]" aria-hidden />
                    <span className="font-montserrat text-[12px] text-[#6B5860]">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {c.unknownVariables.length > 0 && (
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">
                Unknown Variables
              </p>
              <ul className="space-y-1">
                {c.unknownVariables.map((u, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-[#C9A96E]" aria-hidden />
                    <span className="font-montserrat text-[12px] text-[#6B5860]">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-lg border border-[#C9A96E]/20 bg-[#C9A96E]/[0.06] px-3 py-2.5">
            <p className="font-montserrat text-[12px] leading-relaxed text-[#6B5860] italic">
              {c.transparencyNote}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────

export function ScenarioComparisonView({
  analysis,
  onBack,
}: {
  analysis: ScenarioAnalysis
  onBack?: () => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [execPerspOpen, setExecPerspOpen] = useState(false)

  const oA = analysis.twinProfile.businessStage // just a proxy — scenario holds the actual labels
  const labelA = analysis.twinProfile.businessStage // will use from analysis
  const aLabel = "Option A" // fallback — real labels come from scenario
  const bLabel = "Option B"

  // We need the scenario labels — derive from first perspective's analysis structure
  // In practice, the client passes the scenario down; we reconstruct labels from impactScores for now.
  // The comparison view receives analysis which embeds twinProfile but not scenario directly.
  // Labels are inferred from the executiveSummary context. We use generic "Option A / Option B" here
  // and rely on the calling client to pass optionALabel / optionBLabel props.
  return null // placeholder — see full component below
}

// Full implementation
export function ScenarioComparisonViewFull({
  analysis,
  optionALabel,
  optionBLabel,
  scenarioTitle,
  scenarioQuestion,
  onBack,
}: {
  analysis: ScenarioAnalysis
  optionALabel: string
  optionBLabel: string
  scenarioTitle: string
  scenarioQuestion: string
  onBack?: () => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [execPerspOpen, setExecPerspOpen] = useState(false)

  const aTotal = analysis.impactScores.reduce((s, d) => s + d.scoreA, 0)
  const bTotal = analysis.impactScores.reduce((s, d) => s + d.scoreB, 0)
  const leaderLabel = aTotal >= bTotal ? optionALabel : optionBLabel
  const leaderColor = aTotal >= bTotal ? GREEN : ROSE

  return (
    <div className="space-y-5">
      {/* Back + title */}
      {onBack && (
        <button
          onClick={onBack}
          className="font-montserrat text-[12px] text-[#6B5860] hover:text-[#3A2E33] underline underline-offset-2 focus-visible:outline-none"
        >
          ← Back to scenarios
        </button>
      )}

      <div>
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <h1 className="font-montserrat text-xl font-bold text-[#3A2E33] text-balance leading-snug">
            {scenarioTitle}
          </h1>
          <span className="rounded-full bg-[#C13B6B]/10 px-2 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#C13B6B]">
            Digital Twin™
          </span>
        </div>
        <p className="font-montserrat text-[13px] leading-relaxed text-[#6B5860]">
          {scenarioQuestion}
        </p>
      </div>

      {/* Option pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[#5B835F]/30 bg-[#5B835F]/[0.06] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#5B835F]" />
          <span className="font-montserrat text-[12px] font-bold text-[#5B835F]">{optionALabel}</span>
        </div>
        <span className="font-montserrat text-sm text-[#9E9289] self-center">vs.</span>
        <div className="flex items-center gap-2 rounded-full border border-[#C13B6B]/30 bg-[#C13B6B]/[0.06] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#C13B6B]" />
          <span className="font-montserrat text-[12px] font-bold text-[#C13B6B]">{optionBLabel}</span>
        </div>
      </div>

      {/* Cherry Blossom Executive Summary */}
      <div className="rounded-xl border border-[#C9A96E]/25 bg-[#C9A96E]/[0.05] px-5 py-4">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A96E] mb-2">
          Cherry Blossom™ Executive Summary
        </p>
        <p className="font-montserrat text-[13px] leading-relaxed text-[#3A2E33]">
          {analysis.executiveSummary}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-montserrat text-[11px] text-[#9E9289]">Informed projection:</span>
          <span
            className="rounded-full px-2 py-0.5 font-montserrat text-[11px] font-bold"
            style={{ backgroundColor: `${leaderColor}18`, color: leaderColor }}
          >
            {leaderLabel}
          </span>
        </div>
      </div>

      {/* Impact scores */}
      <ImpactScoresPanel
        scores={analysis.impactScores}
        optionALabel={optionALabel}
        optionBLabel={optionBLabel}
      />

      {/* Two-column advantages / risks */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Option A */}
        <div className="rounded-xl border border-[#5B835F]/20 bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#5B835F]/15 bg-[#5B835F]/[0.04]">
            <span className="h-2 w-2 rounded-full bg-[#5B835F]" />
            <p className="font-montserrat text-xs font-bold text-[#5B835F]">{optionALabel}</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            {analysis.advantagesA.length > 0 && (
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">Advantages</p>
                <ul className="space-y-1.5">
                  {analysis.advantagesA.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-[#5B835F]" aria-hidden />
                      <span className="font-montserrat text-[12px] text-[#3A2E33] leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.risksA.length > 0 && (
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">Risks</p>
                <ul className="space-y-1.5">
                  {analysis.risksA.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-[#C9A96E]" aria-hidden />
                      <span className="font-montserrat text-[12px] text-[#3A2E33] leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.estimatedTimeHorizonA && (
              <div className="flex items-center gap-2 pt-1 border-t border-[#E8DFE1]/60">
                <Clock className="h-3 w-3 text-[#9E9289]" aria-hidden />
                <span className="font-montserrat text-[11px] text-[#9E9289]">{analysis.estimatedTimeHorizonA}</span>
              </div>
            )}
          </div>
        </div>

        {/* Option B */}
        <div className="rounded-xl border border-[#C13B6B]/20 bg-white overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#C13B6B]/15 bg-[#C13B6B]/[0.04]">
            <span className="h-2 w-2 rounded-full bg-[#C13B6B]" />
            <p className="font-montserrat text-xs font-bold text-[#C13B6B]">{optionBLabel}</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            {analysis.advantagesB.length > 0 && (
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">Advantages</p>
                <ul className="space-y-1.5">
                  {analysis.advantagesB.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0 text-[#5B835F]" aria-hidden />
                      <span className="font-montserrat text-[12px] text-[#3A2E33] leading-snug">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.risksB.length > 0 && (
              <div>
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5">Risks</p>
                <ul className="space-y-1.5">
                  {analysis.risksB.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 mt-0.5 shrink-0 text-[#C9A96E]" aria-hidden />
                      <span className="font-montserrat text-[12px] text-[#3A2E33] leading-snug">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.estimatedTimeHorizonB && (
              <div className="flex items-center gap-2 pt-1 border-t border-[#E8DFE1]/60">
                <Clock className="h-3 w-3 text-[#9E9289]" aria-hidden />
                <span className="font-montserrat text-[11px] text-[#9E9289]">{analysis.estimatedTimeHorizonB}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tradeoffs */}
      {analysis.tradeoffs.length > 0 && (
        <div className="rounded-xl border border-[#E8DFE1] bg-white px-4 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#9E9289] mb-2">
            Cross-cutting Tradeoffs
          </p>
          <ul className="space-y-2">
            {analysis.tradeoffs.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRightLeftIcon className="h-3 w-3 mt-0.5 shrink-0 text-[#C9A96E]" aria-hidden />
                <span className="font-montserrat text-[12px] leading-relaxed text-[#6B5860]">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Executive perspectives accordion */}
      <div className="rounded-xl border border-[#E8DFE1] bg-white overflow-hidden">
        <button
          className="flex w-full items-center gap-3 px-4 py-3 hover:bg-[#FAF7F8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C13B6B]/30"
          onClick={() => setExecPerspOpen((o) => !o)}
          aria-expanded={execPerspOpen}
        >
          <span className="flex-1 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#6B5860] text-left">
            Executive Perspectives ({analysis.executivePerspectives.length})
          </span>
          {execPerspOpen
            ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
            : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9E9289]" aria-hidden />
          }
        </button>
        {execPerspOpen && (
          <div className="divide-y divide-[#E8DFE1]/50 border-t border-[#E8DFE1]/60">
            {analysis.executivePerspectives.map((p) => (
              <ExecutivePerspectiveAccordion
                key={p.executiveId}
                perspective={p}
                optionALabel={optionALabel}
                optionBLabel={optionBLabel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Whole-life + capability */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#E8DFE1] bg-white px-4 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-2">
            Whole-Life Implications
          </p>
          <div className="space-y-1.5">
            <p className="font-montserrat text-[12px] text-[#3A2E33]">
              <span className="font-bold text-[#5B835F]">{optionALabel}: </span>
              {analysis.wholeLifeImplicationsA}
            </p>
            <p className="font-montserrat text-[12px] text-[#3A2E33]">
              <span className="font-bold text-[#C13B6B]">{optionBLabel}: </span>
              {analysis.wholeLifeImplicationsB}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-[#E8DFE1] bg-white px-4 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-2">
            Capability Impact
          </p>
          <div className="space-y-1.5">
            <p className="font-montserrat text-[12px] text-[#3A2E33]">
              <span className="font-bold text-[#5B835F]">{optionALabel}: </span>
              {analysis.capabilityImpactA}
            </p>
            <p className="font-montserrat text-[12px] text-[#3A2E33]">
              <span className="font-bold text-[#C13B6B]">{optionBLabel}: </span>
              {analysis.capabilityImpactB}
            </p>
          </div>
        </div>
      </div>

      {/* Asset opportunities */}
      {analysis.assetOpportunities.length > 0 && (
        <div className="rounded-xl border border-[#C9A96E]/25 bg-[#C9A96E]/[0.04] px-4 py-3">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9A96E] mb-2">
            Business Asset™ Opportunities
          </p>
          <ul className="space-y-2">
            {analysis.assetOpportunities.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase"
                  style={{
                    backgroundColor: a.relevantOption === "option-a" ? `${GREEN}18` : a.relevantOption === "option-b" ? `${ROSE}18` : `${GOLD}18`,
                    color: a.relevantOption === "option-a" ? GREEN : a.relevantOption === "option-b" ? ROSE : GOLD,
                  }}
                >
                  {a.relevantOption === "both" ? "Both" : a.relevantOption === "option-a" ? optionALabel : optionBLabel}
                </span>
                <div>
                  <span className="font-montserrat text-[12px] font-bold text-[#3A2E33]">{a.assetName}</span>
                  <span className="font-montserrat text-[12px] text-[#6B5860]"> — {a.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Confidence & evidence */}
      <ConfidencePanel analysis={analysis} />

      {/* Record decision CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-[#3A2E33] px-6 py-3 font-montserrat text-[13px] font-bold text-white hover:bg-[#2A1E23] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A2E33] focus-visible:ring-offset-2"
        >
          Record My Decision
        </button>
      </div>

      {/* Decision record modal */}
      <DecisionRecordModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        analysis={analysis}
        optionALabel={optionALabel}
        optionBLabel={optionBLabel}
        scenarioTitle={scenarioTitle}
      />
    </div>
  )
}

// Inline mini icon component to avoid unused import issues
function ArrowRightLeftIcon({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7H3M18 4l3 3-3 3M6 17H3m-0 0l3-3m-3 3 3 3" />
    </svg>
  )
}
