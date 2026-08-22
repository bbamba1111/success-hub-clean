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
  BuildLifecycleStatus,
  BuildMilestone,
  BuildPathExecution,
  BuildRecord,
  BuildRecordContext,
  BuildTask,
  FounderAttentionState,
} from "@/lib/build-record/types"

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
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

  return {
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
  }
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
 */
export function applyBuildStatusTransition(record: BuildRecord, next: BuildLifecycleStatus): BuildRecord {
  const now = new Date().toISOString()
  const updated: BuildRecord = { ...record, status: next, updatedAt: now }

  if (next === "in-progress" && !record.startedAt) updated.startedAt = now
  if (next === "ready-to-install" && !record.completedAt) updated.completedAt = now
  if (next === "installed" && !record.installedAt) updated.installedAt = now

  return updated
}
