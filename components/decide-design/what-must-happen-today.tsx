"use client"

/**
 * What Must Happen Today™ — Decide & Design
 * ---------------------------------------------------------------------------
 * The founder names up to three things that must happen in today's four
 * focused hours — in her own words, not the GPS's. "Save My Day" then uses the
 * same declaration technology as the weekly one: it weaves her answers into a
 * first-person Day Declaration™, creates today's CEO Workday™ plan in Supabase,
 * mirrors the work into the Today's Work™ queue, and notifies the live
 * workspace so the plan (and its dropdown) populates immediately.
 */

import { useEffect, useMemo, useState } from "react"
import { Check, Pencil, Plus, RefreshCw, Sparkles, X } from "lucide-react"
import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import { getWeekKey } from "@/lib/wlbb-week/storage"
import { getDateKey } from "@/lib/daily-plan/storage"
import { loadDailyIdentity } from "@/lib/daily-identity/storage"
import {
  getCeoWorkdayPlan,
  linkPlanItemsToLocalQueue,
  saveCeoWorkdayPlan,
} from "@/lib/ceo-workday/plan-server"
import type { CeoWorkdayPlan } from "@/lib/ceo-workday/plan-types"
import { addWorkItem, getTodaysWork, removeWorkItem } from "@/lib/ceo-workday/todays-work-store"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { saveCeoWorkdayDeclaration } from "@/lib/daily-plan/ceo-workday-declaration"
import {
  buildDayDeclaration,
  DAY_DECLARATION_VARIANT_COUNT,
  hasEnoughForDay,
  MAX_MUST_HAPPEN,
  minutesPerItem,
  type MustHappenItem,
} from "@/lib/decide-design/day-declaration"

const newItem = (title = ""): MustHappenItem => ({
  key: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title,
  done: "",
})

export function WhatMustHappenToday() {
  const dateKey = getDateKey()
  const { commitments: weekly } = useWeeklyCommitments()

  const [items, setItems] = useState<MustHappenItem[]>([newItem()])
  const [existing, setExisting] = useState<CeoWorkdayPlan | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [editing, setEditing] = useState(true)

  const [variant, setVariant] = useState(0)
  const [declaration, setDeclaration] = useState("")
  const [edited, setEdited] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load today's plan (if the founder already saved her day) so this section
  // reads back what she decided instead of starting blank.
  useEffect(() => {
    let alive = true
    void getCeoWorkdayPlan(dateKey).then((p) => {
      if (!alive) return
      if (p && p.items.length) {
        setExisting(p)
        setItems(
          p.items
            .filter((i) => i.founderDecision !== "remove")
            .slice(0, MAX_MUST_HAPPEN)
            .map((i) => ({ key: i.id, title: i.title, done: i.expectedEvidence ?? "" })),
        )
        if (p.declaration) {
          setDeclaration(p.declaration)
          setEdited(true)
        }
        setEditing(false)
      }
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [dateKey])

  // Quick-picks drawn from what the founder herself decided this week — never
  // GPS-authored work. Only shown when they exist.
  const quickPicks = useMemo(() => {
    const picks: string[] = []
    if (weekly.delegationPriority) picks.push(`Hand off ${weekly.delegationPriority.trim().replace(/\.$/, "")}`)
    if (weekly.operatingRule) picks.push(`Put my rule into practice: ${weekly.operatingRule.trim().replace(/\.$/, "")}`)
    picks.push("Finish one thing I have been avoiding", "Make one decision I have been sitting on")
    return picks.filter((p) => !items.some((i) => i.title.trim() === p))
  }, [weekly.delegationPriority, weekly.operatingRule, items])

  const ready = hasEnoughForDay(items)
  const filled = items.filter((i) => i.title.trim())

  function setTitle(key: string, title: string) {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, title } : i)))
    if (!edited) setDeclaration("")
  }
  function setDone(key: string, done: string) {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, done } : i)))
  }
  function addFromPick(pick: string) {
    setItems((list) => {
      const blank = list.find((i) => !i.title.trim())
      if (blank) return list.map((i) => (i.key === blank.key ? { ...i, title: pick } : i))
      if (list.length >= MAX_MUST_HAPPEN) return list
      return [...list, newItem(pick)]
    })
    if (!edited) setDeclaration("")
  }
  function remove(key: string) {
    setItems((list) => (list.length > 1 ? list.filter((i) => i.key !== key) : [newItem()]))
    if (!edited) setDeclaration("")
  }

  function build(v = variant) {
    const identity = loadDailyIdentity(dateKey)?.identityStatement ?? null
    setDeclaration(buildDayDeclaration(items, weekly, v, identity))
    setVariant(v)
    setEdited(false)
  }

  async function saveDay() {
    if (!ready || saving) return
    const text = (declaration.trim() || buildDayDeclaration(items, weekly, variant)).trim()
    setSaving(true)
    setError(null)
    const perItem = minutesPerItem(filled.length)
    const identity = loadDailyIdentity(dateKey)?.identityStatement ?? null

    const saved = await saveCeoWorkdayPlan({
      planDate: dateKey,
      weekKey: getWeekKey(),
      bottleneckEgaEntryIds: existing?.bottleneckEgaEntryIds ?? [],
      businessAreaId: existing?.businessAreaId ?? null,
      identityStatement: identity,
      declaration: text,
      items: filled.map((i, idx) => ({
        position: idx,
        title: i.title.trim(),
        purpose: "Named by me in Decide & Design as something that must happen today.",
        expectedEvidence: i.done.trim(),
        treatment: "build-change",
        businessFunction: "build",
        role: "founder-added",
        estimatedMinutes: perItem,
        ceoWorkCategory: "BUILD",
        founderDecision: "added",
        status: "planned",
      })),
    })

    if (!saved) {
      setSaving(false)
      setError("Your day could not be saved. Please make sure you are signed in and try again.")
      return
    }

    // Mirror into the Today's Work™ queue the live workspace renders — clearing
    // earlier CEO-plan mirrors for today first so nothing duplicates.
    getTodaysWork()
      .filter((w) => w.planItemId)
      .forEach((w) => removeWorkItem(w.id))
    const pairs: Array<{ itemId: string; localWorkItemId: string }> = []
    saved.items
      .filter((i) => i.founderDecision !== "remove")
      .forEach((i) => {
        const category = i.ceoWorkCategory ?? "BUILD"
        const wf = getWorkflowEntry(category)
        const local = addWorkItem({
          category,
          selectedOptionLabel: i.title,
          workflowId: wf.workflowId,
          availability: wf.availability,
          source: "founder",
          sourceDetail: "What Must Happen Today™ · Decide & Design",
          status: "not-started",
          relatedAssetId: i.relatedAssetId ?? undefined,
          planItemId: i.id,
          estimatedMinutes: i.estimatedMinutes,
          purpose: i.purpose,
          expectedEvidence: i.expectedEvidence,
          tangibleOutcome: i.expectedEvidence,
        })
        pairs.push({ itemId: i.id, localWorkItemId: local.id })
      })
    void linkPlanItemsToLocalQueue(pairs)

    // Same declaration technology as before: the local record + event tells
    // the live CEO Workday™ to refresh and populate.
    saveCeoWorkdayDeclaration({
      planId: saved.id,
      identityStatement: identity,
      declaration: text,
      plannedMinutes: saved.plannedMinutes,
      itemCount: saved.items.length,
    })

    setExisting(saved)
    setDeclaration(text)
    setSavedAt(new Date().toISOString())
    setSaving(false)
    setEditing(false)
  }

  const chip =
    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm transition-colors border-[#E5E5E5] bg-white text-[#2E1F27] hover:bg-[#F4F7F0]"

  return (
    <section className="rounded-3xl border border-[#E8DFE2] bg-white shadow-sm px-8 py-7 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            What Must Happen Today™
          </p>
          <p className="mt-2 font-sans text-sm text-[#3A2E33] leading-relaxed">
            In my own words — up to three things that must happen in today&apos;s four focused hours. This is my
            answer, not the GPS&apos;s.
          </p>
        </div>
        {!editing && existing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] px-3 py-1.5 font-sans text-xs font-semibold text-[#6B5860] hover:bg-[#F7F3F4]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Change my day
          </button>
        )}
      </div>

      {!loaded ? (
        <p className="font-sans text-sm text-[#6B5860]">Loading today…</p>
      ) : !editing && existing ? (
        // ── Saved read-back ──────────────────────────────────────────────────
        <div className="space-y-4">
          <ol className="space-y-2">
            {filled.map((i, idx) => (
              <li key={i.key} className="flex items-start gap-3 rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-4 py-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8DAE72] font-sans text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#2E1F27]">{i.title}</p>
                  {i.done && <p className="mt-0.5 font-sans text-xs text-[#6B5860]">Done when: {i.done}</p>}
                </div>
              </li>
            ))}
          </ol>
          {declaration && (
            <blockquote className="rounded-2xl border border-[#7FB069]/25 bg-white px-5 py-4">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">My Day Declaration™</p>
              <p className="mt-2 font-serif text-lg leading-relaxed text-[#2E1F27] text-pretty">{declaration}</p>
            </blockquote>
          )}
          <p className="inline-flex items-center gap-1.5 font-sans text-xs text-[#5B835F]">
            <Check className="h-3.5 w-3.5" aria-hidden /> Saved — this is now inside your 4-Hour CEO Workday™.
          </p>
        </div>
      ) : (
        // ── Editing ──────────────────────────────────────────────────────────
        <div className="space-y-6">
          {quickPicks.length > 0 && (
            <div className="space-y-2">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
                From what I decided this week
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPicks.map((p) => (
                  <button key={p} type="button" onClick={() => addFromPick(p)} className={chip}>
                    <Plus className="h-3.5 w-3.5" aria-hidden /> {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <ol className="space-y-3">
            {items.map((i, idx) => (
              <li key={i.key} className="rounded-2xl border border-[#E8DFE2] bg-[#FDFBFC] px-4 py-4 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8DAE72] font-sans text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={i.title}
                    onChange={(e) => setTitle(i.key, e.target.value)}
                    placeholder={idx === 0 ? "What must happen today?" : "And what else must happen?"}
                    aria-label={`What must happen today, item ${idx + 1}`}
                    maxLength={200}
                    className="flex-1 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                  />
                  <button
                    type="button"
                    onClick={() => remove(i.key)}
                    aria-label={`Remove item ${idx + 1}`}
                    className="rounded-full p-1.5 text-[#6B5860]/60 hover:bg-[#F7F3F4] hover:text-[#C0545A]"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <input
                  type="text"
                  value={i.done}
                  onChange={(e) => setDone(i.key, e.target.value)}
                  placeholder="I will know it is done when…"
                  aria-label={`How I will know item ${idx + 1} is done`}
                  maxLength={300}
                  className="ml-9 w-[calc(100%-2.25rem)] rounded-full border border-[#E8DFE2]/70 bg-white px-4 py-1.5 font-sans text-xs text-[#2E1F27] placeholder:text-[#6B5860]/45 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                />
              </li>
            ))}
          </ol>

          {items.length < MAX_MUST_HAPPEN && (
            <button type="button" onClick={() => setItems((l) => [...l, newItem()])} className={chip}>
              <Plus className="h-3.5 w-3.5" aria-hidden /> Add another (up to {MAX_MUST_HAPPEN})
            </button>
          )}

          {/* ── Declaration technology ──────────────────────────────────────── */}
          <div className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">My Day Declaration™</p>
              {declaration && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => build((variant + 1) % DAY_DECLARATION_VARIANT_COUNT)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#6B5860] hover:bg-[#F7F3F4]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Say it differently
                  </button>
                  {edited && (
                    <button
                      type="button"
                      onClick={() => build(variant)}
                      className="rounded-full border border-[#E8DFE2] bg-white px-3 py-1.5 font-sans text-xs font-semibold text-[#6B5860] hover:bg-[#F7F3F4]"
                    >
                      Reset to generated
                    </button>
                  )}
                </div>
              )}
            </div>

            {declaration ? (
              <textarea
                value={declaration}
                onChange={(e) => {
                  setDeclaration(e.target.value)
                  setEdited(true)
                }}
                rows={5}
                aria-label="My Day Declaration"
                className="w-full resize-y rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 font-serif text-base leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
              />
            ) : (
              <p className="font-sans text-sm text-[#6B5860]">
                Name what must happen, then build your declaration — it is read at the top of your CEO Workday™.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!ready}
                onClick={() => build(declaration ? variant : 0)}
                className="inline-flex items-center gap-2 rounded-full border border-[#8DAE72] bg-white px-5 py-2.5 font-sans text-sm font-semibold text-[#5B835F] hover:bg-[#F4F7F0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" aria-hidden /> {declaration ? "Rebuild My Declaration" : "Build My Declaration"}
              </button>
              <button
                type="button"
                disabled={!ready || saving}
                onClick={saveDay}
                className="inline-flex items-center gap-2 rounded-full bg-[#8DAE72] px-6 py-2.5 font-sans text-sm font-semibold text-white hover:bg-[#7A9B62] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save My Day"}
              </button>
              {savedAt && !saving && (
                <span className="inline-flex items-center gap-1.5 font-sans text-xs text-[#5B835F]">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Saved to your CEO Workday™
                </span>
              )}
            </div>
            {error && <p className="font-sans text-sm text-[#C0545A]">{error}</p>}
          </div>
        </div>
      )}
    </section>
  )
}
