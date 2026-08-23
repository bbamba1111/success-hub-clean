"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  Hammer,
  Mail,
  ShieldAlert,
  Users,
} from "lucide-react"
import type { BuildLifecycleStatus, BuildRecord, FounderAttentionState } from "@/lib/build-record/types"
import { getAllBuildRecords, replaceAllBuildRecords, saveBuildRecord, BUILD_RECORD_EVENT } from "@/lib/build-record/build-record-store"
import { getBuildRecordsFromDb, upsertBuildRecordToDb } from "@/utils/build-record-storage"
import {
  deriveFounderAttention,
  applyBuildStatusTransition,
  canTransitionTo,
  toggleTaskStatus,
  toggleQaItem,
  setQaNotes,
  setLiveEvidence,
  toggleInstalledItem,
  setBlockerNote,
  setExecutor,
  generateCommunicationPackage,
  approveCommunicationPackage,
  isCommunicationPackageApplicable,
} from "@/lib/build-record/build-record-engine"
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
    persist(applyBuildStatusTransition(record, next))
  }

  // Phase 11 — one persistence path for every interactive action (QA
  // toggles, LIVE evidence, INSTALLED checklist, tasks, blockers,
  // communication packages) so local cache + DB + list state always agree.
  function persist(updated: BuildRecord) {
    saveBuildRecord(updated)
    void upsertBuildRecordToDb(updated)
    setRecords((prev) => prev.map((r) => (r.readinessCapabilityId === updated.readinessCapabilityId ? updated : r)))
  }

  if (focusedRecord) {
    return <BuildRecordDetail record={focusedRecord} onTransition={handleTransition} onUpdate={persist} />
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
  onUpdate,
}: {
  record: BuildRecord
  onTransition: (record: BuildRecord, next: BuildLifecycleStatus) => void
  onUpdate: (record: BuildRecord) => void
}) {
  const attention = deriveFounderAttention(record)
  const meta = ATTENTION_META[attention]
  const Icon = meta.icon
  const pathLabel = getBuildPathDefinition(record.buildPath).label

  const [blockerDraft, setBlockerDraft] = useState(record.blockerNote ?? "")
  const [executorDraft, setExecutorDraft] = useState(record.executor ?? "")
  const [liveEvidenceDraft, setLiveEvidenceDraft] = useState(record.liveEvidence.note ?? "")
  const [qaNotesDraft, setQaNotesDraft] = useState(record.qaGate.notes ?? "")

  const readyToInstallGate = canTransitionTo(record, "ready-to-install")
  const installingGate = canTransitionTo(record, "installing")
  const installedGate = canTransitionTo(record, "installed")

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
        {record.recommendedBuildPath && record.recommendedBuildPath !== record.buildPath ? (
          <p className="font-sans text-xs leading-relaxed text-brand-ink-soft text-pretty">
            Recommended path was <span className="font-semibold">{getBuildPathDefinition(record.recommendedBuildPath).label}</span>.
            {record.pathSelectionReason ? ` Founder's reason for choosing differently: ${record.pathSelectionReason}` : null}
          </p>
        ) : null}
      </header>

      {/* Owner / executor — team/external ownership block */}
      <section className="mb-6 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-2">Who&apos;s doing this</h2>
        <p className="font-sans text-xs text-brand-ink-soft mb-3">{record.ownerSummary}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={executorDraft}
            onChange={(e) => setExecutorDraft(e.target.value)}
            placeholder="Who is actually doing the day-to-day work? (optional)"
            className="flex-1 rounded-lg border border-brand-blush/70 bg-white px-3 py-2 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:border-[#C13B6B]/50 focus:outline-none"
          />
          <button
            onClick={() => onUpdate(setExecutor(record, executorDraft))}
            className="shrink-0 rounded-lg border border-brand-blush px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
          >
            Save
          </button>
        </div>
      </section>

      {/* Blocker editor */}
      <section className="mb-6 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-2">Blocker</h2>
        {record.blockedByCapabilityIds.length > 0 ? (
          <p className="mb-2 font-sans text-xs leading-relaxed text-red-700/80">
            Waiting on: {record.blockedByCapabilityIds.join(", ")}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={blockerDraft}
            onChange={(e) => setBlockerDraft(e.target.value)}
            placeholder="Describe what's blocking this, or leave empty to clear"
            className="flex-1 rounded-lg border border-brand-blush/70 bg-white px-3 py-2 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:border-[#C13B6B]/50 focus:outline-none"
          />
          <button
            onClick={() => onUpdate(setBlockerNote(record, blockerDraft))}
            className="shrink-0 rounded-lg border border-brand-blush px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
          >
            {blockerDraft.trim() ? "Mark blocked" : "Clear blocker"}
          </button>
        </div>
      </section>

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
                  <li key={task.id} className="flex items-center gap-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdate(toggleTaskStatus(record, task.id))}
                      aria-pressed={task.status === "done"}
                      className="shrink-0"
                    >
                      {task.status === "done" ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-green-dark" aria-hidden />
                      ) : (
                        <Circle className="h-4 w-4 text-brand-ink-soft/50" aria-hidden />
                      )}
                    </button>
                    <span className={`flex-1 ${task.status === "done" ? "text-brand-ink-soft line-through" : "text-brand-ink"}`}>
                      {task.title}
                    </span>
                    <span className="shrink-0 font-semibold text-brand-ink-soft">{task.owner}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      {/* QA gate */}
      <section className="mb-6 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-3">
          Quality check before install
        </h2>
        <ul className="space-y-2">
          {record.qaGate.items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-xs">
              <button type="button" onClick={() => onUpdate(toggleQaItem(record, item.id))} className="mt-0.5 shrink-0">
                {item.checked ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-green-dark" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 text-brand-ink-soft/50" aria-hidden />
                )}
              </button>
              <span className={item.checked ? "text-brand-ink-soft line-through" : "text-brand-ink"}>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={qaNotesDraft}
            onChange={(e) => setQaNotesDraft(e.target.value)}
            placeholder="Notes on what was tested (optional)"
            className="flex-1 rounded-lg border border-brand-blush/70 bg-white px-3 py-2 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:border-[#C13B6B]/50 focus:outline-none"
          />
          <button
            onClick={() => onUpdate(setQaNotes(record, qaNotesDraft))}
            className="shrink-0 rounded-lg border border-brand-blush px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
          >
            Save notes
          </button>
        </div>
      </section>

      {/* LIVE evidence */}
      <section className="mb-6 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-2">
          Evidence this is actually live
        </h2>
        <p className="mb-3 font-sans text-xs text-brand-ink-soft">
          Describe how this is operating in the business right now — not that a document exists, but that it&apos;s in use.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={liveEvidenceDraft}
            onChange={(e) => setLiveEvidenceDraft(e.target.value)}
            placeholder="e.g. First real customer order processed through this workflow on..."
            className="flex-1 rounded-lg border border-brand-blush/70 bg-white px-3 py-2 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/60 focus:border-[#C13B6B]/50 focus:outline-none"
          />
          <button
            onClick={() => onUpdate(setLiveEvidence(record, liveEvidenceDraft))}
            className="shrink-0 rounded-lg border border-brand-blush px-4 py-2 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
          >
            Save
          </button>
        </div>
        {record.liveEvidence.confirmedAt ? (
          <p className="mt-2 font-sans text-xs text-brand-green-dark">Recorded {new Date(record.liveEvidence.confirmedAt).toLocaleDateString()}</p>
        ) : null}
      </section>

      {/* INSTALLED checklist */}
      <section className="mb-6 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-3">
          Part of the business&apos;s operating rhythm
        </h2>
        <ul className="space-y-2">
          {record.installedChecklist.items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 text-xs">
              <button type="button" onClick={() => onUpdate(toggleInstalledItem(record, item.id))} className="mt-0.5 shrink-0">
                {item.checked ? (
                  <CheckCircle2 className="h-4 w-4 text-brand-green-dark" aria-hidden />
                ) : (
                  <Circle className="h-4 w-4 text-brand-ink-soft/50" aria-hidden />
                )}
              </button>
              <span className={item.checked ? "text-brand-ink-soft line-through" : "text-brand-ink"}>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Communication packages — only for the 5 external/capacity Build Paths™ (delegate, hire, outsource, buy,
          partner). The 3 in-house paths (founder-build, co-build, ai-build) have no external recipient, so this
          section — and the Generate/Approve handoff workflow — never appears for them. */}
      {isCommunicationPackageApplicable(record.buildPath) ? (
        <section className="mb-8 rounded-2xl border border-brand-blush/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft">Communication packages</h2>
            <button
              onClick={() => onUpdate(generateCommunicationPackage(record))}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush px-3 py-1.5 font-sans text-xs font-semibold text-brand-ink-soft hover:bg-brand-blush/30"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Draft one
            </button>
          </div>
          {record.communicationPackages.length === 0 ? (
            <p className="font-sans text-xs text-brand-ink-soft">
              No drafts yet. Generating one never sends anything — it&apos;s a draft you review and approve.
            </p>
          ) : (
            <ul className="space-y-3">
              {record.communicationPackages.map((pkg) => (
                <li key={pkg.id} className="rounded-xl border border-brand-blush/60 bg-brand-cream/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-sans text-sm font-bold text-brand-ink">
                      {pkg.subject} <span className="font-normal text-brand-ink-soft">· {pkg.audience}</span>
                    </p>
                    {pkg.approvedAt ? (
                      <span className="shrink-0 rounded-full bg-brand-green/10 px-2.5 py-0.5 font-sans text-[10px] font-bold text-brand-green-dark">
                        Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => onUpdate(approveCommunicationPackage(record, pkg.id))}
                        className="shrink-0 rounded-full bg-brand-green px-3 py-1 font-sans text-[10px] font-bold text-white hover:bg-brand-green-dark"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-brand-ink-soft">{pkg.body}</pre>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <section className="mb-8 flex flex-wrap gap-2">
        {record.status !== "in-progress" && record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "in-progress")}
            className="rounded-full bg-brand-green px-4 py-2 font-sans text-xs font-bold text-white hover:bg-brand-green-dark"
          >
            Mark in progress
          </button>
        ) : null}
        {record.status !== "ready-to-install" && record.status !== "installing" && record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "ready-to-install")}
            disabled={!readyToInstallGate.allowed}
            title={readyToInstallGate.reason ?? undefined}
            className="rounded-full bg-brand-blush px-4 py-2 font-sans text-xs font-bold text-brand-ink hover:bg-brand-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark ready to install
          </button>
        ) : null}
        {record.status === "ready-to-install" ? (
          <button
            onClick={() => onTransition(record, "installing")}
            disabled={!installingGate.allowed}
            title={installingGate.reason ?? undefined}
            className="rounded-full bg-brand-blush px-4 py-2 font-sans text-xs font-bold text-brand-ink hover:bg-brand-coral hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start installing
          </button>
        ) : null}
        {record.status !== "installed" ? (
          <button
            onClick={() => onTransition(record, "installed")}
            disabled={!installedGate.allowed}
            title={installedGate.reason ?? undefined}
            className="rounded-full bg-brand-green px-4 py-2 font-sans text-xs font-bold text-white hover:bg-brand-green-dark disabled:cursor-not-allowed disabled:opacity-50"
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

      {!readyToInstallGate.allowed && record.status !== "installed" ? (
        <p className="mb-4 font-sans text-xs text-brand-ink-soft">{readyToInstallGate.reason}</p>
      ) : null}
      {record.status === "ready-to-install" && !installedGate.allowed ? (
        <p className="mb-4 font-sans text-xs text-brand-ink-soft">{installedGate.reason}</p>
      ) : null}

      {/* Activity log */}
      <section>
        <h2 className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-brand-ink-soft mb-3">Activity</h2>
        {record.activityLog.length === 0 ? (
          <p className="font-sans text-xs text-brand-ink-soft">No activity yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {[...record.activityLog]
              .slice()
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="font-sans text-xs text-brand-ink-soft">
                  <span className="text-brand-ink-soft/70">{new Date(entry.at).toLocaleString()}</span> — {entry.label}
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  )
}
