"use client"

import { Check, ChevronDown, ArrowRight, Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PHASES, type PhaseId } from "@/components/sunday-design-day/sdd-config"
import { SddProvider, useSdd, canCompletePhase } from "@/components/sunday-design-day/sdd-state"
import { RealityCheckPhase } from "@/components/sunday-design-day/phases/reality-check-phase"
import { DownloadDelegatePhase } from "@/components/sunday-design-day/phases/download-delegate-phase"
import { DesignTomorrowPhase } from "@/components/sunday-design-day/phases/design-tomorrow-phase"
import { CommitPreparePhase } from "@/components/sunday-design-day/phases/commit-prepare-phase"

export function SundayDesignDayFlow() {
  return (
    <SddProvider>
      <div className="ds-container max-w-5xl py-10 sm:py-14">
        <FlowHeader />
        <FlowBody />
      </div>
    </SddProvider>
  )
}

function FlowBody() {
  const { state, dispatch } = useSdd()
  const installed = Boolean(state.data.installedAt)

  return (
    <>
      <ProgressSpine />

      <div className="mt-8 space-y-4">
        {PHASES.map((phase) => {
          const status = state.status[phase.id]
          const open = state.activePhase === phase.id
          const isLocked = status === "not-started"
          const isFinal = phase.id === "commit-prepare"
          const canComplete = canCompletePhase(phase.id, state.data)

          return (
            <PhaseSection
              key={phase.id}
              phaseId={phase.id}
              open={open}
              isComplete={status === "complete"}
              isLocked={isLocked}
              onToggle={() => !isLocked && dispatch({ type: "SET_ACTIVE", phase: phase.id })}
            >
              <PhaseBody id={phase.id} />

              <div className="mt-8 flex flex-col items-end gap-2">
                {!canComplete && <PhaseHint id={phase.id} />}
                {isFinal ? (
                  <Button
                    onClick={() => dispatch({ type: "INSTALL_WEEK" })}
                    className="ds-btn-primary"
                    disabled={installed}
                  >
                    {installed ? "Week Installed" : phase.cta}
                    {!installed && <ArrowRight className="ds-icon-sm" aria-hidden />}
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
            </PhaseSection>
          )
        })}
      </div>

      {installed && <InstalledNote />}
    </>
  )
}

/* ---- Header ------------------------------------------------------------- */

function FlowHeader() {
  return (
    <header className="text-center">
      <p className="ds-eyebrow">The Harmony Lane™ Presents</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl text-balance">
        Sunday Design Day™
      </h1>
      <p className="mt-3 font-serif text-lg italic text-brand-green-dark">Design Tomorrow. Live It Tomorrow.™</p>
      <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-brand-ink-soft">
        The Weekly Installation Experience for the Work-Life Balance Business Week™
      </p>
    </header>
  )
}

/* ---- Progress spine ----------------------------------------------------- */

function ProgressSpine() {
  const { state, dispatch } = useSdd()
  return (
    <nav aria-label="Sunday Design Day progress" className="mt-10">
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
              </button>
              {index < PHASES.length - 1 && (
                <ChevronDown className="hidden h-4 w-4 shrink-0 -rotate-90 text-border sm:block" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ---- Phase section (accordion) ------------------------------------------ */

function PhaseSection({
  phaseId,
  open,
  isComplete,
  isLocked,
  onToggle,
  children,
}: {
  phaseId: PhaseId
  open: boolean
  isComplete: boolean
  isLocked: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const phase = PHASES.find((p) => p.id === phaseId)!
  const index = PHASES.findIndex((p) => p.id === phaseId)
  return (
    <section className="harmony-panel overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        disabled={isLocked}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 ${
          isLocked ? "cursor-not-allowed" : ""
        }`}
      >
        <span className="flex items-start gap-3">
          <span
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              isComplete ? "bg-brand-green text-white" : "bg-brand-green/10 text-brand-green-dark"
            }`}
          >
            {isComplete ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
          </span>
          <span>
            <span className="block font-display text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
              {phase.title}
            </span>
            <span className="mt-0.5 block text-sm text-brand-ink-soft">{phase.purpose}</span>
          </span>
        </span>
        {isLocked ? (
          <Lock className="ds-icon-sm shrink-0 text-brand-ink-soft/60" aria-hidden />
        ) : (
          <ChevronDown
            className={`ds-icon shrink-0 text-brand-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div className="border-t border-black/[0.06] px-5 pb-7 pt-6 sm:px-7">
          <GuidanceIntro>{phase.guidance}</GuidanceIntro>
          <div className="mt-6">{children}</div>
        </div>
      )}
    </section>
  )
}

function GuidanceIntro({ children }: { children: React.ReactNode }) {
  return (
    <div className="harmony-glass p-5">
      <div className="flex items-center gap-2 text-brand-green-dark">
        <Sparkles className="ds-icon-sm" aria-hidden />
        <span className="ds-eyebrow text-brand-green-dark/80">Cherry Blossom Guidance™</span>
      </div>
      <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-brand-ink-soft text-pretty">{children}</p>
    </div>
  )
}

/* ---- Phase bodies ------------------------------------------------------- */

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
  return <p className="text-sm text-brand-ink-soft">{hint}</p>
}

function InstalledNote() {
  return (
    <div className="harmony-glass mt-6 p-6 text-center sm:p-8">
      <div className="flex items-center justify-center gap-2 text-brand-green-dark">
        <Check className="ds-icon-sm" aria-hidden />
        <span className="ds-eyebrow text-brand-green-dark/80">Your Week Is Installed™</span>
      </div>
      <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-brand-ink text-pretty">
        Your week is designed and installed. Honor tonight&apos;s Power Down &amp; Unplug™, and arrive Monday ready to
        live what you&apos;ve intentionally created.
      </p>
      <div className="mt-5 flex justify-center">
        <Link href="/live-today">
          <Button className="ds-btn-primary">
            Go to Live Today™
            <ArrowRight className="ds-icon-sm" aria-hidden />
          </Button>
        </Link>
      </div>
    </div>
  )
}
