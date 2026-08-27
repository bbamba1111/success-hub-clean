import { ShoppingBag } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"

/**
 * BuyVsBuildGuidance — "Buy It" mode.
 *
 * Harmony Lane has no vendor marketplace, so this is honest guidance only —
 * clearly labeled, no fabricated vendors or prices. Static and deterministic,
 * derived from the asset's own registry content.
 */
export function BuyVsBuildGuidance({ asset, onExit }: { asset: BusinessAsset; onExit: () => void }) {
  return (
    <div className="harmony-panel p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <ShoppingBag className="h-5 w-5 text-brand-green" aria-hidden />
        </span>
        <div>
          <p className="ds-eyebrow">Buy vs. build</p>
          <p className="mt-1 text-pretty text-sm leading-relaxed text-brand-ink">
            Harmony Lane doesn&apos;t have a vendor marketplace yet, so there&apos;s nothing to purchase here
            directly. What follows is honest guidance to help you decide before you go looking.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5 rounded-xl border border-black/[0.06] bg-brand-cream/60 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
            What &quot;buying&quot; usually means here
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">
            A template, consultant, or off-the-shelf tool that produces something similar to a {asset.name}. That can
            save time, but it rarely reflects your specific Founder Destination™, Communication Style™, or business
            stage the way a built-for-you version does.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
            When buying tends to make sense
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">
            You need something usable today, this asset is not core to your differentiation, or you&apos;ve already
            tried building it yourself and gotten stuck.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">
            When building it yourself tends to win
          </p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">{asset.whyItMatters}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">A reasonable middle path</p>
          <p className="mt-1.5 text-pretty text-sm leading-relaxed text-brand-ink">
            Try &quot;Let AI Do It&quot; first — it produces a complete first draft in minutes. If it&apos;s close,
            you&apos;ve saved the cost of buying. If it&apos;s clearly not enough, you&apos;ll know exactly what to
            shop for.
          </p>
        </div>
      </div>

      <button type="button" onClick={onExit} className="ds-btn-ghost mt-6">
        Back to {asset.name}
      </button>
    </div>
  )
}
