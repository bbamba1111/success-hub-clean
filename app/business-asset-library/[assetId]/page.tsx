import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BackLink } from "@/components/navigation/page-nav"
import { AssetDetailView } from "@/components/business-asset-library/asset-detail-view"
import { BUSINESS_ASSETS, getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"

export function generateStaticParams() {
  return BUSINESS_ASSETS.map((asset) => ({ assetId: asset.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>
}): Promise<Metadata> {
  const { assetId } = await params
  const asset = getBusinessAsset(assetId)
  return {
    title: asset ? `${asset.name} | Business Asset Library™` : "Business Asset Library™",
    description: asset?.whatIsThis ?? "A Harmony Lane™ Business Asset™.",
  }
}

export default async function BusinessAssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>
}) {
  const { assetId } = await params
  const asset = getBusinessAsset(assetId)
  if (!asset) notFound()

  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6">
        <div className="pt-8">
          <BackLink href="/business-asset-library" label="Back to Business Asset Library™" />
        </div>

        <div className="mt-8">
          <AssetDetailView asset={asset} />
        </div>
      </div>
    </main>
  )
}
