import { Check } from "lucide-react"
import type { OnboardingProgress } from "@/lib/onboarding/onboarding-progress"

/**
 * Onboarding Progress™ banner — shows a member exactly where they stand in
 * the required Founder Profile™ → Business Context™ → EGA Screen 1 on-ramp
 * whenever they're routed into (or back into) any of those three steps.
 *
 * Rendered above the step content so a returning member who already
 * finished a step or two, but is landing on this page again (new device,
 * cleared cache, or simply moving to the next required step), gets an
 * explicit "here's what's done, here's what's outstanding" confirmation
 * instead of silently re-answering questions with no context.
 */

interface OnboardingStepDef {
  key: keyof OnboardingProgress
  label: string
}

const STEPS: OnboardingStepDef[] = [
  { key: "founderProfileComplete", label: "Founder Profile™" },
  { key: "businessContextComplete", label: "Business Context™" },
  { key: "egaComplete", label: "What's Getting In Your Way™" },
]

export function OnboardingProgressBanner({
  progress,
  currentStep,
}: {
  progress: OnboardingProgress
  /** Which step this page represents — highlighted even if already complete (e.g. editing). */
  currentStep: keyof OnboardingProgress
}) {
  const completedCount = STEPS.filter((s) => progress[s.key]).length

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-8">
      <div className="rounded-lg border border-brand-blush bg-white px-5 py-4 shadow-sm sm:px-6">
        <p className="mb-3 font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
          Your Onboarding Progress · {completedCount} of {STEPS.length} complete
        </p>
        <ol className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
          {STEPS.map((step, index) => {
            const isDone = progress[step.key]
            const isCurrent = step.key === currentStep
            return (
              <li key={step.key} className="flex items-center gap-2.5 sm:flex-1">
                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold",
                    isDone
                      ? "bg-brand-green text-white"
                      : isCurrent
                        ? "border-2 border-brand-coral text-brand-coral"
                        : "border border-border text-muted-foreground",
                  ].join(" ")}
                  aria-hidden
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={[
                    "font-sans text-sm leading-snug",
                    isDone
                      ? "text-brand-ink-soft"
                      : isCurrent
                        ? "font-semibold text-brand-ink"
                        : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.label}
                  {isDone && <span className="ml-1.5 text-xs text-brand-green">Complete</span>}
                  {!isDone && isCurrent && <span className="ml-1.5 text-xs text-brand-coral">Up next</span>}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden />
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
