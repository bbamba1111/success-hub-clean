"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Loader2,
  Lock,
  MessageCircleHeart,
  Sparkles,
  Star,
  Users,
} from "lucide-react"
import { FloatingPetals } from "@/components/floating-petals"
import { RitualTimeline } from "@/components/begin/ritual-timeline"
import { PHASES, FOCUS_AREA_OPTIONS, type PhaseId } from "@/components/sunday-design-day/sdd-config"
import { SddProvider, useSdd, canCompletePhase } from "@/components/sunday-design-day/sdd-state"
import { RealityCheckPhase } from "@/components/sunday-design-day/phases/reality-check-phase"
import { DownloadDelegatePhase } from "@/components/sunday-design-day/phases/download-delegate-phase"
import { DesignTomorrowPhase } from "@/components/sunday-design-day/phases/design-tomorrow-phase"
import { CommitPreparePhase } from "@/components/sunday-design-day/phases/commit-prepare-phase"
import { useHarmonyContextOptional } from "@/components/harmony-context/harmony-context-provider"
import {
  assembleOperatingBrief,
  type OperatingBrief,
} from "@/lib/founder-intelligence/founder-intelligence"
import { installWeekAction } from "@/lib/sunday-cycle/cycle-actions"
import {
  getCherryBlossomWelcome,
  getWeeklyGuidance,
  type CycleContext,
  type CycleMode,
} from "@/lib/sunday-cycle/cycle-engine"

/* =========================================================================
 * Public entry point — wrapped in SddProvider. The /begin page passes a
 * CycleContext prop fetched server-side so no DB call happens on the client.
 * ======================================================================= */

export interface SundayRitualProps {
  cycleContext?: CycleContext
  /** Auth user id — needed by installWeekAction to write back to Supabase. */
  userId?: string
}

export function SundayRitual({ cycleContext, userId }: SundayRitualProps) {
  return (
    <SddProvider>
      <RitualShell cycleContext={cycleContext} userId={userId} />
    </SddProvider>
  )
}

/* ---- Top-level shell ---------------------------------------------------- */

function RitualShell({
  cycleContext,
  userId,
}: {
  cycleContext?: CycleContext
  userId?: string
}) {
  const { state } = useSdd()
  const [started, setStarted] = useState(false)
  const installed = Boolean(state.data.installedAt)
  const mode = cycleContext?.mode ?? "first-sunday"
  const router = useRouter()

  const handleBegin = () => {
    if (mode === "first-sunday") {
      // First-time founders start with the two assessments before ritual phases.
      router.push("/audit")
    } else {
      setStarted(true)
    }
  }

  if (installed) {
    return <InstallBriefScreen cycleContext={cycleContext} userId={userId} />
  }
  if (!started) {
    return <WelcomeScreen mode={mode} cycleContext={cycleContext} onBegin={handleBegin} />
  }
  return (
    <PhaseScreen
      mode={mode}
      cycleContext={cycleContext}
      userId={userId}
      onBackToWelcome={() => setStarted(false)}
    />
  )
}

/* =========================================================================
 * Welcome screen — three voices, one page title
 * ======================================================================= */

const JOURNEY_CARDS = [
  {
    icon: ClipboardCheck,
    title: "Reality Check™",
    body: "Take a gentle snapshot of the week you just lived — your wins, your lessons, and the areas that matter most. It's what makes intentional design possible.",
  },
  {
    icon: MessageCircleHeart,
    title: "Download, Delegate & Design™",
    body: "Move everything out of your head, decide what only you should hold, then design each segment of your Work-Life Balance Business Day™ in advance.",
  },
  {
    icon: Sparkles,
    title: "Commit & Install Your Week™",
    body: "Review the week you've created and consciously install it — activating the operating system you just designed, ready to live on Monday.",
  },
]

/** First-Time Founder™ — richer chapter cards showing what the full installation covers. */
const FIRST_SUNDAY_CHAPTERS = [
  { label: "Chapter 1", title: "Discover™", body: "30-Day Work-Life Balance Audit™ and Entrepreneur Success Assessment™ establish your baseline." },
  { label: "Chapter 2", title: "Cherry Blossom Review™", body: "Cherry Blossom reads your baseline and opens the conversation." },
  { label: "Chapter 3", title: "Priority Focus Areas™", body: "Select the 1–3 life areas that deserve your focused energy this week." },
  { label: "Chapter 4", title: "Weekly Intention Declaration™", body: "One clear first-person statement you'll operate from all week." },
  { label: "Chapter 5", title: "Download & Delegate™", body: "Empty your head, classify every item, and reduce overload before Monday." },
  { label: "Chapter 6", title: "Design Tomorrow™", body: "Walk each segment of your Work-Life Balance Business Day™ and design it in advance." },
  { label: "Chapter 7", title: "Commit & Prepare™", body: "Review what you've designed, then consciously commit to it." },
  { label: "Chapter 8", title: "Install My Week™", body: "Cherry Blossom assembles your Operating Brief™ and your week is officially installed." },
]

function WelcomeScreen({
  mode,
  cycleContext,
  onBegin,
}: {
  mode: CycleMode
  cycleContext?: CycleContext
  onBegin: () => void
}) {
  const welcome = getCherryBlossomWelcome(cycleContext ?? { mode, cycleWeek: 1, cycleNumber: 0, firstName: null, firstInstalledAt: null })
  const isFirst = mode === "first-sunday"
  const isReview = mode === "review-28"

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/business-day-hero-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/55 via-brand-cream/25 to-brand-cream/80" />
        <FloatingPetals count={14} />

        <div className="relative z-10 flex min-h-[80vh] items-center justify-center px-4 py-20 sm:py-28">
          <div className="glass-panel mx-auto max-w-2xl rounded-3xl px-6 py-12 text-center sm:px-10 sm:py-14">
            <div className="mb-6 flex justify-center">
              <img
                src="/images/logo.png"
                alt="Make Time For More logo"
                width={80}
                height={80}
                className="rounded-full border-4 border-white/70 shadow-lg"
              />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-coral">
              Make Time For More™
            </p>
            <h1 className="font-playfair text-balance text-4xl font-bold leading-tight text-brand-ink sm:text-5xl">
              {isFirst ? "Welcome to Your First Work-Life Balance Business Week™" : "Welcome to Your Next Work-Life Balance Business Week™"}
            </h1>

            {/* Cherry Blossom contextual welcome */}
            <div className="mt-8 rounded-2xl border border-brand-green/15 bg-white/70 px-6 py-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/images/logo.png"
                  alt="Cherry Blossom"
                  width={32}
                  height={32}
                  className="rounded-full border border-white/80 shadow-sm"
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark/70">
                  Cherry Blossom™
                </span>
              </div>
              <p className="font-serif text-[15px] italic leading-relaxed text-pretty text-brand-ink-soft">
                {welcome}
              </p>
            </div>

            {isReview && (
              <div className="mt-4 rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-5 py-3">
                <p className="text-sm font-medium text-brand-coral">
                  28-Day Operating System Review™ — today&apos;s reflection covers the full past 28 days.
                </p>
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button
                size="lg"
                onClick={onBegin}
                className="bg-brand-coral px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-coral-dark hover:shadow-xl"
              >
                {isFirst ? "Begin My Work-Life Balance Audit™" : "Design My Next Work-Life Balance Business Week™"}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Button>
              <span className="flex items-center gap-2 text-sm text-brand-ink-soft">
                <Clock className="h-4 w-4" />
                {isFirst ? "About 20–30 minutes" : "About 15–20 minutes"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* First Sunday: chapter overview — Weekly/Review: compact journey cards */}
      {isFirst ? (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="mb-10 text-center font-playfair text-3xl font-bold text-balance text-brand-ink">
            Your Work-Life Balance Business Week™ Journey
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FIRST_SUNDAY_CHAPTERS.map(({ label, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-coral/12 bg-white p-5 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-coral/70">{label}</p>
                <h3 className="mb-2 font-playfair text-lg font-bold text-balance text-brand-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-pretty text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <h2 className="mb-10 text-center font-playfair text-3xl font-bold text-balance text-brand-ink">
            What This Ritual Holds
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {JOURNEY_CARDS.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="rounded-2xl border-brand-coral/15 bg-white shadow-sm">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/15">
                    <Icon className="h-6 w-6 text-brand-green" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-balance text-brand-ink">{title}</h3>
                  <p className="text-pretty leading-relaxed text-brand-ink-soft">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Ritual timeline — shown for all modes */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-brand-coral/10 sm:p-10">
          <h2 className="mb-8 text-center font-playfair text-2xl font-bold text-balance text-brand-ink">
            Your Weekly Ritual, Start to Finish
          </h2>
          <RitualTimeline />
          <div className="mt-10 text-center">
            <Button
              size="lg"
              onClick={onBegin}
              className="bg-brand-coral px-8 py-6 text-lg font-semibold text-white shadow-md transition-all hover:bg-brand-coral-dark hover:shadow-lg"
            >
              {isFirst ? "Begin My Work-Life Balance Audit™" : "Design My Next Work-Life Balance Business Week™"}
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

/* =========================================================================
 * Phase screens (pages 1–4) — unchanged spine, mode-aware guidance
 * ======================================================================= */

function PhaseScreen({
  mode,
  cycleContext,
  userId,
  onBackToWelcome,
}: {
  mode: CycleMode
  cycleContext?: CycleContext
  userId?: string
  onBackToWelcome: () => void
}) {
  const { state, dispatch } = useSdd()
  const activeId = state.activePhase
  const activeIndex = PHASES.findIndex((p) => p.id === activeId)
  const phase = PHASES[activeIndex]
  const isFinal = phase.id === "commit-prepare"
  const canComplete = canCompletePhase(phase.id, state.data)
  const installed = Boolean(state.data.installedAt)

  // For repeat visits, override Cherry Blossom guidance with shorter weekly voice.
  const isRepeat = mode !== "first-sunday"
  const guidance = isRepeat
    ? (getWeeklyGuidance(phase.id) ?? phase.guidance)
    : phase.guidance

  function goBack() {
    if (activeIndex <= 0) {
      onBackToWelcome()
    } else {
      dispatch({ type: "SET_ACTIVE", phase: PHASES[activeIndex - 1].id })
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="text-center">
          <p className="ds-eyebrow text-brand-green">Work-Life Balance Business Week™</p>
          <p className="mt-1 font-serif text-sm italic text-brand-green-dark">Design Tomorrow. Live It Tomorrow.™</p>
        </header>

        <ProgressSpine />

        <section className="harmony-panel mt-8 overflow-hidden">
          <div className="px-5 py-7 sm:px-8">
            <p className="ds-eyebrow text-brand-ink-soft/70">
              Step {activeIndex + 1} of {PHASES.length}
            </p>
            <h1 className="mt-2 font-playfair text-3xl font-bold tracking-tight text-balance text-brand-ink sm:text-4xl">
              {phase.title}
            </h1>
            <p className="mt-2 text-brand-ink-soft">{phase.purpose}</p>

            {/* Cherry Blossom Guidance™ — mode-aware */}
            <div className="harmony-glass mt-6 p-5">
              <div className="flex items-center gap-2 text-brand-green-dark">
                <Sparkles className="ds-icon-sm" aria-hidden />
                <span className="ds-eyebrow text-brand-green-dark/80">Cherry Blossom Guidance™</span>
              </div>
              <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-pretty text-brand-ink-soft">
                {guidance}
              </p>
            </div>

            <div className="mt-8">
              <PhaseBody id={phase.id} />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Button variant="ghost" onClick={goBack} className="text-brand-ink-soft hover:text-brand-ink">
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
              {activeIndex <= 0 ? "Back to Welcome" : `Back to ${PHASES[activeIndex - 1].label}`}
            </Button>

            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              {!canComplete && <PhaseHint id={phase.id} />}
              {isFinal ? (
                <Button
                  onClick={() => dispatch({ type: "INSTALL_WEEK" })}
                  className="ds-btn-primary"
                  disabled={installed}
                >
                  {phase.cta}
                  <ArrowRight className="ds-icon-sm" aria-hidden />
                </Button>
              ) : (
                <Button
                  onClick={() => dispatch({ type: "COMPLETE_PHASE", phase: phase.id })}
                  className="ds-btn-primary"
                  disabled={!canComplete}
                >
                  {phase.cta}
                  <ArrowRight className="ds-icon-sm" aria-hidden />
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ProgressSpine() {
  const { state, dispatch } = useSdd()
  return (
      <nav aria-label="Work-Life Balance Business Week progress" className="mt-8">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        {PHASES.map((phase, index) => {
          const status = state.status[phase.id]
          const isComplete = status === "complete"
          const isActive = state.activePhase === phase.id
          const reachable = status !== "not-started"
          return (
            <li key={phase.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => reachable && dispatch({ type: "SET_ACTIVE", phase: phase.id })}
                disabled={!reachable}
                aria-current={isActive ? "step" : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "bg-brand-green/10"
                    : reachable
                      ? "hover:bg-brand-green/[0.06]"
                      : "cursor-not-allowed opacity-55"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isComplete
                      ? "bg-brand-green text-white"
                      : isActive
                        ? "border-2 border-brand-green text-brand-green-dark"
                        : "border border-border text-brand-ink-soft"
                  }`}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" aria-hidden /> : index + 1}
                </span>
                <span
                  className={`text-sm font-medium leading-tight ${isActive ? "text-brand-ink" : "text-brand-ink-soft"}`}
                >
                  {phase.label}
                </span>
                {!reachable && <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-brand-ink-soft/50" aria-hidden />}
              </button>
              {index < PHASES.length - 1 && (
                <ChevronRight className="hidden h-4 w-4 shrink-0 text-border sm:block" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function PhaseBody({ id }: { id: PhaseId }) {
  switch (id) {
    case "reality-check":
      return <RealityCheckPhase />
    case "download-delegate":
      return <DownloadDelegatePhase />
    case "design-tomorrow":
      return <DesignTomorrowPhase />
    case "commit-prepare":
      return <CommitPreparePhase />
    default:
      return null
  }
}

function PhaseHint({ id }: { id: PhaseId }) {
  const hints: Record<PhaseId, string> = {
    "reality-check": "Add your wins, your Weekly Intention Declaration™, and at least one Priority Focus Area™ to continue.",
    "download-delegate": "Capture at least one item and give every item a destination to continue.",
    "design-tomorrow": "Set an Operating Rule™ for each segment to continue.",
    "commit-prepare": "",
  }
  const hint = hints[id]
  if (!hint) return null
  return <p className="max-w-sm text-sm text-brand-ink-soft">{hint}</p>
}

/* =========================================================================
 * Install My Week™ — the Operating Brief ceremony
 * ======================================================================= */

function InstallBriefScreen({
  cycleContext,
  userId,
}: {
  cycleContext?: CycleContext
  userId?: string
}) {
  const { state } = useSdd()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [installError, setInstallError] = useState<string | null>(null)

  // Read live Harmony Context — available because /begin wraps in HarmonyProvider.
  const harmony = useHarmonyContextOptional()

  // Assemble the Operating Brief™ from live context (deterministic, pure).
  const brief: OperatingBrief | null = harmony ? assembleOperatingBrief(harmony) : null

  const firstName = cycleContext?.firstName ?? harmony?.firstName ?? null
  const mode = cycleContext?.mode ?? "first-sunday"
  const declaration = state.data.weekly.declaration

  const focusAreaLabels = state.data.focusAreas.map((id) => {
    const opt = FOCUS_AREA_OPTIONS.find((o) => o.id === id)
    return opt?.label ?? id
  })

  // Cherry Blossom's "week installed" message, per cycle mode.
  const installedMessage =
    mode === "first-sunday"
      ? `Your Work-Life Balance Operating System™ is now installed${firstName ? `, ${firstName}` : ""}. Everything you need for a designed, intentional week is in place.`
      : mode === "review-28"
        ? `Another 28-day cycle complete${firstName ? `, ${firstName}` : ""}. I've reviewed your reflections, your priorities, and the way you've designed your week. Your Operating Brief™ for the next cycle is below.`
        : `I've reviewed your reflections, your priorities, your declaration, and the way you've designed your week${firstName ? `, ${firstName}` : ""}. Based on everything you've shared, I've assembled your Operating Brief™ for the week ahead.`

  function handleInstall() {
    setInstallError(null)
    startTransition(async () => {
      if (userId) {
        const result = await installWeekAction(userId, mode === "first-sunday")
        if (!result.success) {
          setInstallError("Your week was designed — we just had trouble saving it. You can continue to Live Today™.")
        }
      }
      router.push("/live-today")
    })
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-cream">
      <FloatingPetals count={12} />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-14 sm:py-20">
        {/* Header */}
        <header className="text-center mb-10">
          <p className="ds-eyebrow text-brand-green">Work-Life Balance Business Week™</p>
          <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-balance text-brand-ink sm:text-5xl">
            Your Week Has Been Installed™
          </h1>
        </header>

        {/* Cherry Blossom message */}
        <div className="harmony-panel mb-8 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <img
              src="/images/logo.png"
              alt="Cherry Blossom"
              width={44}
              height={44}
              className="shrink-0 rounded-full border-2 border-white/80 shadow"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-green-dark/70 mb-2">
                Cherry Blossom™
              </p>
              <p className="font-serif text-[15px] italic leading-relaxed text-pretty text-brand-ink-soft">
                {installedMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Intention Declaration™ */}
        {declaration && (
          <section className="mb-6 rounded-2xl border border-brand-green/20 bg-white p-6 shadow-sm">
            <p className="ds-eyebrow text-brand-green mb-3">Weekly Intention Declaration™</p>
            <p className="font-playfair text-xl leading-snug text-balance text-brand-ink">
              &ldquo;{declaration}&rdquo;
            </p>
          </section>
        )}

        {/* Priority Focus Areas™ */}
        {focusAreaLabels.length > 0 && (
          <section className="mb-6 rounded-2xl border border-brand-coral/15 bg-white p-6 shadow-sm">
            <p className="ds-eyebrow text-brand-coral mb-3">Priority Focus Areas™</p>
            <div className="flex flex-wrap gap-2">
              {focusAreaLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-brand-green/10 px-3.5 py-1.5 text-sm font-medium text-brand-green-dark"
                >
                  {label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Founder Intelligence™ Operating Brief */}
        {brief && (
          <>
            {/* Executive Leadership Team™ */}
            {brief.executives.length > 0 && (
              <section className="mb-6 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4.5 w-4.5 text-brand-ink-soft" aria-hidden />
                  <p className="ds-eyebrow text-brand-ink">Recommended Executive Leadership Team™</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {brief.executives.map((exec) => (
                    <div key={exec.id} className="rounded-xl border border-brand-green/10 bg-brand-green/[0.03] p-4">
                      <p className="text-sm font-semibold text-brand-ink">{exec.name}</p>
                      <p className="text-xs text-brand-ink-soft mt-0.5">{exec.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-pretty text-brand-ink-soft/80">{exec.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Professional Advisors™ — only if present */}
            {brief.advisors.length > 0 && (
              <section className="mb-6 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                <p className="ds-eyebrow text-brand-ink mb-4">Professional Advisors™</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {brief.advisors.map((advisor) => (
                    <div key={advisor.id} className="rounded-xl border border-brand-coral/10 bg-brand-coral/[0.03] p-4">
                      <p className="text-sm font-semibold text-brand-ink">{advisor.name}</p>
                      <p className="text-xs text-brand-ink-soft mt-0.5">{advisor.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-pretty text-brand-ink-soft/80">{advisor.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Academy Insight™ — exactly one */}
            {brief.insight && (
              <section className="mb-6 rounded-2xl border border-black/[0.07] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-4.5 w-4.5 text-brand-ink-soft" aria-hidden />
                  <p className="ds-eyebrow text-brand-ink">Academy Insight™</p>
                </div>
                <div className="rounded-xl border border-brand-green/15 bg-brand-green/[0.04] p-5">
                  <p className="text-xs italic text-brand-ink-soft mb-2">
                    Before Monday, I recommend spending {brief.insight.estimatedDuration} with:
                  </p>
                  <p className="font-playfair text-lg font-bold text-balance text-brand-ink">
                    &ldquo;{brief.insight.title}&rdquo;
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-brand-ink-soft">
                    {brief.insight.description}
                  </p>
                  <p className="mt-2 text-xs text-brand-green-dark/70 italic">{brief.insight.reason}</p>
                </div>
              </section>
            )}

            {/* Weekly Success Prediction™ — coaching message, not a score */}
            {brief.explanation && (
              <section className="mb-8 rounded-2xl border border-brand-coral/15 bg-brand-coral/[0.04] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4.5 w-4.5 text-brand-coral" aria-hidden />
                  <p className="ds-eyebrow text-brand-coral">Weekly Success Prediction™</p>
                </div>
                <p className="font-serif text-[15px] italic leading-relaxed text-pretty text-brand-ink-soft">
                  {brief.explanation}
                </p>
              </section>
            )}
          </>
        )}

        {/* No Harmony Context available — graceful fallback */}
        {!brief && (
          <div className="mb-8 rounded-2xl border border-brand-green/15 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-brand-ink-soft">
              Your week has been designed. Your Operating Brief™ will be available when you visit Live Today™.
            </p>
          </div>
        )}

        {/* Error notice */}
        {installError && (
          <p className="mb-4 text-center text-sm text-brand-coral">{installError}</p>
        )}

        {/* Install CTA */}
        <div className="text-center">
          <p className="mb-4 font-serif text-sm italic text-brand-ink-soft">
            Ready for Monday? Your week is designed, your team is assembled, your path is clear.
          </p>
          <Button
            size="lg"
            onClick={handleInstall}
            disabled={isPending}
            className="bg-brand-coral px-10 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-coral-dark hover:shadow-xl disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                Installing…
              </>
            ) : (
              <>
                Install My Week™
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}
