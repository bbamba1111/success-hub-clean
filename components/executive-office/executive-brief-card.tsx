"use client"

/**
 * Executive Brief Card™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * Standalone card that renders the ExecutiveBrief inline within the GPS
 * Recommendation Card. Shows: winning recommendation, Cherry Blossom rationale,
 * contributing executives, and deferred recommendations.
 *
 * Used from: GpsRecommendationCard (after Executive Assignment badge)
 */

import { useState } from "react"
import { ChevronDown, Users, CheckCircle2, Clock } from "lucide-react"
import type { ExecutiveBrief } from "@/lib/executive-office/types"

// ─── Department → accent color mapping ───────────────────────────────────────

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

// ─── Avatar initials chip ─────────────────────────────────────────────────────

function ExecutiveAvatar({
  name,
  dept,
  size = "sm",
}: {
  name: string
  dept: string
  size?: "sm" | "md"
}) {
  const initials = name
    .replace("™", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  const color = deptColor(dept)
  const dim = size === "md" ? "h-8 w-8 text-[11px]" : "h-6 w-6 text-[10px]"

  return (
    <span
      className={`flex items-center justify-center rounded-full font-montserrat font-bold text-white shrink-0 ${dim}`}
      style={{ background: color }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ExecutiveBriefCard({
  brief,
  outcomeColor,
  outcomeBorder,
}: {
  brief: ExecutiveBrief
  outcomeColor: string
  outcomeBorder: string
}) {
  const [open, setOpen] = useState(false)

  const winnerColor = deptColor(brief.winningFinding.department)

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: outcomeBorder }}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between bg-white/40 px-4 py-3 text-left transition-colors hover:bg-white/60"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <Users className="h-3.5 w-3.5 shrink-0" style={{ color: outcomeColor }} aria-hidden />
          <div>
            <p
              className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: outcomeColor }}
            >
              Executive Brief™
            </p>
            <p className="font-montserrat text-[11px] text-[#6B5860] mt-0.5">
              {brief.contributors.length + 1} executive
              {brief.contributors.length + 1 !== 1 ? "s" : ""} evaluated
              &nbsp;&middot;&nbsp;
              {brief.overallConfidence}% overall confidence
            </p>
          </div>
        </div>
        <ChevronDown
          className="h-3.5 w-3.5 text-[#6B5860]/60 shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        />
      </button>

      {/* Expanded content */}
      {open && (
        <div
          className="divide-y"
          style={{ borderColor: `${outcomeColor}15`, background: `${outcomeColor}03` }}
        >
          {/* Winning executive */}
          <div className="px-4 py-3 space-y-2">
            <p
              className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: outcomeColor }}
            >
              Recommendation Led By
            </p>
            <div className="flex items-start gap-2.5">
              <ExecutiveAvatar
                name={brief.winningFinding.executiveName}
                dept={brief.winningFinding.department}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-montserrat text-[12px] font-semibold text-[#3A2E33]">
                  {brief.winningFinding.executiveName}
                </p>
                <p className="font-montserrat text-[10px] text-[#6B5860]">
                  {brief.winningFinding.executiveTitle}
                </p>
                <p
                  className="mt-1.5 font-montserrat text-[11px] leading-relaxed text-[#3A2E33] text-pretty"
                >
                  {brief.winningFinding.whatINoticed}
                </p>
              </div>
            </div>
          </div>

          {/* Cherry Blossom rationale */}
          <div
            className="px-4 py-3"
            style={{ background: `${winnerColor}04` }}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <img
                src="/images/logo.png"
                alt=""
                className="h-4 w-4 rounded-full object-cover"
                aria-hidden
              />
              <span
                className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: outcomeColor }}
              >
                Why This Won™
              </span>
            </div>
            <p className="font-montserrat text-[11px] italic leading-relaxed text-[#3A2E33] text-pretty">
              &ldquo;{brief.rationale}&rdquo;
            </p>
          </div>

          {/* Contributing executives */}
          {brief.contributors.length > 0 && (
            <div className="px-4 py-3 space-y-2">
              <p
                className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: outcomeColor }}
              >
                Supporting Signals From
              </p>
              <div className="space-y-2">
                {brief.contributors.slice(0, 4).map((c) => (
                  <div key={c.executiveId} className="flex items-start gap-2">
                    <ExecutiveAvatar name={c.executiveName} dept={c.department} />
                    <div className="flex-1 min-w-0">
                      <p className="font-montserrat text-[11px] font-semibold text-[#3A2E33]">
                        {c.executiveName}
                      </p>
                      <p className="font-montserrat text-[10px] leading-relaxed text-[#6B5860] text-pretty">
                        {c.summary}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 font-montserrat text-[9px] font-semibold capitalize"
                      style={{
                        background: `${deptColor(c.department)}15`,
                        color: deptColor(c.department),
                      }}
                    >
                      {c.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deferred */}
          {brief.deferred.length > 0 && (
            <div className="px-4 py-3">
              <p
                className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-2"
                style={{ color: `${outcomeColor}99` }}
              >
                Also Evaluated — Deferred
              </p>
              <div className="space-y-1.5">
                {brief.deferred.map((d) => (
                  <div key={d.executiveId} className="flex items-start gap-2">
                    <Clock className="h-3 w-3 shrink-0 mt-0.5 text-[#6B5860]/40" aria-hidden />
                    <p className="font-montserrat text-[10px] text-[#6B5860] text-pretty">
                      <span className="font-semibold text-[#3A2E33]">{d.title}</span>
                      {" — "}
                      deferred
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signals used */}
          {brief.signalsUsed.length > 0 && (
            <div className="px-4 py-3">
              <p
                className="font-montserrat text-[9px] font-bold uppercase tracking-[0.18em] mb-2"
                style={{ color: `${outcomeColor}80` }}
              >
                Signals Used
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brief.signalsUsed.slice(0, 6).map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-montserrat text-[9px] text-[#6B5860]"
                    style={{ borderColor: `${outcomeColor}25` }}
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 shrink-0" style={{ color: outcomeColor }} aria-hidden />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
