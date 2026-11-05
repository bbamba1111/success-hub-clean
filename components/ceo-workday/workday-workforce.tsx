"use client"

/**
 * CEO Workday™ ↔ AI workforce. Every plan item is carried by a `boss_jobs`
 * row. The founder chooses who does each piece (herself, Cherry Blossom™ or
 * one executive). An executive does the real work through
 * /api/ceo-workday/executive-work, which hands it back as a Phase 4 proposal:
 * nothing is saved, sent or finished until the founder approves it.
 */

import useSWR from "swr"
import { useState, type ReactNode } from "react"
import { Check, Loader2, MessageCircle, Pencil, RefreshCw, Sparkles } from "lucide-react"
import {
  allowJobDrafts,
  finishJobWithResult,
  loadWorkdayJobs,
  saveEditedWork,
  setJobAssignee,
  type WorkdayJobView,
} from "@/app/actions/boss-jobs"
import { decideProposal } from "@/app/actions/boss-authority"
import { EXECUTIVES, assigneeName, type AssigneeType } from "@/lib/boss/jobs/definitions"
import { BUSINESS_FUNCTIONS, CEO_FUNCTION_LABEL, type CeoBusinessFunction, type CeoPlanItem } from "@/lib/ceo-workday/plan-types"
import { LEGACY_BUSINESS_FUNCTIONS, SEVEN_BUSINESS_FUNCTIONS } from "@/lib/business-functions"

export const WORKDAY_FUNCTIONS: CeoBusinessFunction[] = BUSINESS_FUNCTIONS

const SUGGESTED_EXECUTIVE: Partial<Record<CeoBusinessFunction, string>> = Object.fromEntries(
  [...SEVEN_BUSINESS_FUNCTIONS, ...LEGACY_BUSINESS_FUNCTIONS].map((f) => [f.planKey, f.executive]),
)

export function useWorkdayJobs(items: CeoPlanItem[]) {
  const ids = items.map((i) => i.jobId).filter((id): id is string => !!id).sort()
  const { data, mutate } = useSWR(ids.length ? ["workday-jobs", ...ids] : null, () => loadWorkdayJobs(ids), {
    refreshInterval: 30_000,
  })
  const byId = new Map((data ?? []).map((j) => [j.id, j]))
  return { jobsById: byId, refreshJobs: mutate }
}

const isAiJob = (job: WorkdayJobView) => job.assigneeType === "executive" || job.assigneeType === "cherry"
const whoName = (job: WorkdayJobView) => assigneeName(job.assigneeType, job.assigneeExecutiveId, null, [])

/** What the founder is being asked to choose right now, if anything. */
function choiceNeeded(job: WorkdayJobView): string | null {
  if (job.stopped || job.status === "done") return null
  if (job.pendingWork) return `${whoName(job)} finished a draft. Review it.`
  if (job.waitingQuestion) return job.waitingQuestion
  if (job.status === "needs_help") return "Help is needed."
  if (isAiJob(job) && job.whatsReady) return "Approved. Tell us where it is now to finish."
  return null
}

/* ── Business area switcher ──────────────────────────────────────────────── */

export function FunctionSwitcher({
  items,
  value,
  onChange,
}: {
  items: CeoPlanItem[]
  value: CeoBusinessFunction | "all"
  onChange: (v: CeoBusinessFunction | "all") => void
}) {
  const count = (f: CeoBusinessFunction) => items.filter((i) => i.businessFunction === f).length
  const chip = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-base font-medium transition-colors ${
      active ? "border-[#2F4A2A] bg-[#2F4A2A] text-white" : "border-[#E5E5E5] bg-white text-[#1F1F1F] hover:border-[#2F4A2A]/50"
    }`
  return (
    <nav aria-label="Business areas" className="flex flex-col gap-3">
      <p className="text-lg font-semibold text-[#1F1F1F]">Business areas</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={value === "all"} onClick={() => onChange("all")} className={chip(value === "all")}>
          All work <span className="opacity-70">{items.length}</span>
        </button>
        {WORKDAY_FUNCTIONS.map((f) => (
          <button key={f} type="button" aria-pressed={value === f} onClick={() => onChange(f)} className={chip(value === f)}>
            {CEO_FUNCTION_LABEL[f]} <span className="opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

/* ── Today at a glance: My Work · My AI Team · My Choices ────────────────── */

export function WorkforceSummary({ items, jobsById }: { items: CeoPlanItem[]; jobsById: Map<string, WorkdayJobView> }) {
  const linked = items
    .map((i) => ({ item: i, job: i.jobId ? jobsById.get(i.jobId) : undefined }))
    .filter((x): x is { item: CeoPlanItem; job: WorkdayJobView } => !!x.job)
  const open = linked.filter(({ job, item }) => job.status !== "done" && item.status !== "completed" && !job.stopped)
  const mine = open.filter(({ job }) => job.assigneeType === "founder")
  const team = open.filter(({ job }) => isAiJob(job))
  const choices = linked.filter(({ job }) => choiceNeeded(job))
  const done = linked.filter(({ item, job }) => item.status === "completed" || job.status === "done")

  const teamStatus = (job: WorkdayJobView) =>
    job.pendingWork ? "Draft ready for you" : job.whatsReady ? "Approved" : "Not started yet"

  return (
    <section aria-label="Today at a glance" className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Column title="My Work" empty="Nothing for you to do yourself." rows={mine.map(({ item }) => ({ id: item.id, title: item.title, sub: CEO_FUNCTION_LABEL[item.businessFunction] }))} />
        <Column
          title="My AI Team"
          empty="Give work to Cherry Blossom™ or an executive below."
          rows={team.map(({ item, job }) => ({ id: item.id, title: item.title, sub: `${whoName(job)} · ${teamStatus(job)}` }))}
        />
        <Column
          title="My Choices"
          empty="Nothing needs your choice right now."
          highlight={choices.length > 0}
          rows={choices.map(({ item, job }) => ({ id: item.id, title: item.title, sub: choiceNeeded(job)! }))}
        />
      </div>
      {done.length > 0 && (
        <div className="rounded-2xl border border-[#E5E5E5] bg-white px-5 py-4">
          <p className="text-lg font-semibold text-[#1F1F1F]">Finished today</p>
          <ul className="mt-2 flex flex-col gap-2">
            {done.map(({ item, job }) => (
              <li key={item.id} className="text-base leading-relaxed text-[#1F1F1F]">
                <Check className="mr-2 inline h-4 w-4 text-[#2F4A2A]" aria-hidden />
                <span className="font-medium">{item.title}</span>
                {job.finishedResult && <ResultText text={job.finishedResult} />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Column({
  title,
  empty,
  rows,
  highlight,
}: {
  title: string
  empty: string
  rows: Array<{ id: string; title: string; sub: string }>
  highlight?: boolean
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border px-5 py-4 ${highlight ? "border-[#B5543C]/40 bg-[#FDF6F3]" : "border-[#E5E5E5] bg-white"}`}>
      <p className="flex items-center justify-between text-lg font-semibold text-[#1F1F1F]">
        {title}
        <span className="rounded-full bg-[#F4F4F4] px-2.5 text-base font-medium text-[#555555]">{rows.length}</span>
      </p>
      {rows.length === 0 ? (
        <p className="text-base leading-relaxed text-[#555555]">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.slice(0, 6).map((r) => (
            <li key={r.id} className="text-base leading-snug">
              <span className="font-medium text-[#1F1F1F]">{r.title}</span>
              <span className="block text-[#555555]">{r.sub}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ResultText({ text }: { text: string }) {
  const url = text.match(/https?:\/\/\S+/)?.[0]
  return (
    <span className="block pl-6 text-[#555555]">
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="break-all text-[#2F4A2A] underline underline-offset-2">
          {text}
        </a>
      ) : (
        text
      )}
    </span>
  )
}

/* ── One piece of work: who does it, the real work, and finishing ────────── */

type AssigneeChoice = "founder" | "cherry" | `exec:${string}`

function choiceOf(job: WorkdayJobView): AssigneeChoice {
  if (job.assigneeType === "executive" && job.assigneeExecutiveId) return `exec:${job.assigneeExecutiveId}`
  return job.assigneeType === "cherry" ? "cherry" : "founder"
}

const primaryBtn =
  "inline-flex items-center gap-2 rounded-full bg-[#2F4A2A] px-5 py-2.5 text-base font-medium text-white hover:opacity-90 disabled:opacity-50"
const secondaryBtn =
  "inline-flex items-center gap-2 rounded-full border border-[#D4D4D4] bg-white px-5 py-2.5 text-base font-medium text-[#1F1F1F] hover:bg-[#F4F4F4] disabled:opacity-50"
const field =
  "w-full rounded-xl border border-[#D4D4D4] bg-white px-4 py-3 text-base leading-relaxed text-[#1F1F1F] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#2F4A2A]/30"

export function ItemWorkforceRow({
  item,
  job,
  onChanged,
  onFinished,
}: {
  item: CeoPlanItem
  job: WorkdayJobView | undefined
  onChanged: () => void
  onFinished: () => void
}) {
  const [busy, setBusy] = useState<null | "assign" | "working" | "asking" | "saving">(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<null | "changes" | "edit" | "ask">(null)
  const [draft, setDraft] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [result, setResult] = useState("")

  if (!item.jobId) return null
  if (!job) return <p className="mt-3 text-base text-[#555555]">Loading…</p>

  const j = job
  const who = whoName(j)
  const finished = j.status === "done"
  const suggested = SUGGESTED_EXECUTIVE[item.businessFunction]

  async function run<T>(kind: NonNullable<typeof busy>, fn: () => Promise<T>) {
    setBusy(kind)
    setError(null)
    try {
      return await fn()
    } finally {
      setBusy(null)
    }
  }

  async function changeAssignee(value: AssigneeChoice) {
    await run("assign", async () => {
      const input: { type: AssigneeType; executiveId?: string } = value.startsWith("exec:")
        ? { type: "executive", executiveId: value.slice(5) }
        : { type: value as "founder" | "cherry" }
      const res = await setJobAssignee(j.id, input)
      if (!res.ok) setError(res.error)
      onChanged()
    })
  }

  async function callExecutive(body: { mode: "work" | "ask"; instruction?: string }) {
    const res = await fetch("/api/ceo-workday/executive-work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: j.id, ...body }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string; answer?: string }
    if (!res.ok) throw new Error(data.error ?? "That did not work. Please try again.")
    return data
  }

  async function startWork(instruction?: string) {
    await run("working", async () => {
      try {
        if (j.permissionLevel === "research") {
          const allowed = await allowJobDrafts(j.id)
          if (!allowed.ok) throw new Error(allowed.error)
        }
        await callExecutive({ mode: "work", instruction })
        setMode(null)
        setDraft("")
      } catch (e) {
        setError(e instanceof Error ? e.message : "That did not work.")
      }
      onChanged()
    })
  }

  async function ask() {
    if (!draft.trim()) return
    await run("asking", async () => {
      try {
        const data = await callExecutive({ mode: "ask", instruction: draft.trim() })
        setAnswer(data.answer ?? null)
        setDraft("")
      } catch (e) {
        setError(e instanceof Error ? e.message : "That did not work.")
      }
    })
  }

  async function approve() {
    const w = j.pendingWork
    if (!w) return
    await run("saving", async () => {
      const res = await decideProposal(w.id, "yes_do_it", w.hash)
      if (!res.ok) setError(res.error)
      onChanged()
    })
  }

  async function saveEdits() {
    const w = j.pendingWork
    if (!w) return
    await run("saving", async () => {
      const res = await saveEditedWork(j.id, w.id, w.hash, draft)
      if (!res.ok) setError(res.error)
      else {
        setMode(null)
        setDraft("")
      }
      onChanged()
    })
  }

  async function finish() {
    await run("saving", async () => {
      const res = await finishJobWithResult(j.id, result)
      if (!res.ok) setError(res.error)
      else {
        setResult("")
        onFinished()
      }
      onChanged()
    })
  }

  const finishForm = (prompt: string) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`result-${j.id}`} className="text-base font-medium text-[#1F1F1F]">
        {prompt}
      </label>
      <input
        id={`result-${j.id}`}
        value={result}
        onChange={(e) => setResult(e.target.value)}
        placeholder="Paste the link, or say where it is (e.g. Posted on Instagram)"
        className={field}
      />
      <div>
        <button type="button" onClick={finish} disabled={!result.trim() || !!busy} className={primaryBtn}>
          {busy === "saving" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Check className="h-4 w-4" aria-hidden />}
          Finish
        </button>
      </div>
    </div>
  )

  let body: ReactNode
  if (finished) {
    body = (
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-[#2F4A2A]">Done.</p>
        {j.finishedResult && <ResultText text={j.finishedResult} />}
      </div>
    )
  } else if (!isAiJob(j)) {
    body = finishForm("When it's done, where is the result?")
  } else if (busy === "working") {
    body = (
      <p className="flex items-center gap-2 text-base text-[#1F1F1F]" role="status">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {who} is working on it now…
      </p>
    )
  } else if (j.pendingWork) {
    const w = j.pendingWork
    body = (
      <div className="flex flex-col gap-3">
        <p className="whitespace-pre-line text-base leading-relaxed text-[#1F1F1F]">{w.summary}</p>
        {w.text && (
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
            <p className="text-sm font-medium text-[#555555]">The work</p>
            <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-[#1F1F1F]">{w.text}</p>
          </div>
        )}
        {mode === "edit" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={`edit-${j.id}`} className="sr-only">
              Edit the work
            </label>
            <textarea id={`edit-${j.id}`} rows={8} value={draft} onChange={(e) => setDraft(e.target.value)} className={field} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={saveEdits} disabled={!draft.trim() || !!busy} className={primaryBtn}>
                Save my version
              </button>
              <button type="button" onClick={() => setMode(null)} className={secondaryBtn}>
                Cancel
              </button>
            </div>
          </div>
        ) : mode === "changes" ? (
          <div className="flex flex-col gap-2">
            <label htmlFor={`changes-${j.id}`} className="text-base font-medium text-[#1F1F1F]">
              What should {who} change?
            </label>
            <textarea id={`changes-${j.id}`} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} className={field} />
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => startWork(draft.trim())} disabled={!draft.trim() || !!busy} className={primaryBtn}>
                <RefreshCw className="h-4 w-4" aria-hidden /> Send changes
              </button>
              <button type="button" onClick={() => setMode(null)} className={secondaryBtn}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={approve} disabled={!!busy || !w.text} className={primaryBtn}>
              <Check className="h-4 w-4" aria-hidden /> Approve
            </button>
            <button type="button" onClick={() => { setMode("changes"); setDraft("") }} className={secondaryBtn}>
              <RefreshCw className="h-4 w-4" aria-hidden /> Make changes
            </button>
            {w.text && (
              <button type="button" onClick={() => { setMode("edit"); setDraft(w.text ?? "") }} className={secondaryBtn}>
                <Pencil className="h-4 w-4" aria-hidden /> Edit it myself
              </button>
            )}
          </div>
        )}
      </div>
    )
  } else if (j.whatsReady) {
    body = (
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
          <p className="text-sm font-medium text-[#555555]">Approved work</p>
          <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-[#1F1F1F]">{j.whatsReady}</p>
        </div>
        {finishForm("Use it, then tell us where it is now.")}
        <div>
          <button type="button" onClick={() => setMode("changes")} className="text-base font-medium text-[#555555] underline underline-offset-2">
            Ask {who} for a new version
          </button>
        </div>
        {mode === "changes" && (
          <div className="flex flex-col gap-2">
            <textarea aria-label={`What should ${who} change?`} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} className={field} />
            <div>
              <button type="button" onClick={() => startWork(draft.trim())} disabled={!draft.trim() || !!busy} className={primaryBtn}>
                Send changes
              </button>
            </div>
          </div>
        )}
      </div>
    )
  } else {
    body = (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-relaxed text-[#555555]">
          Not started yet. {who} will prepare the work for you to review. Nothing is sent or published without you.
        </p>
        {mode === "changes" && (
          <textarea
            aria-label={`Instructions for ${who}`}
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Anything they should know? (optional)"
            className={field}
          />
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => startWork(draft.trim() || undefined)} disabled={!!busy || j.blockedBy > 0} className={primaryBtn}>
            <Sparkles className="h-4 w-4" aria-hidden /> Start Work
          </button>
          {mode !== "changes" && (
            <button type="button" onClick={() => setMode("changes")} className={secondaryBtn}>
              Give instructions
            </button>
          )}
        </div>
        {j.blockedBy > 0 && <p className="text-base text-[#555555]">Something else must finish first.</p>}
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white px-5 py-4">
      <label className="flex flex-wrap items-center gap-3">
        <span className="text-base font-medium text-[#1F1F1F]">Who does this?</span>
        <select
          value={choiceOf(j)}
          disabled={!!busy || finished || j.stopped}
          onChange={(e) => void changeAssignee(e.target.value as AssigneeChoice)}
          className="rounded-xl border border-[#D4D4D4] bg-white px-3 py-2 text-base text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#2F4A2A]/30 disabled:opacity-60"
        >
          <option value="founder">Me</option>
          <option value="cherry">Cherry Blossom™ (she picks the right executive)</option>
          {EXECUTIVES.map((e) => (
            <option key={e.id} value={`exec:${e.id}`}>
              {e.name}
              {e.id === suggested ? " (best fit)" : ""}
            </option>
          ))}
        </select>
      </label>

      {j.stopped ? <p className="text-base text-[#555555]">This work is stopped.</p> : body}

      {isAiJob(j) && !finished && !j.stopped && busy !== "working" && (
        <div className="flex flex-col gap-2 border-t border-[#EEEEEE] pt-3">
          {mode === "ask" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void ask()
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <label htmlFor={`ask-${j.id}`} className="sr-only">
                Ask {who} a question
              </label>
              <input id={`ask-${j.id}`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Ask ${who} a question`} className={field} />
              <button type="submit" disabled={!draft.trim() || !!busy} className={secondaryBtn}>
                {busy === "asking" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Ask"}
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => { setMode("ask"); setDraft("") }} className="inline-flex w-fit items-center gap-2 text-base font-medium text-[#555555] hover:text-[#1F1F1F]">
              <MessageCircle className="h-4 w-4" aria-hidden /> Ask {who} a question
            </button>
          )}
          {answer && <p className="rounded-xl bg-[#F4F4F4] px-4 py-3 text-base leading-relaxed text-[#1F1F1F]">{answer}</p>}
        </div>
      )}

      {error && (
        <p role="alert" className="text-base text-[#B5543C]">
          {error}
        </p>
      )}
    </div>
  )
}
