/**
 * Harmony Lane™ Community — Type Definitions
 * -------------------------------------------
 * Pure types. No React, no framework imports.
 */

// ─── Activity ─────────────────────────────────────────────────────────────────

export type ActivityCategory =
  | "checkin"
  | "win"
  | "highlight"
  | "event"
  | "discussion"

export interface ActivityEntry {
  id: string
  category: ActivityCategory
  memberId?: string
  title: string
  summary: string
  timestamp: string
  /** Optional metadata blob for rendering hints */
  metadata?: Record<string, string>
}

// ─── Check-In ─────────────────────────────────────────────────────────────────

export type CheckInType =
  | "morning-routine"
  | "focus-block"
  | "time-freedom"
  | "executive-review"

export interface CheckIn {
  id: string
  type: CheckInType
  date: string          // YYYY-MM-DD
  reflectionNote?: string
  timestamp: string
}

// ─── Founder Win ──────────────────────────────────────────────────────────────

export type WinCategory =
  | "harmony-week"
  | "streak"
  | "score-increase"
  | "time-freedom"
  | "co-working"
  | "milestone"

export interface FounderWin {
  id: string
  title: string
  description: string
  category: WinCategory
  date: string          // YYYY-MM-DD
  timestamp: string
  isCelebrated: boolean
}

// ─── Discussion ───────────────────────────────────────────────────────────────

export interface Discussion {
  id: string
  space: string
  title: string
  pinnedResource?: { label: string; href: string }
  replyCount: number
  lastActivityAt: string   // relative label, e.g. "2 hours ago"
  accentColor: string
}

// ─── Accountability Group ─────────────────────────────────────────────────────

export interface AccountabilityGroup {
  id: string
  name: string
  description: string
  memberCount: number
  upcomingSession?: string
  recentActivity?: string
  accentColor: string
}

// ─── Member Profile ───────────────────────────────────────────────────────────

export interface MemberProfile {
  id: string
  firstName: string
  business?: string
  industry?: string
  harmonyPhase?: string
  joinedSince: string    // e.g. "March 2024"
  favoriteActivity?: string
  inDirectory: boolean
  accentColor: string
}

// ─── Challenge ────────────────────────────────────────────────────────────────

export interface Challenge {
  id: string
  title: string
  description: string
  /** 0–100 */
  progress: number
  participants: number
  daysRemaining: number
  isCompleted: boolean
  accentColor: string
}

// ─── Community Store ──────────────────────────────────────────────────────────

export interface CommunityStore {
  checkIns: CheckIn[]
  wins: FounderWin[]
  /** ISO date of the last check-in, for streak/deduplication */
  lastCheckInDate: string | null
  lastUpdatedAt: string | null
}
