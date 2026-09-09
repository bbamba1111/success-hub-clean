"use client"

/**
 * Decision History Panel — Phase 11.0
 * ---------------------------------------------------------------------------
 * My Harmony section client. Reads decision history from localStorage.
 * Shows decision cards with expandable detail and inline outcome recording.
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import {
  getDecisionHistory,
  updateDecisionOutcome,
  DECISION_HISTORY_UPDATED,
} from "@/lib/digital-twin/decision-store"
import type { DecisionRecord, DecisionOutcome } from "@/lib/digital-twin/types"

const STATUS_META: Record<DecisionOutcome, { label: string; color: string }> = {
  committed:      { label: "Committed",    color: "#5B835F" },
  deferred:       { label: "Deferred",     color: "#C9A96E" },
  reconsidering:  { label: "Reconsidering",color: "#D97706" },
  abandoned:      { label: "Abandoned",    color: "#9E9289" },
}

function StatusChip({ status }: { status: DecisionOutcome }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-bold"
      style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
    >
      {meta.label}
    </span>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function DecisionCard({ record, onUpdate }: { record: DecisionRecord; onUpdate: () => void }) {
  const [open, setOpen] = useState(false)
  const [showOutcomeForm, setShowOutcomeForm] = useState(false)
  const [actualOutcome, setActualOutcome] = useState("")
  const [lessonsLearned, setLessonsLearned] = useState("")
  const [saving, setSaving] = useState(false)

  function handleSaveOutcome() {
    if (!actualOutcome.trim()) return
    setSaving(true)
    updateDecisionOutcome(record.id, {
      actualOutcome: actualOutcome.trim(),
      lessonsLearned: lessonsLearned.trim() || null,
    })
    setTimeout(() => {
      setSaving(false)
      setShowOutcomeForm(false)
      onUpdate()
    }, 500)
  }

  const chosenColor = record.optionChosen === "option-a" ? "#5B835F" : "#C13B6B"

  return (
    <div className="rounded-xl border border-[#E8DFE1] bg-white overflow-hidden">
      {/* Card header */}
      <button
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#FAF7F8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C13B6B]/30"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-montserrat text-[13px] font-bold text-[#3A2E33] leading-snug">
              {record.scenarioTitle}
            </span>
            <StatusChip status={record.status} />
          </div>
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            {record.optionChosenLabel && (
              <span
                className="font-montserrat text-[11px] font-bold"
                style={{ color: chosenColor }}
              >
                Chose: {record.optionChosenLabel}
              </span>
            )}
            <span className="font-montserrat text-[11px] text-[#9E9289]">
              {formatDate(record.decidedAt)}
            </span>
          </div>
        </div>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#9E9289] mt-0.5" aria-hidden />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#9E9289] mt-0.5" aria-hidden />
        }
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#E8DFE1]/60">
          {record.expectedOutcome && (
            <div className="pt-3">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1">
                Expected Outcome
              </p>
              <p className="font-montserrat text-[12px] leading-relaxed text-[#6B5860]">
                {record.expectedOutcome}
              </p>
            </div>
          )}

          {record.actualOutcome ? (
            <div>
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#5B835F] mb-1">
                Actual Outcome
              </p>
              <p className="font-montserrat text-[12px] leading-relaxed text-[#3A2E33]">
                {record.actualOutcome}
              </p>
              {record.lessonsLearned && (
                <div className="mt-2">
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1">
                    Lessons Learned
                  </p>
                  <p className="font-montserrat text-[12px] leading-relaxed text-[#6B5860]">
                    {record.lessonsLearned}
                  </p>
                </div>
              )}
              {record.reviewedAt && (
                <p className="mt-2 font-montserrat text-[11px] text-[#9E9289]">
                  Reviewed {formatDate(record.reviewedAt)}
                </p>
              )}
            </div>
          ) : (
            <>
              {!showOutcomeForm ? (
                <button
                  onClick={() => setShowOutcomeForm(true)}
                  className="font-montserrat text-[12px] font-bold text-[#C13B6B] hover:underline focus-visible:outline-none"
                >
                  + Record actual outcome
                </button>
              ) : (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1">
                      What actually happened?
                    </label>
                    <textarea
                      value={actualOutcome}
                      onChange={(e) => setActualOutcome(e.target.value)}
                      placeholder="Describe what actually happened after making this decision..."
                      rows={2}
                      className="w-full rounded-xl border border-[#E8DFE1] bg-white px-3 py-2 font-montserrat text-[12px] text-[#3A2E33] placeholder:text-[#C0B5B8] focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/30 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1">
                      Lessons learned (optional)
                    </label>
                    <textarea
                      value={lessonsLearned}
                      onChange={(e) => setLessonsLearned(e.target.value)}
                      placeholder="What would you do differently?"
                      rows={2}
                      className="w-full rounded-xl border border-[#E8DFE1] bg-white px-3 py-2 font-montserrat text-[12px] text-[#3A2E33] placeholder:text-[#C0B5B8] focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/30 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveOutcome}
                      disabled={!actualOutcome.trim() || saving}
                      className="rounded-lg bg-[#3A2E33] px-4 py-2 font-montserrat text-[12px] font-bold text-white hover:bg-[#2A1E23] disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A2E33]"
                    >
                      {saving ? "Saving..." : "Save Outcome"}
                    </button>
                    <button
                      onClick={() => setShowOutcomeForm(false)}
                      className="rounded-lg border border-[#E8DFE1] px-4 py-2 font-montserrat text-[12px] text-[#6B5860] hover:bg-[#FAF7F8] transition-colors focus-visible:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function DecisionHistoryPanel() {
  const [history, setHistory] = useState<DecisionRecord[]>([])
  const [mounted, setMounted] = useState(false)

  function refresh() {
    setHistory(getDecisionHistory().slice().reverse()) // newest first
  }

  useEffect(() => {
    refresh()
    setMounted(true)
    const handler = () => refresh()
    window.addEventListener(DECISION_HISTORY_UPDATED, handler)
    return () => window.removeEventListener(DECISION_HISTORY_UPDATED, handler)
  }, [])

  if (!mounted) return null

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-[#E8DFE1] bg-[#FAF7F8] px-5 py-6 text-center">
        <p className="font-montserrat text-[13px] font-bold text-[#3A2E33] mb-1">
          No decisions recorded yet
        </p>
        <p className="font-montserrat text-[12px] leading-relaxed text-[#6B5860] mb-3">
          Your decision history builds as you evaluate scenarios in the Decision Workspace.
          Each recorded decision becomes part of your operating intelligence.
        </p>
        <Link
          href="/decision-workspace"
          className="inline-flex items-center gap-1.5 font-montserrat text-[12px] font-bold text-[#C13B6B] hover:underline focus-visible:outline-none"
        >
          Go to Decision Workspace
          <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((record) => (
        <DecisionCard key={record.id} record={record} onUpdate={refresh} />
      ))}
      <div className="flex justify-end pt-1">
        <Link
          href="/decision-workspace"
          className="inline-flex items-center gap-1 font-montserrat text-[12px] text-[#6B5860] hover:text-[#C13B6B] hover:underline transition-colors focus-visible:outline-none"
        >
          Evaluate a new scenario
          <ExternalLink className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
