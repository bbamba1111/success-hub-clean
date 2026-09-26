import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"

/**
 * AssetCard — a single Business Asset™ on the library grid.
 * Presentation only: shows the canonical short description (style-neutral)
 * so the grid stays scannable; the adaptive explanation lives on the detail
 * page, where the founder's Communication Style™ is read.
 */
export function AssetCard({ asset }: { asset: BusinessAsset }) {
  const owners = asset.ownerExecutiveIds.map((id) => getExecutive(id)?.name).filter(Boolean) as string[]

  return (
    <Link
      href={`/business-asset-library/${asset.id}`}
      className="ds-card-interactive ds-card-pad group flex h-full flex-col"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-ink-soft/70">{asset.category}</p>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-brand-ink">{asset.name}</h3>
      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-brand-ink-soft">{asset.shortDescription}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
        <p className="truncate text-xs text-brand-ink-soft/80">
          {owners.length > 0 ? owners.join(" · ") : "Cherry Blossom™"}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-green ds-transition group-hover:gap-1.5">
          View
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
