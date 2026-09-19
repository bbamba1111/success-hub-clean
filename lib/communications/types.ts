// Communicate + Delegate™ — one lightweight tool the founder opens while she is
// working (or from a weekly commitment). She picks WHAT she needs to do, the
// system carries the context she already decided, and Harmony writes a concise
// first-person message she edits and uses. The saved record is the SOURCE
// message: one approved communication, many possible deliveries later.
//
//   COMMUNICATION (source)  →  DELIVERIES (copy / email / pdf / doc / print … channels later)

/** What the founder needs to do. Drives the lightweight flow. */
export type CommunicationType =
  | "communicate"
  | "notify"
  | "inform"
  | "delegate"
  | "boundary"
  | "ask"
  | "operating-rule"
  | "other"

export const COMMUNICATION_TYPE_LABEL: Record<CommunicationType, string> = {
  communicate: "Communicate",
  notify: "Notify / Update",
  inform: "Inform",
  delegate: "Delegate",
  boundary: "Set a boundary",
  ask: "Ask for something",
  "operating-rule": "Create an operating rule",
  other: "Other",
}

/** The order shown in "What do you need to do?" */
export const COMMUNICATION_TYPES: CommunicationType[] = [
  "communicate",
  "notify",
  "inform",
  "delegate",
  "boundary",
  "ask",
  "operating-rule",
  "other",
]

/** Which weekly decision (if any) this communication executes. */
export type CommitmentType = "life" | "operating-rule" | "delegation" | "none"

/** Where the founder opened the tool from. */
export type SourceContext = "decide-design" | "ceo-workday" | "other"

export type Audience =
  | "family"
  | "partner"
  | "team"
  | "clients"
  | "partners"
  | "stakeholders"
  | "community"
  | "other"

export const AUDIENCE_LABEL: Record<Audience, string> = {
  family: "Family",
  partner: "Partner",
  team: "Team",
  clients: "Client",
  partners: "Partner org",
  stakeholders: "Stakeholders",
  community: "Community",
  other: "Other",
}

export const AUDIENCES: Audience[] = [
  "family",
  "partner",
  "team",
  "clients",
  "partners",
  "stakeholders",
  "community",
  "other",
]

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

/** Context-appropriate timing choices (section 4 of the spec). */
export const TIMING_OPTIONS = [
  "Today",
  "After 5 PM",
  "Friday",
  "Saturday",
  "Sunday",
  "Monday–Thursday",
  "During the 1–5 PM CEO Workday™",
] as const

/** Structured per-flow extras kept in the `details` jsonb column. */
export interface DelegationDetails {
  owner?: string // who will own it
  doneLooksLike?: string // what "done" means
  authority?: string // optional authority to act
}
export interface RuleDetails {
  appliesTo?: string // who the rule applies to
  whenTriggered?: string // what should happen when triggered
}
export interface CommunicationDetails {
  delegation?: DelegationDetails
  rule?: RuleDetails
}

export interface CommunicationRecord {
  id: string
  commitmentId: string | null
  commitmentType: CommitmentType
  commitmentText: string
  communicationType: CommunicationType
  sourceContext: SourceContext
  workItemId: string | null
  planId: string | null
  audience: Audience[]
  audienceOther: string | null
  timing: string | null
  /** The thing itself in her words: the rule, the boundary, the hand-off, the ask. */
  subjectText: string | null
  /** "What do you want them to know?" */
  messageIntent: string | null
  /** "What do you want to happen?" — optional desired outcome. */
  desiredOutcome: string | null
  tone: Tone
  details: CommunicationDetails
  /** The AI's first draft — kept as the source of truth for future adaptation. */
  sourceSubject: string | null
  sourceBody: string | null
  /** The founder-approved message. */
  approvedSubject: string | null
  approvedBody: string | null
  finalFormat: CommunicationFormat | null
  status: CommunicationStatus
  createdAt: string
  updatedAt: string
}

export interface DraftRequest {
  communicationType: CommunicationType
  commitmentType: CommitmentType
  /** The rule / boundary / hand-off / topic in the founder's words. */
  subjectText: string
  audience: Audience[]
  audienceOther?: string | null
  timing?: string | null
  messageIntent?: string | null
  desiredOutcome?: string | null
  tone: Tone
  details?: CommunicationDetails
  /** The founder's identity statement for today, for voice only. */
  identity?: string | null
}

export interface DraftResponse {
  subject: string
  body: string
}
