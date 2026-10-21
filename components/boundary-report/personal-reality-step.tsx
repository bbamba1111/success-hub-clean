"use client"

import { Check } from "lucide-react"
import { PERSONAL_REALITY_GROUPS } from "@/lib/boundary-report/personal-reality"

export function PersonalRealityStep({
  selected,
  onToggle,
}: {
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-8">
      {PERSONAL_REALITY_GROUPS.map((group) => (
        <fieldset key={group.id} className="flex flex-col gap-3">
          <legend className="mb-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
            {group.title}
          </legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {group.options.map((opt) => {
              const active = selected.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggle(opt.id)}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                    active ? "border-brand-coral bg-brand-coral/5" : "border-brand-blush bg-white hover:border-brand-coral/50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      active ? "border-brand-coral bg-brand-coral" : "border-brand-blush"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white" aria-hidden />}
                  </span>
                  <span className="font-sans text-sm text-brand-ink leading-snug">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
