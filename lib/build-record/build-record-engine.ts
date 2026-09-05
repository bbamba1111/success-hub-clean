/**
 * Build Record™ engine — deterministic derivation (Phase 10)
 * ---------------------------------------------------------------------------
 * Two pure functions:
 *   - `deriveBuildRecord()`: turns a freshly-chosen Build Blueprint™ into the
 *     initial BuildRecord (status "path-selected", one milestone scaffold
 *     per path, no invented dates).
 *   - `deriveFounderAttention()`: recomputes the 🟢🟡🔴🔵⚪✅ signal from a
 *     record's current status/blockers/tasks — never stored redundantly.
 */

import type { BuildBlueprint, BuildPathId } from "@/lib/build-strategy/types"
import type {
  BuildActivityKind,
  BuildActivityLogEntry,
  BuildLifecycleStatus,
  BuildMilestone,
  BuildPathExecution,
  BuildRecord,
  BuildRecordContext,
  BuildTask,
  BuildTaskStatus,
  CommunicationPackage,
  FounderAttentionState,
  InstalledChecklist,
  QaChecklistItem,
  QaGate,
} from "@/lib/build-record/types"

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * deriveQaChecklist — capability-specific QA items derived from the actual
 * Build Blueprint™ fields for the chosen path. Never a fake universal test:
 * every item traces to something real in the blueprint (the desired outcome,
 * the owner, or a path-specific detail field).
 */
export function deriveQaChecklist(blueprint: BuildBlueprint): QaChecklistItem[] {
  const items: string[] = [
    `Result matches the desired outcome: "${blueprint.desiredOutcome}"`,
    `Owner is ready to operate this: ${blueprint.ownerSummary}`,
  ]

  switch (blueprint.detail.kind) {
    case "build-steps":
      items.push("Every build step's definition of done has been verified")
      break
    case "ai-build":
      for (const action of blueprint.detail.remainingHumanActions) {
        items.push(`Confirmed: ${action}`)
      }
      break
    case "delegate":
      items.push(`Handoff brief reviewed and accepted by ${blueprint.detail.suggestedOwnerRole}`)
      break
    case "hire":
      items.push("Role scorecard and definition of success reviewed before extending an offer")
      break
    case "outsource":
      items.push("Contractor scope of work confirmed against the desired outcome")
      break
    case "buy":
      items.push(`Solution evaluated against: ${blueprint.detail.evaluationCriteria.join("; ")}`)
      break
    case "partner":
      items.push("Partner scope and founder-retained decisions confirmed in writing")
      break
  }

  return items.map((label) => ({ id: makeId("qa"), label, checked: false }))
}

/**
 * deriveInstalledChecklist — the Phase 11 INSTALLED conditions ("part of the
 * business's operating rhythm"). Founder-confirmed only; never auto-checked.
 */
export function deriveInstalledChecklist(): InstalledChecklist {
  const labels = [
    "The owner understands their responsibility",
    "A process exists for this to keep happening",
    "Documentation exists",
    "Tools are configured",
    "The workflow is actually being used",
    "Metrics can be monitored",
    "The founder is no longer unnecessarily required",
    "Handoff is complete",
  ]
  return { items: labels.map((label) => ({ id: makeId("installed"), label, checked: false })) }
}

/** Appends one entry to the build's activity log — immutable, never overwrites history. */
export function appendActivityLogEntry(record: BuildRecord, kind: BuildActivityKind, label: string): BuildRecord {
  const entry: BuildActivityLogEntry = { id: makeId("activity"), at: new Date().toISOString(), kind, label }
  return { ...record, activityLog: [...record.activityLog, entry] }
}

/**
 * canTransitionTo — the "no false completion" gate. Only three transitions
 * are gated (the ones the spec calls out): QA before ready-to-install,
 * having passed QA before installing, and LIVE evidence + the founder-
 * confirmed INSTALLED checklist before installed. Every other transition in
 * the existing 17-state vocabulary remains founder-driven and ungated.
 */
export function canTransitionTo(record: BuildRecord, next: BuildLifecycleStatus): { allowed: boolean; reason: string | null } {
  if (next === "ready-to-install") {
    const items = record.qaGate.items
    if (items.length === 0) return { allowed: false, reason: "No QA checklist exists yet for this build." }
    const uncheckedCount = items.filter((i) => !i.checked).length
    if (uncheckedCount > 0) {
      return { allowed: false, reason: `QA is not complete — ${uncheckedCount} of ${items.length} item(s) still unchecked.` }
    }
    return { allowed: true, reason: null }
  }

  if (next === "installing") {
    if (record.status !== "ready-to-install" && record.status !== "installing") {
      return { allowed: false, reason: "This build must pass QA and be marked ready-to-install before installing." }
    }
    return { allowed: true, reason: null }
  }

  if (next === "installed") {
    const hasEvidence = Boolean(record.liveEvidence.note && record.liveEvidence.note.trim().length > 0)
    if (!hasEvidence) {
      return {
        allowed: false,
        reason: "LIVE evidence is required — describe how this capability is actually operating in the business before marking it installed.",
      }
    }
    const items = record.installedChecklist.items
    const uncheckedCount = items.filter((i) => !i.checked).length
    if (uncheckedCount > 0) {
      return { allowed: false, reason: `Not all INSTALLED conditions are confirmed — ${uncheckedCount} of ${items.length} remaining.` }
    }
    return { allowed: true, reason: null }
  }

  return { allowed: true, reason: null }
}

/** The initial, per-path execution shape — every flag honestly false/null. */
function initialExecutionFor(buildPath: BuildPathId): BuildPathExecution {
  switch (buildPath) {
    case "founder-build":
    case "co-build":
      return { kind: buildPath, completedStepNumbers: [] }
    case "ai-build":
      return { kind: "ai-build", generatedOutputs: [], completedHumanActions: [] }
    case "delegate":
      return { kind: "delegate", assignedTo: null, briefedAt: null, handoffAcceptedAt: null }
    case "hire":
      return { kind: "hire", requisitionStarted: false, candidateSelected: false, startDate: null }
    case "outsource":
      return { kind: "outsource", contractorEngaged: false, contractorName: null, scopeConfirmedAt: null }
    case "buy":
      return { kind: "buy", purchaseDecisionMade: false, selectedProduct: null, purchasedAt: null }
    case "partner":
      return { kind: "partner", partnerEngaged: false, partnerName: null, agreementConfirmedAt: null }
  }
}

/** One scaffold milestone + its tasks, adapted lightly per Build Path™ — no invented dates. */
function initialMilestonesAndTasksFor(
  buildPath: BuildPathId,
  blueprint: BuildBlueprint,
): { milestones: BuildMilestone[]; tasks: BuildTask[] } {
  const tasks: BuildTask[] = []

  if (blueprint.detail.kind === "build-steps") {
    for (const step of blueprint.detail.steps) {
      tasks.push({
        id: makeId("task"),
        title: step.title,
        owner: "founder",
        status: "not-started",
        dueDate: null,
        dependsOnTaskId: null,
        completionCriteria: step.definitionOfDone,
        founderAttentionFlag: step.stepNumber === 1,
      })
    }
  } else {
    const kickoffOwner =
      blueprint.detail.kind === "ai-build"
        ? "AI"
        : blueprint.detail.kind === "delegate"
          ? blueprint.detail.suggestedOwnerRole
          : blueprint.detail.kind === "hire"
            ? blueprint.detail.suggestedRole
            : blueprint.detail.kind === "outsource"
              ? blueprint.detail.suggestedSpecialistType
              : blueprint.detail.kind === "buy"
                ? blueprint.detail.suggestedCategory
                : blueprint.detail.suggestedPartnerType

    tasks.push({
      id: makeId("task"),
      title: `Kick off: ${blueprint.what}`,
      owner: kickoffOwner,
      status: "not-started",
      dueDate: null,
      dependsOnTaskId: null,
      completionCriteria: blueprint.desiredOutcome,
      founderAttentionFlag: true,
    })
  }

  const milestone: BuildMilestone = {
    id: makeId("milestone"),
    title: buildPath === "founder-build" || buildPath === "co-build" ? "Build" : "Get started",
    definitionOfDone: blueprint.desiredOutcome,
    taskIds: tasks.map((t) => t.id),
    status: "not-started",
    targetDate: null,
  }

  return { milestones: [milestone], tasks }
}

/**
 * deriveBuildRecord — creates the initial BuildRecord the moment a founder
 * chooses a Build Path™ for a Founder GPS™ recommendation. Pure and
 * deterministic given the same blueprint + context; call sites supply a
 * stable `id` so re-derivation (e.g. after editing the blueprint) can
 * preserve it rather than minting a new one.
 */
export function deriveBuildRecord(blueprint: BuildBlueprint, context: BuildRecordContext = {}, id?: string): BuildRecord {
  const now = new Date().toISOString()
  const { milestones, tasks } = initialMilestonesAndTasksFor(blueprint.buildPath, blueprint)
  const recommendedBuildPath = context.recommendedBuildPath ?? null
  const pathDiffersFromRecommendation = Boolean(recommendedBuildPath) && recommendedBuildPath !== blueprint.buildPath

  const record: BuildRecord = {
    id: id ?? makeId("build"),
    readinessCapabilityId: blueprint.recommendationId,
    title: blueprint.what,
    summary: blueprint.desiredOutcome,
    buildPath: blueprint.buildPath,
    blueprint,
    execution: initialExecutionFor(blueprint.buildPath),
    status: "path-selected",
    milestones,
    tasks,
    prerequisiteCapabilityIds: context.prerequisiteCapabilityIds ?? blueprint.prerequisites.map((p) => p.id),
    blockedByCapabilityIds: [],
    blockerNote: null,
    ownerSummary: blueprint.ownerSummary,
    executor: null,
    createdAt: now,
    startedAt: null,
    completedAt: null,
    installedAt: null,
    updatedAt: now,

    recommendedBuildPath,
    recommendedBuildPathReason: context.recommendedBuildPathReason ?? null,
    pathSelectionReason: context.pathSelectionReason ?? null,
    qaGate: { items: deriveQaChecklist(blueprint), notes: null },
    liveEvidence: { note: null, confirmedAt: null },
    installedChecklist: deriveInstalledChecklist(),
    activityLog: [],
    communicationPackages: [],
  }

  const withInitialEntry = appendActivityLogEntry(
    record,
    "path-change",
    pathDiffersFromRecommendation
      ? `Build Path™ chosen: "${blueprint.buildPath}" (recommendation was "${recommendedBuildPath}")`
      : `Build Path™ chosen: "${blueprint.buildPath}"`,
  )

  return withInitialEntry
}

/**
 * deriveFounderAttention — the single source of truth for the 🟢🟡🔴🔵⚪✅
 * signal. Never read from a stored field; always recomputed here.
 */
export function deriveFounderAttention(record: BuildRecord): FounderAttentionState {
  if (record.status === "installed" || record.status === "measuring") return "installed"
  if (record.status === "blocked" || record.blockedByCapabilityIds.length > 0) return "blocked"
  if (record.status === "awaiting-external" || record.status === "briefed") return "awaiting-external"
  if (record.status === "review" || record.status === "revision-requested" || record.status === "ready-to-install") {
    return "review"
  }
  const hasFlaggedTask = record.tasks.some((t) => t.founderAttentionFlag && t.status !== "done")
  if (record.status === "paused" || hasFlaggedTask) return "attention-needed"
  return "on-track"
}

/**
 * transitionBuildStatus — a small, explicit state helper. Not a full state
 * machine (the spec's 17 states allow many founder-driven paths); this only
 * stamps the matching timestamp fields so callers never invent dates by hand.
 *
 * Phase 11: gated by `canTransitionTo()` first — a build cannot become
 * "ready-to-install" without a completed QA gate, cannot become "installing"
 * without having passed QA, and cannot become "installed" without LIVE
 * evidence and a founder-confirmed INSTALLED checklist. A blocked attempt is
 * a no-op on `status` but is still recorded in the activity log so the
 * founder can see why nothing changed.
 */
export function applyBuildStatusTransition(record: BuildRecord, next: BuildLifecycleStatus): BuildRecord {
  const gate = canTransitionTo(record, next)
  if (!gate.allowed) {
    return appendActivityLogEntry(record, "status-change", `Blocked: cannot move to "${next}" — ${gate.reason}`)
  }

  const now = new Date().toISOString()
  let updated: BuildRecord = { ...record, status: next, updatedAt: now }

  if (next === "in-progress" && !record.startedAt) updated.startedAt = now
  if (next === "ready-to-install" && !record.completedAt) updated.completedAt = now
  if (next === "installed" && !record.installedAt) updated.installedAt = now

  updated = appendActivityLogEntry(updated, "status-change", `Status changed to "${next}"`)
  return updated
}

/** Toggles one task's status between "done" and "not-started" — the founder's own action, never auto-derived. */
export function toggleTaskStatus(record: BuildRecord, taskId: string): BuildRecord {
  const task = record.tasks.find((t) => t.id === taskId)
  if (!task) return record
  const nextStatus: BuildTaskStatus = task.status === "done" ? "not-started" : "done"
  const tasks = record.tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
  return appendActivityLogEntry(
    { ...record, tasks, updatedAt: new Date().toISOString() },
    "note",
    `Task "${task.title}" marked ${nextStatus === "done" ? "done" : "not started"}`,
  )
}

/** Toggles one QA checklist item — founder-confirmed, never auto-checked. */
export function toggleQaItem(record: BuildRecord, itemId: string): BuildRecord {
  const item = record.qaGate.items.find((i) => i.id === itemId)
  if (!item) return record
  const items = record.qaGate.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
  return appendActivityLogEntry(
    { ...record, qaGate: { ...record.qaGate, items }, updatedAt: new Date().toISOString() },
    "qa",
    `QA item "${item.label}" marked ${!item.checked ? "checked" : "unchecked"}`,
  )
}

/** Saves the founder's free-text QA notes. */
export function setQaNotes(record: BuildRecord, notes: string): BuildRecord {
  return { ...record, qaGate: { ...record.qaGate, notes }, updatedAt: new Date().toISOString() }
}

/**
 * setLiveEvidence — records what actually proves the capability is
 * operating in the business. Required, non-empty text before `"installed"`
 * is reachable (enforced by `canTransitionTo`).
 */
export function setLiveEvidence(record: BuildRecord, note: string): BuildRecord {
  const confirmedAt = note.trim().length > 0 ? new Date().toISOString() : null
  return appendActivityLogEntry(
    { ...record, liveEvidence: { note, confirmedAt }, updatedAt: new Date().toISOString() },
    "live",
    note.trim().length > 0 ? `LIVE evidence recorded: ${note}` : "LIVE evidence cleared",
  )
}

/** Toggles one INSTALLED checklist item — founder-confirmed, never auto-checked. */
export function toggleInstalledItem(record: BuildRecord, itemId: string): BuildRecord {
  const item = record.installedChecklist.items.find((i) => i.id === itemId)
  if (!item) return record
  const items = record.installedChecklist.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
  return appendActivityLogEntry(
    { ...record, installedChecklist: { ...record.installedChecklist, items }, updatedAt: new Date().toISOString() },
    "installed",
    `INSTALLED condition "${item.label}" marked ${!item.checked ? "confirmed" : "unconfirmed"}`,
  )
}

/** Sets the blocker note and, when non-empty, moves status to "blocked" — a founder-driven action, not automatic. */
export function setBlockerNote(record: BuildRecord, note: string): BuildRecord {
  const trimmed = note.trim()
  const status: BuildLifecycleStatus = trimmed.length > 0 ? "blocked" : record.status === "blocked" ? "in-progress" : record.status
  return appendActivityLogEntry(
    { ...record, blockerNote: trimmed.length > 0 ? trimmed : null, status, updatedAt: new Date().toISOString() },
    "note",
    trimmed.length > 0 ? `Blocker noted: ${trimmed}` : "Blocker cleared",
  )
}

/** Saves the founder-entered executor (who's actually doing the day-to-day work). */
export function setExecutor(record: BuildRecord, executor: string): BuildRecord {
  const trimmed = executor.trim()
  return { ...record, executor: trimmed.length > 0 ? trimmed : null, updatedAt: new Date().toISOString() }
}

/**
 * DELEGATION EXECUTION — activates the 3 existing `DelegateExecution` fields
 * (`assignedTo`, `briefedAt`, `handoffAcceptedAt`). No new fields, no new
 * table, no new tracking model — these mutators are the missing wiring for
 * schema that already existed. Each is a no-op on any non-"delegate" record,
 * matching this file's existing convention of never touching a block that
 * doesn't match `execution.kind`.
 */

/** Saves the founder-entered assignee (name/role) — free text, matching `executor`/`contractorName`/`partnerName`. Never invented. */
export function setDelegateAssignee(record: BuildRecord, name: string): BuildRecord {
  if (record.execution.kind !== "delegate") return record
  const trimmed = name.trim()
  const assignedTo = trimmed.length > 0 ? trimmed : null
  return appendActivityLogEntry(
    { ...record, execution: { ...record.execution, assignedTo }, updatedAt: new Date().toISOString() },
    "note",
    assignedTo ? `Assigned to: ${assignedTo}` : "Assignee cleared",
  )
}

/** Marks the assignee as briefed — requires an assignee to already be set. */
export function markDelegateBriefed(record: BuildRecord): BuildRecord {
  if (record.execution.kind !== "delegate") return record
  if (!record.execution.assignedTo) return record
  if (record.execution.briefedAt) return record
  const now = new Date().toISOString()
  return appendActivityLogEntry(
    { ...record, execution: { ...record.execution, briefedAt: now }, updatedAt: now },
    "status-change",
    `Briefed: ${record.execution.assignedTo}`,
  )
}

/** Marks the handoff as accepted — requires the assignee to already be briefed. */
export function markHandoffAccepted(record: BuildRecord): BuildRecord {
  if (record.execution.kind !== "delegate") return record
  if (!record.execution.briefedAt) return record
  if (record.execution.handoffAcceptedAt) return record
  const now = new Date().toISOString()
  return appendActivityLogEntry(
    { ...record, execution: { ...record.execution, handoffAcceptedAt: now }, updatedAt: now },
    "status-change",
    `Handoff accepted: ${record.execution.assignedTo}`,
  )
}

/**
 * isCommunicationPackageApplicable — a handoff/communication package only
 * makes sense when another person or organization must receive the work.
 * The 3 in-house paths (founder-build, co-build, ai-build) never produce
 * one; the 5 external/capacity paths (delegate, hire, outsource, buy,
 * partner) do. This is the single source of truth callers (UI, engine) use
 * to decide — no separate registry, just the existing Build Path IDs.
 */
export function isCommunicationPackageApplicable(buildPath: BuildPathId): boolean {
  switch (buildPath) {
    case "founder-build":
    case "co-build":
    case "ai-build":
      return false
    case "delegate":
    case "hire":
    case "outsource":
    case "buy":
    case "partner":
      return true
  }
}

/** Per-path default audience for a generated communication package — plain data, matching `ownerSummaryFor`'s style. */
function defaultAudienceFor(buildPath: BuildPathId): string {
  switch (buildPath) {
    case "delegate":
      return "Team member"
    case "hire":
      return "Candidate"
    case "outsource":
      return "Contractor"
    case "partner":
      return "Partner"
    case "buy":
      return "Vendor"
    default:
      return "Recipient"
  }
}

/**
 * generateCommunicationPackage — drafts a handoff/communication package from
 * the record's own Build Blueprint™ detail. Generate-then-approve only:
 * `approvedAt` starts `null` and this function NEVER sends anything.
 *
 * A no-op for the 3 in-house Build Paths™ (founder-build, co-build,
 * ai-build) — there is no external recipient, so no package is drafted and
 * `communicationPackages` stays empty for those builds.
 */
export function generateCommunicationPackage(record: BuildRecord): BuildRecord {
  const { blueprint } = record
  if (!isCommunicationPackageApplicable(blueprint.buildPath)) return record
  const audience = defaultAudienceFor(blueprint.buildPath)

  const bodyLines: string[] = [
    `What: ${blueprint.what}`,
    `Why it matters: ${blueprint.why}`,
    `Desired outcome: ${blueprint.desiredOutcome}`,
  ]

  switch (blueprint.detail.kind) {
    case "delegate":
      bodyLines.push("", "Context to brief:", ...blueprint.detail.briefingPoints.map((p) => `- ${p}`))
      bodyLines.push("", `Handoff is done when: ${blueprint.detail.handoffDefinitionOfDone}`)
      break
    case "hire":
      bodyLines.push("", "Core responsibilities:", ...blueprint.detail.coreResponsibilities.map((r) => `- ${r}`))
      break
    case "outsource":
      bodyLines.push("", "Scope of work:", ...blueprint.detail.scopeOfWork.map((s) => `- ${s}`))
      break
    case "partner":
      bodyLines.push("", "Scope handed to you:", ...blueprint.detail.scopeHandedToPartner.map((s) => `- ${s}`))
      bodyLines.push("", "We retain:", ...blueprint.detail.founderRetains.map((s) => `- ${s}`))
      break
    case "buy":
      bodyLines.push("", "What we're evaluating:", ...blueprint.detail.evaluationCriteria.map((c) => `- ${c}`))
      break
    case "build-steps":
    case "ai-build":
      // Unreachable: isCommunicationPackageApplicable() above already
      // excludes the 3 in-house paths whose blueprint detail is one of
      // these two kinds. Handled exhaustively so this switch needs no
      // `default` fallback.
      break
  }

  const pkg: CommunicationPackage = {
    id: makeId("comms"),
    audience,
    subject: `${blueprint.what} — ${audience.toLowerCase()} brief`,
    body: bodyLines.join("\n"),
    generatedAt: new Date().toISOString(),
    approvedAt: null,
  }

  return appendActivityLogEntry(
    { ...record, communicationPackages: [...record.communicationPackages, pkg], updatedAt: new Date().toISOString() },
    "communication",
    `Communication package drafted for ${audience.toLowerCase()}`,
  )
}

/** Founder-explicit approval stamp — required before treating a package as sendable; this function still never sends anything. */
export function approveCommunicationPackage(record: BuildRecord, packageId: string): BuildRecord {
  const pkg = record.communicationPackages.find((p) => p.id === packageId)
  if (!pkg) return record
  const communicationPackages = record.communicationPackages.map((p) =>
    p.id === packageId ? { ...p, approvedAt: new Date().toISOString() } : p,
  )
  return appendActivityLogEntry(
    { ...record, communicationPackages, updatedAt: new Date().toISOString() },
    "communication",
    `Communication package for ${pkg.audience.toLowerCase()} approved by founder`,
  )
}
