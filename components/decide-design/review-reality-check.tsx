"use client"

/**
 * REVIEW MY REALITY CHECK™
 * ---------------------------------------------------------------------------
 * The very first step of Monday's Decide & Design™. It is a REVIEW, not a
 * retake: it reads the founder's most recent Work-Life Balance Reality Check™
 * (the persisted Boundary Report™ from Thursday/Sunday) and shows a concise
 * synthesis — Original Entrepreneurial Intention™, 30-Day Baseline™, the 1–3
 * Priority Focus Areas™, Business & Workplace Reality™, and Alignment™ answers.
 *
 * It never re-asks the diagnostic questions and it is not a second full report.
 * The founder reads, then continues into Decide & Design™.
 */

import { useEffect, useState, type ReactNode } from "react"
import { ChevronDown, ClipboardCheck } from "lucide-react"
import { getLatestBoundaryReport } from "@/lib/boundary-report/actions"
import type { BoundaryReportData } from "@/lib/boundary-report/types"
import {
  getBbaBusinessRealitySignals,
  type BbaBusinessRealitySignals,
} from "@/lib/business-bottleneck-audit/bba-storage"

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">{children}</p>
  )
}

function ReviewRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-5 py-4 space-y-1.5">
      <Eyebrow>{label}</Eyebrow>
      <div className="font-sans text-sm leading-relaxed text-[#3A2E33]">{children}</div>
    </div>
  )
}

const STAGE_LABEL: Record<string, string> = {
  start: "Start stage",
  grow: "Grow stage",
  scale: "Scale stage",
}

export function ReviewRealityCheck() {
  const [report, setReport] = useState<BoundaryReportData | null>(null)
  const [realitySignals, setRealitySignals] = useState<BbaBusinessRealitySignals | null>(null)
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    let active = true
    getLatestBoundaryReport()
      .then((res) => {
        if (active) setReport(res?.data ?? null)
      })
      .catch(() => {
        if (active) setReport(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  // BBA™ is the canonical source for Business & Workplace Reality™. Read the two
  // founder-reality signals live so they surface here as soon as they're answered,
  // independent of when the Boundary Report snapshot was generated.
  useEffect(() => {
    let active = true
    getBbaBusinessRealitySignals()
      .then((signals) => {
        if (active) setRealitySignals(signals)
      })
      .catch(() => {
        if (active) setRealitySignals(null)
      })
    return () => {
      active = false
    }
  }, [])

  // Nothing to review yet — point the founder to the Reality Check without
  // turning this into a retake prompt inside Decide & Design.
  if (!loading && !report) {
    return (
      <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-[#5B835F]" aria-hidden />
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Review My Reality Check™
          </p>
        </div>
        <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
          You haven&apos;t completed a Work-Life Balance Reality Check™ yet. Take it on Thursday or Sunday, and what you
          discover will appear here to review before you redesign your week.
        </p>
        <a
          href="/reality-check"
          className="inline-flex w-fit items-center rounded-full bg-[#5B835F] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90"
        >
          Take My Reality Check™
        </a>
      </div>
    )
  }

  const overall = report ? Math.round(report.baseline.overall) : 0
  const focusAreas = report?.priorityAreas ?? []
  const requirements = report?.businessRequirements ?? []
  const alignment = report?.alignmentResponses ?? []
  const willingCount = alignment.filter((a) => a.choice === "willing").length

  return (
    <div className="rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-[#5B835F]" aria-hidden />
            <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
              Review My Reality Check™
            </p>
          </div>
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            Review what you discovered Thursday or Sunday before you redesign your week. This is a review, not a retake.
          </p>
        </div>
        {report && (
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-expanded={!collapsed}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#7FB069]/40 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
          >
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${collapsed ? "-rotate-90" : ""}`} aria-hidden />
            {collapsed ? "Show" : "Hide"}
          </button>
        )}
      </div>

      {loading && <p className="font-sans text-sm text-[#6B5860]">Loading your Reality Check™…</p>}

      {report && !collapsed && (
        <div className="space-y-3">
          <ReviewRow label="Original Entrepreneurial Intention™">
            <p className="text-pretty">{report.originalIntention.summary}</p>
          </ReviewRow>

          <ReviewRow label="30-Day Work-Life Balance Baseline™">
            <p>
              <span className="font-semibold text-[#2E1F27]">{overall}/100</span> overall balance as of{" "}
              {report.baseline.date}.
            </p>
          </ReviewRow>

          <ReviewRow label="Priority Focus Areas™">
            {focusAreas.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {focusAreas.map((a) => (
                  <li
                    key={a.key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C0545A]/25 bg-[#FDF8F5] px-3 py-1 font-sans text-xs font-semibold text-[#3A2E33]"
                  >
                    {a.label}
                    <span className="text-[#C0545A]">{Math.round(a.score)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#6B5860]">No focus areas were flagged — your baseline was strong across the board.</p>
            )}
          </ReviewRow>

          <ReviewRow label="Business &amp; Workplace Reality™">
            <p className="mb-1.5">{STAGE_LABEL[report.stage] ?? report.stage}.</p>
            {requirements.length > 0 && (
              <ul className="list-disc space-y-0.5 pl-5">
                {requirements.slice(0, 4).map((r) => (
                  <li key={r.id}>{r.label}</li>
                ))}
              </ul>
            )}
            {realitySignals && realitySignals.founderInvolvement.length > 0 && (
              <div className="mt-2.5">
                <p className="font-semibold text-[#2E1F27]">Currently requires your involvement:</p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {realitySignals.founderInvolvement.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {realitySignals && realitySignals.emergencyDefinition.length > 0 && (
              <div className="mt-2.5">
                <p className="font-semibold text-[#2E1F27]">You defined these as emergencies:</p>
                <ul className="list-disc space-y-0.5 pl-5">
                  {realitySignals.emergencyDefinition.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </ReviewRow>

          <ReviewRow label="Work-Life Balance Alignment™">
            {alignment.length > 0 ? (
              <p>
                <span className="font-semibold text-[#2E1F27]">
                  {willingCount} of {alignment.length}
                </span>{" "}
                willingness questions answered “willing.”
                {report.finalAlignment && (
                  <>
                    {" "}
                    You said you were{" "}
                    <span className="font-semibold text-[#2E1F27]">
                      {report.finalAlignment === "willing" ? "ready to experience it" : "still unsure"}
                    </span>
                    .
                  </>
                )}
              </p>
            ) : (
              <p className="text-[#6B5860]">No alignment answers were recorded.</p>
            )}
          </ReviewRow>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="mt-1 inline-flex items-center rounded-full bg-[#5B835F] px-6 py-3 font-sans text-sm font-bold text-white hover:opacity-90"
          >
            Continue to Decide &amp; Design →
          </button>
        </div>
      )}
    </div>
  )
}
