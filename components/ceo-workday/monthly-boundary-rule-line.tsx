"use client"

import { ShieldCheck } from "lucide-react"

import { useMonthlyBoundaryFocus } from "@/lib/monthly-boundary-focus/use-monthly-boundary-focus"
import { useHumanSos } from "@/lib/human-sos/use-human-sos"
import { monthlyBuilderKey } from "@/components/ceo-workday/monthly-boundary-focus-panel"

function RuleLine({ builderKey, boundaryText }: { builderKey: string; boundaryText: string }) {
  // Same SWR key as the Builder, so a saved rule appears on the card instantly.
  const { sos } = useHumanSos(builderKey, boundaryText)
  const rule = sos.operatingRuleText?.trim()

  return (
    <div className="mt-3 flex flex-col gap-1 rounded-xl border border-[#7FB069]/30 bg-[#F3F8ED] px-3.5 py-2.5">
      <span className="inline-flex items-center gap-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.16em] text-[#5A7A45]">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        {rule ? "My Boundary Rule™" : "My Monthly Boundary™"}
      </span>
      <p className="line-clamp-2 font-sans text-sm leading-relaxed text-[#2E1F27] text-pretty">
        {rule || boundaryText}
      </p>
    </div>
  )
}

/** Card-face preview of this cycle's monthly boundary rule for the CEO Workday™ card. */
export function MonthlyBoundaryRuleLine() {
  const { focus, entitled, cycleKey } = useMonthlyBoundaryFocus()
  if (!entitled || !cycleKey || !focus) return null
  return <RuleLine builderKey={monthlyBuilderKey(cycleKey)} boundaryText={focus.boundaryText} />
}
