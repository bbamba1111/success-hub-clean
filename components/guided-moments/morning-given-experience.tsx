"use client"

/**
 * Morning GIV•EN™ — the primary Morning Alignment Space™ experience.
 *
 * A calm, five-step guided flow (not a productivity checklist):
 *
 *   G — Gratitude              "What are you thankful for this morning?"
 *   I — Invitation + Intention Two separate entries, one after another:
 *                                 1. Invitation — "How are you inviting your
 *                                    Creator to co-create this day with you?"
 *                                 2. Intention — "What do you want from today?"
 *                                    Set using the same Cherry Blossom™
 *                                    identity-declaration technology that
 *                                    powers the Identity Installation
 *                                    System™ (/api/identity/intention +
 *                                    /api/identity/declaration, segment_id
 *                                    "morning-given"). The resulting
 *                                    declaration is what surfaces as "My
 *                                    Intention Today" above the day's
 *                                    segment cards (components/daily-
 *                                    declaration.tsx).
 *   V — Five-Sense Vision      See / Hear / Feel / Smell / Taste — adaptive
 *                               to whatever the member just asked for.
 *   E — Embody                 Who are you becoming today? (multi-select)
 *   N — Nurture                Which Non-Negotiable Sustainable Operating
 *                               Practices™ are you honoring today? (multi-select)
 *
 * Answers save progressively (after every step) via
 * utils/morning-given-storage.ts — localStorage first, best-effort Supabase
 * mirror for signed-in members — because this becomes the input layer for
 * the rest of the member's Work-Life Balance Business Day™, not a private
 * journaling exercise.
 *
 * Visually this follows the same card/progress/motion language as
 * GuidedMoments (components/guided-moments/guided-moments.tsx), but is
 * purpose-built rather than reusing that engine directly — GIV•EN needs
 * free-text reflection and adaptive five-sense prompts, not chip selection.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown, ChevronLeft, Clipboard, ClipboardCheck } from "lucide-react"
import {
  getDayKey,
  getLocalMorningGivenDay,
  saveLocalMorningGivenDay,
  syncMorningGivenDay,
  type MorningGivenDayRecord,
} from "@/utils/morning-given-storage"

type StepId = "gratitude" | "ask" | "vision" | "embody" | "nurture"
type StepStatus = "upcoming" | "open" | "confirming" | "completed"

const CONFIRMATION_MS = 6000

const STEPS: { id: StepId; letter: string; label: string }[] = [
  { id: "gratitude", letter: "G", label: "Gratitude" },
  { id: "ask", letter: "I", label: "Invitation + Intention" },
  { id: "vision", letter: "V", label: "Five-Sense Vision" },
  { id: "embody", letter: "E", label: "Embody" },
  { id: "nurture", letter: "N", label: "Nurture" },
]

// Each step's Cherry Blossom affirmation. Shown during the "confirming" pause
// AND left resting permanently under the member's own words once the step
// collapses into its completed green summary card.
const CONFIRMATIONS: Record<StepId, string> = {
  gratitude: "Gratitude has a way of steadying everything else. Beautiful place to begin.",
  ask: "Named, invited, and now carried into the rest of your day as today's Declaration™.",
  vision:
    "You didn't just picture it — you stepped inside it. Who you're becoming, what you're doing, how you're living: it's already real in here.",
  embody: "This is who you're practicing being today. Let it lead you, gently, through whatever comes.",
  nurture: "Noted, and protected. These aren't extras — they're how the rest of your day stays sustainable.",
}

// Shown as a small recap when the "I" step moves from Invitation into
// Intention, so the founder sees both entries acknowledged in sequence.
const INVITATION_CONFIRMATION =
  "You've opened the day to something bigger than your own effort. That's the Invitation."

const EMBODY_OPTIONS = [
  "Someone who exercises consistently",
  "Someone who eats nourishing food",
  "Someone who protects their relationships",
  "Someone who works a focused four-hour CEO workday",
  "Someone who enjoys Time Freedom",
  "Someone who sleeps and recovers well",
  "Someone who leads differently",
]

const NURTURE_OPTIONS = [
  "30-Minute Workday Movement Window™",
  "Focused 4-Hour CEO Workday™",
  "Family connection",
  "Time Freedom™",
  "Sleep & recovery",
  "Digital detox / Unplug",
]

const MORNING_STYLES: { emoji: string; title: string; practices: string[] }[] = [
  { emoji: "🌿", title: "The Spiritual Morning", practices: ["Prayer", "Scripture", "Meditation", "GIV•EN™"] },
  { emoji: "⚡", title: "The High-Energy Morning", practices: ["Breath", "Movement", "Music", "Visualization"] },
  { emoji: "🧘", title: "The Quiet Morning", practices: ["Meditation", "Reflection", "Reading", "Stillness"] },
  { emoji: "🎨", title: "The Creative Morning", practices: ["Writing", "Art", "Music", "Visualization"] },
  { emoji: "🌳", title: "The Nature Morning", practices: ["Outdoor time", "Walking", "Reflection", "Morning light"] },
  { emoji: "🎯", title: "The Executive Morning", practices: ["Reflection", "Intention", "Strategic thinking", "Priorities"] },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "The Family Morning",
    practices: [
      "Family connection",
      "Breakfast together",
      "Conversation",
      "Shared gratitude",
      "Prayer or spiritual practice",
      "Getting children ready",
      "Music",
      "Affection",
      "Intentional connection",
      "Beginning the day together",
    ],
  },
  { emoji: "🛌", title: "The Recovery Morning", practices: ["Sleep", "Gentle movement", "Breath", "Gratitude", "Slow start"] },
  { emoji: "❤️", title: "The Connection Morning", practices: ["Family", "Partner", "Friendship", "Community", "Conversation"] },
  { emoji: "📚", title: "The Learning Morning", practices: ["Reading", "Listening", "Studying", "Reflection"] },
  {
    emoji: "🌸",
    title: "The Spiritual + Science Morning",
    practices: ["GIV•EN™", "Mindfulness", "Breathwork", "Visualization", "Evidence-informed wellbeing practices"],
  },
]

function emptyDraft(): MorningGivenDayRecord {
  const dayKey = getDayKey()
  return {
    dayKey,
    gratitude: "",
    invitation: "",
    intention: "",
    intentionDeclaration: null,
    visionSee: "",
    visionHear: "",
    visionFeel: "",
    visionSmell: "",
    visionTaste: "",
    embody: [],
    nurture: [],
    stepCompleted: "gratitude",
    completedAt: null,
  }
}

export function MorningGivenExperience() {
  const [draft, setDraft] = useState<MorningGivenDayRecord>(emptyDraft)
  const [activeIndex, setActiveIndex] = useState(0)
  const [completedThrough, setCompletedThrough] = useState(-1)
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from localStorage on mount (today's session may already be in progress).
  useEffect(() => {
    const existing = getLocalMorningGivenDay(getDayKey())
    if (existing) {
      setDraft(existing)
      // "invitation" and "intention" are both internal sub-entries of the
      // single "ask" (I) step in STEPS — they resolve to that step's index.
      const stepCompleted = existing.stepCompleted
      const idx =
        stepCompleted === "invitation" || stepCompleted === "intention"
          ? STEPS.findIndex((s) => s.id === "ask")
          : STEPS.findIndex((s) => s.id === stepCompleted)
      if (existing.completedAt) {
        setCompletedThrough(STEPS.length - 1)
        setActiveIndex(STEPS.length)
      } else if (idx > 0) {
        setCompletedThrough(idx - 1)
        setActiveIndex(idx)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    }
  }, [])

  const isSummary = completedThrough >= STEPS.length - 1 && confirmingIndex === null

  function statusFor(index: number): StepStatus {
    if (confirmingIndex === index) return "confirming"
    if (index <= completedThrough) return "completed"
    if (index === activeIndex) return "open"
    return "upcoming"
  }

  function persist(patch: Partial<MorningGivenDayRecord>, stepCompleted: MorningGivenDayRecord["stepCompleted"]) {
    const next = saveLocalMorningGivenDay(draft.dayKey, { ...patch, stepCompleted })
    setDraft(next)
    void syncMorningGivenDay(next)
    return next
  }

  function advance(index: number, patch: Partial<MorningGivenDayRecord>, nextStep: MorningGivenDayRecord["stepCompleted"]) {
    setConfirmingIndex(index)
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    confirmTimerRef.current = setTimeout(() => {
      setConfirmingIndex(null)
      setCompletedThrough((prev) => Math.max(prev, index))
      setActiveIndex(index + 1)
      persist(patch, nextStep)
    }, CONFIRMATION_MS)
  }

  // Saves the Invitation entry without advancing the step or triggering the
  // confirmation pause — the "I" card stays open and moves straight into its
  // second entry, Intention.
  function saveInvitation(value: string) {
    persist({ invitation: value }, "invitation")
  }

  function handlePrevious(index: number) {
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    setConfirmingIndex(null)
    setCompletedThrough(index - 1)
    setActiveIndex(index)
  }

  function handleComplete() {
  const next = persist({}, "complete")
  const withCompletedAt = saveLocalMorningGivenDay(next.dayKey, { completedAt: new Date().toISOString() })
  setDraft(withCompletedAt)
  void syncMorningGivenDay(withCompletedAt)
  // Lets DailyDeclaration ("My Intention Today," above the day's segment
  // cards) refetch immediately instead of waiting for a full page reload.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("morning-given:completed"))
  }
  }

  const summaryText = useMemo(() => {
    const lines = [
      "MY MORNING ALIGNMENT",
      draft.gratitude && `Gratitude: ${draft.gratitude}`,
      draft.invitation && `Invitation: ${draft.invitation}`,
      draft.intention && `Intention: ${draft.intention}`,
      (draft.visionSee || draft.visionHear || draft.visionFeel || draft.visionSmell || draft.visionTaste) &&
        "Vision:",
      draft.visionSee && `  See: ${draft.visionSee}`,
      draft.visionHear && `  Hear: ${draft.visionHear}`,
      draft.visionFeel && `  Feel: ${draft.visionFeel}`,
      draft.visionSmell && `  Smell: ${draft.visionSmell}`,
      draft.visionTaste && `  Taste: ${draft.visionTaste}`,
      draft.embody.length > 0 && `Embody: ${draft.embody.join(", ")}`,
      draft.nurture.length > 0 && `Nurture: ${draft.nurture.join(", ")}`,
    ].filter(Boolean)
    return lines.join("\n")
  }, [draft])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard permission denied or unavailable — fail silently.
    }
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Intro — sets the tone before the flow begins */}
      <div className="rounded-2xl border border-brand-green/15 bg-brand-green/[0.04] px-5 py-4">
        <p className="font-sans text-sm leading-relaxed text-brand-ink">
          You have permission to begin your day in a way that aligns with the life you are creating.
          There&apos;s nowhere to rush to — just five gentle moments, one at a time.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 flex-wrap" role="list" aria-label="Morning GIV•EN progress">
        {STEPS.map((step, index) => {
          const status = statusFor(index)
          const isDone = status === "completed"
          const isCurrent = status === "open" || status === "confirming"
          return (
            <div key={step.id} className="flex items-center gap-2" role="listitem">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold transition-colors ${
                  isDone
                    ? "bg-brand-green text-white"
                    : isCurrent
                      ? "bg-brand-green/15 text-brand-green-dark ring-2 ring-brand-green/40"
                      : "bg-black/[0.05] text-brand-ink-soft/50"
                }`}
                aria-current={isCurrent ? "step" : undefined}
                title={step.label}
              >
                {isDone ? <Check className="h-3.5 w-3.5" aria-hidden /> : step.letter}
              </span>
              {index < STEPS.length - 1 && (
                <span className={`h-px w-6 ${isDone ? "bg-brand-green/50" : "bg-black/10"}`} aria-hidden />
              )}
            </div>
          )
        })}
        <span className="ml-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/60">
          {isSummary ? "Complete" : `${STEPS[Math.min(activeIndex, STEPS.length - 1)].label}`}
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const status = statusFor(index)
          if (status === "upcoming") return null
          return (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              status={status}
              draft={draft}
              onAdvance={advance}
              onSaveInvitation={saveInvitation}
              onPrevious={handlePrevious}
              showPrevious={index > 0}
            />
          )
        })}
      </div>

      {/* Summary — "My Morning Alignment" */}
      {isSummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-brand-green/20 bg-brand-green/[0.06] px-5 py-6 sm:px-7"
        >
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green-dark/70">
            My Morning Alignment
          </p>

          <div className="mt-3 space-y-3">
            {draft.gratitude && (
              <AlignmentLine label="Gratitude" value={draft.gratitude} />
            )}
            {draft.invitation && <AlignmentLine label="Invitation" value={draft.invitation} />}
            {draft.intention && (
              <AlignmentLine label="Intention" value={draft.intentionDeclaration || draft.intention} />
            )}
            {(draft.visionSee || draft.visionHear || draft.visionFeel || draft.visionSmell || draft.visionTaste) && (
              <div>
                <p className="font-sans text-sm font-semibold text-brand-ink">Vision</p>
                <ul className="mt-1 space-y-1">
                  {draft.visionSee && <SenseLine emoji="👁" label="See" value={draft.visionSee} />}
                  {draft.visionHear && <SenseLine emoji="👂" label="Hear" value={draft.visionHear} />}
                  {draft.visionFeel && <SenseLine emoji="🤲" label="Feel" value={draft.visionFeel} />}
                  {draft.visionSmell && <SenseLine emoji="👃" label="Smell" value={draft.visionSmell} />}
                  {draft.visionTaste && <SenseLine emoji="👅" label="Taste" value={draft.visionTaste} />}
                </ul>
              </div>
            )}
            {draft.embody.length > 0 && (
              <ChipListLine label="Embody" items={draft.embody} />
            )}
            {draft.nurture.length > 0 && (
              <ChipListLine label="Nurture" items={draft.nurture} />
            )}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-brand-coral/15 bg-white/60 px-4 py-3">
            <span className="text-lg leading-none" aria-hidden>
              🌸
            </span>
            <p className="font-sans text-sm leading-relaxed text-brand-ink">
              Beautiful. You&apos;ve aligned yourself before the day asked anything of you. Carry this with you —
              it&apos;s yours to return to all day long.
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-brand-green-dark transition-colors hover:bg-brand-green/5"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="h-4 w-4" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" aria-hidden />
                  Copy My Morning Alignment
                </>
              )}
            </button>
            {!draft.completedAt && (
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-5 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark"
              >
                Begin My Day
              </button>
            )}
          </div>

          {/* Cherry Blossom's acknowledgment once the founder taps "Begin My Day" */}
          {draft.completedAt && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 flex items-start gap-3 rounded-xl border border-brand-green/20 bg-white/70 px-4 py-4"
            >
              <span className="text-lg leading-none" aria-hidden>
                🌸
              </span>
              <div className="space-y-2 font-sans text-sm leading-relaxed text-brand-ink">
                <p>
                  Beautifully done — your Morning GIV•EN™ is complete. You&apos;re starting today already grounded:
                  clear on what you&apos;re grateful for, what you&apos;re inviting in, and who you&apos;re
                  practicing being. That steadiness is doing real work before your first task even begins.
                </p>
                <p>
                  About 5 minutes before this segment ends, Cherry Blossom Check-in™ will check in with you to see
                  how your Morning GIV•EN™ went.
                </p>
                <p>
                  If you still have a few minutes before Flex Time™ begins, feel free to explore a Morning Style
                  below — it&apos;s a gentle way to keep shaping the tone of your Work-Life Balance Business Day™.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Explore a Morning Style — secondary, informational only */}
      {isSummary && (
        <div className="rounded-2xl border border-brand-blush bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowStyles((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-black/[0.02] transition-colors"
            aria-expanded={showStyles}
          >
            <span className="font-sans text-sm font-bold text-brand-ink">Explore a Morning Style</span>
            <ChevronDown
              className={`h-4 w-4 text-brand-ink-soft/60 transition-transform duration-200 ${showStyles ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
          {showStyles && (
            <div className="border-t border-brand-blush px-5 py-5">
              <p className="mb-4 font-sans text-sm text-brand-ink-soft">
                These are discovery categories, not requirements — a starting point if you&apos;d like to shape how
                your GIV•EN™ time feels tomorrow.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {MORNING_STYLES.map((style) => (
                  <div key={style.title} className="rounded-xl border border-brand-blush bg-brand-cream/40 px-4 py-3.5">
                    <p className="flex items-center gap-2 font-sans text-sm font-bold text-brand-ink">
                      <span aria-hidden>{style.emoji}</span>
                      {style.title}
                    </p>
                    <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-brand-ink-soft">
                      {style.practices.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AlignmentLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-sans text-sm font-semibold text-brand-ink">{label}</p>
      <p className="mt-0.5 font-sans text-sm leading-relaxed text-brand-ink-soft">{value}</p>
    </div>
  )
}

function SenseLine({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <li className="flex items-start gap-2 font-sans text-sm text-brand-ink-soft">
      <span aria-hidden>{emoji}</span>
      <span>
        <strong className="font-semibold text-brand-ink">{label}:</strong> {value}
      </span>
    </li>
  )
}

function ChipListLine({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="font-sans text-sm font-semibold text-brand-ink">{label}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 font-sans text-[15px] text-brand-ink">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-white">
              <Check className="h-3 w-3" aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StepCard — renders whichever of the 5 GIV•EN steps is currently active.
// ---------------------------------------------------------------------------

interface StepCardProps {
  step: { id: StepId; letter: string; label: string }
  index: number
  status: StepStatus
  draft: MorningGivenDayRecord
  onAdvance: (index: number, patch: Partial<MorningGivenDayRecord>, nextStep: MorningGivenDayRecord["stepCompleted"]) => void
  onSaveInvitation: (value: string) => void
  onPrevious: (index: number) => void
  showPrevious: boolean
}

function StepCard({ step, index, status, draft, onAdvance, onSaveInvitation, onPrevious, showPrevious }: StepCardProps) {
  if (status === "completed") {
    return <CompletedStepCard step={step} draft={draft} onPrevious={() => onPrevious(index)} />
  }

  if (step.id === "gratitude") {
    return (
      <FreeTextStepCard
        status={status}
        question="What are you thankful for this morning?"
        helperText="Take a breath. Let one or two things come to mind."
        confirmation={CONFIRMATIONS.gratitude}
        placeholder="I'm thankful for..."
        initialValue={draft.gratitude}
        onContinue={(value) => onAdvance(index, { gratitude: value }, "ask")}
        onPrevious={showPrevious ? () => onPrevious(index) : undefined}
      />
    )
  }

  if (step.id === "ask") {
    return (
      <InvitationIntentionStepCard
        status={status}
        initialInvitation={draft.invitation}
        initialIntention={draft.intention}
        onSaveInvitation={onSaveInvitation}
        onAdvance={(patch) => onAdvance(index, patch, "vision")}
        onPrevious={showPrevious ? () => onPrevious(index) : undefined}
      />
    )
  }

  if (step.id === "vision") {
    return (
      <VisionStepCard
        status={status}
        intention={draft.intentionDeclaration || draft.intention}
        initial={draft}
        onContinue={(vision) => onAdvance(index, vision, "embody")}
        onPrevious={showPrevious ? () => onPrevious(index) : undefined}
      />
    )
  }

  if (step.id === "embody") {
    return (
      <MultiSelectStepCard
        status={status}
        question="Who are you becoming today?"
        helperText="Select all that apply — this is about identity, not a to-do list."
        confirmation={CONFIRMATIONS.embody}
        options={EMBODY_OPTIONS}
        initialValue={draft.embody}
        onContinue={(value) => onAdvance(index, { embody: value }, "nurture")}
        onPrevious={showPrevious ? () => onPrevious(index) : undefined}
      />
    )
  }

  // nurture
  return (
    <MultiSelectStepCard
      status={status}
      question="Which Non-Negotiable Sustainable Operating Practices™ are you honoring today?"
      helperText="Select all that apply."
      confirmation={CONFIRMATIONS.nurture}
      options={NURTURE_OPTIONS}
      initialValue={draft.nurture}
      onContinue={(value) => onAdvance(index, { nurture: value }, "complete")}
      onPrevious={showPrevious ? () => onPrevious(index) : undefined}
    />
  )
}

function CompletedStepCard({
  step,
  draft,
  onPrevious,
}: {
  step: { id: StepId; letter: string; label: string }
  draft: MorningGivenDayRecord
  onPrevious: () => void
}) {
  const summary = (() => {
    switch (step.id) {
      case "gratitude":
        return draft.gratitude
      case "ask":
        return [draft.invitation && `Invitation: ${draft.invitation}`, draft.intention && `Intention: ${draft.intention}`]
          .filter(Boolean)
          .join("  ·  ")
      case "vision":
        return [draft.visionSee, draft.visionHear, draft.visionFeel, draft.visionSmell, draft.visionTaste]
          .filter(Boolean)
          .join(" · ")
      case "embody":
        return draft.embody.join(" · ")
      case "nurture":
        return draft.nurture.join(" · ")
    }
  })()

  // The "I" step shows Cherry Blossom's actual generated declaration when
  // available, instead of the generic static confirmation line.
  const note = step.id === "ask" && draft.intentionDeclaration ? draft.intentionDeclaration : CONFIRMATIONS[step.id]

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border-2 border-brand-green/30 bg-brand-green/[0.07] px-5 py-4 shadow-sm">
      <div>
        <p className="font-sans text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green-dark">
          {step.letter} — {step.label}
        </p>
        <p className="mt-1 font-sans text-sm text-brand-ink-soft">{summary}</p>
        <div className="mt-3 flex items-start gap-2 border-t border-brand-green/15 pt-3">
          <span className="text-base leading-none" aria-hidden>
            🌸
          </span>
          <p className="font-sans text-sm leading-relaxed text-brand-green-dark/80">{note}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-brand-green-dark/70 transition-colors hover:text-brand-green-dark"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Previous
        </button>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white">
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// FreeTextStepCard — Gratitude & Ask (Invitation + Intention)
// ---------------------------------------------------------------------------

interface FreeTextStepCardProps {
  status: StepStatus
  question: string
  helperText?: string
  confirmation: string
  placeholder: string
  initialValue: string
  multiline?: boolean
  onContinue: (value: string) => void
  onPrevious?: () => void
}

function FreeTextStepCard({
  status,
  question,
  helperText,
  confirmation,
  placeholder,
  initialValue,
  multiline,
  onContinue,
  onPrevious,
}: FreeTextStepCardProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-6 sm:px-7">
      <AnimatePresence mode="wait">
        {status === "confirming" ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/50">
              Your words
            </p>
            <p className="mt-1.5 font-playfair text-lg leading-snug text-brand-ink text-balance">
              &ldquo;{value}&rdquo;
            </p>
            <div className="mt-4 flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden>
                🌸
              </span>
              <p className="font-sans text-[15px] leading-relaxed text-brand-ink">{confirmation}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="question" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">{question}</h4>
            {helperText && <p className="mt-1 font-sans text-sm text-brand-ink-soft">{helperText}</p>}

            {multiline ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="mt-4 w-full rounded-xl border border-brand-blush bg-white px-4 py-3 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="mt-4 w-full rounded-xl border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              />
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => value.trim() && onContinue(value.trim())}
                disabled={!value.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// InvitationIntentionStepCard — the "I" step, two separate entries:
//   1. Invitation — free text, saved immediately, no Cherry Blossom call.
//   2. Intention — free text, then run through the same Cherry Blossom™
//      identity-declaration technology as the rest of Identity Installation™
//      (POST /api/identity/intention → POST /api/identity/declaration,
//      segment_id "morning-given"). The resulting declaration is what
//      DailyDeclaration reads back as "My Intention Today."
// ---------------------------------------------------------------------------

function InvitationIntentionStepCard({
  status,
  initialInvitation,
  initialIntention,
  onSaveInvitation,
  onAdvance,
  onPrevious,
}: {
  status: StepStatus
  initialInvitation: string
  initialIntention: string
  onSaveInvitation: (value: string) => void
  onAdvance: (patch: { invitation: string; intention: string; intentionDeclaration: string | null }) => void
  onPrevious?: () => void
}) {
  const [entry, setEntry] = useState<"invitation" | "intention">(initialInvitation ? "intention" : "invitation")
  const [invitationValue, setInvitationValue] = useState(initialInvitation)
  const [intentionValue, setIntentionValue] = useState(initialIntention)
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState(false)

  function handleInvitationContinue() {
    const value = invitationValue.trim()
    if (!value) return
    onSaveInvitation(value)
    setEntry("intention")
  }

  async function handleIntentionContinue() {
    const value = intentionValue.trim()
    if (!value || generating) return

    setGenerating(true)
    setGenerationError(false)

    let declaration: string | null = null
    try {
      const intentionRes = await fetch("/api/identity/intention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segment_id: "morning-given", intention_notes: value }),
      })

      if (intentionRes.ok) {
        const { intention: savedIntention } = await intentionRes.json()

        const declarationRes = await fetch("/api/identity/declaration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intention_id: savedIntention.id,
            segment_id: "morning-given",
            intention_notes: value,
          }),
        })

        if (declarationRes.ok && declarationRes.body) {
          const reader = declarationRes.body.getReader()
          const decoder = new TextDecoder()
          let fullText = ""
          let done = false
          while (!done) {
            const { value: chunk, done: readerDone } = await reader.read()
            done = readerDone
            if (chunk) fullText += decoder.decode(chunk)
          }
          declaration = fullText.split("---WHY---")[0].trim() || null
        }
      }
    } catch (error) {
      console.error("[v0] Cherry Blossom intention declaration failed:", error)
      setGenerationError(true)
    }

    setGenerating(false)
    onAdvance({ invitation: invitationValue.trim(), intention: value, intentionDeclaration: declaration })
  }

  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-6 sm:px-7">
      <AnimatePresence mode="wait">
        {status === "confirming" ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/50">
              Your words
            </p>
            <p className="mt-1.5 font-playfair text-lg leading-snug text-brand-ink text-balance">
              &ldquo;{intentionValue}&rdquo;
            </p>
            <div className="mt-4 flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden>
                🌸
              </span>
              <p className="font-sans text-[15px] leading-relaxed text-brand-ink">{CONFIRMATIONS.ask}</p>
            </div>
          </motion.div>
        ) : entry === "invitation" ? (
          <motion.div key="invitation" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">
              How are you inviting your Creator to co-create this day with you?
            </h4>
            <p className="mt-1 font-sans text-sm text-brand-ink-soft">This is your Invitation — name it plainly.</p>

            <textarea
              value={invitationValue}
              onChange={(e) => setInvitationValue(e.target.value)}
              placeholder="I'm inviting..."
              rows={3}
              className="mt-4 w-full rounded-xl border border-brand-blush bg-white px-4 py-3 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            />

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleInvitationContinue}
                disabled={!invitationValue.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="intention" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {invitationValue && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-brand-blush/20 px-4 py-3">
                <span className="text-base leading-none" aria-hidden>
                  🌸
                </span>
                <p className="font-sans text-sm leading-relaxed text-brand-ink-soft">{INVITATION_CONFIRMATION}</p>
              </div>
            )}
            <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">What do you want from today?</h4>
            <p className="mt-1 font-sans text-sm text-brand-ink-soft">
              This is your Intention — Cherry Blossom™ will turn it into today&apos;s Declaration.
            </p>

            <textarea
              value={intentionValue}
              onChange={(e) => setIntentionValue(e.target.value)}
              placeholder="Today, I want..."
              rows={3}
              disabled={generating}
              className="mt-4 w-full rounded-xl border border-brand-blush bg-white px-4 py-3 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 disabled:opacity-60"
            />

            {generationError && (
              <p className="mt-2 font-sans text-xs text-brand-ink-soft">
                Cherry Blossom couldn&apos;t reach your declaration just now — your intention is still saved, and
                you can move forward.
              </p>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleIntentionContinue}
                disabled={!intentionValue.trim() || generating}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? "Setting your intention…" : "Continue"}
              </button>
              <button
                type="button"
                onClick={() => setEntry("invitation")}
                className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// VisionStepCard — Five-Sense Visualization, adaptive to the member's Ask
// ---------------------------------------------------------------------------

interface VisionFields {
  visionSee: string
  visionHear: string
  visionFeel: string
  visionSmell: string
  visionTaste: string
}

function VisionStepCard({
  status,
  intention,
  initial,
  onContinue,
  onPrevious,
}: {
  status: StepStatus
  intention: string
  initial: VisionFields
  onContinue: (vision: VisionFields) => void
  onPrevious?: () => void
}) {
  const [fields, setFields] = useState<VisionFields>({
    visionSee: initial.visionSee,
    visionHear: initial.visionHear,
    visionFeel: initial.visionFeel,
    visionSmell: initial.visionSmell,
    visionTaste: initial.visionTaste,
  })

  const hint = intention.trim()
    ? `Step into "${intention.trim()}" — you're already living it.`
    : "Step into the day you're creating — you're already living it."
  const hasAny = Object.values(fields).some((v) => v.trim().length > 0)

  const senses: { key: keyof VisionFields; emoji: string; label: string; prompt: string }[] = [
    { key: "visionSee", emoji: "👁", label: "See", prompt: "What do you see?" },
    { key: "visionHear", emoji: "👂", label: "Hear", prompt: "What do you hear?" },
    { key: "visionFeel", emoji: "🤲", label: "Feel", prompt: "What do you feel — physically and emotionally?" },
    { key: "visionSmell", emoji: "👃", label: "Smell", prompt: "What do you smell?" },
    { key: "visionTaste", emoji: "👅", label: "Taste", prompt: "What do you taste?" },
  ]

  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-6 sm:px-7">
      <AnimatePresence mode="wait">
        {status === "confirming" ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/50">
              Your vision
            </p>
            <ul className="mt-2 space-y-1.5">
              {senses
                .filter((sense) => fields[sense.key].trim())
                .map((sense) => (
                  <li key={sense.key} className="flex items-start gap-2 font-sans text-sm text-brand-ink">
                    <span className="leading-none" aria-hidden>
                      {sense.emoji}
                    </span>
                    <span>{fields[sense.key]}</span>
                  </li>
                ))}
            </ul>
            <div className="mt-4 flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden>
                🌸
              </span>
              <p className="font-sans text-[15px] leading-relaxed text-brand-ink">{CONFIRMATIONS.vision}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="question" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">
              Visualize yourself living it — with all five senses.
            </h4>
            <p className="mt-1 font-sans text-sm text-brand-ink-soft">{hint}</p>

            <div className="mt-4 space-y-3">
              {senses.map((sense) => (
                <div key={sense.key}>
                  <label htmlFor={`sense-${sense.key}`} className="mb-1 flex items-center gap-2 font-sans text-sm font-semibold text-brand-ink">
                    <span aria-hidden>{sense.emoji}</span>
                    {sense.prompt}
                  </label>
                  <input
                    id={`sense-${sense.key}`}
                    type="text"
                    value={fields[sense.key]}
                    onChange={(e) => setFields((prev) => ({ ...prev, [sense.key]: e.target.value }))}
                    placeholder={`${sense.label}...`}
                    className="w-full rounded-xl border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/40 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                  />
                </div>
              ))}
            </div>

            <p className="mt-4 font-sans text-xs font-medium uppercase tracking-[0.1em] text-brand-ink-soft/60">
              Who are you becoming? What are you doing? How are you living?
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => hasAny && onContinue(fields)}
                disabled={!hasAny}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MultiSelectStepCard — Embody & Nurture
// ---------------------------------------------------------------------------

function MultiSelectStepCard({
  status,
  question,
  helperText,
  confirmation,
  options,
  initialValue,
  onContinue,
  onPrevious,
}: {
  status: StepStatus
  question: string
  helperText?: string
  confirmation: string
  options: string[]
  initialValue: string[]
  onContinue: (value: string[]) => void
  onPrevious?: () => void
}) {
  const [chosen, setChosen] = useState<string[]>(initialValue)

  function toggle(option: string) {
    setChosen((prev) => (prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]))
  }

  return (
    <div className="rounded-2xl border border-brand-blush bg-white px-5 py-6 sm:px-7">
      <AnimatePresence mode="wait">
        {status === "confirming" ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/50">
              Your choices
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {chosen.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 font-sans text-sm font-medium text-brand-green-dark"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  {option}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3">
              <span className="text-xl leading-none" aria-hidden>
                🌸
              </span>
              <p className="font-sans text-[15px] leading-relaxed text-brand-ink">{confirmation}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="question" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <h4 className="font-playfair text-xl font-semibold text-brand-ink text-balance">{question}</h4>
            {helperText && <p className="mt-1 font-sans text-sm text-brand-ink-soft">{helperText}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {options.map((option) => {
                const selected = chosen.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle(option)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                      selected
                        ? "border-brand-green bg-brand-green/10 text-brand-green-dark"
                        : "border-brand-blush bg-white text-brand-ink-soft hover:border-brand-green/40 hover:text-brand-green-dark"
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                    {option}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => chosen.length > 0 && onContinue(chosen)}
                disabled={chosen.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-2.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              {onPrevious && (
                <button
                  type="button"
                  onClick={onPrevious}
                  className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MorningGivenExperience
