"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import {
  DIRECT_EGA_PROBLEM_STATEMENTS,
  DIRECT_EGA_OBSTACLE_OPTIONS,
  OBSTACLE_ACTION_TYPE,
  getObstacleLabel,
  type DirectEgaProblemStatement,
} from "@/lib/ega/direct-ega-catalog"
import { createEgaEntry, deleteEgaEntry, getEgaEntries } from "@/lib/ega/ega-storage"
import {
  hasCompletedEgaOnboardingSignal,
  markEgaOnboardingSignalComplete,
} from "@/lib/ega/ega-signal-store"
import type { EgaObstacleType } from "@/lib/ega/types"
import { OnboardingProgressBanner } from "@/components/onboarding/onboarding-progress-banner"
import type { OnboardingProgress } from "@/lib/onboarding/onboarding-progress"
import { EgaOnboardingSummary } from "@/components/ega/ega-onboarding-summary"

type Screen = "recognize" | "diagnose" | "results"

interface CapturedGap {
  problem: DirectEgaProblemStatement
  obstacleType: EgaObstacleType
}

/* ===========================================================================
 * Shared step chrome — mirrors components/business-context/business-context-profile.tsx
 * ======================================================================== */

function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
      {children}
    </div>
  )
}

function StepLabel({ label, step, total }: { label: string; step: number; total: number }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="ds-eyebrow">{label}</span>
      <span className="font-sans text-xs text-muted-foreground">
        {step} of {total}
      </span>
    </div>
  )
}

function StepQuestion({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-balance font-display text-xl font-medium leading-snug text-brand-ink">{children}</h2>
}

function StepHint({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 font-sans text-sm leading-relaxed text-muted-foreground">{children}</p>
}

function ContinueButton({
  onClick,
  disabled,
  label = "Continue",
  loading,
}: {
  onClick: () => void
  disabled?: boolean
  label?: string
  loading?: boolean
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className="ds-btn-primary mt-6 disabled:opacity-40">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {label}
      {!loading && <ChevronRight className="h-4 w-4" aria-hidden />}
    </button>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-muted-foreground transition-colors hover:text-brand-ink"
    >
      <ChevronLeft className="h-4 w-4" aria-hidden />
      Back
    </button>
  )
}

/* ===========================================================================
 * Screen 1 — Recognize the problem
 * ======================================================================== */

function RecognizeScreen({
  selected,
  onToggle,
  onContinue,
  onboarding,
  loading,
}: {
  selected: string[]
  onToggle: (id: string) => void
  onContinue: () => void
  onboarding: boolean
  loading?: boolean
}) {
  return (
    <StepCard>
      <StepLabel label="Entrepreneur Gap Assessment™" step={1} total={onboarding ? 1 : 2} />
      <StepQuestion>What is getting in your way?</StepQuestion>
      <StepHint>
        {onboarding
          ? "Select all that apply. There are no right or wrong answers — this just helps Harmony Lane™ know what to watch for as you get started."
          : "Select all that apply. There are no right or wrong answers — just what's true right now."}
      </StepHint>
      <div className="flex flex-col gap-2">
        {DIRECT_EGA_PROBLEM_STATEMENTS.map((problem) => {
          const isSelected = selected.includes(problem.id)
          return (
            <button
              key={problem.id}
              type="button"
              onClick={() => onToggle(problem.id)}
              aria-pressed={isSelected}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-all ${
                isSelected
                  ? "border-brand-green bg-accent"
                  : "border-border bg-card hover:border-brand-green/30 hover:bg-muted"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                  isSelected ? "border-brand-green bg-brand-green" : "border-border"
                }`}
                aria-hidden
              >
                {isSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
              <span className="font-sans text-sm font-medium text-brand-ink">{problem.statement}</span>
            </button>
          )
        })}
      </div>
      <ContinueButton onClick={onContinue} disabled={selected.length === 0} loading={loading} />
    </StepCard>
  )
}

/* ===========================================================================
 * Screen 2 — Diagnose the obstacle, one selected problem at a time
 * ======================================================================== */

function DiagnoseScreen({
  problem,
  index,
  total,
  value,
  onChange,
  onContinue,
  onBack,
  loading,
  isLast,
}: {
  problem: DirectEgaProblemStatement
  index: number
  total: number
  value: EgaObstacleType | null
  onChange: (v: EgaObstacleType) => void
  onContinue: () => void
  onBack: () => void
  loading: boolean
  isLast: boolean
}) {
  return (
    <StepCard>
      <StepLabel label="Entrepreneur Gap Assessment™" step={2} total={2} />
      <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Problem {index + 1} of {total}
      </p>
      <StepQuestion>What&apos;s getting in the way of &quot;{problem.statement}&quot;</StepQuestion>
      <StepHint>Choose the one that fits best right now.</StepHint>
      <div className="flex flex-col gap-2">
        {DIRECT_EGA_OBSTACLE_OPTIONS.map((opt) => {
          const isSelected = value === opt.type
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onChange(opt.type)}
              aria-pressed={isSelected}
              className={`flex items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all ${
                isSelected
                  ? "border-brand-green bg-accent"
                  : "border-border bg-card hover:border-brand-green/30 hover:bg-muted"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? "border-brand-green bg-brand-green" : "border-border"
                }`}
                aria-hidden
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="flex-1">
                <span className="block font-sans text-sm font-semibold text-brand-ink">{opt.label}</span>
                <span className="mt-0.5 block font-sans text-xs leading-relaxed text-muted-foreground">
                  {opt.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-4">
        <ContinueButton onClick={onContinue} disabled={!value} label={isLast ? "See My Results" : "Next Problem"} loading={loading} />
      </div>
      <BackButton onClick={onBack} />
    </StepCard>
  )
}

/* ===========================================================================
 * Results — Signal → Obstacle → Gap, saved to the Entrepreneur Gap Assessment™
 * ======================================================================== */

function ResultsScreen({ gaps }: { gaps: CapturedGap[] }) {
  return (
    <StepCard>
      <StepLabel label="Entrepreneur Gap Assessment™" step={2} total={2} />
      <StepQuestion>Here&apos;s what&apos;s actually getting in the way</StepQuestion>
      <StepHint>
        Each of these has been saved to your Entrepreneur Gap Assessment™. A mapped solution will
        follow once it&apos;s ready — recognizing the gap is the first step.
      </StepHint>
      <div className="flex flex-col gap-3">
        {gaps.map((entry) => (
          <div key={entry.problem.id} className="rounded-lg border border-border bg-muted/50 px-4 py-4">
            <p className="font-sans text-sm font-semibold text-brand-ink">{entry.problem.statement}</p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
              Obstacle: <span className="font-medium text-brand-green-dark">{getObstacleLabel(entry.obstacleType)}</span>
            </p>
          </div>
        ))}
      </div>
      <Link href="/" className="ds-btn-primary mt-6">
        Back to Dashboard
      </Link>
    </StepCard>
  )
}

/* ===========================================================================
 * Orchestration
 * ======================================================================== */

export function EgaPageClient({
  onboarding = false,
  progress,
}: {
  onboarding?: boolean
  /** Onboarding Progress™ snapshot — only passed when onboarding=true. */
  progress?: OnboardingProgress
}) {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>("recognize")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [diagnoseIndex, setDiagnoseIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, EgaObstacleType>>({})
  const [saving, setSaving] = useState(false)
  const [results, setResults] = useState<CapturedGap[]>([])

  // ── Onboarding summary/edit ────────────────────────────────────────────
  // The onboarding path (Screen 1 only) is reached both for a first-time
  // pass and by a returning founder revisiting an already-recorded EGA
  // signal capture (via the Onboarding Progress™ banner or its Back/Next
  // row). A completed capture shows a read-only summary of the signals on
  // file instead of the empty picker; "Edit Selections" re-opens the picker
  // pre-checked. `wasAlreadyComplete` mirrors the pattern used in
  // founder-profile-form.tsx / business-context-profile.tsx.
  const wasAlreadyComplete = useRef(hasCompletedEgaOnboardingSignal())
  const userRequestedEdit = useRef(false)
  const [egaMode, setEgaMode] = useState<"summary" | "form">(
    wasAlreadyComplete.current ? "summary" : "form",
  )
  const [hydrating, setHydrating] = useState(onboarding)
  // Existing `direct_ega` entries keyed by their sourceRef (problem id), so
  // saving after "Edit Selections" can reconcile additions/removals against
  // the database instead of re-creating duplicate rows for signals that are
  // already on file.
  const existingEntriesRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    if (!onboarding) return
    let cancelled = false
    getEgaEntries().then((entries) => {
      if (cancelled) return
      const directEntries = entries.filter((e) => e.source === "direct_ega" && e.sourceRef)
      existingEntriesRef.current = new Map(directEntries.map((e) => [e.sourceRef as string, e.id]))
      const refs = directEntries.map((e) => e.sourceRef as string)
      // Reconcile against the localStorage-only check above — a fresh
      // session's local cache may be empty even though the database
      // already has recorded signals (new device, cleared cache).
      if (refs.length > 0) {
        wasAlreadyComplete.current = true
        setSelectedIds(refs)
        if (!userRequestedEdit.current) {
          setEgaMode("summary")
        }
      }
      setHydrating(false)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarding])

  const selectedProblems = useMemo(
    () => DIRECT_EGA_PROBLEM_STATEMENTS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  )

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  /**
   * Onboarding path: Screen 1 IS the whole EGA step here. The founder
   * recognizes what's happening — they are not expected to diagnose the
   * underlying obstacle yet. Each selected statement is saved as an EgaEntry
   * with a signal only (no gap/obstacleType); that diagnosis happens later,
   * as a targeted follow-up once EGA's signal layer determines it's relevant
   * (or if the founder chooses to revisit it from their Blueprint).
   *
   * First-time completion marks the one-time onboarding gate complete and
   * continues straight into the existing Cherry Blossom Thank-You™
   * transition. Editing an already-complete capture (via "Edit Selections")
   * instead reconciles the picker's current selection against what's on
   * file — creating entries for newly-checked signals, deleting entries for
   * ones just unchecked — and returns to the summary rather than
   * re-launching onboarding.
   */
  const handleOnboardingContinue = async () => {
    setSaving(true)

    const existing = existingEntriesRef.current
    const toCreate = selectedProblems.filter((p) => !existing.has(p.id))
    const toDeleteIds = Array.from(existing.entries())
      .filter(([sourceRef]) => !selectedIds.includes(sourceRef))
      .map(([, id]) => id)

    await Promise.all([
      ...toCreate.map((problem) =>
        createEgaEntry({
          source: "direct_ega",
          sourceRef: problem.id,
          signal: problem.statement,
          status: "open",
        }),
      ),
      ...toDeleteIds.map((id) => deleteEgaEntry(id)),
    ])

    // Keep the reconciliation map in sync in case the founder edits again
    // without a full page reload.
    for (const problem of toCreate) existing.set(problem.id, "")
    for (const id of toDeleteIds) {
      existing.forEach((entryId, ref) => {
        if (entryId === id) existing.delete(ref)
      })
    }

    markEgaOnboardingSignalComplete()
    setSaving(false)

    if (wasAlreadyComplete.current) {
      setEgaMode("summary")
      userRequestedEdit.current = false
      return
    }

    wasAlreadyComplete.current = true
    router.push("/welcome/cherry-blossom/complete")
  }

  const handleStartDiagnosis = () => {
    setDiagnoseIndex(0)
    setScreen("diagnose")
  }

  const currentProblem = selectedProblems[diagnoseIndex]
  const isLastProblem = diagnoseIndex === selectedProblems.length - 1

  const handleDiagnoseContinue = async () => {
    if (!currentProblem) return
    const obstacleType = answers[currentProblem.id]
    if (!obstacleType) return

    if (!isLastProblem) {
      setDiagnoseIndex((i) => i + 1)
      return
    }

    // Last problem answered — persist every captured gap, then show results.
    setSaving(true)
    const captured: CapturedGap[] = selectedProblems.map((problem) => ({
      problem,
      obstacleType: answers[problem.id],
    }))

    await Promise.all(
      captured.map((entry) =>
        createEgaEntry({
          source: "direct_ega",
          sourceRef: entry.problem.id,
          signal: entry.problem.statement,
          gap: `${getObstacleLabel(entry.obstacleType)} is what's getting in the way of: ${entry.problem.statement}`,
          obstacleType: entry.obstacleType,
          actionType: OBSTACLE_ACTION_TYPE[entry.obstacleType],
          status: "open",
        }),
      ),
    )

    setResults(captured)
    setSaving(false)
    setScreen("results")
  }

  const handleDiagnoseBack = () => {
    if (diagnoseIndex === 0) {
      setScreen("recognize")
      return
    }
    setDiagnoseIndex((i) => i - 1)
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      {onboarding && progress && screen === "recognize" && (
        <OnboardingProgressBanner progress={progress} currentStep="egaComplete" />
      )}
      <div className="mx-auto w-full max-w-xl">
        {onboarding && hydrating && screen === "recognize" && (
          <div className="flex items-center justify-center rounded-lg border border-border bg-card px-6 py-16 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
          </div>
        )}
        {onboarding && !hydrating && egaMode === "summary" && screen === "recognize" && (
          <EgaOnboardingSummary
            selectedIds={selectedIds}
            onEdit={() => {
              userRequestedEdit.current = true
              setEgaMode("form")
            }}
          />
        )}
        {(!onboarding || (!hydrating && egaMode === "form")) && screen === "recognize" && (
          <RecognizeScreen
            selected={selectedIds}
            onToggle={toggleSelection}
            onContinue={onboarding ? handleOnboardingContinue : handleStartDiagnosis}
            onboarding={onboarding}
            loading={onboarding ? saving : undefined}
          />
        )}
        {!onboarding && screen === "diagnose" && currentProblem && (
          <DiagnoseScreen
            problem={currentProblem}
            index={diagnoseIndex}
            total={selectedProblems.length}
            value={answers[currentProblem.id] ?? null}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [currentProblem.id]: v }))}
            onContinue={handleDiagnoseContinue}
            onBack={handleDiagnoseBack}
            loading={saving}
            isLast={isLastProblem}
          />
        )}
        {screen === "results" && <ResultsScreen gaps={results} />}
      </div>
    </main>
  )
}
