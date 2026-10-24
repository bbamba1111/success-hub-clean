/**
 * Boundary Check-In™ collision lists. Business & Workplace Reality™ reuses the
 * existing Reality Check requirement options verbatim (all 19, same ids and
 * definitions) so collisions line up with the Boundary Report.
 */

import { REQUIREMENT_OPTIONS } from "@/lib/boundary-report/business-intelligence"

export type CollisionSource = "business" | "personal" | "schedule"

export interface CollisionOption {
  id: string
  label: string
  hint: string
}

export interface CollisionGroup {
  source: CollisionSource
  title: string
  options: CollisionOption[]
}

export interface SelectedCollision {
  id: string
  label: string
  source: CollisionSource
}

const PERSONAL_OPTIONS: CollisionOption[] = [
  { id: "family-interruptions", label: "Family interruptions", hint: "Partners, children, or housemates needed you during protected time." },
  { id: "caregiving-demands", label: "Caregiving demands", hint: "Caring for children, parents, or others pulled you away." },
  { id: "friends-social-calls", label: "Friends & social calls", hint: "Calls, texts, or visits from friends broke into the segment." },
  { id: "household-demands", label: "Household demands", hint: "Chores, deliveries, or errands competed with the boundary." },
  { id: "workspace-boundaries", label: "Workspace boundaries", hint: "No clear separation between your workspace and living space." },
  { id: "personal-appointments", label: "Personal appointments", hint: "An appointment landed inside this segment." },
  { id: "energy-recovery", label: "Energy & recovery", hint: "Low energy, rest, or recovery needs changed what was possible." },
  { id: "isolation-loneliness", label: "Isolation & loneliness", hint: "Working alone made it harder to hold the boundary." },
  { id: "personal-habits", label: "Personal habits", hint: "A habit, such as checking your phone, pulled you off the boundary." },
]

const SCHEDULE_OPTIONS: CollisionOption[] = [
  { id: "segment-started-late", label: "Segment started late", hint: "This segment began later than planned." },
  { id: "segment-ran-over", label: "Segment ran over", hint: "This segment went past its planned end time." },
  { id: "previous-segment-overran", label: "Previous segment overran", hint: "Earlier work spilled into this segment." },
  { id: "segment-skipped", label: "Segment was skipped or shortened", hint: "The segment didn't happen as designed." },
  { id: "boundary-not-communicated", label: "Boundary wasn't communicated", hint: "The people affected didn't know about the boundary yet." },
  { id: "rule-unclear", label: "Rule was unclear", hint: "It wasn't clear what the boundary allowed or didn't allow." },
  { id: "nothing-collided", label: "Nothing collided", hint: "The boundary and schedule held as designed." },
  { id: "something-else", label: "Something else", hint: "Describe it in the note below." },
]

export const COLLISION_GROUPS: CollisionGroup[] = [
  {
    source: "business",
    title: "Business & Workplace Reality™",
    options: REQUIREMENT_OPTIONS.map((o) => ({ id: o.id, label: o.label, hint: o.hint })),
  },
  { source: "personal", title: "Personal & Work-From-Home Reality™", options: PERSONAL_OPTIONS },
  { source: "schedule", title: "Boundary & Schedule Collisions", options: SCHEDULE_OPTIONS },
]

export const COLLISION_SOURCE_LABEL: Record<CollisionSource, string> = {
  business: "Business & Workplace",
  personal: "Personal & Work-From-Home",
  schedule: "Boundary & Schedule",
}
