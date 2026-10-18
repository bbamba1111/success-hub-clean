"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown, ChevronLeft, Plus } from "lucide-react"
import { useWeeklyLifePriorities } from "@/lib/weekly-life-priorities/use-weekly-life-priorities"
import { useWeeklyBoundaryFocus } from "@/lib/weekly-boundary-focus/use-weekly-boundary-focus"
import {
  BOUNDARY_CATEGORIES,
  BOUNDARY_OPTIONS,
  boundaryAffectsOthers,
  recommendBoundary,
  type BoundaryOption,
} from "@/lib/weekly-boundary-focus/catalog"
import type { BoundaryReportData } from "@/lib/boundary-report/types"

const microLabel = "font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60"
const inputCls =
  "w-full rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/60 focus:outline-none focus:ring-2 focus:ring-[#7FB069]/30"

function CollisionTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <p className="font-sans text-xs italic text-[#6B5860]">
      <span className="sr-only">Collision tags: </span>
      {tags.join(" · ")}
    </p>
  )
}

const AGREEMENT_PREFIX = "Who needs to agree: "

export function MonthlyBoundaryFocus({ report }: { report: BoundaryReportData | null }) {
  const { priorities } = useWeeklyLifePriorities()
  const { focus, save, isLoading } = useWeeklyBoundaryFocus()

  const recommendation = useMemo(
    () => recommendBoundary(report, priorities.map((p) => p.label)),
    [report, priorities],
  )

  const [choosing, setChoosing] = useState(false)
  const [pending, setPending] = useState<BoundaryOption | null>(null)
  const [agreement, setAgreement] = useState("")
  const [customMode, setCustomMode] = useState(false)
  const [custom, setCustom] = useState({ name: "", rule: "", collision: "" })

  const chosenOption = BOUNDARY_OPTIONS.find((o) => o.id === focus.optionId) ?? null
  const chosen = focus.boundaryText

  function pick(o: BoundaryOption) {
    setPending(o)
    setAgreement("")
  }

  function confirm() {
    if (!pending) return
    const needsAgreement = boundaryAffectsOthers(pending.collisionTags)
    const context =
      needsAgreement && agreement.trim()
        ? `${AGREEMENT_PREFIX}${agreement.trim()}`
        : recommendation?.option.id === pending.id
          ? recommendation.context
          : null
    void save({ boundaryText: pending.label, optionId: pending.id, sourceContext: context, status: "chosen" })
    setPending(null)
    setChoosing(false)
  }

  function saveCustom() {
    const name = custom.name.trim()
    if (!name) return
    const parts = [
      custom.rule.trim() && `Rule: ${custom.rule.trim()}`,
      custom.collision.trim() && `Collides with: ${custom.collision.trim()}`,
    ].filter(Boolean)
    void save({ boundaryText: name, optionId: "custom", sourceContext: parts.join(" — ") || null, status: "chosen" })
    setCustom({ name: "", rule: "", collision: "" })
    setCustomMode(false)
    setChoosing(false)
  }

  const showPicker = choosing || (!chosen && !isLoading)

  return (
    <details open className="group rounded-3xl border border-[#7FB069]/30 bg-[#F3F8ED] shadow-sm">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-6 py-6 sm:px-8 [&::-webkit-details-marker]:hidden">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            03 · Monthly Members Only
          </p>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-[#2E1F27] text-balance">
            Monthly Business Boundary Focus™
          </h3>
          <p className="mt-1 font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
            Choose the one boundary you&apos;ll build a rule around this month.
          </p>
        </div>
        <ChevronDown
          className="mt-1 h-5 w-5 shrink-0 text-[#5B835F] transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>

      <div className="flex flex-col gap-4 px-6 pb-7 sm:px-8">
        {isLoading && !chosen ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-5">
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#7FB069]/20" />
            <div className="h-6 w-2/3 animate-pulse rounded-full bg-[#7FB069]/20" />
          </div>
        ) : chosen && !choosing ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#7FB069]/30 bg-white px-5 py-5">
            <p className={microLabel}>This month&apos;s Business Operating Rule™</p>
            <p className="font-serif text-2xl font-semibold text-[#2E1F27] text-pretty">{chosen}</p>
            {chosenOption && (
              <>
                <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">{chosenOption.helper}</p>
                <CollisionTags tags={chosenOption.collisionTags} />
              </>
            )}
            {focus.sourceContext && focus.optionId === "custom" && (
              <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">{focus.sourceContext}</p>
            )}
            {focus.sourceContext?.startsWith(AGREEMENT_PREFIX) && (
              <p className="font-sans text-xs text-[#6B5860]">{focus.sourceContext}</p>
            )}
            <button
              type="button"
              onClick={() => setChoosing(true)}
              className="self-start rounded-full border border-[#7FB069]/30 bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
            >
              Change this month&apos;s boundary
            </button>
          </div>
        ) : null}

        {showPicker && (
          <div className="flex flex-col gap-5 rounded-2xl border border-[#E8DFE2] bg-white px-5 py-5">
            <p className="font-serif text-lg italic text-[#2E1F27]">
              Which of these collided with your work most recently?
            </p>

            <div role="radiogroup" aria-label="Monthly business boundary" className="flex flex-col gap-5">
              {BOUNDARY_CATEGORIES.map((cat) => (
                <fieldset key={cat.label} className="flex flex-col gap-2">
                  <legend className={`${microLabel} mb-2`}>{cat.label}</legend>
                  {cat.options.map((o) => {
                    const active = pending ? pending.id === o.id : focus.optionId === o.id
                    const recommended = recommendation?.option.id === o.id
                    return (
                      <button
                        key={o.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => pick(o)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                          active ? "border-[#5B835F] bg-[#F3F8ED]" : "border-[#E8DFE2] bg-white hover:bg-black/[0.02]"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-[#5B835F] bg-[#5B835F]" : "border-[#6B5860]/40"
                          }`}
                        >
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="font-sans text-sm font-semibold text-[#2E1F27]">
                            {o.label}
                            {recommended && (
                              <span className="ml-2 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#5B835F]">
                                Recommended
                              </span>
                            )}
                          </span>
                          <span className="font-sans text-xs leading-relaxed text-[#6B5860]">{o.helper}</span>
                          <CollisionTags tags={o.collisionTags} />
                        </span>
                      </button>
                    )
                  })}
                </fieldset>
              ))}
            </div>

            {pending && (
              <div className="flex flex-col gap-3 rounded-2xl border border-[#5B835F]/40 bg-[#F3F8ED] px-4 py-4">
                <p className={microLabel}>Review your choice</p>
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">{pending.label}</p>
                <CollisionTags tags={pending.collisionTags} />
                {boundaryAffectsOthers(pending.collisionTags) && (
                  <label className="flex flex-col gap-1.5">
                    <span className="font-sans text-sm font-semibold text-[#2E1F27]">Who needs to agree?</span>
                    <input
                      type="text"
                      value={agreement}
                      onChange={(e) => setAgreement(e.target.value)}
                      placeholder="People or roles, e.g. my VA, key clients, my operations lead"
                      className={inputCls}
                    />
                  </label>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={confirm}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-6 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90"
                  >
                    <Check className="h-4 w-4" aria-hidden /> Confirm this boundary
                  </button>
                  <button
                    type="button"
                    onClick={() => setPending(null)}
                    className="rounded-full border border-[#E8DFE2] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#6B5860] hover:bg-black/[0.03]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-[#E8DFE2] pt-4">
              <p className={microLabel}>Create My Own</p>
              {customMode ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={custom.name}
                    onChange={(e) => setCustom((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Boundary name"
                    aria-label="Boundary name"
                    className={inputCls}
                  />
                  <input
                    value={custom.rule}
                    onChange={(e) => setCustom((c) => ({ ...c, rule: e.target.value }))}
                    placeholder="The rule I intend to establish"
                    aria-label="The rule I intend to establish"
                    className={inputCls}
                  />
                  <input
                    value={custom.collision}
                    onChange={(e) => setCustom((c) => ({ ...c, collision: e.target.value }))}
                    placeholder="What threatens or collides with this boundary"
                    aria-label="What threatens or collides with this boundary"
                    className={`${inputCls} italic`}
                  />
                  <button
                    type="button"
                    onClick={saveCustom}
                    disabled={!custom.name.trim()}
                    className="self-start rounded-full bg-[#5B835F] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                  >
                    Use my boundary
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#E8DFE2] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
                >
                  <Plus className="h-4 w-4" aria-hidden /> Create my own
                </button>
              )}
            </div>

            {chosen && (
              <button
                type="button"
                onClick={() => {
                  setChoosing(false)
                  setPending(null)
                }}
                className="inline-flex items-center gap-1 self-start font-sans text-xs font-semibold text-[#6B5860] hover:text-[#3A2E33]"
              >
                <ChevronLeft className="h-3 w-3" aria-hidden /> Back to my saved boundary
              </button>
            )}
          </div>
        )}

        <a
          href="/boundary-report"
          className="inline-flex items-center gap-1 self-start font-sans text-xs font-semibold text-[#6B5860] hover:text-[#3A2E33]"
        >
          <ChevronLeft className="h-3 w-3" aria-hidden /> Back to the Recommendation
        </a>
      </div>
    </details>
  )
}
