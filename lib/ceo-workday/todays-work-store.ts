/**
 * Today's Work™ — Storage Layer
 * ---------------------------------------------------------------------------
 * The founder's current execution queue for the protected 4-Hour Focused
 * CEO Workday™. Client-side localStorage, following the exact pattern of
 * business-context-store.ts, keyed to today's date so items persist across
 * refresh but a new day starts a fresh queue. No arbitrary item cap.
 *
 * Key: "hl:ceo-workday:todays-work:v1"
 */

import type { CeoWorkItem, CeoWorkItemStatus, NewCeoWorkItem } from "./types"

const STORAGE_KEY = "hl:ceo-workday:todays-work:v1"

/** Fired on window after any change so live listeners (the queue UI) can refresh. */
export const TODAYS_WORK_EVENT = "hl:ceo-workday:todays-work:changed"

interface TodaysWorkFile {
  date: string
  items: CeoWorkItem[]
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function readFile(): TodaysWorkFile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayIso(), items: [] }
    const parsed = JSON.parse(raw) as TodaysWorkFile
    // A new day starts a fresh queue — yesterday's work doesn't silently
    // carry over and clutter today's container.
    if (parsed.date !== todayIso()) return { date: todayIso(), items: [] }
    return parsed
  } catch (error) {
    console.error("[TodaysWork] Error reading queue:", error)
    return { date: todayIso(), items: [] }
  }
}

function writeFile(file: TodaysWorkFile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(file))
    window.dispatchEvent(new CustomEvent(TODAYS_WORK_EVENT))
  } catch (error) {
    console.error("[TodaysWork] Error saving queue:", error)
  }
}

/** All work items queued for today. Empty array if none yet — never null, so callers don't need a fallback. */
export function getTodaysWork(): CeoWorkItem[] {
  return readFile().items
}

/**
 * Adds a new item to today's queue. No de-duplication by design — the same
 * asset/category can be revisited; callers that care about "don't re-queue
 * an already-completed asset" (BUILD) check that before calling this.
 */
export function addWorkItem(item: NewCeoWorkItem): CeoWorkItem {
  const file = readFile()
  const now = new Date().toISOString()
  const fullItem: CeoWorkItem = {
    ...item,
    id: `work_${now}_${Math.random().toString(36).slice(2, 9)}`,
    workdayDate: item.workdayDate ?? file.date,
    status: item.status ?? "not-started",
    createdAt: now,
    updatedAt: now,
  }
  file.items = [...file.items, fullItem]
  writeFile(file)
  return fullItem
}

export function updateWorkItemStatus(itemId: string, status: CeoWorkItemStatus, outcomeRef?: string): void {
  const file = readFile()
  file.items = file.items.map((item) =>
    item.id === itemId
      ? { ...item, status, outcomeRef: outcomeRef ?? item.outcomeRef, updatedAt: new Date().toISOString() }
      : item,
  )
  writeFile(file)
}

export function removeWorkItem(itemId: string): void {
  const file = readFile()
  file.items = file.items.filter((item) => item.id !== itemId)
  writeFile(file)
}

/** True if a BUILD item for this asset id is already queued today (avoids duplicate queuing on repeat clicks). */
export function hasQueuedAsset(assetId: string): boolean {
  return readFile().items.some((item) => item.category === "BUILD" && item.relatedAssetId === assetId)
}
