import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function LedgerMavenPage() {
  const executive = getExecutive("ledger-maven")

  if (!executive) {
    return <div>Executive not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/ai-executive-team"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#E26C73] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Executive Team
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Ledger Maven</h1>
          <p className="text-xl text-gray-600">CFO - Financial Strategy</p>
        </div>

        <ChatShell executive={executive} />
      </div>
    </div>
  )
}
