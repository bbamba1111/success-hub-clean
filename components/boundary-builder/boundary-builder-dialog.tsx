"use client"

/**
 * Weekly Work-Life Balance Boundary Builder™
 * ---------------------------------------------------------------------------
 * ONE seamless, sequential process (not a wall of tools) that moves the week's
 * single Weekly Work-Life Balance Boundary Focus™ through:
 *
 *   Boundary Focus™ → Work-Life Balance Boundary™ → Business Requirement →
 *   Operating Rule → Implementation → Escalation & Exceptions →
 *   Communicate It™ → Stakeholder Alignment → Training/Q&A → Human SOS™
 *
 * The Boundary Library™ (lib/boundary-library) is the intelligence layer: each
 * step surfaces a small, relevant set of choices instead of a blank field or
 * the whole catalog. Communicate It™ is launched UNCHANGED. Persistence and
 * step transitions live in lib/human-sos.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, Megaphone, Plus, ShieldCheck, Sparkles } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommunicateDelegateDialog } from "@/components/communications/communicate-delegate-dialog"
import {
  BOUNDARY_PATTERNS,
  BUSINESS_REQUIREMENTS,
  ESCALATION_PATTERNS,
  EXCEPTION_PATTERNS,
  IMPLEMENTATION_REQUIREMENTS,
  OPERATING_RULE_PATTERNS,
  TRAINING_REQUIREMENTS,
  buildBoundaryBlueprint,
  getBoundaryPattern,
} from "@/lib/boundary-library"
import type { BusinessRequirementId } from "@/lib/boundary-library/types"
import { useHumanSos } from "@/lib/human-sos/use-human-sos"
import {
  RESPONSE_STATE_LABEL,
  TOTAL_BUILDER_STEPS,
  emptyHumanSos,
  summarizeAlignment,
  type HumanSos,
  type ImplementationItem,
  type SosStakeholder,
  type TrainingItem,
} from "@/lib/human-sos/types"
import { BUILDER_STEP_META, protectionOptionsForFamily } from "./builder-options"
import { StakeholderCard } from "./stakeholder-card"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  weekKey: string
  boundaryFocusText: string
  boundaryOptionId?: string | null
}

/* -------------------------------------------------------------- */
/* Small shared UI                                                 */
/* -------------------------------------------------------------- */

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function OptionChip({
  active,
  onClick,
  children,
  recommended,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  recommended?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "relative rounded-xl border px-4 py-3 text-left font-sans text-sm transition-colors " +
        (active
          ? "border-[#5A7A45] bg-[#5A7A45]/8 text-[#2E1F27]"
          : "border-[#E8DFE2] bg-white text-[#3A2E33] hover:border-[#8DAE72]/60 hover:bg-[#F4F7F0]")
      }
    >
      <span className="flex items-start gap-2">
        <span
          className={
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border " +
            (active ? "border-[#5A7A45] bg-[#5A7A45] text-white" : "border-[#C9BEC3] bg-white")
          }
          aria-hidden
        >
          {active && <Check className="h-3 w-3" />}
        </span>
        <span className="flex-1">{children}</span>
      </span>
      {recommended && (
        <span className="mt-2 inline-block rounded-full bg-[#8DAE72]/20 px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.1em] text-[#5A7A45]">
          Recommended
        </span>
      )}
    </button>
  )
}

const fieldClass =
  "w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#3A2E33] outline-none focus:border-[#5A7A45]"
const microLabel = "font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]"

/* -------------------------------------------------------------- */
/* Main                                                            */
/* -------------------------------------------------------------- */

export function BoundaryBuilderDialog({ open, onOpenChange, weekKey, boundaryFocusText, boundaryOptionId }: Props) {
  const { sos, stakeholders, saveSos, upsertStakeholder, removeStakeholder, refresh } = useHumanSos(
    weekKey,
    boundaryFocusText,
  )

  const [draft, setDraft] = useState<HumanSos>(() => emptyHumanSos(weekKey, boundaryFocusText))
  const [localStakeholders, setLocalStakeholders] = useState<SosStakeholder[]>([])
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [communicateOpen, setCommunicateOpen] = useState(false)
  const [showAllRequirements, setShowAllRequirements] = useState(false)
  const hydrated = useRef<string | null>(null)

  // Hydrate the working copy from the persisted record once per open (keyed by
  // the record id so a save doesn't clobber in-progress edits).
  useEffect(() => {
    if (!open) {
      hydrated.current = null
      return
    }
    const key = sos.id ?? "new"
    if (hydrated.current === key) return
    hydrated.current = key
    const seeded: HumanSos = {
      ...sos,
      boundaryFocusText: sos.boundaryFocusText || boundaryFocusText,
      patternId: sos.patternId ?? derivePatternId(boundaryOptionId, boundaryFocusText),
    }
    // Seed the family + a default statement from the derived pattern.
    const pattern = seeded.patternId ? getBoundaryPattern(seeded.patternId) : undefined
    if (pattern) {
      seeded.familyId = seeded.familyId ?? pattern.family
      if (!seeded.boundaryStatement) seeded.boundaryStatement = pattern.boundaryStatement
    }
    setDraft(seeded)
    setLocalStakeholders(stakeholders)
    setStep(sos.currentStep && sos.status === "building" ? sos.currentStep : 1)
  }, [open, sos, stakeholders, boundaryFocusText, boundaryOptionId])

  const pattern = draft.patternId ? getBoundaryPattern(draft.patternId) : undefined
  const blueprint = draft.patternId ? buildBoundaryBlueprint(draft.patternId) : undefined

  const recommendedRequirementIds = useMemo(
    () => new Set(blueprint?.businessRequirements.map((r) => r.id) ?? []),
    [blueprint],
  )

  // Operating rules relevant to the selected requirements (+ the pattern's own).
  const relevantRules = useMemo(() => {
    const ids = new Set<string>(pattern?.operatingRules ?? [])
    for (const reqId of draft.businessRequirementIds) {
      const req = BUSINESS_REQUIREMENTS.find((r) => r.id === reqId)
      req?.operatingRules.forEach((id) => ids.add(id))
    }
    const list = OPERATING_RULE_PATTERNS.filter((r) => ids.has(r.id))
    return list.length > 0 ? list : OPERATING_RULE_PATTERNS
  }, [pattern, draft.businessRequirementIds])

  // Implementation requirements implied by the selected operating rules.
  const relevantImplementationIds = useMemo(() => {
    const ids = new Set<string>()
    for (const ruleId of draft.operatingRuleIds) {
      const rule = OPERATING_RULE_PATTERNS.find((r) => r.id === ruleId)
      rule?.implementationRequirements.forEach((id) => ids.add(id))
    }
    return ids
  }, [draft.operatingRuleIds])

  const implementationOptions = useMemo(() => {
    const relevant = IMPLEMENTATION_REQUIREMENTS.filter((i) => relevantImplementationIds.has(i.id))
    return relevant.length > 0 ? relevant : IMPLEMENTATION_REQUIREMENTS
  }, [relevantImplementationIds])

  const alignment = useMemo(() => summarizeAlignment(localStakeholders), [localStakeholders])

  const meta = BUILDER_STEP_META.find((m) => m.step === step)!

  /* ---------------------------------------------------------- */
  /* Persistence helpers                                         */
  /* ---------------------------------------------------------- */

  async function persistStakeholders(): Promise<boolean> {
    let ok = true
    const saved: SosStakeholder[] = []
    for (const s of localStakeholders) {
      const res = await upsertStakeholder({ ...s, sosId: draft.id ?? s.sosId })
      if (res.ok && res.stakeholder) saved.push(res.stakeholder)
      else ok = false
    }
    if (saved.length) setLocalStakeholders(saved)
    return ok
  }

  async function persist(next: Partial<HumanSos>): Promise<string | null> {
    setSaving(true)
    setError(null)
    const res = await saveSos({ ...draft, ...next })
    setSaving(false)
    if (!res.ok) {
      setError(res.error ?? "Could not save.")
      return null
    }
    if (res.sos) setDraft((d) => ({ ...d, ...next, id: res.sos!.id, updatedAt: res.sos!.updatedAt }))
    return res.sos?.id ?? draft.id
  }

  async function goNext() {
    // Stakeholders persist when leaving step 7 (they need a saved sos id).
    if (step === 7) {
      if (!draft.id) await persist({ currentStep: 7 })
      await persistStakeholders()
    }
    const next = Math.min(TOTAL_BUILDER_STEPS, step + 1)
    await persist({ currentStep: next })
    setStep(next)
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1))
  }

  async function adopt() {
    if (!alignment.ready) return
    const today = new Date()
    const review = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const effective = draft.effectiveDate ?? today.toISOString().slice(0, 10)
    const reviewDate = draft.reviewDate ?? review.toISOString().slice(0, 10)
    const id = await persist({
      status: "active",
      effectiveDate: effective,
      reviewDate,
      currentStep: TOTAL_BUILDER_STEPS,
    })
    if (id) {
      await refresh()
      onOpenChange(false)
    }
  }

  /* ---------------------------------------------------------- */
  /* Step gating (minimal, never blocks the flow needlessly)     */
  /* ---------------------------------------------------------- */

  const canContinue = (() => {
    switch (step) {
      case 1:
        return draft.boundaryStatement.trim().length > 0
      case 2:
        return draft.businessRequirementIds.length > 0
      case 3:
        return draft.operatingRuleText.trim().length > 0
      default:
        return true
    }
  })()

  /* ---------------------------------------------------------- */
  /* Stakeholder editing                                         */
  /* ---------------------------------------------------------- */

  function addStakeholder(typeId = "team-member") {
    const tmpId = `tmp-${Date.now()}-${localStakeholders.length}`
    setLocalStakeholders((list) => [
      ...list,
      {
        id: tmpId,
        sosId: draft.id ?? "",
        name: "",
        stakeholderType: typeId,
        role: "",
        whatToUnderstand: "",
        requiredAction: "",
        trainingNeeded: false,
        meetingNeeded: false,
        qaNeeded: false,
        followupNeeded: false,
        responseSla: "48h",
        deadline: null,
        responseState: "pending",
        questionText: null,
        questionOwner: null,
        questionResponse: null,
        questionResolutionDeadline: null,
        questionStatus: "none",
        concern: null,
        impact: null,
        requestedChange: null,
        objectionOwner: null,
        objectionResolutionDeadline: null,
        objectionStatus: "none",
        sortOrder: list.length,
        createdAt: null,
        updatedAt: null,
      },
    ])
  }

  async function removeLocalStakeholder(s: SosStakeholder) {
    setLocalStakeholders((list) => list.filter((x) => x.id !== s.id))
    if (!s.id.startsWith("tmp-")) await removeStakeholder(s.id)
  }

  /* ---------------------------------------------------------- */
  /* Render                                                      */
  /* ---------------------------------------------------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto bg-[#FBFAF7] p-0">
        {/* Header + progress */}
        <div className="sticky top-0 z-10 border-b border-[#EFE7EA] bg-[#FBFAF7]/95 px-6 py-5 backdrop-blur sm:px-8">
          <DialogHeader className="space-y-1">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
              Weekly Work-Life Balance Boundary Builder™ · Step {step} of {TOTAL_BUILDER_STEPS}
            </p>
            <DialogTitle className="font-serif text-2xl text-[#2E1F27]">{meta.label}</DialogTitle>
          </DialogHeader>
          <p className="mt-1 font-sans text-sm text-[#6B5860]">{meta.question}</p>
          <div className="mt-3 flex gap-1">
            {BUILDER_STEP_META.map((m) => (
              <span
                key={m.step}
                className={"h-1.5 flex-1 rounded-full " + (m.step <= step ? "bg-[#5A7A45]" : "bg-[#E8DFE2]")}
                aria-hidden
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* The one boundary being operationalized — always in view. */}
          <div className="mb-6 rounded-2xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-5 py-4">
            <p className={microLabel}>This week&apos;s Boundary Focus™</p>
            <p className="mt-1 font-display text-lg font-semibold text-[#2E1F27] text-pretty">
              {draft.boundaryFocusText || boundaryFocusText || "Your boundary for this week"}
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-[#FBEEF0] px-4 py-2 font-sans text-sm text-[#B4304A]">{error}</p>
          )}

          {/* STEP 1 — Work-Life Balance Boundary™ */}
          {step === 1 && (
            <div className="space-y-5">
              {!pattern && (
                <label className="block space-y-1">
                  <span className={microLabel}>Which boundary is this closest to?</span>
                  <select
                    className={fieldClass}
                    value={draft.patternId ?? ""}
                    onChange={(e) => {
                      const p = getBoundaryPattern(e.target.value)
                      setDraft((d) => ({
                        ...d,
                        patternId: e.target.value || null,
                        familyId: p?.family ?? d.familyId,
                        boundaryStatement: d.boundaryStatement || (p?.boundaryStatement ?? ""),
                      }))
                    }}
                  >
                    <option value="">Choose a pattern…</option>
                    {BOUNDARY_PATTERNS.filter((p) => p.active).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="space-y-2">
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">What does this boundary need to protect?</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {protectionOptionsForFamily(draft.familyId as never).map((o) => (
                    <OptionChip
                      key={o.id}
                      active={draft.whatProtecting.includes(o.label)}
                      onClick={() => setDraft((d) => ({ ...d, whatProtecting: toggle(d.whatProtecting, o.label) }))}
                    >
                      {o.label}
                    </OptionChip>
                  ))}
                </div>
              </div>

              <label className="block space-y-1">
                <span className={microLabel}>Your Work-Life Balance Boundary™ (confirm or edit)</span>
                <textarea
                  rows={3}
                  className={fieldClass}
                  value={draft.boundaryStatement}
                  placeholder="e.g. I protect my evenings from routine business activity."
                  onChange={(e) => setDraft((d) => ({ ...d, boundaryStatement: e.target.value }))}
                />
                {pattern && !draft.boundaryStatement && (
                  <button
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, boundaryStatement: pattern.boundaryStatement }))}
                    className="mt-1 inline-flex items-center gap-1 font-sans text-xs font-bold text-[#5A7A45] hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden /> Use the suggested wording
                  </button>
                )}
              </label>
            </div>
          )}

          {/* STEP 2 — Business Requirement */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {BUSINESS_REQUIREMENTS.filter(
                  (r) => showAllRequirements || recommendedRequirementIds.has(r.id) || recommendedRequirementIds.size === 0,
                ).map((r) => (
                  <OptionChip
                    key={r.id}
                    active={draft.businessRequirementIds.includes(r.id)}
                    recommended={recommendedRequirementIds.has(r.id)}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        businessRequirementIds: toggle(d.businessRequirementIds, r.id) as BusinessRequirementId[],
                      }))
                    }
                  >
                    <span className="font-semibold">{r.label}</span>
                    <span className="mt-0.5 block text-xs text-[#6B5860]">{r.description}</span>
                  </OptionChip>
                ))}
              </div>
              {recommendedRequirementIds.size > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllRequirements((v) => !v)}
                  className="font-sans text-xs font-bold text-[#5A7A45] hover:underline"
                >
                  {showAllRequirements ? "Show only recommended" : "Show all business requirements"}
                </button>
              )}
            </div>
          )}

          {/* STEP 3 — Operating Rule */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">
                  Choose the rule components that apply
                </p>
                <div className="grid gap-2">
                  {relevantRules.map((rule) => (
                    <OptionChip
                      key={rule.id}
                      active={draft.operatingRuleIds.includes(rule.id)}
                      onClick={() => {
                        setDraft((d) => {
                          const nextIds = toggle(d.operatingRuleIds, rule.id)
                          const text = OPERATING_RULE_PATTERNS.filter((r) => nextIds.includes(r.id))
                            .map((r) => r.ruleText)
                            .join(" ")
                          return { ...d, operatingRuleIds: nextIds, operatingRuleText: d.operatingRuleText && d.operatingRuleText !== autoRuleText(d.operatingRuleIds) ? d.operatingRuleText : text }
                        })
                      }}
                    >
                      <span className="font-semibold">{rule.name}</span>
                      <span className="mt-0.5 block text-xs text-[#6B5860]">{rule.ruleText}</span>
                    </OptionChip>
                  ))}
                </div>
              </div>
              <label className="block space-y-1">
                <span className={microLabel}>Your Operating Rule (confirm or edit)</span>
                <textarea
                  rows={4}
                  className={fieldClass}
                  value={draft.operatingRuleText}
                  placeholder="How the business will operate differently…"
                  onChange={(e) => setDraft((d) => ({ ...d, operatingRuleText: e.target.value }))}
                />
              </label>
            </div>
          )}

          {/* STEP 4 — Implementation */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {implementationOptions.map((impl) => {
                  const selected = draft.implementation.some((i) => i.id === impl.id)
                  return (
                    <OptionChip
                      key={impl.id}
                      active={selected}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          implementation: selected
                            ? d.implementation.filter((i) => i.id !== impl.id)
                            : [
                                ...d.implementation,
                                { id: impl.id, label: impl.label, owner: "", deadline: "", status: "not-started" } as ImplementationItem,
                              ],
                        }))
                      }
                    >
                      <span className="font-semibold">{impl.label}</span>
                      <span className="mt-0.5 block text-xs text-[#6B5860]">{impl.description}</span>
                    </OptionChip>
                  )
                })}
              </div>

              {draft.implementation.length > 0 && (
                <div className="space-y-3">
                  <p className={microLabel}>Assign owner &amp; deadline</p>
                  <ul className="space-y-2">
                    {draft.implementation.map((item) => (
                      <li key={item.id} className="rounded-xl border border-[#E8DFE2] bg-white px-4 py-3">
                        <p className="font-sans text-sm font-semibold text-[#2E1F27]">{item.label}</p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <input
                            className={fieldClass}
                            placeholder="Owner"
                            value={item.owner}
                            onChange={(e) => updateImplementation(setDraft, item.id, { owner: e.target.value })}
                          />
                          <input
                            type="date"
                            className={fieldClass}
                            value={item.deadline}
                            onChange={(e) => updateImplementation(setDraft, item.id, { deadline: e.target.value })}
                          />
                          <select
                            className={fieldClass}
                            value={item.status}
                            onChange={(e) =>
                              updateImplementation(setDraft, item.id, { status: e.target.value as ImplementationItem["status"] })
                            }
                          >
                            <option value="not-started">Not started</option>
                            <option value="in-progress">In progress</option>
                            <option value="done">Done</option>
                          </select>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Escalation & Exceptions */}
          {step === 5 && (
            <div className="space-y-6">
              {blueprint?.escalationPatterns[0] && (
                <button
                  type="button"
                  onClick={() => {
                    const p = blueprint.escalationPatterns[0]
                    setDraft((d) => ({
                      ...d,
                      escalation: {
                        ...d.escalation,
                        trigger: d.escalation.trigger || p.trigger,
                        channel: d.escalation.channel || p.channel,
                        responseExpectation: d.escalation.responseExpectation || p.responseExpectation,
                        founderThreshold: d.escalation.founderThreshold || p.founderInvolvementThreshold,
                        level1: d.escalation.level1 || (p.levels[0]?.role ?? ""),
                        level2: d.escalation.level2 || (p.levels[1]?.role ?? ""),
                      },
                    }))
                  }}
                  className="inline-flex items-center gap-1 font-sans text-xs font-bold text-[#5A7A45] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden /> Prefill from the library pattern
                </button>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["level1", "Level 1 — who handles it first?"],
                    ["backup", "Backup — if Level 1 is unavailable"],
                    ["level2", "Level 2 — who it escalates to"],
                    ["founderEscalation", "Founder escalation — when it reaches you"],
                    ["trigger", "Escalation trigger"],
                    ["channel", "Escalation channel"],
                    ["responseExpectation", "Response expectation"],
                    ["founderThreshold", "Founder involvement threshold"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="space-y-1">
                    <span className={microLabel}>{label}</span>
                    <input
                      className={fieldClass}
                      value={draft.escalation[key]}
                      onChange={(e) => setDraft((d) => ({ ...d, escalation: { ...d.escalation, [key]: e.target.value } }))}
                    />
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">What qualifies as a true exception?</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EXCEPTION_PATTERNS.filter((e) => e.isException).map((e) => (
                    <OptionChip
                      key={e.id}
                      active={draft.exceptions.exceptionIds.includes(e.id)}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          exceptions: { ...d.exceptions, exceptionIds: toggle(d.exceptions.exceptionIds, e.id) },
                        }))
                      }
                    >
                      <span className="font-semibold">{e.label}</span>
                    </OptionChip>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">What does NOT qualify as an exception?</p>
                <p className="font-sans text-xs text-[#6B5860]">So every inconvenience can&apos;t become an exception.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EXCEPTION_PATTERNS.filter((e) => !e.isException).map((e) => (
                    <OptionChip
                      key={e.id}
                      active={draft.exceptions.notExceptionIds.includes(e.id)}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          exceptions: { ...d.exceptions, notExceptionIds: toggle(d.exceptions.notExceptionIds, e.id) },
                        }))
                      }
                    >
                      <span className="font-semibold">{e.label}</span>
                    </OptionChip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 — Communicate It™ (existing tool, unchanged) */}
          {step === 6 && (
            <div className="space-y-5">
              <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">
                Hand this boundary to the people it affects. This launches your existing{" "}
                <span className="font-semibold">Communicate It™</span> tool, pre-filled with everything you&apos;ve built.
              </p>
              <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-1.5 text-sm text-[#3A2E33]">
                <p><span className="font-semibold">Boundary:</span> {draft.boundaryStatement || "—"}</p>
                <p><span className="font-semibold">Operating rule:</span> {draft.operatingRuleText || "—"}</p>
              </div>
              <button
                type="button"
                onClick={() => setCommunicateOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90"
              >
                <Megaphone className="h-4 w-4" aria-hidden /> Launch Communicate It™
              </button>
              {draft.communication.communicated && (
                <p className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#5A7A45]">
                  <Check className="h-4 w-4" aria-hidden /> Communication created
                </p>
              )}
            </div>
          )}

          {/* STEP 7 — Stakeholder Alignment */}
          {step === 7 && (
            <div className="space-y-5">
              {pattern && pattern.stakeholderTypes.length > 0 && (
                <div className="space-y-2">
                  <p className={microLabel}>Likely stakeholders for this boundary</p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.stakeholderTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addStakeholder(t)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#8DAE72] bg-white px-3 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#F4F7F0]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden /> {t.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ul className="space-y-3">
                {localStakeholders.map((s) => (
                  <StakeholderCard
                    key={s.id}
                    stakeholder={s}
                    onChange={(next) => setLocalStakeholders((list) => list.map((x) => (x.id === s.id ? next : x)))}
                    onRemove={() => void removeLocalStakeholder(s)}
                  />
                ))}
              </ul>

              <button
                type="button"
                onClick={() => addStakeholder()}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm font-bold text-[#3A2E33] hover:bg-[#F4F7F0]"
              >
                <Plus className="h-4 w-4" aria-hidden /> Add a stakeholder
              </button>

              {/* Alignment gate */}
              <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
                    Stakeholder Alignment™
                  </p>
                  <p className="font-display text-lg font-semibold text-[#2E1F27]">
                    {alignment.aligned} of {alignment.total} aligned
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 font-sans text-sm text-[#6B5860]">
                  <span>👍 {alignment.thumbsUp}</span>
                  <span>❓ {alignment.questions}</span>
                  <span>👎 {alignment.thumbsDown}</span>
                  <span>⏳ {alignment.pending}</span>
                </div>
                <p
                  className={
                    "mt-3 rounded-lg px-3 py-2 font-sans text-sm " +
                    (alignment.ready ? "bg-[#8DAE72]/15 text-[#5A7A45]" : "bg-[#F4F7F0] text-[#6B5860]")
                  }
                >
                  {alignment.ready
                    ? "Ready for standardization — every required stakeholder is aligned."
                    : "Not yet ready. Resolve the remaining stakeholder actions before this becomes an operating standard."}
                </p>
              </div>

              {/* Training / Q&A / Follow-Up */}
              <div className="space-y-2">
                <p className="font-sans text-sm font-semibold text-[#2E1F27]">
                  Training / Q&amp;A / Follow-Up — what&apos;s needed to establish understanding?
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {TRAINING_REQUIREMENTS.map((t) => {
                    const selected = draft.training.some((i) => i.id === t.id)
                    return (
                      <OptionChip
                        key={t.id}
                        active={selected}
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            training: selected
                              ? d.training.filter((i) => i.id !== t.id)
                              : [...d.training, { id: t.id, label: t.label, owner: "", date: "", deadline: "", status: "not-started" } as TrainingItem],
                          }))
                        }
                      >
                        <span className="font-semibold">{t.label}</span>
                      </OptionChip>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8 — Human SOS™ */}
          {step === 8 && (
            <div className="space-y-5">
              <div className="rounded-2xl border-2 border-[#7FB069]/40 bg-white px-6 py-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#5A7A45]" aria-hidden />
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
                    Human SOS™ · Human Sustainability Operating Standard™
                  </p>
                </div>
                <p className="font-serif text-base italic leading-relaxed text-[#2E1F27]">
                  A Human SOS™ makes that protection humanly sustainable and operational in the business.
                </p>

                <SummaryRow label="Weekly Boundary Focus™" value={draft.boundaryFocusText} />
                <SummaryRow label="Work-Life Balance Boundary™" value={draft.boundaryStatement} />
                <SummaryRow
                  label="Business requirement"
                  value={draft.businessRequirementIds
                    .map((id) => BUSINESS_REQUIREMENTS.find((r) => r.id === id)?.label ?? id)
                    .join(", ")}
                />
                <SummaryRow label="Operating rule" value={draft.operatingRuleText} />
                <SummaryRow
                  label="Implementation"
                  value={draft.implementation.map((i) => `${i.label}${i.owner ? ` (${i.owner})` : ""}`).join(", ")}
                />
                <SummaryRow
                  label="Escalation path"
                  value={[draft.escalation.level1, draft.escalation.backup, draft.escalation.level2, draft.escalation.founderEscalation]
                    .filter(Boolean)
                    .join(" → ")}
                />
                <SummaryRow
                  label="Exceptions"
                  value={draft.exceptions.exceptionIds
                    .map((id) => EXCEPTION_PATTERNS.find((e) => e.id === id)?.label ?? id)
                    .join(", ")}
                />
                <SummaryRow
                  label="Stakeholders"
                  value={localStakeholders
                    .map((s) => `${s.name || "Unnamed"} — ${RESPONSE_STATE_LABEL[s.responseState]}`)
                    .join("; ")}
                />
                <SummaryRow label="Communication" value={draft.communication.communicated ? "Created via Communicate It™" : "Not yet communicated"} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className={microLabel}>Effective date</span>
                  <input
                    type="date"
                    className={fieldClass}
                    value={draft.effectiveDate ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, effectiveDate: e.target.value || null }))}
                  />
                </label>
                <label className="space-y-1">
                  <span className={microLabel}>Review date</span>
                  <input
                    type="date"
                    className={fieldClass}
                    value={draft.reviewDate ?? ""}
                    onChange={(e) => setDraft((d) => ({ ...d, reviewDate: e.target.value || null }))}
                  />
                </label>
              </div>

              {!alignment.ready && (
                <p className="rounded-lg bg-[#F4F7F0] px-4 py-3 font-sans text-sm text-[#6B5860]">
                  This boundary can become a Human SOS™ once every required stakeholder is aligned and all questions
                  and objections are resolved.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-[#EFE7EA] bg-[#FBFAF7]/95 px-6 py-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#6B5860] hover:text-[#2E1F27] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>

          {step < TOTAL_BUILDER_STEPS ? (
            <button
              type="button"
              onClick={() => void goNext()}
              disabled={!canContinue || saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void adopt()}
              disabled={!alignment.ready || saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-5 py-2.5 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-40"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden /> {saving ? "Adopting…" : "Adopt Human SOS™"}
            </button>
          )}
        </div>
      </DialogContent>

      {/* Existing Communicate It™ — launched UNCHANGED, pre-filled with the built boundary. */}
      <CommunicateDelegateDialog
        open={communicateOpen}
        onOpenChange={(o) => {
          setCommunicateOpen(o)
          if (!o) {
            setDraft((d) => ({
              ...d,
              communication: { ...d.communication, communicated: true, communicatedAt: new Date().toISOString() },
            }))
          }
        }}
        sourceContext="ceo-workday"
        commitmentId={draft.id}
        commitmentType="operating-rule"
        initialType="boundary"
        commitmentText={draft.boundaryStatement}
        initialSubjectText={draft.boundaryStatement}
        initialTiming="Effective this week"
      />
    </Dialog>
  )
}

/* -------------------------------------------------------------- */
/* Helpers                                                         */
/* -------------------------------------------------------------- */

function derivePatternId(optionId: string | null | undefined, text: string): string | null {
  if (optionId && getBoundaryPattern(optionId)) return optionId
  const t = (text ?? "").toLowerCase().trim()
  if (!t) return null
  const hit = BOUNDARY_PATTERNS.find(
    (p) => p.active && (t.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(t)),
  )
  return hit?.id ?? null
}

function autoRuleText(ruleIds: string[]): string {
  return OPERATING_RULE_PATTERNS.filter((r) => ruleIds.includes(r.id))
    .map((r) => r.ruleText)
    .join(" ")
}

function updateImplementation(
  setDraft: React.Dispatch<React.SetStateAction<HumanSos>>,
  id: string,
  patch: Partial<ImplementationItem>,
) {
  setDraft((d) => ({ ...d, implementation: d.implementation.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#F0EAEC] pt-3 first:border-t-0 first:pt-0">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]">{label}</p>
      <p className="mt-0.5 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{value || "—"}</p>
    </div>
  )
}
