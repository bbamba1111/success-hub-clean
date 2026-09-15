/**
 * Business Articulation Training™ — shared types.
 *
 * A "version" is an ORDERED array of blocks, not a flat string. This is the
 * single source of truth rendered by the teleprompter, the print view, and
 * the memorization scaffold — no duplicate content representations.
 */

export type ArticulationBlockType =
  | "spoken"
  | "pause"
  | "statistic"
  | "evidence"
  | "quote"
  | "story"
  | "example"
  | "question"
  | "audience-interaction"
  | "transition"
  | "emphasis"
  | "objection-response"
  | "call-to-action"
  | "ask"

export const ARTICULATION_BLOCK_LABELS: Record<ArticulationBlockType, string> = {
  spoken: "Spoken line",
  pause: "Pause",
  statistic: "Statistic",
  evidence: "Evidence",
  quote: "Quote",
  story: "Story",
  example: "Example",
  question: "Question",
  "audience-interaction": "Audience interaction",
  transition: "Transition",
  emphasis: "Emphasis",
  "objection-response": "Objection response",
  "call-to-action": "Call to action",
  ask: "The ask",
}

export interface ArticulationBlock {
  id: string
  type: ArticulationBlockType
  content: string
  source: "ai" | "founder"
  rationale?: string
}

export interface ArticulationVersion {
  id: string
  name: string
  approach: "direct" | "story-led" | "problem-led"
  blocks: ArticulationBlock[]
}

export interface ArticulationUnderstanding {
  coreIdea: string
  objective: string
  audienceSummary: string
  keyClaims: string[]
  assumptions: string[]
}

export interface ArticulationStrengthenSuggestion {
  id: string
  what: string
  where: string
  why: string
  blockType: ArticulationBlockType
  insertAfterBlockId: string | null
  content: string
}

export const ARTICULATION_PURPOSES = [
  "Explain",
  "Teach",
  "Persuade",
  "Debate",
  "Rebut",
  "Negotiate",
  "Pitch",
  "Ask for the sale",
  "Propose",
  "Announce",
  "Inspire",
  "Present",
  "Tell a story",
  "Lead a conversation",
] as const
export type ArticulationPurpose = (typeof ARTICULATION_PURPOSES)[number]

export const ARTICULATION_AUDIENCES = [
  "A customer",
  "A prospect",
  "An investor",
  "A team member",
  "A new hire",
  "A partner or vendor",
  "The public / media",
  "A room of peers",
  "A skeptical stakeholder",
  "Myself (rehearsal only)",
] as const
export type ArticulationAudience = (typeof ARTICULATION_AUDIENCES)[number]

export interface DurationPreset {
  id: string
  label: string
  seconds: number
}

export const ARTICULATION_DURATION_PRESETS: DurationPreset[] = [
  { id: "30s", label: "30 seconds", seconds: 30 },
  { id: "1m", label: "1 minute", seconds: 60 },
  { id: "2m", label: "2 minutes", seconds: 120 },
  { id: "5m", label: "5 minutes", seconds: 300 },
]

export interface RehearsalLock {
  versionId: string
  style: string
  audience: ArticulationAudience
  purpose: ArticulationPurpose
  durationSeconds: number
}

export type MemorizationLevel = "full" | "key-phrases" | "cue-card" | "structure-only" | "no-script"

export const MEMORIZATION_LEVELS: { id: MemorizationLevel; label: string }[] = [
  { id: "full", label: "Full script" },
  { id: "key-phrases", label: "Key phrases" },
  { id: "cue-card", label: "Cue card" },
  { id: "structure-only", label: "Structure only" },
  { id: "no-script", label: "No script" },
]
