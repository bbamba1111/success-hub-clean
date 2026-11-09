"use client"

import { useState, useTransition } from "react"
import { revokePreauthorization } from "@/app/actions/boss-authority"
import {
  ACTION_KINDS,
  JOB_FUNCTIONS,
  labelFor,
  preauthorizationActive,
  type Job,
  type Preauthorization,
} from "@/lib/boss/jobs/definitions"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })
}

function inactiveReason(p: Preauthorization) {
  if (p.revokedAt) return `Withdrawn ${formatDate(p.revokedAt)}`
  if (p.maxUses !== null && p.uses >= p.maxUses) return "All uses spent"
  return `Ended ${formatDate(p.expiresAt)}`
}

export function PreauthorizationList({ preauthorizations, jobs }: { preauthorizations: Preauthorization[]; jobs: Job[] }) {
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const jobTitle = new Map(jobs.map((j) => [j.id, j.title]))
  const active = preauthorizations.filter(preauthorizationActive)
  const inactive = preauthorizations.filter((p) => !preauthorizationActive(p))

  function scope(p: Preauthorization) {
    if (p.jobId) return `Job: ${jobTitle.get(p.jobId) ?? "a job"}`
    return `All ${labelFor(JOB_FUNCTIONS, p.businessFunction)} jobs`
  }

  function withdraw(id: string) {
    setPendingId(id)
    startTransition(async () => {
      const result = await revokePreauthorization(id)
      setError(result.ok ? null : result.error)
      setPendingId(null)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="active-limits" className="flex flex-col gap-3">
        <h3 id="active-limits" className="text-base font-semibold text-brand-ink">
          Active ({active.length})
        </h3>
        {active.length === 0 ? (
          <p className="text-base leading-relaxed text-brand-ink-soft">
            No limits are active. Every suggestion from Cherry Blossom™ and your executives waits for your OK.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((p) => (
              <li
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-base font-medium text-brand-ink">
                    {p.actionKinds.map((k) => labelFor(ACTION_KINDS, k)).join(", ")}
                  </p>
                  <p className="text-sm leading-relaxed text-brand-ink-soft">
                    {scope(p)} · until {formatDate(p.expiresAt)}
                    {p.maxUses ? ` · ${p.uses} of ${p.maxUses} used` : ` · ${p.uses} used`}
                  </p>
                  {p.note && <p className="text-sm leading-relaxed text-brand-ink-soft">Note: {p.note}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => withdraw(p.id)}
                  disabled={pendingId !== null}
                  className="inline-flex h-10 items-center self-start rounded-lg border border-border px-4 text-sm font-medium text-brand-ink hover:bg-muted disabled:opacity-60 md:self-auto"
                >
                  {pendingId === p.id ? "Withdrawing…" : "Withdraw"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {inactive.length > 0 && (
        <details className="flex flex-col gap-3">
          <summary className="cursor-pointer text-base font-semibold text-brand-ink">
            No longer active ({inactive.length})
          </summary>
          <ul className="mt-3 flex flex-col gap-2">
            {inactive.map((p) => (
              <li key={p.id} className="flex flex-col gap-1 rounded-xl bg-muted p-4">
                <p className="text-base text-brand-ink">{p.actionKinds.map((k) => labelFor(ACTION_KINDS, k)).join(", ")}</p>
                <p className="text-sm leading-relaxed text-brand-ink-soft">
                  {scope(p)} · {inactiveReason(p)} · {p.uses} used
                </p>
              </li>
            ))}
          </ul>
        </details>
      )}

      {error && (
        <p role="alert" className="text-base text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
