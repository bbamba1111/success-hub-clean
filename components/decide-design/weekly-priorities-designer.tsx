"use client"

/**
 * DECIDE MY THREE WEEKLY PRIORITIES™
 * ---------------------------------------------------------------------------
 * The lightweight heart of Decide & Design™. The founder chooses exactly three
 * changes to carry into the week — what to protect, what to hand off, and what
 * to change about how work operates — and each becomes a first-person intention.
 *
 * This is NOT a task planner. Nothing here generates work, cadence, treatment
 * modes, or hourly blocks; the CEO Workday™ (FounderGpsWorkspace) remains the
 * protected container for real business work and is untouched.
 */

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Check, Pencil, RefreshCw } from "lucide-react"
import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import {
  DELEGATION_OPTIONS,
  LIFE_PRIORITY_OPTIONS,
  OPERATING_RULE_OPTIONS,
  suggestDelegationFromBba,
  toPhrase,
  type PriorityOption,
} from "@/lib/weekly-commitments/catalog"
import {
  buildBoundaryDraft,
  buildDelegationIntention,
  buildLifeIntention,
  buildOperatingRuleIntention,
  seedVariant,
} from "@/lib/weekly-commitments/intention-builder"
import {
  BOUNDARY_AUDIENCE_LABEL,
  LIFE_WINDOW_LABEL,
  type BoundaryAudience,
  type LifeWindow,
  type WeeklyCommitments,
} from "@/lib/weekly-commitments/types"
import { getCurrentBbaBaseline } from "@/lib/business-bottleneck-audit/bba-storage"
import type { BbaBaselineRecord } from "@/lib/business-bottleneck-audit/types"
import { getPreviousWeekCarryover } from "@/lib/weekly-commitments/server"

/* ── shared visual atoms (match Decide & Design™ language exactly) ─────────── */

function Card({ children, tone = "white" }: { children: ReactNode; tone?: "white" | "green" | "pink" }) {
  const cls =
    tone === "green"
      ? "border-[#7FB069]/30 bg-[#F3F8ED]"
      : tone === "pink"
        ? "border-[#E26C73]/20 bg-[#FDF8F5]"
        : "border-[#E8DFE2] bg-white"
  return <div className={`rounded-3xl border shadow-sm px-6 py-6 sm:px-8 sm:py-7 space-y-5 ${cls}`}>{children}</div>
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">{children}</p>
  )
}

function Chip({
  selected,
  onClick,
  children,
  accent = "green",
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
  accent?: "green" | "pink"
}) {
  const on = accent === "green" ? "border-[#5B835F] bg-[#5B835F] text-white" : "border-[#C0545A] bg-[#C0545A] text-white"
  const off =
    accent === "green"
      ? "border-[#7FB069]/30 bg-[#F7FBF4] text-[#3A2E33] hover:bg-[#7FB069]/15"
      : "border-[#C0545A]/25 bg-[#FDF8F5] text-[#3A2E33] hover:bg-[#C0545A]/10"
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-left font-sans text-sm transition-colors ${selected ? on : off}`}
    >
      {children}
    </button>
  )
}

/* ── one priority: choose / create my own ─────────────────────────────────── */

function PriorityChooser({
  options,
  suggested,
  suggestedLead,
  selectedOptionId,
  selectedLabel,
  onChoose,
  accent,
}: {
  options: PriorityOption[]
  suggested?: PriorityOption[]
  suggestedLead?: string
  selectedOptionId: string | null
  selectedLabel: string | null
  onChoose: (optionId: string, label: string, phrase: string) => void
  accent: "green" | "pink"
}) {
  const [creating, setCreating] = useState(selectedOptionId === "custom")
  const [draft, setDraft] = useState(selectedOptionId === "custom" ? (selectedLabel ?? "") : "")
  useEffect(() => {
    if (selectedOptionId === "custom") {
      setCreating(true)
      setDraft(selectedLabel ?? "")
    }
  }, [selectedOptionId, selectedLabel])

  const suggestedIds = new Set((suggested ?? []).map((s) => s.id))
  const rest = options.filter((o) => !suggestedIds.has(o.id))

  function commitCustom() {
    const label = draft.trim()
    if (!label) return
    onChoose("custom", label, toPhrase(label))
  }

  return (
    <div className="space-y-3">
      {suggested && suggested.length > 0 && (
        <div className="space-y-2">
          <p className="font-sans text-xs text-[#6B5860]">{suggestedLead}</p>
          <div className="flex flex-wrap gap-2">
            {suggested.map((o) => (
              <Chip key={o.id} accent={accent} selected={selectedOptionId === o.id} onClick={() => { setCreating(false); onChoose(o.id, o.label, o.phrase) }}>
                {o.label}
              </Chip>
            ))}
          </div>
          <p className="font-sans text-xs text-[#6B5860] pt-1">Or choose from these</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {rest.map((o) => (
          <Chip key={o.id} accent={accent} selected={selectedOptionId === o.id} onClick={() => { setCreating(false); onChoose(o.id, o.label, o.phrase) }}>
            {o.label}
          </Chip>
        ))}
        <Chip accent={accent} selected={creating} onClick={() => setCreating(true)}>
          Create my own
        </Chip>
      </div>
      {creating && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) commitCustom()
            }}
            placeholder="In a few words…"
            aria-label="Create my own priority"
            className="flex-1 rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/60 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          />
          <button
            type="button"
            onClick={commitCustom}
            disabled={!draft.trim()}
            className="rounded-full bg-[#5B835F] px-5 py-2.5 font-sans text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            Use this
          </button>
        </div>
      )}
    </div>
  )
}

/* ── intention block: generated first-person, editable, re-buildable ──────── */

function IntentionBlock({
  priorityLabel,
  priorityValue,
  intentionLabel,
  intention,
  edited,
  onEdit,
  onRebuild,
}: {
  priorityLabel: string
  priorityValue: string
  intentionLabel: string
  intention: string
  edited: boolean
  onEdit: (text: string) => void
  onRebuild: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(intention)
  useEffect(() => {
    if (!editing) setDraft(intention)
  }, [intention, editing])

  return (
    <div className="rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-5 py-4 space-y-3">
      <div>
        <Eyebrow>{priorityLabel}</Eyebrow>
        <p className="mt-1 font-sans text-sm font-semibold text-[#2E1F27]">{priorityValue}</p>
      </div>
      <div>
        <Eyebrow>{intentionLabel}</Eyebrow>
        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            aria-label={intentionLabel}
            className="mt-1 w-full rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-serif text-base leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          />
        ) : (
          <p className="mt-1 font-serif text-base leading-relaxed text-[#2E1F27] text-pretty">{intention}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {editing ? (
          <button
            type="button"
            onClick={() => {
              onEdit(draft.trim() || intention)
              setEditing(false)
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-4 py-1.5 font-sans text-xs font-bold text-white hover:opacity-90"
          >
            <Check className="h-3 w-3" aria-hidden /> Done
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-4 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
          >
            <Pencil className="h-3 w-3" aria-hidden /> Edit
          </button>
        )}
        <button
          type="button"
          onClick={onRebuild}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-4 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
        >
          <RefreshCw className="h-3 w-3" aria-hidden /> Build a Different Intention
        </button>
        {edited && <span className="font-sans text-[11px] text-[#6B5860]">In your own words</span>}
      </div>
    </div>
  )
}

/* ── main ──────────────────────────────────────────────────────────────────── */

export function WeeklyPrioritiesDesigner() {
  const { commitments: c, update, saveWeek } = useWeeklyCommitments()
  const [bba, setBba] = useState<BbaBaselineRecord | null>(null)
  const [carry, setCarry] = useState<Awaited<ReturnType<typeof getPreviousWeekCarryover>>>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getCurrentBbaBaseline().then(setBba).catch(() => setBba(null))
    getPreviousWeekCarryover(c.weekKey).then(setCarry).catch(() => setCarry(null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const delegationSuggestions = useMemo(() => suggestDelegationFromBba(bba), [bba])

  /* phrase for each priority — catalog phrase or softened custom text */
  const lifePhrase = useMemo(
    () => LIFE_PRIORITY_OPTIONS.find((o) => o.id === c.lifePriorityOptionId)?.phrase ?? (c.lifePriority ? toPhrase(c.lifePriority) : ""),
    [c.lifePriorityOptionId, c.lifePriority],
  )
  const delegationPhrase = useMemo(
    () =>
      [...DELEGATION_OPTIONS, ...delegationSuggestions].find((o) => o.id === c.delegationOptionId)?.phrase ??
      (c.delegationPriority ? toPhrase(c.delegationPriority) : ""),
    [c.delegationOptionId, c.delegationPriority, delegationSuggestions],
  )
  const rulePhrase = useMemo(
    () => OPERATING_RULE_OPTIONS.find((o) => o.id === c.operatingRuleOptionId)?.phrase ?? (c.operatingRule ? toPhrase(c.operatingRule) : ""),
    [c.operatingRuleOptionId, c.operatingRule],
  )

  /* choose handlers — set priority, seed a fresh intention unless founder hand-edited */
  function chooseLife(optionId: string, label: string, phrase: string) {
    const variant = seedVariant(phrase)
    update((prev) => ({
      lifePriorityOptionId: optionId,
      lifePriority: label,
      lifeIntentionVariant: variant,
      lifeIntention: prev.lifeIntentionEdited && prev.lifePriority === label ? prev.lifeIntention : buildLifeIntention(phrase, variant),
      lifeIntentionEdited: prev.lifeIntentionEdited && prev.lifePriority === label,
      lifeStatus: prev.lifeStatus === "not-planned" && prev.lifeWindows.length > 0 ? "planned" : prev.lifeStatus,
      boundaryDraft: prev.boundaryDraftEdited ? prev.boundaryDraft : prev.boundaryAudiences.length ? buildBoundaryDraft(phrase, prev.lifeWindows, prev.boundaryAudiences) : prev.boundaryDraft,
    }))
  }
  function chooseDelegation(optionId: string, label: string, phrase: string) {
    const variant = seedVariant(phrase)
    update((prev) => ({
      delegationOptionId: optionId,
      delegationPriority: label,
      delegationIntentionVariant: variant,
      delegationIntention: prev.delegationIntentionEdited && prev.delegationPriority === label ? prev.delegationIntention : buildDelegationIntention(phrase, variant),
      delegationIntentionEdited: prev.delegationIntentionEdited && prev.delegationPriority === label,
    }))
  }
  function chooseRule(optionId: string, label: string, phrase: string) {
    const variant = seedVariant(phrase)
    update((prev) => ({
      operatingRuleOptionId: optionId,
      operatingRule: label,
      operatingRuleIntentionVariant: variant,
      operatingRuleIntention: prev.operatingRuleIntentionEdited && prev.operatingRule === label ? prev.operatingRuleIntention : buildOperatingRuleIntention(phrase, variant),
      operatingRuleIntentionEdited: prev.operatingRuleIntentionEdited && prev.operatingRule === label,
    }))
  }

  function toggleWindow(w: LifeWindow) {
    update((prev) => {
      const windows = prev.lifeWindows.includes(w) ? prev.lifeWindows.filter((x) => x !== w) : [...prev.lifeWindows, w]
      return {
        lifeWindows: windows,
        lifeStatus: prev.lifeStatus === "not-planned" && windows.length > 0 ? "planned" : prev.lifeStatus,
        boundaryDraft: prev.boundaryDraftEdited || prev.boundaryAudiences.length === 0 ? prev.boundaryDraft : buildBoundaryDraft(lifePhrase, windows, prev.boundaryAudiences),
      }
    })
  }
  function toggleAudience(a: BoundaryAudience) {
    update((prev) => {
      const audiences = prev.boundaryAudiences.includes(a) ? prev.boundaryAudiences.filter((x) => x !== a) : [...prev.boundaryAudiences, a]
      return {
        boundaryAudiences: audiences,
        boundaryDraft: prev.boundaryDraftEdited ? prev.boundaryDraft : audiences.length ? buildBoundaryDraft(lifePhrase, prev.lifeWindows, audiences) : null,
      }
    })
  }

  const ready = !!c.lifePriority && !!c.delegationPriority && !!c.operatingRule
  const missing = [
    !c.lifePriority && "a Life Priority",
    !c.delegationPriority && "a Delegation Priority",
    !c.operatingRule && "an Operating Rule",
  ].filter(Boolean) as string[]

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    const res = await saveWeek()
    setSaving(false)
    if (!res.ok) setSaveError(res.error ?? "Could not save your week.")
    else setSaved(true)
  }

  const windows: LifeWindow[] = ["after-5", "friday", "saturday", "sunday", "time-freedom"]
  const audiences: BoundaryAudience[] = ["family", "partner", "team", "clients", "partners", "stakeholders", "other"]

  return (
    <div className="space-y-6">
      {/* ── Heading ─────────────────────────────────────────────────────────── */}
      <Card>
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            Decide My Three Weekly Priorities™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
            Choose three simple changes that will help you make more room for life and contain the work that competes
            for it.
          </p>
        </div>

        {carry && (
          <div className="rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-5 py-4 space-y-2">
            <Eyebrow>Still in progress from last week</Eyebrow>
            <ul className="font-sans text-sm text-[#3A2E33] space-y-1">
              {carry.open.life && carry.commitments.lifePriority && <li>Life — {carry.commitments.lifePriority}</li>}
              {carry.open.delegation && carry.commitments.delegationPriority && <li>Delegation — {carry.commitments.delegationPriority}</li>}
              {carry.open.operatingRule && carry.commitments.operatingRule && <li>Operating rule — {carry.commitments.operatingRule}</li>}
            </ul>
            <p className="font-sans text-xs text-[#6B5860]">
              Nothing carries over on its own. Choose again below — continue it, change it, or let it go.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {carry.open.life && carry.commitments.lifePriority && (
                <Chip selected={false} onClick={() => chooseLife(carry.commitments.lifePriorityOptionId ?? "custom", carry.commitments.lifePriority!, LIFE_PRIORITY_OPTIONS.find((o) => o.id === carry.commitments.lifePriorityOptionId)?.phrase ?? toPhrase(carry.commitments.lifePriority!))}>
                  Continue Life Priority
                </Chip>
              )}
              {carry.open.delegation && carry.commitments.delegationPriority && (
                <Chip selected={false} onClick={() => chooseDelegation(carry.commitments.delegationOptionId ?? "custom", carry.commitments.delegationPriority!, DELEGATION_OPTIONS.find((o) => o.id === carry.commitments.delegationOptionId)?.phrase ?? toPhrase(carry.commitments.delegationPriority!))}>
                  Continue Delegation
                </Chip>
              )}
              {carry.open.operatingRule && carry.commitments.operatingRule && (
                <Chip selected={false} onClick={() => chooseRule(carry.commitments.operatingRuleOptionId ?? "custom", carry.commitments.operatingRule!, OPERATING_RULE_OPTIONS.find((o) => o.id === carry.commitments.operatingRuleOptionId)?.phrase ?? toPhrase(carry.commitments.operatingRule!))}>
                  Continue Operating Rule
                </Chip>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ── Priority 1 · Life ───────────────────────────────────────────────── */}
      <Card>
        <div>
          <Eyebrow>Priority 1</Eyebrow>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-[#2E1F27]">Weekly Life Priority™</h3>
          <p className="mt-2 font-serif text-lg text-[#2E1F27]">What do I want to make more room for this week?</p>
          <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed">
            Choose one thing you want to protect, enjoy, experience, or make time for outside the business.
          </p>
        </div>
        <PriorityChooser options={LIFE_PRIORITY_OPTIONS} selectedOptionId={c.lifePriorityOptionId} selectedLabel={c.lifePriority} onChoose={chooseLife} accent="pink" />
      </Card>

      {/* ── Priority 2 · Delegation ─────────────────────────────────────────── */}
      <Card>
        <div>
          <Eyebrow>Priority 2</Eyebrow>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-[#2E1F27]">Weekly Delegation Priority™</h3>
          <p className="mt-2 font-serif text-lg text-[#2E1F27]">What do I need to stop carrying myself?</p>
          <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed">
            Choose one responsibility, task, or area you are ready to move to someone else.
          </p>
        </div>
        <PriorityChooser
          options={DELEGATION_OPTIONS}
          suggested={delegationSuggestions}
          suggestedLead="We noticed a few opportunities. Which one would make the biggest difference?"
          selectedOptionId={c.delegationOptionId}
          selectedLabel={c.delegationPriority}
          onChoose={chooseDelegation}
          accent="green"
        />
      </Card>

      {/* ── Priority 3 · Operating Rule ─────────────────────────────────────── */}
      <Card>
        <div>
          <Eyebrow>Priority 3</Eyebrow>
          <h3 className="mt-1 font-serif text-2xl font-semibold text-[#2E1F27]">Weekly Operating Rule Priority™</h3>
          <p className="mt-2 font-serif text-lg text-[#2E1F27]">What rule would make work easier to contain this week?</p>
          <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed">
            Choose one simple rule that protects time, reduces interruptions, clarifies ownership, or changes how work
            gets done.
          </p>
        </div>
        <PriorityChooser options={OPERATING_RULE_OPTIONS} selectedOptionId={c.operatingRuleOptionId} selectedLabel={c.operatingRule} onChoose={chooseRule} accent="green" />
      </Card>

      {/* ── My Three Weekly Intentions™ ─────────────────────────────────────── */}
      {(c.lifeIntention || c.delegationIntention || c.operatingRuleIntention) && (
        <Card tone="green">
          <div>
            <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
              My Three Weekly Intentions™
            </p>
            <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
              Spoken in your voice. Edit any line until it sounds like you.
            </p>
          </div>
          <div className="space-y-3">
            {c.lifePriority && c.lifeIntention && (
              <IntentionBlock
                priorityLabel="Your Life Priority™"
                priorityValue={c.lifePriority}
                intentionLabel="Your Life Intention™"
                intention={c.lifeIntention}
                edited={c.lifeIntentionEdited}
                onEdit={(t) => update({ lifeIntention: t, lifeIntentionEdited: true })}
                onRebuild={() => {
                  const v = c.lifeIntentionVariant + 1
                  update({ lifeIntentionVariant: v, lifeIntention: buildLifeIntention(lifePhrase, v), lifeIntentionEdited: false })
                }}
              />
            )}
            {c.delegationPriority && c.delegationIntention && (
              <IntentionBlock
                priorityLabel="Your Delegation Priority™"
                priorityValue={c.delegationPriority}
                intentionLabel="Your Delegation Intention™"
                intention={c.delegationIntention}
                edited={c.delegationIntentionEdited}
                onEdit={(t) => update({ delegationIntention: t, delegationIntentionEdited: true })}
                onRebuild={() => {
                  const v = c.delegationIntentionVariant + 1
                  update({ delegationIntentionVariant: v, delegationIntention: buildDelegationIntention(delegationPhrase, v), delegationIntentionEdited: false })
                }}
              />
            )}
            {c.operatingRule && c.operatingRuleIntention && (
              <IntentionBlock
                priorityLabel="Your Operating Rule Priority™"
                priorityValue={c.operatingRule}
                intentionLabel="Your Operating Rule Intention™"
                intention={c.operatingRuleIntention}
                edited={c.operatingRuleIntentionEdited}
                onEdit={(t) => update({ operatingRuleIntention: t, operatingRuleIntentionEdited: true })}
                onRebuild={() => {
                  const v = c.operatingRuleIntentionVariant + 1
                  update({ operatingRuleIntentionVariant: v, operatingRuleIntention: buildOperatingRuleIntention(rulePhrase, v), operatingRuleIntentionEdited: false })
                }}
              />
            )}
          </div>
        </Card>
      )}

      {/* ── After 5 / Weekend Life Priority™ ────────────────────────────────── */}
      {c.lifePriority && (
        <Card tone="pink">
          <div>
            <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#C0545A]">
              After 5 / Weekend Life Priority™
            </p>
            <p className="mt-2 font-serif text-lg text-[#2E1F27]">When will you make room for this?</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860] leading-relaxed">
              Turn the intention into actual protected space. Choose where {lifePhrase || "it"} lives this week.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {windows.map((w) => (
              <Chip key={w} accent="pink" selected={c.lifeWindows.includes(w)} onClick={() => toggleWindow(w)}>
                {LIFE_WINDOW_LABEL[w]}
              </Chip>
            ))}
          </div>

          {/* Communicate My Boundary™ */}
          <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-3">
            <div>
              <Eyebrow>Communicate My Boundary™</Eyebrow>
              <p className="mt-1 font-sans text-sm text-[#2E1F27]">Who needs to know about the time you&apos;re protecting?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {audiences.map((a) => (
                <Chip key={a} accent="pink" selected={c.boundaryAudiences.includes(a)} onClick={() => toggleAudience(a)}>
                  {BOUNDARY_AUDIENCE_LABEL[a]}
                </Chip>
              ))}
            </div>
            {c.boundaryAudiences.length > 0 && (
              <div className="space-y-2">
                <label htmlFor="boundary-draft" className="font-sans text-xs text-[#6B5860]">
                  A short note you can send as-is or make your own
                </label>
                <textarea
                  id="boundary-draft"
                  value={c.boundaryDraft ?? ""}
                  onChange={(e) => update({ boundaryDraft: e.target.value, boundaryDraftEdited: true })}
                  rows={3}
                  className="w-full rounded-xl border border-[#E8DFE2] bg-white px-3.5 py-2.5 font-sans text-sm leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#E26C73]/30"
                />
                {c.boundaryDraftEdited && (
                  <button
                    type="button"
                    onClick={() => update({ boundaryDraft: buildBoundaryDraft(lifePhrase, c.lifeWindows, c.boundaryAudiences), boundaryDraftEdited: false })}
                    className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
                  >
                    Rebuild the draft
                  </button>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ── Save My Week ────────────────────────────────────────────────────── */}
      <Card>
        {saved || c.designedAt ? (
          <div className="space-y-2">
            <p className="font-serif text-2xl font-semibold text-[#2E1F27]">Your week is designed.</p>
            <p className="font-sans text-sm text-[#3A2E33] leading-relaxed text-pretty">
              You&apos;ve chosen what to protect, what to hand off, and what to change about the way work gets done.
            </p>
            <p className="font-sans text-sm text-[#3A2E33]">Now step into your Work-Life Balance Business Day™.</p>
            <p className="font-sans text-xs text-[#6B5860] pt-1">Any change you make above is saved to this week automatically.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-xl font-semibold text-[#2E1F27]">Save My Week</p>
              <p className="mt-1 font-sans text-sm text-[#6B5860]">
                {ready ? "Three changes, chosen on purpose." : `Still to choose: ${missing.join(", ")}.`}
              </p>
              {saveError && <p className="mt-1 font-sans text-xs text-[#C0545A]">{saveError}</p>}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!ready || saving}
              className="inline-flex items-center justify-center rounded-full bg-[#5B835F] px-7 py-3 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-default"
            >
              {saving ? "Saving…" : "Save My Week"}
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

export type { WeeklyCommitments }
