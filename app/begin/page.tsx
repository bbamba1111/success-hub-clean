import type { Metadata } from "next"
import { SundayRitual } from "@/components/sunday-design-day/sunday-ritual"

export const metadata: Metadata = {
  title: "Sunday Design Day™ | Make Time For More™",
  description:
    "Design Tomorrow. Live It Tomorrow.™ Move through one calm weekly ritual — Reality Check, Download & Delegate, Design Tomorrow, and Commit & Prepare — one page at a time.",
}

export default function BeginPage() {
  return <SundayRitual />
}
