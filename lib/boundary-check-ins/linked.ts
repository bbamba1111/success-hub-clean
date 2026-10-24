import type { BoundaryCheckIn } from "./server"

/** Whether the member explicitly linked this check-in to the given boundary. */
export function isLinkedTo(c: BoundaryCheckIn, optionId: string | null | undefined, text?: string | null) {
  if (!c.linkedBoundaryOptionId && !c.linkedBoundaryText) return false
  if (optionId && optionId !== "custom") return c.linkedBoundaryOptionId === optionId
  if (text && c.linkedBoundaryText) return c.linkedBoundaryText.trim().toLowerCase() === text.trim().toLowerCase()
  return false
}

/** Actual saved collision labels from check-ins explicitly linked to a boundary. */
export function linkedCollisionLabels(
  checkIns: BoundaryCheckIn[],
  optionId: string | null | undefined,
  text?: string | null,
): string[] {
  const labels = new Set<string>()
  for (const c of checkIns) {
    if (!isLinkedTo(c, optionId, text)) continue
    for (const col of c.collisions) if (col.id !== "nothing-collided") labels.add(col.label)
  }
  return Array.from(labels)
}

/** Local YYYY-MM-DD for an ISO timestamp. */
export function isoToDateKey(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function addDaysKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number)
  const dt = new Date(y, m - 1, d + days)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`
}

/** Workflow week (1–4) derived from calendar dates only. */
export function workflowWeek(cycleStart: string | null, today = new Date()): 1 | 2 | 3 | 4 | null {
  if (!cycleStart) return null
  const start = new Date(cycleStart)
  if (Number.isNaN(start.getTime())) return null
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const elapsed = Math.floor((todayDay - startDay) / 86_400_000)
  if (elapsed < 0) return null
  return Math.min(4, Math.floor(elapsed / 7) + 1) as 1 | 2 | 3 | 4
}
