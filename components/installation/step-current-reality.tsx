"use client"

import type { CurrentRealityAnswers } from "@/lib/installation/types"

interface StepCurrentRealityProps {
  answers: Partial<CurrentRealityAnswers>
  onChange: (answers: Partial<CurrentRealityAnswers>) => void
  onContinue: () => void
  onBack: () => void
}

type ScaleQuestion = {
  id: keyof CurrentRealityAnswers
  question: string
  labels: [string, string, string, string, string]
}

const QUESTIONS: ScaleQuestion[] = [
  {
    id: "weeklyHours",
    question: "How many hours per week are you currently working?",
    labels: ["Under 20h", "20–30h", "30–40h", "40–55h", "55h+"],
  },
  {
    id: "eveningFrequency",
    question: "How often do you work in the evenings?",
    labels: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: "weekendFrequency",
    question: "How often do you work on weekends?",
    labels: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: "alwaysOnFeeling",
    question: "How \"always on\" do you feel — unable to fully disconnect?",
    labels: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: "workLifeSatisfaction",
    question: "How satisfied are you with your current work-life balance?",
    labels: ["Very unsatisfied", "Unsatisfied", "Neutral", "Satisfied", "Very satisfied"],
  },
  {
    id: "disruptionFrequency",
    question: "How often does work disrupt your personal priorities?",
    labels: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
]

const isComplete = (answers: Partial<CurrentRealityAnswers>) =>
  QUESTIONS.every((q) => answers[q.id] !== undefined)

export function StepCurrentReality({ answers, onChange, onContinue, onBack }: StepCurrentRealityProps) {
  const handleSelect = (id: keyof CurrentRealityAnswers, value: number) => {
    onChange({ ...answers, [id]: value })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="ds-eyebrow">Step 1 of 4</p>
        <h2 className="ds-page-title">Your current reality</h2>
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
          Be honest — there are no wrong answers. This calibrates your operating system to where you actually are, not where you think you should be.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="harmony-panel px-5 py-5">
            <p className="font-sans text-sm font-semibold text-[#3A2E33] mb-4 leading-snug">
              {q.question}
            </p>
            <div className="flex gap-2">
              {q.labels.map((label, i) => {
                const value = i + 1
                const isSelected = answers[q.id] === value
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(q.id, value)}
                    className={[
                      "flex-1 flex flex-col items-center gap-1.5 rounded-lg border px-1.5 py-3 transition-all duration-150",
                      isSelected
                        ? "border-[#5B835F] bg-[#5B835F]/8 text-[#5B835F]"
                        : "border-black/[0.08] bg-white text-[#6B5860] hover:border-[#5B835F]/40",
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full font-sans text-sm font-bold transition-colors",
                        isSelected ? "bg-[#5B835F] text-white" : "bg-black/[0.05] text-[#6B5860]",
                      ].join(" ")}
                    >
                      {value}
                    </span>
                    <span className="font-sans text-[10px] text-center leading-tight">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="ds-btn-ghost flex-none px-5">
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isComplete(answers)}
          className="ds-btn-primary flex-1 py-3.5 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
