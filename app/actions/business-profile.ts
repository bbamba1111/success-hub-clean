"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { REFERENCE_FIELDS, STANDARD_CATEGORIES } from "@/lib/business-profile/definitions"
import type { FactHistoryEntry } from "@/lib/business-profile/definitions"
import { loadFactHistory } from "@/lib/business-profile/server"

const PROFILE_PATH = "/boss/business-profile"
const MAX_LABEL = 120
const MAX_VALUE = 8000

type Result = { ok: true } | { ok: false; error: string }

async function requireFounder() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, userId: null as string | null }
  return { supabase, userId: user.id }
}

function cleanLabel(raw: unknown) {
  const label = typeof raw === "string" ? raw.trim() : ""
  return label.length > 0 && label.length <= MAX_LABEL ? label : null
}

function cleanValue(raw: unknown) {
  const value = typeof raw === "string" ? raw.trim() : ""
  return value.length <= MAX_VALUE ? value : null
}

async function categoryExists(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, key: string) {
  if (STANDARD_CATEGORIES.some((c) => c.key === key)) return true
  const { data } = await supabase
    .from("business_profile_categories")
    .select("id")
    .eq("user_id", userId)
    .eq("category_key", key)
    .eq("archived", false)
    .maybeSingle()
  return Boolean(data)
}

async function loadOwnFact(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, factId: string) {
  const { data } = await supabase
    .from("business_profile_facts")
    .select("id, label, value, approval_status, approved_label, approved_value, sort_order")
    .eq("id", factId)
    .eq("user_id", userId)
    .maybeSingle()
  return data
}

function finish(error: { message: string } | null, fallback: string): Result {
  if (error) {
    console.error("[v0] business profile action failed:", error.message)
    return { ok: false, error: fallback }
  }
  revalidatePath(PROFILE_PATH)
  return { ok: true }
}

export async function addBusinessFact(input: { categoryKey: string; label: string; value: string }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const label = cleanLabel(input.label)
  const value = cleanValue(input.value)
  if (!label) return { ok: false, error: "Give this item a name (up to 120 characters)." }
  if (value === null) return { ok: false, error: "That entry is too long." }
  if (!(await categoryExists(supabase, userId, input.categoryKey))) return { ok: false, error: "That category no longer exists." }

  const { count } = await supabase
    .from("business_profile_facts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("category_key", input.categoryKey)
  const { error } = await supabase.from("business_profile_facts").insert({
    user_id: userId,
    category_key: input.categoryKey,
    label,
    value,
    sort_order: count ?? 0,
    source_type: "manual",
    last_change_actor: "founder",
    last_change_action: "created",
  })
  return finish(error, "Could not add this item. Please try again.")
}

export async function addReferencedFact(input: { sourceTable: string; sourceColumn: string }): Promise<Result> {
  const field = REFERENCE_FIELDS.find((f) => f.sourceTable === input.sourceTable && f.sourceColumn === input.sourceColumn)
  if (!field) return { ok: false, error: "That record cannot be referenced." }
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const { data: source } = await supabase.from(field.sourceTable).select(field.sourceColumn).eq("user_id", userId).limit(1).maybeSingle()
  const raw = source ? (source as unknown as Record<string, unknown>)[field.sourceColumn] : null
  const value = raw === null || raw === undefined ? "" : String(raw).trim()
  if (!value) return { ok: false, error: "That record is empty." }
  const { error } = await supabase.from("business_profile_facts").insert({
    user_id: userId,
    category_key: field.categoryKey,
    label: field.label,
    value,
    sort_order: 999,
    source_type: "reference",
    source_table: field.sourceTable,
    source_column: field.sourceColumn,
    last_change_actor: "founder",
    last_change_action: "created",
    last_change_note: `Referenced from ${field.sourceTable}.${field.sourceColumn}`,
  })
  return finish(error, "Could not add this record.")
}

export async function updateBusinessFact(input: { factId: string; label: string; value: string }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const fact = await loadOwnFact(supabase, userId, input.factId)
  if (!fact) return { ok: false, error: "Item not found." }
  if (fact.approval_status === "retired") return { ok: false, error: "Reactivate this item before editing it." }
  const label = cleanLabel(input.label)
  const value = cleanValue(input.value)
  if (!label) return { ok: false, error: "Give this item a name (up to 120 characters)." }
  if (value === null) return { ok: false, error: "That entry is too long." }
  if (label === fact.label && value === (fact.value ?? "")) return { ok: true }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({ label, value, last_change_actor: "founder", last_change_action: "edited", last_change_note: null })
    .eq("id", input.factId)
    .eq("user_id", userId)
  return finish(error, "Could not save your changes.")
}

/** Explicit founder approval of the exact wording currently shown. */
export async function approveBusinessFact(input: { factId: string; label: string; value: string }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const fact = await loadOwnFact(supabase, userId, input.factId)
  if (!fact) return { ok: false, error: "Item not found." }
  if (fact.approval_status === "retired") return { ok: false, error: "Reactivate this item before approving it." }
  if (fact.label !== input.label || (fact.value ?? "") !== input.value) {
    return { ok: false, error: "This item changed since you opened it. Please review the latest wording." }
  }
  if (!fact.value) return { ok: false, error: "Add the information before approving it." }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({
      approval_status: "approved",
      approved_label: fact.label,
      approved_value: fact.value,
      last_change_actor: "founder",
      last_change_action: "approved",
      last_change_note: null,
    })
    .eq("id", input.factId)
    .eq("user_id", userId)
  return finish(error, "Could not approve this item.")
}

/** Discards a pending change and returns to the last approved wording, or retires an unapproved proposal. */
export async function rejectBusinessFactChange(factId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const fact = await loadOwnFact(supabase, userId, factId)
  if (!fact) return { ok: false, error: "Item not found." }
  const update =
    fact.approved_value !== null && fact.approved_label !== null
      ? { label: fact.approved_label, value: fact.approved_value, approval_status: "approved" }
      : { approval_status: "retired" }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({ ...update, last_change_actor: "founder", last_change_action: "rejected", last_change_note: null })
    .eq("id", factId)
    .eq("user_id", userId)
  return finish(error, "Could not reject this change.")
}

export async function retireBusinessFact(factId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({ approval_status: "retired", last_change_actor: "founder", last_change_action: "retired", last_change_note: null })
    .eq("id", factId)
    .eq("user_id", userId)
  return finish(error, "Could not retire this item.")
}

export async function reactivateBusinessFact(factId: string): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const fact = await loadOwnFact(supabase, userId, factId)
  if (!fact || fact.approval_status !== "retired") return { ok: false, error: "Item not found." }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({
      approval_status: fact.approved_value !== null ? "needs_review" : "draft",
      last_change_actor: "founder",
      last_change_action: "reactivated",
      last_change_note: null,
    })
    .eq("id", factId)
    .eq("user_id", userId)
  return finish(error, "Could not reactivate this item.")
}

/** Restores an earlier wording as a new recorded change. It must be approved again before external use. */
export async function restoreBusinessFactVersion(input: { factId: string; historyId: string }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const fact = await loadOwnFact(supabase, userId, input.factId)
  if (!fact) return { ok: false, error: "Item not found." }
  const { data: version } = await supabase
    .from("business_profile_fact_history")
    .select("new_label, new_value, created_at")
    .eq("id", input.historyId)
    .eq("fact_id", input.factId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!version || !version.new_label) return { ok: false, error: "That version is not available." }
  const { error } = await supabase
    .from("business_profile_facts")
    .update({
      label: version.new_label,
      value: version.new_value,
      approval_status: fact.approved_value !== null ? "needs_review" : "draft",
      last_change_actor: "founder",
      last_change_action: "restored",
      last_change_note: `Restored version from ${new Date(version.created_at).toISOString()}`,
    })
    .eq("id", input.factId)
    .eq("user_id", userId)
  return finish(error, "Could not restore that version.")
}

export async function moveBusinessFact(input: { factId: string; direction: "up" | "down" }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const { data: target } = await supabase
    .from("business_profile_facts")
    .select("id, category_key")
    .eq("id", input.factId)
    .eq("user_id", userId)
    .maybeSingle()
  if (!target) return { ok: false, error: "Item not found." }
  const { data: siblings } = await supabase
    .from("business_profile_facts")
    .select("id")
    .eq("user_id", userId)
    .eq("category_key", target.category_key)
    .order("sort_order")
    .order("created_at")
  const ids = (siblings ?? []).map((s) => s.id as string)
  const index = ids.indexOf(input.factId)
  const swap = input.direction === "up" ? index - 1 : index + 1
  if (index < 0 || swap < 0 || swap >= ids.length) return { ok: true }
  ;[ids[index], ids[swap]] = [ids[swap], ids[index]]
  const results = await Promise.all(
    ids.map((id, order) => supabase.from("business_profile_facts").update({ sort_order: order }).eq("id", id).eq("user_id", userId)),
  )
  return finish(results.find((r) => r.error)?.error ?? null, "Could not reorder.")
}

export async function addCustomCategory(input: { label: string; description: string }): Promise<Result> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  const label = typeof input.label === "string" ? input.label.trim() : ""
  if (!label || label.length > 80) return { ok: false, error: "Name the category (up to 80 characters)." }
  const description = (input.description ?? "").trim().slice(0, 300)
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40)
  const categoryKey = `custom_${slug || "category"}_${Date.now().toString(36)}`
  const { error } = await supabase.from("business_profile_categories").insert({
    user_id: userId,
    category_key: categoryKey,
    label,
    description: description || null,
    sort_order: Date.now() % 1_000_000,
  })
  return finish(error, "Could not add this category.")
}

export async function getBusinessFactHistory(factId: string): Promise<{ ok: true; history: FactHistoryEntry[] } | { ok: false; error: string }> {
  const { supabase, userId } = await requireFounder()
  if (!userId) return { ok: false, error: "Please sign in again." }
  return { ok: true, history: await loadFactHistory(supabase, userId, factId) }
}
