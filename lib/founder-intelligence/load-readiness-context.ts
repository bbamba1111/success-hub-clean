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
