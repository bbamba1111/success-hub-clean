"use client"

/**
 * Business Stage™ Card (Phase 5.4).
 *
 * The member-facing surface for Business Stage™. It lets the founder VIEW their
 * current stage and CHANGE it manually — the founder is always in control. It
 * reads/writes the session store directly (lib/business-stage/business-stage-store),
 * which dispatches BUSINESS_STAGE_EVENT so the Harmony Context Engine™ and any
 * other live view stay in sync.
 *
 * Intentionally calm: no scores, no progress bars, no gamification. Stages are
 * contextual, not hierarchical — moving between them reflects different business
 * needs, never "better."
 */

import { useEffect, useState } from "react"
import { Rocket, TrendingUp, Building2, Trees, Check } from "lucide-react"
import {
  BUSINESS_STAGES,
  getBusinessStage as getBusinessStageDef,
  type BusinessStage,
} from "@/lib/business-stage/business-stage"
import {
  BUSINESS_STAGE_EVENT,
  getBusinessStage,
  setBusinessStage,
} from "@/lib/business-stage/business-stage-store"

/** Stage id → icon. Stored outside the registry so the registry stays data-only. */
const STAGE_ICON: Record<BusinessStage, typeof Rocket> = {
  launch: Rocket,
  growth: TrendingUp,
  scale: Building2,
  legacy: Trees,
}

export function BusinessStageCard() {
  // Default until mounted, then hydrate from the session store (avoids SSR mismatch).
  const [stage, setStage] = useState<BusinessStage>("launch")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setStage(getBusinessStage())
    setMounted(true)
    const onChange = () => setStage(getBusinessStage())
    window.addEventListener(BUSINESS_STAGE_EVENT, onChange)
    return () => window.removeEventListener(BUSINESS_STAGE_EVENT, onChange)
  }, [])

  const def = getBusinessStageDef(stage)
  const CurrentIcon = STAGE_ICON[stage]

  function choose(next: BusinessStage) {
    setStage(next)
    setBusinessStage(next)
  }

  return (
    <div className="harmony-panel p-6 sm:p-8" aria-labelledby="business-stage-heading">
      {/* Current stage */}
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <CurrentIcon className="h-6 w-6 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Your Business Stage™</p>
          <h3
            id="business-stage-heading"
            className="mt-1 font-display text-2xl font-semibold tracking-tight text-brand-ink"
            // Stable value once mounted; suppress hydration text diff on first paint.
            suppressHydrationWarning
          >
            {def.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-brand-green" suppressHydrationWarning>
            {def.tagline}
          </p>
        </div>
      </div>

      <p className="mt-5 text-pretty text-sm leading-relaxed text-brand-ink-soft" suppressHydrationWarning>
        {def.description}
      </p>

      {/* Stage selector — the founder is always in control */}
      <fieldset className="mt-6">
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">
          Change your stage
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BUSINESS_STAGES.map((s) => {
            const Icon = STAGE_ICON[s.id]
            const active = mounted && s.id === stage
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => choose(s.id)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors ${
                  active
                    ? "border-brand-green bg-brand-green/5"
                    : "border-black/[0.08] bg-white/60 hover:border-brand-green/40 hover:bg-brand-green/5"
                }`}
              >
                <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-green/10">
                  <Icon className="h-4 w-4 text-brand-green" aria-hidden />
                  {active ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-green">
                      <Check className="h-2.5 w-2.5 text-white" aria-hidden />
                    </span>
                  ) : null}
                </span>
                <span className="font-display text-sm font-semibold text-brand-ink">{s.name}</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Stage detail: priorities, challenges, suggested focus */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <StageList title="Typical Priorities" items={def.typicalPriorities} tone="green" />
        <StageList title="Typical Challenges" items={def.typicalChallenges} tone="soft" />
      </div>

      <div className="mt-6 border-t border-black/[0.06] pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">Suggested Focus</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {def.focus.map((f) => (
            <li
              key={f}
              className="rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1 text-xs font-medium text-brand-ink"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StageList({ title, items, tone }: { title: string; items: string[]; tone: "green" | "soft" }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft">{title}</p>
      <ul className="mt-3 space-y-2.5" suppressHydrationWarning>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-ink">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "green" ? "bg-brand-green" : "bg-brand-ink-soft/40"}`}
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
