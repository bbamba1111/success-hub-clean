"use client"

/**
 * ReflectionSpace™
 *
 * The guided experience inside Make Time For More On Mondays™.
 *
 * Step 1 — Founder Snapshot™      (display-only, always shown first)
 * Step 2 — Work-Life Balance Audit™
 * Step 3 — Entrepreneur Success Assessment™
 * Step 4 — Work-Life Balance Reality Check™ + Alignment Space™ countdown
 *
 * Business Context does NOT appear here. It belongs exclusively in Measure Monthly™.
 * Weekly state is keyed by the Monday of the current week so it resets automatically.
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Lock, User } from "lucide-react"

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
  snapshotDone: boolean
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
  return { weekKey: current, snapshotDone: false, auditDone: false, assessmentDone: false, completedAt: null }
}

function saveWeekly(s: WeeklyState) {
  try { localStorage.setItem(WEEKLY_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

// ─── Founder profile reader ──────────────────────────────────────────────────

interface FounderSnapshot {
  name: string
  businessName: string
  currentFocus: string
  quarterlyIntention: string
}

function loadFounderSnapshot(): FounderSnapshot {
  try {
    const raw = localStorage.getItem("founderProfile")
    if (raw) {
      const p = JSON.parse(raw)
      return {
        name: p.firstName ? `${p.firstName}${p.lastName ? " " + p.lastName : ""}` : (p.name ?? ""),
        businessName: p.businessName ?? "",
        currentFocus: p.currentFocus ?? p.primaryOffer ?? "",
        quarterlyIntention: p.quarterlyIntention ?? p.quarterlyGoal ?? "",
      }
    }
  } catch { /* ignore */ }
  return { name: "", businessName: "", currentFocus: "", quarterlyIntention: "" }
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
  const [isBaseline, setIsBaseline]         = useState(true)
  const [snapshot, setSnapshot]             = useState<FounderSnapshot>({ name: "", businessName: "", currentFocus: "", quarterlyIntention: "" })
  const [snapshotDone, setSnapshotDone]     = useState(false)
  const [auditDone, setAuditDone]           = useState(false)
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [completedAt, setCompletedAt]       = useState<string | null>(null)
  const [activeStep, setActiveStep]         = useState<1 | 2 | 3 | 4>(1)
  const [secondsLeft, setSecondsLeft]       = useState(0)
  const [unlocked, setUnlocked]             = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const ws = loadWeekly()
    const fp = loadFounderSnapshot()
    setIsBaseline(!hasCompletedFirstRealityCheck())
    setSnapshot(fp)
    setSnapshotDone(ws.snapshotDone)
    setAuditDone(ws.auditDone)
    setAssessmentDone(ws.assessmentDone)
    setCompletedAt(ws.completedAt)

    if (ws.auditDone && ws.assessmentDone) {
      setActiveStep(4)
    } else if (ws.auditDone) {
      setActiveStep(3)
    } else if (ws.snapshotDone) {
      setActiveStep(2)
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

  const markSnapshotDone = () => {
    const next: WeeklyState = { weekKey: getWeekKey(), snapshotDone: true, auditDone, assessmentDone, completedAt }
    saveWeekly(next)
    setSnapshotDone(true)
    setTimeout(() => setActiveStep(2), 400)
  }

  const markAuditDone = () => {
    const next: WeeklyState = { weekKey: getWeekKey(), snapshotDone, auditDone: true, assessmentDone, completedAt }
    saveWeekly(next)
    setAuditDone(true)
    setTimeout(() => setActiveStep(3), 500)
  }

  const markAssessmentDone = () => {
    const now = new Date().toISOString()
    const next: WeeklyState = { weekKey: getWeekKey(), snapshotDone, auditDone, assessmentDone: true, completedAt: now }
    saveWeekly(next)
    // Persist First Reality Check™ completion forever so future visits switch to 7-day wording
    if (isBaseline) markFirstRealityCheckComplete()
    setAssessmentDone(true)
    setCompletedAt(now)
    setTimeout(() => setActiveStep(4), 500)
  }

  const bothDone = auditDone && assessmentDone

  // Cherry Blossom™ — message changes by step and whether this is the First Reality Check™
  const period = isBaseline ? "30 days" : "7 days"

  // Pre-activity messages (shown before audit begins — same for both first-visit and returning)
  const preActivityMessage = isBaseline
    ? "Welcome to Reflection Space\u2122.\n\nBefore you redesign your entry into the workweek, let\u2019s create a protected time and space to reflect on your life and your business.\n\nBecause this is your first Reality Check\u2122, we\u2019ll look back over the past 30 days to create a meaningful starting point for your journey.\n\nFuture Reality Checks\u2122 will reflect on the past 7 days, allowing you to celebrate your progress and intentionally improve one week at a time."
    : "Welcome back.\n\nBefore you redesign your entry into the workweek, let\u2019s take a few moments to reflect on the past 7 days.\n\nEach Monday is an opportunity to celebrate your progress, learn from the previous week, and intentionally create the week ahead."

  const cherryBlossomMessage = bothDone
    ? "Reflection Complete\n\nYou\u2019ve taken the time to pause before reacting to the week ahead.\n\nThat awareness is the first step toward intentionally redesigning your entry into the workweek.\n\nYour next protected time and space \u2014 Alignment Space\u2122 (Morning GIV\u2022EN\u2122) \u2014 will open at its scheduled time."
    : auditDone
    ? "Business Reflection Complete\n\nWonderful.\n\nYou\u2019ve now reflected on both your life and your business.\n\nLet\u2019s bring these insights together in your personalized Work-Life Balance Reality Check\u2122."
    : snapshotDone
    ? isBaseline
      ? "Life Reflection Complete\n\nThank you for creating a protected time and space to reflect on your life.\n\nYour results provide valuable insight into how you\u2019ve been honoring what matters most. Let\u2019s continue by reflecting on your business."
      : "Life Reflection Complete\n\nThank you for creating a protected time and space to reflect on your life.\n\nYour results provide valuable insight into how you\u2019ve been honoring what matters most. Let\u2019s continue by reflecting on your business."
    : preActivityMessage

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

      {/* ── Step 1 — Founder Snapshot™ ──────────────────────────────────────── */}
      <StepCard
        stepNumber={1}
        label="Your Founder Snapshot™"
        title="Good morning."
        done={snapshotDone}
        active={activeStep === 1}
        onToggle={() => setActiveStep(activeStep === 1 ? (snapshotDone ? 2 : 1) : 1)}
        accentColor="gold"
      >
        {/* Display-only snapshot pulled from Founder Profile™ */}
        <div className="rounded-2xl border border-[#C9A84C]/20 bg-[#FDFAF4] px-6 py-5 space-y-4">
          {snapshot.name ? (
            <>
              <div className="space-y-1">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6914]">Founder</p>
                <p className="font-serif text-lg font-semibold text-[#2E1F27]">{snapshot.name}</p>
                {snapshot.businessName && (
                  <p className="font-sans text-sm text-[#5A4A52]">{snapshot.businessName}</p>
                )}
              </div>
              {snapshot.currentFocus && (
                <div className="space-y-1 pt-1 border-t border-[#C9A84C]/15">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6914]">Current Focus</p>
                  <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">{snapshot.currentFocus}</p>
                </div>
              )}
              {snapshot.quarterlyIntention && (
                <div className="space-y-1 pt-1 border-t border-[#C9A84C]/15">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#8B6914]">Current Quarterly Intention</p>
                  <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">{snapshot.quarterlyIntention}</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                Your Founder Profile™ has not been completed yet. Complete it once so Cherry Blossom™ can personalize your entire Harmony Lane™ experience.
              </p>
              <Link
                href="/founder-profile"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#8B6914] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                <User className="h-4 w-4" aria-hidden />
                Complete My Founder Profile™
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={markSnapshotDone}
          disabled={snapshotDone}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${
            snapshotDone
              ? "border-[#7FB069] bg-[#7FB069]/10 text-[#5B835F] cursor-default"
              : "border-[#C9A84C]/40 bg-white text-[#8B6914] hover:bg-[#C9A84C]/10"
          }`}
        >
          <CheckCircle2 className={`h-4 w-4 ${snapshotDone ? "text-[#7FB069]" : "text-[#C9A84C]/60"}`} />
          {snapshotDone ? "Snapshot Reviewed — Continue" : "I\u2019ve Reviewed My Snapshot — Begin Reflection"}
        </button>
      </StepCard>

      {/* ── Step 2 — Work-Life Balance Audit™ ──────────────────────────────── */}
      <StepCard
        stepNumber={2}
        label="Activity 1"
        title="Work-Life Balance Audit™"
        done={auditDone}
        active={activeStep === 2}
        locked={!snapshotDone}
        onToggle={() => {
          if (!snapshotDone) return
          setActiveStep(activeStep === 2 ? (auditDone ? 3 : 2) : 2)
        }}
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

      {/* ── Step 3 — Entrepreneur Success Assessment™ ──────────────────────── */}
      <StepCard
        stepNumber={3}
        label="Activity 2"
        title="Entrepreneur Success Assessment™"
        done={assessmentDone}
        active={activeStep === 3}
        locked={!auditDone}
        onToggle={() => {
          if (!auditDone) return
          setActiveStep(activeStep === 3 ? (assessmentDone ? 4 : 3) : 3)
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
                  Your Reality Check™ brings your life and business insights together into one intentional weekly reflection.
                </p>
              </div>

              {/* Cherry Blossom Reality Check response */}
              <div className="rounded-2xl border border-[#E26C73]/20 bg-white px-6 py-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl select-none" role="img" aria-label="Cherry blossom">🌸</span>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#E26C73]">Cherry Blossom™</p>
                </div>
                <p className="font-serif text-base font-semibold text-[#2E1F27] leading-snug">Beautiful.</p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  Your Reality Check™ isn&apos;t about judging your performance. It&apos;s about creating awareness.
                </p>
                <p className="font-sans text-sm text-[#5A4A52] leading-relaxed">
                  By reflecting on both your life and your business before reacting to the week ahead, you&apos;ve created the clarity needed to intentionally redesign your entry into the workweek.
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

            {/* ── Alignment Space™ countdown ──────────────────────────────── */}
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
      doneBg:    "bg-[#7FB069]",
    },
    gold: {
      activeBg: "bg-[#C9A84C]/15",
      activeText: "text-[#8B6914]",
      doneBg:    "bg-[#C9A84C]",
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
          {done ? <CheckCircle2 className="h-4 w-4" /> : stepNumber === 1 && accentColor === "gold" ? <User className="h-4 w-4" /> : stepNumber}
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
