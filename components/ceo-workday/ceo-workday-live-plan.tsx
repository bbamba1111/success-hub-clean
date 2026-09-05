"use client"

/**
 * CEO Workday™ — Live Plan (execution layer for the plan designed in
 * Decide & Design™). Mounted at the TOP of FounderGpsWorkspace.
 *
 *   YOUR CEO WORKDAY™ IS READY  (arrival banner)
 *   YOUR CEO WORKDAY DECLARATION™ (read aloud)
 *   YOUR CEO WORKDAY™ → IS THIS STILL WHAT YOU NEED TO WORK ON? (adjust)
 *   TELL US WHAT YOU'RE WORKING ON (per hour)
 *   Hour blocks 1:00–5:00 with a DETERMINISTIC 5-Minute Check-In™ at
 *   exactly block end − 5 min (1:55 / 2:55 / 3:55 / 4:55). Manual open
 *   allowed any time; overdue check-ins surface until saved.
 *
 * The Supabase plan is the source of truth; the Today's Work™ queue below
 * this panel is the same plan mirrored, never a second copy.
 */

import { useCallback, useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Clock, Copy, Mic, Pencil, Play, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

import { getDateKey } from "@/lib/daily-plan/storage"
import {
  CEO_WORKDAY_DECLARATION_EVENT,
  loadCeoWorkdayDeclaration,
  type CeoWorkdayDeclaration,
} from "@/lib/daily-plan/ceo-workday-declaration"
import { WeeklyPrioritiesPanel } from "@/components/ceo-workday/weekly-priorities-panel"
import { useWeeklyCommitments } from "@/lib/weekly-commitments/use-weekly-commitments"
import {
  HOUR_BLOCKS,
  blockNeedingCheckin,
  currentHourBlock,
  isCheckinOverdue,
  minutesUntilCheckin,
  platformMinutes,
  scheduledCheckinIso,
  type HourBlock,
} from "@/lib/ceo-workday/hour-blocks"
import {
  ARTICULATION_FUNCTIONS,
  CEO_FUNCTION_LABEL,
  CEO_ITEM_STATUS_LABEL,
  CEO_TREATMENT_LABEL,
  type CeoNextAction,
  type CeoPlanItem,
  type CeoWorkdayPlan,
} from "@/lib/ceo-workday/plan-types"
import {
  addCeoPlanItem,
  closeCeoWorkdayPlan,
  getCeoWorkdayCheckins,
  getCeoWorkdayPlan,
  linkPlanItemsToLocalQueue,
  saveWorkingOnDeclaration,
  updateCeoPlanItem,
  updateCeoPlanStatus,
  type HourCheckinItemOutcome,
} from "@/lib/ceo-workday/plan-server"
import { addWorkItem, linkWorkItemAsset, updateWorkItemStatus } from "@/lib/ceo-workday/todays-work-store"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { BUSINESS_ASSETS, getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { AssetDetailView } from "@/components/business-asset-library/asset-detail-view"
import type { BusinessAssetBuildRecord } from "@/utils/business-asset-build-storage"
import { CeoHourCheckin } from "./ceo-hour-checkin"

type AdjustAction = "change" | "defer" | "delegate" | "remove" | "help" | "other"

export function CeoWorkdayLivePlan() {
  const dateKey = getDateKey()
  const [local, setLocal] = useState<CeoWorkdayDeclaration | null>(null)
  const { commitments: weekly } = useWeeklyCommitments()
  const weeklyDeclaration = weekly.workdayDeclaration?.trim() || null
  const [plan, setPlan] = useState<CeoWorkdayPlan | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [savedBlocks, setSavedBlocks] = useState<Set<number>>(new Set())
  const [workingOnByBlock, setWorkingOnByBlock] = useState<Record<number, string>>({})

  const [entered, setEntered] = useState(false)
  const [adjusting, setAdjusting] = useState(false)
  const [editTitleId, setEditTitleId] = useState<string | null>(null)
  const [workingOnDraft, setWorkingOnDraft] = useState("")
  const [checkinOpen, setCheckinOpen] = useState<HourBlock | null>(null)
  const [checkinOpenedAt, setCheckinOpenedAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  /** Which plan item's work surface (builder / template picker) is open. */
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  /** Founder adding a piece of work in her own words. */
  const [addingOpen, setAddingOpen] = useState(false)
  const [addDraft, setAddDraft] = useState("")
  const [addingBusy, setAddingBusy] = useState(false)

  // Platform clock, ticked every 15s — deterministic, no random timers.
  const [nowMin, setNowMin] = useState(() => platformMinutes())
  useEffect(() => {
    const t = setInterval(() => setNowMin(platformMinutes()), 15_000)
    return () => clearInterval(t)
  }, [])

  const refresh = useCallback(async () => {
    setLocal(loadCeoWorkdayDeclaration(dateKey))
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
    window.addEventListener(CEO_WORKDAY_DECLARATION_EVENT, refresh)
    return () => window.removeEventListener(CEO_WORKDAY_DECLARATION_EVENT, refresh)
  }, [refresh])

  const activeItems = useMemo(() => plan?.items.filter((i) => i.founderDecision !== "remove") ?? [], [plan])
  const block = currentHourBlock(nowMin)
  const due = blockNeedingCheckin(nowMin, savedBlocks)
  const allSaved = savedBlocks.size >= HOUR_BLOCKS.length || plan?.status === "closed"
  const needsArticulation = activeItems.some(
    (i) => i.status !== "completed" && ARTICULATION_FUNCTIONS.has(i.businessFunction),
  )

  // Auto-surface the check-in exactly when due (or overdue) and unsaved.
  useEffect(() => {
    if (!plan || !entered || checkinOpen || !due) return
    setCheckinOpen(due)
    setCheckinOpenedAt(new Date().toISOString())
  }, [due, plan, entered, checkinOpen])

  if (!loaded) return null
  if (!plan && !local && !weeklyDeclaration) {
    // Nothing decided for today yet — say so plainly rather than render nothing.
    return (
      <div className="rounded-3xl border border-dashed border-[#E8DFE2] px-6 py-10 text-center space-y-4">
        <p className="font-sans text-base leading-relaxed text-[#6B5860] max-w-md mx-auto text-pretty">
          Today&apos;s CEO Workday™ hasn&apos;t been decided yet. Name what must happen today in Decide &amp; Design
          and press <span className="font-semibold text-[#2E1F27]">Save My Day</span> — your declaration and work
          will appear here.
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

  // Today's Day Declaration™ (built by "Save My Day" from What Must Happen Today™)
  // reads first; the weekly 4-Hour CEO Workday Declaration™ is the fallback.
  const dayDeclaration = plan?.declaration?.trim() || local?.declaration?.trim() || null
  const declaration = dayDeclaration ?? weeklyDeclaration
  const plannedMinutes = plan?.plannedMinutes ?? local?.plannedMinutes ?? 0

  // ── handlers ─────────────────────────────────────────────────────────────
  async function handleEnter() {
    if (!plan) return
    setEntered(true)
    await updateCeoPlanStatus(plan.id, "entered")
  }

  async function adjust(item: CeoPlanItem, action: AdjustAction) {
    if (!plan) return
    if (action === "change") {
      setEditTitleId(item.id)
      return
    }
    const status =
      action === "defer" ? "deferred" : action === "delegate" ? "delegated" : action === "remove" ? "eliminated" : action === "help" ? "blocked" : "other"
    const nextAction: CeoNextAction | null =
      action === "defer" ? "later" : action === "delegate" ? "delegate" : action === "remove" ? "eliminate" : action === "help" ? "need-help" : "other"
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, status, nextAction } : i)) })
    await updateCeoPlanItem(item.id, { status, nextAction })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, status === "blocked" ? "blocked" : "deferred")
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

  /** Founder adds a piece of work to What Must Happen Today™ in her own words. */
  async function addWork() {
    if (!plan) return
    const title = addDraft.trim()
    if (!title) return
    setAddingBusy(true)
    const wf = getWorkflowEntry("BUILD")
    const purpose = "Added by me inside my CEO Workday™ as something that must happen today."
    const created = await addCeoPlanItem(plan.id, {
      title,
      purpose,
      expectedEvidence: "",
      treatment: "build-change",
      businessFunction: "build",
      role: "founder-added",
      estimatedMinutes: 60,
      relatedAssetId: null,
      relatedAssetTitle: null,
      ceoWorkCategory: "BUILD",
      founderDecision: "added",
      status: "planned",
      nextAction: null,
      localWorkItemId: null,
    })
    if (created) {
      // Mirror into the Today's Work™ queue so the plan stays the single source.
      const local = addWorkItem({
        category: "BUILD",
        selectedOptionLabel: title,
        workflowId: wf.workflowId,
        availability: wf.availability,
        source: "founder",
        sourceDetail: "What Must Happen Today™ · CEO Workday",
        status: "not-started",
        planItemId: created.id,
        estimatedMinutes: created.estimatedMinutes,
        purpose,
        expectedEvidence: "",
        tangibleOutcome: "",
      })
      void linkPlanItemsToLocalQueue([{ itemId: created.id, localWorkItemId: local.id }])
      setPlan((p) => p && { ...p, items: [...p.items, { ...created, localWorkItemId: local.id }], plannedMinutes: p.plannedMinutes + created.estimatedMinutes })
      await updateCeoPlanStatus(plan.id, "adjusted")
    }
    setAddDraft("")
    setAddingOpen(false)
    setAddingBusy(false)
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

  async function completeItem(item: CeoPlanItem) {
    if (!plan) return
    setPlan((p) => p && { ...p, items: p.items.map((i) => (i.id === item.id ? { ...i, status: "completed", nextAction: null } : i)) })
    await updateCeoPlanItem(item.id, { status: "completed", nextAction: null })
    if (item.localWorkItemId) updateWorkItemStatus(item.localWorkItemId, "completed")
  }

  /** Start = open the work surface. Marks in-progress the first time. */
  function openWork(item: CeoPlanItem) {
    setOpenItemId(item.id)
    if (item.status === "planned" || ["deferred", "blocked", "other"].includes(item.status)) void startItem(item)
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

  async function handleCopy() {
    if (!declaration) return
    try {
      await navigator.clipboard.writeText(declaration)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* My Workday Declaration™ — always first in the space, like Movement/Lunch */}
      {declaration && (
        <motion.div
          key={dayDeclaration ? (plan?.id ?? local?.builtAt) : `weekly-${weekly.workdayDeclarationBuiltAt ?? weekly.weekKey}`}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-3xl border-2 border-[#7FB069]/30 bg-white px-6 py-6 sm:px-7 space-y-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
              {dayDeclaration ? "My Workday Declaration™" : "My 4-Hour CEO Workday Declaration™"}
            </p>
            {plan?.identityStatement && (
              <span className="rounded-full bg-[#7FB069]/15 px-2.5 py-1 font-montserrat text-[10px] font-semibold text-[#3A6B3E]">
                {plan.identityStatement}
              </span>
            )}
          </div>
          <p className="font-serif text-lg italic leading-relaxed text-[#2E1F27] sm:text-xl">{declaration}</p>
          <p className="font-sans text-sm text-[#6B5860]">Read it aloud. Step into your CEO Workday™ and live from it.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={handleCopy} className="border-[#7FB069]/40 text-[#3A6B3E] hover:bg-[#7FB069]/10 bg-transparent">
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied!" : "Copy to Zoom Chat"}
            </Button>
            {!entered && plan && (
              <Button onClick={handleEnter} className="bg-[#5A7A45] text-white hover:opacity-90">
                Enter My CEO Workday™
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* This Week's Three Priorities™ — now directly UNDER the declaration
          (the two were reversed), collapsible with inline intention editing. */}
      <WeeklyPrioritiesPanel />

      {/* Arrival banner — under the declaration, before the work */}
      <AnimatePresence mode="wait">
        {!entered && (
          <motion.div
            key="arrive"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-6 py-6 sm:px-7 space-y-3"
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">
              What Must Happen Today™ is ready
            </p>
            <p className="font-sans text-sm leading-relaxed text-[#3A2E33]">
              You decided this work during Decide &amp; Design. Step into your protected 4-hour CEO Workday™.
            </p>
            <p className="font-sans text-xs text-[#6B5860]">
              {plannedMinutes} of 240 minutes planned · {activeItems.length || local?.itemCount || 0}{" "}
              {(activeItems.length || local?.itemCount || 0) === 1 ? "piece" : "pieces"} of meaningful work
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan + adjust */}
      {plan && (
        <div className="rounded-3xl border border-[#8DAE72]/30 bg-[#F4F7F0] px-6 py-6 sm:px-7 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5A7A45]">What Must Happen Today™</p>
              {plan.constraintSummary && <p className="mt-1 font-sans text-xs text-[#6B5860]">{plan.constraintSummary}</p>}
            </div>
            <span className="font-sans text-xs font-semibold text-[#6B5860]">{plan.plannedMinutes} / 240 min planned</span>
          </div>

          {entered && !adjusting && plan.status !== "closed" && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3">
              <p className="font-sans text-sm font-semibold text-[#2E1F27]">Is this still what you need to work on?</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAdjusting(false)} className="rounded-full bg-[#5A7A45] px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90">
                  Continue as designed
                </button>
                <button type="button" onClick={() => setAdjusting(true)} className="rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-xs font-semibold text-[#6B5860] hover:bg-black/[0.03]">
                  Adjust
                </button>
              </div>
            </div>
          )}

          <ol className="space-y-2">
            {plan.items.map((item, idx) => (
              <li key={item.id} className={`rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3 ${item.founderDecision === "remove" || item.status === "eliminated" ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 font-montserrat text-xs font-bold text-[#B7A6AE]">{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#5B835F]">{CEO_FUNCTION_LABEL[item.businessFunction]}</span>
                      <span className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/60">{CEO_TREATMENT_LABEL[item.treatment]}</span>
                      <span className="ml-auto rounded-full bg-[#F4F1EC] px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
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
                      <p className={`mt-1 font-sans text-sm font-bold text-[#2E1F27] ${item.status === "eliminated" ? "line-through" : ""}`}>{item.title}</p>
                    )}
                    <p className="mt-0.5 font-sans text-xs text-[#6B5860]">
                      {item.estimatedMinutes} min{item.relatedAssetTitle ? ` · ${item.relatedAssetTitle}` : ""}
                      {item.nextAction && item.status !== "completed" ? ` · next: ${item.nextAction.replace(/-/g, " ")}` : ""}
                    </p>
                    {item.expectedEvidence && (
                      <p className="mt-1 font-sans text-xs text-[#3A2E33]">
                        <span className="font-semibold text-[#5A7A45]">Expected outcome:</span> {item.expectedEvidence}
                      </p>
                    )}
                    {plan.status !== "closed" && (item.founderDecision === "remove" || item.status === "eliminated") && (
                      <button
                        type="button"
                        onClick={() => recallItem(item)}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#5A7A45] px-3.5 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden /> Recall to today
                      </button>
                    )}
                    {!adjusting && plan.status !== "closed" && item.founderDecision !== "remove" && item.status !== "eliminated" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {openItemId !== item.id ? (
                          <button
                            type="button"
                            onClick={() => openWork(item)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs font-bold ${
                              item.status === "completed"
                                ? "border border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                                : item.status === "planned"
                                  ? "bg-[#5A7A45] text-white hover:opacity-90"
                                  : "border border-[#5A7A45] text-[#5A7A45] hover:bg-[#5A7A45]/5"
                            }`}
                          >
                            <Play className="h-3 w-3" aria-hidden />
                            {item.status === "planned" ? "Start" : item.status === "completed" ? "Open" : "Continue"}
                          </button>
                        ) : (
                          <button type="button" onClick={() => setOpenItemId(null)} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-[#6B5860] hover:bg-black/[0.03]">
                            Close work surface
                          </button>
                        )}
                      </div>
                    )}

                    {/* The work surface — the founder never leaves the CEO Workday.
                        With a linked Business Asset™, this is the REAL step-by-step
                        builder (AssetDetailView, unmodified); completion is driven by
                        the saved build record, never by a bare button. */}
                    {openItemId === item.id && plan.status !== "closed" && (
                      <CeoPlanItemWorkSurface
                        item={item}
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
                            ["defer", "Defer"],
                            ["delegate", "Delegate"],
                            ["remove", "Remove"],
                            ["help", "Ask for help"],
                            ["other", "Other"],
                          ] as Array<[AdjustAction, string]>
                        ).map(([a, label]) => (
                          <button key={a} type="button" onClick={() => adjust(item, a)} className="inline-flex items-center gap-1 rounded-full border border-[#E8DFE2] bg-white px-2.5 py-1 font-sans text-xs text-[#6B5860] hover:bg-black/[0.03]">
                            {a === "change" && <Pencil className="h-3 w-3" aria-hidden />}
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Add work — the founder's words, mirrored into the plan and queue */}
          {plan.status !== "closed" && (
            addingOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void addWork()
                }}
                className="flex flex-col gap-2 rounded-2xl border border-dashed border-[#8DAE72]/50 bg-white px-4 py-3 sm:flex-row sm:items-center"
              >
                <input
                  autoFocus
                  value={addDraft}
                  onChange={(e) => setAddDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setAddingOpen(false)
                  }}
                  placeholder="What else must happen today?"
                  aria-label="Add work to today"
                  className="flex-1 rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={addingBusy || !addDraft.trim()} className="rounded-full bg-[#5A7A45] px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90 disabled:opacity-50">
                    {addingBusy ? "Adding…" : "Add to today"}
                  </button>
                  <button type="button" onClick={() => setAddingOpen(false)} className="rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-xs font-semibold text-[#6B5860] hover:bg-black/[0.03]">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#8DAE72]/60 bg-white px-3.5 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
              >
                <Plus className="h-3 w-3" aria-hidden /> Add work to today
              </button>
            )
          )}

          {adjusting && (
            <button type="button" onClick={() => setAdjusting(false)} className="font-sans text-xs font-semibold text-[#5A7A45] underline underline-offset-2">
              Done adjusting
            </button>
          )}
          {needsArticulation && (
            <p className="inline-flex items-center gap-1.5 font-sans text-xs text-[#5A7A45]">
              <Mic className="h-3.5 w-3.5" aria-hidden /> This work involves communicating or selling — Business Articulation Training™ is available below.
            </p>
          )}
        </div>
      )}

      {/* Hour blocks */}
      {plan && entered && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#5A7A45]" aria-hidden />
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#5A7A45]">Four hours · four check-ins</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {HOUR_BLOCKS.map((b) => {
              const saved = savedBlocks.has(b.index)
              const active = block?.index === b.index
              const overdue = !saved && isCheckinOverdue(b, nowMin)
              return (
                <div key={b.index} className={`rounded-2xl border px-3 py-3 ${active ? "border-[#5A7A45] bg-white" : saved ? "border-[#7FB069]/40 bg-[#7FB069]/5" : "border-[#E8DFE2] bg-white/60"}`}>
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B5860]">Hour {b.index}</p>
                  <p className="font-sans text-sm font-bold text-[#2E1F27]">{b.label} PM</p>
                  <p className="mt-1 font-sans text-[11px] text-[#6B5860]">
                    {saved ? "Checked in" : overdue ? "Check-in waiting" : active ? `Check-in at ${b.checkinLabel} · ${minutesUntilCheckin(b, nowMin)} min` : `Check-in ${b.checkinLabel}`}
                  </p>
                  {!saved && (active || overdue) && !checkinOpen && (
                    <button type="button" onClick={() => openCheckinManually(b)} className="mt-2 font-sans text-xs font-semibold text-[#C0545A] underline underline-offset-2">
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
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">Tell us what you&apos;re working on</p>
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
            <p className="font-sans text-xs text-[#6B5860]">
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
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5A7A45]">CEO Workday™ closed</p>
              <p className="mt-1 font-sans text-sm text-[#3A2E33]">
                {plan.items.filter((i) => i.status === "completed").length} of {activeItems.length} completed. Your evidence is saved for GPS and Cherry Blossom.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Work surface ──────────────────────────────────────────────────────────── */

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
  onLinkAsset,
  onBuildChange,
  onManualComplete,
}: {
  item: CeoPlanItem
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

  if (asset) {
    return (
      <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          Business Asset™ template · {asset.name}
        </p>
        {item.expectedEvidence && (
          <p className="mt-1 font-sans text-xs text-[#6B5860]">
            Done when: <span className="text-[#3A2E33]">{item.expectedEvidence}</span>
          </p>
        )}
        <div className="mt-4">
          <AssetDetailView asset={asset} onOwnedBuildChange={onBuildChange} />
        </div>
      </div>
    )
  }

  if (!withoutTemplate) {
    return (
      <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
          Link this work to a Business Asset™ template
        </p>
        <p className="mt-1 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">
          Choose the step-by-step template from your Business Asset Library™ that produces this outcome. The
          builder opens right here, and finishing it completes this assignment.
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
        <button
          type="button"
          onClick={() => setWithoutTemplate(true)}
          className="mt-3 font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
        >
          This work doesn&apos;t need a template
        </button>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] px-4 py-4 sm:px-5">
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">Working without a template</p>
      {item.purpose && <p className="mt-2 font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{item.purpose}</p>}
      <p className="mt-2 font-sans text-sm text-[#3A2E33]">
        <span className="font-semibold text-[#5A7A45]">Done when:</span> {item.expectedEvidence ?? "the outcome you designed exists."}
      </p>
      {item.status !== "completed" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#5A7A45] px-3.5 py-1.5 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
            >
              <Check className="h-3 w-3" aria-hidden /> The outcome exists — mark complete
            </button>
          ) : (
            <>
              <span className="font-sans text-xs text-[#6B5860]">Confirm the expected outcome is real and in place?</span>
              <button type="button" onClick={onManualComplete} className="rounded-full bg-[#5A7A45] px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:opacity-90">
                Yes, complete
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2">
                Not yet
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setWithoutTemplate(false)}
            className="ml-auto font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
          >
            Link a template instead
          </button>
        </div>
      )}
    </div>
  )
}
