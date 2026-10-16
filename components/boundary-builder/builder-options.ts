/**
 * Presentation-only option sets for the Weekly Work-Life Balance Boundary
 * Builder™. These are contextual multiple-choice prompts (Step 1 "what are we
 * protecting?") surfaced alongside the Boundary Library™ intelligence — they
 * are NOT user data and NOT a new assessment.
 */

import type { BoundaryFamilyId } from "@/lib/boundary-library/types"

export interface ProtectionOption {
  id: string
  label: string
}

/** Baseline protection choices relevant to almost any boundary. */
const BASE_PROTECTION: ProtectionOption[] = [
  { id: "no-routine-after", label: "No routine business activity after the boundary" },
  { id: "no-business-comms", label: "No business communication" },
  { id: "no-meetings", label: "No meetings" },
  { id: "no-founder-availability", label: "No founder availability" },
  { id: "no-routine-decisions", label: "No routine decision requests" },
  { id: "protected-family", label: "Protected family / relationship time" },
  { id: "protected-recovery", label: "Protected recovery time" },
]

/** Family-specific protections layered on top of the base set. */
const FAMILY_PROTECTION: Partial<Record<BoundaryFamilyId, ProtectionOption[]>> = {
  focus: [
    { id: "protected-deep-work", label: "Protected deep, uninterrupted focus" },
    { id: "no-interruptions", label: "No interruptions or context-switching" },
  ],
  "recovery-human": [
    { id: "protected-sleep", label: "Protected sleep & restoration" },
    { id: "protected-health", label: "Protected health & movement time" },
  ],
  client: [
    { id: "no-client-access", label: "No direct client access to the founder" },
    { id: "contained-scope", label: "Contained client scope" },
  ],
  "decision-ownership": [{ id: "decisions-owned-elsewhere", label: "Routine decisions owned by someone else" }],
  meetings: [{ id: "no-unqualified-meetings", label: "No meetings that don't earn one" }],
  communication: [{ id: "defined-comms-window", label: "Communication only in a defined window" }],
  availability: [{ id: "defined-availability", label: "Availability only in defined hours" }],
}

export function protectionOptionsForFamily(family: BoundaryFamilyId | null): ProtectionOption[] {
  const extra = family ? (FAMILY_PROTECTION[family] ?? []) : []
  // De-dupe by id, family-specific first so they read as the most relevant.
  const seen = new Set<string>()
  return [...extra, ...BASE_PROTECTION].filter((o) => (seen.has(o.id) ? false : (seen.add(o.id), true)))
}

/** §26 — the one-continuous-process spine, shown as a subtle progress legend. */
export const BUILDER_STEP_META: { step: number; label: string; question: string }[] = [
  { step: 1, label: "Work-Life Balance Boundary™", question: "What exactly are we protecting?" },
  { step: 2, label: "Business Requirement", question: "What does the business need to change to hold this?" },
  { step: 3, label: "Operating Rule", question: "What will the business do differently?" },
  { step: 4, label: "Implementation", question: "What has to happen to make this rule real?" },
  { step: 5, label: "Escalation & Exceptions", question: "What happens when the boundary can't be followed?" },
  { step: 6, label: "Communicate It™", question: "Tell the people this affects." },
  { step: 7, label: "Stakeholder Alignment", question: "Get the people aligned." },
  { step: 8, label: "Human SOS™", question: "Make it a Human Sustainability Operating Standard™." },
]
