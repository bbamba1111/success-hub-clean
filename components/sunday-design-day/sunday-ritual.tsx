"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Lock,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react"
import { FloatingPetals } from "@/components/floating-petals"
import { RitualTimeline } from "@/components/begin/ritual-timeline"
import { PHASES, type PhaseId } from "@/components/sunday-design-day/sdd-config"
import { SddProvider, useSdd, canCompletePhase } from "@/components/sunday-design-day/sdd-state"
import { RealityCheckPhase } from "@/components/sunday-design-day/phases/reality-check-phase"
import { DownloadDelegatePhase } from "@/components/sunday-design-day/phases/download-delegate-phase"
import { DesignTomorrowPhase } from "@/components/sunday-design-day/phases/design-tomorrow-phase"
import { CommitPreparePhase } from "@/components/sunday-design-day/phases/commit-prepare-phase"

/**
 * Sunday Design Day™ — the unified, page-turning ritual (Phase 5.10).
 *
 * Merges the former /begin welcome and the /sunday-design-day accordion into a
 * single ceremonial experience: one screen at a time, with a persistent,
 * clickable progress spine so the founder always knows where they are and can
 * step back to edit any completed part. All logic (state, gating, session
 * persistence) is reused unchanged from the existing engine.
 */
export function SundayRitual() {
  return (
    <SddProvider>
      <RitualShell />
    </SddProvider>
  )
}

function RitualShell() {
  const { state } = useSdd()
  const [started, setStarted] = useState(false)
  const installed = Boolean(state.data.installedAt)

  if (installed) return <CompletionScreen />
  if (!started) return <WelcomeScreen onBegin={() => setStarted(true)} />
  return <PhaseScreen onBackToWelcome={() => setStarted(false)} />
}

/* ---- Welcome (page 0) --------------------------------------------------- */

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

function WelcomeScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <main className="min-h-screen bg-brand-cream">
      {/* Hero — full-width panoramic lifestyle image with a soft light wash */}
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
              Welcome to Sunday Design Day™
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-brand-ink-soft">
              Design Tomorrow. Live It Tomorrow.™ Before we build your week, let&apos;s move through one calm ritual
              together — one page at a time.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3">
              <Button
                size="lg"
                onClick={onBegin}
                className="bg-brand-coral px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-coral-dark hover:shadow-xl"
              >
                Begin My Sunday Design Day™
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Button>
              <span className="flex items-center gap-2 text-sm text-brand-ink-soft">
                <Clock className="h-4 w-4" />
                About 15–20 minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey cards */}
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

      {/* Timeline */}
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
              className="bg-gradient-to-r from-brand-coral to-brand-green px-8 py-6 text-lg font-semibold text-white shadow-md transition-all hover:from-brand-coral-dark hover:to-brand-green-dark hover:shadow-lg"
            >
              Begin My Sunday Design Day™
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ---- Phase screens (pages 1–4) ------------------------------------------ */

function PhaseScreen({ onBackToWelcome }: { onBackToWelcome: () => void }) {
  const { state, dispatch } = useSdd()
  const activeId = state.activePhase
  const activeIndex = PHASES.findIndex((p) => p.id === activeId)
  const phase = PHASES[activeIndex]
  const isFinal = phase.id === "commit-prepare"
  const canComplete = canCompletePhase(phase.id, state.data)
  const installed = Boolean(state.data.installedAt)

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
        {/* Ritual header — always visible, so the founder knows the ceremony */}
        <header className="text-center">
          <p className="ds-eyebrow text-brand-green">Sunday Design Day™</p>
          <p className="mt-1 font-serif text-sm italic text-brand-green-dark">Design Tomorrow. Live It Tomorrow.™</p>
        </header>

        {/* Progress spine — clickable, so any completed part is one tap away */}
        <ProgressSpine />

        {/* The single active page */}
        <section className="harmony-panel mt-8 overflow-hidden">
          <div className="px-5 py-7 sm:px-8">
            <p className="ds-eyebrow text-brand-ink-soft/70">
              Step {activeIndex + 1} of {PHASES.length}
            </p>
            <h1 className="mt-2 font-playfair text-3xl font-bold tracking-tight text-balance text-brand-ink sm:text-4xl">
              {phase.title}
            </h1>
            <p className="mt-2 text-brand-ink-soft">{phase.purpose}</p>

            {/* Cherry Blossom Guidance™ */}
            <div className="harmony-glass mt-6 p-5">
              <div className="flex items-center gap-2 text-brand-green-dark">
                <Sparkles className="ds-icon-sm" aria-hidden />
                <span className="ds-eyebrow text-brand-green-dark/80">Cherry Blossom Guidance™</span>
              </div>
              <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-pretty text-brand-ink-soft">
                {phase.guidance}
              </p>
            </div>

            {/* Phase body — reused, unchanged logic */}
            <div className="mt-8">
              <PhaseBody id={phase.id} />
            </div>
          </div>

          {/* Page-turn navigation */}
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
    <nav aria-label="Sunday Design Day progress" className="mt-8">
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
    "reality-check": "Add your wins, intention, declaration, and at least one Priority Focus Area™ to continue.",
    "download-delegate": "Capture at least one item and give every item a destination to continue.",
    "design-tomorrow": "Set an Operating Rule™ for each segment to continue.",
    "commit-prepare": "",
  }
  const hint = hints[id]
  if (!hint) return null
  return <p className="max-w-sm text-sm text-brand-ink-soft">{hint}</p>
}

/* ---- Completion (final page) -------------------------------------------- */

function CompletionScreen() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-cream">
      <FloatingPetals count={16} />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="glass-panel mx-auto max-w-xl rounded-3xl px-6 py-14 text-center sm:px-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-green text-white shadow-lg">
            <Check className="h-8 w-8" aria-hidden />
          </div>
          <p className="ds-eyebrow text-brand-green">Your Week Is Installed™</p>
          <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-balance text-brand-ink sm:text-5xl">
            Tomorrow Is Already Designed
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-pretty font-serif text-lg italic leading-relaxed text-brand-ink-soft">
            Honor tonight&apos;s Power Down &amp; Unplug™, and arrive Monday ready to live what you&apos;ve
            intentionally created.
          </p>
          <div className="mt-10">
            <Link href="/live-today">
              <Button
                size="lg"
                className="bg-brand-coral px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-brand-coral-dark hover:shadow-xl"
              >
                Go to Live Today™
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
