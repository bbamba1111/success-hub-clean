"use client"

/**
 * Build Blueprint™ card (Phase 9F)
 * ---------------------------------------------------------------------------
 * Renders the `BuildBlueprint` produced once a founder picks a Build Path™
 * for a Founder GPS™ recommendation. Uses the same `DataChip` / rounded-card
 * visual language already established in `my-blueprint-client.tsx` — no new
 * visual system introduced.
 */

import { useState } from "react"
import { RotateCcw } from "lucide-react"

import { getBuildPathDefinition } from "@/lib/build-strategy/build-path-registry"
import type { BuildBlueprint, BuildPathId } from "@/lib/build-strategy/types"

function fmt(val: string) {
  return val.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function DataChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-blush/60 bg-brand-cream/60 px-3.5 py-2.5">
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft/80 mb-0.5">{label}</p>
      <p className="font-sans text-sm font-semibold text-brand-ink leading-snug">{value}</p>
    </div>
  )
}

function NotDeterminedNote() {
  return <span className="text-brand-ink-soft/70 italic">Not yet determined</span>
}

function ValueOrNote({ value }: { value: string }) {
  if (!value || value === "Not yet determined") return <NotDeterminedNote />
  return <>{value}</>
}

/**
 * `recommendedBuildPath`/`recommendedBuildPathReason`/`pathSelectionReason`
 * and `onSavePathSelectionReason` are additive (Phase 11) — showing the
 * founder how their choice compares to the recommendation, without ever
 * overriding it. All optional so existing callers keep working unchanged.
 */
export function BuildBlueprintCard({
  blueprint,
  onChooseDifferentPath,
  recommendedBuildPath = null,
  recommendedBuildPathReason = null,
  pathSelectionReason = null,
  onSavePathSelectionReason,
}: {
  blueprint: BuildBlueprint
  onChooseDifferentPath: () => void
  recommendedBuildPath?: BuildPathId | null
  recommendedBuildPathReason?: string | null
  pathSelectionReason?: string | null
  onSavePathSelectionReason?: (reason: string) => void
}) {
  const pathDef = getBuildPathDefinition(blueprint.buildPath)
  const differsFromRecommendation = Boolean(recommendedBuildPath) && recommendedBuildPath !== blueprint.buildPath
  const [reasonDraft, setReasonDraft] = useState(pathSelectionReason ?? "")

  return (
    <div className="rounded-2xl border border-brand-blush/60 bg-white px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-1">
            Build Blueprint™ · {pathDef.label}
          </p>
          <h3 className="font-display text-lg font-semibold text-brand-ink text-pretty">{blueprint.what}</h3>
        </div>
        <button
          type="button"
          onClick={onChooseDifferentPath}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-blush/70 px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink-soft hover:border-[#C13B6B]/40 hover:text-[#C13B6B] transition-colors"
        >
          <RotateCcw className="h-3 w-3" aria-hidden />
          Choose a different path
        </button>
      </div>

      {differsFromRecommendation && (
        <div className="mb-5 rounded-2xl border border-[#C13B6B]/25 bg-[#C13B6B]/[0.05] px-5 py-4">
          <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">
            Your original recommendation was <span className="font-semibold">{getBuildPathDefinition(recommendedBuildPath!).label}</span>.
            You selected <span className="font-semibold">{pathDef.label}</span>.
          </p>
          {recommendedBuildPathReason && (
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-brand-ink-soft text-pretty">{recommendedBuildPathReason}</p>
          )}
          {onSavePathSelectionReason && (
            <div className="mt-3">
              <label className="font-sans text-xs font-semibold text-brand-ink-soft" htmlFor="path-selection-reason">
                Why a different path? (optional — never required)
              </label>
              <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
                <input
                  id="path-selection-reason"
                  type="text"
                  value={reasonDraft}
                  onChange={(e) => setReasonDraft(e.target.value)}
                  placeholder="e.g. I'd rather keep control of this for now"
                  className="flex-1 rounded-lg border border-brand-blush/70 bg-white px-3 py-2 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:border-[#C13B6B]/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => onSavePathSelectionReason(reasonDraft)}
                  className="shrink-0 rounded-lg bg-[#C13B6B] px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{blueprint.why}</p>
          {blueprint.whyNow && (
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-brand-ink-soft/90 text-pretty">
              <span className="font-semibold text-brand-ink">Why now: </span>
              {blueprint.whyNow}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <DataChip label="Current State" value={blueprint.currentState} />
          <DataChip label="Target State" value={blueprint.targetState} />
          <DataChip label="Desired Outcome" value={blueprint.desiredOutcome} />
          <DataChip label="Who Owns This" value={blueprint.ownerSummary} />
        </div>

        <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/60 px-5 py-4">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-1.5">
            How This Was Adapted For You
          </p>
          <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">{blueprint.businessModelAdaptationNote}</p>
          {blueprint.destinationAdaptationNote && (
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-brand-ink text-pretty">{blueprint.destinationAdaptationNote}</p>
          )}
          {blueprint.capacityConsideration && (
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-brand-ink text-pretty">
              <span className="font-semibold">Capacity: </span>
              {blueprint.capacityConsideration}
            </p>
          )}
        </div>

        {blueprint.prerequisites.length > 0 && (
          <div className="rounded-2xl border border-brand-coral/30 bg-brand-coral/[0.06] px-5 py-4">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-coral-dark mb-2">
              Build These First
            </p>
            <ul className="space-y-1">
              {blueprint.prerequisites.map((p) => (
                <li key={p.id} className="font-sans text-sm text-brand-ink">
                  {p.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Path-specific detail */}
        {blueprint.detail.kind === "build-steps" && (
          <div className="space-y-3">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80">
              {blueprint.detail.coBuildFraming ? "Build This With AI, Step By Step" : "Your Step-By-Step Plan"}
            </p>
            {blueprint.detail.steps.map((step) => (
              <div key={step.stepNumber} className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C13B6B]/15 font-sans text-xs font-bold text-[#C13B6B]">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1">
                    <p className="font-sans text-sm font-semibold text-brand-ink">{step.title}</p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{step.instructions}</p>
                    {step.example && (
                      <p className="mt-1.5 font-sans text-xs italic leading-relaxed text-brand-ink-soft/80 text-pretty">{step.example}</p>
                    )}
                    <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-wider text-brand-ink-soft/70">
                      Definition of Done
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-brand-ink text-pretty">{step.definitionOfDone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {blueprint.detail.kind === "ai-build" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                AI Can Produce
              </p>
              <ul className="space-y-1">
                {blueprint.detail.aiProducibleOutputs.map((o, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                Still Yours To Do
              </p>
              <ul className="space-y-1">
                {blueprint.detail.remainingHumanActions.map((o, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {blueprint.detail.kind === "delegate" && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <DataChip label="Suggested Owner" value={blueprint.detail.suggestedOwnerRole} />
            <DataChip label="Handoff Done When" value={blueprint.detail.handoffDefinitionOfDone} />
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4 sm:col-span-2">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">Briefing Points</p>
              <ul className="space-y-1">
                {blueprint.detail.briefingPoints.map((b, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {blueprint.detail.kind === "hire" && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <DataChip label="Suggested Role" value={blueprint.detail.suggestedRole} />
            <DataChip label="Timeline" value={blueprint.detail.timeline} />
            <DataChip label="Budget Range" value={blueprint.detail.budgetRange} />
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4 sm:col-span-2">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                Core Responsibilities
              </p>
              <ul className="space-y-1">
                {blueprint.detail.coreResponsibilities.map((r, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {blueprint.detail.kind === "outsource" && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <DataChip label="Specialist Type" value={blueprint.detail.suggestedSpecialistType} />
            <DataChip label="Budget Range" value={blueprint.detail.budgetRange} />
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4 sm:col-span-2">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">Scope of Work</p>
              <ul className="space-y-1">
                {blueprint.detail.scopeOfWork.map((s, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {blueprint.detail.kind === "buy" && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <DataChip label="Category" value={blueprint.detail.suggestedCategory} />
            <DataChip label="Budget Range" value={blueprint.detail.budgetRange} />
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4 sm:col-span-2">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                What To Evaluate
              </p>
              <ul className="space-y-1">
                {blueprint.detail.evaluationCriteria.map((c, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {blueprint.detail.kind === "partner" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                Suggested Partner Type
              </p>
              <p className="font-sans text-sm text-brand-ink">{blueprint.detail.suggestedPartnerType}</p>
              <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
                Hand Off To Partner
              </p>
              <ul className="space-y-1">
                {blueprint.detail.scopeHandedToPartner.map((s, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-blush/60 bg-brand-cream/40 px-5 py-4">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">You Retain</p>
              <ul className="space-y-1">
                {blueprint.detail.founderRetains.map((r, i) => (
                  <li key={i} className="font-sans text-sm text-brand-ink">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(blueprint.budgetEstimate !== "Not yet determined" ||
          blueprint.timelineEstimate !== "Not yet determined" ||
          blueprint.targetCompletionDate !== "Not yet determined") && (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <DataChip label="Budget" value={blueprint.budgetEstimate} />
            <DataChip label="Timeline" value={blueprint.timelineEstimate} />
            <DataChip label="Target Completion" value={blueprint.targetCompletionDate} />
          </div>
        )}

        {blueprint.unlocksCapabilities.length > 0 && (
          <div>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft/80 mb-2">
              Unlocks Next
            </p>
            <div className="flex flex-wrap gap-2">
              {blueprint.unlocksCapabilities.map((u) => (
                <span
                  key={u.id}
                  className="inline-block rounded-full bg-brand-green/10 px-3 py-1 font-sans text-xs font-semibold text-brand-green-dark"
                >
                  {u.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { fmt as formatBuildStrategyValue, ValueOrNote }
