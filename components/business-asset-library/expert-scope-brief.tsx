"use client"

import { useMemo, useState } from "react"
import { Briefcase, Check, Copy } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"

/**
 * ExpertScopeBrief — "Hire an Expert" mode.
 *
 * A Scope of Work brief framed for an outside freelancer or agency, built
 * entirely from the asset's own registry content. No live AI call, and no
 * vendor marketplace — Harmony Lane does not have one yet, so this stops at
 * "here's what to hand someone," not "here's who to hire."
 */
export function ExpertScopeBrief({
  asset,
  communicationStyle,
  onExit,
}: {
  asset: BusinessAsset
  communicationStyle: CommunicationStyle
  onExit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const steps = asset.instructions[communicationStyle]
  const example = asset.examples[communicationStyle]

  const scopeText = useMemo(() => {
    return [
      `SCOPE OF WORK — ${asset.name}`,
      "",
      `Deliverable: ${asset.whatIsThis}`,
      "",
      `Business context: ${asset.whyItMatters}`,
      "",
      "Deliverable must address:",
      ...steps.map((step, i) => `  ${i + 1}. ${step}`),
      "",
      `Reference example of finished quality: ${example}`,
      "",
      "Please deliver as a single document and be available for one round of revisions.",
    ].join("\n")
  }, [asset, steps, example])

  async function handleCopy() {
    await navigator.clipboard.writeText(scopeText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="harmony-panel p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <Briefcase className="h-5 w-5 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Scope of Work</p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink">
            Harmony Lane doesn&apos;t have a vendor marketplace yet, so this won&apos;t connect you to anyone — but
            it will give you a clear, professional brief to hand to a freelancer or agency you already trust.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Deliverable</p>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">{asset.whatIsThis}</p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Business context</p>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">{asset.whyItMatters}</p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Must address</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-brand-ink">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Reference example</p>
        <p className="mt-1.5 text-pretty text-sm italic leading-relaxed text-brand-ink">{example}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleCopy} className="ds-btn-primary">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy scope to send"}
        </button>
        <button type="button" onClick={onExit} className="ds-btn-ghost">
          Back to {asset.name}
        </button>
      </div>
    </div>
  )
}
