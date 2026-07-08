import { createClient } from "@/lib/supabase/client"

/**
 * Operating Rules™ persistence (Phase 3B.1).
 *
 * Operating Rules are core data, not ephemeral UI state. Each rule is scoped
 * to a member, an Operating Segment, and a week. Human rules are meant to
 * carry through the Mon–Thu Work-Life Balance Business Week™; business / ai /
 * execution rules are expected to evolve daily.
 *
 * NOTE: only Operating Rules persist in this pass. Win the Segment™
 * reflections, scoring, coaching history, and AI insights are intentionally
 * deferred to later sprints.
 */

export type RuleType = "human" | "business" | "ai" | "execution"

export type RuleScope =
  | "personal"
  | "family"
  | "team"
  | "company"
  | "client"
  | "ai"
  | "leadership"

export type RuleStatus = "active" | "replaced"

export interface OperatingRule {
  id: string
  userId: string
  operatingSegment: string
  ruleText: string
  ruleType: RuleType
  ruleScope: RuleScope
  status: RuleStatus
  weekStartDate: string // ISO date (yyyy-mm-dd), Monday of the rule's week
  effectiveDate: string // ISO date
  createdAt: string
  updatedAt: string
}

export interface OperatingRuleInput {
  operatingSegment: string
  ruleText: string
  ruleType?: RuleType
  ruleScope?: RuleScope
  weekStartDate?: string
  effectiveDate?: string
}

/** Human-readable labels for rule types (used by the planner UI). */
export const RULE_TYPE_LABELS: Record<RuleType, string> = {
  human: "Human Operating Rule™",
  business: "Business Operating Rule™",
  ai: "AI Operating Rule™",
  execution: "Execution Operating Rule™",
}

/** Selectable scopes surfaced in the planner UI. */
export const RULE_SCOPE_LABELS: Record<RuleScope, string> = {
  personal: "Personal",
  family: "Family",
  team: "Team",
  company: "Company",
  client: "Client",
  ai: "AI",
  leadership: "Leadership",
}

/**
 * Returns the Monday (start) of the week containing `date`, as an ISO date
 * string (yyyy-mm-dd). The Work-Life Balance Business Week™ runs Mon–Thu, so
 * Monday is the natural anchor. Sunday is treated as the start of the *coming*
 * week, since Sunday Design Day™ sets up the Monday ahead.
 */
export function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday, ...
  // Sunday → next Monday (+1); otherwise → back to this week's Monday.
  const diff = day === 0 ? 1 : 1 - day
  d.setDate(d.getDate() + diff)
  return toIsoDate(d)
}

function toIsoDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const dayOfMonth = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${dayOfMonth}`
}

interface OperatingRuleRow {
  id: string
  user_id: string
  operating_segment: string
  rule_text: string
  rule_type: RuleType
  rule_scope: RuleScope
  status: RuleStatus
  week_start_date: string
  effective_date: string
  created_at: string
  updated_at: string
}

function mapRow(row: OperatingRuleRow): OperatingRule {
  return {
    id: row.id,
    userId: row.user_id,
    operatingSegment: row.operating_segment,
    ruleText: row.rule_text,
    ruleType: row.rule_type,
    ruleScope: row.rule_scope,
    status: row.status,
    weekStartDate: row.week_start_date,
    effectiveDate: row.effective_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Fetch the active Operating Rules for a given segment. Falls back to the most
 * recent active rules if none exist for the current week yet (this is the
 * lightweight "carry-forward" read — a rule stays in effect until replaced).
 */
export async function getActiveRulesForSegment(
  operatingSegment: string,
): Promise<OperatingRule[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("operating_rules")
    .select("*")
    .eq("user_id", user.id)
    .eq("operating_segment", operatingSegment)
    .eq("status", "active")
    .order("effective_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.log("[v0] getActiveRulesForSegment error:", error.message)
    return []
  }
  return (data as OperatingRuleRow[]).map(mapRow)
}

/**
 * Create a new active Operating Rule. Does not touch existing rules; use
 * `replaceRule` when the member explicitly replaces one.
 */
export async function createRule(input: OperatingRuleInput): Promise<OperatingRule | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const weekStartDate = input.weekStartDate ?? getWeekStartDate()
  const effectiveDate = input.effectiveDate ?? toIsoDate(new Date())

  const { data, error } = await supabase
    .from("operating_rules")
    .insert({
      user_id: user.id,
      operating_segment: input.operatingSegment,
      rule_text: input.ruleText,
      rule_type: input.ruleType ?? "human",
      rule_scope: input.ruleScope ?? "personal",
      status: "active",
      week_start_date: weekStartDate,
      effective_date: effectiveDate,
    })
    .select("*")
    .single()

  if (error) {
    console.log("[v0] createRule error:", error.message)
    return null
  }
  return mapRow(data as OperatingRuleRow)
}

/** Update the text / type / scope of an existing rule in place (Refine Rule). */
export async function refineRule(
  id: string,
  updates: Partial<Pick<OperatingRuleInput, "ruleText" | "ruleType" | "ruleScope">>,
): Promise<OperatingRule | null> {
  const supabase = createClient()
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (updates.ruleText !== undefined) payload.rule_text = updates.ruleText
  if (updates.ruleType !== undefined) payload.rule_type = updates.ruleType
  if (updates.ruleScope !== undefined) payload.rule_scope = updates.ruleScope

  const { data, error } = await supabase
    .from("operating_rules")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    console.log("[v0] refineRule error:", error.message)
    return null
  }
  return mapRow(data as OperatingRuleRow)
}

/**
 * Replace an existing rule: mark the old one `replaced` and create a fresh
 * active rule carrying the same segment/type/scope with new text.
 */
export async function replaceRule(
  oldId: string,
  newText: string,
): Promise<OperatingRule | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: existing } = await supabase
    .from("operating_rules")
    .select("*")
    .eq("id", oldId)
    .single()

  const { error: replaceError } = await supabase
    .from("operating_rules")
    .update({ status: "replaced", updated_at: new Date().toISOString() })
    .eq("id", oldId)

  if (replaceError) {
    console.log("[v0] replaceRule (mark replaced) error:", replaceError.message)
    return null
  }

  const source = existing as OperatingRuleRow | null
  return createRule({
    operatingSegment: source?.operating_segment ?? "",
    ruleText: newText,
    ruleType: source?.rule_type ?? "human",
    ruleScope: source?.rule_scope ?? "personal",
  })
}

/** Delete a rule outright. */
export async function deleteRule(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from("operating_rules").delete().eq("id", id)
  if (error) {
    console.log("[v0] deleteRule error:", error.message)
    return false
  }
  return true
}
