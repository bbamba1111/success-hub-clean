"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { resourceName } from "@/lib/boss/reducer"
import { AUTH_LEVELS, FUNCTIONS, isClosed } from "@/lib/boss/constants"
import { formatDate, formatStamp } from "@/lib/boss/clock"
import type { AuthLevel, OpportunityStage, PermissionStatus } from "@/lib/boss/types"
import {
  DemoTag,
  EmptyState,
  MoreDetails,
  FunctionBadge,
  LevelBadge,
  PageHeader,
  Panel,
  PermissionStatusBadge,
  fieldClass,
  labelClass,
} from "./primitives"
import { CoordinatorFeed, DecisionsPanel, founderDecisionItems } from "./business-day/workday-panels"

export function BusinessDashboard() {
  const { state, clock } = useBoss()
  const open = state.work.filter((w) => !isClosed(w.status))
  const decisions = founderDecisionItems(state.work)
  const plan = state.work.filter((w) => w.inTodayPlan)
  return (
    <>
      <PageHeader
        eyebrow="Business Dashboard"
        title="How your business is doing"
        description="A quick look at all five parts of your business."
        actions={
          <Button asChild>
            <Link href="/boss">{clock.phase === "workday" ? "Go back to work time" : "Open My Business Day"}</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Tasks done today", `${plan.filter((w) => w.status === "completed").length} of ${plan.length}`],
          ["Tasks not done yet", open.length],
          ["Things you need to decide", decisions.length],
        ].map(([l, v]) => (
          <div key={l} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-6">
            <span className="font-display text-4xl font-semibold text-brand-ink">{v}</span>
            <span className="text-base text-brand-ink-soft">{l}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {FUNCTIONS.map((f) => {
          const items = open.filter((w) => w.fn === f.id)
          return (
            <Panel key={f.id} title={f.label} description={f.purpose}>
              <dl className="flex flex-col gap-2 text-base">
                {[
                  ["Not done", items.length],
                  ["Doing now", items.filter((w) => w.status === "in_progress").length],
                  ["Stuck or waiting", items.filter((w) => ["blocked", "awaiting_external", "on_hold"].includes(w.status)).length],
                  ["Needs you", items.filter((w) => decisions.some((d) => d.id === w.id)).length],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <dt className="text-muted-foreground">{l}</dt>
                    <dd className="font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )
        })}
      </div>
      <DecisionsPanel limitToPlan={false} />
      <MoreDetails summary="What my AI helper did lately">
        <CoordinatorFeed phase={clock.phase} limit={5} />
      </MoreDetails>
    </>
  )
}

const STAGES: { id: OpportunityStage; label: string }[] = [
  { id: "researching", label: "Looking into it" },
  { id: "pitch_preparing", label: "Getting the pitch ready" },
  { id: "awaiting_founder_approval", label: "Needs your OK" },
  { id: "outreach_sent", label: "Message sent" },
  { id: "response_received", label: "They wrote back" },
  { id: "closed", label: "Finished" },
]

export function OpportunitiesPage() {
  const { state, dispatch } = useBoss()
  return (
    <>
      <PageHeader
        eyebrow="Business Work Queue · Opportunities"
        title="Chances to grow"
        description="Talks, podcasts, news stories, and partners. In this practice version, no messages are sent."
        actions={<DemoTag />}
      />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((s) => {
          const items = state.opportunities.filter((o) => o.stage === s.id)
          return (
            <section key={s.id} aria-label={s.label} className="flex w-80 shrink-0 flex-col gap-4">
              <h2 className="flex items-center justify-between text-lg font-semibold text-brand-ink">
                {s.label}
                <span className="rounded-full bg-muted px-2.5 text-base tabular-nums">{items.length}</span>
              </h2>
              {items.map((o) => (
                <article key={o.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
                  <p className="text-lg font-semibold leading-snug text-brand-ink">{o.name}</p>
                  <p className="text-base text-muted-foreground">
                    {o.organization} · {o.type.replace(/_/g, " ")}
                  </p>
                  <p className="text-base leading-relaxed text-brand-ink">Next step: {o.nextAction}</p>
                  <p className="text-base text-muted-foreground">Who: {resourceName(state, o.assigneeId)}</p>
                  {o.approval === "awaiting" ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { approval: "approved", stage: "outreach_sent" } })}
                        className="h-12 rounded-xl bg-brand-green px-4 text-base font-semibold text-primary-foreground hover:bg-brand-green-dark"
                      >
                        Yes, send it
                      </button>
                      <button
                        onClick={() => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { approval: "declined", stage: "closed", outcome: "Declined by founder" } })}
                        className="h-12 rounded-xl border border-border px-4 text-base hover:bg-muted"
                      >
                        No, thank you
                      </button>
                    </div>
                  ) : (
                    <select
                      value={o.stage}
                      onChange={(e) => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { stage: e.target.value as OpportunityStage } })}
                      className={fieldClass}
                      aria-label={`Where is ${o.name} now?`}
                    >
                      {STAGES.map((st) => (
                        <option key={st.id} value={st.id}>{st.label}</option>
                      ))}
                    </select>
                  )}
                </article>
              ))}
            </section>
          )
        })}
      </div>
    </>
  )
}

export function AuthorityPage() {
  const { state, dispatch } = useBoss()
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState({ resourceId: "", action: "", scope: "", level: "prepare" as AuthLevel, limits: "" })
  const set = (status: PermissionStatus, id: string, note: string) => dispatch({ type: "PERMISSION_STATUS", id, status, note })

  return (
    <>
      <PageHeader
        eyebrow="Authority & Permissions"
        title="Who is allowed to do what"
        description="You choose what each person or tool may do. Saying yes to one task does not mean yes to every task."
        actions={
          <Button onClick={() => setAdding((a) => !a)}>
            <Plus className="h-4 w-4" aria-hidden />
            Give permission
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {AUTH_LEVELS.map((l) => (
          <div key={l.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
            <LevelBadge level={l.id} />
            <p className="text-base leading-relaxed text-brand-ink">{l.description}</p>
          </div>
        ))}
      </div>
      {adding && (
        <Panel title="Give a new permission">
          <div className="grid gap-4 md:grid-cols-2">
            <select className={fieldClass} value={draft.resourceId} onChange={(e) => setDraft({ ...draft, resourceId: e.target.value })} aria-label="Resource">
              <option value="">Who?</option>
              {state.resources.filter((r) => r.category !== "founder").map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <input className={fieldClass} placeholder="What may they do? Example: Write emails" value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value })} aria-label="Action" />
            <input className={fieldClass} placeholder="For what? Example: Client emails only" value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} aria-label="Scope" />
            <select className={fieldClass} value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as AuthLevel })} aria-label="How much may they do?">
              {AUTH_LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <Button
              disabled={!draft.resourceId || !draft.action.trim()}
              onClick={() => {
                const r = state.resources.find((x) => x.id === draft.resourceId)!
                dispatch({
                  type: "PERMISSION_ADD",
                  permission: {
                    resourceId: r.id,
                    action: draft.action.trim(),
                    scope: draft.scope.trim() || "Not specified",
                    functions: r.functions,
                    level: draft.level,
                    conditions: "None",
                    limits: draft.limits || "None",
                    approver: "Founder",
                    duration: "Until revoked",
                    status: "authorized",
                  },
                })
                setDraft({ resourceId: "", action: "", scope: "", level: "prepare", limits: "" })
                setAdding(false)
              }}
            >
              Save permission
            </Button>
          </div>
        </Panel>
      )}
      <ul className="flex flex-col gap-4">
        {state.permissions.map((p) => (
          <li key={p.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-col gap-1">
              <p className="text-xl font-semibold text-brand-ink">{resourceName(state, p.resourceId)}</p>
              <p className="text-lg text-brand-ink">{p.action}</p>
              <p className="text-base text-brand-ink-soft">For: {p.scope}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <LevelBadge level={p.level} />
              <PermissionStatusBadge status={p.status} />
            </div>
            <div className="flex flex-wrap gap-3">
              {p.status === "authorized" ? (
                <button onClick={() => set("suspended", p.id, "Suspended by founder")} className="h-12 rounded-xl border border-border px-5 text-base hover:bg-muted">Pause</button>
              ) : (
                <button onClick={() => set("authorized", p.id, "Authorized by founder")} className="h-12 rounded-xl bg-brand-green px-5 text-base font-semibold text-primary-foreground hover:bg-brand-green-dark">Allow</button>
              )}
              {p.status !== "not_authorized" && (
                <button onClick={() => set("not_authorized", p.id, "Revoked by founder")} className="h-12 rounded-xl px-5 text-base text-brand-coral-dark hover:bg-brand-blush">Take away</button>
              )}
            </div>
            <details className="text-base">
              <summary className="cursor-pointer font-medium text-brand-green-dark">More details</summary>
              <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                <div><dt className="font-semibold">Limits</dt><dd className="text-brand-ink-soft">{p.limits}</dd></div>
                <div><dt className="font-semibold">How long</dt><dd className="text-brand-ink-soft">{p.duration}</dd></div>
                <div><dt className="font-semibold">Number</dt><dd className="text-brand-ink-soft">{p.id}{p.workId && ` · only ${p.workId}`}</dd></div>
              </dl>
            </details>
          </li>
        ))}
      </ul>
    </>
  )
}

export function CoordinatorPage() {
  const { state, clock } = useBoss()
  const perms = state.permissions.filter((p) => p.resourceId === "R-COORD")
  return (
    <>
      <PageHeader
        eyebrow="Central AI Operations Coordinator"
        title="Your AI helper"
        description="It sorts new work, sends it to the right person, and tells you when something is stuck. It only does what you allow. This practice version uses simple rules, not real AI."
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Panel title="Rules your AI helper follows">
            <ul className="flex list-disc flex-col gap-2 pl-6 text-base leading-relaxed text-brand-ink">
              <li>It only works Monday to Thursday, 1:00 to 5:00 PM Eastern.</li>
              <li>It cannot do more than you allow.</li>
              <li>It can suggest who should do a task. You say yes or no.</li>
              <li>It asks you before telling anyone about a change.</li>
              <li>It rests during your free time.</li>
            </ul>
          </Panel>
          <Panel title={`What your AI helper may do (${perms.length})`}>
            <ul className="flex flex-col gap-4">
              {perms.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 text-base">
                  <span className="text-brand-ink">{p.action}</span>
                  <span className="flex gap-2"><LevelBadge level={p.level} /><PermissionStatusBadge status={p.status} /></span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <MoreDetails summary="What my AI helper did lately" defaultOpen>
          <CoordinatorFeed phase={clock.phase} limit={30} />
        </MoreDetails>
      </div>
    </>
  )
}

export function ProfilePage({ which }: { which: "founderProfile" | "businessProfile" }) {
  const { state, dispatch } = useBoss()
  const fields = state[which]
  return (
    <>
      <PageHeader
        eyebrow={which === "founderProfile" ? "Founder Profile" : "Business Profile"}
        title={which === "founderProfile" ? "Tell us about you" : "Tell us about your business"}
        description="Your AI helper reads this to send work to the right place. Your answer saves when you click out of the box."
        actions={<DemoTag />}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={cn("flex flex-col gap-2 rounded-2xl border border-border bg-card p-5", f.multiline && "md:col-span-2")}>
            <span className={labelClass}>{f.label}</span>
            <span className="text-base text-brand-ink-soft">{f.prompt}</span>
            {f.multiline ? (
              <textarea rows={3} className={fieldClass} defaultValue={f.value} onBlur={(e) => dispatch({ type: "PROFILE_UPDATE", which, key: f.key, value: e.target.value })} />
            ) : (
              <input className={fieldClass} defaultValue={f.value} onBlur={(e) => dispatch({ type: "PROFILE_UPDATE", which, key: f.key, value: e.target.value })} />
            )}
          </label>
        ))}
      </div>
    </>
  )
}

const SYSTEM_TYPE: Record<string, string> = {
  all: "All",
  system: "Systems",
  workflow: "Step lists (workflows)",
  sop: "How-to guides (SOPs)",
  automation: "Automatic tools",
}

export function SystemsPage() {
  const { state } = useBoss()
  const [type, setType] = useState("all")
  const list = state.systems.filter((s) => type === "all" || s.type === type)
  return (
    <>
      <PageHeader
        eyebrow="Business Systems & SOPs"
        title="How you do things the same way each time"
        description="Your steps, how-to guides, and tools. Each one has an owner and a date to check it."
        actions={<DemoTag />}
      />
      <div className="flex flex-wrap gap-3">
        {["all", "system", "workflow", "sop", "automation"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={cn("h-12 rounded-full border px-5 text-base", type === t ? "border-brand-ink bg-brand-ink text-primary-foreground" : "border-border bg-card hover:bg-muted")}
          >
            {SYSTEM_TYPE[t]}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nothing recorded yet" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((s) => (
            <article key={s.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-brand-green-dark">{SYSTEM_TYPE[s.type]}</span>
                <FunctionBadge fn={s.fn} />
              </div>
              <h2 className="text-xl font-semibold text-brand-ink">{s.name}</h2>
              <p className="text-base leading-relaxed text-brand-ink-soft">{s.summary}</p>
              <p className="text-base text-brand-ink">
                Owner: {resourceName(state, s.ownerId)} · check on {formatDate(s.reviewDate, { month: "short", day: "numeric" })}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export { formatStamp }
