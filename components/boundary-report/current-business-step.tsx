"use client"

import { Check } from "lucide-react"
import { STAGE_LABELS } from "@/lib/boundary-report/business-intelligence"
import {
  CURRENT_BUSINESS_QUESTIONS,
  DAYS_OPTIONS,
  DELIVERY_OPTIONS,
  DEPENDENCY_OPTIONS,
  EXPECTATION_OPTIONS,
  FREQUENCY_OPTIONS,
  HOURS_OPTIONS,
  NONE_CURRENTLY,
  OTHER,
  SYSTEM_OPTIONS,
  type CurrentBusiness,
} from "@/lib/boundary-report/current-business"
import type { BusinessStage } from "@/lib/boundary-report/types"

type Patch = (next: Partial<CurrentBusiness>) => void

const inputClass =
  "w-full rounded-2xl border border-brand-blush bg-white px-4 py-3 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 outline-none transition-colors focus:border-brand-coral"

function Choice({
  label,
  active,
  multi,
  onClick,
}: {
  label: string
  active: boolean
  multi?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left font-sans text-sm text-brand-ink transition-colors ${
        active ? "border-brand-coral bg-brand-coral/10" : "border-brand-blush bg-white hover:border-brand-coral/50"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${multi ? "rounded" : "rounded-full"} ${
          active ? "border-brand-coral bg-brand-coral" : "border-brand-ink-soft/40 bg-white"
        }`}
      >
        {active && <Check className="h-2.5 w-2.5 text-white" />}
      </span>
      {label}
    </button>
  )
}

function ChoiceGroup({
  label,
  options,
  value,
  onSelect,
  columns = "sm:grid-cols-2",
}: {
  label?: string
  options: string[]
  value: string | null
  onSelect: (v: string) => void
  columns?: string
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      {label && (
        <p className="mb-2.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink-soft">{label}</p>
      )}
      <div className={`grid grid-cols-1 gap-2 ${columns}`}>
        {options.map((o) => (
          <Choice key={o} label={o} active={value === o} onClick={() => onSelect(o)} />
        ))}
      </div>
    </div>
  )
}

function MultiGroup({
  label,
  options,
  value,
  onChange,
  exclusive,
}: {
  label: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  /** Option that clears every other selection (e.g. "None currently"). */
  exclusive?: string
}) {
  function toggle(o: string) {
    if (value.includes(o)) return onChange(value.filter((x) => x !== o))
    if (o === exclusive) return onChange([o])
    onChange([...value.filter((x) => x !== exclusive), o])
  }
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2.5 font-sans text-xs text-brand-ink-soft">Choose all that apply</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <Choice key={o} label={o} multi active={value.includes(o)} onClick={() => toggle(o)} />
        ))}
      </div>
    </div>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  rows?: number
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-sm font-semibold text-brand-ink">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

export function CurrentBusinessStep({
  index,
  value,
  onChange,
}: {
  index: number
  value: CurrentBusiness
  onChange: Patch
}) {
  const q = CURRENT_BUSINESS_QUESTIONS[index]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green">
          Question {index + 1} of {CURRENT_BUSINESS_QUESTIONS.length} · {q.title}
        </p>
        <h2 className="font-playfair text-2xl font-bold text-brand-ink text-balance">{q.question}</h2>
      </div>

      {index === 0 && (
        <div role="radiogroup" aria-label={q.question} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["start", "grow", "scale"] as BusinessStage[]).map((s) => {
            const active = value.stage === s
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ stage: s })}
                className={`rounded-2xl border px-5 py-5 text-center transition-colors ${
                  active ? "border-brand-coral bg-brand-coral/5" : "border-brand-blush bg-white hover:border-brand-coral/50"
                }`}
              >
                <span className="block font-playfair text-lg font-bold text-brand-ink">{STAGE_LABELS[s]}</span>
              </button>
            )
          })}
        </div>
      )}

      {index === 1 && (
        <TextField
          id="cb-services"
          label="Your primary services, expertise, or client deliverables"
          value={value.services}
          onChange={(services) => onChange({ services })}
          placeholder="e.g. Brand strategy and website design for wellness practices; monthly retainer support"
          rows={4}
        />
      )}

      {index === 2 && (
        <>
          <ChoiceGroup
            options={DELIVERY_OPTIONS}
            value={value.deliveryModel}
            onSelect={(deliveryModel) => onChange({ deliveryModel })}
          />
          <TextField
            id="cb-delivery"
            label={value.deliveryModel === OTHER ? "Please describe" : "Anything to add? (optional)"}
            value={value.deliveryDetail}
            onChange={(deliveryDetail) => onChange({ deliveryDetail })}
            placeholder="e.g. Two part-time contractors handle delivery; I do all client calls"
            rows={2}
          />
        </>
      )}

      {index === 3 && (
        <>
          <MultiGroup
            label={q.question}
            options={DEPENDENCY_OPTIONS}
            value={value.dependencies}
            onChange={(dependencies) => onChange({ dependencies })}
          />
          {value.dependencies.includes(OTHER) && (
            <TextField
              id="cb-dependency-other"
              label="Other"
              value={value.dependencyOther}
              onChange={(dependencyOther) => onChange({ dependencyOther })}
              placeholder="What else depends on you?"
              rows={2}
            />
          )}
        </>
      )}

      {index === 4 && (
        <div className="flex flex-col gap-6">
          <ChoiceGroup
            label="Typical days worked per week"
            options={DAYS_OPTIONS}
            value={value.daysPerWeek}
            onSelect={(daysPerWeek) => onChange({ daysPerWeek })}
            columns="grid-cols-3 sm:grid-cols-6"
          />
          <ChoiceGroup
            label="Typical hours worked per day"
            options={HOURS_OPTIONS}
            value={value.hoursPerDay}
            onSelect={(hoursPerDay) => onChange({ hoursPerDay })}
            columns="sm:grid-cols-3"
          />
          <ChoiceGroup
            label="Does work extend into evenings or weekends?"
            options={FREQUENCY_OPTIONS}
            value={value.extendsBeyondHours}
            onSelect={(extendsBeyondHours) => onChange({ extendsBeyondHours })}
            columns="sm:grid-cols-4"
          />
          <ChoiceGroup
            label="Do client demands or deadlines change your schedule?"
            options={FREQUENCY_OPTIONS}
            value={value.scheduleChanges}
            onSelect={(scheduleChanges) => onChange({ scheduleChanges })}
            columns="sm:grid-cols-4"
          />
          <TextField
            id="cb-workload"
            label="Anything to add? (optional)"
            value={value.workloadDetail}
            onChange={(workloadDetail) => onChange({ workloadDetail })}
            placeholder="e.g. Launch months run 60+ hours; Fridays are usually lighter"
            rows={2}
          />
        </div>
      )}

      {index === 5 && (
        <>
          <MultiGroup
            label={q.question}
            options={EXPECTATION_OPTIONS}
            value={value.clientExpectations}
            onChange={(clientExpectations) => onChange({ clientExpectations })}
          />
          {value.clientExpectations.includes(OTHER) && (
            <TextField
              id="cb-expectation-other"
              label="Other"
              value={value.expectationOther}
              onChange={(expectationOther) => onChange({ expectationOther })}
              placeholder="What else do clients expect?"
              rows={2}
            />
          )}
        </>
      )}

      {index === 6 && (
        <>
          <MultiGroup
            label={q.question}
            options={SYSTEM_OPTIONS}
            value={value.systems}
            exclusive={NONE_CURRENTLY}
            onChange={(systems) => onChange({ systems })}
          />
          {value.systems.filter((s) => s !== NONE_CURRENTLY).length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="font-sans text-sm font-semibold text-brand-ink">Which tools? (optional)</p>
              {value.systems
                .filter((s) => s !== NONE_CURRENTLY)
                .map((s) => {
                  const id = `cb-tool-${s.replace(/\W+/g, "-").toLowerCase()}`
                  return (
                    <div key={s} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                      <label htmlFor={id} className="font-sans text-xs text-brand-ink-soft sm:w-56 sm:shrink-0">
                        {s}
                      </label>
                      <input
                        id={id}
                        type="text"
                        value={value.toolNames[s] ?? ""}
                        onChange={(e) => onChange({ toolNames: { ...value.toolNames, [s]: e.target.value } })}
                        placeholder="Tool names"
                        className={inputClass}
                      />
                    </div>
                  )
                })}
            </div>
          )}
        </>
      )}

      {index === 7 && (
        <TextField
          id="cb-challenge"
          label="In your own words"
          value={value.challenge}
          onChange={(challenge) => onChange({ challenge })}
          placeholder="e.g. Every client decision waits on me, so I can't step away without things stalling"
          rows={4}
        />
      )}

      {index === 8 && (
        <TextField
          id="cb-desired"
          label="In your own words"
          value={value.desiredChange}
          onChange={(desiredChange) => onChange({ desiredChange })}
          placeholder="e.g. Clients knowing I respond within one business day, not within the hour"
          rows={4}
        />
      )}
    </div>
  )
}
