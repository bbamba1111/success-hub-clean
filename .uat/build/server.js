"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBusinessProfile = loadBusinessProfile;
exports.loadFactHistory = loadFactHistory;
exports.getApprovedBusinessFacts = getApprovedBusinessFacts;
exports.proposeBusinessFactChange = proposeBusinessFactChange;
require("server-only");
const definitions_1 = require("./definitions");
const FACT_COLUMNS = "id, category_key, label, value, approval_status, approved_label, approved_value, approved_at, source_type, source_table, source_column, sort_order, last_change_actor, last_change_action, updated_at";
function toFact(row) {
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
    };
}
function stringify(raw) {
    if (raw === null || raw === undefined)
        return "";
    if (typeof raw === "string")
        return raw.trim();
    return String(raw).trim();
}
async function loadReferenceSources(supabase, userId) {
    const byTable = new Map();
    for (const field of definitions_1.REFERENCE_FIELDS) {
        byTable.set(field.sourceTable, [...(byTable.get(field.sourceTable) ?? []), field.sourceColumn]);
    }
    const values = new Map();
    await Promise.all(Array.from(byTable.entries()).map(async ([table, columns]) => {
        const { data } = await supabase.from(table).select(columns.join(", ")).eq("user_id", userId).limit(1).maybeSingle();
        if (!data)
            return;
        for (const column of columns) {
            values.set((0, definitions_1.referenceKey)(table, column), stringify(data[column]));
        }
    }));
    return values;
}
/**
 * Brings referenced facts in line with their source records. A changed source
 * updates the working value; the database trigger then moves an approved fact
 * to needs_review so outdated wording is never presented as current.
 */
async function syncReferencedFacts(supabase, userId, facts) {
    const referenced = facts.filter((f) => f.source_type === "reference" && f.source_table && f.source_column && f.approval_status !== "retired");
    if (referenced.length === 0)
        return { facts, sources: null };
    const sources = await loadReferenceSources(supabase, userId);
    const updated = await Promise.all(facts.map(async (fact) => {
        if (!referenced.includes(fact))
            return fact;
        const live = sources.get((0, definitions_1.referenceKey)(fact.source_table, fact.source_column)) ?? "";
        if (live === (fact.value ?? ""))
            return fact;
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
            .single();
        if (error || !data) {
            console.error("[v0] business profile reference sync failed", error?.message);
            return fact;
        }
        return data;
    }));
    return { facts: updated, sources };
}
async function loadBusinessProfile(supabase, userId) {
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
    ]);
    const { facts, sources: syncedSources } = await syncReferencedFacts(supabase, userId, (factRows ?? []));
    const sources = syncedSources ?? (await loadReferenceSources(supabase, userId));
    const categories = [
        ...definitions_1.STANDARD_CATEGORIES,
        ...(categoryRows ?? []).map((c) => ({
            key: c.category_key,
            label: c.label,
            description: c.description ?? "",
            examples: [],
            isCustom: true,
        })),
    ];
    const usedReferences = new Set(facts.filter((f) => f.source_type === "reference" && f.approval_status !== "retired").map((f) => (0, definitions_1.referenceKey)(f.source_table, f.source_column)));
    const availableReferences = definitions_1.REFERENCE_FIELDS.flatMap((field) => {
        const key = (0, definitions_1.referenceKey)(field.sourceTable, field.sourceColumn);
        const currentValue = sources.get(key) ?? "";
        if (!currentValue || usedReferences.has(key))
            return [];
        return [{ ...field, currentValue }];
    });
    const documents = (documentRows ?? []).map((d) => ({
        id: d.id,
        fileName: d.file_name,
        documentType: d.document_type,
        extractionStatus: d.extraction_status,
        sizeBytes: d.size_bytes,
        createdAt: d.created_at,
    }));
    return { categories, facts: facts.map(toFact), documents, availableReferences };
}
async function loadFactHistory(supabase, userId, factId) {
    const { data } = await supabase
        .from("business_profile_fact_history")
        .select("id, fact_id, action, actor, previous_label, new_label, previous_value, new_value, previous_status, new_status, previous_approved_value, new_approved_value, note, created_at")
        .eq("user_id", userId)
        .eq("fact_id", factId)
        .order("created_at", { ascending: false })
        .limit(100);
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
    }));
}
/**
 * The only path for Cherry Blossom™ and the executives to read business
 * information. Returns founder-approved wording only; drafts, needs-review,
 * and retired facts are never included. Not yet connected to any external
 * workflow (deferred to Phase 5).
 */
async function getApprovedBusinessFacts(supabase, userId, options = {}) {
    const profile = await loadBusinessProfile(supabase, userId);
    const categoryLabel = new Map(profile.categories.map((c) => [c.key, c.label]));
    return profile.facts
        .filter((f) => f.status === "approved" && f.approvedValue !== null && f.approvedLabel !== null)
        .filter((f) => !options.categoryKeys || options.categoryKeys.includes(f.categoryKey))
        .map((f) => ({
        id: f.id,
        categoryKey: f.categoryKey,
        categoryLabel: categoryLabel.get(f.categoryKey) ?? f.categoryKey,
        label: f.approvedLabel,
        value: f.approvedValue,
        approvedAt: f.approvedAt,
    }));
}
/**
 * Entry point for future conversational (Cherry Blossom™) and document
 * extraction updates. Proposals are saved as drafts or needs-review items and
 * can never approve themselves — the database rejects approval by any actor
 * other than the founder.
 */
async function proposeBusinessFactChange(supabase, userId, proposal) {
    const sourceType = proposal.actor === "document_extraction" ? "document" : "conversation";
    if (proposal.factId) {
        const { data: existing } = await supabase
            .from("business_profile_facts")
            .select("id, approval_status")
            .eq("id", proposal.factId)
            .eq("user_id", userId)
            .maybeSingle();
        if (!existing)
            return { ok: false, error: "Business fact not found." };
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
            .eq("user_id", userId);
        return error ? { ok: false, error: error.message } : { ok: true, factId: proposal.factId };
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
        .single();
    return error || !data ? { ok: false, error: error?.message ?? "Could not save." } : { ok: true, factId: data.id };
}
