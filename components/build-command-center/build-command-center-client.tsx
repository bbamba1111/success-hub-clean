"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock,
  Hammer,
  ShieldAlert,
  Users,
} from "lucide-react"
import type { BuildLifecycleStatus, BuildRecord, FounderAttentionState } from "@/lib/build-record/types"
import { getAllBuildRecords, replaceAllBuildRecords, saveBuildRecord, BUILD_RECORD_EVENT } from "@/lib/build-record/build-record-store"
import { getBuildRecordsFromDb, upsertBuildRecordToDb } from "@/utils/build-record-storage"
import { deriveFounderAttention, applyBuildStatusTransition } from "@/lib/build-record/build-record-engine"
import { getBuildPathDefinition } from "@/lib/build-strategy/build-path-registry"

type Filter = "all" | "needs-attention" | "in-progress" | "awaiting-external" | "installed"

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-attention", label: "Needs attention" },
  { id: "in-progress", label: "In progress" },
  { id: "awaiting-external", label: "Awaiting external" },
  { id: "installed", label: "Installed" },
]

const ATTENTION_META: Record<FounderAttentionState, { label: string; icon: React.ElementType; className: string }> = {
  "on-track": { label: "On track", icon: CircleDot, className: "text-brand-green-dark bg-brand-green/10" },
  "attention-needed": { label: "Needs attention", icon: Clock, className: "text-amber-700 bg-amber-100" },
  blocked: { label: "Blocked", icon: ShieldAlert, className: "text-red-700 bg-red-100" },
  "awaiting-external": { label: "Awaiting external", icon: Users, className: "text-sky-700 bg-sky-100" },
  review: { label: "In review", icon: Hammer, className: "text-brand-ink-soft bg-brand-blush/50" },
  installed: { label: "Installed", icon: CheckCircle2, className: "text-brand-green-dark bg-brand-green/10" },
}

function matchesFilter(record: BuildRecord, filter: Filter, attention: FounderAttentionState): boolean {
  if (filter === "all") return true
  if (filter === "needs-attention") return attention === "attention-needed" || attention === "blocked"
  if (filter === "in-progress") return record.status === "in-progress" || record.status === "accepted"
  if (filter === "awaiting-external") return attention === "awaiting-external"
  if (filter === "installed") return attention === "installed"
  return true
}

export function BuildCommandCenterClient() {
  const searchParams = useSearchParams()
  const focusedId = searchParams.get("id")

  const [records, setRecords] = useState<BuildRecord[]>([])
  const [filter, setFilter] = useState<Filter>("all")
  const [loaded, setLoaded] = useState(false)

  // Paint instantly from the local cache, then reconcile with the database
  // (source of truth) — same two-phase pattern as `HarmonyProvider` and
  // `founder-destination-store.ts`.
  useEffect(() => {
    setRecords(getAllBuildRecords())
    setLoaded(true)

    getBuildRecordsFromDb().then((dbRecords) => {
      if (dbRecords.length === 0) return
      replaceAllBuildRecords(dbRecords)
      setRecords(dbRecords)
    })

    function handleChange() {
      setRecords(getAllBuildRecords())
    }
    window.addEventListener(BUILD_RECORD_EVENT, handleChange)
    return () => window.removeEventListener(BUILD_RECORD_EVENT, handleChange)
  }, [])

  const focusedRecord = useMemo(
    () => records.find((r) => r.readinessCapabilityId === focusedId) ?? null,
    [records, focusedId],
  )

  function handleTransition(record: BuildRecord, next: BuildLifecycleStatus) {
    const updated = applyBuildStatusTransition(record, next)
    saveBuildRecord(updated)
    void upsertBuildRecordToDb(updated)
    setRecords((prev) => prev.map((r) => (r.readinessCapabilityId === updated.readinessCapabilityId ? updated : r)))
  }

  if (focusedRecord) {
    return <BuildRecordDetail record={focusedRecord} onTransition={handleTransition} />
  }

  const filtered = records.filter((r) => matchesFilter(r, filter, deriveFounderAttention(r)))

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8 space-y-2">
        <p className="ds-eyebrow">Live Today™</p>
        <h1 className="font-display text-3xl font-semibold text-brand-ink">Build Command Center™</h1>
        <p className="max-w-2xl font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">
          Every capability build you&apos;ve started, from Build Path™ chosen through installed — in one place, so
          nothing quietly stalls.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 font-sans text-xs font-semibold transition-colors ${
              filter === f.id
                ? "bg-brand-green text-white"
                : "bg-brand-blush/40 text-brand-ink-soft hover:bg-brand-blush/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!loaded ? null : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-blush py-12 px-6 text-center">
          <p className="font-sans text-sm leading-relaxed text-brand-ink-soft max-w-sm text-pretty">
            {records.length === 0
              ? "No builds yet. Choose a Build Path™ from My Blueprint™ to start your first one."
              : "Nothing matches this filter right now."}
          </p>
          <Link
            href="/my-blueprint"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 font-sans text-xs font-bold text-white hover:bg-brand-green-dark transition-colors"
          >
            Go to My Blueprint™
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((record) => (
            <BuildRecordCard key={record.readinessCapabilityId} record={record} />
          ))}
        </ul>
      )}
    </main>
  )
}

function BuildRecordCard({ record }: { record: BuildRecord }) {
  const attention = deriveFounderAttention(record)
  const meta = ATTENTION_META[attention]
  const Icon = meta.icon
  const pathLabel = getBuildPathDefinition(record.buildPath).label
  const doneTasks = record.tasks.filter((t) => t.status === "done").length

  return (
    <li>
      <Link
        href={`/build-command-center?id=${encodeURIComponent(record.readinessCapabilityId)}`}
        className="flex items-center justify-between gap-4 rounded-2xl border border-brand-blush/70 bg-white px-5 py-4 shadow-sm transition-colors hover:border-[#C13B6B]/40"
      >
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-bold text-brand-ink">{record.title}</p>
          <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">
            {pathLabel} · {doneTasks}/{record.tasks.length} tasks done
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold ${meta.className}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {meta.label}
        </span>
      </Link>
    </li>
  )
}

function BuildRecordDetail({
  record,
  onTransition,
}: {
  record: BuildRecord
  onTransition: (record: BuildRecord, next: BuildLifecycleStatus) => void
}) {
  const attention = deriveFounderAttention(record)
  const meta = ATTENTION_META[attention]
  const Icon = meta.icon
  const pathLabel = getBuildPathDefinition(record.buildPath).label

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/build-command-center"
        className="mb-6 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-ink-soft hover:text-[#C13B6B]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All builds
      </Link>

      <header className="mb-6 space-y-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold ${meta.className}`}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {meta.label}
        </span>
        <h1 className="font-display text-2xl font-semibold text-brand-ink text-pretty">{record.title}</h1>
        <p className="font-sans text-sm leading-relaxed text-brand-ink-soft text-pretty">{record.summary}</p>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-brand-green">
          {pathLabel} · {record.ownerSummary}
        </p>
      </header>

      {record.blockedByCapabilityIds.length > 0 || record.blockerNote ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="font-sans text-sm font-semibold text-red-700">Blocked</p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-red-700/80">
            {record.blockerNote ?? `Waiting on: ${record.blockedByCapabilityIds.join(", ")}`}
          </p>
        </div>
      ) : null}

      <section className="mb-8 space-y-4">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft">Milestones</h2>
        {record.milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
            <p className="font-sans text-sm font-bold text-brand-ink">{milestone.title}</p>
            <p className="mt-1 font-sans text-xs text-brand-ink-soft">{milestone.definitionOfDone}</p>
            <ul className="mt-3 space-y-2">
              {record.tasks
                .filter((t) => milestone.taskIds.includes(t.id))
                .map((task) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 text-xs">
                    <span className={task.status === "done" ? "text-brand-ink-soft line-through" : "text-brand-ink"}>
                      {task.title}
                    </span>
                    <span className="shrink-0 font-semibold text-brand-ink-soft">{task.owner}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap gap-2">
        {record.status !== "in-progress" && record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "in-progress")}
            className="rounded-full bg-brand-green px-4 py-2 font-sans text-xs font-bold text-white hover:bg-brand-green-dark"
          >
            Mark in progress
          </button>
        ) : null}
        {record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "installed")}
            className="rounded-full bg-brand-blush px-4 py-2 font-sans text-xs font-bold text-brand-ink hover:bg-brand-coral hover:text-white"
          >
            Mark installed
          </button>
        ) : null}
        {record.status !== "paused" && record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "paused")}
            className="rounded-full border border-brand-blush px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
          >
            Pause
          </button>
        ) : null}
      </section>
    </main>
  )
}
