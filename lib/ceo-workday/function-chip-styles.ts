import type { CeoBusinessFunction } from "./plan-types"

type ChipStyle = { idle: string; active: string }

const BASE =
  "rounded-full border px-3 py-1.5 font-montserrat text-[14px] font-bold tracking-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"

const STYLES: Partial<Record<CeoBusinessFunction, ChipStyle>> = {
  "client-attraction": {
    idle: "border-[#CFDCC6] bg-[#EEF4EA] text-[#4F6B44] focus-visible:ring-[#8FAE7F]",
    active: "border-[#5F8A4E] bg-[#5F8A4E] text-white shadow-md ring-2 ring-[#5F8A4E]/30 ring-offset-1",
  },
  "sales-conversion": {
    idle: "border-[#EDCFD8] bg-[#FBEFF3] text-[#8A4A5E] focus-visible:ring-[#D9A0B2]",
    active: "border-[#B5677F] bg-[#B5677F] text-white shadow-md ring-2 ring-[#B5677F]/30 ring-offset-1",
  },
  delivery: {
    idle: "border-[#E4D6C1] bg-[#F7F0E5] text-[#7A6243] focus-visible:ring-[#C9AE86]",
    active: "border-[#A98758] bg-[#A98758] text-white shadow-md ring-2 ring-[#A98758]/30 ring-offset-1",
  },
  operations: {
    idle: "border-[#C9D6CE] bg-[#EAF1EC] text-[#456556] focus-visible:ring-[#86A796]",
    active: "border-[#557A68] bg-[#557A68] text-white shadow-md ring-2 ring-[#557A68]/30 ring-offset-1",
  },
  "operations-design": {
    idle: "border-[#E8D3CB] bg-[#F8EEEA] text-[#835648] focus-visible:ring-[#CFA597]",
    active: "border-[#A9705F] bg-[#A9705F] text-white shadow-md ring-2 ring-[#A9705F]/30 ring-offset-1",
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
