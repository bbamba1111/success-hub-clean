/**
 * Founder Memory™ — Types (Phase 16.0)
 * ---------------------------------------------------------------------------
 * Pure TypeScript. No React, no DOM, no Next.js.
 */

// ─── Memory Category ──────────────────────────────────────────────────────────

export type MemoryCategory =
  | "milestone"    // major achievement (installation complete, first review, etc.)
  | "win"          // GPS recommendation completed
  | "reflection"   // founder wrote a reflection
  | "decision"     // founder made a significant operating decision
  | "community"    // attended a live event or co-working session
  | "review"       // generated an executive review
  | "celebration"  // explicit celebration moment (streak, score band achieved)

// ─── Harmony Phase Reference ──────────────────────────────────────────────────

export interface HarmonyPhaseRef {
  /** Part-of-day label at time of recording. */
  part: string
  /** Human block name, e.g. "CEO Workday™" */
  blockTitle: string
}

// ─── Founder Memory ───────────────────────────────────────────────────────────

export interface FounderMemory {
  /** Stable id — used for upsert deduplication. */
  id: string
  category: MemoryCategory
  /** Short headline for the card. */
  title: string
  /** 1–2 sentence context. */
  summary: string
  /** ISO YYYY-MM-DD */
  date: string
  /** ISO timestamp — for ordering. */
  timestamp: string
  /** Cherry Blossom's personal reflection on this memory (optional). */
  cherryBlossomReflection?: string
  /** Harmony Score™ at time of recording (0–100), if available. */
  harmonyScore?: number
  /** Harmony Phase context at time of recording. */
  harmonyPhase?: HarmonyPhaseRef
  /** Optional CTA to surface on the card. */
  ctaLabel?: string
  ctaHref?: string
  /** Any extra key/value data the recording source wants to attach. */
  metadata?: Record<string, string | number | boolean>
}

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface FounderMemoryStoreShape {
  memories: FounderMemory[]
  /** ISO timestamp of last write, or null if empty. */
  lastUpdatedAt: string | null
}

// ─── Pattern Recognition ──────────────────────────────────────────────────────

export type InsightTrend = "up" | "flat" | "down"

export interface FounderInsight {
  id: string
  label: string
  description: string
  trend: InsightTrend
  /** Raw data points that produced this insight. */
  dataPoints: number
  /** Optional Lucide icon name. */
  icon?: string
}

// ─── Concierge Context ────────────────────────────────────────────────────────

export interface ConciergeContext {
  latestMilestone: FounderMemory | null
  recentWins: FounderMemory[]
  /** Current streak from GPS history. */
  streakInfo: { days: number; label: string }
  communityPattern: string | null
  scorePattern: string | null
  /**
   * Pre-generated coaching note string Cherry Blossom can inject verbatim
   * into her opening message, referencing the founder's history.
   */
  coachingNote: string
}
