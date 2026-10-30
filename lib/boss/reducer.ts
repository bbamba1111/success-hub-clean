import { levelMeta, STATUS_LABEL, isClosed } from "./constants"
import { nextBusinessDate } from "./clock"
import { COORDINATOR_ID, FOUNDER_ID } from "./demo-data"
import type {
  BossState,
  ChangeEntry,
  ClockMode,
  CoordinatorEvent,
  Notice,
  Opportunity,
  Outcome,
  Permission,
  PermissionStatus,
  Resource,
  WorkItem,
  WorkStatus,
} from "./types"

export type CloseoutChoice = "carry" | "queue" | "cancel"

export type BossAction =
  | { type: "ADD_WORK"; draft: Partial<WorkItem> & { title: string } }
  | { type: "UPDATE_WORK"; id: string; patch: Partial<WorkItem> }
  | { type: "SET_STATUS"; id: string; status: WorkStatus; note?: string }
  | { type: "REASSIGN"; id: string; toId: string | null; reason?: string; actor?: string }
  | { type: "MOVE"; id: string; dir: -1 | 1 }
  | { type: "PLAN"; id: string; include: boolean }
  | { type: "OUTCOME_ADD"; text: string }
  | { type: "OUTCOME_UPDATE"; id: string; patch: Partial<Outcome> }
  | { type: "OUTCOME_REMOVE"; id: string }
  | { type: "CONFIRM_PLAN" }
  | { type: "START_WORKDAY" }
  | { type: "RESOLVE_DECISION"; id: string; approve: boolean; note: string }
  | { type: "RESOLVE_NOTICE"; id: string; authorize: boolean }
  | { type: "DELEGATE"; id: string }
  | { type: "RESOLVE_PROPOSAL"; eventId: string; accept: boolean }
  | { type: "COORDINATOR_STEP"; phase: string }
  | { type: "COORDINATOR_NOTE"; kind: CoordinatorEvent["kind"]; summary: string; workId?: string }
  | { type: "CLOSEOUT"; choices: Record<string, CloseoutChoice>; notes: string }
  | { type: "START_NEXT_DAY" }
  | { type: "PERMISSION_STATUS"; id: string; status: PermissionStatus; note: string }
  | { type: "PERMISSION_ADD"; permission: Omit<Permission, "id" | "history"> }
  | { type: "RESOURCE_ADD"; resource: Omit<Resource, "id"> }
  | { type: "PROFILE_UPDATE"; which: "founderProfile" | "businessProfile"; key: string; value: string }
  | { type: "OPPORTUNITY_UPDATE"; id: string; patch: Partial<Opportunity> }
  | { type: "OPPORTUNITY_ADD"; opportunity: Omit<Opportunity, "id"> }
  | { type: "SET_CLOCK"; mode: ClockMode }
  | { type: "REPLACE"; state: BossState }

const now = () => new Date().toISOString()

export function resourceName(state: BossState, id: string | null) {
  if (!id) return "Unassigned"
  return state.resources.find((r) => r.id === id)?.name ?? id
}

export type AuthorityCheck =
  | { status: "founder" }
  | { status: "external" }
  | { status: "unassigned" }
  | { status: "authorized"; permission: Permission; canExecute: boolean }
  | { status: "task_approved"; permission: Permission }
  | { status: "not_authorized"; reason: string }

/** Authority is resource-, action-, and scope-specific. Listing or assigning never grants it. */
export function authorityFor(state: BossState, resourceId: string | null, item: Pick<WorkItem, "fn" | "id">): AuthorityCheck {
  if (!resourceId) return { status: "unassigned" }
  if (resourceId === FOUNDER_ID) return { status: "founder" }
  const resource = state.resources.find((r) => r.id === resourceId)
  if (!resource) return { status: "unassigned" }
  if (resource.category === "external") return { status: "external" }
  const perms = state.permissions.filter((p) => p.resourceId === resourceId)
  const taskGrant = perms.find((p) => p.workId === item.id && p.status === "authorized")
  if (taskGrant) return { status: "task_approved", permission: taskGrant }
  const standing = perms
    .filter((p) => p.status === "authorized" && p.functions.includes(item.fn))
    .sort((a, b) => levelMeta(b.level).rank - levelMeta(a.level).rank)[0]
  if (standing) {
    return { status: "authorized", permission: standing, canExecute: levelMeta(standing.level).rank >= 3 }
  }
  const lapsed = perms.find((p) => p.functions.includes(item.fn) && p.status !== "authorized")
  return {
    status: "not_authorized",
    reason: lapsed
      ? `Permission ${lapsed.id} is ${lapsed.status.replace("_", " ")}`
      : "No permission covers this business function",
  }
}

export function canProceed(check: AuthorityCheck) {
  return check.status === "founder" || check.status === "authorized" || check.status === "task_approved"
}

function nextId(state: BossState, prefix: string): [string, number] {
  const seq = state.seq + 1
  return [`${prefix}-${seq}`, seq]
}

function addChange(state: BossState, entry: Omit<ChangeEntry, "id" | "at">): BossState {
  const [id, seq] = nextId(state, "CH")
  const full: ChangeEntry = { id, at: now(), ...entry }
  return {
    ...state,
    seq,
    changes: [full, ...state.changes].slice(0, 400),
    work: entry.workId
      ? state.work.map((w) => (w.id === entry.workId ? { ...w, history: [full, ...w.history] } : w))
      : state.work,
  }
}

function addNotice(state: BossState, notice: Omit<Notice, "id" | "at" | "status">): BossState {
  const [id, seq] = nextId(state, "N")
  return {
    ...state,
    seq,
    notices: [{ id, at: now(), status: "pending_authorization", ...notice }, ...state.notices],
  }
}

function addEvent(state: BossState, event: Omit<CoordinatorEvent, "id" | "at">): BossState {
  const [id, seq] = nextId(state, "C")
  return { ...state, seq, coordinator: [{ id, at: now(), ...event }, ...state.coordinator] }
}

function patchWork(state: BossState, id: string, patch: Partial<WorkItem>): BossState {
  return { ...state, work: state.work.map((w) => (w.id === id ? { ...w, ...patch } : w)) }
}

const getWork = (state: BossState, id: string) => state.work.find((w) => w.id === id)

const isAssignedToOther = (w: WorkItem) => !!w.assigneeId && w.assigneeId !== FOUNDER_ID

/** Notify everything downstream of a changed item, and unblock dependents whose inputs are now complete. */
function propagate(state: BossState, sourceId: string, description: string): BossState {
  let next = state
  const source = getWork(next, sourceId)
  if (!source) return next
  for (const dep of next.work.filter((w) => w.dependsOn.includes(sourceId) && !isClosed(w.status))) {
    next = addChange(next, {
      actor: "System",
      workId: dep.id,
      kind: "dependency",
      summary: `Upstream ${sourceId} ${description}`,
    })
    if (source.status === "completed") {
      const fresh = getWork(next, dep.id)!
      const allDone = fresh.dependsOn.every((d) => getWork(next, d)?.status === "completed")
      if (allDone && fresh.status === "blocked") {
        next = patchWork(next, dep.id, { status: fresh.assigneeId ? "assigned" : "planned" })
        next = addChange(next, { actor: "System", workId: dep.id, kind: "status", summary: "Unblocked — all dependencies complete" })
      }
    } else if (["cancelled", "on_hold", "failed", "blocked"].includes(source.status) && isAssignedToOther(dep)) {
      next = addNotice(next, {
        workId: dep.id,
        resourceId: dep.assigneeId!,
        kind: "dependency",
        summary: `${resourceName(next, dep.assigneeId)} is working on ${dep.id}, which depends on ${sourceId} (now ${STATUS_LABEL[source.status]}).`,
      })
    }
  }
  return next
}

function setStatus(state: BossState, id: string, status: WorkStatus, actor: string, note?: string): BossState {
  const item = getWork(state, id)
  if (!item || item.status === status) return state
  let next = patchWork(state, id, {
    status,
    evidence: status === "completed" && !item.evidence ? note ?? item.evidence : item.evidence,
  })
  next = addChange(next, {
    actor,
    workId: id,
    kind: "status",
    summary: `${STATUS_LABEL[item.status]} → ${STATUS_LABEL[status]}${note ? ` · ${note}` : ""}`,
  })
  if (isAssignedToOther(item) && ["cancelled", "on_hold"].includes(status) && !isClosed(item.status)) {
    next = addNotice(next, {
      workId: id,
      resourceId: item.assigneeId!,
      kind: "reassignment",
      summary: `Tell ${resourceName(next, item.assigneeId)} that ${id} is now ${STATUS_LABEL[status]}.`,
    })
  }
  if (status === "cancelled") {
    for (const child of next.work.filter((w) => w.parentId === id && !isClosed(w.status))) {
      next = setStatus(next, child.id, "cancelled", "System", `Parent ${id} cancelled`)
    }
  }
  return propagate(next, id, `is now ${STATUS_LABEL[status]}`)
}

function reassign(state: BossState, id: string, toId: string | null, actor: string, reason?: string): BossState {
  const item = getWork(state, id)
  if (!item || item.assigneeId === toId) return state
  const prevId = item.assigneeId
  const check = authorityFor(state, toId, item)
  const wasActive = ["assigned", "in_progress", "under_review", "awaiting_approval"].includes(item.status)

  let status: WorkStatus = item.status
  if (!toId) status = "defined"
  else if (check.status === "external") status = "awaiting_external"
  else if (canProceed(check)) {
    if (!isClosed(item.status)) status = item.status === "in_progress" && toId === prevId ? "in_progress" : "assigned"
  } else status = "awaiting_approval"

  let next = patchWork(state, id, { assigneeId: toId, status })
  next = addChange(next, {
    actor,
    workId: id,
    kind: "reassigned",
    summary: `${resourceName(state, prevId)} → ${resourceName(state, toId)}${reason ? ` · ${reason}` : ""}`,
  })
  if (status !== item.status) {
    next = addChange(next, { actor: "System", workId: id, kind: "status", summary: `${STATUS_LABEL[item.status]} → ${STATUS_LABEL[status]}` })
  }
  if (prevId && prevId !== FOUNDER_ID && wasActive) {
    next = addNotice(next, {
      workId: id,
      resourceId: prevId,
      kind: "reassignment",
      summary: `Tell ${resourceName(next, prevId)} that ${id} has moved to ${resourceName(next, toId)}.`,
    })
  }
  if (toId && toId !== FOUNDER_ID) {
    next = addNotice(next, {
      workId: id,
      resourceId: toId,
      kind: "new_assignment",
      summary:
        check.status === "external"
          ? `Request ${resourceName(next, toId)} take on ${id}. External collaborators decide for themselves.`
          : `Notify ${resourceName(next, toId)} of new assignment ${id}.`,
    })
  }
  if (check.status === "not_authorized") {
    next = addEvent(next, {
      kind: "awaiting_authorization",
      workId: id,
      summary: `${id} assigned to ${resourceName(next, toId)}, but ${check.reason.toLowerCase()}. Founder authorization required before work starts.`,
    })
  }
  return propagate(next, id, `reassigned to ${resourceName(next, toId)}`)
}

function recommendResource(state: BossState, item: WorkItem) {
  const candidates = state.resources.filter(
    (r) =>
      r.id !== FOUNDER_ID &&
      r.id !== COORDINATOR_ID &&
      r.id !== item.assigneeId &&
      r.category !== "external" &&
      r.functions.includes(item.fn),
  )
  return (
    candidates.find((r) => canProceed(authorityFor(state, r.id, item))) ??
    candidates[0] ??
    null
  )
}

export function bossReducer(state: BossState, action: BossAction): BossState {
  switch (action.type) {
    case "REPLACE":
      return action.state

    case "SET_CLOCK":
      return { ...state, clockMode: action.mode }

    case "ADD_WORK": {
      const [id, seq] = nextId(state, "W")
      const parent = action.draft.parentId ? getWork(state, action.draft.parentId) : undefined
      const item: WorkItem = {
        outcome: "",
        fn: parent?.fn ?? "operations",
        priority: "medium",
        rank: Math.max(0, ...state.work.map((w) => w.rank)) + 1,
        assigneeId: null,
        ownerId: FOUNDER_ID,
        status: "captured",
        dueDate: state.day.date,
        effortMins: 30,
        dependsOn: [],
        parentId: null,
        approach: "",
        requiresFounderDecision: false,
        decisionQuestion: "",
        reviewRequired: false,
        evidence: "",
        inTodayPlan: parent?.inTodayPlan ?? false,
        plannedForDate: parent?.inTodayPlan ? state.day.date : null,
        carriedFrom: null,
        history: [],
        createdAt: now(),
        ...action.draft,
        id,
      }
      const desiredAssignee = item.assigneeId
      item.assigneeId = null
      if (item.status === "captured" && item.outcome) item.status = item.inTodayPlan ? "planned" : "defined"
      let next: BossState = { ...state, seq, work: [...state.work, item] }
      next = addChange(next, {
        actor: "Founder",
        workId: id,
        kind: "created",
        summary: parent ? `Subtask of ${parent.id} created` : `Created${item.inTodayPlan ? " in today's plan" : ""}`,
      })
      if (desiredAssignee) next = reassign(next, id, desiredAssignee, "Founder")
      return next
    }

    case "UPDATE_WORK": {
      const item = getWork(state, action.id)
      if (!item) return state
      const { assigneeId, status, ...rest } = action.patch
      const changed = (Object.keys(rest) as (keyof WorkItem)[]).filter(
        (k) => JSON.stringify((rest as Partial<WorkItem>)[k]) !== JSON.stringify(item[k]),
      )
      let next = state
      if (changed.length) {
        next = patchWork(next, action.id, rest)
        const labels: Partial<Record<keyof WorkItem, string>> = {
          title: "title",
          outcome: "desired outcome",
          fn: "business function",
          priority: "priority",
          dueDate: "due date",
          effortMins: "effort",
          dependsOn: "dependencies",
          approach: "execution approach",
          requiresFounderDecision: "founder decision",
          decisionQuestion: "decision question",
          reviewRequired: "review requirement",
          evidence: "completion evidence",
        }
        next = addChange(next, {
          actor: "Founder",
          workId: action.id,
          kind: changed.includes("priority") ? "priority" : "edited",
          summary: `Changed ${changed.map((k) => labels[k] ?? k).join(", ")}`,
        })
        if (changed.some((k) => ["outcome", "dueDate", "approach", "title"].includes(k))) {
          if (isAssignedToOther(item) && !isClosed(item.status)) {
            next = addNotice(next, {
              workId: action.id,
              resourceId: item.assigneeId!,
              kind: "reassignment",
              summary: `Tell ${resourceName(next, item.assigneeId)} the ${changed
                .filter((k) => ["outcome", "dueDate", "approach", "title"].includes(k))
                .map((k) => labels[k])
                .join(" and ")} of ${action.id} changed.`,
            })
          }
          next = propagate(next, action.id, "was edited")
        }
        if (changed.includes("dependsOn")) {
          const fresh = getWork(next, action.id)!
          const unmet = fresh.dependsOn.some((d) => getWork(next, d)?.status !== "completed")
          if (!unmet && fresh.status === "blocked") next = setStatus(next, action.id, fresh.assigneeId ? "assigned" : "planned", "System", "Dependencies met")
        }
      }
      if (assigneeId !== undefined && assigneeId !== item.assigneeId) next = reassign(next, action.id, assigneeId, "Founder")
      if (status && status !== getWork(next, action.id)!.status) next = setStatus(next, action.id, status, "Founder")
      return next
    }

    case "SET_STATUS":
      return setStatus(state, action.id, action.status, "Founder", action.note)

    case "REASSIGN":
      return reassign(state, action.id, action.toId, action.actor ?? "Founder", action.reason)

    case "MOVE": {
      const plan = state.work.filter((w) => w.inTodayPlan && !isClosed(w.status)).sort((a, b) => a.rank - b.rank)
      const idx = plan.findIndex((w) => w.id === action.id)
      const swap = plan[idx + action.dir]
      if (idx < 0 || !swap) return state
      const a = plan[idx]
      let next = { ...state, work: state.work.map((w) => (w.id === a.id ? { ...w, rank: swap.rank } : w.id === swap.id ? { ...w, rank: a.rank } : w)) }
      next = addChange(next, { actor: "Founder", workId: a.id, kind: "priority", summary: `Moved ${action.dir < 0 ? "up" : "down"} to position ${idx + 1 + action.dir}` })
      return next
    }

    case "PLAN": {
      const item = getWork(state, action.id)
      if (!item) return state
      let next = patchWork(state, action.id, {
        inTodayPlan: action.include,
        plannedForDate: action.include ? state.day.date : null,
        status:
          action.include && ["captured", "defined"].includes(item.status)
            ? "planned"
            : !action.include && item.status === "planned"
              ? "defined"
              : item.status,
      })
      next = addChange(next, {
        actor: "Founder",
        workId: action.id,
        kind: "plan",
        summary: action.include ? "Added to today's plan" : "Removed from today's plan · returned to Work Queue",
      })
      return propagate(next, action.id, action.include ? "added to today's plan" : "removed from today's plan")
    }

    case "OUTCOME_ADD": {
      const [id, seq] = nextId(state, "OC")
      const next = { ...state, seq, day: { ...state.day, outcomes: [...state.day.outcomes, { id, text: action.text, done: false }] } }
      return addChange(next, { actor: "Founder", kind: "plan", summary: `Added outcome: ${action.text}` })
    }
    case "OUTCOME_UPDATE": {
      const prev = state.day.outcomes.find((o) => o.id === action.id)
      const next = {
        ...state,
        day: { ...state.day, outcomes: state.day.outcomes.map((o) => (o.id === action.id ? { ...o, ...action.patch } : o)) },
      }
      if (action.patch.text !== undefined && prev && prev.text !== action.patch.text) {
        return addChange(next, { actor: "Founder", kind: "plan", summary: `Changed outcome to: ${action.patch.text}` })
      }
      return next
    }
    case "OUTCOME_REMOVE": {
      const prev = state.day.outcomes.find((o) => o.id === action.id)
      const next = { ...state, day: { ...state.day, outcomes: state.day.outcomes.filter((o) => o.id !== action.id) } }
      return addChange(next, { actor: "Founder", kind: "plan", summary: `Removed outcome: ${prev?.text ?? ""}` })
    }

    case "CONFIRM_PLAN": {
      let next: BossState = { ...state, day: { ...state.day, planConfirmedAt: now() } }
      next = addChange(next, { actor: "Founder", kind: "plan", summary: "Confirmed Decide & Design plan" })
      for (const w of next.work.filter((x) => x.inTodayPlan && ["captured", "defined"].includes(x.status))) {
        next = setStatus(next, w.id, "planned", "System", "Plan confirmed")
      }
      return addEvent(next, { kind: "note", summary: "Plan confirmed by founder. Coordinator will work only within granted authority." })
    }

    case "START_WORKDAY": {
      let next: BossState = { ...state, day: { ...state.day, workdayStartedAt: now() } }
      next = addChange(next, { actor: "Founder", kind: "plan", summary: "Entered the 4-Hour Focused CEO Workday™" })
      return addEvent(next, { kind: "note", summary: "CEO Workday started. Coordinating authorized assignments (simulated)." })
    }

    case "RESOLVE_DECISION": {
      const item = getWork(state, action.id)
      if (!item) return state
      let next = state
      if (item.status === "awaiting_approval" && item.assigneeId) {
        if (action.approve) {
          const [pid, seq] = nextId(next, "P")
          const grant: Permission = {
            id: pid,
            resourceId: item.assigneeId,
            action: `Execute ${item.id}: ${item.title}`,
            scope: `This assignment only (${item.id})`,
            functions: [],
            level: "approved_execution",
            conditions: action.note || "Founder approved during CEO Workday",
            limits: "Single assignment",
            approver: "Maya Ellison",
            duration: "Until this assignment closes",
            status: "authorized",
            history: [{ at: now(), by: "Maya Ellison", note: "Approved for this assignment only" }],
            workId: item.id,
          }
          next = { ...next, seq, permissions: [grant, ...next.permissions] }
          next = addChange(next, { actor: "Founder", workId: item.id, kind: "authority", summary: `Approved execution for this assignment only (${pid})` })
          next = setStatus(next, item.id, "assigned", "Founder")
          next = addEvent(next, { kind: "authorized", workId: item.id, summary: `${item.id} authorized by founder for ${resourceName(next, item.assigneeId)}.` })
        } else {
          next = addChange(next, { actor: "Founder", workId: item.id, kind: "decision", summary: `Declined authorization${action.note ? ` · ${action.note}` : ""}` })
          next = reassign(next, item.id, FOUNDER_ID, "Founder", "Authorization declined")
        }
        return next
      }
      if (item.status === "under_review") {
        return action.approve
          ? setStatus(next, item.id, "completed", "Founder", action.note || "Approved in review")
          : setStatus(next, item.id, "in_progress", "Founder", `Revisions requested${action.note ? `: ${action.note}` : ""}`)
      }
      next = patchWork(next, item.id, { requiresFounderDecision: false })
      return addChange(next, {
        actor: "Founder",
        workId: item.id,
        kind: "decision",
        summary: `Decision ${action.approve ? "made" : "deferred"}${action.note ? ` · ${action.note}` : ""}`,
      })
    }

    case "RESOLVE_NOTICE": {
      const notice = state.notices.find((n) => n.id === action.id)
      if (!notice) return state
      const next = {
        ...state,
        notices: state.notices.map((n) => (n.id === action.id ? { ...n, status: action.authorize ? "authorized" : "dismissed" } as Notice : n)),
      }
      return addChange(next, {
        actor: "Founder",
        workId: notice.workId,
        kind: "authority",
        summary: action.authorize
          ? `Authorized notification to ${resourceName(state, notice.resourceId)} (simulated — no message sent)`
          : `Dismissed notification to ${resourceName(state, notice.resourceId)}`,
      })
    }

    case "DELEGATE": {
      const item = getWork(state, action.id)
      if (!item) return state
      const rec = recommendResource(state, item)
      if (!rec) {
        return addEvent(state, { kind: "exception", workId: item.id, summary: `No registered resource covers ${item.id}. Consider adding one to the Workforce Registry.` })
      }
      const check = authorityFor(state, rec.id, item)
      return addEvent(state, {
        kind: "proposed",
        workId: item.id,
        proposal: { type: "assign", workId: item.id, resourceId: rec.id },
        resolution: "open",
        summary: `Proposes delegating ${item.id} to ${rec.name}. ${
          canProceed(check) ? "Authority is in place." : "Founder authorization will be required."
        }`,
      })
    }

    case "RESOLVE_PROPOSAL": {
      const ev = state.coordinator.find((e) => e.id === action.eventId)
      if (!ev?.proposal) return state
      let next = { ...state, coordinator: state.coordinator.map((e) => (e.id === ev.id ? { ...e, resolution: action.accept ? "accepted" : "declined" } as CoordinatorEvent : e)) }
      if (action.accept) next = reassign(next, ev.proposal.workId, ev.proposal.resourceId, "Founder", "Delegated via Coordinator")
      else next = addChange(next, { actor: "Founder", workId: ev.proposal.workId, kind: "decision", summary: "Declined Coordinator delegation proposal" })
      return next
    }

    case "COORDINATOR_STEP": {
      if (action.phase !== "workday") {
        return addEvent(state, { kind: "note", summary: "Coordinator is paused outside the CEO Workday. No business activity runs in protected time." })
      }
      let next = state
      let touched = 0
      const managed = next.work
        .filter((w) => w.inTodayPlan && w.assigneeId)
        .filter((w) => {
          const r = next.resources.find((x) => x.id === w.assigneeId)
          return r && (r.category === "ai" || r.category === "automation")
        })
      for (const w of managed) {
        const check = authorityFor(next, w.assigneeId, w)
        const unmet = w.dependsOn.some((d) => getWork(next, d)?.status !== "completed")
        if (!canProceed(check)) continue
        if (unmet && w.status === "assigned") {
          next = setStatus(next, w.id, "blocked", COORDINATOR_ID, "Waiting on dependencies")
          touched++
          continue
        }
        if (w.status === "assigned") {
          next = setStatus(next, w.id, "in_progress", COORDINATOR_ID, "Simulated start")
          next = addEvent(next, { kind: "simulated", workId: w.id, summary: `${resourceName(next, w.assigneeId)} started ${w.id} (simulated).` })
          touched++
        } else if (w.status === "in_progress") {
          const needsReview = w.reviewRequired || (check.status === "authorized" && !check.canExecute)
          next = patchWork(next, w.id, { evidence: w.evidence || "Simulated output (demo) — no real work performed" })
          next = setStatus(next, w.id, needsReview ? "under_review" : "completed", COORDINATOR_ID, "Simulated output")
          next = addEvent(next, {
            kind: needsReview ? "simulated" : "verified",
            workId: w.id,
            summary: needsReview
              ? `${w.id} prepared and sent to founder review. Nothing was sent or published.`
              : `${w.id} completed within pre-authorized limits (simulated) and recorded.`,
          })
          touched++
        }
      }
      return touched ? next : addEvent(next, { kind: "note", summary: "No authorized AI or automated assignments ready to advance." })
    }

    case "COORDINATOR_NOTE":
      return addEvent(state, { kind: action.kind, summary: action.summary, workId: action.workId })

    case "CLOSEOUT": {
      const nextDate = nextBusinessDate(state.day.date)
      let next = state
      const rec = { completed: [] as string[], carried: [] as string[], returned: [] as string[], cancelled: [] as string[] }
      for (const w of state.work.filter((x) => x.inTodayPlan)) {
        if (w.status === "completed") {
          rec.completed.push(w.id)
          continue
        }
        if (isClosed(w.status)) continue
        const choice = action.choices[w.id] ?? "carry"
        if (choice === "cancel") {
          next = setStatus(next, w.id, "cancelled", "Founder", "Cancelled at closeout")
          rec.cancelled.push(w.id)
        } else if (choice === "queue") {
          next = patchWork(next, w.id, { inTodayPlan: false, plannedForDate: null })
          next = addChange(next, { actor: "Founder", workId: w.id, kind: "closeout", summary: "Returned to Work Queue at closeout" })
          rec.returned.push(w.id)
        } else {
          next = patchWork(next, w.id, { plannedForDate: nextDate, carriedFrom: state.day.date })
          next = addChange(next, { actor: "Founder", workId: w.id, kind: "closeout", summary: `Carried forward to ${nextDate}` })
          rec.carried.push(w.id)
        }
        if (w.status === "in_progress" && choice !== "cancel") {
          next = setStatus(next, w.id, "assigned", "System", "Paused at 5:00 PM — resumes next CEO Workday")
        }
      }
      const closedAt = now()
      next = {
        ...next,
        day: { ...next.day, closedOutAt: closedAt },
        pastDays: [{ date: state.day.date, closedAt, outcomes: state.day.outcomes, notes: action.notes, ...rec }, ...next.pastDays],
      }
      next = addEvent(next, { kind: "note", summary: "Business day closed. Coordinator paused until the next CEO Workday." })
      return addChange(next, {
        actor: "Founder",
        kind: "closeout",
        summary: `Closed business day · ${rec.completed.length} completed, ${rec.carried.length} carried forward`,
      })
    }

    case "START_NEXT_DAY": {
      const nextDate = nextBusinessDate(state.day.date)
      const work = state.work.map((w) =>
        w.plannedForDate === nextDate && !isClosed(w.status)
          ? { ...w, inTodayPlan: true }
          : w.inTodayPlan
            ? { ...w, inTodayPlan: false }
            : w,
      )
      return {
        ...state,
        work,
        day: { date: nextDate, outcomes: [], planConfirmedAt: null, workdayStartedAt: null, closedOutAt: null },
      }
    }

    case "PERMISSION_STATUS": {
      return {
        ...state,
        permissions: state.permissions.map((p) =>
          p.id === action.id
            ? { ...p, status: action.status, history: [{ at: now(), by: "Maya Ellison", note: action.note }, ...p.history] }
            : p,
        ),
      }
    }

    case "PERMISSION_ADD": {
      const [id, seq] = nextId(state, "P")
      const perm: Permission = {
        ...action.permission,
        id,
        history: [{ at: now(), by: "Maya Ellison", note: `Created with status ${action.permission.status.replace("_", " ")}` }],
      }
      return { ...state, seq, permissions: [perm, ...state.permissions] }
    }

    case "RESOURCE_ADD": {
      const [id, seq] = nextId(state, "R")
      return { ...state, seq, resources: [...state.resources, { ...action.resource, id }] }
    }

    case "PROFILE_UPDATE":
      return {
        ...state,
        [action.which]: state[action.which].map((f) => (f.key === action.key ? { ...f, value: action.value } : f)),
      }

    case "OPPORTUNITY_UPDATE":
      return { ...state, opportunities: state.opportunities.map((o) => (o.id === action.id ? { ...o, ...action.patch } : o)) }

    case "OPPORTUNITY_ADD": {
      const [id, seq] = nextId(state, "O")
      return { ...state, seq, opportunities: [...state.opportunities, { ...action.opportunity, id }] }
    }
  }
}
