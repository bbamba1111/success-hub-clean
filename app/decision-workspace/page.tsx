import type { Metadata } from "next"
import { Suspense } from "react"
import { DecisionWorkspaceClient } from "./decision-workspace-client"

export const metadata: Metadata = {
  title: "Decision Workspace™ | Harmony",
  description:
    "Run your most important business decisions through 7 executive perspectives and 9 impact dimensions — powered by your Founder Digital Twin™.",
}

export default function DecisionWorkspacePage() {
  return (
    <Suspense>
      <DecisionWorkspaceClient />
    </Suspense>
  )
}
