import type { Metadata } from "next"
import { ExecutiveReviewsClient } from "./executive-reviews-client"

export const metadata: Metadata = {
  title: "Executive Review Engine™ | Work-Life Balance Operating System",
  description:
    "Your weekly, monthly, and quarterly operating reviews — synthesised from your GPS history, adaptation data, and installation profile. No manual input required.",
}

export default function ExecutiveReviewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <ExecutiveReviewsClient />
    </main>
  )
}
