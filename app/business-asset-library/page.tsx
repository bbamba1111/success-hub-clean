import type { Metadata } from "next"
import { BackLink } from "@/components/navigation/page-nav"
import { AssetLibraryBrowser } from "@/components/business-asset-library/asset-library-browser"

export const metadata: Metadata = {
  title: "Business Asset Library™ | Make Time For More",
  description:
    "The Harmony Lane™ toolbox of buildable business tools — canvases, blueprints, and playbooks, each AI-guided from start to finish.",
}

/**
 * The Business Asset Library™ (Phase 12.1).
 *
 * The toolbox, not the journey. Founders browse here intentionally, or land
 * on a specific asset because Cherry Blossom™ or an executive workspace
 * recommended it as their next step. Lives inside the "Live, Lead & Love
 * Today™" workspace grouping (lib/navigation/primary-nav.ts) — not a
 * competing top-level destination.
 */
export default function BusinessAssetLibraryPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="pt-8">
          <BackLink href="/" label="Back to Live Today" />
        </div>

        <header className="harmony-section pb-0 text-center">
          <p className="ds-eyebrow">The Harmony Lane™ Operating System</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
            The Business Asset Library™
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink-soft sm:text-lg">
            Concrete, buildable tools for your business — canvases, blueprints, scorecards, and playbooks. Every one
            is AI-guided from start to finish, in the language that makes sense to you.
          </p>
        </header>

        <div className="harmony-section pt-8">
          <AssetLibraryBrowser />
        </div>
      </div>
    </main>
  )
}
