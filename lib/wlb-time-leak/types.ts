/**
 * Work-Life Balance Time-Leak Check™ — Types
 * ---------------------------------------------------------------------------
 * A distinct onboarding diagnostic that answers "why is work taking too much
 * of my life?" — separate from the Business Bottleneck Audit (preserved) and
 * the Work-Life Balance Audit™ (the measurement instrument). Persisted
 * Supabase-first in wlb_time_leak_checks, mirroring the BBA storage pattern.
 */

/** The seven question ids, in presentation order. */
export type TimeLeakQuestionId =
  | "spillover" // Q1 — where work spills into life (multi)
  | "overwork-shape" // Q2 — what overworking looks like (multi)
  | "pull-back" // Q3 — what keeps pulling you back (multi)
  | "primary-driver" // Q4 — the ONE biggest source (single, from Q3 options)
  | "hat-load" // Q5 — Founder Hat Load™ roles carried (multi, grouped)
  | "life-impact" // Q6 — Life Impact Map™ (multi, mirrors WBA 15 areas)
  | "solution-match" // Q7 — what would help (multi, max 3, grouped)

/**
 * Raw answers keyed by question id. Every multi-select stores an array of
 * option ids; the single-select primary driver stores one option id.
 */
export interface TimeLeakResponses {
  spillover?: string[]
  "overwork-shape"?: string[]
  "pull-back"?: string[]
  "primary-driver"?: string | null
  "hat-load"?: string[]
  "life-impact"?: string[]
  "solution-match"?: string[]
}

/** Persisted record shape (client + server share this). */
export interface TimeLeakRecord {
  version: number
  responses: TimeLeakResponses
  primaryDriver: string | null
  otherText: Record<string, string>
  completedAt: string | null
}

/** A selectable option. */
export interface TimeLeakOption {
  id: string
  label: string
}

/** A grouped block of options (used by Q5 Hat Load and Q7 Solution Match). */
export interface TimeLeakGroup {
  id: string
  label: string
  options: TimeLeakOption[]
}
