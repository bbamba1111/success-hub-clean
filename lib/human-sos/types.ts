/**
 * Human SOS™ (Human Sustainability Operating Standard™) — types.
 *
 * ONE operational boundary per (founder, week). This is the single record the
 * Weekly Work-Life Balance Boundary Builder™ writes as the founder moves the
 * week's single Boundary Focus™ through the full operationalization process:
 *
 *   Boundary Focus™ → Work-Life Balance Boundary™ → Business Requirement →
 *   Operating Rule → Implementation → Escalation & Exceptions →
 *   Communicate It™ → Stakeholder Alignment → Training/Q&A/Follow-Up → Human SOS™
 *
 * The Boundary Library™ (lib/boundary-library) is the intelligence/content
 * layer these stages read from. Only user data lives here (Supabase, RLS).
 */

import type { BusinessRequirementId, TrainingRequirementId } from "@/lib/boundary-library/types"

export type HumanSosStatus = "building" | "ready" | "active" | "archived"

/** Response / alignment model shared with Communicate It™. Silence is not approval. */
export type StakeholderResponseState = "thumbs-up" | "thumbs-down" | "question" | "pending"
export type StakeholderResolutionStatus = "none" | "open" | "resolved"
export type ResponseSla = "same-day" | "24h" | "48h" | "custom"

/** Step 4 — an implementation requirement made actionable. */
export interface ImplementationItem {
  id: string
  label: string
  owner: string
  deadline: string
  status: "not-started" | "in-progress" | "done"
}

/** Step 8 — training / Q&A / follow-up made actionable. */
export interface TrainingItem {
  id: TrainingRequirementId | string
  label: string
  owner: string
  date: string
  deadline: string
  status: "not-started" | "scheduled" | "done"
}

/** Step 5 — escalation path. */
export interface EscalationData {
  level1: string
  backup: string
  level2: string
  founderEscalation: string
  trigger: string
  channel: string
  responseExpectation: string
  founderThreshold: string
}

/** Step 5 — exception rule (what qualifies / what explicitly does not). */
export interface ExceptionsData {
  exceptionIds: string[]
  notExceptionIds: string[]
  customExceptions: string[]
}

/** Step 6 — snapshot of what was handed to Communicate It™. */
export interface CommunicationSnapshot {
  communicated: boolean
  communicatedAt: string | null
  channel?: string | null
  audiences?: string[]
  message?: string | null
}

/** §24 — data the FOLLOWING Monday's Reality Check needs to evaluate the boundary. */
export interface MondayEval {
  held: string
  broke: string
  dependedOnYou: string
  changed: string
  stakeholdersExperienced: string
  lifeExperienced: string
}

/** Step 7 — one record per required stakeholder. */
export interface SosStakeholder {
  id: string
  sosId: string
  name: string
  stakeholderType: string
  role: string
  whatToUnderstand: string
  requiredAction: string
  trainingNeeded: boolean
  meetingNeeded: boolean
  qaNeeded: boolean
  followupNeeded: boolean
  responseSla: ResponseSla
  deadline: string | null
  responseState: StakeholderResponseState
  // ❓ question resolution
  questionText: string | null
  questionOwner: string | null
  questionResponse: string | null
  questionResolutionDeadline: string | null
  questionStatus: StakeholderResolutionStatus
  // 👎 objection resolution
  concern: string | null
  impact: string | null
  requestedChange: string | null
  objectionOwner: string | null
  objectionResolutionDeadline: string | null
  objectionStatus: StakeholderResolutionStatus
  sortOrder: number
  createdAt: string | null
  updatedAt: string | null
}

export interface HumanSos {
  id: string | null
  weekKey: string
  // Step 1
  boundaryFocusText: string
  patternId: string | null
  familyId: string | null
  whatProtecting: string[]
  boundaryStatement: string
  // Step 2
  businessRequirementIds: BusinessRequirementId[]
  // Step 3
  operatingRuleIds: string[]
  operatingRuleText: string
  // Step 4
  implementation: ImplementationItem[]
  // Step 5
  escalation: EscalationData
  exceptions: ExceptionsData
  // Step 6
  communication: CommunicationSnapshot
  // Step 8
  training: TrainingItem[]
  // lifecycle
  status: HumanSosStatus
  currentStep: number
  effectiveDate: string | null
  reviewDate: string | null
  mondayEval: MondayEval
  createdAt: string | null
  updatedAt: string | null
}

export const TOTAL_BUILDER_STEPS = 8

export function emptyEscalation(): EscalationData {
  return {
    level1: "",
    backup: "",
    level2: "",
    founderEscalation: "",
    trigger: "",
    channel: "",
    responseExpectation: "",
    founderThreshold: "",
  }
}

export function emptyExceptions(): ExceptionsData {
  return { exceptionIds: [], notExceptionIds: [], customExceptions: [] }
}

export function emptyMondayEval(): MondayEval {
  return { held: "", broke: "", dependedOnYou: "", changed: "", stakeholdersExperienced: "", lifeExperienced: "" }
}

export function emptyCommunication(): CommunicationSnapshot {
  return { communicated: false, communicatedAt: null, channel: null, audiences: [], message: null }
}

export function emptyHumanSos(weekKey: string, boundaryFocusText = ""): HumanSos {
  return {
    id: null,
    weekKey,
    boundaryFocusText,
    patternId: null,
    familyId: null,
    whatProtecting: [],
    boundaryStatement: "",
    businessRequirementIds: [],
    operatingRuleIds: [],
    operatingRuleText: "",
    implementation: [],
    escalation: emptyEscalation(),
    exceptions: emptyExceptions(),
    communication: emptyCommunication(),
    training: [],
    status: "building",
    currentStep: 1,
    effectiveDate: null,
    reviewDate: null,
    mondayEval: emptyMondayEval(),
    createdAt: null,
    updatedAt: null,
  }
}

export const RESPONSE_SLA_LABEL: Record<ResponseSla, string> = {
  "same-day": "Same day — urgent",
  "24h": "24 hours",
  "48h": "48 hours",
  custom: "Specific date/time",
}

export const RESPONSE_STATE_LABEL: Record<StakeholderResponseState, string> = {
  "thumbs-up": "Understands & supports",
  "thumbs-down": "Cannot support as presented",
  question: "Has a question",
  pending: "No response yet",
}

/**
 * Alignment gate (§20). A required stakeholder is aligned only when they are
 * thumbs-up AND have no unresolved question or objection. Silence (pending) is
 * never approval.
 */
export function isStakeholderAligned(s: SosStakeholder): boolean {
  if (s.responseState !== "thumbs-up") return false
  if (s.questionStatus === "open") return false
  if (s.objectionStatus === "open") return false
  return true
}

export interface AlignmentSummary {
  total: number
  aligned: number
  thumbsUp: number
  thumbsDown: number
  questions: number
  pending: number
  ready: boolean
}

export function summarizeAlignment(stakeholders: SosStakeholder[]): AlignmentSummary {
  const total = stakeholders.length
  const aligned = stakeholders.filter(isStakeholderAligned).length
  const thumbsUp = stakeholders.filter((s) => s.responseState === "thumbs-up").length
  const thumbsDown = stakeholders.filter((s) => s.responseState === "thumbs-down").length
  const questions = stakeholders.filter((s) => s.responseState === "question").length
  const pending = stakeholders.filter((s) => s.responseState === "pending").length
  // Ready only when every required stakeholder is aligned (and at least one exists).
  const ready = total > 0 && aligned === total
  return { total, aligned, thumbsUp, thumbsDown, questions, pending, ready }
}
