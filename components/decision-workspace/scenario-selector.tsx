"use client"

/**
 * Scenario Selector — Phase 11.0
 * ---------------------------------------------------------------------------
 * 9-topic card grid entry point for the Decision Workspace.
 * On select → navigates to /decision-workspace?scenario=<topicId>.
 */

import { useRouter } from "next/navigation"
import {
  Users,
  Rocket,
  Layers,
  ArrowRightLeft,
  Bot,
  Calendar,
  Package,
  TrendingUp,
  Network,
  Pencil,
} from "lucide-react"
import type { ScenarioTopicId } from "@/lib/digital-twin/types"
import { SCENARIO_REGISTRY } from "@/lib/digital-twin/scenario-registry"

const TOPIC_META: Record<ScenarioTopicId, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  "hire-now-vs-later":                   { icon: Users,        color: "#5B835F" },
  "launch-now-vs-wait":                  { icon: Rocket,       color: "#C13B6B" },
  "build-new-offer-vs-improve-existing": { icon: Layers,       color: "#5B835F" },
  "delegate-vs-retain":                  { icon: ArrowRightLeft,color: "#C9A96E" },
  "invest-in-ai-vs-manual":              { icon: Bot,          color: "#5B835F" },
  "protect-ceo-workday-vs-add-meetings": { icon: Calendar,     color: "#C13B6B" },
  "create-asset-vs-one-time-work":       { icon: Package,      color: "#C9A96E" },
  "increase-prices-vs-volume":           { icon: TrendingUp,   color: "#5B835F" },
  "expand-team-vs-improve-systems":      { icon: Network,      color: "#C13B6B" },
  "custom":                              { icon: Pencil,       color: "#6B5860" },
}

const ORDERED_TOPICS: ScenarioTopicId[] = [
  "hire-now-vs-later",
  "launch-now-vs-wait",
  "build-new-offer-vs-improve-existing",
  "delegate-vs-retain",
  "invest-in-ai-vs-manual",
  "protect-ceo-workday-vs-add-meetings",
  "create-asset-vs-one-time-work",
  "increase-prices-vs-volume",
  "expand-team-vs-improve-systems",
  "custom",
]

export function ScenarioSelector() {
  const router = useRouter()

  function handleSelect(topicId: ScenarioTopicId) {
    router.push(`/decision-workspace?scenario=${topicId}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-montserrat text-2xl font-bold text-[#3A2E33] text-balance">
          Decision Workspace™
        </h1>
        <p className="mt-1.5 font-montserrat text-sm leading-relaxed text-[#6B5860]">
          Select a scenario to evaluate. Your Founder Digital Twin™ will analyze both options
          across nine dimensions using your operating history and executive intelligence.
        </p>
      </div>

      {/* Intro card */}
      <div className="mb-6 rounded-xl border border-[#C13B6B]/20 bg-[#C13B6B]/[0.04] px-5 py-4">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#C13B6B] mb-1">
          Informed projections, not guarantees
        </p>
        <p className="font-montserrat text-[13px] leading-relaxed text-[#6B5860]">
          Your Digital Twin™ is built from your GPS history, executive capability development,
          operating patterns, and business context. Every analysis includes a full confidence
          and evidence panel so you can see exactly what each projection is based on.
        </p>
      </div>

      {/* Scenario grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        role="list"
      >
        {ORDERED_TOPICS.map((topicId) => {
          const scenario = SCENARIO_REGISTRY[topicId]
          const meta = TOPIC_META[topicId]
          const Icon = meta.icon

          return (
            <button
              key={topicId}
              role="listitem"
              onClick={() => handleSelect(topicId)}
              className="group flex items-start gap-3 rounded-xl border border-[#E8DFE1] bg-white px-4 py-4 text-left transition-all duration-200 hover:border-[#C13B6B]/30 hover:shadow-sm hover:shadow-[#C13B6B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B]/40"
              aria-label={`Evaluate: ${scenario.title}`}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${meta.color}15` }}
              >
                <span style={{ color: meta.color }} aria-hidden>
                  <Icon className="h-4 w-4" />
                </span>
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className="block font-montserrat text-[13px] font-bold text-[#3A2E33] group-hover:text-[#C13B6B] transition-colors leading-snug"
                >
                  {scenario.title}
                </span>
                <span className="mt-0.5 block font-montserrat text-[12px] leading-relaxed text-[#6B5860] line-clamp-2">
                  {scenario.question}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
