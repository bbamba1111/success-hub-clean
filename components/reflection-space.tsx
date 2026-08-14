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
import { CheckCircle2, Lock, Sparkles } from "lucide-react"
import { useActiveSpace } from "@/components/active-space-provider"
import { SCHEDULE_BY_ID } from "@/operating-engine/config/schedule"

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

// ─── Component ───────────────────────────────────────────────────────────────

export function ReflectionSpace() {
  const [mounted, setMounted]               = useState(false)
  const [isBaseline, setIsBaseline]         = useState(true)
  const [auditDone, setAuditDone]           = useState(false)
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [completedAt, setCompletedAt]       = useState<string | null>(null)
  const [activeStep, setActiveStep]         = useState<1 | 2 | 3>(1)
  const activeSpace = useActiveSpace()

  useEffect(() => {
    const ws = loadWeekly()
    setIsBaseline(!hasCompletedFirstRealityCheck())
    setAuditDone(ws.auditDone)
    setAssessmentDone(ws.assessmentDone)
    setCompletedAt(ws.completedAt)

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
    setTimeout(() => setActiveStep(3), 500)
  }

  const bothDone = auditDone && assessmentDone

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const period = isBaseline ? "30 days" : "7 days"

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const cherryBlossomMessage = bothDone
    ? "Reflection Complete\n\nYou have just created something many founders never do.\n\nYou created a protected time and space to reflect on both your life and your business before reacting to the week ahead.\n\nMost founders begin Monday by opening their inbox. You began by creating awareness.\n\nThat single decision changes how the rest of your week unfolds."
    : auditDone
    ? "Life Reflection Complete\n\nThank you for taking the time to reflect on your life.\n\nYour responses have created a clear picture of how your life has been operating over the past " + period + ".\n\nNext, we\u2019ll reflect on how your business has been operating during that same period so we can bring both perspectives together in your Work-Life Balance Reality Check\u2122."
    : isBaseline
    ? "Welcome to Reflection Space\u2122.\n\nBefore you redesign your entry into the workweek, let\u2019s begin with two short reflections \u2014 your Work-Life Balance Audit\u2122 and your Entrepreneur Success Assessment\u2122.\n\nThe audit helps me understand how your life has been operating, and the assessment helps me understand how your business has been operating, so I can guide you throughout your Work-Life Balance Business Day\u2122.\n\nComplete both once. We\u2019ll use them as the foundation for your Monday reflections and your experience inside Harmony Lane\u2122."
    : "Welcome back.\n\nBefore you redesign your entry into the workweek, let\u2019s take a few moments to reflect on the past 7 days.\n\nEach Monday is an opportunity to celebrate your progress, learn from the previous week, and intentionally create the week ahead."

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
          A protected time and space to reflect on your life and your business before you redesign your entry into the workweek.
        </h2>
      </div>

      {/* ── Cherry Blossom coaching ─────────────────────────────────────────── */}
      <CherryBlossomCoach message={cherryBlossomMessage} />

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
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/audit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E26C73] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C0545A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]"
          >
            Begin Work-Life Balance Audit™
          </Link>
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
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/entrepreneur-success-assessment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E26C73] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C0545A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]"
          >
            Begin Entrepreneur Success Assessment™
          </Link>
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
                  The next protected time and space — <strong>Work-Life Balance Debrief™</strong> — is ready for you below.
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

            {/* ── Next Space™ handoff ─────────────────────────────────────── */}
            <div className="rounded-3xl border border-[#C8A4A7]/30 bg-white overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#F5EEF0] to-[#EEF3EC] px-8 py-6 flex flex-col gap-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
                  Next Space™
                </p>
                <p className="font-serif text-2xl font-semibold text-[#2E1F27]">Work-Life Balance Debrief™</p>
                <p className="font-sans text-sm font-medium text-[#5A4A52]">A protected pause before Movement Window™</p>
              </div>

              <div className="px-8 py-6 space-y-6">
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  A protected time and space to sit with what surfaced here — before you move into today&apos;s Movement Window™.
                </p>

                <div className="rounded-2xl border border-[#7FB069]/20 bg-[#F7FBF4] px-6 py-5 text-center space-y-2">
                  <div className="flex justify-center">
                    <span className="text-4xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
                  </div>
                  <p className="font-serif text-base font-semibold text-[#5B835F]">
                    Ready when you are.
                  </p>
                  <p className="font-sans text-xs text-[#6B5860]">
                    Carry these insights straight into the Debrief™.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      activeSpace?.enterSpace("monday-debrief", SCHEDULE_BY_ID["monday-debrief"].sectionId)
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#C13B6B] px-6 py-2.5 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-colors hover:bg-[#A8305A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B]/40 focus-visible:ring-offset-2"
                  >
                    <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                    Enter Debrief Space™
                  </button>
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
