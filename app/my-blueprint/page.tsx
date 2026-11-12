import type { Metadata } from "next"
import { MyBlueprintClient } from "@/components/my-blueprint/my-blueprint-client"
import { BoundaryReportSummary } from "@/components/boundary-report/boundary-report-summary"
import { WeeklyHistoryList } from "@/components/weekly-audit/weekly-history-list"

export const metadata: Metadata = {
  title: "My Work-Life Harmony Blueprint™ | Harmony Lane™",
  description:
    "Your one-time Work-Life Balance Reality Check™ and Boundary Report™, optional weekly Work-Life Balance Audit™ history, founder and business profiles, Business Week experience, and completed business assets.",
}

export default function MyBlueprintPage() {
  return (
    <MyBlueprintClient
      boundaryReport={<BoundaryReportSummary />}
      weeklyAuditHistory={<WeeklyHistoryList />}
    />
  )
}
