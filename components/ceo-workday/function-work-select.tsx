"use client"

import type { CeoBusinessFunction } from "@/lib/ceo-workday/plan-types"
import { workOptionsFor, type FunctionWorkOption } from "@/lib/ceo-workday/function-work-options"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const WRITE_MY_OWN = "__own__"

const ITEM_CLASS =
  "cursor-pointer font-sans text-sm text-[#5C4A33] hover:bg-[#FBF6EE] focus:bg-[#FBF6EE] focus:text-[#5C4A33] data-[highlighted]:bg-[#FBF6EE] data-[highlighted]:text-[#5C4A33] data-[state=checked]:font-bold"

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
    <div>
      <label htmlFor={id} className="sr-only">
        Choose a suggested piece of work
      </label>
      <Select
        value={selectValue}
        onValueChange={(v) => {
          if (v === WRITE_MY_OWN) onSelect(null)
          else onSelect(options[Number(v)] ?? null)
        }}
      >
        <SelectTrigger
          id={id}
          className={`h-auto cursor-pointer rounded-lg border-[#C9AE86] bg-[#F7F0E5] py-2.5 pl-3 pr-3 text-left font-sans text-sm text-[#5C4A33] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-md focus:ring-2 focus:ring-[#C9AE86]/40 focus:ring-offset-0 data-[placeholder]:font-normal data-[placeholder]:text-[#7A6243] [&>svg]:text-[#7A6243] [&>svg]:opacity-100 ${
            selectValue ? "font-bold" : "font-normal"
          }`}
        >
          <SelectValue placeholder="Click here to choose from common work…" />
        </SelectTrigger>
        <SelectContent className="border-[#C9AE86] bg-[#FFFDF9]">
          {options.map((o, i) => (
            <SelectItem key={o.work} value={String(i)} className={ITEM_CLASS}>
              {o.work}
            </SelectItem>
          ))}
          <SelectItem value={WRITE_MY_OWN} className={ITEM_CLASS}>
            Something else — I&apos;ll write my own
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
