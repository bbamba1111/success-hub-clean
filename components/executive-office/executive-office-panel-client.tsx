"use client"

/**
 * Executive Office Panel Client™ — Phase 10.3
 * ---------------------------------------------------------------------------
 * Context-connected wrapper that:
 *   1. Reads HarmonyContext™ via useHarmonyContext hook
 *   2. Assembles the HarmonyContextAggregate via assembleHarmonyContext()
 *   3. Derives executive findings, brief, and statuses via the engine
 *   4. Passes all data to the pure ExecutiveOfficePanel component
 *
 * Placed in my-harmony/page.tsx as a client island inside a server page.
 */

import { useMemo } from "react"
import { useHarmonyContext } from "@/components/harmony-context/harmony-context-provider"
import { assembleHarmonyContext } from "@/lib/founder-gps/context/harmony-context-aggregator"
import {
  deriveExecutiveFindings,
  buildExecutiveBrief,
  deriveExecutiveStatuses,
} from "@/lib/executive-office/executive-office-engine"
import { ExecutiveOfficePanel } from "@/components/executive-office/executive-office-panel"

export function ExecutiveOfficePanelClient() {
  const ctx = useHarmonyContext()

  const { findings, brief, statuses } = useMemo(() => {
    const agg = assembleHarmonyContext(ctx)
    const findings = deriveExecutiveFindings(agg)
    const brief = buildExecutiveBrief(findings, agg)
    const statuses = deriveExecutiveStatuses(findings)
    return { findings, brief, statuses }
  }, [ctx])

  return <ExecutiveOfficePanel findings={findings} brief={brief} statuses={statuses} />
}
