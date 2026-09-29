import { Compass, Hammer, Handshake, Megaphone, Settings2, TrendingUp, Users, type LucideIcon } from "lucide-react"
import type { BusinessAsset, BusinessAssetCategory } from "@/lib/business-asset-library/business-asset-registry"
import { CATEGORY_META } from "@/lib/business-asset-library/category-meta"
import { AssetCard } from "./asset-card"

const ICONS: Record<string, LucideIcon> = {
  Compass,
  Hammer,
  Handshake,
  Megaphone,
  Settings2,
  TrendingUp,
  Users,
}

export function CategorySection({
  category,
  assets,
}: {
  category: BusinessAssetCategory
  assets: BusinessAsset[]
}) {
  const meta = CATEGORY_META[category]
  const Icon = ICONS[meta.icon] ?? Compass

  if (assets.length === 0) return null

  return (
    <section aria-labelledby={`category-${category.replace(/\s+/g, "-").toLowerCase()}`} className="mt-12">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
          <Icon className="h-5 w-5 text-brand-green" aria-hidden />
        </span>
        <div>
          <h2 id={`category-${category.replace(/\s+/g, "-").toLowerCase()}`} className="ds-section-title">
            {category}
          </h2>
          <p className="text-sm text-brand-ink-soft">{meta.tagline}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  )
}
