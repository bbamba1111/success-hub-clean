"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Check, Loader2, Lock, Pencil, ShieldCheck, Sparkles } from "lucide-react"
import { getAuditResults, type AuditData } from "@/utils/audit-storage"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CATEGORY_LABELS } from "@/utils/life-value-categories"
import { INTENTION_GROUPS, composeIntentionSummary } from "@/lib/boundary-report/intention-inventory"
import {
  REQUIREMENT_OPTIONS,
  STAGE_CONSIDERATIONS,
  STAGE_LABELS,
  requirementById,
} from "@/lib/boundary-report/business-intelligence"
import {
  ALIGNMENT_CHOICES,
  ALIGNMENT_FINAL,
  ALIGNMENT_QUESTIONS,
  TOUR_MODULES,
} from "@/lib/boundary-report/alignment"
import useSWR from "swr"
import {
  getLatestBoundaryReport,
  loadBoundaryDraft,
  saveBoundaryDraft,
  saveBoundaryReport,
  setBoundaryReportPath,
} from "@/lib/boundary-report/actions"
import { CurrentBusinessStep } from "@/components/boundary-report/current-business-step"
import { PersonalRealityStep } from "@/components/boundary-report/personal-reality-step"
import { StartConsiderationsBlock } from "@/components/boundary-report/start-considerations-block"
import { personalRealityById } from "@/lib/boundary-report/personal-reality"
import { buildStartConsiderations } from "@/lib/boundary-report/start-considerations"
import {
  CURRENT_BUSINESS_QUESTIONS,
  EMPTY_CURRENT_BUSINESS,
  isCurrentBusinessQuestionComplete,
  type CurrentBusiness,
} from "@/lib/boundary-report/current-business"
import type {
  BoundaryReportDraft,
  AlignmentChoice,
  AlignmentResponse,
  BaselineArea,
  BoundaryReportData,
  BusinessStage,
  SelectedPath,
} from "@/lib/boundary-report/types"

const FOCUS_THRESHOLD = 60
const WEEK_CHECKOUT = "/pricing"

type Stage =
  | "summary"
  | "intro"
  | "intention"
  | "currentBusiness"
  | "requirements"
  | "personalReality"
  | "audit"
  | "baseline"
  | "priority"
  | "alignment"
  | "generating"
  | "report"

const STAGE_ORDER: Stage[] = [
  "intro",
  "intention",
  "currentBusiness",
  "requirements",
  "personalReality",
  "audit",
  "baseline",
  "priority",
  "alignment",
  "report",
]

/** Stages a reloaded draft may resume at (never mid-generation or on the finished report). */
const RESUMABLE = new Set<string>(STAGE_ORDER.filter((s) => s !== "report"))

const SCORE_RED_PINK = "#D9505E"
const SCORE_PINK = "#E58A9A"
const SCORE_GREEN = "#5B835F"

function scoreColor(score: number): string {
  if (score > FOCUS_THRESHOLD) return SCORE_GREEN
  if (score >= 40) return SCORE_PINK
  return SCORE_RED_PINK
}

function scoreBarFill(score: number): string {
  return score > FOCUS_THRESHOLD
    ? `linear-gradient(90deg, ${SCORE_PINK}, ${SCORE_GREEN})`
    : `linear-gradient(90deg, ${SCORE_RED_PINK}, ${SCORE_PINK})`
}

function toBaseline(data: AuditData) {
  const areas: BaselineArea[] = data.results.map((r) => ({
    key: r.category,
    label: r.label ?? CATEGORY_LABELS[r.category] ?? r.category,
    score: r.percentage,
    isCandidate: r.percentage <= FOCUS_THRESHOLD,
  }))
  return {
    overall: data.overallScore,
    date: new Date(data.timestamp ?? Date.now()).toISOString(),
    areas,
  }
}

// ── Shared shells ───────────────────────────────────────────────────────────

function StageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
        {eyebrow}
      </p>
      <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-ink text-balance mb-3">{title}</h1>
      {intro ? <p className="font-sans text-base text-brand-ink-soft leading-relaxed text-pretty mb-8">{intro}</p> : null}
      {children}
    </div>
  )
}

function NavRow({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  backDisabled,
}: {
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
  nextDisabled?: boolean
  backDisabled?: boolean
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={onBack}
        disabled={backDisabled || !onBack}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink disabled:opacity-0"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-7 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}

function ProgressBar({ stage }: { stage: Stage }) {
  const idx = Math.max(0, STAGE_ORDER.indexOf(stage))
  const pct = ((idx + 1) / STAGE_ORDER.length) * 100
  return (
    <div className="sticky top-0 z-10 bg-brand-cream/90 backdrop-blur-sm">
      <div className="h-1 w-full bg-brand-green/10">
        <div
          className="h-full bg-gradient-to-r from-brand-coral via-[#E58A9A] to-brand-green transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const CATEGORIES: { label: string; stages: Stage[] }[] = [
  { label: "Your Intention™", stages: ["intention"] },
  { label: "Your Business™", stages: ["currentBusiness", "requirements"] },
  { label: "Your Life™", stages: ["personalReality", "audit", "baseline", "priority"] },
  { label: "Your Alignment™", stages: ["alignment"] },
]

function CategoryStepper({ stage }: { stage: Stage }) {
  const current = CATEGORIES.findIndex((c) => c.stages.includes(stage))
  if (current < 0) return null
  const category = CATEGORIES[current]
  const stepInCategory = category.stages.indexOf(stage) + 1

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6">
      <div className="rounded-3xl border border-[#E8E0D5] bg-white px-6 py-5 shadow-sm sm:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            {category.label}
          </span>
          <span className="font-montserrat text-xs text-[#6B5860]/60">
            Section {current + 1} of {CATEGORIES.length}
            {category.stages.length > 1 ? ` · Step ${stepInCategory} of ${category.stages.length}` : ""}
          </span>
        </div>
        <ol className="grid grid-cols-4 gap-2" aria-label="Reality Check™ sections">
          {CATEGORIES.map((c, i) => (
            <li key={c.label} className="flex flex-col gap-1.5">
              <span
                className={`h-1.5 rounded-full ${i < current ? "bg-[#5B835F]" : i === current ? "bg-[#5B835F]/60" : "bg-[#E8E0D5]"}`}
                aria-hidden
              />
              <span
                className={`hidden font-montserrat text-[11px] sm:block ${i === current ? "font-bold text-[#3A2E33]" : "text-[#6B5860]/70"}`}
                aria-current={i === current ? "step" : undefined}
              >
                {c.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-sans text-sm font-semibold text-brand-ink mb-2">{children}</label>
}

function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-2xl border border-brand-blush bg-white px-4 py-3 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 outline-none transition-colors focus:border-brand-coral"
    />
  )
}

// ── Main journey ─────────────────────────────────────────────────────────────

export function BoundaryReportJourney({ onboarding = false }: { onboarding?: boolean }) {
  const [stage, setStage] = useState<Stage>("intro")

  // Intention
  const [intentionChoices, setIntentionChoices] = useState<Record<string, string[]>>({})
  const [somethingElse, setSomethingElse] = useState("")
  const selections = useMemo(
    () => INTENTION_GROUPS.flatMap((g) => intentionChoices[g.id] ?? []),
    [intentionChoices],
  )

  // Baseline (from the existing 15-area audit)
  const [baseline, setBaseline] = useState<{ overall: number; date: string; areas: BaselineArea[] } | null>(null)
  const [baselineLoaded, setBaselineLoaded] = useState(false)

  // Priority focus areas (keys)
  const [priority, setPriority] = useState<string[]>([])

  // Your Current Business™ (stage is Question 1)
  const [currentBusiness, setCurrentBusiness] = useState<CurrentBusiness>(EMPTY_CURRENT_BUSINESS)
  const [currentBusinessIndex, setCurrentBusinessIndex] = useState(0)
  const stageChoice: BusinessStage | null = currentBusiness.stage

  // Business Reality™ (requirement ids)
  const [requirements, setRequirements] = useState<string[]>([])

  // Personal & Work-From-Home Reality™ (unscored option ids)
  const [personalReality, setPersonalReality] = useState<string[]>([])

  // Work-Life Balance Alignment™ willingness answers, keyed by question id
  const [alignment, setAlignment] = useState<Record<string, AlignmentChoice>>({})
  const [alignmentIndex, setAlignmentIndex] = useState(0)

  // Tour reveal progress
  const [tourRevealed, setTourRevealed] = useState(1)

  // Persistence
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [reportId, setReportId] = useState<string | null>(null)
  const [chosenPath, setChosenPath] = useState<SelectedPath | null>(null)

  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const data = getAuditResults()
    if (data) setBaseline(toBaseline(data))
    setBaselineLoaded(true)
  }, [])

  // Restore saved progress once, then autosave every change.
  const { data: saved } = useSWR("boundary-report-draft", loadBoundaryDraft, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })
  const { data: latest } = useSWR("boundary-report-latest", getLatestBoundaryReport, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })
  const [hydrated, setHydrated] = useState(false)

  // Arriving on the page (and restoring a saved draft) must leave the member at
  // the hero; only stage changes they make afterwards jump to the journey.
  const wasHydratedLastRun = useRef(false)
  useEffect(() => {
    if (!wasHydratedLastRun.current) {
      wasHydratedLastRun.current = hydrated
      return
    }
    topRef.current?.scrollIntoView({ behavior: "instant", block: "start" })
  }, [stage, currentBusinessIndex, hydrated])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  function loadFromReport(data: BoundaryReportData) {
    const picked = new Set(data.originalIntention?.selections ?? [])
    setIntentionChoices(
      Object.fromEntries(INTENTION_GROUPS.map((g) => [g.id, g.items.filter((item) => picked.has(item))])),
    )
    setSomethingElse(data.originalIntention?.somethingElse ?? "")
    if (data.currentBusiness) setCurrentBusiness(data.currentBusiness)
    setRequirements((data.businessRequirements ?? []).map((r) => r.id))
    setPersonalReality((data.personalReality ?? []).map((p) => p.id))
    setPriority(data.priorityFocusAreas ?? [])
    setAlignment(Object.fromEntries((data.alignmentResponses ?? []).map((r) => [r.id, r.choice])))
    setAlignmentIndex(0)
    setCurrentBusinessIndex(0)
    if (!getAuditResults() && data.baseline?.areas?.length) setBaseline(data.baseline)
    setChosenPath(data.selectedPath ?? null)
  }

  function editSection(target: Stage) {
    if (latest) {
      loadFromReport(latest.data)
      setReportId(latest.id)
    }
    setStage(target)
  }

  useEffect(() => {
    if (!saved || latest === undefined || hydrated) return
    const d = saved.draft
    if (!d && latest) {
      loadFromReport(latest.data)
      setReportId(latest.id)
      setStage("summary")
    } else if (d) {
      if (RESUMABLE.has(d.stage)) setStage(d.stage as Stage)
      setCurrentBusinessIndex(Math.min(d.currentBusinessIndex ?? 0, CURRENT_BUSINESS_QUESTIONS.length - 1))
      setIntentionChoices(d.intentionChoices ?? {})
      setSomethingElse(d.somethingElse ?? "")
      setCurrentBusiness(d.currentBusiness ?? EMPTY_CURRENT_BUSINESS)
      setRequirements(d.requirements ?? [])
      setPersonalReality(d.personalReality ?? [])
      setPriority(d.priority ?? [])
      setAlignment(d.alignment ?? {})
      setAlignmentIndex(d.alignmentIndex ?? 0)
    } else if (saved.previousCurrentBusiness) {
      setCurrentBusiness(saved.previousCurrentBusiness)
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved, latest, hydrated])

  useEffect(() => {
    if (!hydrated || stage === "summary" || stage === "intro" || stage === "generating" || stage === "report") return
    const draft: BoundaryReportDraft = {
      stage,
      currentBusinessIndex,
      intentionChoices,
      somethingElse,
      currentBusiness,
      requirements,
      personalReality,
      priority,
      alignment,
      alignmentIndex,
    }
    const timer = setTimeout(async () => {
      setSaveStatus("saving")
      const result = await saveBoundaryDraft(draft)
      setSaveStatus(result.ok ? "saved" : "error")
    }, 700)
    return () => clearTimeout(timer)
  }, [
    hydrated,
    stage,
    currentBusinessIndex,
    intentionChoices,
    somethingElse,
    currentBusiness,
    requirements,
    personalReality,
    priority,
    alignment,
    alignmentIndex,
  ])

  const intentionSummary = useMemo(
    () => composeIntentionSummary(intentionChoices, somethingElse),
    [intentionChoices, somethingElse],
  )

  const candidateAreas = baseline?.areas.filter((a) => a.isCandidate) ?? []
  const priorityAreas = baseline?.areas.filter((a) => priority.includes(a.key)) ?? []

  function toggleIntention(groupId: string, item: string) {
    setIntentionChoices((prev) => {
      const current = prev[groupId] ?? []
      const nextItems = current.includes(item) ? current.filter((x) => x !== item) : [...current, item]
      return { ...prev, [groupId]: nextItems }
    })
  }

  function completeAudit(results: AuditData) {
    setBaseline(toBaseline(results))
    setPriority([])
    setStage("baseline")
  }

  function togglePriority(key: string) {
    setPriority((prev) => {
      if (prev.includes(key)) return prev.filter((x) => x !== key)
      if (prev.length >= 3) return prev
      return [...prev, key]
    })
  }

  function toggleRequirement(id: string) {
    setRequirements((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function togglePersonalReality(id: string) {
    setPersonalReality((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function setAlignmentChoice(id: string, choice: AlignmentChoice) {
    setAlignment((prev) => ({ ...prev, [id]: choice }))
  }

  const alignmentResponses: AlignmentResponse[] = useMemo(
    () =>
      ALIGNMENT_QUESTIONS.filter((q) => alignment[q.id]).map((q) => ({
        id: q.id,
        title: q.title,
        question: q.question,
        choice: alignment[q.id],
      })),
    [alignment],
  )

  function buildReport(path?: SelectedPath): BoundaryReportData {
    const stage = stageChoice ?? "start"
    return {
      originalIntention: { selections, somethingElse: somethingElse.trim() || undefined, summary: intentionSummary },
      baseline: baseline ?? { overall: 0, date: new Date().toISOString(), areas: [] },
      priorityFocusAreas: priority,
      priorityAreas: priorityAreas.map((a) => ({ key: a.key, label: a.label, score: a.score })),
      alignmentResponses,
      finalAlignment: alignment[ALIGNMENT_FINAL.id],
      boundaryCollisions: requirements.map((id) => requirementById(id)?.label ?? id),
      businessRequirements: requirements.map((id) => {
        const opt = requirementById(id)
        return { id, label: opt?.label ?? id, note: opt?.hint ?? "Your diagnostic suggests this may need attention." }
      }),
      stage,
      stageConsiderations: STAGE_CONSIDERATIONS[stage].considerations,
      selectedPath: path,
      currentBusiness: { ...currentBusiness, updatedAt: new Date().toISOString() },
      personalReality: personalReality.map((id) => ({ id, label: personalRealityById(id)?.label ?? id })),
      startConsiderations: buildStartConsiderations({
        intentionChoices,
        requirements,
        personalReality,
        baselineAreas: baseline?.areas ?? [],
        priorityFocusAreas: priority,
        alignment,
        stage: stageChoice,
      }),
    }
  }

  async function generateReport() {
    setStage("generating")
    setSaveError(null)
    const result = await saveBoundaryReport(buildReport())
    if (result.ok && result.id) {
      setReportId(result.id)
    } else {
      setSaveError(result.error ?? null)
    }
    // Deliberate pause so the reveal feels earned, then show the report either way.
    setTimeout(() => setStage("report"), 1600)
  }

  async function choosePath(path: SelectedPath) {
    setChosenPath(path)
    if (reportId) {
      setSaving(true)
      await setBoundaryReportPath(reportId, path)
      setSaving(false)
    }
    if (path === "JOINED_WEEK") window.location.href = WEEK_CHECKOUT
  }

  function goBack() {
    const idx = STAGE_ORDER.indexOf(stage)
    if (idx > 0) setStage(STAGE_ORDER[idx - 1])
  }

  // ── Stage renderers ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-card">
      <div ref={topRef} />
      <ProgressBar stage={stage} />
      <CategoryStepper stage={stage} />
      <p aria-live="polite" className="mx-auto h-5 w-full max-w-3xl px-4 pt-2 text-right font-sans text-xs text-brand-ink-soft">
        {saveStatus === "saving" && "Saving your progress…"}
        {saveStatus === "saved" && "Progress saved"}
        {saveStatus === "error" && "Sign in to keep your progress"}
      </p>

      {stage === "summary" && latest && (
        <RealityCheckSummary
          data={latest.data}
          onboarding={onboarding}
          onEdit={editSection}
          onViewReport={() => setStage("report")}
          onRetake={() => editSection("intro")}
        />
      )}

      {stage === "intro" && (
        <StageShell
          eyebrow="Work-Life Balance Reality Check™"
          title="Let’s find what your business needs to protect."
          intro="This is your Monday diagnostic—a focused look at what you built your business for, how your life is really operating, and what might need to change."
        >
          <div className="mb-6 flex flex-col gap-3 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
            <p>
              We&apos;ll connect the life you intended to create with the reality you&apos;re experiencing today, identify
              what matters most right now, and uncover what your business may need to protect so you can make time for
              more life.
            </p>
            <p>
              Your experience ends with your Work-Life Balance Boundary Report™—a clearer picture of where you are, what
              matters, and where your attention needs to go next.
            </p>
            <p className="font-semibold text-brand-ink">
              This is not the full Work-Life Balance Business Week™. It is the clarity that comes first.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              "What did you build this business for?",
              "What is your life experiencing now?",
              "What matters most right now?",
              "What needs to be protected?",
              "What might your business need to change to make that possible?",
            ].map((q) => (
              <li key={q} className="flex items-start gap-3 rounded-2xl border border-brand-blush bg-white px-5 py-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-coral/10">
                  <Sparkles className="h-3.5 w-3.5 text-brand-coral" aria-hidden />
                </span>
                <span className="font-sans text-sm font-medium text-brand-ink">{q}</span>
              </li>
            ))}
          </ul>
          <NavRow onNext={() => setStage("intention")} nextLabel="Begin" />
        </StageShell>
      )}

      {stage === "intention" && (
        <StageShell
          eyebrow="Original Entrepreneurial Intention™"
          title="What did you originally want this business to make possible in your life?"
          intro="This isn't a quiz. In each category, choose everything that feels true — all the things you hoped this business would make possible when you started."
        >
          <div className="flex flex-col gap-7">
            {INTENTION_GROUPS.map((group) => {
              const headingId = `intention-${group.id}`
              return (
                <div key={group.id} role="group" aria-labelledby={headingId}>
                  <p
                    id={headingId}
                    className="font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft mb-2.5"
                  >
                    {group.label}{" "}
                    <span className="font-normal normal-case tracking-normal">· choose all that apply</span>
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {group.items.map((item) => {
                      const active = (intentionChoices[group.id] ?? []).includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          role="checkbox"
                          aria-checked={active}
                          onClick={() => toggleIntention(group.id, item)}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left font-sans text-sm transition-colors ${
                            active
                              ? "border-brand-coral bg-brand-coral/10 text-brand-ink"
                              : "border-brand-blush bg-white text-brand-ink hover:border-brand-coral/50"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              active ? "border-brand-coral bg-brand-coral" : "border-brand-ink-soft/40 bg-white"
                            }`}
                            aria-hidden
                          >
                            {active && <Check className="h-2.5 w-2.5 text-white" />}
                          </span>
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div>
              <FieldLabel>Something else</FieldLabel>
              <TextArea
                value={somethingElse}
                onChange={setSomethingElse}
                placeholder="In your own words, what did you want this business to make possible?"
              />
            </div>

            {intentionSummary && (
              <div className="rounded-2xl border border-brand-green/30 bg-brand-green/5 px-5 py-4">
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green mb-1.5">
                  Your Original Entrepreneurial Intention™
                </p>
                <p className="font-sans text-sm leading-relaxed text-brand-ink italic">{intentionSummary}</p>
              </div>
            )}
          </div>
          <NavRow
            onBack={goBack}
            onNext={() => setStage("currentBusiness")}
            nextDisabled={selections.length === 0 && !somethingElse.trim()}
          />
        </StageShell>
      )}

      {stage === "currentBusiness" && (
        <StageShell
          eyebrow="Your Current Business™"
          title="What your business actually looks like today"
          intro={
            saved?.previousCurrentBusiness && !saved.draft
              ? "We've filled in what you told us last time. Update anything that has changed — your earlier answers stay saved with your previous report."
              : "Nine quick questions about how your business runs right now. You answer these once and update them when your circumstances change."
          }
        >
          <CurrentBusinessStep
            index={currentBusinessIndex}
            value={currentBusiness}
            onChange={(next) => setCurrentBusiness((prev) => ({ ...prev, ...next }))}
          />
          <NavRow
            onBack={() => {
              if (currentBusinessIndex === 0) goBack()
              else setCurrentBusinessIndex((i) => i - 1)
            }}
            onNext={() => {
              if (currentBusinessIndex < CURRENT_BUSINESS_QUESTIONS.length - 1) setCurrentBusinessIndex((i) => i + 1)
              else setStage("requirements")
            }}
            nextLabel={
              currentBusinessIndex === CURRENT_BUSINESS_QUESTIONS.length - 1 ? "Continue to Business Reality" : "Continue"
            }
            nextDisabled={!isCurrentBusinessQuestionComplete(currentBusinessIndex, currentBusiness)}
          />
        </StageShell>
      )}

      {stage === "audit" && (
        <StageShell
          eyebrow="Work-Life Balance Audit™"
          title="How have the past 30 days really felt?"
          intro="Answer 15 quick questions about the last 30 days across your Core Value Areas. Your answers become your 30-Day Work-Life Balance Baseline™."
        >
          <div className="overflow-hidden rounded-2xl border border-brand-blush bg-white">
            <WorkLifeBalanceAudit
              assessmentWindow="30-day"
              assessmentType="baseline_30_day"
              onComplete={completeAudit}
            />
          </div>
          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </button>
            {baseline && (
              <button
                type="button"
                onClick={() => setStage("baseline")}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 font-sans text-sm font-semibold text-brand-green transition-colors hover:brightness-90"
              >
                Use my saved baseline
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </StageShell>
      )}

      {stage === "baseline" && (
        <StageShell
          eyebrow="Your 30-Day Work-Life Balance Baseline™"
          title="How your life has really been operating"
          intro={
            baseline
              ? "Based on your Work-Life Balance Audit™, here's your baseline across all 15 Core Value Areas. Any area at 60% or below may need more protected time, space, attention, or capacity."
              : undefined
          }
        >
          {!baselineLoaded ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-brand-coral" aria-hidden />
            </div>
          ) : !baseline ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-blush bg-white py-12 text-center">
              <p className="font-sans text-sm text-brand-ink-soft max-w-sm">
                Your 30-Day Baseline comes from the Work-Life Balance Audit™. Complete it once and your baseline will
                appear here — it becomes your persistent starting point.
              </p>
              <button
                type="button"
                onClick={() => setStage("audit")}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-coral px-5 py-2.5 font-sans text-sm font-bold text-white hover:brightness-105"
              >
                Take the Audit™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-5 rounded-3xl border border-brand-blush bg-white px-6 py-6">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4"
                  style={{ borderColor: scoreColor(baseline.overall) }}>
                  <span className="font-sans text-2xl font-bold tabular-nums" style={{ color: scoreColor(baseline.overall) }}>
                    {baseline.overall}
                  </span>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-coral mb-1">
                    Overall Work-Life Balance Score™
                  </p>
                  <p className="font-sans text-sm text-brand-ink-soft text-pretty">
                    This is a starting point, not a verdict. Your first baseline is saved and never overwritten.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {baseline.areas.map((a) => (
                  <div key={a.key} className="rounded-2xl border border-brand-blush bg-white px-5 py-3.5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="font-sans text-sm font-semibold text-brand-ink">{a.label}</span>
                      <div className="flex items-center gap-2">
                        {a.isCandidate && (
                          <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-wider text-brand-coral">
                            Focus Candidate
                          </span>
                        )}
                        <span className="font-sans text-sm font-bold tabular-nums" style={{ color: scoreColor(a.score) }}>
                          {a.score}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-cream">
                      <div className="h-full rounded-full" style={{ width: `${a.score}%`, backgroundImage: scoreBarFill(a.score) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {baseline && <NavRow onBack={goBack} onNext={() => setStage("priority")} nextLabel="Choose what matters most" />}
        </StageShell>
      )}

      {stage === "priority" && (
        <StageShell
          eyebrow="Priority Focus Areas™"
          title="Which areas matter most to you right now?"
          intro="Choose one, two, or three. These become the focus of your Boundary Report™ — not everything at once, just what matters most this season."
        >
          <div className="space-y-2.5">
            {(candidateAreas.length > 0 ? candidateAreas : baseline?.areas ?? []).map((a) => {
              const active = priority.includes(a.key)
              const disabled = !active && priority.length >= 3
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => togglePriority(a.key)}
                  disabled={disabled}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    active
                      ? "border-brand-coral bg-brand-coral/5"
                      : disabled
                        ? "border-brand-blush bg-white opacity-40"
                        : "border-brand-blush bg-white hover:border-brand-coral/50"
                  }`}
                >
                  <span className="font-sans text-sm font-semibold text-brand-ink">{a.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-sans text-xs font-bold tabular-nums" style={{ color: scoreColor(a.score) }}>
                      {a.score}
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        active ? "border-brand-coral bg-brand-coral" : "border-brand-blush"
                      }`}
                    >
                      {active && <Check className="h-3 w-3 text-white" aria-hidden />}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
          <NavRow
            onBack={goBack}
            onNext={() => setStage("alignment")}
            nextLabel="Continue to Alignment"
            nextDisabled={priority.length === 0}
          />
        </StageShell>
      )}

      {stage === "requirements" && (
        <StageShell
          eyebrow="Business Reality™"
          title="What in your operating environment collides with the life you just described?"
          intro="Select whatever your diagnostic suggests may need attention. This isn't another scored assessment or a verdict — it's what the Week™ would help you determine and design."
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {REQUIREMENT_OPTIONS.map((opt) => {
              const active = requirements.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleRequirement(opt.id)}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                    active ? "border-brand-coral bg-brand-coral/5" : "border-brand-blush bg-white hover:border-brand-coral/50"
                  }`}
                >
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-brand-coral bg-brand-coral" : "border-brand-blush"}`}>
                    {active && <Check className="h-3 w-3 text-white" aria-hidden />}
                  </span>
                  <span>
                    <span className="block font-sans text-sm font-semibold text-brand-ink">{opt.label}</span>
                    <span className="block font-sans text-xs text-brand-ink-soft leading-snug">{opt.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <NavRow
            onBack={goBack}
            onNext={() => setStage("personalReality")}
            nextLabel="Continue to Personal & Work-From-Home Reality"
          />
        </StageShell>
      )}

      {stage === "personalReality" && (
        <StageShell
          eyebrow="Personal & Work-From-Home Reality™"
          title="What does your life require that the business has to make room for?"
          intro="Select any personal or work-from-home circumstances that apply right now. This isn't scored — it helps your Boundary Report™ separate what the business demands from what your life needs."
        >
          <PersonalRealityStep selected={personalReality} onToggle={togglePersonalReality} />
          <NavRow onBack={goBack} onNext={() => setStage("audit")} nextLabel="Continue to the 30-Day Audit" />
        </StageShell>
      )}

      {stage === "alignment" && (
        <AlignmentStep
          index={alignmentIndex}
          choices={alignment}
          onChoose={setAlignmentChoice}
          onBack={() => {
            if (alignmentIndex === 0) goBack()
            else setAlignmentIndex((i) => i - 1)
          }}
          onNext={() => {
            const total = ALIGNMENT_QUESTIONS.length + 1
            if (alignmentIndex < total - 1) setAlignmentIndex((i) => i + 1)
            else generateReport()
          }}
        />
      )}

      {stage === "generating" && (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-28 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-brand-coral" aria-hidden />
          <div className="space-y-1.5">
            <p className="font-playfair text-2xl font-bold text-brand-ink">Composing your Boundary Report™&hellip;</p>
            <p className="font-sans text-sm text-brand-ink-soft">Bringing your intention, baseline, and boundaries together.</p>
          </div>
        </div>
      )}

      {stage === "report" && (
        <BoundaryReport
          data={buildReport(chosenPath ?? undefined)}
          intentionSummary={intentionSummary}
          saveError={saveError}
          chosenPath={chosenPath}
          saving={saving}
          onChoosePath={choosePath}
          onboarding={onboarding}
        />
      )}
    </div>
  )
}

// ── Step 5: Work-Life Balance Alignment™ (one question at a time) ─────────────

function AlignmentStep({
  index,
  choices,
  onChoose,
  onBack,
  onNext,
}: {
  index: number
  choices: Record<string, AlignmentChoice>
  onChoose: (id: string, choice: AlignmentChoice) => void
  onBack: () => void
  onNext: () => void
}) {
  const total = ALIGNMENT_QUESTIONS.length + 1
  const isFinal = index >= ALIGNMENT_QUESTIONS.length
  const q = isFinal ? ALIGNMENT_FINAL : ALIGNMENT_QUESTIONS[index]
  const current = choices[q.id]

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-green mb-2">
        Work-Life Balance Alignment™ · {Math.min(index + 1, total)} of {total}
      </p>
      {index === 0 && (
        <p className="font-sans text-sm text-brand-ink-soft leading-relaxed text-pretty mb-6">
          Eleven short questions, one for each part of your Work-Life Balance Business Week™ — from how you start
          your day to how you end it. Answer &ldquo;Yes&rdquo; or &ldquo;Not sure yet.&rdquo; There are no wrong
          answers.
        </p>
      )}

      <div className="rounded-3xl border border-brand-green/30 bg-white px-6 py-8 sm:px-8 sm:py-10 shadow-sm">
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] text-brand-green mb-3">
          {q.title}
        </p>
        <h1
          className={`font-playfair font-bold text-brand-ink text-balance ${isFinal ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[28px] leading-snug"}`}
        >
          {q.question}
        </h1>

        <div className="mt-8 grid gap-3">
          {ALIGNMENT_CHOICES.map((c) => {
            const active = current === c.value
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onChoose(q.id, c.value)}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                  active
                    ? c.value === "willing"
                      ? "border-brand-green bg-brand-green/10"
                      : "border-brand-coral bg-brand-coral/5"
                    : "border-brand-blush bg-white hover:border-brand-green/50"
                }`}
              >
                <span className="font-sans text-base font-semibold text-brand-ink">{c.label}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active
                      ? c.value === "willing"
                        ? "border-brand-green bg-brand-green"
                        : "border-brand-coral bg-brand-coral"
                      : "border-brand-blush"
                  }`}
                >
                  {active && <Check className="h-3 w-3 text-white" aria-hidden />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!current}
        nextLabel={isFinal ? "See the Business Day™" : "Continue"}
      />
    </div>
  )
}

// ── Tour of the actual Work-Life Balance Business Day™ ────────────────────────

function TourStep({
  revealed,
  onReveal,
  onBack,
  onDone,
}: {
  revealed: number
  onReveal: () => void
  onBack: () => void
  onDone: () => void
}) {
  const allRevealed = revealed >= TOUR_MODULES.length
  return (
    <StageShell
      eyebrow="Tour · The Work-Life Balance Business Day™"
      title="This is the operating architecture you'd be stepping into."
      intro="Before you decide, experience the actual Business Day™ — the same environment you'd operate inside, revealed one boundary at a time. You're not completing the Week here; you're seeing how it's built."
    >
      <div className="space-y-3">
        {TOUR_MODULES.map((m, i) => {
          const isRevealed = i < revealed
          return (
            <div
              key={m.name}
              className={`rounded-2xl border px-5 py-4 transition-all ${
                isRevealed ? "border-brand-blush bg-white" : "border-dashed border-brand-blush/60 bg-brand-cream/40"
              }`}
            >
              {isRevealed ? (
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="font-playfair text-lg font-bold text-brand-ink">{m.name}</p>
                    <p className="font-sans text-sm text-brand-ink-soft text-pretty mt-0.5">{m.description}</p>
                  </div>
                  <span className="shrink-0 font-montserrat text-[10px] font-bold uppercase tracking-wider text-brand-green">
                    {m.window}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-1">
                  <Lock className="h-4 w-4 text-brand-ink-soft/50" aria-hidden />
                  <span className="font-sans text-sm font-medium text-brand-ink-soft/60 blur-[1.5px] select-none">
                    {m.name}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allRevealed ? (
        <NavRow onBack={onBack} onNext={onDone} nextLabel="Generate my Boundary Report™" />
      ) : (
        <NavRow onBack={onBack} onNext={onReveal} nextLabel="Reveal the next boundary" />
      )}
    </StageShell>
  )
}

// ── The report + two paths ───────────────────────────────────────────────────

function ReportBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-brand-blush py-6 first:border-t-0 first:pt-0">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-brand-coral mb-3">{label}</p>
      {children}
    </div>
  )
}

function BoundaryReport({
  data,
  intentionSummary,
  saveError,
  chosenPath,
  saving,
  onChoosePath,
  onboarding,
}: {
  data: BoundaryReportData
  intentionSummary: string
  saveError: string | null
  chosenPath: SelectedPath | null
  saving: boolean
  onChoosePath: (p: SelectedPath) => void
  onboarding: boolean
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
          Your Boundary Report Is Ready
        </p>
        <h1 className="font-playfair text-4xl font-bold text-brand-ink text-balance">
          Your Work-Life Balance Boundary Report™
        </h1>
        {onboarding && !saveError && (
          <Link
            href="/welcome/cherry-blossom/complete"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-6 py-3 font-sans text-sm font-bold text-white transition-all hover:brightness-110"
          >
            Onboarding complete — Continue to Ready for Monday
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>

      {saveError && (
        <div className="mb-6 rounded-2xl border border-[#E26C73]/40 bg-[#E26C73]/5 px-5 py-4 text-center">
          <p className="font-sans text-sm text-brand-ink">{saveError}</p>
        </div>
      )}

      <div className="rounded-3xl border border-brand-blush bg-white px-7 py-8 shadow-lg">
        <ReportBlock label="Original Entrepreneurial Intention™">
          <p className="font-sans text-sm leading-relaxed text-brand-ink italic">{intentionSummary || "—"}</p>
        </ReportBlock>

        <ReportBlock label="30-Day Work-Life Balance Baseline™">
          <p className="font-sans text-sm text-brand-ink">
            Overall Work-Life Balance Score™:{" "}
            <span className="font-bold" style={{ color: scoreColor(data.baseline.overall) }}>
              {data.baseline.overall}
            </span>
          </p>
        </ReportBlock>

        <ReportBlock label="Priority Focus Areas™">
          <div className="flex flex-wrap gap-2">
            {(data.priorityAreas ?? []).map((a) => (
              <span key={a.key} className="rounded-full bg-brand-coral/10 px-3 py-1 font-sans text-xs font-semibold text-brand-coral">
                {a.label}
              </span>
            ))}
          </div>
        </ReportBlock>

        {(data.alignmentResponses?.length ?? 0) > 0 && (
          <ReportBlock label="Work-Life Balance Alignment™">
            <p className="font-sans text-sm text-brand-ink mb-3">
              You told us you&apos;re willing to operate differently in{" "}
              <span className="font-bold text-brand-green">
                {data.alignmentResponses.filter((r) => r.choice === "willing").length}
              </span>{" "}
              of {data.alignmentResponses.length} areas this week.
            </p>
            <div className="space-y-1.5">
              {data.alignmentResponses.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-brand-cream/60 px-4 py-2.5">
                  <span className="font-sans text-sm font-medium text-brand-ink">{r.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-wider ${
                      r.choice === "willing" ? "bg-brand-green/15 text-brand-green" : "bg-brand-coral/10 text-brand-coral"
                    }`}
                  >
                    {r.choice === "willing" ? "Willing" : "Not sure yet"}
                  </span>
                </div>
              ))}
            </div>
          </ReportBlock>
        )}

        {data.businessRequirements.length > 0 && (
          <ReportBlock label="Current Boundary Collisions & Business Requirements">
            <ul className="space-y-2">
              {data.businessRequirements.map((r) => (
                <li key={r.id} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral" aria-hidden />
                  <span>
                    <span className="font-semibold">{r.label}.</span>{" "}
                    <span className="text-brand-ink-soft">Your diagnostic suggests this may need attention.</span>
                  </span>
                </li>
              ))}
            </ul>
          </ReportBlock>
        )}

        {(data.personalReality?.length ?? 0) > 0 && (
          <ReportBlock label="Personal & Work-From-Home Reality™">
            <ul className="space-y-2">
              {data.personalReality!.map((p) => (
                <li key={p.id} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" aria-hidden />
                  {p.label}
                </li>
              ))}
            </ul>
          </ReportBlock>
        )}

        <ReportBlock label={`Relevant Considerations for ${STAGE_LABELS[data.stage]}`}>
          <StartConsiderationsBlock considerations={data.startConsiderations} fallback={data.stageConsiderations} />
        </ReportBlock>
      </div>

      {/* Final decision */}
      <div className="mt-12 text-center">
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-ink leading-tight text-balance">
          Your reality.
          <br />
          Your Harmony Blueprint™.
          <br />
          Your next step.
        </h2>
      </div>

      {chosenPath === "GO_IT_ALONE" ? (
        <div className="mt-8 rounded-3xl border border-brand-green/30 bg-brand-green/5 px-7 py-8 text-center">
          <ShieldCheck className="mx-auto mb-3 h-7 w-7 text-brand-green" aria-hidden />
          <p className="font-playfair text-2xl font-bold text-brand-ink mb-2">Your Boundary Report™ is saved.</p>
          <p className="font-sans text-sm text-brand-ink-soft max-w-md mx-auto text-pretty mb-5">
            It&apos;s yours to keep. Your diagnostic data stays stored — if you ever decide to join the Work-Life
            Balance Business Week™, you won&apos;t have to repeat any of this.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/my-report"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-ink px-5 py-2.5 font-sans text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Get My Report
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/harmony-blueprint"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 px-5 py-2.5 font-sans text-sm font-bold text-brand-green transition-colors hover:bg-brand-green/5"
            >
              Harmony Blueprint™
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border-2 border-brand-coral bg-white px-6 py-7 flex flex-col">
            <p className="font-playfair text-xl font-bold text-brand-ink mb-2">Join the Work-Life Balance Business Week™</p>
            <p className="font-sans text-sm text-brand-ink-soft leading-relaxed flex-1 text-pretty">
              Take everything you just discovered into the full operating experience. Your diagnostic flows directly
              into Monday — no repeating anything.
            </p>
            <button
              type="button"
              onClick={() => onChoosePath("JOINED_WEEK")}
              disabled={saving}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-coral px-6 py-3 font-sans text-sm font-bold text-white shadow-md transition-all hover:brightness-105 disabled:opacity-50"
            >
              Join the Work-Life Balance Business Week™
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="rounded-3xl border border-brand-blush bg-white px-6 py-7 flex flex-col">
            <p className="font-playfair text-xl font-bold text-brand-ink mb-2">Get my report</p>
            <p className="font-sans text-sm text-brand-ink-soft leading-relaxed flex-1 text-pretty">
              Your report is yours whether or not you join — no purchase required. Keep it and work from it on your
              own, and revisit your Harmony Blueprint™ anytime.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                href="/my-report"
                onClick={() => onChoosePath("GO_IT_ALONE")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-ink/15 px-6 py-3 font-sans text-sm font-bold text-brand-ink transition-colors hover:bg-brand-cream"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Get My Report"}
              </Link>
              <Link
                href="/harmony-blueprint"
                className="inline-flex items-center justify-center gap-1.5 rounded-full px-6 py-2 font-sans text-sm font-semibold text-brand-green transition-colors hover:underline"
              >
                View Harmony Blueprint™
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Saved Reality Check™ editor (shown once a report exists) ─────────────────
// Mirrors the Business Context Profile™ completed summary: a "Complete" header
// with Edit Full / Continue, then one card per section with its own Edit.

function SummaryField({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="mb-0.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-[#5B835F]">{label}</p>
      <p className="font-montserrat text-sm leading-relaxed text-[#3A2E33] text-pretty">{value}</p>
    </div>
  )
}

function SummaryCard({
  title,
  onEdit,
  wide,
  children,
}: {
  title: string
  onEdit: () => void
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-[#E8E0D5] bg-white px-6 py-6 shadow-sm sm:px-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-playfair text-base font-semibold text-[#3A2E33]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-3.5 py-1.5 font-montserrat text-xs font-semibold text-[#6B5860] transition-colors hover:border-[#5B835F]/40 hover:text-[#3A2E33]"
        >
          <Pencil className="h-3 w-3" aria-hidden />
          Edit
          <span className="sr-only">{title}</span>
        </button>
      </div>
      <div className={wide ? "flex flex-col gap-3.5" : "grid gap-3.5 sm:grid-cols-2"}>{children}</div>
    </section>
  )
}

function joinOrUndefined(items: string[]) {
  return items.length ? items.join(", ") : undefined
}

function RealityCheckSummary({
  data,
  onboarding,
  onEdit,
  onViewReport,
  onRetake,
}: {
  data: BoundaryReportData
  onboarding: boolean
  onEdit: (stage: Stage) => void
  onViewReport: () => void
  onRetake: () => void
}) {
  const stage = data.currentBusiness?.stage
  const willing = (data.alignmentResponses ?? []).filter((r) => r.choice === "willing").length
  const total = data.alignmentResponses?.length ?? 0
  const priorityLabels = (data.priorityFocusAreas ?? []).map(
    (key) => data.baseline?.areas?.find((a) => a.key === key)?.label ?? CATEGORY_LABELS[key] ?? key,
  )
  const continueClass =
    "inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-bold text-white transition-colors hover:bg-[#4c6f50]"

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Work-Life Balance Reality Check™
          </span>
          <p className="mt-1 font-playfair text-xl font-medium text-[#3A2E33]">Complete</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onEdit("intention")}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-4 py-2.5 font-montserrat text-sm font-bold text-[#3A2E33] transition-colors hover:border-[#5B835F]/40"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit Full Reality Check
          </button>
          {onboarding ? (
            <Link href="/welcome/cherry-blossom/complete" className={continueClass}>
              Continue
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          ) : (
            <button type="button" onClick={onViewReport} className={continueClass}>
              View My Boundary Report™
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <SummaryCard title="Your Intention™" onEdit={() => onEdit("intention")} wide>
        <SummaryField label="Original Entrepreneurial Intention™" value={data.originalIntention?.summary || undefined} />
      </SummaryCard>

      <SummaryCard title="Your Current Business™" onEdit={() => onEdit("currentBusiness")}>
        <SummaryField label="Stage" value={stage ? STAGE_LABELS[stage] : undefined} />
        <SummaryField label="Services" value={data.currentBusiness?.services || undefined} />
      </SummaryCard>

      <SummaryCard title="Business Reality™" onEdit={() => onEdit("requirements")} wide>
        <SummaryField
          label="What Needs Attention"
          value={joinOrUndefined((data.businessRequirements ?? []).map((r) => r.label))}
        />
      </SummaryCard>

      <SummaryCard title="Business & Personal Reality™" onEdit={() => onEdit("personalReality")} wide>
        <SummaryField
          label="What Collides With Your Life"
          value={joinOrUndefined((data.personalReality ?? []).map((p) => p.label))}
        />
      </SummaryCard>

      <SummaryCard title="30-Day Work-Life Balance Baseline™" onEdit={() => onEdit("audit")}>
        <SummaryField
          label="Overall Work-Life Balance Score™"
          value={data.baseline ? `${data.baseline.overall} / 100` : undefined}
        />
        <SummaryField label="Priority Focus Areas™" value={joinOrUndefined(priorityLabels)} />
      </SummaryCard>

      <SummaryCard title="Work-Life Balance Alignment™" onEdit={() => onEdit("alignment")} wide>
        <SummaryField label="Willingness" value={total ? `Willing on ${willing} of ${total}` : undefined} />
      </SummaryCard>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onRetake}
          className="font-montserrat text-sm font-semibold text-[#6B5860] underline-offset-4 hover:text-[#3A2E33] hover:underline"
        >
          Retake from the beginning
        </button>
        {onboarding && (
          <button
            type="button"
            onClick={onViewReport}
            className="font-montserrat text-sm font-semibold text-[#5B835F] underline-offset-4 hover:underline"
          >
            View My Boundary Report™
          </button>
        )}
      </div>
    </div>
  )
}
