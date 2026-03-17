import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"

export default function SundayShiftAuditPage() {
  return (
    <div>
      <div className="p-4 max-w-6xl mx-auto">
        <Link
          href="/sunday-shift"
          className="inline-flex items-center gap-2 text-[#7FB069] hover:text-[#E26C73] transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sunday Shift
        </Link>
      </div>
      <WorkLifeBalanceAudit resultsUrl="/sunday-shift/my-results" />
    </div>
  )
}
