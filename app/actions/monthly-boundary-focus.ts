"use server"

import { createClient } from "@/lib/supabase/server"
import { BOUNDARY_OPTIONS, boundaryAffectsOthers } from "@/lib/weekly-boundary-focus/catalog"

const ENTITLEMENT = "monthly_boundary_focus"
const MAX_TEXT = 500

export type MonthlyBoundaryRecord = {
  cycleKey: string
  boundaryText: string
  optionId: string | null
  ruleDescription: string | null
  collisionTags: string[]
  agreement: string | null
  status: "chosen" | "confirmed" | "in-progress" | "built" | "deferred"
  confirmedAt: string | null
}

export type MonthlyBoundaryState =
  | { signedIn: false; entitled: false; cycleKey: null; focus: null; history: [] }
  | {
      signedIn: true
      entitled: boolean
      cycleKey: string | null
      focus: MonthlyBoundaryRecord | null
      history: MonthlyBoundaryRecord[]
    }

export type SaveMonthlyBoundaryInput =
  | { kind: "option"; optionId: string; agreement?: string }
  | { kind: "custom"; name: string; rule?: string; collision?: string }

const MEMBERSHIP_CYCLE_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

function membershipCycleKey(cycleStartDate: string | null, now = new Date()): string | null {
  if (!cycleStartDate) return null
  const start = new Date(cycleStartDate).getTime()
  if (Number.isNaN(start) || now.getTime() < start) return null
  const elapsedDays = Math.floor((now.getTime() - start) / DAY_MS)
  return `c${Math.floor(elapsedDays / MEMBERSHIP_CYCLE_DAYS) + 1}`
}

async function getCurrentCycleKey(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("user_profiles")
    .select("cycle_start_date")
    .eq("id", userId)
    .maybeSingle<{ cycle_start_date: string | null }>()
  return membershipCycleKey(data?.cycle_start_date ?? null)
}

function clean(value: string | undefined | null) {
  const trimmed = (value ?? "").trim().slice(0, MAX_TEXT)
  return trimmed.length > 0 ? trimmed : null
}

type Row = {
  cycle_key: string
  boundary_text: string
  option_id: string | null
  rule_description: string | null
  collision_tags: string[] | null
  agreement: string | null
  status: MonthlyBoundaryRecord["status"]
  confirmed_at: string | null
}

function toRecord(row: Row): MonthlyBoundaryRecord {
  return {
    cycleKey: row.cycle_key,
    boundaryText: row.boundary_text,
    optionId: row.option_id,
    ruleDescription: row.rule_description,
    collisionTags: row.collision_tags ?? [],
    agreement: row.agreement,
    status: row.status,
    confirmedAt: row.confirmed_at,
  }
}

export async function getMonthlyBoundaryState(): Promise<MonthlyBoundaryState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { signedIn: false, entitled: false, cycleKey: null, focus: null, history: [] }

  const [cycleKey, { data: entitled }, { data: rows }] = await Promise.all([
    getCurrentCycleKey(supabase, user.id),
    supabase.rpc("has_active_entitlement", { p_entitlement: ENTITLEMENT }),
    supabase
      .from("monthly_boundary_focus")
      .select("cycle_key, boundary_text, option_id, rule_description, collision_tags, agreement, status, confirmed_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<Row[]>(),
  ])

  const records = (rows ?? []).map(toRecord)
  const focus = cycleKey ? (records.find((r) => r.cycleKey === cycleKey) ?? null) : null
  const history = records.filter((r) => r.cycleKey !== cycleKey)

  return { signedIn: true, entitled: entitled === true, cycleKey, focus, history }
}

export async function saveMonthlyBoundary(
  input: SaveMonthlyBoundaryInput,
): Promise<{ ok: true; focus: MonthlyBoundaryRecord } | { ok: false; error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to save your monthly boundary." }

  const { data: entitled } = await supabase.rpc("has_active_entitlement", { p_entitlement: ENTITLEMENT })
  if (entitled !== true) {
    return { ok: false, error: "Monthly Business Boundary Focus™ is available to Monthly Cycle Members." }
  }

  const cycleKey = await getCurrentCycleKey(supabase, user.id)
  if (!cycleKey) {
    return { ok: false, error: "Your membership cycle hasn't started yet. Complete enrollment to choose a boundary." }
  }

  let values: Omit<Row, "cycle_key" | "status" | "confirmed_at">
  if (input.kind === "option") {
    const option = BOUNDARY_OPTIONS.find((o) => o.id === input.optionId)
    if (!option) return { ok: false, error: "That boundary option is not recognized." }
    values = {
      boundary_text: option.label,
      option_id: option.id,
      rule_description: option.helper,
      collision_tags: option.collisionTags,
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

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from("monthly_boundary_focus")
    .upsert(
      {
        user_id: user.id,
        cycle_key: cycleKey,
        ...values,
        status: "confirmed",
        confirmed_at: now,
        updated_at: now,
      },
      { onConflict: "user_id,cycle_key" },
    )
    .select("cycle_key, boundary_text, option_id, rule_description, collision_tags, agreement, status, confirmed_at")
    .single<Row>()

  if (error || !data) return { ok: false, error: "We couldn't save your boundary. Please try again." }
  return { ok: true, focus: toRecord(data) }
}
