"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Clock, Lightbulb, TrendingUp, Zap } from "lucide-react"
import type { ForesightSignal } from "@/lib/digital-twin/types"

export function ForesightPanel() {
  const [signals, setSignals] = useState<ForesightSignal[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const { deriveForesightSignals } = require("@/lib/digital-twin/foresight-engine")
      const { getRecommendationHistory } = require(
        "@/lib/founder-gps/history/recommendation-history-store",
      )
      const { getCapabilityMemory } = require("@/lib/executive-capability/capability-memory-store")
      const { analyzePatterns } = require("@/lib/harmony-memory/pattern-recognition-engine")
      const { getExecutiveMemory } = require("@/lib/executive-office/executive-memory-store")

      const gpsHistory = getRecommendationHistory()
      const capability = getCapabilityMemory()
      const execEntries = getExecutiveMemory().entries ?? []
      const patterns = analyzePatterns({ gpsHistory, execMemory: execEntries, capability })

      setSignals(deriveForesightSignals(gpsHistory, patterns, capability))
    } catch {
      setSignals([])
    }
  }, [])

  if (!mounted) return null

  if (signals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#5B835F]/30 bg-[#5B835F]/[0.02] px-5 py-6 text-center">
        <p className="font-montserrat text-xs font-semibold uppercase tracking-widest text-[#5B835F]/60">
          Decision Intelligence™
        </p>
        <p className="mt-2 text-sm text-[#6B5860]">
          Foresight signals build as you work. Complete a few GPS recommendations and the system
          will surface what it sees coming — before you feel it.
        </p>
        <Link
          href="/decision-workspace"
          className="mt-4 inline-flex items-center gap-2 font-montserrat text-xs font-semibold text-[#5B835F] transition-opacity hover:opacity-70"
        >
          Open Decision Workspace™
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {signals.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
      <div className="pt-1 text-right">
        <Link
          href="/decision-workspace"
          className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-[#5B835F] transition-opacity hover:opacity-70"
        >
          Open Decision Workspace™
          <ArrowRight className="h-3 w-3" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

function SignalCard({ signal }: { signal: ForesightSignal }) {
  const config = TYPE_CONFIG[signal.type]
  const pct = Math.round(signal.confidence * 100)

  return (
    <div
      className="rounded-xl border px-4 py-4"
      style={{ borderColor: config.border, background: config.bg }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: config.iconBg }}
          aria-hidden
        >
          <config.Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-montserrat text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <span className="ml-auto font-montserrat text-[10px] font-medium text-[#6B5860]/60">
              {pct}% signal strength
            </span>
          </div>
          <p className="mt-0.5 font-montserrat text-[13px] font-semibold text-[#3A2E33]">
            {signal.title}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6B5860]">{signal.description}</p>

          {/* Evidence basis */}
          <p className="mt-2 text-[11px] text-[#6B5860]/60">
            <span className="font-medium">Evidence basis:</span> {signal.evidenceBasis}
          </p>

          {/* Suggested action */}
          <div
            className="mt-3 rounded-lg border px-3 py-2"
            style={{ borderColor: config.border, background: config.iconBg }}
          >
            <p className="text-[12px] leading-snug text-[#3A2E33]">
              <span className="font-medium">Suggested action: </span>
              {signal.suggestedAction}
            </p>
          </div>

          {/* Confidence bar */}
          <div className="mt-3">
            <div className="h-1 w-full overflow-hidden rounded-full bg-black/[0.05]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: config.color }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TYPE_CONFIG: Record<
  ForesightSignal["type"],
  {
    Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
    label: string
    color: string
    border: string
    bg: string
    iconBg: string
  }
> = {
  opportunity: {
    Icon: TrendingUp,
    label: "Opportunity Window™",
    color: "#5B835F",
    border: "rgba(91,131,95,0.18)",
    bg: "rgba(91,131,95,0.03)",
    iconBg: "rgba(91,131,95,0.08)",
  },
  "readiness-gap": {
    Icon: Lightbulb,
    label: "Readiness Gap",
    color: "#C9A96E",
    border: "rgba(201,169,110,0.20)",
    bg: "rgba(201,169,110,0.03)",
    iconBg: "rgba(201,169,110,0.08)",
  },
  "timing-window": {
    Icon: Clock,
    label: "Timing Window™",
    color: "#6A7FB5",
    border: "rgba(106,127,181,0.18)",
    bg: "rgba(106,127,181,0.03)",
    iconBg: "rgba(106,127,181,0.08)",
  },
  "risk-ahead": {
    Icon: AlertTriangle,
    label: "Risk Signal",
    color: "#C13B6B",
    border: "rgba(193,59,107,0.18)",
    bg: "rgba(193,59,107,0.03)",
    iconBg: "rgba(193,59,107,0.08)",
  },
}
