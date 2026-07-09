"use client"

import { useState } from "react"
import { Check, ChevronDown, Sparkles, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PHASES,
  REALITY_CHECK_ITEMS,
  DELEGATION_CATEGORIES,
  DESIGN_SEGMENTS,
  COMMIT_SUMMARY,
  CLOSING_GUIDANCE,
  type PhaseId,
  type PlaceholderItem,
  type SegmentCard,
} from "@/components/sunday-design-day/sdd-config"

export function SundayDesignDayFlow() {
  // The phase currently expanded. Members move forward one phase at a time.
  const [activeIndex, setActiveIndex] = useState(0)
  // Phases the member has completed (advanced past).
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [finished, setFinished] = useState(false)

  function advance(index: number) {
    setCompleted((prev) => new Set(prev).add(index))
    if (index < PHASES.length - 1) {
      setActiveIndex(index + 1)
    } else {
      setFinished(true)
    }
  }

  return (
    <div className="ds-container max-w-5xl py-10 sm:py-14">
      <FlowHeader />

      <ProgressSpine activeIndex={activeIndex} completed={completed} onSelect={setActiveIndex} />

      <div className="mt-8 space-y-4">
        {PHASES.map((phase, index) => (
          <PhaseSection
            key={phase.id}
            index={index}
            open={activeIndex === index}
            isComplete={completed.has(index)}
            isLocked={index > activeIndex && !completed.has(index)}
            onToggle={() => setActiveIndex(index)}
            onAdvance={() => advance(index)}
          >
            <PhaseBody id={phase.id} />
          </PhaseSection>
        ))}
      </div>

      {finished && <FinishedNote />}
    </div>
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

function ProgressSpine({
  activeIndex,
  completed,
  onSelect,
}: {
  activeIndex: number
  completed: Set<number>
  onSelect: (i: number) => void
}) {
  return (
    <nav aria-label="Sunday Design Day progress" className="mt-10">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
        {PHASES.map((phase, index) => {
          const isComplete = completed.has(index)
          const isActive = activeIndex === index
          const reachable = isComplete || index <= activeIndex
          return (
            <li key={phase.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => reachable && onSelect(index)}
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
                  className={`text-sm font-medium leading-tight ${
                    isActive ? "text-brand-ink" : "text-brand-ink-soft"
                  }`}
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
  index,
  open,
  isComplete,
  isLocked,
  onToggle,
  onAdvance,
  children,
}: {
  index: number
  open: boolean
  isComplete: boolean
  isLocked: boolean
  onToggle: () => void
  onAdvance: () => void
  children: React.ReactNode
}) {
  const phase = PHASES[index]
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
          {/* Cherry Blossom Guidance™ */}
          <GuidanceNote>{phase.guidance}</GuidanceNote>

          <div className="mt-6">{children}</div>

          <div className="mt-8 flex justify-end">
            <Button onClick={onAdvance} className="ds-btn-primary">
              {phase.cta}
              <ArrowRight className="ds-icon-sm" aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ---- Phase bodies ------------------------------------------------------- */

function PhaseBody({ id }: { id: PhaseId }) {
  switch (id) {
    case "reality-check":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {REALITY_CHECK_ITEMS.map((item) => (
            <PlaceholderCard key={item.title} item={item} />
          ))}
        </div>
      )
    case "download-delegate":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DELEGATION_CATEGORIES.map((item) => (
            <PlaceholderCard key={item.title} item={item} hideAction />
          ))}
        </div>
      )
    case "design-tomorrow":
      return (
        <div className="space-y-4">
          {DESIGN_SEGMENTS.map((segment) => (
            <SegmentPlaceholder key={segment.title} segment={segment} />
          ))}
        </div>
      )
    case "commit-prepare":
      return (
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMMIT_SUMMARY.map((item) => (
              <PlaceholderCard key={item.title} item={item} hideAction />
            ))}
          </div>
          <div className="harmony-glass mt-6 p-6 sm:p-7">
            <div className="flex items-center gap-2 text-brand-green-dark">
              <Sparkles className="ds-icon-sm" aria-hidden />
              <span className="ds-eyebrow text-brand-green-dark/80">Cherry Blossom Guidance™</span>
            </div>
            <p className="mt-3 font-serif text-lg italic leading-relaxed text-brand-ink text-pretty">
              {CLOSING_GUIDANCE}
            </p>
          </div>
        </div>
      )
    default:
      return null
  }
}

/* ---- Building blocks ---------------------------------------------------- */

function GuidanceNote({ children }: { children: React.ReactNode }) {
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

function PlaceholderCard({ item, hideAction }: { item: PlaceholderItem; hideAction?: boolean }) {
  return (
    <div className="harmony-surface flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-brand-ink text-pretty">{item.title}</h3>
        {item.tag && <span className="ds-badge-neutral shrink-0">{item.tag}</span>}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{item.description}</p>
      {!hideAction && (
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-brand-ink-soft">
          Coming Next
        </span>
      )}
    </div>
  )
}

function SegmentPlaceholder({ segment }: { segment: SegmentCard }) {
  const isCeo = Boolean(segment.ceoBlocks)
  return (
    <div className={`harmony-surface p-5 sm:p-6 ${isCeo ? "border-brand-green/25 bg-brand-green/[0.04]" : ""}`}>
      <h3 className="font-display text-lg font-semibold text-brand-ink text-pretty">{segment.title}</h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {segment.modules.map((module) => (
          <span
            key={module}
            className="inline-flex items-center rounded-md border border-black/[0.06] bg-card px-2.5 py-1 text-xs font-medium text-brand-ink-soft"
          >
            {module}
          </span>
        ))}
      </div>

      {segment.ceoBlocks && (
        <ol className="mt-5 space-y-2.5 border-t border-black/[0.06] pt-5">
          {segment.ceoBlocks.map((block, i) => (
            <li key={block.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-xs font-semibold text-brand-green-dark">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-ink">{block.title}</span>
                <span className="block text-sm leading-relaxed text-brand-ink-soft">{block.description}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

function FinishedNote() {
  return (
    <div className="harmony-glass mt-6 p-6 text-center sm:p-8">
      <div className="flex items-center justify-center gap-2 text-brand-green-dark">
        <Check className="ds-icon-sm" aria-hidden />
        <span className="ds-eyebrow text-brand-green-dark/80">Sunday Design Day™ Complete</span>
      </div>
      <p className="mx-auto mt-3 max-w-xl font-serif text-lg italic leading-relaxed text-brand-ink text-pretty">
        Your week is designed. Honor tonight&apos;s Power Down &amp; Unplug™, and arrive Monday ready to live it.
      </p>
    </div>
  )
}
