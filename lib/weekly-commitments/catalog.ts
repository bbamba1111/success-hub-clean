/**
 * Founder-facing option catalogs for the three weekly priorities.
 * Deliberately small — "Do not overwhelm the founder with a giant list."
 * Every list ends in "Create my own" in the UI.
 */

import type { BbaBaselineRecord } from "@/lib/business-bottleneck-audit/types"

export interface PriorityOption {
  id: string
  label: string
  /** Lower-case phrase that reads naturally inside a first-person sentence. */
  phrase: string
}

export const LIFE_PRIORITY_OPTIONS: PriorityOption[] = [
  { id: "family", label: "Family", phrase: "my family" },
  { id: "partner", label: "Partner / Relationship", phrase: "my relationship" },
  { id: "friends", label: "Friends", phrase: "time with friends" },
  { id: "rest", label: "Rest", phrase: "real rest" },
  { id: "movement", label: "Movement / Health", phrase: "my health and movement" },
  { id: "recreation", label: "Recreation", phrase: "recreation" },
  { id: "personal-project", label: "Personal project", phrase: "a personal project" },
  { id: "spiritual", label: "Spiritual time", phrase: "spiritual time" },
  { id: "home", label: "Home", phrase: "my home" },
  { id: "community", label: "Community", phrase: "my community" },
  { id: "travel", label: "Travel", phrase: "travel" },
  { id: "creativity", label: "Creativity", phrase: "my creativity" },
]

export const DELEGATION_OPTIONS: PriorityOption[] = [
  { id: "scheduling", label: "Scheduling", phrase: "scheduling" },
  { id: "client-follow-up", label: "Routine client follow-up", phrase: "routine client follow-up" },
  { id: "social-media", label: "Social media", phrase: "social media" },
  { id: "admin", label: "Administrative work", phrase: "administrative work" },
  { id: "customer-support", label: "Customer support", phrase: "customer support" },
  { id: "reporting", label: "Reporting", phrase: "reporting" },
  { id: "bookkeeping", label: "Bookkeeping", phrase: "bookkeeping" },
  { id: "project-coordination", label: "Project coordination", phrase: "project coordination" },
]

export const OPERATING_RULE_OPTIONS: PriorityOption[] = [
  {
    id: "no-meetings-ceo-workday",
    label: "No meetings during my protected CEO Workday™",
    phrase: "no meetings during my protected CEO Workday™",
  },
  {
    id: "one-channel",
    label: "Routine team questions use one communication channel",
    phrase: "one channel for routine team questions",
  },
  { id: "comms-end-5", label: "Business communication ends at 5 PM", phrase: "business communication ending at 5 PM" },
  {
    id: "revision-rounds",
    label: "Client revisions are limited to defined rounds",
    phrase: "defined revision rounds for client work",
  },
  {
    id: "routine-decisions",
    label: "Routine decisions do not require founder approval",
    phrase: "routine decisions moving forward without my approval",
  },
  {
    id: "meeting-standard",
    label: "Meetings require an agenda, owner, and outcome",
    phrase: "an agenda, owner, and outcome for every meeting",
  },
  { id: "friday-protected", label: "Friday is protected as non-working time", phrase: "Friday as protected non-working time" },
]

/* ── Delegation suggestions from the founder's own audit ─────────────────── */

/**
 * Hats the founder said they are wearing in the Business Bottleneck Audit™,
 * mapped to plain delegation opportunities. No scores, no diagnostic language —
 * just "We noticed a few opportunities. Which one would make the biggest difference?"
 */
const HAT_TO_DELEGATION: Record<string, PriorityOption> = {
  scheduling: DELEGATION_OPTIONS[0],
  "customer-service": DELEGATION_OPTIONS[4],
  "customer-success": DELEGATION_OPTIONS[1],
  "social-media": DELEGATION_OPTIONS[2],
  "administrative-work": DELEGATION_OPTIONS[3],
  "finance-bookkeeping": DELEGATION_OPTIONS[6],
  "project-management": DELEGATION_OPTIONS[7],
  "content-creation": { id: "content-production", label: "Content production", phrase: "content production" },
  "hiring-recruiting": { id: "hiring-logistics", label: "Hiring logistics", phrase: "hiring logistics" },
  "technology-it": { id: "tech-setup", label: "Technology setup and support", phrase: "technology setup and support" },
  "purchasing-vendors": { id: "vendor-coordination", label: "Vendor coordination", phrase: "vendor coordination" },
  "human-resources": { id: "hr-admin", label: "HR administration", phrase: "HR administration" },
  "legal-compliance": { id: "compliance-paperwork", label: "Compliance paperwork", phrase: "compliance paperwork" },
}

export function suggestDelegationFromBba(baseline: BbaBaselineRecord | null): PriorityOption[] {
  if (!baseline) return []
  const worn = baseline.responses["founder.hatsWorn"]
  const list = Array.isArray(worn) ? (worn as string[]) : []
  const seen = new Set<string>()
  const out: PriorityOption[] = []
  for (const hat of list) {
    const opt = HAT_TO_DELEGATION[hat]
    if (opt && !seen.has(opt.id)) {
      seen.add(opt.id)
      out.push(opt)
    }
    if (out.length >= 4) break
  }
  return out
}

/** Turn free text into a phrase that sits naturally inside a sentence. */
export function toPhrase(label: string): string {
  const t = label.trim().replace(/[.!]+$/, "")
  if (!t) return t
  // Keep proper nouns / trademarks as typed; only soften a leading capital on an ordinary word.
  const first = t[0]
  const rest = t.slice(1)
  const looksProper = /^[A-Z][a-z]+\s+[A-Z]/.test(t) || /™/.test(t)
  return looksProper ? t : first.toLowerCase() + rest
}
