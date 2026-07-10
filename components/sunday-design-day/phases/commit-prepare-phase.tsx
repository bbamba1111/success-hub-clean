"use client"

import { useSdd } from "@/components/sunday-design-day/sdd-state"
import { GuidanceNote } from "@/components/sunday-design-day/sdd-ui"
import {
  DESIGN_SEGMENTS,
  FOCUS_AREA_OPTIONS,
  DELEGATION_CATEGORIES,
  CLOSING_GUIDANCE,
} from "@/components/sunday-design-day/sdd-config"

export function CommitPreparePhase() {
  const { state } = useSdd()
  const { weekly, focusAreas, segments, ceo, delegationItems } = state.data

  const focusLabels = focusAreas
    .map((id) => FOCUS_AREA_OPTIONS.find((a) => a.id === id)?.label)
    .filter(Boolean) as string[]

  const rules = DESIGN_SEGMENTS.map((s) => ({ title: s.title, rule: segments[s.id]?.rule?.trim() })).filter(
    (r) => r.rule,
  )

  const ceoSection = DESIGN_SEGMENTS.find((s) => s.ceoSections)
  const ceoPriorities =
    ceoSection?.ceoSections
      ?.filter((sec) => !sec.informational)
      .map((sec) => ({ title: sec.title, value: ceo[sec.id]?.trim() }))
      .filter((c) => c.value) ?? []

  const timeFreedom = segments["time-freedom"]
  const timeFreedomCommitment = timeFreedom?.planner?.trim() || timeFreedom?.rule?.trim()

  const delegatedCount = delegationItems.filter((i) => i.category && i.category !== "eliminate" && i.category !== "delay")
    .length
  const releasedCount = delegationItems.filter((i) => i.category === "eliminate" || i.category === "delay").length

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-brand-ink-soft">
        Here is the week you&apos;ve designed. Review it, then consciously install it.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <SummaryCard title="Weekly Intention™" empty={!weekly.intention.trim()}>
          <p className="text-sm leading-relaxed text-brand-ink">{weekly.intention}</p>
        </SummaryCard>

        <SummaryCard title="Weekly Declaration™" empty={!weekly.declaration.trim()}>
          <p className="font-serif text-[15px] italic leading-relaxed text-brand-ink">{weekly.declaration}</p>
        </SummaryCard>

        <SummaryCard title="Priority Focus Areas™" empty={focusLabels.length === 0}>
          <div className="flex flex-wrap gap-1.5">
            {focusLabels.map((label) => (
              <span key={label} className="ds-badge-green">
                {label}
              </span>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard title="Download & Delegate™" empty={delegationItems.length === 0}>
          <p className="text-sm leading-relaxed text-brand-ink">
            {delegatedCount} delegated · {releasedCount} eliminated or delayed
          </p>
        </SummaryCard>

        <SummaryCard title="Operating Rules™" empty={rules.length === 0} full>
          <ul className="space-y-2">
            {rules.map((r) => (
              <li key={r.title} className="text-sm leading-relaxed">
                <span className="font-semibold text-brand-ink">{r.title}: </span>
                <span className="text-brand-ink-soft">{r.rule}</span>
              </li>
            ))}
          </ul>
        </SummaryCard>

        {ceoPriorities.length > 0 && (
          <SummaryCard title="CEO Priorities™" empty={false} full>
            <ul className="space-y-2">
              {ceoPriorities.map((c) => (
                <li key={c.title} className="text-sm leading-relaxed">
                  <span className="font-semibold text-brand-ink">{c.title}: </span>
                  <span className="text-brand-ink-soft">{c.value}</span>
                </li>
              ))}
            </ul>
          </SummaryCard>
        )}

        <SummaryCard title="Time Freedom Commitment™" empty={!timeFreedomCommitment} full>
          <p className="text-sm leading-relaxed text-brand-ink">{timeFreedomCommitment}</p>
        </SummaryCard>
      </div>

      <GuidanceNote size="lg">{CLOSING_GUIDANCE}</GuidanceNote>
    </div>
  )
}

function SummaryCard({
  title,
  children,
  empty,
  full,
}: {
  title: string
  children: React.ReactNode
  empty: boolean
  full?: boolean
}) {
  return (
    <div className={`harmony-surface p-5 ${full ? "sm:col-span-2" : ""}`}>
      <h3 className="ds-eyebrow text-brand-green-dark/80">{title}</h3>
      <div className="mt-2.5">
        {empty ? <p className="text-sm italic text-brand-ink-soft/60">Not designed yet.</p> : children}
      </div>
    </div>
  )
}
