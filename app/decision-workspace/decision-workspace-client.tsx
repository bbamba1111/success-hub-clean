"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Brain } from "lucide-react"
import { ScenarioSelector } from "@/components/decision-workspace/scenario-selector"
import { ScenarioComparisonView } from "@/components/decision-workspace/scenario-comparison-view"
import { SCENARIO_REGISTRY } from "@/lib/digital-twin/scenario-registry"
import type { Scenario, ScenarioAnalysis, FounderTwinProfile } from "@/lib/digital-twin/types"

type ViewState = "selector" | "analyzing" | "comparison"

export function DecisionWorkspaceClient() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<ViewState>("selector")
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [analysis, setAnalysis] = useState<ScenarioAnalysis | null>(null)
  const [twin, setTwin] = useState<FounderTwinProfile | null>(null)

  // If ?scenario= is present on load, jump straight to that scenario
  const scenarioParam = searchParams.get("scenario")
  useEffect(() => {
    if (scenarioParam) {
      const all = Object.values(SCENARIO_REGISTRY)
      const match = all.find((s: Scenario) => s.id === scenarioParam)
      if (match) handleScenarioSelect(match)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioParam])

  function handleScenarioSelect(scenario: Scenario) {
    setSelectedScenario(scenario)
    setView("analyzing")

    // Derive twin + analysis asynchronously on next tick so UI transitions first
    setTimeout(() => {
      try {
        const { buildFounderTwin } = require("@/lib/digital-twin/twin-builder")
        const { analyzeScenario } = require("@/lib/digital-twin/scenario-analyzer")

        const builtTwin: FounderTwinProfile = buildFounderTwin()
        const builtAnalysis: ScenarioAnalysis = analyzeScenario(scenario, builtTwin)

        setTwin(builtTwin)
        setAnalysis(builtAnalysis)
        setView("comparison")
      } catch {
        // Graceful fallback — show comparison with empty state
        setView("comparison")
      }
    }, 400)
  }

  function handleBack() {
    setView("selector")
    setSelectedScenario(null)
    setAnalysis(null)
    setTwin(null)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="border-b border-black/[0.06] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          {view !== "selector" ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 font-montserrat text-xs font-semibold text-[#6B5860] transition-opacity hover:opacity-70"
              aria-label="Back to scenario selection"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back
            </button>
          ) : (
            <Link
              href="/my-harmony"
              className="flex items-center gap-1.5 font-montserrat text-xs font-semibold text-[#6B5860] transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              My Harmony
            </Link>
          )}

          <div className="flex flex-1 items-center justify-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3A2E33]">
              <Brain className="h-3.5 w-3.5 text-white" aria-hidden />
            </span>
            <div>
              <p className="font-montserrat text-[13px] font-semibold leading-none text-[#3A2E33]">
                Decision Workspace™
              </p>
              <p className="mt-0.5 font-montserrat text-[10px] uppercase tracking-widest text-[#6B5860]/60">
                Founder Digital Twin™
              </p>
            </div>
          </div>

          {twin && (
            <div className="flex items-center gap-1.5 rounded-lg border border-black/[0.07] bg-white px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5B835F]" aria-hidden />
              <span className="font-montserrat text-[10px] font-medium text-[#6B5860]">
                Twin {Math.round(twin.dataCompleteness * 100)}% complete
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {view === "selector" && (
          <>
            <div className="mb-8 text-center">
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#5B835F]">
                Powered by Your Founder Digital Twin™
              </p>
              <h1 className="mt-3 font-serif text-3xl text-[#3A2E33] text-balance">
                What decision are you weighing?
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#6B5860]">
                Choose a scenario and your Digital Twin will run it through 7 executive perspectives
                and 9 impact dimensions — calibrated to your business stage, patterns, and goals.
              </p>
            </div>
            <ScenarioSelector />
          </>
        )}

        {view === "analyzing" && selectedScenario && (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#3A2E33]">
              <Brain className="h-7 w-7 text-white" aria-hidden />
              <span className="absolute inset-0 animate-ping rounded-2xl bg-[#3A2E33]/20" aria-hidden />
            </div>
            <div>
              <p className="font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#5B835F]">
                Founder Digital Twin™ Active
              </p>
              <p className="mt-2 font-serif text-xl text-[#3A2E33]">
                Analyzing &ldquo;{selectedScenario.title}&rdquo;
              </p>
              <p className="mt-2 text-sm text-[#6B5860]">
                Running {selectedScenario.optionA.label} vs. {selectedScenario.optionB.label} through
                your executive team...
              </p>
            </div>
          </div>
        )}

        {view === "comparison" && selectedScenario && (
          <ScenarioComparisonView
            scenario={selectedScenario}
            analysis={analysis}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  )
}
