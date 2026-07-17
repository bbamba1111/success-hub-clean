"use client"

/**
 * Adaptive Workspace Section Client™ — Phase 10.6
 *
 * Renders the Adaptive Workspace™ section on the My Harmony page.
 * Shows: current operating mode, workspace profile, personalized rituals,
 * and adaptation history. All data derived from localStorage + engines.
 */

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Calendar, Zap, LayoutDashboard, Clock } from "lucide-react"
import { deriveWorkspaceConfig } from "@/lib/adaptive-workspace/workspace-intelligence-engine"
import { derivePersonalizedRituals } from "@/lib/adaptive-workspace/ritual-intelligence-engine"
import { getAdaptationHistory, ADAPTATION_HISTORY_UPDATED } from "@/lib/adaptive-workspace/adaptation-store"
import { MODE_DEFINITIONS } from "@/lib/adaptive-workspace/operating-mode-engine"
import type { AdaptiveWorkspaceConfig, PersonalizedRitual, AdaptationHistoryEntry } from "@/lib/adaptive-workspace/types"
import type { PatternSignal } from "@/lib/harmony-memory/types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-4 w-4 text-brand-ink-soft" aria-hidden />
      <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-brand-ink-soft">
        {title}
      </p>
    </div>
  )
}

export function AdaptiveWorkspaceSectionClient() {
  const [adaptHistory, setAdaptHistory] = useState<AdaptationHistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [derived, setDerived] = useState<{ config: AdaptiveWorkspaceConfig; rituals: PersonalizedRitual[] } | null>(null)

  useEffect(() => {
    // Derive workspace config directly from localStorage stores — no HarmonyProvider needed.
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getBusinessContext } = require("@/lib/business-context/business-context-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getBusinessStage } = require("@/lib/business-stage/business-stage-store")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { analyzePatterns } = require("@/lib/harmony-memory/pattern-recognition-engine")
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")

      const bc = getBusinessContext()
      const stage = getBusinessStage()
      const gpsHistory: RecommendationHistoryEntry[] = getRecommendationHistory()
      const patterns: PatternSignal[] = analyzePatterns(gpsHistory).slice(0, 3)

      // Build a minimal aggregate object matching what deriveWorkspaceConfig expects
      const miniAgg = {
        businessStage: stage,
        businessContext: bc,
        patternSignals: patterns,
        inLifeProtectionMode: false,
        consecutiveCompletions: 0,
        hasMomentum: false,
        upcomingLifeEvents: [],
        daysUntilNextSignificantEvent: null,
        biggestOpportunities: bc?.biggestOpportunities ?? [],
        biggestGoals: bc?.biggestGoals ?? [],
      }

      const config = deriveWorkspaceConfig(miniAgg as Parameters<typeof deriveWorkspaceConfig>[0], patterns)
      const rituals = derivePersonalizedRituals(patterns, gpsHistory)
      setDerived({ config, rituals })
    } catch {
      // no-op — component shows empty state
    }

    // Adaptation history
    setAdaptHistory(getAdaptationHistory())
    const handler = () => setAdaptHistory(getAdaptationHistory())
    window.addEventListener(ADAPTATION_HISTORY_UPDATED, handler)
    return () => window.removeEventListener(ADAPTATION_HISTORY_UPDATED, handler)
  }, [])

  if (!derived) {
    return (
      <div className="rounded-xl border border-black/[0.07] bg-card px-6 py-8 text-center">
        <p className="font-montserrat text-sm text-brand-ink-soft">
          Your Adaptive Workspace™ builds as you use the platform. Design your first week to activate it.
        </p>
        <Link
          href="/design-my-week"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-ink px-5 py-2.5 font-montserrat text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Design My Week™
        </Link>
      </div>
    )
  }

  const { config, rituals } = derived
  const modeDef = MODE_DEFINITIONS[config.recommendedMode]
  const recentHistory = adaptHistory.slice(0, 5)

  return (
    <div className="space-y-6">

      {/* Operating Mode */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <SectionHeader icon={Zap} title="Operating Mode™" />
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] ${modeDef.bgClass} ${modeDef.textClass}`}
              >
                {modeDef.name}
              </span>
              <span className="font-montserrat text-[11px] text-brand-ink-soft">
                {config.modeConfidence}% confidence
              </span>
            </div>
            <ConfidenceBar value={config.modeConfidence} color={modeDef.accentColor} />
            <p className="font-montserrat text-[12px] leading-relaxed text-brand-ink-soft text-pretty">
              {config.modeRationale}
            </p>
            <p className="font-montserrat text-[11px] italic text-brand-ink-soft/60">
              {modeDef.tagline}
            </p>
          </div>
        </div>
        {config.adaptationNote && (
          <div className="mt-3 rounded-lg border border-amber-200/60 bg-amber-50 px-3.5 py-2.5">
            <p className="font-montserrat text-[11px] leading-relaxed text-amber-700">
              {config.adaptationNote}
            </p>
          </div>
        )}
      </div>

      {/* Workspace Profile */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <SectionHeader icon={LayoutDashboard} title="Workspace Profile™" />
        <div className="space-y-1.5">
          <p className="font-montserrat text-sm font-semibold text-brand-ink">
            {config.recommendedProfile
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
            ™
          </p>
          <p className="font-montserrat text-[12px] leading-relaxed text-brand-ink-soft text-pretty">
            {config.profileRationale}
          </p>
        </div>
      </div>

      {/* Personalized Rituals */}
      {rituals.length > 0 ? (
        <div className="rounded-xl border border-black/[0.07] bg-card p-5">
          <SectionHeader icon={Calendar} title="Personalized Rituals™" />
          <div className="space-y-3">
            {rituals.map((ritual) => (
              <div key={ritual.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5B835F]/10">
                  <span className="font-montserrat text-[10px] font-bold text-[#5B835F]">
                    {DAY_NAMES[ritual.dayOfWeek]}
                  </span>
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="font-montserrat text-[13px] font-semibold text-brand-ink">
                    {ritual.name}
                  </p>
                  <p className="font-montserrat text-[11px] leading-relaxed text-brand-ink-soft">
                    {ritual.rationale}
                  </p>
                  <ConfidenceBar value={ritual.confidence * 100} color="#5B835F" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-black/[0.07] bg-card px-5 py-4">
          <SectionHeader icon={Calendar} title="Personalized Rituals™" />
          <p className="font-montserrat text-[12px] leading-relaxed text-brand-ink-soft">
            Rituals emerge from confirmed operating patterns. Complete 7+ sessions on the same day of the week for a ritual to form.
          </p>
        </div>
      )}

      {/* Adaptation History */}
      <div className="rounded-xl border border-black/[0.07] bg-card p-5">
        <SectionHeader icon={Clock} title="Adaptation History™" />
        {recentHistory.length === 0 ? (
          <p className="font-montserrat text-[12px] leading-relaxed text-brand-ink-soft">
            No adaptations recorded yet. Your workspace adapts automatically as your context evolves.
          </p>
        ) : (
          <div>
            <button
              type="button"
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-1.5 font-montserrat text-[12px] font-semibold text-brand-ink-soft hover:text-brand-ink transition-colors"
              aria-expanded={showHistory}
            >
              {recentHistory.length} recent adaptation{recentHistory.length !== 1 ? "s" : ""}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${showHistory ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            {showHistory && (
              <div className="mt-3 space-y-2">
                {recentHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-black/[0.06] bg-white/50 px-3.5 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-montserrat text-[12px] font-semibold text-brand-ink">
                        {entry.from} → {entry.to}
                      </p>
                      <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 font-montserrat text-[9px] uppercase tracking-wide text-brand-ink-soft">
                        {entry.type}
                      </span>
                    </div>
                    <p className="mt-0.5 font-montserrat text-[11px] leading-relaxed text-brand-ink-soft">
                      {entry.reason}
                    </p>
                    <p className="mt-0.5 font-montserrat text-[10px] text-brand-ink-soft/50">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
