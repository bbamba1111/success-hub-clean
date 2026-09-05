import type { Metadata } from "next"
import { ExecutiveHeadquartersClient } from "@/components/executive-headquarters/executive-headquarters-client"

export const metadata: Metadata = {
  title: "Executive Headquarters™ | Harmony Lane™",
  description:
    "Your real-time Founder Operating System™ — Harmony Score™, daily executive focus, operating rhythm, upcoming live experiences, and your complete journey — all in one place.",
}

export default function HeadquartersPage() {
  return (
    <div className="min-h-screen bg-white">
      <ExecutiveHeadquartersClient />
    </div>
  )
}
