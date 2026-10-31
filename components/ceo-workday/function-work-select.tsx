"use client"

import { ChevronDown } from "lucide-react"
import type { CeoBusinessFunction } from "@/lib/ceo-workday/plan-types"
import { workOptionsFor, type FunctionWorkOption } from "@/lib/ceo-workday/function-work-options"

const WRITE_MY_OWN = "__own__"

export function FunctionWorkSelect({
  id,
  fn,
  value,
  onSelect,
}: {
  id: string
  fn: CeoBusinessFunction | null
  /** The current "What needs to happen?" text, so a matching option shows as selected. */
  value: string
  onSelect: (option: FunctionWorkOption | null) => void
}) {
  const options = workOptionsFor(fn)
  if (options.length === 0) return null

  const selectedIndex = options.findIndex((o) => o.work === value)
  const selectValue = selectedIndex >= 0 ? String(selectedIndex) : value ? WRITE_MY_OWN : ""

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Choose a suggested piece of work
      </label>
      <select
        id={id}
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value
          if (v === WRITE_MY_OWN || v === "") onSelect(null)
          else onSelect(options[Number(v)] ?? null)
        }}
        className="w-full appearance-none rounded-lg border border-[#E8DFE2] bg-white py-2.5 pl-3 pr-9 font-sans text-sm text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#7FB069]/40"
      >
        <option value="" disabled>
          Choose from common work for this function…
        </option>
        {options.map((o, i) => (
          <option key={o.work} value={String(i)}>
            {o.work}
          </option>
        ))}
        <option value={WRITE_MY_OWN}>Something else — I&apos;ll write my own</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B835F]"
        aria-hidden
      />
    </div>
  )
}
