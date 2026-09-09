"use client"

/**
 * Executive Office Panel Client™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * Builds HarmonyContextAggregate directly from localStorage stores — no
 * HarmonyProvider required — then derives executive findings, brief, and
 * statuses via the engine and passes them to the pure ExecutiveOfficePanel.
 *
 * Placed in my-harmony/page.tsx as a client island inside a server page.
 */

import { useState, useEffect } from "react"
import { assembleHarmonyContext } from "@/lib/founder-gps/context/harmony-context-aggregator"
import { getBbaSignalSummary, type BbaSignalSummary } from "@/lib/founder-gps/context/bba-context-aggregator"
import {
  deriveExecutiveFindings,
  buildExecutiveBrief,
  deriveExecutiveStatuses,
} from "@/lib/executive-office/executive-office-engine"
import { ExecutiveOfficePanel } from "@/components/executive-office/executive-office-panel"
import type { ExecutiveFinding, ExecutiveBrief, ExecutiveStatusRow } from "@/lib/executive-office/types"

type Derived = {
  findings: ExecutiveFinding[]
  brief: ExecutiveBrief
  statuses: ExecutiveStatusRow[]
}

export function ExecutiveOfficePanelClient() {
  const [derived, setDerived] = useState<Derived | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getBusinessContext, saveBusinessContext } = require("@/lib/business-context/business-context-store")
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getBusinessStage } = require("@/lib/business-stage/business-stage-store")
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { analyzePatterns } = require("@/lib/harmony-memory/pattern-recognition-engine")
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getBusinessContextFromDb } = require("@/utils/business-context-storage")

    // Business Bottleneck Audit™ (BBA™) signals — server-only data, fetched
    // once via the getBbaSignalSummary() Server Action and re-applied to
    // whatever business-context snapshot is current when it resolves.
    // Stays undefined (never a false "no BBA data" default) until fetched.
    let latestBba: BbaSignalSummary | undefined

    const buildDerived = (bc: ReturnType<typeof getBusinessContext>) => {
      try {
        const stage = getBusinessStage()
        const gpsHistory = getRecommendationHistory()
        const patterns = analyzePatterns(gpsHistory).slice(0, 3)

        // Build a minimal context object that satisfies assembleHarmonyContext
        const miniCtx = {
          ready: true,
          businessStage: stage,
          businessContext: bc,
          patternSignals: patterns,
          hasDesignedWeek: gpsHistory.length > 0,
        }

        const agg = assembleHarmonyContext(miniCtx as Parameters<typeof assembleHarmonyContext>[0], latestBba)
        const findings = deriveExecutiveFindings(agg)
        const brief = buildExecutiveBrief(findings, agg)
        const statuses = deriveExecutiveStatuses(findings)
        setDerived({ findings, brief, statuses })
      } catch {
        // no-op — component will render loading state
      }
    }

    // Instant paint from the local cache, then reconcile with the database —
    // the account's canonical Business Context Profile™ — once it resolves.
    buildDerived(getBusinessContext())
    getBusinessContextFromDb().then((record: { updatedAt: string | null } | null) => {
      if (!record) return
      const { updatedAt: _updatedAt, ...profile } = record
      saveBusinessContext(profile)
      buildDerived(profile)
    })

    // Best-effort: anonymous sessions resolve to no BBA signals and the
    // aggregate still assembles cleanly (see assembleHarmonyContext's
    // degrades-gracefully contract).
    import("@/lib/supabase/client").then(({ createClient }) =>
      createClient()
        .auth.getUser()
        .then(({ data }) => data.user?.id ?? null),
    ).then((userId) => {
      if (!userId) return null
      return getBbaSignalSummary(userId)
    }).then((summary) => {
      if (!summary) return
      latestBba = summary
      buildDerived(getBusinessContext())
    }).catch(() => {
      // no-op — BBA signals simply stay unavailable
    })
  }, [])

  if (!derived) {
    return (
      <div className="rounded-xl border border-black/[0.07] bg-card px-6 py-8 text-center">
        <p className="font-montserrat text-sm text-brand-ink-soft">
          Your Executive Office™ is building as context is loaded...
        </p>
      </div>
    )
  }

  return <ExecutiveOfficePanel findings={derived.findings} brief={derived.brief} statuses={derived.statuses} />
}
