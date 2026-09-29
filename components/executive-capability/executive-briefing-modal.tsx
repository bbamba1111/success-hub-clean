"use client"

/**
 * Executive Briefing Modal™ (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Full-overlay briefing component showing a ResolvedBriefing to the founder.
 * Six accordion sections, communication level badge, and three outcome actions.
 */

import { useState } from "react"
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Lightbulb,
  AlertTriangle,
  Eye,
  Zap,
  ArrowRight,
  X,
} from "lucide-react"
import type { ResolvedBriefing } from "@/lib/executive-capability/types"
import type { BriefingOutcome } from "@/lib/executive-capability/types"
import { COMMUNICATION_LEVELS } from "@/lib/founder-learning/types"

// ─── Props ────────────────────────────────────────────────────────────────────

interface ExecutiveBriefingModalProps {
  briefing: ResolvedBriefing
  onOutcome: (outcome: BriefingOutcome) => void
  onClose: () => void
}

// ─── Accordion Section ────────────────────────────────────────────────────────

function BriefingSection({
  icon: Icon,
  title,
  children,
  defaultOpen = false,
  accentColor = "#C9A96E",
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  accentColor?: string
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-black/[0.02]"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
          <span className="font-montserrat text-sm font-semibold text-[#3A2E33]">{title}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[#3A2E33]/40" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[#3A2E33]/40" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ExecutiveBriefingModal({
  briefing,
  onOutcome,
  onClose,
}: ExecutiveBriefingModalProps) {
  const { section, topicTitle, executiveOwner, triggerContext, communicationLevel } = briefing

  const levelDef = COMMUNICATION_LEVELS.find((l) => l.id === communicationLevel)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative flex w-full max-w-2xl flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl sm:my-4 max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="relative flex shrink-0 flex-col gap-2 border-b border-black/[0.06] bg-[#FBF7EE] px-6 py-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-[#3A2E33]/40 transition-colors hover:bg-black/[0.06] hover:text-[#3A2E33]"
            aria-label="Close briefing"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#C9A96E]" />
            <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A96E]">
              Executive Briefing™
            </span>
          </div>

          <h2
            id="briefing-title"
            className="font-montserrat text-xl font-semibold text-[#3A2E33] leading-tight"
          >
            {topicTitle}
          </h2>

          <p className="text-sm leading-relaxed text-[#3A2E33]/60">{triggerContext}</p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#3A2E33]/[0.07] px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#3A2E33]/70">
              {executiveOwner}
            </span>
            {levelDef && (
              <span className="rounded-full border border-[#C9A96E]/40 bg-[#C9A96E]/10 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#C9A96E]">
                {levelDef.label}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <BriefingSection icon={BookOpen} title="What Is It?" defaultOpen accentColor="#C9A96E">
            <p className="text-sm leading-relaxed text-[#3A2E33]/80">{section.whatIsIt}</p>
          </BriefingSection>

          <BriefingSection icon={Lightbulb} title="Why It Matters" accentColor="#7C9A82">
            <p className="text-sm leading-relaxed text-[#3A2E33]/80">{section.whyItMatters}</p>
          </BriefingSection>

          <BriefingSection icon={Eye} title="Why Now" accentColor="#6B9BC4">
            <p className="text-sm leading-relaxed text-[#3A2E33]/80">{section.whyNow}</p>
          </BriefingSection>

          <BriefingSection icon={AlertTriangle} title="Common Mistakes" accentColor="#D4845A">
            <ul className="space-y-2">
              {section.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#3A2E33]/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4845A]" aria-hidden />
                  {mistake}
                </li>
              ))}
            </ul>
          </BriefingSection>

          <BriefingSection icon={GraduationCap} title="Executive Perspective" accentColor="#8B6B9E">
            <p className="text-sm italic leading-relaxed text-[#3A2E33]/80">
              &ldquo;{section.executivePerspective}&rdquo;
            </p>
          </BriefingSection>

          <BriefingSection icon={Zap} title="Five-Minute Takeaway" accentColor="#C9A96E">
            <p className="text-sm leading-relaxed text-[#3A2E33]/80">{section.fiveMinuteTakeaway}</p>
          </BriefingSection>

          {section.exploreFurther.length > 0 && (
            <div className="px-6 py-5">
              <p className="mb-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#C9A96E]">
                Explore Further
              </p>
              <ul className="space-y-1.5">
                {section.exploreFurther.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#3A2E33]/60">
                    <ArrowRight className="h-3 w-3 shrink-0 text-[#C9A96E]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-black/[0.06] bg-white px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-montserrat text-[11px] font-medium text-[#3A2E33]/50">
              Recording your response helps your GPS route better.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onOutcome("skipped"); onClose() }}
                className="rounded-xl border border-black/[0.08] px-4 py-2 font-montserrat text-xs font-semibold text-[#3A2E33]/50 transition-colors hover:border-black/[0.15] hover:text-[#3A2E33]/70"
              >
                Skip
              </button>
              <button
                onClick={() => { onOutcome("deferred"); onClose() }}
                className="rounded-xl border border-[#C9A96E]/40 px-4 py-2 font-montserrat text-xs font-semibold text-[#C9A96E] transition-colors hover:bg-[#C9A96E]/10"
              >
                Save for Later
              </button>
              <button
                onClick={() => { onOutcome("completed"); onClose() }}
                className="rounded-xl bg-[#C9A96E] px-4 py-2 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Mark as Learned
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
