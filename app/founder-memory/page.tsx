import type { Metadata } from "next"
import { FounderMemoryClient } from "./founder-memory-client"

export const metadata: Metadata = {
  title: "Founder Memory™ | Harmony Lane™",
  description:
    "Every milestone, win, reflection, and decision from your operating journey — remembered by Cherry Blossom and synthesised into pattern insights that keep your coaching contextual.",
}

export default function FounderMemoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <FounderMemoryClient />
    </div>
  )
}
