"use client"

/**
 * Client-side loader for the optional Readiness Relevance™ evidence
 * (Phase 4) `assembleOperatingBrief` can be given.
 *
 * Reads the SAME storage utilities the Entrepreneur Success Assessment™ and
 * Work-Life Balance Audit™ features already use — no new persistence, no
 * schema, no duplication of `assembleHarmonySnapshot()`'s job (that
 * aggregator remains unwired at large; this loader only feeds the one
 * consumer this phase owns). Never throws; every field degrades to a safe
 * null when the founder hasn't completed the underlying assessment yet.
 */

import { getEsaHistory } from "@/lib/entrepreneur-success/esa-storage"
import { getAuditResults } from "@/utils/audit-storage"
import type { OperatingBriefExtra } from "./founder-intelligence"
import type { HarmonyContextSnapshot } from "@/lib/harmony-context/engine"

/**
 * Assembles the `extra` object `assembleOperatingBrief(ctx, extra)` accepts.
 * Safe to call on the client; never throws.
 */
export function loadReadinessContext(): OperatingBriefExtra {
  try {
    const latestEsa = getEsaHistory()[0] ?? null
    const audit = getAuditResults()

    return {
      esaResults: latestEsa,
      workLifeBalanceScore: audit?.overallScore ?? null,
      hasCompletedAudit: !!audit,
    }
  } catch {
    return { esaResults: null, workLifeBalanceScore: null, hasCompletedAudit: false }
  }
}

/**
 * Phase 6.2 sibling — reads the same `OperatingBriefExtra` shape straight off
 * the canonical `HarmonyContextSnapshot` instead of hitting localStorage
 * directly. Prefer this inside `<HarmonyProvider>`, where the snapshot is
 * already assembled once for every consumer; `loadReadinessContext()` above
 * remains the fallback for callers outside the provider tree (e.g. isolated
 * testing of the still-dormant `OperatingBrief` component).
 */
export function loadReadinessContextFromSnapshot(snapshot: HarmonyContextSnapshot): OperatingBriefExtra {
  return {
    esaResults: snapshot.business.esaResults,
    workLifeBalanceScore: snapshot.business.workLifeBalanceScore,
    hasCompletedAudit: snapshot.business.hasCompletedAudit,
  }
}
