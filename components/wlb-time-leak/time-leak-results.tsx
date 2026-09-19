"use client"

/**
 * Work-Life Balance Time-Leak Check™ — Your Time-Leak Profile™
 * ---------------------------------------------------------------------------
 * The results view shown after the wizard. Four sections, per spec:
 *   1. Primary Time-Leak Driver™  — the founder's single biggest source
 *   2. Founder Hat Load™          — count of selected roles per business category
 *   3. Life Impact Map™           — the crowded-out life areas (NOT WBA scores)
 *   4. Top Harmony Lane Opportunities™ — the solutions the founder chose
 * Nothing here is converted into a WBA score — the WBA remains the instrument.
 */

import {
  HAT_LOAD_GROUPS,
  FOUNDER_DEPENDENCY_OPTION,
  LIFE_IMPACT_OPTIONS,
  solutionLabel,
  pullBackLabel,
} from "@/lib/wlb-time-leak/registry"
import type { TimeLeakResponses } from "@/lib/wlb-time-leak/types"

/** A short, encouraging framing line for the primary driver. */
function driverSubtitle(driverId: string | null): string {
  const map: Record<string, string> = {
    "decisions-to-me": "Too many decisions still route through you.",
    "only-i-can-do": "Too much of the work still depends on you personally.",
    "dont-delegate": "Work stays with you because it hasn't been handed off yet.",
    "no-operating-rules": "Without clear operating rules, everything becomes a decision.",
    "no-systems-sops": "Without repeatable systems, the work resets to you each time.",
    "team-depends": "Your team leans on you more than the business can sustain.",
    "clients-demand-access": "Client access is expanding past the boundaries you want.",
    "hard-to-say-no": "Saying yes too often keeps pulling work back in.",
    "no-boundaries": "Without clear work-life boundaries, work keeps expanding.",
    "no-defined-workday": "Without a defined workday, there's no natural stopping point.",
    "worry-falls-apart": "You're carrying the fear that things will fall apart if you stop.",
  }
  return driverId ? (map[driverId] ?? "This is the biggest thing pulling work into your life right now.") : ""
}

export function TimeLeakResults({
  responses,
  onContinue,
  continueLabel = "Continue",
}: {
  responses: TimeLeakResponses
  onContinue?: () => void
  continueLabel?: string
}) {
  const primaryDriver = responses["primary-driver"] ?? null
  const hatLoad = (responses["hat-load"] as string[] | undefined) ?? []
  const lifeImpact = (responses["life-impact"] as string[] | undefined) ?? []
  const solutions = (responses["solution-match"] as string[] | undefined) ?? []

  const carriesEverything = hatLoad.includes(FOUNDER_DEPENDENCY_OPTION.id)

  // Count selected responsibilities per business category, keep only non-empty, sort desc.
  const hatLoadByCategory = HAT_LOAD_GROUPS.map((group) => ({
    label: group.label,
    count: group.options.filter((o) => hatLoad.includes(o.id)).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)

  const maxCount = hatLoadByCategory[0]?.count ?? 1

  const impactAreas = LIFE_IMPACT_OPTIONS.filter((o) => lifeImpact.includes(o.id))

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header className="text-center">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-coral mb-2">
          Your Work-Life Balance Time-Leak Profile™
        </p>
        <p className="font-sans text-[15px] font-medium leading-relaxed text-brand-ink-soft text-pretty max-w-xl mx-auto">
          Here&apos;s what may be causing work to expand beyond the boundaries you want — and where Harmony Lane can help
          you contain it.
        </p>
      </header>

      {/* 1 · Primary Time-Leak Driver™ */}
      <section className="rounded-3xl border border-brand-coral/30 bg-white shadow-lg overflow-hidden">
        <div className="bg-brand-blush/30 px-7 py-3">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-coral">
            Primary Time-Leak Driver™
          </p>
        </div>
        <div className="px-7 py-6">
          <p className="font-sans text-2xl font-bold text-brand-ink text-balance">
            {carriesEverything && !primaryDriver ? "Founder Dependency" : pullBackLabel(primaryDriver) || "Not yet named"}
          </p>
          <p className="mt-2 font-sans text-[15px] leading-relaxed text-brand-ink-soft text-pretty">
            {driverSubtitle(primaryDriver)}
          </p>
        </div>
      </section>

      {/* 2 · Founder Hat Load™ */}
      <section className="rounded-3xl border border-brand-green/20 bg-white shadow-lg overflow-hidden">
        <div className="bg-brand-green/5 px-7 py-3">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">Founder Hat Load™</p>
        </div>
        <div className="px-7 py-6 space-y-3">
          <p className="font-sans text-sm font-medium text-brand-ink-soft text-pretty">
            Where work is accumulating on you across the eight areas of your business.
          </p>
          {carriesEverything && (
            <div className="rounded-2xl border border-brand-coral/30 bg-brand-blush/20 px-4 py-3">
              <p className="font-sans text-sm font-semibold text-brand-ink">Everything ultimately comes back to you.</p>
            </div>
          )}
          {hatLoadByCategory.length === 0 ? (
            <p className="font-sans text-sm text-brand-ink-soft">No specific roles selected.</p>
          ) : (
            <ul className="space-y-2.5">
              {hatLoadByCategory.map((c) => (
                <li key={c.label} className="flex items-center gap-3">
                  <span className="w-56 shrink-0 font-sans text-sm font-semibold text-brand-ink">{c.label}</span>
                  <span className="flex-1 h-2.5 rounded-full bg-brand-green/10 overflow-hidden" aria-hidden>
                    <span className="block h-full rounded-full bg-brand-green" style={{ width: `${(c.count / maxCount) * 100}%` }} />
                  </span>
                  <span className="w-6 text-right font-sans text-sm font-bold text-brand-green-dark tabular-nums">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 3 · Life Impact Map™ */}
      <section className="rounded-3xl border border-brand-green/20 bg-white shadow-lg overflow-hidden">
        <div className="bg-brand-green/5 px-7 py-3">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">Life Impact Map™</p>
        </div>
        <div className="px-7 py-6 space-y-3">
          <p className="font-sans text-sm font-medium text-brand-ink-soft text-pretty">
            These are the areas most affected by the current way work is operating.
          </p>
          {impactAreas.length === 0 ? (
            <p className="font-sans text-sm text-brand-ink-soft">No life areas selected.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {impactAreas.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center rounded-full border border-brand-green/30 bg-brand-green/5 px-3.5 py-1.5 font-sans text-sm font-semibold text-brand-green-dark"
                >
                  {a.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 · Top Harmony Lane Opportunities™ */}
      <section className="rounded-3xl border border-brand-green/20 bg-white shadow-lg overflow-hidden">
        <div className="bg-brand-green/5 px-7 py-3">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-green-dark">
            Your Top Harmony Lane Opportunities™
          </p>
        </div>
        <div className="px-7 py-6 space-y-3">
          <p className="font-sans text-sm font-medium text-brand-ink-soft text-pretty">
            The solutions you identified to contain work and create more room for life.
          </p>
          {solutions.length === 0 ? (
            <p className="font-sans text-sm text-brand-ink-soft">No solutions selected.</p>
          ) : (
            <ol className="space-y-2">
              {solutions.map((id, i) => (
                <li key={id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white tabular-nums">
                    {i + 1}
                  </span>
                  <span className="font-sans text-[15px] font-semibold text-brand-ink">{solutionLabel(id)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {onContinue && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-3.5 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark"
          >
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  )
}
