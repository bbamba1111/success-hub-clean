/**
 * What Must Happen Today™ — Hourly Work Store
 * ---------------------------------------------------------------------------
 * The founder's OWN four-hour work plan for the protected CEO Workday™. Each
 * of the four hour blocks holds a founder-written work statement ("what must
 * happen during this hour?") plus a generated My Work Affirmation™.
 *
 * This is NOT the GPS execution queue (todays-work-store.ts) and NOT an
 * assignment system — it is the founder's declaration of how they intend to
 * use their four protected hours. GPS reads these statements only as context.
 *
 * Client-side localStorage, keyed to today's date so the plan persists across
 * refresh / navigation / re-entering the CEO Workday, but a new day starts a
 * fresh plan. One plan per founder per date. Mirrors todays-work-store.ts.
 *
 * Key: "hl:ceo-workday:hourly-work:v1"
 */

import type { HourBlockIndex } from "./hour-blocks"

const STORAGE_KEY = "hl:ceo-workday:hourly-work:v1"

/** Fired on window after any change so live listeners (panel + check-ins) refresh. */
export const HOURLY_WORK_EVENT = "hl:ceo-workday:hourly-work:changed"

export interface HourlyWorkEntry {
  /** The founder's own statement of what must happen during this hour. */
  work: string
  /** The generated My Work Affirmation™ for this hour (empty until created). */
  affirmation: string
  /** ISO timestamp of when the affirmation was last generated. */
  affirmationBuiltAt: string | null
}

export type HourlyWorkMap = Record<HourBlockIndex, HourlyWorkEntry>

interface HourlyWorkFile {
  date: string
  hours: HourlyWorkMap
}

const HOUR_INDEXES: readonly HourBlockIndex[] = [1, 2, 3, 4]

export function emptyHourlyWorkEntry(): HourlyWorkEntry {
  return { work: "", affirmation: "", affirmationBuiltAt: null }
}

export function emptyHourlyWorkMap(): HourlyWorkMap {
  return {
    1: emptyHourlyWorkEntry(),
    2: emptyHourlyWorkEntry(),
    3: emptyHourlyWorkEntry(),
    4: emptyHourlyWorkEntry(),
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function normalize(hours: Partial<HourlyWorkMap> | undefined): HourlyWorkMap {
  const base = emptyHourlyWorkMap()
  if (!hours) return base
  for (const i of HOUR_INDEXES) {
    const entry = hours[i]
    if (entry) {
      base[i] = {
        work: typeof entry.work === "string" ? entry.work : "",
        affirmation: typeof entry.affirmation === "string" ? entry.affirmation : "",
        affirmationBuiltAt: entry.affirmationBuiltAt ?? null,
      }
    }
  }
  return base
}

function readFile(): HourlyWorkFile {
  if (typeof window === "undefined") return { date: todayIso(), hours: emptyHourlyWorkMap() }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: todayIso(), hours: emptyHourlyWorkMap() }
    const parsed = JSON.parse(raw) as HourlyWorkFile
    // A new day starts a fresh plan — yesterday's four hours don't carry over.
    if (parsed.date !== todayIso()) return { date: todayIso(), hours: emptyHourlyWorkMap() }
    return { date: parsed.date, hours: normalize(parsed.hours) }
  } catch (error) {
    console.error("[HourlyWork] Error reading plan:", error)
    return { date: todayIso(), hours: emptyHourlyWorkMap() }
  }
}

function writeFile(file: HourlyWorkFile): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(file))
    window.dispatchEvent(new CustomEvent(HOURLY_WORK_EVENT))
  } catch (error) {
    console.error("[HourlyWork] Error saving plan:", error)
  }
}

/** Today's four hourly work entries — never null, so callers need no fallback. */
export function getHourlyWork(): HourlyWorkMap {
  return readFile().hours
}

/** Persist the founder's work statement for a given hour. */
export function setHourWork(index: HourBlockIndex, work: string): void {
  const file = readFile()
  file.date = todayIso()
  file.hours[index] = { ...file.hours[index], work }
  writeFile(file)
}

/** Persist a generated affirmation for a given hour. */
export function setHourAffirmation(index: HourBlockIndex, affirmation: string): void {
  const file = readFile()
  file.date = todayIso()
  file.hours[index] = {
    ...file.hours[index],
    affirmation,
    affirmationBuiltAt: affirmation ? new Date().toISOString() : null,
  }
  writeFile(file)
}
