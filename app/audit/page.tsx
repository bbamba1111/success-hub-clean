import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { CherryBlossomGuidance } from "@/components/cherry-blossom/cherry-blossom-guidance"

export default function AuditPage() {
  return (
    <div>
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-medium text-brand-coral transition-colors duration-200 hover:text-brand-green"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Cherry Blossom sets the tone before the Reality Check™ — the software
          no longer explains the audit; she coaches the founder into it. */}
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <CherryBlossomGuidance greeting="Let's begin with a gentle Reality Check™.">
          <p>
            Before we design your next week, let&apos;s quietly understand where life feels balanced and where it&apos;s
            asking for more attention.
          </p>
          <p>There are no right or wrong answers here. We&apos;re simply creating awareness together.</p>
        </CherryBlossomGuidance>
      </div>

      <WorkLifeBalanceAudit />
    </div>
  )
}
