"use client"

/**
 * Design My 4-Hour CEO Workday™ — lives inside the "4-Hour Focused CEO
 * Workday" collapsible of Design My Work-Life Balance Business Day™.
 *
 * GPS proposes. You decide.
 *
 *   1. Source decisions (weekly Business Building Priority, Bottleneck
 *      Priority, current assignment) are shown — never re-asked.
 *   2. The design engine proposes a coherent intervention chain.
 *   3. Founder keeps / edits / replaces / defers / delegates / removes,
 *      and may add manual work as a secondary action.
 *   4. A CEO Workday Declaration™ is built from identity + work + purpose.
 *   5. "Build My CEO Workday™" persists the plan (Supabase source of truth),
 *      mirrors items into the Today's Work™ queue, and saves the local
 *      declaration record so the live workspace paints instantly at 1 PM.
 *
 * Matches the Movement/Lunch intention forms' visual language exactly.
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Sparkles, Plus, RefreshCw, Pencil, X, Check } from "lucide-react"

import { getWeekKey, loadWeek, WLBB_WEEK_CHANGED_EVENT } from "@/lib/wlbb-week/storage"
import { getAreaById } from "@/lib/wlbb-week/catalog"
import type { WlbbWeekState } from "@/lib/wlbb-week/types"
import { getEgaEntriesByStatus } from "@/lib/ega/ega-storage"
import type { EgaEntry } from "@/lib/ega/types"
import { getInstalledStatusByAssetId } from "@/lib/business-asset-inventory/business-asset-inventory-store"
import { BUSINESS_ASSETS } from "@/lib/business-asset-library/business-asset-registry"
import { getBusinessStage } from "@/lib/business-stage/business-stage-store"
import { loadDailyIdentity, DAILY_IDENTITY_CHANGED_EVENT } from "@/lib/daily-identity/storage"
import { getDateKey } from "@/lib/daily-plan/storage"
import { createClient } from "@/lib/supabase/client"
import { getBbaSignalSummary, type BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"

import {
  designCeoWorkday,
  buildCeoWorkdayDeclaration,
  plannedMinutes as sumPlanned,
  CEO_WORKDAY_CONTAINER_MINUTES,
  type DesignEngineOutput,
} from "@/lib/ceo-workday/design-engine"
import {
  CEO_FUNCTION_LABEL,
  CEO_TREATMENT_LABEL,
  type CeoBusinessFunction,
  type CeoFounderDecision,
  type CeoPlanItem,
  type CeoTreatment,
} from "@/lib/ceo-workday/plan-types"
import {
  getCeoWorkdayEvidence,
  getCeoWorkdayPlan,
  linkPlanItemsToLocalQueue,
  saveCeoWorkdayPlan,
} from "@/lib/ceo-workday/plan-server"
import { addWorkItem, getTodaysWork, removeWorkItem } from "@/lib/ceo-workday/todays-work-store"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import {
  loadCeoWorkdayDeclaration,
  saveCeoWorkdayDeclaration,
  type CeoWorkdayDeclaration,
} from "@/lib/daily-plan/ceo-workday-declaration"

const GLASS_REVEAL_MS = 8000

const ROLE_LABEL: Record<CeoPlanItem["role"], string> = {
  primary: "PRIMARY",
  supporting: "SUPPORTING",
  validate: "VALIDATE",
  continue: "CONTINUE",
  "founder-added": "ADDED BY YOU",
}

const DECISION_LABEL: Record<CeoFounderDecision, string> = {
  keep: "Kept",
  edit: "Edited",
  replace: "Replaced",
  defer: "Deferred",
  delegate: "Delegated",
  remove: "Removed",
  added: "Added",
}

function newLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function CeoWorkdayDesignForm() {
  const [week, setWeek] = useState<WlbbWeekState | null>(null)
  const [bottlenecks, setBottlenecks] = useState<EgaEntry[]>([])
  const [bba, setBba] = useState<BbaSignalSummary | null>(null)
  const [prior, setPrior] = useState<Awaited<ReturnType<typeof getCeoWorkdayEvidence>>>(null)
  const [identity, setIdentity] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [design, setDesign] = useState<DesignEngineOutput | null>(null)
  const [items, setItems] = useState<CeoPlanItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [addTitle, setAddTitle] = useState("")
  const [addMinutes, setAddMinutes] = useState(30)
  const [addFn, setAddFn] = useState<CeoBusinessFunction>("build")

  const [declVariant, setDeclVariant] = useState(0)
  const [declaration, setDeclaration] = useState("")
  const [declEditing, setDeclEditing] = useState(false)

  const [built, setBuilt] = useState<CeoWorkdayDeclaration | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showGlass, setShowGlass] = useState(false)
  const glassTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dateKey = getDateKey()

  // ── load sources ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    const w = loadWeek(getWeekKey())
    setWeek(w)
    setIdentity(loadDailyIdentity(dateKey).identityStatement || null)
    setBuilt(loadCeoWorkdayDeclaration(dateKey))

    Promise.all([
      getEgaEntriesByStatus("open").catch(() => [] as EgaEntry[]),
      createClient()
        .auth.getUser()
        .then(({ data }) => (data.user?.id ? getBbaSignalSummary(data.user.id) : null))
        .catch(() => null),
      getCeoWorkdayEvidence().catch(() => null),
      getCeoWorkdayPlan(dateKey).catch(() => null),
    ]).then(([ega, bbaSummary, evidence, existingPlan]) => {
      if (cancelled) return
      const ids = new Set(w.business.bottleneckEgaEntryIds)
      setBottlenecks(ega.filter((e) => ids.has(e.id)))
      setBba(bbaSummary)
      // Only use prior evidence from a previous day for carry-forward.
      setPrior(evidence && evidence.planDate !== dateKey ? evidence : null)
      // If today's plan already exists server-side but the local mirror is gone, restore the ready state.
      if (existingPlan && existingPlan.declaration && !loadCeoWorkdayDeclaration(dateKey)) {
        setBuilt(
          saveCeoWorkdayDeclaration({
            planId: existingPlan.id,
            identityStatement: existingPlan.identityStatement ?? null,
            declaration: existingPlan.declaration,
            plannedMinutes: existingPlan.plannedMinutes,
            itemCount: existingPlan.items.length,
          }),
        )
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
      if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── stay in sync with the pickers above ──────────────────────────────────
  // The weekly Business Building Priority, Bottleneck Priority and "Decide
  // who you're being today" all live higher on this same page. Their stores
  // announce same-tab changes; re-read so GPS re-proposes without a reload.
  useEffect(() => {
    let cancelled = false
    const onWeek = () => {
      const w = loadWeek(getWeekKey())
      setWeek(w)
      const ids = new Set(w.business.bottleneckEgaEntryIds)
      getEgaEntriesByStatus("open")
        .then((ega) => {
          if (!cancelled) setBottlenecks(ega.filter((e) => ids.has(e.id)))
        })
        .catch(() => {})
    }
    const onIdentity = () => setIdentity(loadDailyIdentity(dateKey).identityStatement || null)
    window.addEventListener(WLBB_WEEK_CHANGED_EVENT, onWeek)
    window.addEventListener(DAILY_IDENTITY_CHANGED_EVENT, onIdentity)
    return () => {
      cancelled = true
      window.removeEventListener(WLBB_WEEK_CHANGED_EVENT, onWeek)
      window.removeEventListener(DAILY_IDENTITY_CHANGED_EVENT, onIdentity)
    }
  }, [dateKey])

  // ── propose ───────────────────────────────────────────────────────────────
  const assetNameById = useMemo(() => Object.fromEntries(BUSINESS_ASSETS.map((a) => [a.id, a.name])), [])

  useEffect(() => {
    if (loading || !week || built) return
    const out = designCeoWorkday({
      businessAreaId: week.business.businessAreaId,
      outcomeTexts: week.business.outcomes.map((o) => o.text),
      bottleneckEntries: bottlenecks,
      bbaSignals: bba,
      assetStatusById: getInstalledStatusByAssetId(),
      assetNameById,
      currentAssignment: null,
      priorEvidence: prior,
      businessStage: getBusinessStage(),
    })
    setDesign(out)
    setItems(out.items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, week, bottlenecks, bba, prior, built])

  const kept = items.filter((i) => i.founderDecision !== "remove")
  const planned = sumPlanned(items)

  useEffect(() => {
    if (declEditing || !design) return
    setDeclaration(
      buildCeoWorkdayDeclaration({
        identityStatement: identity,
        items,
        areaName: design.areaName,
        destination: design.destination,
        variant: declVariant,
      }),
    )
  }, [items, identity, design, declVariant, declEditing])

  // ── founder controls ──────────────────────────────────────────────────────
  function patchItem(id: string, patch: Partial<CeoPlanItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }
  function decide(id: string, decision: CeoFounderDecision) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    if (decision === "keep") {
      // Restore GPS's proposal exactly.
      const o = item.gpsOriginal
      patchItem(id, o ? { ...o, founderDecision: "keep", status: "planned" } : { founderDecision: "keep", status: "planned" })
      return
    }
    if (decision === "edit" || decision === "replace") {
      patchItem(id, { founderDecision: decision })
      setEditingId(id)
      return
    }
    patchItem(id, {
      founderDecision: decision,
      status: decision === "defer" ? "deferred" : decision === "delegate" ? "delegated" : "planned",
    })
  }
  function addManual() {
    const title = addTitle.trim()
    if (!title) return
    const item: CeoPlanItem = {
      id: `cwp_manual_${newLocalId()}`,
      position: items.length,
      title,
      purpose: "Added by you.",
      expectedEvidence: "",
      treatment: "implement-operate" as CeoTreatment,
      businessFunction: addFn,
      role: "founder-added",
      estimatedMinutes: Math.max(5, addMinutes),
      ceoWorkCategory: CEO_FUNCTION_TO_CATEGORY[addFn],
      gpsOriginal: null,
      founderDecision: "added",
      status: "planned",
    }
    setItems((prev) => [...prev, item])
    setAddTitle("")
    setAddMinutes(30)
    setAddOpen(false)
  }

  // ── build ─────────────────────────────────────────────────────────────────
  async function handleBuild() {
    if (!week || !design || kept.length === 0 || !declaration.trim()) return
    setSaving(true)
    setSaveError(null)
    const saved = await saveCeoWorkdayPlan({
      planDate: dateKey,
      weekKey: week.weekKey,
      businessAreaId: week.business.businessAreaId,
      bottleneckEgaEntryIds: week.business.bottleneckEgaEntryIds,
      primaryAssetId: design.relatedAssetId,
      constraintSummary: design.constraintSummary,
      interventionSummary: design.interventionSummary,
      identityStatement: identity,
      declaration: declaration.trim(),
      items: items.map(({ id: _id, planId: _p, ...rest }) => rest),
    })
    if (!saved) {
      setSaving(false)
      setSaveError("Your plan could not be saved. Please make sure you are signed in and try again.")
      return
    }

    // Mirror into the Today's Work™ queue the live workspace already renders
    // (clear previous CEO-plan mirrors for today first so nothing duplicates).
    getTodaysWork()
      .filter((w) => w.planItemId)
      .forEach((w) => removeWorkItem(w.id))
    const pairs: Array<{ itemId: string; localWorkItemId: string }> = []
    saved.items
      .filter((i) => i.founderDecision !== "remove" && i.status === "planned")
      .forEach((i) => {
        const category = i.ceoWorkCategory ?? "BUILD"
        const wf = getWorkflowEntry(category)
        const local = addWorkItem({
          category,
          selectedOptionLabel: i.title,
          workflowId: wf.workflowId,
          availability: wf.availability,
          source: i.role === "founder-added" ? "founder" : "gps",
          sourceDetail: i.role === "founder-added" ? "Designed in Decide & Design™" : "Founder GPS™ CEO Workday design",
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

    const record = saveCeoWorkdayDeclaration({
      planId: saved.id,
      identityStatement: identity,
      declaration: declaration.trim(),
      plannedMinutes: saved.plannedMinutes,
      itemCount: saved.items.filter((i) => i.founderDecision !== "remove").length,
    })
    setBuilt(record)
    setSaving(false)
    setShowGlass(true)
    if (glassTimerRef.current) clearTimeout(glassTimerRef.current)
    glassTimerRef.current = setTimeout(() => setShowGlass(false), GLASS_REVEAL_MS)
  }

  function handleEdit() {
    setBuilt(null)
    setDeclEditing(false)
  }

  // ── render ────────────────────────────────────────────────────────────────
  if (loading) {
    return <div className="px-1 py-2 font-sans text-sm text-[#6B5860]">Reading this week&apos;s decisions…</div>
  }

  if (built) {
    return (
      <>
        <AnimatePresence>
          {showGlass && (
            <motion.div
              key={built.builtAt}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 240 }}
              transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
              className="pointer-events-none fixed left-1/2 top-24 z-50 w-[min(90vw,420px)] -translate-x-1/2 px-6 py-5 text-center"
              style={{
                background: "rgba(255,255,255,0.28)",
                backdropFilter: "blur(16px) saturate(1.3)",
                WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A6B3E]">
                Your CEO Workday Declaration™
              </p>
              <p className="mt-2 font-serif text-lg italic leading-snug text-[#1F2A1F]">{built.declaration}</p>
              <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3A6B3E]/80">
                Arriving in your 4-Hour Focused CEO Workday™ …
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4 rounded-2xl border-2 border-[#7FB069]/30 bg-[#7FB069]/5 px-5 py-6 text-center">
          <CheckCircle2 className="mx-auto h-8 w-8 text-[#7FB069]" aria-hidden />
          <div>
            <p className="font-sans text-base font-bold text-[#2E1F27]">Your CEO Workday Declaration™ is ready</p>
            <p className="mt-1 font-sans text-sm text-[#6B5860]">
              {built.plannedMinutes} minutes of meaningful CEO work designed · {built.itemCount}{" "}
              {built.itemCount === 1 ? "piece" : "pieces"} of work
            </p>
          </div>
          <p className="mx-auto max-w-sm font-serif text-base italic leading-relaxed text-[#2E1F27]">{built.declaration}</p>
          <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-[#6B5860]">
            It will appear at the top of your{" "}
            <span className="font-semibold text-[#2E1F27]">4-Hour Focused CEO Workday™</span> when you arrive at 1 PM.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleEdit}
              className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
            >
              Edit my CEO Workday™
            </button>
            <button
              type="button"
              onClick={() => {
                handleEdit()
                setDeclVariant((v) => v + 1)
              }}
              className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#2E1F27]"
            >
              Build a different declaration
            </button>
          </div>
        </div>
      </>
    )
  }

  const area = week?.business.businessAreaId ? getAreaById(week.business.businessAreaId) : undefined

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 font-montserrat text-xs font-semibold uppercase tracking-widest text-[#7FB069]">
          GPS proposes. You decide.
        </p>
        <h4 className="mb-1 font-sans text-xl font-bold text-[#2E1F27]">Design My 4-Hour CEO Workday™</h4>
        <p className="font-sans text-sm text-[#6B5860]">
          Shape the work that will move this week&apos;s business priority forward inside your protected 4-hour CEO
          Workday™.
        </p>
        <p className="mt-2 font-sans text-xs leading-relaxed text-[#6B5860]/80">
          Your CEO Workday™ protects 240 minutes for meaningful business work. You do not need to fill every minute.
        </p>
      </div>

      {/* Source decisions */}
      <div className="grid gap-3 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] p-4 sm:grid-cols-2">
        <SourceCell label="This week's business priority" value={area?.name ?? "Not selected yet"} muted={!area} />
        <SourceCell
          label="Primary bottleneck"
          value={
            bottlenecks.length
              ? bottlenecks.map((b) => b.gap ?? b.signal).slice(0, 2).join(" · ")
              : bba?.hasWidespreadOwnershipGap
                ? "No clear owner across several functions (BBA)"
                : "None selected"
          }
          muted={!bottlenecks.length && !bba?.hasWidespreadOwnershipGap}
        />
        {design?.relatedAssetName && (
          <SourceCell label="Related Business Asset™" value={design.relatedAssetName} />
        )}
        {design?.constraintSummary && (
          <div className="sm:col-span-2">
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
              GPS reading
            </p>
            <p className="mt-1 font-sans text-sm leading-relaxed text-[#2E1F27]">{design.constraintSummary}</p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-[#6B5860]">{design.interventionSummary}</p>
          </div>
        )}
      </div>

      {/* Proposed work */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">
            Today&apos;s CEO work
          </p>
          <span className={`font-sans text-xs font-semibold ${planned > CEO_WORKDAY_CONTAINER_MINUTES ? "text-[#C13B6B]" : "text-[#6B5860]"}`}>
            {planned} / {CEO_WORKDAY_CONTAINER_MINUTES} min planned
          </span>
        </div>

        {design && !design.ok && (
          <div className="rounded-2xl border border-dashed border-[#E8DFE2] bg-white p-4 font-sans text-sm text-[#6B5860]">
            {design.reason}
          </div>
        )}

        {items.map((item) => (
          <WorkCard
            key={item.id}
            item={item}
            editing={editingId === item.id}
            onDecide={(d) => decide(item.id, d)}
            onPatch={(p) => patchItem(item.id, p)}
            onDoneEditing={() => setEditingId(null)}
          />
        ))}

        {/* Manual add — secondary */}
        {addOpen ? (
          <div className="space-y-2 rounded-2xl border border-[#E8DFE2] bg-[#FAF8F5] p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={addTitle}
                onChange={(e) => setAddTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    addManual()
                  }
                }}
                placeholder="What else must move today?"
                className="flex-1 rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] placeholder:text-[#6B5860]/50 focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
              />
              <input
                type="number"
                min={5}
                value={addMinutes}
                onChange={(e) => setAddMinutes(Math.max(5, Number(e.target.value) || 0))}
                className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
                aria-label="Minutes"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(CEO_FUNCTION_LABEL) as CeoBusinessFunction[]).map((fn) => (
                <button
                  key={fn}
                  type="button"
                  aria-pressed={addFn === fn}
                  onClick={() => setAddFn(fn)}
                  className={`rounded-full border px-2.5 py-1 font-montserrat text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    addFn === fn ? "border-[#3A2E33] bg-[#3A2E33] text-white" : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
                  }`}
                >
                  {CEO_FUNCTION_LABEL[fn]}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addManual}
                disabled={!addTitle.trim()}
                className="rounded-lg border border-[#7FB069]/40 px-4 py-2 font-sans text-sm font-semibold text-[#3A6B3E] hover:bg-[#7FB069]/10 disabled:opacity-40"
              >
                Add
              </button>
              <button type="button" onClick={() => setAddOpen(false)} className="font-sans text-sm text-[#6B5860] hover:text-[#2E1F27]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-xs text-[#6B5860] hover:bg-black/[0.03]"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add an activity
          </button>
        )}
      </div>

      {/* Declaration */}
      <div className="space-y-3 rounded-2xl border border-[#7FB069]/30 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3A6B3E]">
            Your CEO Workday Declaration™
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDeclEditing(false)
                setDeclVariant((v) => v + 1)
              }}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#6B5860] hover:text-[#2E1F27]"
            >
              <RefreshCw className="h-3 w-3" aria-hidden /> Rebuild
            </button>
            <button
              type="button"
              onClick={() => setDeclEditing((v) => !v)}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#6B5860] hover:text-[#2E1F27]"
            >
              <Pencil className="h-3 w-3" aria-hidden /> {declEditing ? "Done" : "Edit"}
            </button>
          </div>
        </div>
        {!identity && (
          <p className="font-sans text-xs text-[#6B5860]">
            Tip: choose who you&apos;re being today in <span className="font-semibold">Decide Who You&apos;re Being Today</span>{" "}
            above and your declaration will speak in that voice.
          </p>
        )}
        {declEditing ? (
          <textarea
            value={declaration}
            onChange={(e) => setDeclaration(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-serif text-base italic leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
          />
        ) : (
          <p className="font-serif text-lg italic leading-snug text-[#1F2A1F]">{declaration || "Keep at least one piece of work to build your declaration."}</p>
        )}
      </div>

      {saveError && <p className="font-sans text-xs text-[#C13B6B]">{saveError}</p>}

      <Button
        onClick={handleBuild}
        disabled={saving || kept.length === 0 || !declaration.trim() || !design?.ok}
        className="w-full bg-[#7FB069] py-6 text-base font-semibold text-white hover:bg-[#6FA055] disabled:opacity-40"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {saving ? "Building…" : "Build My CEO Workday™"} <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// ── subcomponents ───────────────────────────────────────────────────────────

function SourceCell({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div>
      <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/60">{label}</p>
      <p className={`mt-1 font-sans text-sm font-semibold leading-snug ${muted ? "text-[#6B5860]/60" : "text-[#2E1F27]"}`}>{value}</p>
    </div>
  )
}

function WorkCard({
  item,
  editing,
  onDecide,
  onPatch,
  onDoneEditing,
}: {
  item: CeoPlanItem
  editing: boolean
  onDecide: (d: CeoFounderDecision) => void
  onPatch: (p: Partial<CeoPlanItem>) => void
  onDoneEditing: () => void
}) {
  const removed = item.founderDecision === "remove"
  const parked = item.founderDecision === "defer" || item.founderDecision === "delegate"
  const changed = !["keep", "added"].includes(item.founderDecision)

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        removed ? "border-dashed border-[#E8DFE2] bg-white/60 opacity-60" : parked ? "border-[#E8DFE2] bg-white" : "border-[#E8DFE2] bg-[#FAF8F5]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] ${
          item.role === "primary" ? "bg-[#3A2E33] text-white" : "bg-[#E8DFE2] text-[#3A2E33]"
        }`}>
          {ROLE_LABEL[item.role]}
        </span>
        <span className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#5B835F]">
          {CEO_FUNCTION_LABEL[item.businessFunction]}
        </span>
        <span className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/60">
          {CEO_TREATMENT_LABEL[item.treatment]}
        </span>
        <span className="ml-auto font-sans text-xs font-semibold text-[#6B5860]">{item.estimatedMinutes} min</span>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={item.title}
            onChange={(e) => onPatch({ title: e.target.value })}
            className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm font-semibold text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
            aria-label="Work title"
          />
          <div className="flex items-center gap-2">
            <label className="font-sans text-xs text-[#6B5860]" htmlFor={`min-${item.id}`}>Minutes</label>
            <input
              id={`min-${item.id}`}
              type="number"
              min={5}
              max={240}
              value={item.estimatedMinutes}
              onChange={(e) => onPatch({ estimatedMinutes: Math.max(5, Number(e.target.value) || 0) })}
              className="w-20 rounded-lg border border-[#E8DFE2] bg-white px-2 py-1.5 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
            />
          </div>
          <textarea
            value={item.expectedEvidence}
            onChange={(e) => onPatch({ expectedEvidence: e.target.value })}
            rows={2}
            placeholder="What should be different when this is complete?"
            className="w-full rounded-lg border border-[#E8DFE2] bg-white px-3 py-2 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#8DAE72]/30"
          />
          <button
            type="button"
            onClick={onDoneEditing}
            className="inline-flex items-center gap-1 rounded-lg border border-[#7FB069]/40 px-3 py-1.5 font-sans text-xs font-semibold text-[#3A6B3E] hover:bg-[#7FB069]/10"
          >
            <Check className="h-3 w-3" aria-hidden /> Done
          </button>
        </div>
      ) : (
        <>
          <p className={`mt-2 font-sans text-base font-bold text-[#2E1F27] ${removed ? "line-through" : ""}`}>{item.title}</p>
          {item.relatedAssetTitle && (
            <p className="mt-1 font-sans text-xs text-[#6B5860]">
              Related Business Asset™: <span className="font-semibold text-[#2E1F27]">{item.relatedAssetTitle}</span>
            </p>
          )}
          {!removed && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/60">Why this work</p>
                <p className="mt-1 font-sans text-xs leading-relaxed text-[#3A2E33]">{item.purpose}</p>
              </div>
              <div>
                <p className="font-montserrat text-[9px] font-bold uppercase tracking-[0.16em] text-[#6B5860]/60">Expected evidence</p>
                <p className="mt-1 font-sans text-xs leading-relaxed text-[#3A2E33]">{item.expectedEvidence || "—"}</p>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {(["keep", "edit", "replace", "defer", "delegate", "remove"] as CeoFounderDecision[]).map((d) => {
          const active = item.founderDecision === d || (d === "keep" && item.founderDecision === "added")
          return (
            <button
              key={d}
              type="button"
              aria-pressed={active}
              onClick={() => onDecide(d)}
              className={`rounded-full border px-2.5 py-1 font-sans text-xs capitalize transition-colors ${
                active ? "border-[#3A2E33] bg-[#3A2E33] text-white" : "border-[#E8DFE2] bg-white text-[#6B5860] hover:bg-black/[0.03]"
              }`}
            >
              {d}
            </button>
          )
        })}
        {changed && (
          <span className="ml-auto inline-flex items-center gap-1 font-sans text-[11px] text-[#6B5860]">
            <X className="h-3 w-3" aria-hidden /> GPS proposed · you {DECISION_LABEL[item.founderDecision].toLowerCase()}
          </span>
        )}
      </div>
    </div>
  )
}

const CEO_FUNCTION_TO_CATEGORY: Record<CeoBusinessFunction, CeoPlanItem["ceoWorkCategory"]> = {
  build: "BUILD",
  decide: "DECIDE",
  own: "DECIDE",
  delegate: "DELEGATE",
  systemize: "SYSTEMIZE",
  "augment-automate-ai": "AUGMENT",
  connect: "CONNECT",
  communicate: "COMMUNICATE",
  sell: "SELL",
  market: "MARKET",
  deliver: "DELIVER",
  solve: "SOLVE",
}
