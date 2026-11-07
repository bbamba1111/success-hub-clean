"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import {
  acceptNewerVersion,
  getSaveProblems,
  getServerSaveProblems,
  hasUnsavedDayState,
  keepMyVersion,
  retryFailedSaves,
  subscribeSaveProblems,
  type DayStateKind,
} from "@/lib/ceo-workday/day-state-sync"

const KIND_LABEL: Record<DayStateKind, string> = {
  todays_work: "Today's Work™",
  hourly_work: "What Must Happen Today™ statements",
  hour_overrides: "hour assignments",
}

// Several CEO Workday™ components mount this; only the first renders it.
let activeOwner: symbol | null = null

/**
 * Appears only when a workday change could not be saved to the founder's
 * account, or another device saved a newer version first. Otherwise renders
 * nothing, so the CEO Workday™ looks exactly as before.
 */
export function DayStateSaveNotice() {
  const problems = useSyncExternalStore(subscribeSaveProblems, getSaveProblems, getServerSaveProblems)
  const [owner] = useState(() => Symbol("save-notice"))
  const [isOwner, setIsOwner] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (activeOwner === null) activeOwner = owner
    setIsOwner(activeOwner === owner)
    return () => {
      if (activeOwner === owner) activeOwner = null
    }
  }, [owner])

  useEffect(() => {
    if (!isOwner) return
    const warn = (e: BeforeUnloadEvent) => {
      if (!hasUnsavedDayState()) return
      e.preventDefault()
      e.returnValue = ""
    }
    const retry = () => void retryFailedSaves()
    window.addEventListener("beforeunload", warn)
    window.addEventListener("online", retry)
    const interval = window.setInterval(retry, 30_000)
    return () => {
      window.removeEventListener("beforeunload", warn)
      window.removeEventListener("online", retry)
      window.clearInterval(interval)
    }
  }, [isOwner])

  if (!isOwner || problems.length === 0) return null

  const run = async (fn: () => Promise<void> | void) => {
    setBusy(true)
    try {
      await fn()
    } finally {
      setBusy(false)
    }
  }

  const conflicts = problems.filter((p) => p.type === "conflict")
  const failed = problems.filter((p) => p.type === "failed")
  const signedOut = failed.some((p) => p.type === "failed" && p.signedOut)

  return (
    <div
      role="alert"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg flex-col gap-3 rounded-xl border border-[#C4707B]/40 bg-card p-4 text-card-foreground shadow-lg"
    >
      {conflicts.map((p) => (
        <div key={p.key} className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-pretty">
            <span className="font-semibold">Your {KIND_LABEL[p.entry.kind]} changed on another device</span> since this
            page loaded. Your edits here have not been saved. Which version should we keep?
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => acceptNewerVersion(p.key))}
              className="rounded-lg bg-[#C4707B] px-3 py-1.5 text-sm font-medium text-card disabled:opacity-60"
            >
              Load the newer version
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => keepMyVersion(p.key))}
              className="rounded-lg border border-[#C4707B]/50 px-3 py-1.5 text-sm font-medium text-[#6B5860] disabled:opacity-60"
            >
              Keep my edits and replace it
            </button>
          </div>
        </div>
      ))}
      {failed.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm leading-relaxed text-pretty">
            <span className="font-semibold">Some workday changes haven&apos;t saved to your account yet.</span>{" "}
            {signedOut
              ? "You appear to be signed out. Sign in again and they will save automatically."
              : "They are kept on this device and we'll keep retrying."}
          </p>
          <div>
            <button
              type="button"
              disabled={busy}
              onClick={() => run(retryFailedSaves)}
              className="rounded-lg bg-[#C4707B] px-3 py-1.5 text-sm font-medium text-card disabled:opacity-60"
            >
              {busy ? "Saving…" : "Retry now"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
