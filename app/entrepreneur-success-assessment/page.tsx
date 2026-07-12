import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EntrepreneurSuccessAssessment from "@/components/entrepreneur-success/entrepreneur-success-assessment"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"

export const metadata = {
  title: "Entrepreneur Success Assessment™ | Harmony Lane™",
  description:
    "Establish your operating baseline across the Eight Operating Pillars™. No right or wrong answers — we are simply establishing your starting point.",
}

export default function EntrepreneurSuccessAssessmentPage() {
  return (
    <div>
      <div className="px-4 py-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-coral transition-colors hover:text-brand-green"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Cherry Blossom introduction — matches audit/page.tsx pattern exactly */}
      <div className="mx-auto max-w-2xl px-4 pt-2 pb-8">
        <CherryBlossomGuidance greeting="Let&apos;s establish your starting point.">
          <p>
            During the past 30 days you&apos;ve developed habits, routines and business practices — some
            intentionally, others by default.
          </p>
          <p>
            This assessment helps me understand how you&apos;ve been operating your business so I can personalize
            Harmony Lane&trade; specifically for you.
          </p>
          <p>There are no right or wrong answers. We are simply establishing your starting point.</p>
        </CherryBlossomGuidance>
      </div>

      <EntrepreneurSuccessAssessment />
    </div>
  )
}
