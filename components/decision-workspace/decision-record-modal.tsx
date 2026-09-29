"use client"

/**
 * Decision Record Modal — Phase 11.0
 * ---------------------------------------------------------------------------
 * Lightweight Dialog for recording a decision after evaluating a scenario.
 * Uses shadcn Dialog primitives.
 */

import { useState } from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { recordDecision } from "@/lib/digital-twin/decision-store"
import type { ScenarioAnalysis } from "@/lib/digital-twin/types"

interface Props {
  open: boolean
  onClose: () => void
  analysis: ScenarioAnalysis
  optionALabel: string
  optionBLabel: string
  scenarioTitle: string
}

export function DecisionRecordModal({
  open,
  onClose,
  analysis,
  optionALabel,
  optionBLabel,
  scenarioTitle,
}: Props) {
  const [chosen, setChosen] = useState<"option-a" | "option-b" | null>(null)
  const [expectedOutcome, setExpectedOutcome] = useState("")
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!chosen || !expectedOutcome.trim()) return

    recordDecision({
      scenarioId: analysis.scenarioId,
      scenarioTitle,
      optionChosen: chosen,
      optionChosenLabel: chosen === "option-a" ? optionALabel : optionBLabel,
      alternativesConsidered: [chosen === "option-a" ? optionBLabel : optionALabel],
      expectedOutcome: expectedOutcome.trim(),
    })

    setSaved(true)
    setTimeout(() => {
      onClose()
      setSaved(false)
      setChosen(null)
      setExpectedOutcome("")
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="max-w-md rounded-2xl border border-[#E8DFE1] bg-white p-0 shadow-xl">
        {/* Custom header */}
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-montserrat text-base font-bold text-[#3A2E33] leading-snug text-balance">
                Record My Decision
              </DialogTitle>
              <DialogDescription className="mt-1 font-montserrat text-[12px] text-[#6B5860]">
                {scenarioTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pt-4 pb-6 space-y-5">
          {saved ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5B835F]/10">
                <span className="text-[#5B835F] text-lg" aria-hidden>&#x2713;</span>
              </div>
              <p className="font-montserrat text-[13px] font-bold text-[#3A2E33]">Decision recorded</p>
              <p className="font-montserrat text-[12px] text-[#6B5860] text-center">
                You can review it in Decision History™ on your My Harmony page.
              </p>
            </div>
          ) : (
            <>
              {/* Option choice */}
              <div>
                <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-2">
                  Which option did you choose?
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setChosen("option-a")}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B835F]/40 ${
                      chosen === "option-a"
                        ? "border-[#5B835F] bg-[#5B835F]/[0.07]"
                        : "border-[#E8DFE1] hover:border-[#5B835F]/40"
                    }`}
                    aria-pressed={chosen === "option-a"}
                  >
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        chosen === "option-a" ? "border-[#5B835F]" : "border-[#C0B5B8]"
                      }`}
                    >
                      {chosen === "option-a" && <span className="h-2 w-2 rounded-full bg-[#5B835F]" />}
                    </span>
                    <span className="font-montserrat text-[13px] font-bold text-[#3A2E33]">{optionALabel}</span>
                  </button>
                  <button
                    onClick={() => setChosen("option-b")}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C13B6B]/40 ${
                      chosen === "option-b"
                        ? "border-[#C13B6B] bg-[#C13B6B]/[0.07]"
                        : "border-[#E8DFE1] hover:border-[#C13B6B]/40"
                    }`}
                    aria-pressed={chosen === "option-b"}
                  >
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        chosen === "option-b" ? "border-[#C13B6B]" : "border-[#C0B5B8]"
                      }`}
                    >
                      {chosen === "option-b" && <span className="h-2 w-2 rounded-full bg-[#C13B6B]" />}
                    </span>
                    <span className="font-montserrat text-[13px] font-bold text-[#3A2E33]">{optionBLabel}</span>
                  </button>
                </div>
              </div>

              {/* Expected outcome */}
              <div>
                <label
                  htmlFor="expected-outcome"
                  className="block font-montserrat text-[11px] font-bold uppercase tracking-[0.12em] text-[#9E9289] mb-1.5"
                >
                  What outcome do you expect?
                </label>
                <textarea
                  id="expected-outcome"
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  placeholder="e.g. This hire will free 8 hours/week and allow me to focus on the offer launch..."
                  rows={3}
                  className="w-full rounded-xl border border-[#E8DFE1] bg-white px-3 py-2.5 font-montserrat text-[13px] text-[#3A2E33] placeholder:text-[#C0B5B8] focus:outline-none focus:ring-2 focus:ring-[#C13B6B]/30 resize-none leading-relaxed"
                />
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!chosen || !expectedOutcome.trim()}
                className="w-full rounded-xl bg-[#3A2E33] px-4 py-3 font-montserrat text-[13px] font-bold text-white transition-all hover:bg-[#2A1E23] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A2E33] focus-visible:ring-offset-2"
              >
                Record Decision
              </button>

              <p className="font-montserrat text-[11px] text-center text-[#9E9289]">
                Your Decision History™ lives on My Harmony — you can record the actual outcome later.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
