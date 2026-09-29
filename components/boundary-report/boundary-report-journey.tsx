"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Check, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react"
import { getAuditResults } from "@/utils/audit-storage"
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
import { saveBoundaryReport, setBoundaryReportPath } from "@/lib/boundary-report/actions"
import type {
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
  | "intro"
  | "intention"
  | "baseline"
  | "priority"
  | "requirements"
  | "stage"
  | "alignment"
  | "tour"
  | "generating"
  | "report"

const STAGE_ORDER: Stage[] = [
  "intro",
  "intention",
  "baseline",
  "priority",
  "requirements",
  "stage",
  "alignment",
  "tour",
  "report",
]

function scoreColor(score: number): string {
  if (score > 60) return "#5B835F"
  if (score >= 40) return "#E8A84E"
  return "#E26C73"
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
          className="h-full bg-gradient-to-r from-brand-coral via-[#E8A84E] to-brand-green transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
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

export function BoundaryReportJourney() {
  const [stage, setStage] = useState<Stage>("intro")

  // Intention
  const [selections, setSelections] = useState<string[]>([])
  const [somethingElse, setSomethingElse] = useState("")

  // Baseline (from the existing 15-area audit)
  const [baseline, setBaseline] = useState<{ overall: number; date: string; areas: BaselineArea[] } | null>(null)
  const [baselineLoaded, setBaselineLoaded] = useState(false)

  // Priority focus areas (keys)
  const [priority, setPriority] = useState<string[]>([])

  // Business requirements (ids) + stage
  const [requirements, setRequirements] = useState<string[]>([])
  const [stageChoice, setStageChoice] = useState<BusinessStage | null>(null)

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
    if (data) {
      const areas: BaselineArea[] = data.results.map((r) => ({
        key: r.category,
        label: r.label ?? CATEGORY_LABELS[r.category] ?? r.category,
        score: r.percentage,
        isCandidate: r.percentage <= FOCUS_THRESHOLD,
      }))
      setBaseline({
        overall: data.overallScore,
        date: new Date(data.timestamp ?? Date.now()).toISOString(),
        areas,
      })
    }
    setBaselineLoaded(true)
  }, [])

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "instant", block: "start" })
  }, [stage])

  const intentionSummary = useMemo(
    () => composeIntentionSummary(selections, somethingElse),
    [selections, somethingElse],
  )

  const candidateAreas = baseline?.areas.filter((a) => a.isCandidate) ?? []
  const priorityAreas = baseline?.areas.filter((a) => priority.includes(a.key)) ?? []

  function toggleSelection(item: string) {
    setSelections((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]))
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
    <div className="min-h-screen bg-brand-cream">
      <div ref={topRef} />
      <ProgressBar stage={stage} />

      {stage === "intro" && (
        <StageShell
          eyebrow="Weekly Work-Life Balance Reality Check™"
          title="Let's find what your business needs to protect."
          intro="This is a Sunday-afternoon diagnostic — a focused look at what you built this business for, how your life is really operating, and what might need to change. It ends with your Work-Life Balance Boundary Report™. It is not the full Business Week™; it's the clarity that comes first."
        >
          <ul className="space-y-3">
            {[
              "What did you build this business for?",
              "What is your life experiencing now?",
              "What matters most right now?",
              "What needs to be protected?",
              "What might the business need to make that possible?",
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
          intro="This isn't a quiz. Choose whatever you recognize — the things you hoped for when you started. Pick as many as feel true."
        >
          <div className="space-y-6">
            {INTENTION_GROUPS.map((group) => (
              <div key={group.id}>
                <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft mb-2.5">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const active = selections.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleSelection(item)}
                        className={`rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors ${
                          active
                            ? "border-brand-coral bg-brand-coral text-white"
                            : "border-brand-blush bg-white text-brand-ink hover:border-brand-coral/50"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

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
            onNext={() => setStage("baseline")}
            nextDisabled={selections.length === 0 && !somethingElse.trim()}
          />
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
              <Link
                href="/audit"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-coral px-5 py-2.5 font-sans text-sm font-bold text-white hover:brightness-105"
              >
                Take the Audit™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
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
                      <div className="h-full rounded-full" style={{ width: `${a.score}%`, backgroundColor: scoreColor(a.score) }} />
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
          <NavRow onBack={goBack} onNext={() => setStage("requirements")} nextDisabled={priority.length === 0} />
        </StageShell>
      )}

      {stage === "requirements" && (
        <StageShell
          eyebrow="Business & Workplace Reality™"
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
          <NavRow onBack={goBack} onNext={() => setStage("stage")} />
        </StageShell>
      )}

      {stage === "stage" && (
        <StageShell
          eyebrow="Start → Grow → Scale"
          title="Where is your business right now?"
          intro="Your stage shapes which considerations are relevant. We'll only show the ones that fit — no overwhelm."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {(["start", "grow", "scale"] as BusinessStage[]).map((s) => {
              const active = stageChoice === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStageChoice(s)}
                  className={`rounded-2xl border px-5 py-5 text-center transition-colors ${
                    active ? "border-brand-coral bg-brand-coral/5" : "border-brand-blush bg-white hover:border-brand-coral/50"
                  }`}
                >
                  <span className="block font-playfair text-lg font-bold text-brand-ink">{STAGE_LABELS[s]}</span>
                </button>
              )
            })}
          </div>

          {stageChoice && (
            <div className="mt-6 rounded-2xl border border-brand-green/30 bg-brand-green/5 px-5 py-5">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green mb-3">
                Relevant considerations for {STAGE_LABELS[stageChoice]}
              </p>
              <ul className="space-y-2">
                {STAGE_CONSIDERATIONS[stageChoice].considerations.map((c) => (
                  <li key={c} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <NavRow onBack={goBack} onNext={() => setStage("alignment")} nextLabel="Continue to Alignment" nextDisabled={!stageChoice} />
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
            else setStage("tour")
          }}
        />
      )}

      {stage === "tour" && (
        <TourStep
          revealed={tourRevealed}
          onReveal={() => setTourRevealed((n) => Math.min(n + 1, TOUR_MODULES.length))}
          onBack={() => {
            setStage("alignment")
            setAlignmentIndex(ALIGNMENT_QUESTIONS.length)
          }}
          onDone={generateReport}
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
          You built this business for more. This week, we&apos;re asking you to experience a different way of operating.
          There are no wrong answers — only honesty about what you&apos;re willing to try.
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
}: {
  data: BoundaryReportData
  intentionSummary: string
  saveError: string | null
  chosenPath: SelectedPath | null
  saving: boolean
  onChoosePath: (p: SelectedPath) => void
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

        <ReportBlock label={`Start → Grow → Scale Considerations (${STAGE_LABELS[data.stage]})`}>
          <ul className="space-y-2">
            {data.stageConsiderations.map((c) => (
              <li key={c} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
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
