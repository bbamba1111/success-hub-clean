import Link from "next/link"
import { Check } from "lucide-react"

/**
 * Shown on the Work-Life Balance Audit™ and Entrepreneur Success
 * Assessment™ pages when the founder's Monday Weekly Measurement™ for the
 * current week is already complete — per the weekly assessment rule,
 * these measurements are locked until the next Monday so the founder's
 * data stays clean and isn't retaken mid-week.
 */
export function AlreadyMeasuredNotice({
  title,
  resultsUrl,
  resultsLabel,
}: {
  title: string
  resultsUrl: string
  resultsLabel: string
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
        <Check className="h-7 w-7 text-brand-green" aria-hidden />
      </span>
      <h1 className="font-playfair text-3xl font-bold text-balance text-brand-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-brand-ink-soft leading-relaxed text-pretty">
        Your Monday Weekly Measurement™ is complete for this week. Your results remain available
        to guide your Work-Life Balance Business Week™ — the next measurement opens next Monday.
      </p>
      <Link
        href={resultsUrl}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark"
      >
        {resultsLabel}
      </Link>
    </div>
  )
}
