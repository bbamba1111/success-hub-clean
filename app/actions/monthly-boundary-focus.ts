"use server"

import { createClient } from "@/lib/supabase/server"
import { BOUNDARY_OPTIONS, boundaryAffectsOthers } from "@/lib/weekly-boundary-focus/catalog"

const ENTITLEMENT = "monthly_boundary_focus"
const MAX_TEXT = 500
const MAX_REVIEW = 4000

export type MonthlyMilestone = "rule_created" | "rule_communicated" | "testing_started" | "review_completed"

export type MonthlyBoundaryRecord = {
  cycleKey: string
  cycleStart: string | null
  cycleEnd: string | null
  boundaryText: string
  optionId: string | null
  ruleDescription: string | null
  collisionTags: string[]
  agreement: string | null
  status: "chosen" | "confirmed" | "in-progress" | "built" | "deferred"
  confirmedAt: string | null
  ruleCreatedAt: string | null
  ruleCommunicatedAt: string | null
  testingStartedAt: string | null
  reviewCompletedAt: string | null
  reviewNotes: string | null
}

export type MonthlyBoundaryState =
  | {
      signedIn: false
      entitled: false
      cycleKey: null
      cycleStart: null
      cycleEnd: null
      focus: null
      history: []
    }
  | {
      signedIn: true
      entitled: boolean
      cycleKey: string | null
      cycleStart: string | null
      cycleEnd: string | null
      focus: MonthlyBoundaryRecord | null
      history: MonthlyBoundaryRecord[]
    }

export type SaveMonthlyBoundaryInput =
  | { kind: "option"; optionId: string; agreement?: string }
  | { kind: "custom"; name: string; rule?: string; collision?: string }

type ActionResult = { ok: true; focus: MonthlyBoundaryRecord } | { ok: false; error: string }

const MEMBERSHIP_CYCLE_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

const MILESTONE_COLUMN: Record<MonthlyMilestone, keyof Row> = {
  rule_created: "rule_created_at",
  rule_communicated: "rule_communicated_at",
  testing_started: "testing_started_at",
  review_completed: "review_completed_at",
}

function membershipCycleKey(cycleStartDate: string | null, now = new Date()): string | null {
  if (!cycleStartDate) return null
  const start = new Date(cycleStartDate).getTime()
  if (Number.isNaN(start) || now.getTime() < start) return null
  const elapsedDays = Math.floor((now.getTime() - start) / DAY_MS)
  return `c${Math.floor(elapsedDays / MEMBERSHIP_CYCLE_DAYS) + 1}`
}

function cycleDates(profileStart: string, key: string) {
  const index = Number(key.slice(1)) - 1
  if (!Number.isFinite(index) || index < 0) return null
  const start = new Date(new Date(profileStart).getTime() + index * MEMBERSHIP_CYCLE_DAYS * DAY_MS)
  const end = new Date(start.getTime() + (MEMBERSHIP_CYCLE_DAYS - 1) * DAY_MS)
  return { start: start.toISOString(), end: end.toISOString() }
}

type Supabase = Awaited<ReturnType<typeof createClient>>
type CurrentCycle = { key: string; start: string; end: string; profileStart: string }

async function getProfileStart(supabase: Supabase, userId: string) {
  const { data } = await supabase
    .from("user_profiles")
    .select("cycle_start_date")
    .eq("id", userId)
    .maybeSingle<{ cycle_start_date: string | null }>()
  return data?.cycle_start_date ?? null
}

async function getCurrentCycle(supabase: Supabase, userId: string): Promise<CurrentCycle | null> {
  const profileStart = await getProfileStart(supabase, userId)
  const key = membershipCycleKey(profileStart)
  if (!key || !profileStart) return null
  const dates = cycleDates(profileStart, key)
  if (!dates) return null
  return { key, ...dates, profileStart }
}

function clean(value: string | undefined | null, max = MAX_TEXT) {
  const trimmed = (value ?? "").trim().slice(0, max)
  return trimmed.length > 0 ? trimmed : null
}

type Row = {
  cycle_key: string
  cycle_start: string | null
  cycle_end: string | null
  boundary_text: string
  option_id: string | null
  rule_description: string | null
  collision_tags: string[] | null
  agreement: string | null
  status: MonthlyBoundaryRecord["status"]
  confirmed_at: string | null
  rule_created_at: string | null
  rule_communicated_at: string | null
  testing_started_at: string | null
  review_completed_at: string | null
  review_notes: string | null
}

const COLUMNS =
  "cycle_key, cycle_start, cycle_end, boundary_text, option_id, rule_description, collision_tags, agreement, status, confirmed_at, rule_created_at, rule_communicated_at, testing_started_at, review_completed_at, review_notes"

function toRecord(row: Row, profileStart: string | null): MonthlyBoundaryRecord {
  const derived = !row.cycle_start && profileStart ? cycleDates(profileStart, row.cycle_key) : null
  return {
    cycleKey: row.cycle_key,
    cycleStart: row.cycle_start ?? derived?.start ?? null,
    cycleEnd: row.cycle_end ?? derived?.end ?? null,
    boundaryText: row.boundary_text,
    optionId: row.option_id,
    ruleDescription: row.rule_description,
    collisionTags: row.collision_tags ?? [],
    agreement: row.agreement,
    status: row.status,
    confirmedAt: row.confirmed_at,
    ruleCreatedAt: row.rule_created_at,
    ruleCommunicatedAt: row.rule_communicated_at,
    testingStartedAt: row.testing_started_at,
    reviewCompletedAt: row.review_completed_at,
    reviewNotes: row.review_notes,
  }
}

async function requireMember(): Promise<
  { ok: true; supabase: Supabase; userId: string; cycle: CurrentCycle } | { ok: false; error: string }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to save your monthly boundary." }
  const { data: entitled } = await supabase.rpc("has_active_entitlement", { p_entitlement: ENTITLEMENT })
  if (entitled !== true) {
    return { ok: false, error: "Monthly Business Boundary Focus™ is available to Monthly Cycle Members." }
  }
  const cycle = await getCurrentCycle(supabase, user.id)
  if (!cycle) {
    return { ok: false, error: "Your membership cycle hasn't started yet. Complete enrollment to choose a boundary." }
  }
  return { ok: true, supabase, userId: user.id, cycle }
}

export async function getMonthlyBoundaryState(): Promise<MonthlyBoundaryState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return { signedIn: false, entitled: false, cycleKey: null, cycleStart: null, cycleEnd: null, focus: null, history: [] }

  const [cycle, { data: entitled }, { data: rows }] = await Promise.all([
    getCurrentCycle(supabase, user.id),
    supabase.rpc("has_active_entitlement", { p_entitlement: ENTITLEMENT }),
    supabase
      .from("monthly_boundary_focus")
      .select(COLUMNS)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<Row[]>(),
  ])

  const cycleKey = cycle?.key ?? null
  const profileStart = cycle?.profileStart ?? (await getProfileStart(supabase, user.id))
  const records = (rows ?? []).map((r) => toRecord(r, profileStart))
  const focus = cycleKey ? (records.find((r) => r.cycleKey === cycleKey) ?? null) : null
  const history = records.filter((r) => r.cycleKey !== cycleKey)

  return {
    signedIn: true,
    entitled: entitled === true,
    cycleKey,
    cycleStart: cycle?.start ?? null,
    cycleEnd: cycle?.end ?? null,
    focus,
    history,
  }
}

export async function saveMonthlyBoundary(input: SaveMonthlyBoundaryInput): Promise<ActionResult> {
  const member = await requireMember()
  if (!member.ok) return member
  const { supabase, userId, cycle } = member

  let values: Pick<Row, "boundary_text" | "option_id" | "rule_description" | "collision_tags" | "agreement">
  if (input.kind === "option") {
    const option = BOUNDARY_OPTIONS.find((o) => o.id === input.optionId)
    if (!option) return { ok: false, error: "That boundary option is not recognized." }
    values = {
      boundary_text: option.label,
      option_id: option.id,
      rule_description: option.helper,
      collision_tags: [],
      agreement: boundaryAffectsOthers(option.collisionTags) ? clean(input.agreement) : null,
    }
  } else {
    const name = clean(input.name)
    if (!name) return { ok: false, error: "Give your boundary a name." }
    const collision = clean(input.collision)
    values = {
      boundary_text: name,
      option_id: "custom",
      rule_description: clean(input.rule),
      collision_tags: collision ? [collision] : [],
      agreement: null,
    }
  }

  const { data: existing } = await supabase
    .from("monthly_boundary_focus")
    .select("boundary_text, option_id")
    .eq("user_id", userId)
    .eq("cycle_key", cycle.key)
    .maybeSingle<{ boundary_text: string; option_id: string | null }>()
  const boundaryChanged =
    !existing || existing.option_id !== values.option_id || existing.boundary_text !== values.boundary_text

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("monthly_boundary_focus")
    .upsert(
      {
        user_id: userId,
        cycle_key: cycle.key,
        cycle_start: cycle.start.slice(0, 10),
        cycle_end: cycle.end.slice(0, 10),
        ...values,
        status: "confirmed",
        confirmed_at: now,
        updated_at: now,
        // A different boundary starts its implementation milestones fresh.
        ...(boundaryChanged
          ? { rule_created_at: null, rule_communicated_at: null, testing_started_at: null }
          : {}),
      },
      { onConflict: "user_id,cycle_key" },
    )
    .select(COLUMNS)
    .single<Row>()

  if (error || !data) return { ok: false, error: "We couldn't save your boundary. Please try again." }
  return { ok: true, focus: toRecord(data, cycle.profileStart) }
}

export async function setMonthlyMilestone(milestone: MonthlyMilestone, done: boolean): Promise<ActionResult> {
  const column = MILESTONE_COLUMN[milestone]
  if (!column) return { ok: false, error: "Unknown milestone." }
  const member = await requireMember()
  if (!member.ok) return member
  const { supabase, userId, cycle } = member

  const { data, error } = await supabase
    .from("monthly_boundary_focus")
    .update({ [column]: done ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("cycle_key", cycle.key)
    .select(COLUMNS)
    .maybeSingle<Row>()

  if (error) return { ok: false, error: "We couldn't update this milestone. Please try again." }
  if (!data) return { ok: false, error: "Select this cycle's boundary before tracking its milestones." }
  return { ok: true, focus: toRecord(data, cycle.profileStart) }
}

export async function saveMonthlyReview(notes: string): Promise<ActionResult> {
  const member = await requireMember()
  if (!member.ok) return member
  const { supabase, userId, cycle } = member

  const { data, error } = await supabase
    .from("monthly_boundary_focus")
    .update({ review_notes: clean(notes, MAX_REVIEW), updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("cycle_key", cycle.key)
    .select(COLUMNS)
    .maybeSingle<Row>()

  if (error) return { ok: false, error: "We couldn't save your review. Please try again." }
  if (!data) return { ok: false, error: "Select this cycle's boundary before recording a review." }
  return { ok: true, focus: toRecord(data, cycle.profileStart) }
}

/**
 * Explicit, member-made association between one saved Boundary Check-In™ and
 * this cycle's monthly boundary. Never set automatically.
 */
export async function setCheckInBoundaryLink(
  checkInId: string,
  linked: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (typeof checkInId !== "string" || !/^[0-9a-f-]{36}$/i.test(checkInId)) {
    return { ok: false, error: "That check-in is not recognized." }
  }
  const member = await requireMember()
  if (!member.ok) return member
  const { supabase, userId, cycle } = member

  let values: Record<string, string | null> = {
    linked_boundary_option_id: null,
    linked_boundary_text: null,
    linked_cycle_key: null,
    linked_at: null,
  }
  if (linked) {
    const { data: focus } = await supabase
      .from("monthly_boundary_focus")
      .select("boundary_text, option_id")
      .eq("user_id", userId)
      .eq("cycle_key", cycle.key)
      .maybeSingle<{ boundary_text: string; option_id: string | null }>()
    if (!focus) return { ok: false, error: "Select this cycle's boundary before linking a collision to it." }
    values = {
      linked_boundary_option_id: focus.option_id,
      linked_boundary_text: focus.boundary_text,
      linked_cycle_key: cycle.key,
      linked_at: new Date().toISOString(),
    }
  }

  const { error } = await supabase
    .from("boundary_check_ins")
    .update(values)
    .eq("id", checkInId)
    .eq("user_id", userId)
  if (error) return { ok: false, error: "We couldn't update this link. Please try again." }
  return { ok: true }
}
