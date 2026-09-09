import type { WeeklyCommitments } from "./types"
import { LIFE_PRIORITY_OPTIONS, DELEGATION_OPTIONS, OPERATING_RULE_OPTIONS, toPhrase } from "./catalog"
import { buildLifeIntention, buildDelegationIntention, buildOperatingRuleIntention } from "./intention-builder"

/**
 * My 4-Hour CEO Workday Declaration™
 *
 * Weaves the three Weekly Priorities™ chosen in Decide & Design™ into one
 * first-person declaration the founder reads at the top of every live
 * CEO Workday™ this week. Same builder pattern as the Movement and Lunch
 * declarations: generated from choices, cycled through variants, editable.
 *
 * Voice rules: first person, present tense, plain language. It names what
 * the four hours are FOR and what they are protected FROM — it is not a
 * task list and never mentions tools, frameworks, or systems.
 */

/** First sentence only, no trailing period — each intention contributes one clean line. */
const strip = (s: string) => {
  const first = s.trim().split(/(?<=[.!?])\s+/)[0] ?? s
  // The declaration already frames the week; drop each intention's own "This week," lead-in.
  const unframed = first.trim().replace(/^this week,?\s+/i, "")
  const cased = unframed.charAt(0).toUpperCase() + unframed.slice(1)
  return cased.replace(/[.!?\s]+$/, "")
}

/** The founder's saved intention (edited or generated); regenerated from the phrase if missing. */
function intentionFor(c: WeeklyCommitments, kind: "life" | "delegation" | "operating-rule"): string | null {
  if (kind === "life") {
    if (c.lifeIntention?.trim()) return strip(c.lifeIntention)
    if (!c.lifePriority) return null
    const phrase = LIFE_PRIORITY_OPTIONS.find((o) => o.id === c.lifePriorityOptionId)?.phrase ?? toPhrase(c.lifePriority)
    return strip(buildLifeIntention(phrase, c.lifeIntentionVariant))
  }
  if (kind === "delegation") {
    if (c.delegationIntention?.trim()) return strip(c.delegationIntention)
    if (!c.delegationPriority) return null
    const phrase = DELEGATION_OPTIONS.find((o) => o.id === c.delegationOptionId)?.phrase ?? toPhrase(c.delegationPriority)
    return strip(buildDelegationIntention(phrase, c.delegationIntentionVariant))
  }
  if (c.operatingRuleIntention?.trim()) return strip(c.operatingRuleIntention)
  if (!c.operatingRule) return null
  const phrase = OPERATING_RULE_OPTIONS.find((o) => o.id === c.operatingRuleOptionId)?.phrase ?? toPhrase(c.operatingRule)
  return strip(buildOperatingRuleIntention(phrase, c.operatingRuleIntentionVariant))
}

/** Lowercase the leading word for mid-sentence use — but "I" stays "I". */
function lower(s: string) {
  if (/^I(\s|'|’)/.test(s)) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function hasEnoughForDeclaration(c: WeeklyCommitments): boolean {
  return Boolean(c.lifePriority || c.delegationPriority || c.operatingRule)
}

export const WORKDAY_DECLARATION_VARIANT_COUNT = 3

export function buildWorkdayDeclaration(c: WeeklyCommitments, variant = 0): string | null {
  const life = intentionFor(c, "life")
  const delegation = intentionFor(c, "delegation")
  const rule = intentionFor(c, "operating-rule")
  if (!life && !delegation && !rule) return null

  const v = ((variant % WORKDAY_DECLARATION_VARIANT_COUNT) + WORKDAY_DECLARATION_VARIANT_COUNT) % WORKDAY_DECLARATION_VARIANT_COUNT
  const lines: string[] = []

  if (v === 0) {
    lines.push("For the next four hours, I am the CEO of my business — not its busiest employee.")
    if (rule) lines.push(`${rule}.`)
    if (delegation) lines.push(`${delegation}, so my attention goes to the work only I can do.`)
    if (life) lines.push(`When these four hours end, they end — because ${lower(life)}.`)
    lines.push("This is my workday. It is enough.")
  } else if (v === 1) {
    lines.push("These four hours are protected, and I decide what they hold.")
    if (delegation) lines.push(`${delegation}.`)
    if (rule) lines.push(`${rule}.`)
    if (life) lines.push(`I stop on time, because ${lower(life)}.`)
    lines.push("I lead the business. The business does not lead me.")
  } else {
    lines.push("I am choosing, not reacting.")
    if (rule) lines.push(`Today ${lower(rule)}.`)
    if (delegation) lines.push(`${delegation} — it is no longer mine to carry.`)
    if (life) lines.push(`${life}, and my workday is built to make room for it.`)
    lines.push("Four focused hours. Then I close the laptop and live my life.")
  }

  return lines.join(" ")
}
