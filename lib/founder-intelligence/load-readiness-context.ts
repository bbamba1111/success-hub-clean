"use client"

/**
 * Client-side loader for the optional Readiness Relevance™ evidence
 * (Phase 4) `assembleOperatingBrief` can be given.
 *
 * Reads the SAME storage utility the Entrepreneur Success Assessment™
 * feature already uses — no new persistence, no schema, no duplication of
 * `assembleHarmonySnapshot()`'s job (that aggregator remains unwired at
 * large; this loader only feeds the one consumer this phase owns). Never
 * throws; every field degrades to a safe null when the founder hasn't
 * completed the underlying assessment yet.
 *
 * Deliberately does NOT read the Work-Life Balance Audit™ — it belongs to
 * the separate Work-Life Balance Operating System™ and must never feed the
 * Business Builder™'s Readiness Capability™ reasoning.
 */

import { getEsaHistory } from "@/lib/entrepreneur-success/esa-storage"
import type { OperatingBriefExtra } from "./founder-intelligence"
import type { HarmonyContextSnapshot } from "@/lib/harmony-context/engine"

/**
 * Assembles the `extra` object `assembleOperatingBrief(ctx, extra)` accepts.
 * Safe to call on the client; never throws.
 */
export function loadReadinessContext(): OperatingBriefExtra {
  try {
    const latestEsa = getEsaHistory()[0] ?? null

    return {
      esaResults: latestEsa,
    }
  } catch {
    return { esaResults: null }
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
    // Business Model Profile™ (Phase 9B) / Business Operating Fingerprint™
    // (Phase 9A) passthrough — additive, Phase 9D. `assembleOperatingBrief()`
    // does not read these yet; this only makes them available.
    businessModelProfile: snapshot.businessModelProfile,
    businessOperatingFingerprint: snapshot.businessOperatingFingerprint,
  }
}
