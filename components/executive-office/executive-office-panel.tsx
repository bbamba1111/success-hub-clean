"use client"

/**
 * Executive Office Panel™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * Full-page client component showing the live status of all 9 executives.
 *
 * Sections:
 *   1. Executive Status Dashboard — 9 rows with status badge + confidence bar
 *   2. Executive Brief™ — the winning recommendation with full rationale
 *   3. Executive Findings Detail — expandable per-executive cards with Ask Why™
 *
 * Props are computed by the parent (ExecutiveOfficePanelClient) using the
 * deriveExecutiveFindings / buildExecutiveBrief / deriveExecutiveStatuses
 * functions from the engine.
 */

import { useState } from "react"
import {
  ChevronDown,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCircle2,
  Activity,
  Zap,
  ArrowRight,
} from "lucide-react"
import type { ExecutiveFinding, ExecutiveBrief, ExecutiveStatusRow } from "@/lib/executive-office/types"

// ─── Dept → color mapping ─────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, string> = {
  "Strategy & Vision":       "#2C3E2D",
  "Marketing & Brand":       "#C13B6B",
  "Revenue & Sales":         "#5B835F",
  "Operations & Systems":    "#C9A24B",
  "Finance & Profitability": "#2E8B57",
  "People & Culture":        "#7B4E8E",
  "Client Experience":       "#2A7F8A",
  "Innovation & AI":         "#2563EB",
  "Growth & Leadership":     "#D97706",
}

function deptColor(dept: string): string {
  return DEPT_COLORS[dept] ?? "#6B5860"
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  "opportunity-found": { label: "Opportunity Found", color: "#C13B6B", bg: "rgba(193,59,107,0.08)" },
  "alert":             { label: "Alert", color: "#C13B6B", bg: "rgba(193,59,107,0.08)" },
  "reviewing":         { label: "Reviewing", color: "#C9A24B", bg: "rgba(201,162,75,0.08)" },
  "monitoring":        { label: "Monitoring", color: "#5B835F", bg: "rgba(91,131,95,0.08)" },
  "stable":            { label: "Stable", color: "#6B5860", bg: "rgba(107,88,96,0.06)" },
} as const

function StatusBadge({ status }: { status: ExecutiveStatusRow["status"] }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["stable"]
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.14em] shrink-0"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  )
}

// ─── Priority → color ─────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#C13B6B",
  high:     "#C13B6B",
  medium:   "#C9A24B",
  low:      "#5B835F",
  none:     "#9CA3AF",
}

// ─── Executive initials avatar ────────────────────────────────────────────────

function ExecAvatar({ name, dept, size = "sm" }: { name: string; dept: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.replace("™", "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()
  const color = deptColor(dept)
  const cls = size === "lg" ? "h-10 w-10 text-[13px]" : size === "md" ? "h-8 w-8 text-[11px]" : "h-7 w-7 text-[10px]"
  return (
    <span
      className={`flex items-center justify-center rounded-full font-montserrat font-bold text-white shrink-0 ${cls}`}
      style={{ background: color }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

// ─── 1. Status Dashboard ──────────────────────────────────────────────────────

function ExecutiveStatusDashboard({
  statuses,
  winningId,
}: {
  statuses: ExecutiveStatusRow[]
  winningId: string
}) {
  return (
    <div className="rounded-2xl border border-[#2C3E2D]/15 bg-white/60">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#2C3E2D]/10">
        <Activity className="h-4 w-4 text-[#2C3E2D]" aria-hidden />
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#2C3E2D]">
            Executive Status Dashboard™
          </p>
          <p className="font-montserrat text-[11px] text-[#6B5860]">
            All 9 executives evaluated your context
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#2C3E2D]/06">
        {statuses.map((row) => {
          const isWinner = row.executiveId === winningId
          const color = deptColor(row.department)
          return (
            <div
              key={row.executiveId}
              className="flex items-center gap-3 px-5 py-3"
              style={isWinner ? { background: `${color}06` } : undefined}
            >
              {/* Avatar */}
              <ExecAvatar name={row.executiveName} dept={row.department} />

              {/* Name + focus */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-montserrat text-[12px] font-semibold text-[#3A2E33] truncate">
                    {row.executiveName}
                  </p>
                  {isWinner && (
                    <span
                      className="rounded-full px-2 py-0.5 font-montserrat text-[8px] font-bold uppercase tracking-[0.14em]"
                      style={{ background: "#2C3E2D", color: "#fff" }}
                    >
                      Today&apos;s Lead
                    </span>
                  )}
                </div>
                <p className="font-montserrat text-[10px] text-[#6B5860] truncate">{row.currentFocus}</p>

                {/* Confidence bar */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-black/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${row.confidence}%`, background: color }}
                    />
                  </div>
                  <span className="font-montserrat text-[9px] text-[#6B5860] shrink-0">
                    {row.confidence}%
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <StatusBadge status={row.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 2. Executive Brief section ───────────────────────────────────────────────

function ExecutiveBriefSection({ brief }: { brief: ExecutiveBrief }) {
  const color = deptColor(brief.winningFinding.department)

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ background: `${color}08` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 shrink-0" style={{ color }} aria-hidden />
          <p
            className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color }}
          >
            Today&apos;s Highest-Leverage Recommendation™
          </p>
        </div>
        <p className="font-montserrat text-[14px] font-semibold leading-relaxed text-[#1A1A1A] text-pretty">
          {brief.recommendation}
        </p>
      </div>

      {/* Why this won */}
      <div className="px-5 py-4 border-t" style={{ borderColor: `${color}15` }}>
        <div className="flex items-center gap-1.5 mb-2">
          <img src="/images/logo.png" alt="" className="h-4 w-4 rounded-full object-cover" aria-hidden />
          <p
            className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ color }}
          >
            Cherry Blossom™ — Why This Won™
          </p>
        </div>
        <p className="font-montserrat text-[12px] italic leading-relaxed text-[#3A2E33] text-pretty">
          &ldquo;{brief.rationale}&rdquo;
        </p>
      </div>

      {/* Contributors */}
      {brief.contributors.length > 0 && (
        <div className="px-5 py-4 border-t" style={{ borderColor: `${color}15` }}>
          <p
            className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-3"
            style={{ color: `${color}80` }}
          >
            Contributing Executives
          </p>
          <div className="space-y-2">
            {brief.contributors.slice(0, 5).map((c) => (
              <div key={c.executiveId} className="flex items-start gap-2.5">
                <ExecAvatar name={c.executiveName} dept={c.department} />
                <div className="flex-1 min-w-0">
                  <p className="font-montserrat text-[11px] font-semibold text-[#3A2E33]">{c.executiveName}</p>
                  <p className="font-montserrat text-[10px] leading-relaxed text-[#6B5860] text-pretty">{c.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deferred */}
      {brief.deferred.length > 0 && (
        <div className="px-5 py-4 border-t" style={{ borderColor: `${color}10` }}>
          <p
            className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-2"
            style={{ color: `${color}60` }}
          >
            Also Evaluated — Deferred
          </p>
          <div className="space-y-1">
            {brief.deferred.map((d) => (
              <div key={d.executiveId} className="flex items-center gap-2">
                <ArrowRight className="h-3 w-3 text-[#6B5860]/40 shrink-0" aria-hidden />
                <p className="font-montserrat text-[10px] text-[#6B5860]">
                  <span className="font-semibold text-[#3A2E33]">{d.title}</span> — deferred this cycle
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 3. Executive Finding Detail Card ────────────────────────────────────────

function ExecutiveFindingCard({
  finding,
  isWinner,
}: {
  finding: ExecutiveFinding
  isWinner: boolean
}) {
  const [open, setOpen] = useState(false)
  const [whyOpen, setWhyOpen] = useState(false)

  const color = deptColor(finding.department)
  const priorityColor = PRIORITY_COLORS[finding.priority] ?? "#9CA3AF"

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: `${color}20` }}
    >
      {/* Summary row — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/50"
        style={isWinner ? { background: `${color}06` } : { background: "rgba(255,255,255,0.4)" }}
        aria-expanded={open}
      >
        <ExecAvatar name={finding.executiveName} dept={finding.department} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-montserrat text-[12px] font-semibold text-[#3A2E33]">{finding.executiveName}</p>
            {isWinner && (
              <span className="rounded-full px-2 py-0.5 font-montserrat text-[8px] font-bold uppercase tracking-[0.12em] bg-[#2C3E2D] text-white">
                Today&apos;s Lead
              </span>
            )}
          </div>
          <p className="font-montserrat text-[10px] text-[#6B5860] truncate">{finding.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 font-montserrat text-[9px] font-semibold capitalize"
            style={{ color: priorityColor, background: `${priorityColor}15` }}
          >
            {finding.priority}
          </span>
          <ChevronDown
            className="h-3.5 w-3.5 text-[#6B5860]/50 shrink-0 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          />
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div
          className="divide-y"
          style={{ borderColor: `${color}12`, background: `${color}03` }}
        >
          {/* Summary + recommendation */}
          <div className="px-4 py-3 space-y-2">
            <p className="font-montserrat text-[11px] leading-relaxed text-[#3A2E33] text-pretty">
              {finding.summary}
            </p>
            <div
              className="rounded-lg border px-3 py-2.5"
              style={{ borderColor: `${color}20`, background: `${color}05` }}
            >
              <p
                className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-1"
                style={{ color }}
              >
                Recommendation
              </p>
              <p className="font-montserrat text-[11px] font-semibold text-[#1A1A1A] leading-relaxed text-pretty">
                {finding.recommendation}
              </p>
            </div>
          </div>

          {/* Impact & effort chips */}
          <div className="px-4 py-3 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-2.5 py-1 font-montserrat text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ borderColor: `${color}30`, color }}
            >
              Business Impact: {finding.estimatedBusinessImpact}
            </span>
            <span
              className="rounded-full border px-2.5 py-1 font-montserrat text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6B5860] border-[#6B5860]/20"
            >
              Effort: {finding.estimatedFounderEffort}
            </span>
          </div>

          {/* Ask Why™ */}
          <div>
            <button
              type="button"
              onClick={() => setWhyOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/30"
              aria-expanded={whyOpen}
            >
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" style={{ color }} aria-hidden />
                <span
                  className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color }}
                >
                  Ask Why™
                </span>
              </div>
              <ChevronDown
                className="h-3.5 w-3.5 text-[#6B5860]/50 shrink-0 transition-transform duration-200"
                style={{ transform: whyOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                aria-hidden
              />
            </button>

            {whyOpen && (
              <div className="px-4 pb-4 space-y-3">
                <WhyRow label="What I Noticed" value={finding.whatINoticed} color={color} />
                <WhyRow label="Why It Matters" value={finding.whyItMatters} color={color} />
                {finding.expectedOutcome && (
                  <WhyRow label="Expected Outcome" value={finding.expectedOutcome} color={color} />
                )}
                {finding.supportingSignals.length > 0 && (
                  <div>
                    <p
                      className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5"
                      style={{ color }}
                    >
                      Supporting Signals
                    </p>
                    <div className="space-y-1">
                      {finding.supportingSignals.map((s, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" style={{ color }} aria-hidden />
                          <p className="font-montserrat text-[10px] text-[#6B5860]">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {finding.whySelectedOrDeferred && (
                  <div
                    className="rounded-lg border px-3 py-2"
                    style={{ borderColor: `${color}20`, background: `${color}05` }}
                  >
                    <p
                      className="font-montserrat text-[9px] font-bold uppercase tracking-[0.14em] mb-1"
                      style={{ color }}
                    >
                      Selection Decision
                    </p>
                    <p className="font-montserrat text-[10px] italic text-[#6B5860]">
                      {finding.whySelectedOrDeferred}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function WhyRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <p
        className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
        style={{ color }}
      >
        {label}
      </p>
      <p className="font-montserrat text-[11px] leading-relaxed text-[#3A2E33] text-pretty">
        {value}
      </p>
    </div>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────

export function ExecutiveOfficePanel({
  findings,
  brief,
  statuses,
}: {
  findings: ExecutiveFinding[]
  brief: ExecutiveBrief
  statuses: ExecutiveStatusRow[]
}) {
  const [detailOpen, setDetailOpen] = useState(false)

  return (
    <div className="space-y-5">
      {/* Status Dashboard */}
      <ExecutiveStatusDashboard statuses={statuses} winningId={brief.winningExecutiveId} />

      {/* Executive Brief */}
      <ExecutiveBriefSection brief={brief} />

      {/* Executive Findings Detail — togglable */}
      <div className="rounded-2xl border border-[#6B5860]/12 bg-white/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/60"
          aria-expanded={detailOpen}
        >
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4 w-4 text-[#6B5860]" aria-hidden />
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A2E33]">
                All Executive Findings™
              </p>
              <p className="font-montserrat text-[11px] text-[#6B5860]">
                {findings.length} executive reports — expand to review each
              </p>
            </div>
          </div>
          <ChevronDown
            className="h-4 w-4 text-[#6B5860]/50 shrink-0 transition-transform duration-200"
            style={{ transform: detailOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          />
        </button>

        {detailOpen && (
          <div className="px-5 pb-5 space-y-3 border-t border-[#6B5860]/08">
            <div className="pt-3 space-y-3">
              {findings.map((f) => (
                <ExecutiveFindingCard
                  key={f.executiveId}
                  finding={f}
                  isWinner={f.executiveId === brief.winningExecutiveId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
