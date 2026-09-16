"use client"

/**
 * ReflectionSpace™
 *
 * The guided experience inside Make Time For More On Mondays™.
 *
 * Step 1 — Work-Life Balance Audit™
 * Step 2 — Work-Life Balance Reality Check™ → direct hand-off into Debrief Space™
 *
 * Business Context does NOT appear here. It belongs exclusively in Measure Monthly™.
 * Weekly state is keyed by the Monday of the current week so it resets automatically.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, ChevronDown, ChevronLeft, Clock } from "lucide-react"
import { getAuditResults, type AuditData } from "@/utils/audit-storage"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"

// ─── Storage ─────────────────────────────────────────────────────────────────

const WEEKLY_KEY        = "reflectionSpace_v2"
/** Persists forever — marks that the member has completed their First Reality Check™. */
const FIRST_REALITY_KEY = "reflectionSpace_firstRealityCheckComplete"

function hasCompletedFirstRealityCheck(): boolean {
  try { return localStorage.getItem(FIRST_REALITY_KEY) === "true" } catch { return false }
}

function markFirstRealityCheckComplete() {
  try { localStorage.setItem(FIRST_REALITY_KEY, "true") } catch { /* ignore */ }
}

function getWeekKey(date = new Date()): string {
  const d = new Date(date)
  const diff = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - diff)
  d.setHours(0, 0, 0, 0)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

interface WeeklyState {
  weekKey: string
  auditDone: boolean
  /** How many times the Audit has been completed this week — max 2 (the
   *  original pass plus one retake). Resets automatically every Monday since
   *  the whole WeeklyState is keyed by `weekKey`. */
  auditAttempts: number
  /** The member's saved per-question answers from their most recent Audit
   *  completion — persisted so reopening the card to review or change an
   *  answer starts pre-filled instead of blank. */
  auditAnswers: Record<number, number> | null
  completedAt: string | null
}

function loadWeekly(): WeeklyState {
  const current = getWeekKey()
  try {
    const raw = localStorage.getItem(WEEKLY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WeeklyState
      if (parsed.weekKey === current) {
        // Backfill defaults for state saved before attempt-tracking existed.
        return { ...parsed, auditAttempts: parsed.auditAttempts ?? (parsed.auditDone ? 1 : 0), auditAnswers: parsed.auditAnswers ?? null }
      }
    }
  } catch { /* ignore */ }
  return {
    weekKey: current,
    auditDone: false,
    auditAttempts: 0,
    auditAnswers: null,
    completedAt: null,
  }
}

function saveWeekly(s: WeeklyState) {
  try { localStorage.setItem(WEEKLY_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

function realityColor(score: number): string {
  if (score > 60) return "#5B835F"
  if (score >= 40) return "#E8A84E"
  return "#E26C73"
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReflectionSpace() {
  const realityCheckSchedule = SCHEDULE_BY_ID["monday-reality-check"]
  const [mounted, setMounted]               = useState(false)
  const [isBaseline, setIsBaseline]         = useState(true)
  const [auditDone, setAuditDone]           = useState(false)
  const [auditAttempts, setAuditAttempts]   = useState(0)
  const [auditAnswers, setAuditAnswers]     = useState<Record<number, number> | null>(null)
  // Whether the completed Audit's card body (the quiz itself) is currently
  // shown — independent of any accordion machinery so collapsing it never
  // yanks the page's scroll position.
  const [auditExpanded, setAuditExpanded]   = useState(false)
  // True when the member reopened via the "Previous" control — jumps the
  // reopened quiz straight to the last question instead of the first.
  const [auditEditMode, setAuditEditMode]   = useState(false)
  const [completedAt, setCompletedAt]       = useState<string | null>(null)
  const [auditData, setAuditData]           = useState<AuditData | null>(null)
  const [showBreakdown, setShowBreakdown]   = useState(false)
  const auditCompleteRef = useRef<HTMLDivElement>(null)

  // Locked once the member has completed the Audit twice this week (the
  // original pass + one retake) — the card cannot be reopened again until
  // next Monday resets `auditAttempts` back to 0 via `getWeekKey()`.
  const auditLocked = auditAttempts >= 2

  useEffect(() => {
    const ws = loadWeekly()
    setIsBaseline(!hasCompletedFirstRealityCheck())
    setAuditDone(ws.auditDone)
    setAuditAttempts(ws.auditAttempts)
    setAuditAnswers(ws.auditAnswers)
    setCompletedAt(ws.completedAt)
    setAuditData(getAuditResults())
    setMounted(true)
  }, [])

  const markAuditDone = (_results: AuditData, answers: Record<number, number>) => {
    const attempts = Math.min(2, auditAttempts + 1)
    const now = new Date().toISOString()
    const next: WeeklyState = {
      weekKey: getWeekKey(),
      auditDone: true,
      auditAttempts: attempts,
      auditAnswers: answers,
      completedAt: now,
    }
    saveWeekly(next)
    // Persist First Reality Check™ completion forever so future visits switch to 7-day wording.
    if (isBaseline) markFirstRealityCheckComplete()
    setAuditDone(true)
    setAuditAttempts(attempts)
    setAuditAnswers(answers)
    setCompletedAt(now)
    setAuditExpanded(false)
    setAuditEditMode(false)
    setAuditData(getAuditResults())

    // The Audit card collapses from the full quiz down to a compact
    // "Completed" header in the same tick — a big height change that can
    // otherwise leave the browser's scroll position stranded above the fold.
    // Two-pass scroll (mirroring ActiveSpaceProvider's enterSpace()) brings
    // the member to the confirmation message once collapse + layout settle.
    const scrollToConfirmation = () => {
      auditCompleteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    requestAnimationFrame(() => requestAnimationFrame(scrollToConfirmation))
    setTimeout(scrollToConfirmation, 550)
  }

  /** Reopen the completed Audit to review answers (chevron) or jump straight to
   *  the last question to change one (Previous arrow) — disabled once locked. */
  const openAuditForReview = (editMode: boolean) => {
    if (auditLocked) return
    setAuditEditMode(editMode)
    setAuditExpanded((v) => (editMode ? true : !v))
  }

  const allDone = auditDone

  const lifeScore = auditData?.overallScore ?? null
  const realityScore = lifeScore

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const period = isBaseline ? "30 days" : "7 days"

  const cherryBlossomMessage = allDone
    ? "Your Work-Life Balance Audit is complete.\n\nNow use what you discovered to decide where your attention belongs this week."
    : isBaseline
    ? "There\u2019s nowhere to rush to.\n\nBefore you redesign your entry into the workweek, let\u2019s begin with a short reflection \u2014 your Work-Life Balance Audit\u2122.\n\nThe audit helps me understand how your life has been operating so I can guide you throughout your Work-Life Balance Business Day\u2122.\n\nComplete it once. We\u2019ll use it as the foundation for your Monday reflections and your experience inside Harmony Lane\u2122."
    : "There\u2019s nowhere to rush to.\n\nBefore you redesign your entry into the workweek, let\u2019s take a few moments to reflect on the past 7 days.\n\nEach Monday is an opportunity to celebrate your progress, learn from the previous week, and intentionally create the week ahead."

  if (!mounted) {
    return <div className="h-64 rounded-3xl bg-[#FDF8F5]" aria-hidden />
  }

  return (
    <section className="w-full space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-3xl border border-[#E8DFE2] bg-cover bg-center shadow-sm"
        style={{ backgroundImage: "url('/images/reality-check-workspace.png')" }}
      >
        {/* Soft light wash keeps the dark heading + body copy readable over the photo */}
        <div className="absolute inset-0 bg-white/72" aria-hidden />
        <div className="relative text-center space-y-3 px-6 py-10 sm:px-10 sm:py-12">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
            Reflection Space™
          </p>
          <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
            Take My Work-Life Balance Reality Check™
          </h2>
          <p className="font-sans text-sm text-[#4A3B41] max-w-xl mx-auto leading-relaxed">
            Before you manage your business, pause long enough to see what your current reality is telling you.
          </p>
          <p className="font-sans text-sm text-[#4A3B41] max-w-xl mx-auto leading-relaxed">
            Your Work-Life Balance Audit&trade; gives you the starting point. Your Reality Check helps you decide what deserves your attention this week.
          </p>
        </div>
      </div>

      {/* ── Full card wrapper ─────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-5">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-[#C0545A]" aria-hidden />
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
            Monday Ritual™ · {realityCheckSchedule?.timeLabel ?? "9:45–10:30 AM"}
          </p>
        </div>
        <p className="font-serif text-2xl font-semibold text-[#2E1F27] leading-snug">
          Use what you discovered in your Audit to decide where your attention belongs this week.
        </p>

        {/* ── Permission-giving intro ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-4">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
            You have permission to pause before you produce. There&apos;s nowhere to rush to — just a short
            reflection, one question at a time.
          </p>
        </div>

        {/* ── Step progress ribbon ────────────────────────────────────────── */}
        <StepRibbon
          steps={["Audit", "Reality Check"]}
          doneFlags={[auditDone, allDone]}
        />

        {/* ── Cherry Blossom coaching ──────────────────────────────────────── */}
        <CherryBlossomCoach message={cherryBlossomMessage} />
      </div>

      {/* ── Step 1 — Work-Life Balance Audit™ ──────────────────────────────── */}
      {/* Bespoke card — once done, shows its own top-right "Completed" /
          "Completed & Locked" indicator plus a chevron to reopen/collapse the
          quiz for review and a Previous arrow to jump straight to the last
          question and change an answer. The quiz body's visibility is driven by
          local `auditExpanded` state so collapsing it back down never causes a
          scroll-yanking layout jump. */}
      <div
        className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${
          auditDone ? "border-[#7FB069]/30 bg-[#F7FBF4]" : "border-[#E8DFE2] bg-white shadow-sm"
        }`}
      >
        <div className="w-full px-8 py-6 flex items-start gap-4">
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              auditDone ? "bg-[#7FB069] text-white" : "bg-[#E26C73]/15 text-[#C0545A]"
            }`}
            aria-hidden
          >
            {auditDone ? <CheckCircle2 className="h-4 w-4" /> : 1}
          </span>

          <div className="flex-1 min-w-0">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5860] mb-1">
              Step 1
            </p>
            <p className="font-serif text-xl font-semibold text-[#2E1F27] leading-snug">
              Work-Life Balance Audit™
            </p>
          </div>

          {/* Top-right: Audit Complete Indicator™ + reopen/edit controls */}
          {auditDone && (
            <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap ${
                  auditLocked ? "bg-black/10 text-[#6B5860]" : "bg-[#7FB069] text-white"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                {auditLocked ? "Completed & Locked" : "Completed"}
              </span>

              {!auditLocked && (
                <>
                  <button
                    type="button"
                    aria-label="Change an answer"
                    title="Previous — change an answer"
                    onClick={() => openAuditForReview(true)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDD5D8] text-[#6B5860] transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={auditExpanded ? "Collapse audit" : "Reopen audit"}
                    aria-expanded={auditExpanded}
                    title={auditExpanded ? "Collapse" : "Reopen"}
                    onClick={() => openAuditForReview(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDD5D8] text-[#6B5860] transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069]"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${auditExpanded ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {(!auditDone || auditExpanded) && (
          <div className="px-8 pb-8 pt-0 space-y-4 border-t border-black/[0.04]">
            <div className="pt-5 space-y-3">
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          {auditDone
            ? (auditEditMode
                ? "Use ← Previous to step back through your responses and change an answer. Retaking counts as your second and final attempt this week."
                : "Reviewing your saved responses from this week's audit.")
            : (<>Reflect on how you&apos;ve been living over the past <strong>{period}</strong>. This audit provides a snapshot of your overall work-life balance and helps you identify the areas of your life that may need more attention before the week begins.</>)}
        </p>

        <div className="rounded-2xl border border-[#E8DFE2] overflow-hidden">
          <WorkLifeBalanceAudit
            key={auditAttempts}
            assessmentWindow={isBaseline ? "30-day" : "7-day"}
            assessmentType={isBaseline ? "baseline_30_day" : "weekly_7_day"}
            initialAnswers={auditDone ? auditAnswers ?? undefined : undefined}
            startAtLastQuestion={auditDone && auditEditMode}
            onComplete={markAuditDone}
          />
        </div>

            </div>
          </div>
        )}
      </div>

      {/* ── Step 2 — Work-Life Balance Reality Check™ ──────────────────────── */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            ref={auditCompleteRef}
            key="complete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] p-8 space-y-6">
              <div className="text-center space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#5B835F]">
                  Step 2 — Your Work-Life Balance Reality Check™
                </p>
                <p className="font-serif text-xl font-semibold text-[#2E1F27]">
                  Here&apos;s what your reflection is telling you this week.
                </p>
              </div>

              {/* Real Reality Check score */}
              {realityScore !== null && (
                <div className="rounded-2xl border border-[#E8DFE2] bg-white px-6 py-6 space-y-5">
                  <div className="flex justify-center">
                    <ScoreDial label="Reality Check" score={realityScore} accent={realityColor(realityScore)} />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBreakdown((v) => !v)}
                    aria-expanded={showBreakdown}
                    className="w-full flex items-center justify-between rounded-xl border border-[#E8DFE2] bg-[#FAF8F9] px-4 py-3 font-sans text-sm font-semibold text-[#3A2E33] transition-colors hover:bg-[#F5EEF0]"
                  >
                    See Full Breakdown
                    <ChevronDown
                      className={`h-4 w-4 text-[#6B5860] transition-transform duration-300 ${showBreakdown ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>

                  <AnimatePresence>
                    {showBreakdown && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-1">
                          {auditData?.results.map((r) => (
                            <BreakdownRow key={`life-${r.category}`} label={r.label} score={r.percentage} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* This week's reflection */}
              <div className="rounded-2xl border border-[#E26C73]/20 bg-white px-6 py-6 space-y-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C0545A]">This Week&apos;s Reflection</p>
                <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">Notice what stands out from your Audit — and choose the one area that deserves your attention this week.</p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  Your reflections are saved to your{" "}
                  <Link href="/my-blueprint" className="font-semibold text-[#C0545A] underline underline-offset-2 hover:text-[#A8305A]">
                    My Blueprint™
                  </Link>
                  , and this space resets fresh next Monday.
                </p>
                <div className="pt-2 space-y-3 border-t border-[#E26C73]/10">
                  <ReflectionPoint
                    label="Your greatest strength this week"
                    text="You showed up. You created a protected time and space for reflection — and that discipline is the foundation of everything you&apos;re building."
                  />
                  <ReflectionPoint
                    label="One area that deserves more attention"
                    text="Notice which life areas scored lowest in your audit. That is where your operating system needs more intentional design this week."
                  />
                  <ReflectionPoint
                    label="One encouraging recommendation"
                    text="Use what you learned here to set one clear, simple intention for today&apos;s CEO Workspace™ session. One focused hour moves more than a scattered day."
                  />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CherryBlossomCoach({ message }: { message: string }) {
  // Split on double-newline so each paragraph renders separately.
  // The first paragraph is treated as the title (semibold serif).
  const paragraphs = message.split("\n\n").filter(Boolean)
  const [title, ...body] = paragraphs
  return (
    <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-6 py-5 flex gap-4 items-start">
      <div className="shrink-0 mt-0.5">
        <span className="text-xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
      </div>
      <div className="space-y-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
        {title && (
          <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">{title}</p>
        )}
        {body.map((para, i) => (
          <p key={i} className="font-sans text-sm text-[#3A2E33] leading-relaxed">{para}</p>
        ))}
      </div>
    </div>
  )
}

function ReflectionPoint({ label, text }: { label: string; text: string }) {
  return (
    <div className="space-y-0.5">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#C0545A]">{label}</p>
      <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">{text}</p>
    </div>
  )
}

/** Connected numbered-step progress ribbon — mirrors Morning GIV•EN's / Flex Time's step indicator. */
function StepRibbon({ steps, doneFlags }: { steps: string[]; doneFlags: boolean[] }) {
  return (
    <div className="flex items-center justify-center gap-2 px-2">
      {steps.map((label, i) => {
        const done = doneFlags[i]
        const isLast = i === steps.length - 1
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  done ? "bg-[#7FB069] text-white" : "bg-[#E8DFE2] text-[#6B5860]"
                }`}
                aria-hidden
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6B5860]">
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-px w-8 sm:w-14 -translate-y-2.5 ${done ? "bg-[#7FB069]/50" : "bg-[#E8DFE2]"}`} aria-hidden />
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Small ring-style score readout used in the completed Reality Check summary. */
function ScoreDial({ label, score, accent }: { label: string; score: number; accent: string }) {
  return (
    <div className="space-y-1.5">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 font-sans text-lg font-bold"
        style={{ borderColor: accent, color: accent }}
      >
        {score}
      </div>
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860] text-center">{label}</p>
    </div>
  )
}

/** Category breakdown row shown inside the "See Full Breakdown" disclosure. */
function BreakdownRow({ label, score }: { label: string; score: number }) {
  const accent = "#E26C73"
  return (
    <div className="rounded-xl border border-[#E8DFE2] bg-[#FAF8F9] px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ backgroundColor: accent + "15", color: accent }}
          >
            Life
          </span>
          <p className="font-sans text-sm font-semibold text-[#2E1F27]">{label}</p>
        </div>
        <span className="font-sans text-sm font-bold tabular-nums" style={{ color: accent }}>
          {score}/100
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#E8DFE2] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: accent }} />
      </div>
    </div>
  )
}
