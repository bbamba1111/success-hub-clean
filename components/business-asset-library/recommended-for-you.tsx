"use client"

/**
 * RecommendedForYou — Business Asset Library™ (Phase 12.1)
 *
 * Reads the founder's current Business Stage™ from the existing session store
 * and surfaces the assets emphasized for that stage. This is emphasis, not a
 * gate — every asset stays reachable by browsing the categories below. Mirrors
 * the read pattern used by business-comprehension-card.tsx (mount, then
 * hydrate from the store; listen for the change event so it stays live).
 */

import { useEffect, useState } from "react"
import { Compass } from "lucide-react"
import { BUSINESS_STAGE_EVENT, getBusinessStage } from "@/lib/business-stage/business-stage-store"
import { getBusinessStage as getStageDef, type BusinessStage } from "@/lib/business-stage/business-stage"
import { getRecommendedAssetsForStage } from "@/lib/business-asset-library/business-asset-registry"
import { AssetCard } from "./asset-card"

export function RecommendedForYou() {
  const [stage, setStage] = useState<BusinessStage>("launch")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setStage(getBusinessStage())
    setMounted(true)
    const onChange = () => setStage(getBusinessStage())
    window.addEventListener(BUSINESS_STAGE_EVENT, onChange)
    return () => window.removeEventListener(BUSINESS_STAGE_EVENT, onChange)
  }, [])

  if (!mounted) return null

  const stageDef = getStageDef(stage)
  const recommended = getRecommendedAssetsForStage(stage).slice(0, 3)

  if (recommended.length === 0) return null

  return (
    <section aria-labelledby="recommended-heading" className="mt-10">
      <div className="harmony-panel p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-coral/10">
            <Compass className="h-5 w-5 text-brand-coral" aria-hidden />
          </span>
          <div>
            <p className="ds-eyebrow">Recommended For You</p>
            <h2 id="recommended-heading" className="mt-1 font-display text-xl font-semibold tracking-tight text-brand-ink">
              Well-matched for your {stageDef.name} stage
            </h2>
            <p className="mt-1 text-sm text-brand-ink-soft" suppressHydrationWarning>
              {stageDef.tagline}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    </section>
  )
}
