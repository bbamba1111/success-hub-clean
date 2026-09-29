"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, Sparkles, RefreshCw } from "lucide-react"
import { BusinessFoundationAssessment } from "@/components/founder-os/business-foundation-assessment"
import { getBusinessFoundation, type BusinessFoundationRecord } from "@/utils/business-foundation-storage"

/**
 * 🌱 Business Foundation Assessment™ — standalone Step 2 workspace.
 *
 * The Business Blueprint™ that personalizes everything else in the Founder
 * Operating System™. On first visit it renders the assessment. Once completed,
 * it shows a calm "foundation set" state with the option to refine the
 * Blueprint™ as the business evolves.
 */
export function BusinessFoundationWorkspace() {
  const [loading, setLoading] = useState(true)
  const [record, setRecord] = useState<BusinessFoundationRecord | null>(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let active = true
    getBusinessFoundation()
      .then((r) => {
        if (active) setRecord(r)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function refresh() {
    const r = await getBusinessFoundation()
    setRecord(r)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-[#3A2E33]/70">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading your Business Blueprint™…</span>
      </div>
    )
  }

  // First visit (or explicitly re-editing): show the assessment.
  if (!record?.completedAt || editing) {
    return (
      <BusinessFoundationAssessment
        initial={record ?? undefined}
        onComplete={async () => {
          setEditing(false)
          await refresh()
        }}
      />
    )
  }

  // Completed: calm confirmation with an option to refine the Blueprint™.
  const reviewed = record.lastReviewedAt
    ? new Date(record.lastReviewedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-xl border border-[#5D9D61]/25 bg-[#5D9D61]/5 p-5">
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#5D9D61]" />
        <div className="space-y-1">
          <h3 className="font-medium text-[#3A2E33]">Your Business Blueprint™ is set</h3>
          <p className="text-sm leading-relaxed text-[#3A2E33]/80">
            {
              "Cherry Blossom and your AI Executive Leadership Team™ use this to personalize every briefing, recommendation, and conversation."
            }
            {reviewed ? ` Last reviewed ${reviewed}.` : ""}
            {record.version > 1 ? ` (Version ${record.version}.)` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setEditing(true)}
          className="bg-[#5D9D61] text-white hover:bg-[#5D9D61]/90"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refine my Blueprint™
        </Button>
        <span className="inline-flex items-center gap-1.5 text-sm text-[#3A2E33]/60">
          <Sparkles className="h-4 w-4 text-[#5D9D61]" />
          Update anytime your business evolves
        </span>
      </div>
    </div>
  )
}
