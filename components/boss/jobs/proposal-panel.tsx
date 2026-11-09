"use client"

import { useState, useTransition } from "react"
import { decideProposal, retryProposal } from "@/app/actions/boss-authority"
import { ACTION_KINDS, DECISIONS, labelFor, type JobProposal } from "@/lib/boss/jobs/definitions"
import { fieldClass } from "@/components/boss/primitives"

const PROPOSER: Record<string, string> = {
  cherry: "Cherry Blossom™",
  executive: "An executive",
  system: "The system",
}

const STATE_TEXT: Record<JobProposal["status"], string> = {
  pending: "Waiting for your decision",
  waiting: "You asked it to wait",
  approved: "You approved this",
  change_requested: "You asked for a change. A new version will appear here.",
  failed: "This was approved but could not be done",
}

const button =
  "inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-brand-ink hover:bg-muted disabled:opacity-60"

export function ProposalPanel({ proposal }: { proposal: JobProposal }) {
  const [note, setNote] = useState("")
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const canDecide = proposal.status === "pending" || proposal.status === "waiting"
  const canRetry = proposal.status === "approved"

  function run(action: () => Promise<{ ok: boolean; error?: string; message?: string }>) {
    startTransition(async () => {
      const result = await action()
      setMessage(
        result.ok
          ? result.message
            ? { tone: "ok", text: result.message }
            : null
          : { tone: "error", text: result.error ?? "Something went wrong." },
      )
      if (result.ok) setNote("")
    })
  }

  return (
    <section
      aria-label="Proposal waiting for you"
      className="flex flex-col gap-3 rounded-xl border border-brand-green/40 bg-brand-green/5 p-4"
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-brand-ink">
          {PROPOSER[proposal.proposedBy] ?? proposal.proposedBy} proposes · version {proposal.version}
        </p>
        <p className="text-sm text-muted-foreground">
          {labelFor(ACTION_KINDS, proposal.actionKind)} · using {proposal.aiCapability}
        </p>
      </div>
      <p className="whitespace-pre-line text-base leading-relaxed text-brand-ink">{proposal.summary}</p>
      <p className="text-sm font-medium text-brand-ink">{STATE_TEXT[proposal.status]}</p>
      {proposal.error && <p className="text-sm text-destructive">Reason: {proposal.error}</p>}

      {canDecide && (
        <>
          <label htmlFor={`proposal-note-${proposal.id}`} className="text-sm font-medium text-brand-ink">
            Note (optional, saved with your decision)
          </label>
          <textarea
            id={`proposal-note-${proposal.id}`}
            rows={2}
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${fieldClass} h-auto py-3`}
          />
          <div className="flex flex-wrap gap-2">
            {DECISIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                disabled={pending}
                className={button}
                onClick={() => run(() => decideProposal(proposal.id, d.key, proposal.payloadHash, note))}
              >
                {d.label}
              </button>
            ))}
          </div>
        </>
      )}

      {canRetry && (
        <button type="button" disabled={pending} className={`${button} self-start`} onClick={() => run(() => retryProposal(proposal.id))}>
          Try again
        </button>
      )}

      {message && (
        <p role={message.tone === "error" ? "alert" : "status"} className={message.tone === "error" ? "text-base text-destructive" : "text-base text-brand-green-dark"}>
          {message.text}
        </p>
      )}
    </section>
  )
}
