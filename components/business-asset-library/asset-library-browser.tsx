import { ALL_BUSINESS_ASSET_CATEGORIES, getAssetsByCategory } from "@/lib/business-asset-library/business-asset-registry"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { FounderGpsRecommendationPanel } from "./founder-gps-recommendation-panel"
import { RecommendedForYou } from "./recommended-for-you"
import { CategorySection } from "./category-section"

/**
 * AssetLibraryBrowser — the Business Asset Library™ hub content.
 *
 * "Decision 1" — what should I work on? — surfaces first: the real Founder
 * GPS™ Next Best Move™ (if one exists), then the existing stage-based
 * "Recommended For You" rail, then every category in build order.
 * <HarmonyProvider> is mounted here (not previously present on this route)
 * so the GPS panel can read the canonical snapshot; server-renderable except
 * the client rails, which hydrate on the client.
 */
export function AssetLibraryBrowser() {
  return (
    <HarmonyProvider>
      <FounderGpsRecommendationPanel />
      <RecommendedForYou />
      {ALL_BUSINESS_ASSET_CATEGORIES.map((category) => (
        <CategorySection key={category} category={category} assets={getAssetsByCategory(category)} />
      ))}
    </HarmonyProvider>
  )
}
