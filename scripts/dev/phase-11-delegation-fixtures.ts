/**
 * Phase 11 fixtures — Delegation Execution™ activation.
 * ---------------------------------------------------------------------------
 * Exercises the 3 new mutators (`setDelegateAssignee`, `markDelegateBriefed`,
 * `markHandoffAccepted`) against the EXISTING `DelegateExecution` fields
 * (`assignedTo`, `briefedAt`, `handoffAcceptedAt`) — no new fields, no new
 * persistence model. Matches the lettered-scenario convention of
 * `phase-10-fixtures.ts`. Run with: npx tsx scripts/dev/phase-11-delegation-fixtures.ts
 */

import type { BuildBlueprint } from "@/lib/build-strategy/types"
import {
  deriveBuildRecord,
  setDelegateAssignee,
  markDelegateBriefed,
  markHandoffAccepted,
  setExecutor,
} from "@/lib/build-record/build-record-engine"

let pass = 0
let fail = 0

function check(label: string, condition: boolean) {
  if (condition) {
    pass++
    console.log(`  ✓ ${label}`)
  } else {
    fail++
    console.log(`  ✗ FAIL: ${label}`)
  }
}

function makeDelegateBlueprint(): BuildBlueprint {
  return {
    recommendationId: "start-pricing-clarity",
    buildPath: "delegate",
    generatedAt: new Date().toISOString(),
    what: "Client onboarding follow-up",
    why: "Prospects go cold without a follow-up owner.",
    whyNow: "New clients are being onboarded without a consistent follow-up.",
    desiredOutcome: "Client onboarding follow-up is owned by Client Success Lead.",
    currentState: "Founder does follow-up personally, inconsistently.",
    targetState: "A named owner handles every onboarding follow-up.",
    ownerSummary: "Client Success Lead owns this once briefed and accepted.",
    owner: "founder",
    businessModelArchetype: "unknown",
    businessModelAdaptationNote: "No Business Model Profile™ signal yet.",
    prerequisites: [],
    unlocksCapabilities: [],
    budgetEstimate: "not yet determined",
    timelineEstimate: "not yet determined",
    targetCompletionDate: "not yet determined",
    handoffReady: false,
    evidence: [],
    triggeredBy: [],
    stageFraming: "current-stage",
    detail: {
      kind: "delegate",
      suggestedOwnerRole: "Client Success Lead",
      handoffDefinitionOfDone: "Every new client gets a follow-up within 48 hours.",
      briefingPoints: ["Follow up within 48 hours", "Use the onboarding checklist"],
    },
  }
}

console.log("\n[A-C] deriveBuildRecord — delegate execution starts honestly empty\n")

{
  const record = deriveBuildRecord(makeDelegateBlueprint())
  check("[A] execution.kind is \"delegate\"", record.execution.kind === "delegate")
  check(
    "[B] assignedTo/briefedAt/handoffAcceptedAt all start null",
    record.execution.kind === "delegate" &&
      record.execution.assignedTo === null &&
      record.execution.briefedAt === null &&
      record.execution.handoffAcceptedAt === null,
  )
  check("[C] activity log has the initial path-selection entry only", record.activityLog.length === 1)
}

console.log("\n[D-G] setDelegateAssignee — founder-entered name/role, never invented\n")

{
  let record = deriveBuildRecord(makeDelegateBlueprint())
  record = setDelegateAssignee(record, "Client Success Lead")
  check(
    "[D] assignedTo is saved verbatim",
    record.execution.kind === "delegate" && record.execution.assignedTo === "Client Success Lead",
  )
  check("[E] an activity log entry is appended for the assignment", record.activityLog.some((e) => e.label.includes("Assigned to: Client Success Lead")))

  record = setDelegateAssignee(record, "   ")
  check(
    "[F] blank input clears the assignee (trimmed to null), matching setExecutor's convention",
    record.execution.kind === "delegate" && record.execution.assignedTo === null,
  )

  const nonDelegateRecord = deriveBuildRecord({ ...makeDelegateBlueprint(), buildPath: "founder-build", detail: { kind: "build-steps", coBuildFraming: false, steps: [] } })
  const untouched = setDelegateAssignee(nonDelegateRecord, "Someone")
  check("[G] setDelegateAssignee is a no-op on a non-delegate record", untouched === nonDelegateRecord)
}

console.log("\n[H-K] markDelegateBriefed — gated on an assignee already existing\n")

{
  let record = deriveBuildRecord(makeDelegateBlueprint())
  const beforeAssignee = markDelegateBriefed(record)
  check(
    "[H] cannot mark briefed before an assignee is set (no-op)",
    beforeAssignee.execution.kind === "delegate" && beforeAssignee.execution.briefedAt === null,
  )

  record = setDelegateAssignee(record, "Client Success Lead")
  record = markDelegateBriefed(record)
  check("[I] briefedAt is stamped once an assignee exists", record.execution.kind === "delegate" && record.execution.briefedAt !== null)

  const firstBriefedAt = record.execution.kind === "delegate" ? record.execution.briefedAt : null
  record = markDelegateBriefed(record)
  check(
    "[J] marking briefed again does not overwrite the original timestamp",
    record.execution.kind === "delegate" && record.execution.briefedAt === firstBriefedAt,
  )

  check("[K] briefing appends an activity log entry", record.activityLog.some((e) => e.label.includes("Briefed: Client Success Lead")))
}

console.log("\n[L-O] markHandoffAccepted — gated on already being briefed\n")

{
  let record = deriveBuildRecord(makeDelegateBlueprint())
  record = setDelegateAssignee(record, "Client Success Lead")
  const beforeBriefed = markHandoffAccepted(record)
  check(
    "[L] cannot accept handoff before briefed (no-op)",
    beforeBriefed.execution.kind === "delegate" && beforeBriefed.execution.handoffAcceptedAt === null,
  )

  record = markDelegateBriefed(record)
  record = markHandoffAccepted(record)
  check(
    "[M] handoffAcceptedAt is stamped once briefed",
    record.execution.kind === "delegate" && record.execution.handoffAcceptedAt !== null,
  )

  const firstAcceptedAt = record.execution.kind === "delegate" ? record.execution.handoffAcceptedAt : null
  record = markHandoffAccepted(record)
  check(
    "[N] marking accepted again does not overwrite the original timestamp",
    record.execution.kind === "delegate" && record.execution.handoffAcceptedAt === firstAcceptedAt,
  )

  check("[O] accepting the handoff appends an activity log entry", record.activityLog.some((e) => e.label.includes("Handoff accepted: Client Success Lead")))
}

console.log("\n[P-Q] Full path preserves unrelated state\n")

{
  let record = deriveBuildRecord(makeDelegateBlueprint())
  record = setExecutor(record, "Client Success Lead")
  const statusBefore = record.status
  record = setDelegateAssignee(record, "Client Success Lead")
  record = markDelegateBriefed(record)
  record = markHandoffAccepted(record)
  check("[P] status is untouched by the delegation mutators", record.status === statusBefore)
  check("[Q] unrelated executor field is preserved", record.executor === "Client Success Lead")
}

console.log(`\n${pass} passed, ${fail} failed\n`)
if (fail > 0) process.exit(1)
