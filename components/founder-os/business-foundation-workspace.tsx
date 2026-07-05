"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, RefreshCw } from "lucide-react"
import { BusinessFoundationAssessment } from "@/components/founder-os/business-foundation-assessment"
import { getBusinessFoundation, type BusinessFoundationRecord } from "@/utils/business-foundation-storage"

/**
 * Workspace — 🌱 Business Foundation Assessment™ (standalone Step 2).
 *
 * First visit (no completed Business Foundation™): render the assessment, which
 * ends with the AI-generated Executive Summary. Once completed, show a calm
 * "foundation set" state with the option to update it at any time.
 */
export function BusinessFoundationWorkspace() {
  const { data, isLoading, mutate } = useSWR<BusinessFoundationRecord | null>(
    "business-foundation",
    getBusinessFoundation,
    { revalidateOnFocus: false },
  )
  const [updating, setUpdating] = useState(false)

  const hasCompleted = Boolean(data?.completedAt)

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-6 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-[#5D9D61]" />
        <span>Loading your Business Foundation™…</span>
      </div>
    )
  }

  // First visit OR explicit update → show the assessment.
  if (!hasCompleted || updating) {
    return (
      <BusinessFoundationAssessment
        initial={data ?? undefined}
        onComplete={() => {
          setUpdating(false)
          mutate()
        }}
      />
    )
  }

  // Completed → calm confirmation with an update path.
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-xl border border-[#5D9D61]/20 bg-[#5D9D61]/5 p-5">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#5D9D61]" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#5D9D61]">Your Business Foundation™ is set</h3>
          <p className="text-sm leading-relaxed text-[#3A2E33]">
            {
              "This is the Blueprint that connects your Human Operating System to your Business Operating System. Every briefing, recommendation, and AI opportunity is personalized from it. You can refine it anytime your business evolves."
            }
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setUpdating(true)}
        className="border-[#5D9D61]/40 bg-transparent text-[#5D9D61] hover:bg-[#5D9D61]/10"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Update Business Foundation™
      </Button>
    </div>
  )
}
