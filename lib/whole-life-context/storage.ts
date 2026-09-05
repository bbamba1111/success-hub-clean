/**
 * Whole-Life Context™ — Storage Layer (Phase 6.1)
 * ---------------------------------------------------------------------------
 * Client-side localStorage persistence for the Whole-Life Context™ registry.
 *
 * Keys are namespaced under "harmony." to avoid collisions. Each domain
 * (relationships, events, commitments, goals) is stored independently so a
 * future Supabase migration can replace one at a time without refactoring
 * consumers.
 *
 * All functions are safe to call during SSR — they check for `window` before
 * accessing localStorage.
 */

import type {
  RelationshipPerson,
  LifeEvent,
  LifeCommitment,
  PersonalGoal,
  FounderProfile,
  WholeLifeContext,
  ProactiveSignal,
} from "./types"
import { EMPTY_WHOLE_LIFE_CONTEXT } from "./types"

/* ---------------------------------------------------------------------------
 * Storage keys
 * ------------------------------------------------------------------------ */
const KEYS = {
  profile: "harmony.founder.profile",
  relationships: "harmony.whole-life.relationships",
  lifeEvents: "harmony.whole-life.life-events",
  lifeCommitments: "harmony.whole-life.life-commitments",
  personalGoals: "harmony.whole-life.personal-goals",
  proactiveSignals: "harmony.whole-life.proactive-signals",
} as const

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded — fail silently.
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch {
    // Fail silently.
  }
}

/* ---------------------------------------------------------------------------
 * Founder Profile™
 * ------------------------------------------------------------------------ */
export function getFounderProfile(): FounderProfile | null {
  return read<FounderProfile | null>(KEYS.profile, null)
}

export function saveFounderProfile(profile: FounderProfile): void {
  write(KEYS.profile, { ...profile, updatedAt: new Date().toISOString() })
}

export function clearFounderProfile(): void {
  remove(KEYS.profile)
}

/* ---------------------------------------------------------------------------
 * Relationship Intelligence™
 * ------------------------------------------------------------------------ */
export function getRelationships(): RelationshipPerson[] {
  return read<RelationshipPerson[]>(KEYS.relationships, [])
}

export function saveRelationships(people: RelationshipPerson[]): void {
  write(KEYS.relationships, people)
}

export function upsertRelationship(person: RelationshipPerson): void {
  const current = getRelationships()
  const idx = current.findIndex((p) => p.id === person.id)
  const updated = idx >= 0
    ? current.map((p, i) => (i === idx ? { ...person, updatedAt: new Date().toISOString() } : p))
    : [...current, { ...person, updatedAt: new Date().toISOString() }]
  saveRelationships(updated)
}

export function removeRelationship(id: string): void {
  saveRelationships(getRelationships().filter((p) => p.id !== id))
}

/* ---------------------------------------------------------------------------
 * Life Events™
 * ------------------------------------------------------------------------ */
export function getLifeEvents(): LifeEvent[] {
  return read<LifeEvent[]>(KEYS.lifeEvents, [])
}

export function saveLifeEvents(events: LifeEvent[]): void {
  write(KEYS.lifeEvents, events)
}

export function upsertLifeEvent(event: LifeEvent): void {
  const current = getLifeEvents()
  const idx = current.findIndex((e) => e.id === event.id)
  const updated = idx >= 0
    ? current.map((e, i) => (i === idx ? { ...event, updatedAt: new Date().toISOString() } : e))
    : [...current, { ...event, updatedAt: new Date().toISOString(), createdAt: event.createdAt ?? new Date().toISOString() }]
  saveLifeEvents(updated)
}

export function removeLifeEvent(id: string): void {
  saveLifeEvents(getLifeEvents().filter((e) => e.id !== id))
}

/**
 * Returns events whose awareness window has started but the event hasn't
 * passed yet. Suitable for Cherry Blossom™'s proactive awareness surface.
 */
export function getUpcomingLifeEvents(withinDays = 30): LifeEvent[] {
  const now = new Date()
  const cutoff = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000)
  return getLifeEvents()
    .filter((e) => {
      const eventDate = new Date(e.date)
      const awarenessDays = e.awarenessWindowDays ?? 7
      const awarenessStart = new Date(eventDate.getTime() - awarenessDays * 24 * 60 * 60 * 1000)
      return awarenessStart <= cutoff && eventDate >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/* ---------------------------------------------------------------------------
 * Life Commitments™
 * ------------------------------------------------------------------------ */
export function getLifeCommitments(): LifeCommitment[] {
  return read<LifeCommitment[]>(KEYS.lifeCommitments, [])
}

export function saveLifeCommitments(commitments: LifeCommitment[]): void {
  write(KEYS.lifeCommitments, commitments)
}

export function upsertLifeCommitment(commitment: LifeCommitment): void {
  const current = getLifeCommitments()
  const idx = current.findIndex((c) => c.id === commitment.id)
  const updated = idx >= 0
    ? current.map((c, i) => (i === idx ? { ...commitment, updatedAt: new Date().toISOString() } : c))
    : [...current, { ...commitment, updatedAt: new Date().toISOString(), createdAt: commitment.createdAt ?? new Date().toISOString() }]
  saveLifeCommitments(updated)
}

export function removeLifeCommitment(id: string): void {
  saveLifeCommitments(getLifeCommitments().filter((c) => c.id !== id))
}

/** Returns only active (non-paused) commitments. */
export function getActiveLifeCommitments(): LifeCommitment[] {
  return getLifeCommitments().filter((c) => c.isActive)
}

/** Returns active Non-Negotiable™ commitments. */
export function getNonNegotiableCommitments(): LifeCommitment[] {
  return getActiveLifeCommitments().filter((c) => c.isNonNegotiable)
}

/* ---------------------------------------------------------------------------
 * Personal Goals™
 * ------------------------------------------------------------------------ */
export function getPersonalGoals(): PersonalGoal[] {
  return read<PersonalGoal[]>(KEYS.personalGoals, [])
}

export function savePersonalGoals(goals: PersonalGoal[]): void {
  write(KEYS.personalGoals, goals)
}

export function upsertPersonalGoal(goal: PersonalGoal): void {
  const current = getPersonalGoals()
  const idx = current.findIndex((g) => g.id === goal.id)
  const updated = idx >= 0
    ? current.map((g, i) => (i === idx ? { ...goal, updatedAt: new Date().toISOString() } : g))
    : [...current, { ...goal, updatedAt: new Date().toISOString(), createdAt: goal.createdAt ?? new Date().toISOString() }]
  savePersonalGoals(updated)
}

export function removePersonalGoal(id: string): void {
  savePersonalGoals(getPersonalGoals().filter((g) => g.id !== id))
}

/** Returns currently active personal goals. */
export function getActivePersonalGoals(): PersonalGoal[] {
  return getPersonalGoals().filter((g) => g.status === "active")
}

/* ---------------------------------------------------------------------------
 * Proactive Signals™
 * Architecture only — no generation or delivery logic this phase.
 * ------------------------------------------------------------------------ */
export function getProactiveSignals(): ProactiveSignal[] {
  return read<ProactiveSignal[]>(KEYS.proactiveSignals, [])
}

export function saveProactiveSignals(signals: ProactiveSignal[]): void {
  write(KEYS.proactiveSignals, signals)
}

/* ---------------------------------------------------------------------------
 * Full context read
 * ------------------------------------------------------------------------ */
/** Load the complete Whole-Life Context™ snapshot from localStorage. */
export function getWholeLifeContext(): WholeLifeContext {
  if (typeof window === "undefined") return EMPTY_WHOLE_LIFE_CONTEXT
  return {
    profile: getFounderProfile(),
    relationships: getRelationships(),
    lifeEvents: getLifeEvents(),
    lifeCommitments: getLifeCommitments(),
    personalGoals: getPersonalGoals(),
  }
}

/** Clear all Whole-Life Context™ data — useful for testing / logout. */
export function clearWholeLifeContext(): void {
  Object.values(KEYS).forEach(remove)
}
