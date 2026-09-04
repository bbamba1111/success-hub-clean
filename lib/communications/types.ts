// Communicate My Change™ / Communicate My Boundary™ — one lightweight builder,
// two entry points. A communication is tied to the founder's existing weekly
// commitment; several communications (team, family, client) can share one rule.
// DECIDE → DESIGN → COMMUNICATE → IMPLEMENT.

export type CommitmentType = "life" | "operating-rule"

export type Audience = "family" | "partner" | "team" | "clients" | "partners" | "stakeholders" | "other"

export const AUDIENCE_LABEL: Record<Audience, string> = {
  family: "Family",
  partner: "Partner",
  team: "Team",
  clients: "Clients",
  partners: "Partners",
  stakeholders: "Stakeholders",
  other: "Other",
}

export const AUDIENCES: Audience[] = ["family", "partner", "team", "clients", "partners", "stakeholders", "other"]

export type Tone = "warm" | "clear-direct" | "professional" | "collaborative"

export const TONE_LABEL: Record<Tone, string> = {
  warm: "Warm",
  "clear-direct": "Clear & Direct",
  professional: "Professional",
  collaborative: "Collaborative",
}

export const TONES: Tone[] = ["warm", "clear-direct", "professional", "collaborative"]

export type CommunicationStatus = "draft" | "approved" | "used"

export type CommunicationFormat = "copy" | "email" | "pdf" | "google-doc" | "print"

export const TIMING_OPTIONS = [
  "After 5 PM",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday–Thursday",
  "During the 1–5 PM CEO Workday™",
] as const

export interface CommitmentCommunication {
  id: string
  weeklyCommitmentId: string
  commitmentType: CommitmentType
  commitmentText: string
  audience: Audience[]
  audienceOther: string | null
  timing: string | null
  desiredOutcome: string | null
  tone: Tone
  generatedSubject: string | null
  generatedBody: string | null
  finalSubject: string | null
  finalBody: string | null
  finalFormat: CommunicationFormat | null
  status: CommunicationStatus
  createdAt: string
  updatedAt: string
}

export interface DraftRequest {
  commitmentType: CommitmentType
  commitmentText: string
  audience: Audience[]
  audienceOther?: string | null
  timing?: string | null
  desiredOutcome?: string | null
  tone: Tone
  /** The founder's identity statement for today, when available. */
  identity?: string | null
}

export interface DraftResponse {
  subject: string
  body: string
}
