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
  | { signedIn: false; entitled: false; cycleKey: string; focus: null }
  | { signedIn: true; entitled: boolean; cycleKey: string; focus: MonthlyBoundaryRecord | null }

export type SaveMonthlyBoundaryInput =
  | { kind: "option"; optionId: string; agreement?: string }
  | { kind: "custom"; name: string; rule?: string; collision?: string }

function currentCycleKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now)
  const year = parts.find((p) => p.type === "year")?.value
  const month = parts.find((p) => p.type === "month")?.value
  return `${year}-${month}`
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
  const cycleKey = currentCycleKey()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { signedIn: false, entitled: false, cycleKey, focus: null }

  const [{ data: entitled }, { data: row }] = await Promise.all([
    supabase.rpc("has_active_entitlement", { p_entitlement: ENTITLEMENT }),
    supabase
      .from("monthly_boundary_focus")
      .select("cycle_key, boundary_text, option_id, rule_description, collision_tags, agreement, status, confirmed_at")
      .eq("user_id", user.id)
      .eq("cycle_key", cycleKey)
      .maybeSingle<Row>(),
  ])

  return { signedIn: true, entitled: entitled === true, cycleKey, focus: row ? toRecord(row) : null }
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
        cycle_key: currentCycleKey(),
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
