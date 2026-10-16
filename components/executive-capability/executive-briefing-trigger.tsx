"use client"

/**
 * Executive Briefing Trigger™ (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Inline GPS card insert. Shows a Cherry Blossom™–framed prompt with three
 * outcome actions: Learn Now (opens modal), Save for Later, Skip.
 *
 * Renders nothing when dismissed or when no topicId is provided.
 */

import { useState, useEffect } from "react"
import { GraduationCap, BookOpen, X } from "lucide-react"
import type { ExecutiveBriefingTopicId } from "@/lib/executive-capability/types"
import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import { resolveBriefing, getBriefingTopicMeta } from "@/lib/executive-capability/briefing-registry"
import {
  deriveTriggerContext,
  resolveCommunicationLevel,
} from "@/lib/executive-capability/capability-engine"
import {
  recordBriefingOutcome,
  hasMastered,
} from "@/lib/executive-capability/capability-memory-store"
import { ExecutiveBriefingModal } from "@/components/executive-capability/executive-briefing-modal"

// ─── Props ────────────────────────────────────────────────────────────────────

interface ExecutiveBriefingTriggerProps {
  topicId: ExecutiveBriefingTopicId
  aggregate: HarmonyContextAggregate
  outcomeColor?: string
  outcomeBorder?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ExecutiveBriefingTrigger({
  topicId,
  aggregate,
  outcomeColor = "#C9A96E",
  outcomeBorder = "rgba(201, 169, 110, 0.25)",
}: ExecutiveBriefingTriggerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [mastered, setMastered] = useState(false)

  useEffect(() => {
    setMastered(hasMastered(topicId))
  }, [topicId])

  if (dismissed || mastered) return null

  const level = resolveCommunicationLevel(aggregate)
  const triggerContext = deriveTriggerContext(topicId, aggregate)
  const briefing = resolveBriefing(topicId, level, triggerContext)
  const meta = getBriefingTopicMeta(topicId)

  return (
    <>
      <div
        className="rounded-xl p-4"
        style={{ background: `${outcomeColor}0A`, border: `1px solid ${outcomeBorder}` }}
        role="complementary"
        aria-label={`Executive Briefing available: ${meta.title}`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 shrink-0" style={{ color: outcomeColor }} />
            <span
              className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: outcomeColor }}
            >
              Executive Briefing™ Available
            </span>
          </div>
          <button
            onClick={() => { recordBriefingOutcome(topicId, level, "skipped"); setDismissed(true) }}
            className="rounded p-0.5 text-black/25 transition-colors hover:text-black/50"
            aria-label="Dismiss briefing"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Topic + context */}
        <div className="mt-2.5 flex items-start gap-2.5">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-black/30" aria-hidden />
          <div>
            <p className="font-montserrat text-sm font-semibold text-[#3A2E33]">{meta.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#3A2E33]/55">{triggerContext}</p>
          </div>
        </div>

        {/* Capability unlock hint */}
        <p className="mt-2.5 text-xs leading-relaxed text-[#3A2E33]/45 italic">
          Capability unlock: {meta.capabilityUnlock}
        </p>

        {/* Actions */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl px-4 py-2 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: outcomeColor }}
          >
            Read Briefing
          </button>
          <button
            onClick={() => { recordBriefingOutcome(topicId, level, "deferred"); setDismissed(true) }}
            className="rounded-xl border px-4 py-2 font-montserrat text-xs font-semibold transition-colors"
            style={{
              borderColor: outcomeBorder,
              color: outcomeColor,
            }}
          >
            Save for Later
          </button>
        </div>
      </div>

      {modalOpen && (
        <ExecutiveBriefingModal
          briefing={briefing}
          onOutcome={(outcome) => {
            recordBriefingOutcome(topicId, level, outcome)
            if (outcome === "completed") setMastered(true)
            else setDismissed(true)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
