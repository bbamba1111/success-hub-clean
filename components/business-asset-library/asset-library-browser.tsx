import { ALL_BUSINESS_ASSET_CATEGORIES, getAssetsByCategory } from "@/lib/business-asset-library/business-asset-registry"
import { RecommendedForYou } from "./recommended-for-you"
import { CategorySection } from "./category-section"

/**
 * AssetLibraryBrowser — the Business Asset Library™ hub content: a
 * "Recommended For You" rail (client, reads Business Stage™) followed by all
 * seven categories in build order. Server-renderable except the recommended
 * rail, which hydrates on the client.
 */
export function AssetLibraryBrowser() {
  return (
    <div>
      <RecommendedForYou />
      {ALL_BUSINESS_ASSET_CATEGORIES.map((category) => (
        <CategorySection key={category} category={category} assets={getAssetsByCategory(category)} />
      ))}
    </div>
  )
}
