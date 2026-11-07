import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  REFERENCE_FIELDS,
  STANDARD_CATEGORIES,
  referenceKey,
  type ApprovedBusinessFact,
  type AvailableReference,
  type BusinessFact,
  type BusinessProfileData,
  type CategoryDefinition,
  type FactActor,
  type FactHistoryEntry,
  type ProfileDocument,
} from "./definitions"

type FactRow = {
  id: string
  category_key: string
  label: string
  value: string | null
  approval_status: BusinessFact["status"]
  approved_label: string | null
  approved_value: string | null
  approved_at: string | null
  source_type: BusinessFact["sourceType"]
  source_table: string | null
  source_column: string | null
  sort_order: number
  last_change_actor: FactActor
  last_change_action: string
  updated_at: string
}

const FACT_COLUMNS =
  "id, category_key, label, value, approval_status, approved_label, approved_value, approved_at, source_type, source_table, source_column, sort_order, last_change_actor, last_change_action, updated_at"

function toFact(row: FactRow): BusinessFact {
  return {
    id: row.id,
    categoryKey: row.category_key,
    label: row.label,
    value: row.value,
    status: row.approval_status,
    approvedLabel: row.approved_label,
    approvedValue: row.approved_value,
    approvedAt: row.approved_at,
    sourceType: row.source_type,
    sourceTable: row.source_table,
    sourceColumn: row.source_column,
    sortOrder: row.sort_order,
    lastChangeActor: row.last_change_actor,
    lastChangeAction: row.last_change_action,
    updatedAt: row.updated_at,
  }
}

function stringify(raw: unknown): string {
  if (raw === null || raw === undefined) return ""
  if (typeof raw === "string") return raw.trim()
  return String(raw).trim()
}

async function loadReferenceSources(supabase: SupabaseClient, userId: string) {
  const byTable = new Map<string, string[]>()
  for (const field of REFERENCE_FIELDS) {
    byTable.set(field.sourceTable, [...(byTable.get(field.sourceTable) ?? []), field.sourceColumn])
  }
  const values = new Map<string, string>()
  await Promise.all(
    Array.from(byTable.entries()).map(async ([table, columns]) => {
      const { data } = await supabase.from(table).select(columns.join(", ")).eq("user_id", userId).limit(1).maybeSingle()
      if (!data) return
      for (const column of columns) {
        values.set(referenceKey(table, column), stringify((data as unknown as Record<string, unknown>)[column]))
      }
    }),
  )
  return values
}

/**
 * Brings referenced facts in line with their source records. A changed source
 * updates the working value; the database trigger then moves an approved fact
 * to needs_review so outdated wording is never presented as current.
 */
async function syncReferencedFacts(supabase: SupabaseClient, userId: string, facts: FactRow[]) {
  const referenced = facts.filter((f) => f.source_type === "reference" && f.source_table && f.source_column && f.approval_status !== "retired")
  if (referenced.length === 0) return { facts, sources: null as Map<string, string> | null }
  const sources = await loadReferenceSources(supabase, userId)
  const updated = await Promise.all(
    facts.map(async (fact) => {
      if (!referenced.includes(fact)) return fact
      const live = sources.get(referenceKey(fact.source_table!, fact.source_column!)) ?? ""
      if (live === (fact.value ?? "")) return fact
      const { data, error } = await supabase
        .from("business_profile_facts")
        .update({
          value: live,
          last_change_actor: "system",
          last_change_action: "source_changed",
          last_change_note: `Updated from ${fact.source_table}.${fact.source_column}`,
        })
        .eq("id", fact.id)
        .eq("user_id", userId)
        .select(FACT_COLUMNS)
        .single()
      if (error || !data) {
        console.error("[v0] business profile reference sync failed", error?.message)
        return fact
      }
      return data as FactRow
    }),
  )
  return { facts: updated, sources }
}

export async function loadBusinessProfile(supabase: SupabaseClient, userId: string): Promise<BusinessProfileData> {
  const [{ data: factRows }, { data: categoryRows }, { data: documentRows }] = await Promise.all([
    supabase.from("business_profile_facts").select(FACT_COLUMNS).eq("user_id", userId).order("sort_order").order("created_at"),
    supabase
      .from("business_profile_categories")
      .select("category_key, label, description, archived, sort_order")
      .eq("user_id", userId)
      .eq("archived", false)
      .order("sort_order"),
    supabase
      .from("business_profile_documents")
      .select("id, file_name, document_type, extraction_status, size_bytes, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ])

  const { facts, sources: syncedSources } = await syncReferencedFacts(supabase, userId, (factRows ?? []) as FactRow[])
  const sources = syncedSources ?? (await loadReferenceSources(supabase, userId))

  const categories: CategoryDefinition[] = [
    ...STANDARD_CATEGORIES,
    ...(categoryRows ?? []).map((c) => ({
      key: c.category_key as string,
      label: c.label as string,
      description: (c.description as string | null) ?? "",
      examples: [],
      isCustom: true,
    })),
  ]

  const usedReferences = new Set(
    facts.filter((f) => f.source_type === "reference" && f.approval_status !== "retired").map((f) => referenceKey(f.source_table!, f.source_column!)),
  )
  const availableReferences: AvailableReference[] = REFERENCE_FIELDS.flatMap((field) => {
    const key = referenceKey(field.sourceTable, field.sourceColumn)
    const currentValue = sources.get(key) ?? ""
    if (!currentValue || usedReferences.has(key)) return []
    return [{ ...field, currentValue }]
  })

  const documents: ProfileDocument[] = (documentRows ?? []).map((d) => ({
    id: d.id as string,
    fileName: d.file_name as string,
    documentType: d.document_type as ProfileDocument["documentType"],
    extractionStatus: d.extraction_status as ProfileDocument["extractionStatus"],
    sizeBytes: d.size_bytes as number | null,
    createdAt: d.created_at as string,
  }))

  return { categories, facts: facts.map(toFact), documents, availableReferences }
}

export async function loadFactHistory(supabase: SupabaseClient, userId: string, factId: string): Promise<FactHistoryEntry[]> {
  const { data } = await supabase
    .from("business_profile_fact_history")
    .select(
      "id, fact_id, action, actor, previous_label, new_label, previous_value, new_value, previous_status, new_status, previous_approved_value, new_approved_value, note, created_at",
    )
    .eq("user_id", userId)
    .eq("fact_id", factId)
    .order("created_at", { ascending: false })
    .limit(100)
  return (data ?? []).map((h) => ({
    id: h.id,
    factId: h.fact_id,
    action: h.action,
    actor: h.actor,
    previousLabel: h.previous_label,
    newLabel: h.new_label,
    previousValue: h.previous_value,
    newValue: h.new_value,
    previousStatus: h.previous_status,
    newStatus: h.new_status,
    previousApprovedValue: h.previous_approved_value,
    newApprovedValue: h.new_approved_value,
    note: h.note,
    createdAt: h.created_at,
  }))
}

/**
 * The only path for Cherry Blossom™ and the executives to read business
 * information. Returns founder-approved wording only; drafts, needs-review,
 * and retired facts are never included. Not yet connected to any external
 * workflow (deferred to Phase 5).
 */
export async function getApprovedBusinessFacts(
  supabase: SupabaseClient,
  userId: string,
  options: { categoryKeys?: string[] } = {},
): Promise<ApprovedBusinessFact[]> {
  const profile = await loadBusinessProfile(supabase, userId)
  const categoryLabel = new Map(profile.categories.map((c) => [c.key, c.label]))
  return profile.facts
    .filter((f) => f.status === "approved" && f.approvedValue !== null && f.approvedLabel !== null)
    .filter((f) => !options.categoryKeys || options.categoryKeys.includes(f.categoryKey))
    .map((f) => ({
      id: f.id,
      categoryKey: f.categoryKey,
      categoryLabel: categoryLabel.get(f.categoryKey) ?? f.categoryKey,
      label: f.approvedLabel!,
      value: f.approvedValue!,
      approvedAt: f.approvedAt,
    }))
}

/**
 * Entry point for future conversational (Cherry Blossom™) and document
 * extraction updates. Proposals are saved as drafts or needs-review items and
 * can never approve themselves — the database rejects approval by any actor
 * other than the founder.
 */
export async function proposeBusinessFactChange(
  supabase: SupabaseClient,
  userId: string,
  proposal: {
    actor: Exclude<FactActor, "founder" | "system">
    factId?: string
    categoryKey: string
    label: string
    value: string
    note?: string
    sourceDocumentId?: string
  },
) {
  const sourceType = proposal.actor === "document_extraction" ? "document" : "conversation"
  if (proposal.factId) {
    const { data: existing } = await supabase
      .from("business_profile_facts")
      .select("id, approval_status")
      .eq("id", proposal.factId)
      .eq("user_id", userId)
      .maybeSingle()
    if (!existing) return { ok: false as const, error: "Business fact not found." }
    const { error } = await supabase
      .from("business_profile_facts")
      .update({
        label: proposal.label,
        value: proposal.value,
        approval_status: existing.approval_status === "approved" ? "needs_review" : existing.approval_status,
        last_change_actor: proposal.actor,
        last_change_action: "proposed",
        last_change_note: proposal.note ?? null,
      })
      .eq("id", proposal.factId)
      .eq("user_id", userId)
    return error ? { ok: false as const, error: error.message } : { ok: true as const, factId: proposal.factId }
  }
  const { data, error } = await supabase
    .from("business_profile_facts")
    .insert({
      user_id: userId,
      category_key: proposal.categoryKey,
      label: proposal.label,
      value: proposal.value,
      source_type: sourceType,
      source_document_id: proposal.sourceDocumentId ?? null,
      last_change_actor: proposal.actor,
      last_change_action: "proposed",
      last_change_note: proposal.note ?? null,
    })
    .select("id")
    .single()
  return error || !data ? { ok: false as const, error: error?.message ?? "Could not save." } : { ok: true as const, factId: data.id as string }
}
