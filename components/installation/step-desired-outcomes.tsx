"use client"

import { Check, Clock, Zap, Target, CalendarOff, Heart, Focus, CalendarCheck, Building2 } from "lucide-react"
import type { DesiredOutcomeId } from "@/lib/installation/types"

interface StepDesiredOutcomesProps {
  selected: DesiredOutcomeId[]
  onChange: (outcomes: DesiredOutcomeId[]) => void
  onContinue: () => void
  onBack: () => void
}

type OutcomeCard = {
  id: DesiredOutcomeId
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const OUTCOMES: OutcomeCard[] = [
  {
    id: "more-time-family",
    label: "More time with family",
    description: "Protected hours that belong to the people who matter most.",
    icon: Heart,
  },
  {
    id: "sustained-energy",
    label: "Sustained energy",
    description: "A rhythm that fills you up instead of depleting you.",
    icon: Zap,
  },
  {
    id: "clear-priorities",
    label: "Clear priorities",
    description: "Always knowing exactly what deserves your attention today.",
    icon: Target,
  },
  {
    id: "fewer-meetings",
    label: "Fewer meetings",
    description: "Deep work protected from a schedule that fragments focus.",
    icon: CalendarOff,
  },
  {
    id: "reduce-burnout",
    label: "Reduce burnout risk",
    description: "Operating at a pace that is healthy and sustainable long-term.",
    icon: Clock,
  },
  {
    id: "better-focus",
    label: "Better focus",
    description: "Hours of uninterrupted, high-leverage CEO work every day.",
    icon: Focus,
  },
  {
    id: "predictable-workdays",
    label: "Predictable workdays",
    description: "Knowing when you will start, when you will finish, and what happens in between.",
    icon: CalendarCheck,
  },
  {
    id: "business-supports-life",
    label: "Business that supports life",
    description: "A company designed around the life you want to live.",
    icon: Building2,
  },
]

export function StepDesiredOutcomes({ selected, onChange, onContinue, onBack }: StepDesiredOutcomesProps) {
  const toggle = (id: DesiredOutcomeId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="ds-eyebrow">Step 2 of 4</p>
        <h2 className="ds-page-title">What matters most to you?</h2>
        <p className="font-sans text-sm leading-relaxed text-[#6B5860]">
          Select everything that resonates. Your operating system will be calibrated toward these outcomes — they become your north star.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OUTCOMES.map(({ id, label, description, icon: Icon }) => {
          const isSelected = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={isSelected}
              className={[
                "group relative flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                isSelected
                  ? "border-[#5B835F] bg-[#5B835F]/[0.05] ring-1 ring-[#5B835F]/20"
                  : "border-black/[0.07] bg-white hover:border-[#5B835F]/40",
              ].join(" ")}
            >
              {/* Icon */}
              <span
                className={[
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                  isSelected ? "bg-[#5B835F] text-white" : "bg-black/[0.04] text-[#6B5860]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </span>

              {/* Content */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className={["font-sans text-sm font-semibold", isSelected ? "text-[#3A2E33]" : "text-[#3A2E33]"].join(" ")}>
                  {label}
                </p>
                <p className="font-sans text-xs leading-relaxed text-[#6B5860]">{description}</p>
              </div>

              {/* Check */}
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#5B835F]">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="font-sans text-xs text-[#5B835F] text-center">
          {selected.length} outcome{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="ds-btn-ghost flex-none px-5">
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className="ds-btn-primary flex-1 py-3.5 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
