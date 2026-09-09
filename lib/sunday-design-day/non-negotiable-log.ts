/**
 * Daily Non-Negotiable™ accountability log (Phase 4B.1.5).
 *
 * SESSION-ONLY: captures the member's lightweight end-of-segment response
 * ("Did you honor today's Non-Negotiable™?") for THIS browser session, keyed by
 * date + segment. There is deliberately no scoring, coaching, journaling, or
 * long-term persistence — the response is simply captured for later phases.
 * Cross-device persistence and 28-day trends are Phase 4B.2.
 */

const STORAGE_KEY = "sdd:nn-log:v1"

export type HonorResponse = "yes" | "partial" | "not-yet"

/** Response options, in display order. */
export const HONOR_OPTIONS: { value: HonorResponse; label: string; tone: "green" | "amber" | "rose" }[] = [
  { value: "yes", label: "Yes", tone: "green" },
  { value: "partial", label: "Partially", tone: "amber" },
  { value: "not-yet", label: "Not Yet", tone: "rose" },
]

/** Local calendar day key (YYYY-MM-DD) so responses reset with each new day. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

type LogShape = Record<string, Record<string, HonorResponse>>

function readLog(): LogShape {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LogShape) : {}
  } catch {
    return {}
  }
}

function writeLog(log: LogShape): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  } catch {
    /* storage may be unavailable; session-only is best-effort */
  }
}

/** All of today's segment responses, keyed by segment id. */
export function getTodayResponses(): Record<string, HonorResponse> {
  return readLog()[todayKey()] ?? {}
}

/** Record (or clear) a segment's response for today. */
export function setTodayResponse(segmentId: string, response: HonorResponse): void {
  const log = readLog()
  const key = todayKey()
  const day = { ...(log[key] ?? {}) }
  day[segmentId] = response
  log[key] = day
  writeLog(log)
}
