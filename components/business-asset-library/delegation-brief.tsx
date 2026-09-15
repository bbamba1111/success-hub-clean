"use client"

import { useMemo, useState } from "react"
import { Check, Copy, Users } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import type { CommunicationStyle } from "@/lib/business-comprehension/business-comprehension"

/**
 * DelegationBrief — "Give It to My Team" mode.
 *
 * A ready-to-send brief a founder can hand to a team member, built entirely
 * from the asset's own registry content (explanation, guided steps, worked
 * example) for the founder's chosen Communication Style™. No live AI call —
 * fully deterministic, matching the "static-brief" framing in build-modes.ts.
 */
export function DelegationBrief({
  asset,
  communicationStyle,
  executiveName,
  onExit,
}: {
  asset: BusinessAsset
  communicationStyle: CommunicationStyle
  executiveName: string
  onExit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const explanation = asset.explanations[communicationStyle]
  const steps = asset.instructions[communicationStyle]
  const example = asset.examples[communicationStyle]

  const briefText = useMemo(() => {
    return [
      `DELEGATION BRIEF — ${asset.name}`,
      "",
      `What we're building: ${asset.whatIsThis}`,
      "",
      `Why it matters: ${asset.whyItMatters}`,
      "",
      "What to do:",
      ...steps.map((step, i) => `  ${i + 1}. ${step}`),
      "",
      `Example of the finished result: ${example}`,
      "",
      `When it's done, bring it back for review. Prepared with ${executiveName} inside Harmony Lane™.`,
    ].join("\n")
  }, [asset, steps, example, executiveName])

  async function handleCopy() {
    await navigator.clipboard.writeText(briefText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="harmony-panel p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <Users className="h-5 w-5 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Delegation Brief™</p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink">
            Copy this and send it to whoever on your team is going to build this — it&apos;s written so they can
            start right away, without needing you to explain it first.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">{explanation.headline}</p>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">{explanation.body}</p>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">What to do</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-brand-ink">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
          Example of the finished result
        </p>
        <p className="mt-1.5 text-pretty text-sm italic leading-relaxed text-brand-ink">{example}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={handleCopy} className="ds-btn-primary">
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Copied" : "Copy brief to send"}
        </button>
        <button type="button" onClick={onExit} className="ds-btn-ghost">
          Back to {asset.name}
        </button>
      </div>
    </div>
  )
}
