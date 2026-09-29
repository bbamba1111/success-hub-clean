"use client"

import { Check } from "lucide-react"
import type { OperatingRhythmCommitments } from "@/lib/installation/types"

interface StepOperatingRhythmProps {
  commitments: Partial<OperatingRhythmCommitments>
  onChange: (commitments: Partial<OperatingRhythmCommitments>) => void
  onContinue: () => void
  onBack: () => void
}

const OPERATING_PRINCIPLES = [
  {
    title: "Monday–Thursday CEO Workdays™",
    body: "Four focused workdays. Strategic work, deep client delivery, and high-leverage decisions happen here. Friday is for review and reset — not adding more.",
  },
  {
    title: "4-Hour CEO Workday Block™",
    body: "A protected block of 4 uninterrupted hours every workday. No meetings, no interruptions. This is where your highest-leverage work lives.",
  },
  {
    title: "20-Hour Life Time™ Boundary",
    body: "20 hours per week are permanently reserved for the life you are building this business to support — family, health, rest, and joy. Non-negotiable.",
  },
  {
    title: "Time Freedom Philosophy™",
    body: "The goal is not to work less. The goal is to work in a way that creates freedom — for yourself and for those you love.",
  },
  {
    title: "Cherry Blossom™ as Operating Guide",
    body: "Cherry Blossom is your AI-powered operating guide. She surfaces the right recommendation at the right moment, so you always know exactly what to do next.",
  },
]

const COMMITMENTS: Array<{
  id: keyof OperatingRhythmCommitments
  label: string
  subtext: string
}> = [
  {
    id: "protectCeoWorkdays",
    label: "I will protect my CEO Workdays™ Monday–Thursday",
    subtext: "Treating them as the non-negotiable operating rhythm of my business.",
  },
  {
    id: "honorLifeTime",
    label: "I will honor my 20-Hour Life Time™",
    subtext: "Reserving those hours for the life that makes the business worth building.",
  },
  {
    id: "useCherryBlossomAsGuide",
    label: "I will use Cherry Blossom™ as my operating guide",
    subtext: "Following her daily recommendations as my primary productivity compass.",
  },
]

const isComplete = (c: Partial<OperatingRhythmCommitments>) =>
  c.protectCeoWorkdays === true && c.honorLifeTime === true && c.useCherryBlossomAsGuide === true

export function StepOperatingRhythm({ commitments, onChange, onContinue, onBack }: StepOperatingRhythmProps) {
  const toggle = (id: keyof OperatingRhythmCommitments) => {
    onChange({ ...commitments, [id]: !commitments[id] })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="ds-eyebrow">Step 4 of 4</p>
        <h2 className="ds-page-title">Your operating rhythm</h2>
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
          These are the five principles that make Harmony Lane™ work. Read them once.
          Then confirm your three commitments below.
        </p>
      </div>

      {/* Principles */}
      <div className="flex flex-col gap-3">
        {OPERATING_PRINCIPLES.map((p) => (
          <div key={p.title} className="harmony-surface px-5 py-4">
            <p className="font-sans text-sm font-bold text-[#3A2E33] mb-1">{p.title}</p>
            <p className="font-sans text-sm leading-relaxed text-[#6B5860]">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Commitments */}
      <div className="flex flex-col gap-3">
        <p className="font-sans text-sm font-semibold text-[#3A2E33]">Your three commitments</p>
        {COMMITMENTS.map(({ id, label, subtext }) => {
          const isChecked = commitments[id] === true
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={isChecked}
              className={[
                "flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                isChecked
                  ? "border-[#5B835F] bg-[#5B835F]/[0.05] ring-1 ring-[#5B835F]/20"
                  : "border-black/[0.07] bg-white hover:border-[#5B835F]/40",
              ].join(" ")}
            >
              <span
                className={[
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  isChecked ? "border-[#5B835F] bg-[#5B835F]" : "border-black/20",
                ].join(" ")}
                aria-hidden
              >
                {isChecked && <Check className="h-3 w-3 text-white" />}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-sans text-sm font-semibold text-[#3A2E33]">{label}</p>
                <p className="font-sans text-xs leading-relaxed text-[#6B5860]">{subtext}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="ds-btn-ghost flex-none px-5">
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!isComplete(commitments)}
          className="ds-btn-primary flex-1 py-3.5 disabled:opacity-40"
        >
          Install My Operating System™
        </button>
      </div>
    </div>
  )
}
