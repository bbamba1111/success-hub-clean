"use client"

/**
 * CEO Workday™ — Live Plan (execution layer for the plan designed in
 * Decide & Design™). Mounted at the TOP of FounderGpsWorkspace.
 *
 *   YOUR CEO WORKDAY™ IS READY  (arrival banner)
 *   THE DESIGNED ASSIGNMENTS (organized into four protected hours)
 *   YOUR CEO WORKDAY™ → IS THIS STILL WHAT YOU NEED TO WORK ON? (adjust)
 *   TELL US WHAT YOU'RE WORKING ON (per hour)
 *   Hour blocks 1:00–5:00 with a DETERMINISTIC 5-Minute Check-In™ at
 *   exactly block end − 5 min (1:55 / 2:55 / 3:55 / 4:55). Manual open
 *   allowed any time; overdue check-ins surface until saved.
 *
 * The Supabase plan is the source of truth; the Today's Work™ queue below
 * this panel is the same plan mirrored, never a second copy.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Pencil, Play, RotateCcw } from "lucide-react"
import { FunctionSwitcher, ItemWorkforceRow, WorkforceSummary, useWorkdayJobs } from "./workday-workforce"
import { Button } from "@/components/ui/button"

import { getDateKey } from "@/lib/daily-plan/storage"
import { useDayStateSync } from "@/lib/ceo-workday/day-state-sync"
import { DayStateSaveNotice } from "./day-state-save-notice"
import { WhatMustHappenToday } from "@/components/ceo-workday/what-must-happen-today"
import { WorkdaySection, useWorkdaySectionLayout, type WorkdaySectionId } from "@/components/ceo-workday/workday-section"
import {
  HOUR_BLOCKS,
  blockNeedingCheckin,
  currentHourBlock,
  isCheckinOverdue,
  minutesUntilCheckin,
  platformMinutes,
  scheduledCheckinIso,
  type HourBlock,
  type HourBlockIndex,
} from "@/lib/ceo-workday/hour-blocks"
import { autoAssignHours, resolveHour, useHourOverrides } from "@/lib/ceo-workday/hour-assignment"
import {
  ARTICULATION_FUNCTIONS,
  CEO_FUNCTION_LABEL,
  CEO_ITEM_STATUS_LABEL,
  CEO_TREATMENT_LABEL,
  type CeoNextAction,
  type CeoPlanItem,
  type CeoBusinessFunction,
  type CeoWorkdayPlan,
} from "@/lib/ceo-workday/plan-types"
import {
  addCeoPlanItem,
  closeCeoWorkdayPlan,
  getCeoWorkdayCheckins,
  getCeoWorkdayPlan,
  saveCeoWorkdayPlan,
  saveWorkingOnDeclaration,
  updateCeoPlanItem,
  updateCeoPlanStatus,
  type HourCheckinItemOutcome,
} from "@/lib/ceo-workday/plan-server"
import { linkWorkItemAsset, updateWorkItemStatus } from "@/lib/ceo-workday/todays-work-store"
import { BUSINESS_ASSETS, getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { AssetDetailView } from "@/components/business-asset-library/asset-detail-view"
import type { BusinessAssetBuildRecord } from "@/utils/business-asset-build-storage"
import { CeoHourCheckin } from "./ceo-hour-checkin"
import { BoundaryWorkSurface } from "./boundary-work-surface"
import { boundaryWorkKind } from "@/lib/ceo-workday/boundary-work"
import { MonthlyBoundaryFocusPanel } from "./monthly-boundary-focus-panel"
import { ScheduledExperiencesStrip } from "./scheduled-experiences-strip"

type AdjustAction = "change" | "save-for-later" | "delegate" | "remove" | "help" | "other"

export function CeoWorkdayLivePlan() {
  useDayStateSync()
  const dateKey = getDateKey()
  const [plan, setPlan] = useState<CeoWorkdayPlan | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [savedBlocks, setSavedBlocks] = useState<Set<number>>(new Set())
  const [workingOnByBlock, setWorkingOnByBlock] = useState<Record<number, string>>({})

  const [entered, setEntered] = useState(false)
  const [highlightWork, setHighlightWork] = useState(false)
  const whatMustHappenRef = useRef<HTMLDivElement>(null)
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (highlightTimer.current) clearTimeout(highlightTimer.current) }, [])
  const [adjusting, setAdjusting] = useState(false)
  const [editTitleId, setEditTitleId] = useState<string | null>(null)
  const [editOutcomeId, setEditOutcomeId] = useState<string | null>(null)
  const [workingOnDraft, setWorkingOnDraft] = useState("")
  const [checkinOpen, setCheckinOpen] = useState<HourBlock | null>(null)
  const [checkinOpenedAt, setCheckinOpenedAt] = useState<string | null>(null)
  /** Which plan item's work surface (builder / template picker) is open. */
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [declarationArrival, setDeclarationArrival] = useState<{ declaration: string; builtAt: string } | null>(null)
  /** Founder adding a piece of work in her own words. */

  // Platform clock, ticked every 15s — deterministic, no random timers.
  const [nowMin, setNowMin] = useState(() => platformMinutes())
  useEffect(() => {
    const t = setInterval(() => setNowMin(platformMinutes()), 15_000)
    return () => clearInterval(t)
  }, [])

  const refresh = useCallback(async () => {
    const p = await getCeoWorkdayPlan(dateKey)
    setPlan(p)
    if (p) {
      const cks = await getCeoWorkdayCheckins(p.id)
      setSavedBlocks(new Set(cks.filter((c) => c.itemId).map((c) => c.hourBlock)))
      const wo: Record<number, string> = {}
      cks.filter((c) => !c.itemId && c.workingOnDeclaration).forEach((c) => (wo[c.hourBlock] = c.workingOnDeclaration!))
      setWorkingOnByBlock(wo)
      setEntered(p.status !== "designed")
    }
    setLoaded(true)
  }, [dateKey])

  useEffect(() => {
    void refresh()
    return () => {}
  }, [refresh])

  useEffect(() => {
    const onDeclaration = (event: Event) => {
      const detail = (event as CustomEvent<{ declaration?: string; builtAt?: string }>).detail
      if (!detail?.declaration) return
      setDeclarationArrival({ declaration: detail.declaration, builtAt: detail.builtAt ?? new Date().toISOString() })
      window.setTimeout(() => setDeclarationArrival(null), 8000)
      void refresh()
    }
    window.addEventListener("hl:ceo-workday-declaration:changed", onDeclaration)
    return () => window.removeEventListener("hl:ceo-workday-declaration:changed", onDeclaration)
  }, [refresh])

  // The live workspace loads only a plan explicitly saved by Decide & Design.
  // No declaration or identity statement is required to create or enter it.

  const sectionLayout = useWorkdaySectionLayout()

  const activeItems = useMemo(() => plan?.items.filter((i) => i.founderDecision !== "remove") ?? [], [plan])
  const { jobsById, refreshJobs } = useWorkdayJobs(activeItems)
  const [functionFilter, setFunctionFilter] = useState<CeoBusinessFunction | "all">("all")

  // The designed work populates the four hours: auto-filled by order + time,
  // and reassignable by the founder (override persisted per plan date).
  const autoHours = useMemo(() => autoAssignHours(plan?.items ?? []), [plan])
  const { overrides, setHour } = useHourOverrides(dateKey)
  const itemsByHour = useMemo(() => {
    const groups: Record<HourBlockIndex, CeoPlanItem[]> = { 1: [], 2: [], 3: [], 4: [] }
    for (const item of activeItems) {
      if (functionFilter !== "all" && item.businessFunction !== functionFilter) continue
      groups[resolveHour(item.id, autoHours, overrides)].push(item)
    }
    return groups
  }, [activeItems, autoHours, overrides, functionFilter])

  const block = currentHourBlock(nowMin)
  const due = blockNeedingCheckin(nowMin, savedBlocks)
  const allSaved = savedBlocks.size >= HOUR_BLOCKS.length || plan?.status === "closed"

  // Auto-surface the check-in exactly when due (or overdue) and unsaved.
  useEffect(() => {
    if (!plan || !entered || checkinOpen || !due) return
    setCheckinOpen(due)
    setCheckinOpenedAt(new Date().toISOString())
  }, [due, plan, entered, checkinOpen])

  if (!loaded) return null
  if (!plan) {
    // Nothing decided for today yet — say so plainly rather than render nothing.
    return (
      <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-10 text-center space-y-4">
        <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-md mx-auto text-pretty">
          Personalize your Work-Life Balance Business Day™ boundaries and design your CEO work. Your saved work will appear here when it is ready.
        </p>
        <a
          href={new Date().getDay() === 1 ? "/?openSpace=monday-debrief" : "/?openSpace=daily-planning-gps"}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-bold text-[#5A7A45] hover:underline"
        >
          Open Decide &amp; Design
        </a>
      </div>
    )
  }

  // ── handlers ─────────────────────────────────────────────────────────────
  async function handleEnter() {
  if (!plan) return
  setEntered(true)
  sectionLayout.expand("work")
  requestAnimationFrame(() => whatMustHappenRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  setHighlightWork(true)
  if (highlightTimer.current) clearTimeout(highlightTimer.current)
  highlightTimer.current = setTimeout(() => setHighlightWork(false), 2600)
    await updateCeoPlanStatus(plan.id, "entered")
  }

  async function adjust(item: CeoPlanItem, action: AdjustAction) {
    if (!plan) return
    if (action === "change") {
      setEditTitleId(item.id)
      return
    }
    const status =
      action === "save-for-later" ? "saved-for-later" : action === "delegate" ? "delegated" : action === "remove" ? "eliminated" : action === "help" ? "blocked" : "other"
    const nextAction: CeoNextAction | null =
      action === "save-for-later" ? "save-for-later" : action === "delegate" ? "delegate" : action === "remove" ? "eliminate" : action === "help" ? "need-help" : "other"
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, status, nextAction } : i)) })
    await updateCeoPlanItem(item.id, { status, nextAction })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, status === "blocked" ? "blocked" : "saved-for-later")
    await updateCeoPlanStatus(plan.id, "adjusted")
  }

  /** Bring an eliminated / removed piece of work back into today. */
  async function recallItem(item: CeoPlanItem) {
    if (!plan) return
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, status: "planned", nextAction: null, founderDecision: "edit" } : i)) })
    await updateCeoPlanItem(item.id, { status: "planned", nextAction: null, founderDecision: "edit" })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, "not-started")
    await updateCeoPlanStatus(plan.id, "adjusted")
  }

  async function commitTitle(item: CeoPlanItem, title: string) {
    if (!plan) return
    setEditTitleId(null)
    const t = title.trim()
    if (!t || t === item.title) return
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, title: t, founderDecision: "edit" } : i)) })
    await updateCeoPlanItem(item.id, { title: t, founderDecision: "edit" })
    await updateCeoPlanStatus(plan.id, "adjusted")
  }

  async function commitOutcome(item: CeoPlanItem, expectedEvidence: string) {
    if (!plan) return
    const value = expectedEvidence.trim()
    setEditOutcomeId(null)
    setPlan((p) => p && { ...p, items: p.items.map((i) => i.id === item.id ? { ...i, expectedEvidence: value, founderDecision: "edit" } : i) })
    await updateCeoPlanItem(item.id, { expectedEvidence: value, founderDecision: "edit" })
    await updateCeoPlanStatus(plan.id, "adjusted")
  }

  // Direct per-item controls. Starting work is never gated behind the
  // 1:00–5:00 PM hour-block clock or the "Tell us what you're working on"
  // field — the founder can start any assignment the moment they enter.
  async function startItem(item: CeoPlanItem) {
    if (!plan) return
    if (!entered) {
      setEntered(true)
      await updateCeoPlanStatus(plan.id, "entered")
    }
    setPlan((p) => p && { ...p, status: "in-progress", items: p.items.map((i) => (i.id === item.id ? { ...i, status: "in-progress" } : i)) })
    await updateCeoPlanItem(item.id, { status: "in-progress" })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, "in-progress")
    await updateCeoPlanStatus(plan.id, "in-progress")
  }

  async function addTaskToHour(hour: HourBlockIndex, title: string, outcome: string) {
    if (!plan) return
    const created = await addCeoPlanItem(plan.id, {
      title,
      purpose: "Added by you during your CEO Workday.",
      expectedEvidence: outcome,
      treatment: "implement-operate",
      businessFunction: "operations",
      role: "founder-added",
      estimatedMinutes: 30,
      ceoWorkCategory: "SYSTEMIZE",
      founderDecision: "added",
      status: "planned",
    })
    if (!created) throw new Error("Your task could not be saved. Please try again.")
    setPlan((p) => p ? { ...p, items: [...p.items, created], plannedMinutes: p.plannedMinutes + created.estimatedMinutes } : p)
    setHour(created.id, hour)
    setOpenItemId(created.id)
    await refreshJobs()
  }

  async function completeItem(item: CeoPlanItem) {
    if (!plan) return
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, status: "completed", nextAction: null } : i)) })
    await updateCeoPlanItem(item.id, { status: "completed", nextAction: null })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, "completed")
  }

  /** Start = open the work surface. Marks in-progress the first time. */
  function openWork(item: CeoPlanItem) {
    setOpenItemId(item.id)
    if (item.status === "planned" || ["saved-for-later", "blocked", "other"].includes(item.status)) void startItem(item)
  }

  /** Founder links an unlinked item to a Business Asset Library™ template. */
  async function linkAsset(item: CeoPlanItem, assetId: string) {
    if (!plan) return
    const asset = getBusinessAsset(assetId)
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, relatedAssetId: assetId, relatedAssetTitle: asset?.name ?? null } : i)) })
    await updateCeoPlanItem(item.id, { relatedAssetId: assetId })
    if (item.localWorkItemId) linkWorkItemAsset(item.localWorkItemId, assetId)
  }

  async function saveWorkingOn() {
    if (!plan || !block || !workingOnDraft.trim()) return
    const text = workingOnDraft.trim()
    setWorkingOnByBlock((p) => ({ ...p, [block.index]: text }))
    setWorkingOnDraft("")
    await saveWorkingOnDeclaration(plan.id, block.index, scheduledCheckinIso(block, dateKey), text)
    // Items still planned become in-progress once the founder declares the hour.
    activeItems
      .filter((i) => i.status === "planned")
      .forEach((i) => {
        void updateCeoPlanItem(i.id, { status: "in-progress" })
        if (i.localWorkItemId) updateWorkItemStatus(i.localWorkItemId, "in-progress")
      })
    setPlan((p) => p && { ...p, status: "in-progress", items: p.items.map((i) => (i.status === "planned" ? { ...i, status: "in-progress" } : i)) })
  }

  function openCheckinManually(b: HourBlock) {
    setCheckinOpen(b)
    setCheckinOpenedAt(new Date().toISOString())
  }

  async function handleCheckinSaved(b: HourBlock, outcomes: HourCheckinItemOutcome[]) {
    if (!plan) return
    setSavedBlocks((s) => new Set([...Array.from(s), b.index]))
    setPlan((p) =>
      p && {
        ...p,
        items: p.items.map((i) => {
          const o = outcomes.find((x) => x.itemId === i.id)
          return o ? { ...i, status: o.actualStatus, nextAction: o.nextAction ?? null } : i
        }),
      },
    )
    setCheckinOpen(null)
    if (b.index === 4) {
      await closeCeoWorkdayPlan(plan.id, dateKey)
      setPlan((p) => p && { ...p, status: "closed" })
    }
  }

  // A single designed work piece, rendered inside its hour workspace with the
  // full execution controls: edit title, start/continue/complete, the work
  // surface (asset builder / template picker), move-to-hour, and adjust
  // (defer / delegate / remove / help). Same identity through the lifecycle.
  const renderPlanItem = (item: CeoPlanItem) => {
    const gone = item.founderDecision === "remove" || item.status === "eliminated"
    const closed = plan?.status === "closed"
    const job = item.jobId ? jobsById.get(item.jobId) : undefined
    const aiOwned = job?.assigneeType === "executive" || job?.assigneeType === "cherry"
    if (openItemId !== item.id) {
      return (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#E8DFE2] bg-white px-3 py-2">
          <span className="min-w-0 flex-1 font-sans text-sm font-semibold text-[#2E1F27]">{item.title}</span>
          <span className="rounded-full bg-[#F4F1EC] px-2 py-0.5 font-sans text-xs font-semibold text-[#6B5860]">{CEO_ITEM_STATUS_LABEL[item.status]}</span>
          <button type="button" onClick={() => openWork(item)} className="rounded-full border border-[#5A7A45] px-3 py-1 font-sans text-xs font-bold text-[#5A7A45]">
            {item.status === "completed" ? "Review completed work" : "Open task"}
          </button>
          <label className="inline-flex items-center gap-1 font-sans text-xs text-[#6B5860]">
            Move to
            <select value={resolveHour(item.id, autoHours, overrides)} onChange={(e) => setHour(item.id, Number(e.target.value) as HourBlockIndex)} className="rounded border border-[#E8DFE2] bg-white px-1 py-1 font-semibold">
              {[1, 2, 3, 4].map((h) => <option key={h} value={h}>Hour {h}</option>)}
            </select>
          </label>
        </div>
      )
    }
    return (
      <div className={`rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7FB069]/50 hover:bg-[#F7FBF3] hover:shadow-[0_8px_20px_-8px_rgba(95,143,71,0.35)] ${gone ? "opacity-50" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#5B835F]">{CEO_FUNCTION_LABEL[item.businessFunction]}</span>
          <span className="font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/60">{CEO_TREATMENT_LABEL[item.treatment]}</span>
          <span className="ml-auto rounded-full bg-[#F4F1EC] px-2 py-0.5 font-montserrat text-[13px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
            {CEO_ITEM_STATUS_LABEL[item.status]}
          </span>
        </div>
        {editTitleId === item.id ? (
          <input
            autoFocus
            defaultValue={item.title}
            onBlur={(e) => commitTitle(item, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) (e.target as HTMLInputElement).blur()
              if (e.key === "Escape") setEditTitleId(null)
            }}
            className="mt-1 w-full rounded-lg border border-[#E8DFE2] px-2 py-1 font-sans text-sm font-bold text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
            aria-label="Edit work title"
          />
        ) : (
          <div className="mt-1 flex items-start justify-between gap-3">
            <p className={`font-sans text-[15.5px] font-bold leading-snug text-[#2E1F27] ${item.status === "eliminated" ? "line-through" : ""}`}>{item.title}</p>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-2.5 py-0.5 font-sans text-[15px] font-bold text-[#5A7A45]">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {item.estimatedMinutes} min
            </span>
          </div>
        )}
        {(item.relatedAssetTitle || (item.nextAction && item.status !== "completed")) && (
          <p className="mt-0.5 font-sans text-[15px] text-[#6B5860]">
            {[item.relatedAssetTitle, item.nextAction && item.status !== "completed" ? `next: ${item.nextAction.replace(/-/g, " ")}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {editOutcomeId === item.id ? (
          <label className="mt-2 block font-sans text-sm font-semibold text-[#5A7A45]">
            Expected outcome
            <textarea
              key={item.id}
              defaultValue={item.expectedEvidence}
              rows={3}
              onBlur={(e) => void commitOutcome(item, e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm font-normal text-[#2E1F27]"
            />
          </label>
        ) : item.expectedEvidence ? (
          <p className="mt-1 font-sans text-[16.5px] leading-relaxed text-[#3A2E33]">
            <span className="font-bold italic text-[#5A7A45]">Expected outcome:</span> {item.expectedEvidence}
          </p>
        ) : null}
        {!gone && (
          <ItemWorkforceRow
            item={item}
            job={item.jobId ? jobsById.get(item.jobId) : undefined}
            onChanged={() => void refreshJobs()}
            onFinished={() => void completeItem(item)}
          />
        )}
        {!closed && gone && (
          <button
            type="button"
            onClick={() => recallItem(item)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#5A7A45] px-3.5 py-1.5 font-sans text-base font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
          >
            <RotateCcw className="h-3 w-3" aria-hidden /> Recall to today
          </button>
        )}

        {!adjusting && !closed && !gone && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {aiOwned ? null : openItemId !== item.id ? (
              <button
                type="button"
                onClick={() => openWork(item)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-base font-bold ${
                  item.status === "completed"
                    ? "border border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                    : item.status === "planned"
                      ? "bg-[#5A7A45] text-white hover:opacity-90"
                      : "border border-[#5A7A45] text-[#5A7A45] hover:bg-[#5A7A45]/5"
                }`}
              >
                <Play className="h-3 w-3" aria-hidden />
                {item.status === "completed" ? "Open" : "Open my work tools"}
              </button>
            ) : (
              <button type="button" onClick={() => setOpenItemId(null)} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-1.5 font-sans text-base font-semibold text-[#6B5860] hover:bg-black/[0.03]">
                Close work surface
              </button>
            )}
            {editTitleId !== item.id && (
              <button
                type="button"
                onClick={() => { setEditTitleId(item.id); setEditOutcomeId(item.id) }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-1.5 font-sans text-base font-semibold text-[#6B5860] hover:bg-black/[0.03]"
              >
                <Pencil className="h-3 w-3" aria-hidden /> Edit
              </button>
            )}
            <label className="inline-flex items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-2.5 py-1">
              <span className="font-sans text-[15px] font-semibold text-[#6B5860]">Move to hour</span>
              <span className="sr-only">Move this work to another hour</span>
              <select
                value={resolveHour(item.id, autoHours, overrides)}
                onChange={(e) => setHour(item.id, Number(e.target.value) as HourBlockIndex)}
                className="cursor-pointer bg-transparent font-sans text-[15px] font-bold text-[#2E1F27] focus:outline-none"
              >
                {[1, 2, 3, 4].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {openItemId === item.id && !closed && !aiOwned && (
          <CeoPlanItemWorkSurface
            item={item}
            finishedByJob={!!item.jobId}
            onLinkAsset={(assetId) => linkAsset(item, assetId)}
            onBuildChange={(build) => {
              if (build && item.status !== "completed") void completeItem(item)
              if (!build && item.status === "completed") void startItem(item)
            }}
            onManualComplete={() => completeItem(item)}
          />
        )}
        {adjusting && !["completed", "eliminated"].includes(item.status) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(
              [
                ["change", "Change"],
                ["save-for-later", "Save for later"],
                ["delegate", "Delegate"],
                ["remove", "Remove"],
                ["help", "Ask for help"],
                ["other", "Other"],
              ] as Array<[AdjustAction, string]>
            ).map(([a, label]) => (
              <button key={a} type="button" onClick={() => adjust(item, a)} className="inline-flex items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-2.5 py-1 font-sans text-base text-[#6B5860] hover:bg-black/[0.03]">
                {a === "change" && <Pencil className="h-3 w-3" aria-hidden />}
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── render ──────────��────────────────────────��──────────────────────────��
  const workSection = (
    <>
      {plan?.declaration && (
        <div className="rounded-2xl border border-[#7FB069]/40 bg-white px-5 py-4">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5B835F]">My CEO Workday Declaration™</p>
          <p className="mt-2 font-serif text-lg italic leading-relaxed text-[#2E1F27]">{plan.declaration}</p>
          <p className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#5B835F]">Your designed work is here and waiting for execution.</p>
        </div>
      )}
      {/* What Must Happen Today™ + CEO Workday Execution™ — combined. The work the
          founder designed with the Business Function tool populates each of the four
          protected hours (auto-filled by order + time, and reassignable). Opening an
          hour reveals that work, editable / deferrable / delegable / removable right
          there, followed by the hour's Work Affirmation™ and Copy. */}
      {plan && activeItems.length > 0 && <WorkforceSummary items={activeItems} jobsById={jobsById} />}
      {plan && <FunctionSwitcher items={activeItems} value={functionFilter} onChange={setFunctionFilter} />}
      {plan && (
        <div
          ref={whatMustHappenRef}
          className={`scroll-mt-6 space-y-4 rounded-3xl transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(90,122,69,0.35)] ${
            highlightWork
              ? "-translate-y-1 shadow-[0_18px_40px_-12px_rgba(90,122,69,0.45)] ring-2 ring-[#7FB069]/60 ring-offset-4 ring-offset-white"
              : ""
          }`}
        >
          <WhatMustHappenToday
            itemsByHour={itemsByHour}
            renderItem={renderPlanItem}
            plannedMinutes={plan.plannedMinutes}
            onAddTask={addTaskToHour}
          />
        </div>
      )}
    </>
  )

  const hoursSection = plan && entered && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#5A7A45]" aria-hidden />
            <p className="font-montserrat text-base font-bold uppercase tracking-[0.16em] text-[#5A7A45]">Four hours · four check-ins</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {HOUR_BLOCKS.map((b) => {
              const saved = savedBlocks.has(b.index)
              const active = block?.index === b.index
              const overdue = !saved && isCheckinOverdue(b, nowMin)
              return (
                <div key={b.index} className={`rounded-2xl border px-3 py-3 ${active ? "border-[#5A7A45] bg-white" : saved ? "border-[#7FB069]/40 bg-[#7FB069]/5" : "border-[#E8DFE2] bg-white/60"}`}>
                  <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.14em] text-[#6B5860]">Hour {b.index}</p>
                  <p className="font-sans text-sm font-bold text-[#2E1F27]">{b.label} PM</p>
                  <p className="mt-1 font-sans text-[15px] text-[#6B5860]">
                    {saved ? "Checked in" : overdue ? "Check-in waiting" : active ? `Check-in at ${b.checkinLabel} · ${minutesUntilCheckin(b, nowMin)} min` : `Check-in ${b.checkinLabel}`}
                  </p>
                  {!saved && (active || overdue) && !checkinOpen && (
                    <button type="button" onClick={() => openCheckinManually(b)} className="mt-2 font-sans text-base font-semibold text-[#C0545A] underline underline-offset-2">
                      Open check-in now
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tell us what you're working on — for the current hour */}
          {block && !allSaved && !checkinOpen && (
            <div className="rounded-2xl border border-[#E8DFE2] bg-white px-5 py-4 space-y-2">
              <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">Tell us what you&apos;re working on</p>
              {workingOnByBlock[block.index] ? (
                <p className="font-sans text-sm text-[#2E1F27]">
                  <span className="font-semibold">This hour:</span> {workingOnByBlock[block.index]}
                </p>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workingOnDraft}
                    onChange={(e) => setWorkingOnDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault()
                        void saveWorkingOn()
                      }
                    }}
                    placeholder={`Tell us what you're working on in this hour (${block.label} PM)…`}
                    className="flex-1 rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                  />
                  <button type="button" onClick={saveWorkingOn} disabled={!workingOnDraft.trim()} className="rounded-lg bg-[#5A7A45] px-4 py-2 font-sans text-sm font-bold text-white hover:opacity-90 disabled:opacity-40">
                    Declare
                  </button>
                </div>
              )}
            </div>
          )}

          {!block && !allSaved && (
            <p className="font-sans text-base text-[#6B5860]">
              Your CEO Workday™ runs 1:00–5:00 PM. Check-ins open automatically at 1:55, 2:55, 3:55 and 4:55.
            </p>
          )}

          <AnimatePresence>
            {checkinOpen && checkinOpenedAt && (
              <motion.div key={`ck-${checkinOpen.index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <CeoHourCheckin
                  planId={plan.id}
                  block={checkinOpen}
                  scheduledAt={scheduledCheckinIso(checkinOpen, dateKey)}
                  openedAt={checkinOpenedAt}
                  items={plan.items}
                  isFinal={checkinOpen.index === 4}
                  onSaved={(o) => handleCheckinSaved(checkinOpen, o)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {plan.status === "closed" && (
            <div className="rounded-2xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-5 py-4">
              <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">CEO Workday™ closed</p>
              <p className="mt-1 font-sans text-sm text-[#3A2E33]">
                {plan.items.filter((i) => i.status === "completed").length} of {activeItems.length} completed. Your evidence is saved for GPS and Cherry Blossom.
              </p>
            </div>
          )}
        </div>
  )

  const monthlyBoundaryChosen = activeItems.some((i) => boundaryWorkKind(i.title) === "monthly")

  const sections: Record<WorkdaySectionId, { title: string; node: ReactNode }> = {
    monthly: { title: "My Monthly Boundary Focus™", node: monthlyBoundaryChosen ? <MonthlyBoundaryFocusPanel /> : null },
    work: { title: "What Must Happen Today™", node: plan ? workSection : null },
    hours: { title: "Four hours · four check-ins", node: hoursSection },
    experiences: {
      title: "Scheduled Experiences™",
      node: plan ? <ScheduledExperiencesStrip dateKey={dateKey} onPlaced={() => void refresh()} /> : null,
    },
  }
  const visibleOrder = sectionLayout.order.filter((id) => Boolean(sections[id].node))

  return (
    <div className="ceo-workspace space-y-5">
      <AnimatePresence>
        {declarationArrival && (
          <motion.div
            key={declarationArrival.builtAt}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 220 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed left-1/2 top-24 z-50 w-[min(90vw,560px)] -translate-x-1/2 px-6 py-5 text-center"
            style={{ background: "rgba(255,255,255,0.28)", backdropFilter: "blur(16px) saturate(1.3)", WebkitBackdropFilter: "blur(16px) saturate(1.3)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)" }}
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3F5A36]">Your CEO Workday Declaration™</p>
            <p className="mt-2 font-serif text-lg italic leading-snug text-[#1F2A1F]">{declarationArrival.declaration}</p>
            <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3F5A36]/80">Arriving in your 4-Hour Focused CEO Workday™ …</p>
          </motion.div>
        )}
      </AnimatePresence>
      <DayStateSaveNotice />
      {visibleOrder.map((id, i) => (
        <WorkdaySection
          key={id}
          id={id}
          title={sections[id].title}
          isFirst={i === 0}
          isLast={i === visibleOrder.length - 1}
          collapsed={sectionLayout.collapsed.includes(id)}
          onMove={(dir) => sectionLayout.move(id, dir)}
          onToggle={() => sectionLayout.toggle(id)}
        >
          {sections[id].node}
        </WorkdaySection>
      ))}
    </div>
  )
}


/* ── Work surface ──────��───────────────────────────────────────────────────── */

/**
 * Where the assignment is actually done. Three states:
 *  1. Linked to a Business Asset™ → the real, unmodified step-by-step builder
 *     (`AssetDetailView`). Completion is reported by the saved build record.
 *  2. Not linked → a template picker from the Business Asset Library™, grouped
 *     by category, so the founder connects the work to a real solution.
 *  3. Non-asset work (the founder chose to proceed without a template) →
 *     the expected outcome is shown and completion is an explicit, deliberate
 *     confirmation — never a button sitting where "Start" just was.
 */
function CeoPlanItemWorkSurface({
  item,
  finishedByJob,
  onLinkAsset,
  onBuildChange,
  onManualComplete,
}: {
  item: CeoPlanItem
  /** Finishing happens in the work panel, where a real result is required. */
  finishedByJob: boolean
  onLinkAsset: (assetId: string) => void
  onBuildChange: (build: BusinessAssetBuildRecord | null) => void
  onManualComplete: () => void
}) {
  const asset = item.relatedAssetId ? getBusinessAsset(item.relatedAssetId) : null
  const [withoutTemplate, setWithoutTemplate] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const grouped = useMemo(() => {
    const m = new Map<string, typeof BUSINESS_ASSETS>()
    for (const a of BUSINESS_ASSETS) {
      const list = m.get(a.category) ?? []
      list.push(a)
      m.set(a.category, list)
    }
    return Array.from(m.entries())
  }, [])

  const boundaryKind = boundaryWorkKind(item.title)
  if (boundaryKind && !asset) {
    return (
      <BoundaryWorkSurface
        kind={boundaryKind}
        expectedEvidence={item.expectedEvidence}
        completed={item.status === "completed"}
        workItemId={item.id}
        planId={item.planId ?? null}
        onComplete={onManualComplete}
      />
    )
  }

  if (asset) {
    return (
      <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
        <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          Business Asset™ template · {asset.name}
        </p>
        {item.assetReason && (
          <p className="mt-1 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{item.assetReason}</p>
        )}
        {item.expectedEvidence && (
          <p className="mt-1 font-sans text-base text-[#6B5860]">
            Done when: <span className="text-[#3A2E33]">{item.expectedEvidence}</span>
          </p>
        )}
        <div className="mt-4">
          <AssetDetailView asset={asset} onOwnedBuildChange={onBuildChange} />
        </div>
      </div>
    )
  }

  // Business assets are conditional: the template panel only appears when the
  // BO$$ readiness assessment marked this assignment as needing an asset.
  const needsAsset = item.assetRequirement === "required" || item.assetRequirement === "suggested"
  const assetRequired = item.assetRequirement === "required"

  if (needsAsset && !withoutTemplate) {
    return (
      <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
        <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          {assetRequired ? "This assignment needs a Business Asset™" : "A Business Asset™ will help here"}
        </p>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
          {item.assetReason ??
            "Choose the step-by-step template from your Business Asset Library™ that produces this outcome."}{" "}
          The builder opens right here, and finishing it completes this assignment.
        </p>
        <label className="mt-3 block">
          <span className="sr-only">Business Asset template</span>
          <select
            defaultValue=""
            onChange={(e) => e.target.value && onLinkAsset(e.target.value)}
            className="w-full rounded-xl border border-[#E8DFE2] bg-white px-3 py-2.5 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          >
            <option value="" disabled>
              Select a template…
            </option>
            {grouped.map(([cat, list]) => (
              <optgroup key={cat} label={cat}>
                {list.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {!assetRequired && (
          <button
            type="button"
            onClick={() => setWithoutTemplate(true)}
            className="mt-3 font-sans text-base font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
          >
            Continue without it
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
      <p className="font-montserrat text-[14px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">The result you want</p>
      {item.purpose && <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{item.purpose}</p>}
      <p className="mt-2 font-sans text-base leading-relaxed text-[#2E1F27]">
        <span className="font-semibold text-[#5A7A45]">Done when:</span> {item.expectedEvidence ?? "the outcome you designed exists."}
      </p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B5860]">
        {finishedByJob
          ? "When it's done, finish it above by saying where the result is."
          : "Do it yourself, or choose Cherry Blossom™ or an executive above to do it for you."}
      </p>

      {item.status !== "completed" && !finishedByJob && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#5A7A45] px-3.5 py-1.5 font-sans text-base font-bold text-white hover:opacity-90"
            >
              <Check className="h-3 w-3" aria-hidden /> It&apos;s done — mark complete
            </button>
          ) : (
            <>
              <span className="font-sans text-base text-[#6B5860]">Is the result real and in place?</span>
              <button type="button" onClick={onManualComplete} className="rounded-full bg-[#5A7A45] px-3.5 py-1.5 font-sans text-base font-bold text-white hover:opacity-90">
                Yes, complete
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="font-sans text-base font-semibold text-[#6B5860] underline underline-offset-2">
                Not yet
              </button>
            </>
          )}
          {needsAsset && (
            <button
              type="button"
              onClick={() => setWithoutTemplate(false)}
              className="ml-auto font-sans text-base font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
            >
              Use the suggested template
            </button>
          )}
        </div>
      )}
    </div>
  )
}
