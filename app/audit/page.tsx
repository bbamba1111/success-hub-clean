import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"

export default function AuditPage() {
  return (
    <div>
      <div className="p-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#E26C73] hover:text-[#7FB069] transition-colors duration-200 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <WorkLifeBalanceAudit />
    </div>
  )
}