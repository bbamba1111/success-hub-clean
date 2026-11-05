import type { CeoBusinessFunction } from "./plan-types"

type ChipStyle = { idle: string; active: string }

const BASE =
  "rounded-full border px-3 py-1.5 font-montserrat text-[14px] font-bold tracking-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"

const TAN_ACTIVE =
  "-translate-y-0.5 border-[#C9AE86] bg-[#F7F0E5] text-[#7A6243] shadow-md ring-2 ring-[#C9AE86]/40 ring-offset-1"

const TAN: ChipStyle = {
  idle: "border-[#C5D9BA] bg-[#E1EDD9] text-[#3F5A36] focus-visible:ring-[#7E9C72]",
  active: TAN_ACTIVE,
}

const STYLES: Partial<Record<CeoBusinessFunction, ChipStyle>> = {
  "client-attraction": TAN,
  "sales-conversion": TAN,
  delivery: TAN,
  operations: TAN,
  "operations-design": TAN,
  "trust-experiences": TAN,
  "thought-leadership": TAN,
  "own-work": TAN,
}

const FALLBACK: ChipStyle = {
  idle: "border-[#E8DFE2] bg-white text-[#6B5860]",
  active: "border-[#3A2E33] bg-[#3A2E33] text-white shadow-md",
}

export function functionChipClass(fn: CeoBusinessFunction, selected: boolean): string {
  const style = STYLES[fn] ?? FALLBACK
  return `${BASE} ${selected ? style.active : style.idle}`
}
