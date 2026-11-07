"use client"

import { useState, useTransition } from "react"
import { grantPreauthorization, revokePreauthorization } from "@/app/actions/boss-authority"
import {
  ACTION_KINDS,
  JOB_FUNCTIONS,
  labelFor,
  preauthorizationActive,
  type Job,
  type Preauthorization,
} from "@/lib/boss/jobs/definitions"
import { fieldClass } from "@/components/boss/primitives"

const button =
  "inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-brand-ink hover:bg-muted disabled:opacity-60"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })
}

export function PreauthorizationPanel({ job, preauthorizations }: { job: Job; preauthorizations: Preauthorization[] }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const relevant = preauthorizations.filter(
    (p) => p.jobId === job.id || (p.jobId === null && p.businessFunction === job.businessFunction),
  )
  const active = relevant.filter(preauthorizationActive)
  const usable = job.permissionLevel === "preauthorized_execution"

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action()
      setError(result.ok ? null : (result.error ?? "Something went wrong."))
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-medium text-brand-ink">Pre-approved limits</p>
      {!usable && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          These only take effect when this job is set to &ldquo;Do within limits&rdquo;. Until then, everything waits for
          your OK.
        </p>
      )}

      {active.length === 0 ? (
        <p className="text-sm text-muted-foreground">No limits are active for this job.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {active.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 rounded-lg bg-muted p-3 md:flex-row md:items-center md:justify-between">
              <span className="text-sm leading-relaxed text-brand-ink">
                {p.actionKinds.map((k) => labelFor(ACTION_KINDS, k)).join(", ")} ·{" "}
                {p.jobId ? "this job" : `all ${labelFor(JOB_FUNCTIONS, p.businessFunction)} jobs`} · until{" "}
                {formatDate(p.expiresAt)}
                {p.maxUses ? ` · ${p.uses} of ${p.maxUses} used` : ""}
              </span>
              <button type="button" className={button} disabled={pending} onClick={() => run(() => revokePreauthorization(p.id))}>
                Withdraw
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="flex flex-col gap-3"
        action={(fd) =>
          run(() =>
            grantPreauthorization({
              jobId: fd.get("scope") === "job" ? job.id : null,
              businessFunction: fd.get("scope") === "area" ? job.businessFunction : null,
              actionKinds: fd.getAll("kinds").map(String),
              days: Number(fd.get("days")),
              maxUses: fd.get("maxUses") ? Number(fd.get("maxUses")) : null,
              note: String(fd.get("note") ?? ""),
            }),
          )
        }
      >
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-brand-ink">May do without asking</legend>
          {ACTION_KINDS.map((k) => (
            <label key={k.key} className="flex items-center gap-2 text-sm text-brand-ink">
              <input type="checkbox" name="kinds" value={k.key} className="h-4 w-4" />
              {k.label}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-ink">
            Covers
            <select name="scope" defaultValue="job" className={`${fieldClass} h-10 w-auto text-sm`}>
              <option value="job">This job only</option>
              <option value="area">All {labelFor(JOB_FUNCTIONS, job.businessFunction)} jobs</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-ink">
            For how many days
            <input name="days" type="number" min={1} max={90} defaultValue={7} required className={`${fieldClass} h-10 w-28 text-sm`} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-ink">
            Most times (optional)
            <input name="maxUses" type="number" min={1} max={1000} className={`${fieldClass} h-10 w-28 text-sm`} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-brand-ink">
          Note (optional)
          <input name="note" maxLength={1000} className={`${fieldClass} h-10 text-sm`} />
        </label>
        <button type="submit" className={`${button} self-start`} disabled={pending}>
          Save limits
        </button>
      </form>

      {error && (
        <p role="alert" className="text-base text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
