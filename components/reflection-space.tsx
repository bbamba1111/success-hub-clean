"use client"

/**
 * ReflectionSpace™
 *
 * The guided experience inside Make Time For More On Mondays™.
 *
 * Step 1 — Work-Life Balance Audit™
 * Step 2 — Entrepreneur Success Assessment™
 * Step 3 — Work-Life Balance Reality Check™ → direct hand-off into Debrief Space™
 *
 * Business Context does NOT appear here. It belongs exclusively in Measure Monthly™.
 * Weekly state is keyed by the Monday of the current week so it resets automatically.
 */

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, ChevronDown, Clock, Lock } from "lucide-react"
import { getAuditResults, type AuditData } from "@/utils/audit-storage"
import { getEsaResults } from "@/lib/entrepreneur-success/esa-storage"
import type { EsaResults } from "@/lib/entrepreneur-success/types"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import EntrepreneurSuccessAssessment from "@/components/entrepreneur-success/entrepreneur-success-assessment"

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
  assessmentDone: boolean
  completedAt: string | null
}

function loadWeekly(): WeeklyState {
  const current = getWeekKey()
  try {
    const raw = localStorage.getItem(WEEKLY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WeeklyState
      if (parsed.weekKey === current) return parsed
    }
  } catch { /* ignore */ }
  return { weekKey: current, auditDone: false, assessmentDone: false, completedAt: null }
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
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [completedAt, setCompletedAt]       = useState<string | null>(null)
  const [activeStep, setActiveStep]         = useState<1 | 2 | 3>(1)
  const [auditData, setAuditData]           = useState<AuditData | null>(null)
  const [esaData, setEsaData]               = useState<EsaResults | null>(null)
  const [showBreakdown, setShowBreakdown]   = useState(false)

  useEffect(() => {
    const ws = loadWeekly()
    setIsBaseline(!hasCompletedFirstRealityCheck())
    setAuditDone(ws.auditDone)
    setAssessmentDone(ws.assessmentDone)
    setCompletedAt(ws.completedAt)
    setAuditData(getAuditResults())
    setEsaData(getEsaResults())

    if (ws.auditDone && ws.assessmentDone) {
      setActiveStep(3)
    } else if (ws.auditDone) {
      setActiveStep(2)
    } else {
      setActiveStep(1)
    }
    setMounted(true)
  }, [])

  const markAuditDone = () => {
    const next: WeeklyState = { weekKey: getWeekKey(), auditDone: true, assessmentDone, completedAt }
    saveWeekly(next)
    setAuditDone(true)
    setAuditData(getAuditResults())
    setTimeout(() => setActiveStep(2), 500)
  }

  const markAssessmentDone = () => {
    const now = new Date().toISOString()
    const next: WeeklyState = { weekKey: getWeekKey(), auditDone, assessmentDone: true, completedAt: now }
    saveWeekly(next)
    // Persist First Reality Check™ completion forever so future visits switch to 7-day wording
    if (isBaseline) markFirstRealityCheckComplete()
    setAssessmentDone(true)
    setCompletedAt(now)
    setEsaData(getEsaResults())
    setTimeout(() => setActiveStep(3), 500)
  }

  const bothDone = auditDone && assessmentDone

  const lifeScore = auditData?.overallScore ?? null
  const businessScore = esaData?.overallScore ?? null
  const realityScore =
    lifeScore !== null && businessScore !== null ? Math.round((lifeScore + businessScore) / 2) : null

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const period = isBaseline ? "30 days" : "7 days"

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const cherryBlossomMessage = bothDone
    ? "Reflection Complete\n\nYou have just created something many founders never do.\n\nYou created a protected time and space to reflect on both your life and your business before reacting to the week ahead.\n\nMost founders begin Monday by opening their inbox. You began by creating awareness.\n\nThat single decision changes how the rest of your week unfolds."
    : auditDone
    ? "Life Reflection Complete\n\nThank you for taking the time to reflect on your life.\n\nYour responses have created a clear picture of how your life has been operating over the past " + period + ".\n\nNext, we\u2019ll reflect on how your business has been operating during that same period so we can bring both perspectives together in your Work-Life Balance Reality Check\u2122."
    : isBaseline
    ? "There\u2019s nowhere to rush to.\n\nBefore you redesign your entry into the workweek, let\u2019s begin with two short reflections \u2014 your Work-Life Balance Audit\u2122 and your Entrepreneur Success Assessment\u2122.\n\nThe audit helps me understand how your life has been operating, and the assessment helps me understand how your business has been operating, so I can guide you throughout your Work-Life Balance Business Day\u2122.\n\nComplete both once. We\u2019ll use them as the foundation for your Monday reflections and your experience inside Harmony Lane\u2122."
    : "There\u2019s nowhere to rush to.\n\nBefore you redesign your entry into the workweek, let\u2019s take a few moments to reflect on the past 7 days.\n\nEach Monday is an opportunity to celebrate your progress, learn from the previous week, and intentionally create the week ahead."

  if (!mounted) {
    return <div className="h-64 rounded-3xl bg-[#FDF8F5]" aria-hidden />
  }

  return (
    <section className="w-full space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pb-2">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
          Reflection Space™
        </p>
        <h2 className="font-serif text-3xl font-semibold text-[#2E1F27] text-balance leading-tight">
          Take My Work-Life Balance Reality Check™
        </h2>
        <p className="font-sans text-sm text-[#6B5860] max-w-xl mx-auto leading-relaxed">
          There&apos;s nowhere to rush to. A protected time and space to reflect on your life and your business before you redesign your entry into the workweek.
        </p>
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
          Take My Work-Life Balance Reality Check™
        </p>

        {/* ── Permission-giving intro ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-4">
          <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">
            You have permission to pause before you produce. There&apos;s nowhere to rush to — just two short
            reflections, one at a time.
          </p>
        </div>

        {/* ── Step progress ribbon ────────────────────────────────────────── */}
        <StepRibbon
          steps={["Audit", "Assessment", "Reality Check"]}
          doneFlags={[auditDone, assessmentDone, bothDone]}
        />

        {/* ── Cherry Blossom coaching ──────────────────────────────────────── */}
        <CherryBlossomCoach message={cherryBlossomMessage} />
      </div>

      {/* ── Step 1 — Work-Life Balance Audit™ ──────────────────────────────── */}
      <StepCard
        stepNumber={1}
        label="Activity 1"
        title="Work-Life Balance Audit™"
        done={auditDone}
        active={activeStep === 1}
        onToggle={() => setActiveStep(activeStep === 1 ? (auditDone ? 2 : 1) : 1)}
      >
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          Reflect on how you&apos;ve been living over the past <strong>{period}</strong>. This audit provides a snapshot of your overall work-life balance and helps you identify the areas of your life that may need more attention before the week begins.
        </p>

        <div className="rounded-2xl border border-[#E8DFE2] overflow-hidden">
          <WorkLifeBalanceAudit
            assessmentWindow={isBaseline ? "30-day" : "7-day"}
            assessmentType={isBaseline ? "baseline_30_day" : "weekly_7_day"}
            onComplete={markAuditDone}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 bg-[#E8DFE2]" aria-hidden />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6B5860]">or</span>
          <div className="h-px flex-1 bg-[#E8DFE2]" aria-hidden />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={markAuditDone}
            disabled={auditDone}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069] ${
              auditDone
                ? "border-[#7FB069] bg-[#7FB069]/10 text-[#5B835F] cursor-default"
                : "border-[#7FB069]/40 bg-white text-[#5B835F] hover:bg-[#7FB069]/10"
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${auditDone ? "text-[#7FB069]" : "text-[#7FB069]/50"}`} />
            {auditDone ? "Work-Life Balance Audit™ Complete" : "Mark Audit Complete"}
          </button>
        </div>
      </StepCard>

      {/* ── Step 2 — Entrepreneur Success Assessment™ ──────────────────────── */}
      <StepCard
        stepNumber={2}
        label="Activity 2"
        title="Entrepreneur Success Assessment™"
        done={assessmentDone}
        active={activeStep === 2}
        locked={!auditDone}
        onToggle={() => {
          if (!auditDone) return
          setActiveStep(activeStep === 2 ? (assessmentDone ? 3 : 2) : 2)
        }}
      >
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          Now reflect on how your business has been operating over the past <strong>{period}</strong>. This assessment helps you understand whether your business systems, leadership, and daily practices are supporting the life you&apos;re intentionally creating.
        </p>

        <div className="rounded-2xl border border-[#E8DFE2] overflow-hidden">
          <EntrepreneurSuccessAssessment onComplete={markAssessmentDone} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="h-px flex-1 bg-[#E8DFE2]" aria-hidden />
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#6B5860]">or</span>
          <div className="h-px flex-1 bg-[#E8DFE2]" aria-hidden />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={markAssessmentDone}
            disabled={assessmentDone}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FB069] ${
              assessmentDone
                ? "border-[#7FB069] bg-[#7FB069]/10 text-[#5B835F] cursor-default"
                : "border-[#7FB069]/40 bg-white text-[#5B835F] hover:bg-[#7FB069]/10"
            }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${assessmentDone ? "text-[#7FB069]" : "text-[#7FB069]/50"}`} />
            {assessmentDone ? "Entrepreneur Success Assessment™ Complete" : "Mark Assessment Complete"}
          </button>
        </div>
      </StepCard>

      {/* ── Step 4 — Work-Life Balance Reality Check™ ──────────────────────── */}
      <AnimatePresence>
        {bothDone && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-[#7FB069]/25 bg-[#F7FBF4] p-8 space-y-6">
              <div className="text-center space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#5B835F]">
                  Activity 3 — Your Work-Life Balance Reality Check™
                </p>
                <p className="font-serif text-xl font-semibold text-[#2E1F27]">
                  Your life and business reflections have now been brought together into one personalized Work-Life Balance Reality Check™.
                </p>
              </div>

              {/* Real Reality Check scores */}
              {realityScore !== null && (
                <div className="rounded-2xl border border-[#E8DFE2] bg-white px-6 py-6 space-y-5">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <ScoreDial label="Life" score={lifeScore ?? 0} accent="#E26C73" />
                    <ScoreDial label="Reality Check" score={realityScore} accent={realityColor(realityScore)} />
                    <ScoreDial label="Business" score={businessScore ?? 0} accent="#5B835F" />
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
                            <BreakdownRow key={`life-${r.category}`} source="Life" label={r.label} score={r.percentage} />
                          ))}
                          {esaData?.pillarScores.map((p) => (
                            <BreakdownRow key={`biz-${p.pillarId}`} source="Business" label={p.pillarName} score={p.percentage} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cherry Blossom Reality Check response */}
              <div className="rounded-2xl border border-[#E26C73]/20 bg-white px-6 py-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
                </div>
                <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">Take a few moments to review your insights and consider where you&apos;d like to focus your attention this week.</p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  Rather than reacting to whatever the week brings, you now have the clarity to intentionally redesign your entry into the workweek.
                </p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  These scores are now saved to your{" "}
                  <Link href="/harmony-blueprint" className="font-semibold text-[#C0545A] underline underline-offset-2 hover:text-[#A8305A]">
                    My Work-Life Harmony Blueprint™
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

              <div className="space-y-2">
                <CompletionBadge label="Life Reflection Complete" />
                <CompletionBadge label="Business Reflection Complete" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StepCardProps {
  stepNumber: number
  label: string
  title: string
  done: boolean
  active: boolean
  locked?: boolean
  onToggle: () => void
  children: React.ReactNode
}

function StepCard({
  stepNumber,
  label,
  title,
  done,
  active,
  locked = false,
  onToggle,
  children,
}: StepCardProps) {
  const accent = {
    activeBg: "bg-[#E26C73]/15",
    activeText: "text-[#C0545A]",
    doneBg:    "bg-[#7FB069]",
  }

  return (
    <div
      className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${
        done
          ? "border-[#7FB069]/30 bg-[#F7FBF4]"
          : locked
          ? "border-[#DDD5D8]/60 bg-[#FAF8F9]"
          : "border-[#E8DFE2] bg-white shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        disabled={locked}
        aria-expanded={active}
        className={`w-full text-left px-8 py-6 flex items-start gap-4 transition-colors ${
          locked ? "cursor-not-allowed opacity-50" : "hover:bg-black/[0.015] cursor-pointer"
        }`}
      >
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
            done
              ? `${accent.doneBg} text-white`
              : locked
              ? "bg-[#DDD5D8] text-white"
              : `${accent.activeBg} ${accent.activeText}`
          }`}
          aria-hidden
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : stepNumber}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5860] mb-1">
            Step {stepNumber} — {label}
          </p>
          <p className="font-serif text-xl font-semibold text-[#2E1F27] leading-snug">{title}</p>
          {done && (
            <span className="inline-flex items-center gap-1.5 mt-2 font-sans text-xs font-semibold text-[#5B835F]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {title} Complete
            </span>
          )}
        </div>

        {locked && <Lock className="h-4 w-4 shrink-0 text-[#B0A0A8] mt-1" aria-hidden />}
        {!locked && !done && (
          <span
            className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-[#DDD5D8] flex items-center justify-center transition-transform duration-300 ${active ? "rotate-180" : ""}`}
            aria-hidden
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-[#B0A0A8]">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </button>

      {active && !locked && (
        <div className="px-8 pb-8 pt-0 space-y-4 border-t border-black/[0.04]">
          <div className="pt-5 space-y-3">{children}</div>
        </div>
      )}
    </div>
  )
}

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

function CompletionBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#7FB069]/25 bg-white px-5 py-3.5">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-[#7FB069]" aria-hidden />
      <span className="font-sans text-sm font-semibold text-[#3A2E33]">{label}</span>
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
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#6B5860]">{label}</p>
    </div>
  )
}

/** Category/pillar breakdown row shown inside the "See Full Breakdown" disclosure. */
function BreakdownRow({ source, label, score }: { source: "Life" | "Business"; label: string; score: number }) {
  const accent = source === "Life" ? "#E26C73" : "#5B835F"
  return (
    <div className="rounded-xl border border-[#E8DFE2] bg-[#FAF8F9] px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{ backgroundColor: accent + "15", color: accent }}
          >
            {source}
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
