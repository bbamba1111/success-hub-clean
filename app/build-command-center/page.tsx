import type { Metadata } from "next"
import { Suspense } from "react"
import { BuildCommandCenterClient } from "@/components/build-command-center/build-command-center-client"

export const metadata: Metadata = {
  title: "Build Command Center™ | Harmony Lane™",
  description:
    "Track every Build Record™ from Build Path™ chosen through installed — milestones, tasks, and what needs your attention right now.",
}

export default function BuildCommandCenterPage() {
  return (
    <Suspense>
      <BuildCommandCenterClient />
    </Suspense>
  )
}
