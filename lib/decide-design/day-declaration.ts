/**
 * My Day Declaration™ — Decide & Design
 * ---------------------------------------------------------------------------
 * The founder answers "What must happen today?" in her own words (the GPS does
 * not answer for her). "Save My Day" weaves those answers — and, quietly, the
 * week's three priorities — into one first-person declaration, then creates
 * today's CEO Workday™ plan so the work populates inside the live workspace.
 *
 * Pure functions only; no storage here.
 */

import type { WeeklyCommitments } from "@/lib/weekly-commitments/types"

export interface MustHappenItem {
  /** Client id — stable while editing; not persisted. */
  key: string
  /** What must happen, in the founder's words. */
  title: string
  /** How she will know it is done (expected evidence). Optional. */
  done: string
}

export const MAX_MUST_HAPPEN = 3
export const DAY_DECLARATION_VARIANT_COUNT = 3

const clean = (s: string) => s.trim().replace(/[.!?\s]+$/, "")
const lowerFirst = (s: string) => (/^I(\s|'|’)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1))

function joinList(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? ""
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`
}

export function hasEnoughForDay(items: MustHappenItem[]): boolean {
  return items.some((i) => i.title.trim().length > 0)
}

/** Even split of the four hours across what must happen today (minutes). */
export function minutesPerItem(count: number): number {
  if (count <= 0) return 0
  return Math.max(30, Math.round(240 / count / 15) * 15)
}

export function buildDayDeclaration(
  items: MustHappenItem[],
  weekly: WeeklyCommitments | null,
  variant = 0,
  identity?: string | null,
): string {
  const musts = items.map((i) => clean(i.title)).filter(Boolean)
  if (musts.length === 0) return ""
  const v = ((variant % DAY_DECLARATION_VARIANT_COUNT) + DAY_DECLARATION_VARIANT_COUNT) % DAY_DECLARATION_VARIANT_COUNT

  const rule = weekly?.operatingRule ? clean(weekly.operatingRule) : null
  const letGo = weekly?.delegationPriority ? clean(weekly.delegationPriority) : null
  const life = weekly?.lifePriority ? clean(weekly.lifePriority) : null
  const who = identity?.trim() ? clean(identity) : null

  const lines: string[] = []

  if (v === 0) {
    lines.push(
      who ? `Today I am ${lowerFirst(who)}.` : "Today I am the CEO of my business — not its busiest employee.",
    )
    lines.push(
      musts.length === 1
        ? `In my four focused hours, one thing must happen: ${lowerFirst(musts[0])}.`
        : `In my four focused hours, ${musts.length} things must happen: ${joinList(musts.map(lowerFirst))}.`,
    )
    if (rule) lines.push(`I hold this week's rule while I work — ${lowerFirst(rule)}.`)
    if (letGo) lines.push(`${letGo} is not mine to carry today.`)
    lines.push("When the four hours end, they end. This is my day, and it is enough.")
  } else if (v === 1) {
    lines.push(`This is what must happen today: ${joinList(musts.map(lowerFirst))}.`)
    lines.push("Nothing else gets to call itself urgent until these are real.")
    if (who) lines.push(`I do this work as ${lowerFirst(who)}.`)
    if (rule) lines.push(`My operating rule this week stands: ${lowerFirst(rule)}.`)
    if (life) lines.push(`I finish on time because ${lowerFirst(life)} is waiting for me after five.`)
    else lines.push("I finish on time, and I leave the rest for tomorrow's CEO.")
  } else {
    lines.push("I have four hours, and I have decided how to spend them.")
    musts.forEach((m, i) => lines.push(`${i + 1}. ${m}.`))
    if (letGo) lines.push(`I am not touching ${lowerFirst(letGo)} today — it is leaving my plate this week.`)
    if (rule) lines.push(`I work inside this week's rule: ${lowerFirst(rule)}.`)
    lines.push(who ? `I show up as ${lowerFirst(who)}. That is the whole plan.` : "That is the whole plan. It is enough.")
  }

  return lines.join(" ")
}
