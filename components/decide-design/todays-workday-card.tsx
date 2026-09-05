"use client"

/**
 * Today's Workday Card — lives inside the "4-Hour Focused CEO Workday"
 * panel in Decide & Design™. Reads back the day the founder saved (her
 * Workday Declaration™ and What Must Happen Today™) and lets her change it.
 * The Supabase plan is the single source; this is a mirror, not a copy.
 */

import { useCallback, useEffect, useState } from "react"
import { Pencil } from "lucide-react"

import { getDateKey } from "@/lib/daily-plan/storage"
import { CEO_WORKDAY_DECLARATION_EVENT } from "@/lib/daily-plan/ceo-workday-declaration"
import { getCeoWorkdayPlan } from "@/lib/ceo-workday/plan-server"
import { CEO_ITEM_STATUS_LABEL, type CeoWorkdayPlan } from "@/lib/ceo-workday/plan-types"

export function TodaysWorkdayCard({ onEdit }: { onEdit: () => void }) {
  const dateKey = getDateKey()
  const [plan, setPlan] = useState<CeoWorkdayPlan | null>(null)
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    setPlan(await getCeoWorkdayPlan(dateKey))
    setLoaded(true)
  }, [dateKey])

  useEffect(() => {
    void refresh()
    window.addEventListener(CEO_WORKDAY_DECLARATION_EVENT, refresh)
    return () => window.removeEventListener(CEO_WORKDAY_DECLARATION_EVENT, refresh)
  }, [refresh])

  if (!loaded) return null

  const items = plan?.items.filter((i) => i.founderDecision !== "remove" && i.status !== "eliminated") ?? []

  if (!plan || (!plan.declaration && items.length === 0)) {
    return (
      <p className="font-sans text-sm text-[#6B5860] leading-relaxed">
        Today&apos;s workday hasn&apos;t been saved yet. Name what must happen today above and press{" "}
        <span className="font-semibold text-[#2E1F27]">Save My Day</span>.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {plan.declaration && (
        <blockquote className="rounded-2xl border border-[#7FB069]/25 bg-[#F7FBF4] px-5 py-4">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            My Workday Declaration™
          </p>
          <p className="mt-2 font-serif text-lg italic leading-relaxed text-[#2E1F27] text-pretty">{plan.declaration}</p>
        </blockquote>
      )}

      {items.length > 0 && (
        <div className="space-y-2">
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
            What Must Happen Today™
          </p>
          <ol className="space-y-2">
            {items.map((i, idx) => (
              <li key={i.id} className="flex items-start gap-3 rounded-2xl border border-[#E8DFE2] bg-white px-4 py-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8DAE72] font-sans text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-[#2E1F27]">{i.title}</p>
                  {i.expectedEvidence && <p className="mt-0.5 font-sans text-xs text-[#6B5860]">Done when: {i.expectedEvidence}</p>}
                </div>
                <span className="rounded-full bg-[#F4F1EC] px-2 py-0.5 font-montserrat text-[9px] font-bold uppercase tracking-[0.1em] text-[#6B5860]">
                  {CEO_ITEM_STATUS_LABEL[i.status]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#5A7A45] px-4 py-2 font-sans text-xs font-bold text-[#5A7A45] hover:bg-[#5A7A45]/5"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit my workday
        </button>
        <p className="font-sans text-xs text-[#6B5860]">
          {plan.plannedMinutes} of 240 minutes · {items.length} {items.length === 1 ? "piece" : "pieces"} of work
        </p>
      </div>
    </div>
  )
}
