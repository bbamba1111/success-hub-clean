import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { WeeklyAuditFlow } from "@/components/weekly-audit/weekly-audit-flow"

export const metadata = {
  title: "Weekly 7-Day Work-Life Balance Audit™ | Harmony Lane™",
  description: "Review the past seven days and refresh your Priority Focus Areas™ for the week ahead.",
}

/**
 * Dedicated weekly assessment route.
 * This deliberately mounts WeeklyAuditFlow rather than the cadence-aware
 * /audit route, so a founder retaking the weekly audit can never be sent
 * through the one-time 30-day baseline.
 */
export default function WeeklyAuditPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 font-sans text-sm font-semibold text-brand-sage-dark hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Decide &amp; Design™
        </Link>
        <header className="space-y-2 text-center">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-brand-sage-dark">
            Monday Weekly Review
          </p>
          <h1 className="font-playfair text-3xl font-bold text-brand-ink sm:text-4xl">
            Weekly 7-Day Work-Life Balance Audit™
          </h1>
          <p className="mx-auto max-w-2xl font-sans text-sm leading-relaxed text-brand-ink-soft">
            Review the past seven days. Your 30-day baseline remains unchanged.
            Use this weekly review to refresh the priorities you want to carry into the week ahead.
          </p>
        </header>
      </div>
      <WeeklyAuditFlow />
    </main>
  )
}
