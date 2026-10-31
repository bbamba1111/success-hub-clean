import type { CeoBusinessFunction } from "./plan-types"

type ChipStyle = { idle: string; active: string }

const BASE =
  "rounded-full border px-3 py-1.5 font-montserrat text-[14px] font-bold tracking-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"

const GREEN_ACTIVE =
  "border-[#7E9C72] bg-[#E1EDD9] text-[#3F5A36] shadow-md ring-2 ring-[#7E9C72]/30 ring-offset-1"

const STYLES: Partial<Record<CeoBusinessFunction, ChipStyle>> = {
  "client-attraction": {
    idle: "border-[#DCE6D3] bg-[#F3F8ED] text-[#4F6B44] focus-visible:ring-[#7E9C72]",
    active: GREEN_ACTIVE,
  },
  "sales-conversion": {
    idle: "border-[#D3DFCB] bg-[#EBF2E5] text-[#4A6440] focus-visible:ring-[#7E9C72]",
    active: GREEN_ACTIVE,
  },
  delivery: {
    idle: "border-[#E4D6C1] bg-[#F7F0E5] text-[#7A6243] focus-visible:ring-[#C9AE86]",
    active: GREEN_ACTIVE,
  },
  operations: {
    idle: "border-[#CDD9C6] bg-[#DFE8DA] text-[#435C3B] focus-visible:ring-[#7E9C72]",
    active: GREEN_ACTIVE,
  },
  "operations-design": {
    idle: "border-[#DEDCDC] bg-[#F1F0F0] text-[#55604F] focus-visible:ring-[#7E9C72]",
    active: GREEN_ACTIVE,
  },
}

const FALLBACK: ChipStyle = {
  idle: "border-[#E8DFE2] bg-white text-[#6B5860]",
  active: "border-[#3A2E33] bg-[#3A2E33] text-white shadow-md",
}

export function functionChipClass(fn: CeoBusinessFunction, selected: boolean): string {
  const style = STYLES[fn] ?? FALLBACK
  return `${BASE} ${selected ? style.active : style.idle}`
}
