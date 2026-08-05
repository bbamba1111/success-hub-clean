"use client"

/**
 * ReflectionSpace™
 *
 * The guided experience that opens Make Time For More On Mondays™.
 *
 * Step 0 — Founder & Business Profile™ (first Monday only, one-time)
 * Step 1 — Work-Life Balance Audit™
 * Step 2 — Entrepreneur Success Assessment™
 * Step 3 — Reflection Complete™ + Alignment Space™ countdown
 *
 * State is persisted to localStorage. Step 0 is keyed independently
 * (founderProfileDone) so it never re-appears after the first Monday.
 * Steps 1–3 are keyed by the Monday of the current week so they reset
 * automatically each week.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Lock, User } from "lucide-react"

// ─── Storage ─────────────────────────────────────────────────────────────────

const STEP0_KEY   = "founderProfileDone"       // persists forever
const WEEKLY_KEY  = "reflectionSpace_v1"       // resets each Monday

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

function loadFounderDone(): boolean {
  try { return localStorage.getItem(STEP0_KEY) === "true" } catch { return false }
}

function saveFounderDone() {
  try { localStorage.setItem(STEP0_KEY, "true") } catch { /* ignore */ }
}

// ─── Countdown to 9:45 AM ────────────────────────────────────────────────────

function getSecondsUntil945(): number {
  const now = new Date()
  const target = new Date(now)
  target.setHours(9, 45, 0, 0)
  const diff = Math.floor((target.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReflectionSpace() {
  const [mounted, setMounted]               = useState(false)
  const [founderDone, setFounderDone]       = useState(true)  // true = skip Step 0
  const [auditDone, setAuditDone]           = useState(false)
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [completedAt, setCompletedAt]       = useState<string | null>(null)
  const [activeStep, setActiveStep]         = useState<0 | 1 | 2 | 3>(1)
  const [secondsLeft, setSecondsLeft]       = useState(0)
  const [unlocked, setUnlocked]             = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const fd = loadFounderDone()
    const ws = loadWeekly()
    setFounderDone(fd)
    setAuditDone(ws.auditDone)
    setAssessmentDone(ws.assessmentDone)
    setCompletedAt(ws.completedAt)

    // Determine the correct starting step
    if (ws.auditDone && ws.assessmentDone) {
      setActiveStep(3)
    } else if (ws.auditDone) {
      setActiveStep(2)
    } else if (!fd) {
      setActiveStep(0)   // first-ever Monday — show Profile step first
    } else {
      setActiveStep(1)
    }
    setMounted(true)
  }, [])

  // Countdown tick
  useEffect(() => {
    if (!mounted) return
    const tick = () => {
      const s = getSecondsUntil945()
      setSecondsLeft(s)
      if (s === 0) setUnlocked(true)
    }
    tick()
    timerRef.current = setInterval(tick, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [mounted])

  const markFounderDone = () => {
    saveFounderDone()
    setFounderDone(true)
    setTimeout(() => setActiveStep(1), 400)
  }

  const markAuditDone = () => {
    const next: WeeklyState = { weekKey: getWeekKey(), auditDone: true, assessmentDone, completedAt }
    setAuditDone(true)
    saveWeekly(next)
    setTimeout(() => setActiveStep(2), 500)
  }

  const markAssessmentDone = () => {
    const now = new Date().toISOString()
    const next: WeeklyState = { weekKey: getWeekKey(), auditDone, assessmentDone: true, completedAt: now }
    setAssessmentDone(true)
    setCompletedAt(now)
    saveWeekly(next)
    setTimeout(() => setActiveStep(3), 500)
  }

  const bothDone = auditDone && assessmentDone
  // Step 1 is locked until founder profile is done (or it was already done before)
  const step1Locked = !founderDone

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
        <p className="font-sans text-sm text-[#6B5860] max-w-xl mx-auto leading-relaxed text-pretty">
          {!founderDone
            ? "Welcome to your first Make Time For More On Mondays™. Begin by completing your Founder & Business Profile™ so Harmony Lane™ can personalize everything that follows."
            : "Complete your Work-Life Balance Audit™ and Entrepreneur Success Assessment™ to receive your personalized Work-Life Balance Reality Check™. The clarity you gain here becomes the foundation for everything that follows today."}
        </p>
      </div>

      {/* ── Cherry Blossom coaching ─────────────────────────────────────────── */}
      <CherryBlossomCoach
        message={
          bothDone
            ? "Excellent. You now have the clarity needed to intentionally redesign your entry into the workweek."
            : assessmentDone
            ? "Wonderful. Your reflections are complete."
            : auditDone
            ? "Wonderful. Now let's reflect on your business."
            : !founderDone
            ? "Welcome. Let's begin by building your Founder & Business Profile™ so I can personalize your entire Harmony Lane™ experience."
            : "Welcome to Reflection Space™. Let's begin by reflecting on your life before we redesign your entry into the workweek."
        }
      />

      {/* ── Step 0 — Founder & Business Profile™ (first Monday only) ───────── */}
      {!founderDone && (
        <StepCard
          stepNumber={0}
          label="First Monday — One Time Only"
          title="Founder & Business Profile™"
          done={founderDone}
          active={activeStep === 0}
          onToggle={() => setActiveStep(activeStep === 0 ? 1 : 0)}
          accentColor="gold"
        >
          <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
            This is your first Monday inside Harmony Lane™. Before we begin your weekly reflection, take 10–15 minutes to complete your Founder & Business Profile™.
          </p>
          <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
            This is a one-time step. Your profile tells Cherry Blossom™ who you are, what you&apos;re building, and what matters most — so every recommendation you receive is made specifically for you.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/founder-profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#8B6914] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <User className="h-4 w-4" />
              Complete My Founder & Business Profile™
            </Link>
            <button
              onClick={markFounderDone}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A84C]/40 bg-white px-6 py-3 font-sans text-sm font-semibold text-[#8B6914] transition-colors hover:bg-[#C9A84C]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
            >
              <CheckCircle2 className="h-4 w-4 text-[#C9A84C]/60" />
              I&apos;ve Completed My Profile — Continue to Reflection
            </button>
          </div>
        </StepCard>
      )}

      {/* ── Step 1 — Work-Life Balance Audit™ ──────────────────────────────── */}
      <StepCard
        stepNumber={1}
        label="Begin With Your Life"
        title="Work-Life Balance Audit™"
        done={auditDone}
        active={activeStep === 1}
        locked={step1Locked}
        onToggle={() => {
          if (step1Locked) return
          setActiveStep(activeStep === 1 ? (auditDone ? 2 : 1) : 1)
        }}
      >
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          Before you redesign your workweek, begin by reflecting on your life.
        </p>
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          The Work-Life Balance Audit™ helps you understand how consistently you&apos;ve honored what matters most across 15 areas of your life over the past 30 days.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/audit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E26C73] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C0545A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]"
          >
            Start Work-Life Balance Audit™
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
        label="Now Reflect On Your Business"
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
          Now reflect on how your business has been operating over the past 30 days.
        </p>
        <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
          Discover whether your business is supporting the life you want — or quietly pulling you back into hustle culture.
        </p>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/entrepreneur-success-assessment"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E26C73] px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#C0545A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E26C73]"
          >
            Start Entrepreneur Success Assessment™
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

      {/* ── Step 3 — Reflection Complete™ ──────────────────────────────────── */}
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
              <div className="text-center space-y-2">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#5B835F]">
                  Reflection Complete™
                </p>
                <p className="font-serif text-xl font-semibold text-[#2E1F27]">
                  Your Work-Life Balance Reality Check™ is complete.
                </p>
              </div>

              <div className="rounded-2xl border border-[#E26C73]/20 bg-white px-6 py-5 space-y-3">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
                <p className="font-serif text-base text-[#2E1F27] font-semibold leading-snug">Wonderful.</p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  You&apos;ve created a protected time and space to reflect on both your life and your business before redesigning your entry into the workweek.
                </p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  Awareness creates clarity. Clarity creates intentional choices.
                </p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  You&apos;re now ready to begin the rest of your Work-Life Balance Business Day™.
                </p>
              </div>

              <div className="space-y-2">
                <CompletionBadge label="Life Reflection Complete" />
                <CompletionBadge label="Business Reflection Complete" />
              </div>
            </div>

            {/* ── Alignment Space™ preview ──────────────────────────────── */}
            <div className="rounded-3xl border border-[#C8A4A7]/30 bg-white overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[#F5EEF0] to-[#EEF3EC] px-8 py-6 flex flex-col gap-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#C0545A]">
                  Next Space™
                </p>
                <p className="font-serif text-2xl font-semibold text-[#2E1F27]">Alignment Space™</p>
                <p className="font-sans text-sm font-medium text-[#5A4A52]">Morning GIV&bull;EN™ opens at 9:45 AM</p>
              </div>

              <div className="px-8 py-6 space-y-6">
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  A protected time and space to align your mind, body, spirit, and intentions before beginning your day.
                </p>

                <div className="rounded-2xl border border-[#7FB069]/20 bg-[#F7FBF4] px-6 py-5 text-center space-y-2">
                  {unlocked ? (
                    <>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="flex justify-center"
                      >
                        <span className="text-4xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-serif text-base font-semibold text-[#5B835F]"
                      >
                        Alignment Space™ is now open.
                      </motion.p>
                      <p className="font-sans text-xs text-[#6B5860]">
                        Morning GIV&bull;EN™ has begun. Enter the space.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Lock className="h-5 w-5 text-[#C0545A]/60" aria-hidden />
                      </div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#C0545A]/80">
                        Opens at 9:45 AM
                      </p>
                      <p className="font-sans text-xs text-[#6B5860]">Alignment Space™ opens in</p>
                      <p
                        className="font-mono text-4xl font-bold text-[#2E1F27] tabular-nums"
                        aria-live="polite"
                        aria-label={`${formatCountdown(secondsLeft)} until Alignment Space opens`}
                      >
                        {formatCountdown(secondsLeft)}
                      </p>
                    </>
                  )}
                </div>

                {!unlocked && (
                  <div className="space-y-3">
                    <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#5A4A52]">
                      While you wait...
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Review your Reality Check™ insights.",
                        "Fill your water bottle.",
                        "Grab your journal.",
                        "Find a quiet place.",
                        "Join the live Zoom room if participating with the community.",
                        "Take a few slow breaths before Morning GIV\u2022EN™ begins.",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E26C73]/60" aria-hidden />
                          <span className="font-sans text-sm text-[#5A4A52] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-sans text-xs text-[#6B5860] leading-relaxed pt-1">
                      The waiting period is intentional. Members are honoring a protected time and space — not waiting for software.
                    </p>
                  </div>
                )}
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
  accentColor?: "coral" | "gold"
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
  accentColor = "coral",
}: StepCardProps) {
  const accent = {
    coral: {
      activeBg: "bg-[#E26C73]/15",
      activeText: "text-[#C0545A]",
      doneBg: "bg-[#7FB069]",
    },
    gold: {
      activeBg: "bg-[#C9A84C]/15",
      activeText: "text-[#8B6914]",
      doneBg: "bg-[#C9A84C]",
    },
  }[accentColor]

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
          {done ? <CheckCircle2 className="h-4 w-4" /> : stepNumber === 0 ? <User className="h-4 w-4" /> : stepNumber}
        </span>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#6B5860] mb-1">
            {stepNumber === 0 ? label : `Step ${stepNumber} — ${label}`}
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
  return (
    <div className="rounded-2xl border border-[#E26C73]/20 bg-[#FDF8F5] px-6 py-5 flex gap-4 items-start">
      <div className="shrink-0 mt-0.5">
        <span className="text-xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
      </div>
      <div className="space-y-1">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
        <p className="font-sans text-sm text-[#3A2E33] leading-relaxed">{message}</p>
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
