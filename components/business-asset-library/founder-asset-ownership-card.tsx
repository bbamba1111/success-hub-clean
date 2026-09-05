"use client"

/**
 * Founder Asset Ownership Card™
 * ---------------------------------------------------------------------------
 * Shows the founder what they actually finished for THIS Business Asset™ —
 * across whichever build mode they used — with a status they control
 * (draft → in-review → approved) and a preview of the reusable export
 * formats this content will one day render into (via the existing
 * Render Engine™ catalog in lib/output-architecture/render-engine.ts).
 *
 * Nothing here invents a new export/format system: it reads the SAME
 * `RENDERERS` catalog every other deliverable will use, and marks each one
 * "Coming soon" since no renderer is wired yet. The only thing that's live
 * today is Copy — every founder can already get their own words out.
 */

import { useState } from "react"
import { Check, Copy, FileText, Pencil, ShieldCheck, Sparkles } from "lucide-react"
import type { BusinessAssetBuildRecord, BusinessAssetReviewStatus } from "@/utils/business-asset-build-storage"
import { setBusinessAssetBuildReviewStatus } from "@/utils/business-asset-build-storage"
import { RENDERERS } from "@/lib/output-architecture/render-engine"
import { getBuildMode } from "@/lib/business-asset-library/build-modes"
import { BUSINESS_STAGES } from "@/lib/business-stage/business-stage"

const STATUS_COPY: Record<BusinessAssetReviewStatus, { label: string; description: string }> = {
  draft: {
    label: "Draft",
    description: "You built this — it's yours. Mark it in review or approved once you've read it over.",
  },
  "in-review": {
    label: "In review",
    description: "You're reviewing this before treating it as final. Approve it when it's ready to use.",
  },
  approved: {
    label: "Approved by you",
    description: "You've approved this as the current, official version of this Business Asset™.",
  },
}

/** A representative slice of the full Render Engine™ catalog — enough to preview the idea without overwhelming the card. */
const PREVIEW_RENDERER_IDS = ["pdf", "markdown", "editable-document", "notion-page"] as const

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return iso
  }
}

export function FounderAssetOwnershipCard({
  assetName,
  executiveName,
  build,
  onStatusChange,
  onEdit,
}: {
  assetName: string
  executiveName: string
  build: BusinessAssetBuildRecord
  onStatusChange: (next: BusinessAssetReviewStatus) => void
  /** Reopens the build flow that produced this asset, resuming the SAME saved build so changes are revised in place instead of starting a new one. */
  onEdit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [updating, setUpdating] = useState(false)

  const status = STATUS_COPY[build.reviewStatus]
  const mode = getBuildMode(build.buildMode)
  const stage = build.businessStage ? BUSINESS_STAGES.find((s) => s.id === build.businessStage) : undefined

  async function handleCopy() {
    if (!build.generatedContent) return
    try {
      await navigator.clipboard.writeText(build.generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  async function handleStatusChange(next: BusinessAssetReviewStatus) {
    if (next === build.reviewStatus || updating) return
    setUpdating(true)
    onStatusChange(next)
    await setBusinessAssetBuildReviewStatus(build.id, next)
    setUpdating(false)
  }

  if (!build.generatedContent) return null

  return (
    <div className="harmony-panel p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
            <ShieldCheck className="h-5 w-5 text-brand-green" aria-hidden />
          </span>
          <div>
            <p className="ds-eyebrow">Your {assetName}</p>
            <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink">
              Built in Harmony Lane with {executiveName}. Owned by you. Ready to take into your business.
            </p>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-full border border-black/[0.08] text-xs font-medium">
          {(Object.keys(STATUS_COPY) as BusinessAssetReviewStatus[]).map((key) => (
            <button
              key={key}
              type="button"
              disabled={updating}
              onClick={() => handleStatusChange(key)}
              aria-pressed={build.reviewStatus === key}
              className={`px-3 py-1.5 transition-colors disabled:cursor-not-allowed ${
                build.reviewStatus === key
                  ? "bg-brand-green text-white"
                  : "bg-transparent text-brand-ink-soft hover:bg-brand-cream"
              }`}
            >
              {STATUS_COPY[key].label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-pretty text-sm leading-relaxed text-brand-ink-soft">{status.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Built with</dt>
          <dd className="mt-1 text-sm text-brand-ink">{mode?.label ?? build.buildMode}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Business Stage™</dt>
          <dd className="mt-1 text-sm text-brand-ink">{stage?.name ?? "Not recorded"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Finished</dt>
          <dd className="mt-1 text-sm text-brand-ink">{formatDate(build.updatedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Version</dt>
          <dd className="mt-1 text-sm text-brand-ink">v{build.version}</dd>
        </div>
      </dl>

      <div className="mt-5 max-h-56 overflow-y-auto rounded-xl border border-black/[0.06] bg-white p-4">
        <p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed text-brand-ink">
          {build.generatedContent}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onEdit} className="ds-btn-primary">
          <Pencil className="h-4 w-4" aria-hidden />
          Edit / Revise
        </button>
        <button type="button" onClick={handleCopy} className="ds-btn-secondary">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy full text"}
        </button>
      </div>

      <div className="mt-6 border-t border-black/[0.06] pt-5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Take it further
        </p>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink-soft">
          Every Business Asset™ you build will eventually export straight into the format you need — no
          re-writing.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PREVIEW_RENDERER_IDS.map((id) => {
            const renderer = RENDERERS.find((r) => r.id === id)
            if (!renderer) return null
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-brand-cream/60 px-3 py-1 text-xs font-medium text-brand-ink-soft"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden />
                {renderer.label}
                <span className="text-brand-ink-soft/70">· Coming soon</span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
