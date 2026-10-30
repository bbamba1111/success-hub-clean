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
        title="The business across five functions"
        description="A read of the whole business. Run the day from My Business Day."
        actions={
          <Button asChild>
            <Link href="/boss">{clock.phase === "workday" ? "Return to CEO Workday" : "Open My Business Day"}</Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Today's plan complete", `${plan.filter((w) => w.status === "completed").length} of ${plan.length}`],
          ["Open assignments", open.length],
          ["Founder decisions waiting", decisions.length],
        ].map(([l, v]) => (
          <div key={l} className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5">
            <span className="font-display text-3xl font-semibold text-brand-ink">{v}</span>
            <span className="text-xs text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {FUNCTIONS.map((f) => {
          const items = open.filter((w) => w.fn === f.id)
          return (
            <Panel key={f.id} title={f.label} description={f.purpose}>
              <dl className="flex flex-col gap-1.5 text-xs">
                {[
                  ["Open", items.length],
                  ["In progress", items.filter((w) => w.status === "in_progress").length],
                  ["Blocked or waiting", items.filter((w) => ["blocked", "awaiting_external", "on_hold"].includes(w.status)).length],
                  ["Needs founder", items.filter((w) => decisions.some((d) => d.id === w.id)).length],
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
      <div className="grid gap-6 lg:grid-cols-2">
        <DecisionsPanel limitToPlan={false} />
        <CoordinatorFeed phase={clock.phase} limit={5} />
      </div>
    </>
  )
}

const STAGES: { id: OpportunityStage; label: string }[] = [
  { id: "researching", label: "Researching" },
  { id: "pitch_preparing", label: "Pitch preparing" },
  { id: "awaiting_founder_approval", label: "Awaiting approval" },
  { id: "outreach_sent", label: "Outreach sent" },
  { id: "response_received", label: "Response received" },
  { id: "closed", label: "Closed" },
]

export function OpportunitiesPage() {
  const { state, dispatch } = useBoss()
  return (
    <>
      <PageHeader
        eyebrow="Business Work Queue · Opportunities"
        title="Visibility & growth opportunities"
        description="Speaking, podcasts, media, partnerships, and Work-Life Balance Week™ invitations. No outreach is sent from this prototype."
        actions={<DemoTag />}
      />
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((s) => {
          const items = state.opportunities.filter((o) => o.stage === s.id)
          return (
            <section key={s.id} aria-label={s.label} className="flex w-72 shrink-0 flex-col gap-3">
              <h2 className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-ink-soft">
                {s.label}
                <span className="rounded-full bg-muted px-2 tabular-nums">{items.length}</span>
              </h2>
              {items.map((o) => (
                <article key={o.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                  <p className="text-sm font-semibold leading-snug text-brand-ink">{o.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.organization} · {o.type.replace(/_/g, " ")} · fit {o.fit}
                  </p>
                  <p className="text-xs leading-relaxed text-brand-ink">Next: {o.nextAction}</p>
                  <p className="text-xs text-muted-foreground">{resourceName(state, o.assigneeId)}</p>
                  {o.approval === "awaiting" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { approval: "approved", stage: "outreach_sent" } })}
                        className="rounded-md bg-brand-green px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-brand-green-dark"
                      >
                        Approve outreach
                      </button>
                      <button
                        onClick={() => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { approval: "declined", stage: "closed", outcome: "Declined by founder" } })}
                        className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-muted"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <select
                      value={o.stage}
                      onChange={(e) => dispatch({ type: "OPPORTUNITY_UPDATE", id: o.id, patch: { stage: e.target.value as OpportunityStage } })}
                      className={cn(fieldClass, "py-1.5 text-xs")}
                      aria-label={`Stage for ${o.name}`}
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
        title="What each resource may do"
        description="Authority is granted per resource, action, scope, and level. Single-task approvals never become standing permissions."
        actions={
          <Button onClick={() => setAdding((a) => !a)}>
            <Plus className="h-4 w-4" aria-hidden />
            Grant permission
          </Button>
        }
      />
      <div className="grid gap-3 md:grid-cols-4">
        {AUTH_LEVELS.map((l) => (
          <div key={l.id} className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
            <LevelBadge level={l.id} />
            <p className="text-xs leading-relaxed text-muted-foreground">{l.description}</p>
          </div>
        ))}
      </div>
      {adding && (
        <Panel title="New permission">
          <div className="grid gap-3 md:grid-cols-5">
            <select className={fieldClass} value={draft.resourceId} onChange={(e) => setDraft({ ...draft, resourceId: e.target.value })} aria-label="Resource">
              <option value="">Choose resource</option>
              {state.resources.filter((r) => r.category !== "founder").map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <input className={fieldClass} placeholder="Action" value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value })} aria-label="Action" />
            <input className={fieldClass} placeholder="Scope" value={draft.scope} onChange={(e) => setDraft({ ...draft, scope: e.target.value })} aria-label="Scope" />
            <select className={fieldClass} value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value as AuthLevel })} aria-label="Level">
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
              Grant
            </Button>
          </div>
        </Panel>
      )}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {["Resource", "Action & scope", "Level", "Limits", "Duration", "Status", ""].map((h) => (
                <th key={h} className="px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {state.permissions.map((p) => (
              <tr key={p.id} className="align-top">
                <td className="px-3 py-3">
                  <p className="font-medium">{resourceName(state, p.resourceId)}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{p.id}{p.workId && ` · only ${p.workId}`}</p>
                </td>
                <td className="max-w-xs px-3 py-3">
                  <p>{p.action}</p>
                  <p className="text-xs text-muted-foreground">{p.scope}</p>
                </td>
                <td className="px-3 py-3"><LevelBadge level={p.level} /></td>
                <td className="px-3 py-3 text-xs">{p.limits}</td>
                <td className="px-3 py-3 text-xs">{p.duration}</td>
                <td className="px-3 py-3"><PermissionStatusBadge status={p.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex gap-1.5">
                    {p.status === "authorized" ? (
                      <button onClick={() => set("suspended", p.id, "Suspended by founder")} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">Suspend</button>
                    ) : (
                      <button onClick={() => set("authorized", p.id, "Authorized by founder")} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">Authorize</button>
                    )}
                    {p.status !== "not_authorized" && (
                      <button onClick={() => set("not_authorized", p.id, "Revoked by founder")} className="rounded-md px-2 py-1 text-xs text-brand-coral-dark hover:bg-brand-blush">Revoke</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        title="The operations layer between you and your workforce"
        description="Classifies, routes, monitors, and escalates business work — always within the authority you grant. Rule-based prototype; no AI model is connected."
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <CoordinatorFeed phase={clock.phase} limit={30} />
        <div className="flex flex-col gap-6">
          <Panel title="Operating boundaries">
            <ul className="flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-brand-ink">
              <li>Advances work only during the CEO Workday, Monday–Thursday 1:00–5:00 PM ET.</li>
              <li>Cannot exceed its own permissions or a resource&apos;s permissions.</li>
              <li>Proposes delegation; the founder accepts or declines.</li>
              <li>Notifications to people require founder authorization.</li>
              <li>Pauses during protected personal time.</li>
            </ul>
          </Panel>
          <Panel title={`Coordinator permissions (${perms.length})`}>
            <ul className="flex flex-col gap-2">
              {perms.map((p) => (
                <li key={p.id} className="flex flex-col gap-1 text-xs">
                  <span className="text-brand-ink">{p.action}</span>
                  <span className="flex gap-2"><LevelBadge level={p.level} /><PermissionStatusBadge status={p.status} /></span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
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
        title={which === "founderProfile" ? "How you lead and decide" : "What the business is and how it works"}
        description="The Coordinator reads this context when classifying and routing work. Changes save as you leave each field."
        actions={<DemoTag />}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={cn("flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4", f.multiline && "md:col-span-2")}>
            <span className={labelClass}>{f.label}</span>
            <span className="text-xs text-muted-foreground">{f.prompt}</span>
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

export function SystemsPage() {
  const { state } = useBoss()
  const [type, setType] = useState("all")
  const list = state.systems.filter((s) => type === "all" || s.type === type)
  return (
    <>
      <PageHeader
        eyebrow="Business Systems & SOPs"
        title="How the business repeatably operates"
        description="Systems, workflows, SOPs, and automations, each with an owner and review date."
        actions={<DemoTag />}
      />
      <div className="flex flex-wrap gap-2">
        {["all", "system", "workflow", "sop", "automation"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            aria-pressed={type === t}
            className={cn("rounded-md border px-3 py-1.5 text-sm capitalize", type === t ? "border-brand-ink bg-brand-ink text-primary-foreground" : "border-border bg-card hover:bg-muted")}
          >
            {t === "sop" ? "SOPs" : t === "all" ? "All" : `${t}s`}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nothing recorded yet" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((s) => (
            <article key={s.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.type}</span>
                <FunctionBadge fn={s.fn} />
                <span className="text-[11px] text-muted-foreground">{s.approval.replace("_", " ")}</span>
              </div>
              <h2 className="font-semibold text-brand-ink">{s.name}</h2>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.summary}</p>
              <p className="text-xs text-brand-ink">
                {resourceName(state, s.ownerId)} · review {formatDate(s.reviewDate, { month: "short", day: "numeric" })}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  )
}

export { formatStamp }
