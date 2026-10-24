import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getWeeklyReport } from "@/lib/boundary-report/weekly-actions"
import { WeeklyResults } from "@/components/weekly-audit/weekly-results"

export const metadata = {
  title: "7-Day Work-Life Balance Results | Harmony Lane",
  description: "A completed Weekly 7-Day Work-Life Balance Audit™ with comparisons to your previous week and 30-day baseline.",
}

export default async function WeeklyAuditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await getWeeklyReport(id)
  if (!record) notFound()

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Link
          href="/my-report"
          className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-brand-coral underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Your Boundary Report™
        </Link>
        <WeeklyResults report={record.report} />
      </div>
    </main>
  )
}
