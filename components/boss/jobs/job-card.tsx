"use client"

import { useState, useTransition } from "react"
import { ArrowDown, ArrowUp, CalendarDays, Lock } from "lucide-react"
import {
  addDependency,
  addJobToTodaysWorkday,
  decideJob,
  loadJobHistory,
  moveJob,
  removeDependency,
  setJobPaused,
  setJobStatus,
  setJobStopped,
  setWaitingQuestion,
  setWhatsReady,
} from "@/app/actions/boss-jobs"
import {
  DECISIONS,
  JOB_FUNCTIONS,
  JOB_STATUSES,
  PERMISSION_LEVELS,
  assigneeName,
  isClosed,
  labelFor,
  type Job,
  type JobHistoryEntry,
  type TeamMember,
} from "@/lib/boss/jobs/definitions"
import { fieldClass } from "@/components/boss/primitives"
import { JobForm } from "./job-form"

const STATUS_STYLE: Record<Job["status"], string> = {
  not_started: "bg-muted text-brand-ink",
  working: "bg-brand-green/15 text-brand-green-dark",
  waiting_for_you: "bg-accent text-accent-foreground",
  needs_help: "bg-destructive/10 text-destructive",
  done: "bg-brand-green text-primary-foreground",
}

const ACTOR_NAME: Record<string, string> = {
  founder: "You",
  cherry: "Cherry Blossom™",
  executive: "An executive",
  system: "BO$$",
}

const FIELD_NAME: Record<string, string> = {
  title: "the job",
  details: "the details",
  business_function: "the business function",
  due_date: "the due date",
  do_first_rank: "the Do First order",
  assignee: "who is doing it",
  status: "the status",
  paused: "paused",
  stopped: "stopped",
  permission_level: "what they're allowed to do",
  waiting_question: "the question for you",
  whats_ready: "What's Ready",
  decision: "your decision",
  must_happen_first: "What Must Happen First",
}

const smallButton =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-brand-ink hover:bg-muted disabled:opacity-60"

export function JobCard({
  job,
  allJobs,
  team,
  position,
  total,
  canReorder,
  hasTodaysWorkday,
}: {
  job: Job
  allJobs: Job[]
  team: TeamMember[]
  position: number
  total: number
  canReorder: boolean
  hasTodaysWorkday: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<JobHistoryEntry[] | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [pending, startTransition] = useTransition()

  const closed = isClosed(job)
  const blockers = job.dependsOn
    .map((id) => allJobs.find((j) => j.id === id))
    .filter((j): j is Job => Boolean(j))
  const openBlockers = blockers.filter((b) => b.status !== "done")
  const dependencyChoices = allJobs.filter((j) => j.id !== job.id && !job.dependsOn.includes(j.id) && !j.stopped)

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action()
      setError(result.ok ? null : (result.error ?? "Something went wrong."))
      if (result.ok && showHistory) setHistory(await loadJobHistory(job.id))
    })
  }

  function toggleHistory() {
    const next = !showHistory
    setShowHistory(next)
    if (next) startTransition(async () => setHistory(await loadJobHistory(job.id)))
  }

  function describeValue(field: string | null, value: string | null) {
    if (value === null || value === "") return "nothing"
    if (field === "status") return labelFor(JOB_STATUSES, value)
    if (field === "permission_level") return labelFor(PERMISSION_LEVELS, value)
    if (field === "business_function") return labelFor(JOB_FUNCTIONS, value)
    if (field === "decision") return labelFor(DECISIONS, value)
    if (field === "paused" || field === "stopped") return value === "true" ? "yes" : "no"
    if (field === "must_happen_first") return allJobs.find((j) => j.id === value)?.title ?? "another job"
    if (field === "assignee") {
      const [type, id] = value.split(":")
      return assigneeName(type as Job["assigneeType"], id ?? null, id ?? null, team)
    }
    return value
  }

  if (editing) {
    return <JobForm job={job} team={team} onDone={() => setEditing(false)} />
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          {!closed && (
            <span className="mt-1 flex h-8 min-w-8 items-center justify-center rounded-full bg-brand-green/15 px-2 text-sm font-semibold text-brand-green-dark">
              <span className="sr-only">Do First order </span>
              {position}
            </span>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-pretty text-lg font-semibold leading-snug text-brand-ink">{job.title}</h3>
            <p className="text-base text-muted-foreground">
              {assigneeName(job.assigneeType, job.assigneeExecutiveId, job.assigneeTeamMemberId, team)} ·{" "}
              {labelFor(JOB_FUNCTIONS, job.businessFunction)}
              {job.dueDate ? ` · Due ${job.dueDate}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLE[job.status]}`}>
            {labelFor(JOB_STATUSES, job.status)}
          </span>
          {job.paused && <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-brand-ink">Paused</span>}
          {job.stopped && <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-brand-ink">Stopped</span>}
          {job.onTodaysWorkday && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium text-brand-ink">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              On today&apos;s workday
            </span>
          )}
        </div>
      </header>

      {job.details && <p className="text-base leading-relaxed text-brand-ink">{job.details}</p>}

      <p className="text-sm text-muted-foreground">
        Allowed to: <span className="font-medium text-brand-ink">{labelFor(PERMISSION_LEVELS, job.permissionLevel)}</span>
      </p>

      {openBlockers.length > 0 && (
        <p className="flex items-start gap-2 rounded-xl bg-muted p-3 text-base text-brand-ink">
          <Lock className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Must happen first: {openBlockers.map((b) => b.title).join(", ")}</span>
        </p>
      )}

      {job.waitingQuestion && !closed && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-accent/40 p-4">
          <p className="text-base font-semibold text-brand-ink">Waiting for You</p>
          <p className="text-base leading-relaxed text-brand-ink">{job.waitingQuestion}</p>
          <div className="flex flex-wrap gap-2">
            {DECISIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                disabled={pending}
                onClick={() => run(() => decideJob(job.id, d.key))}
                className={smallButton}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {job.whatsReady && (
        <div className="flex flex-col gap-1 rounded-xl bg-muted p-4">
          <p className="text-base font-semibold text-brand-ink">What&apos;s Ready</p>
          <p className="text-base leading-relaxed text-brand-ink">{job.whatsReady}</p>
        </div>
      )}

      {job.decision && (
        <p className="text-sm text-muted-foreground">
          Your last decision: <span className="font-medium text-brand-ink">{labelFor(DECISIONS, job.decision)}</span>
        </p>
      )}

      {error && (
        <p role="alert" className="text-base text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {!closed && (
          <>
            <label className="sr-only" htmlFor={`status-${job.id}`}>
              Status
            </label>
            <select
              id={`status-${job.id}`}
              value={job.status}
              disabled={pending}
              onChange={(e) => run(() => setJobStatus(job.id, e.target.value))}
              className={`${fieldClass} h-10 w-auto text-sm`}
            >
              {JOB_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <button type="button" className={smallButton} disabled={pending} onClick={() => setEditing(true)}>
              Change
            </button>
            <button
              type="button"
              className={smallButton}
              disabled={pending}
              onClick={() => run(() => setJobPaused(job.id, !job.paused))}
            >
              {job.paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              className={smallButton}
              disabled={pending}
              onClick={() => run(() => setJobStopped(job.id, true))}
            >
              Stop
            </button>
            {canReorder && (
              <>
                <button
                  type="button"
                  className={smallButton}
                  disabled={pending || position === 1}
                  onClick={() => run(() => moveJob(job.id, "up"))}
                  aria-label="Move up in Do First order"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={smallButton}
                  disabled={pending || position === total}
                  onClick={() => run(() => moveJob(job.id, "down"))}
                  aria-label="Move down in Do First order"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}
            {hasTodaysWorkday && !job.onTodaysWorkday && (
              <button
                type="button"
                className={smallButton}
                disabled={pending}
                onClick={() => run(() => addJobToTodaysWorkday(job.id))}
              >
                Add to today&apos;s workday
              </button>
            )}
          </>
        )}
        {job.stopped && (
          <button
            type="button"
            className={smallButton}
            disabled={pending}
            onClick={() => run(() => setJobStopped(job.id, false))}
          >
            Restart
          </button>
        )}
        <button type="button" className={smallButton} onClick={toggleHistory} aria-expanded={showHistory}>
          {showHistory ? "Hide What Happened" : "What Happened"}
        </button>
      </div>

      {!closed && (
        <details className="rounded-xl border border-border p-4">
          <summary className="cursor-pointer text-base font-medium text-brand-ink">More: questions, results, order</summary>
          <div className="mt-4 flex flex-col gap-4">
            <form
              action={(fd) => run(() => setWaitingQuestion(job.id, String(fd.get("question") ?? "")))}
              className="flex flex-col gap-2"
            >
              <label htmlFor={`question-${job.id}`} className="text-base font-medium text-brand-ink">
                Question waiting for you
              </label>
              <textarea
                id={`question-${job.id}`}
                name="question"
                rows={2}
                maxLength={2000}
                defaultValue={job.waitingQuestion ?? ""}
                className={`${fieldClass} h-auto py-3`}
              />
              <button type="submit" className={`${smallButton} self-start`} disabled={pending}>
                Save question
              </button>
            </form>

            <form
              action={(fd) => run(() => setWhatsReady(job.id, String(fd.get("ready") ?? "")))}
              className="flex flex-col gap-2"
            >
              <label htmlFor={`ready-${job.id}`} className="text-base font-medium text-brand-ink">
                What&apos;s Ready
              </label>
              <textarea
                id={`ready-${job.id}`}
                name="ready"
                rows={2}
                maxLength={4000}
                defaultValue={job.whatsReady ?? ""}
                className={`${fieldClass} h-auto py-3`}
              />
              <button type="submit" className={`${smallButton} self-start`} disabled={pending}>
                Save What&apos;s Ready
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-brand-ink">What Must Happen First</p>
              {blockers.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {blockers.map((b) => (
                    <li key={b.id} className="flex flex-wrap items-center gap-2 text-base text-brand-ink">
                      <span>
                        {b.title} ({labelFor(JOB_STATUSES, b.status)})
                      </span>
                      <button
                        type="button"
                        className={smallButton}
                        disabled={pending}
                        onClick={() => run(() => removeDependency(job.id, b.id))}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {dependencyChoices.length > 0 && (
                <form
                  action={(fd) => {
                    const target = String(fd.get("dependsOn") ?? "")
                    if (target) run(() => addDependency(job.id, target))
                  }}
                  className="flex flex-wrap gap-2"
                >
                  <label htmlFor={`deps-${job.id}`} className="sr-only">
                    Choose a job that must happen first
                  </label>
                  <select id={`deps-${job.id}`} name="dependsOn" className={`${fieldClass} h-10 w-auto text-sm`}>
                    {dependencyChoices.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={smallButton} disabled={pending}>
                    Add
                  </button>
                </form>
              )}
            </div>
          </div>
        </details>
      )}

      {showHistory && (
        <section aria-label="What Happened" className="flex flex-col gap-2 border-t border-border pt-4">
          {history === null ? (
            <p className="text-base text-muted-foreground">Loading…</p>
          ) : history.length === 0 ? (
            <p className="text-base text-muted-foreground">Nothing recorded yet.</p>
          ) : (
            <ol className="flex flex-col gap-2">
              {history.map((h) => (
                <li key={h.id} className="text-base leading-relaxed text-brand-ink">
                  <span className="text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString("en-US", {
                      timeZone: "America/New_York",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {" · "}
                  </span>
                  {ACTOR_NAME[h.actor] ?? h.actor}{" "}
                  {h.action === "created"
                    ? "created this job"
                    : h.action === "dependency_added"
                      ? `added "${describeValue(h.field, h.newValue)}" to What Must Happen First`
                      : h.action === "dependency_removed"
                        ? `removed "${describeValue(h.field, h.previousValue)}" from What Must Happen First`
                        : `changed ${FIELD_NAME[h.field ?? ""] ?? h.field} from ${describeValue(h.field, h.previousValue)} to ${describeValue(h.field, h.newValue)}`}
                  {h.note ? ` (${h.note})` : ""}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}
    </article>
  )
}
