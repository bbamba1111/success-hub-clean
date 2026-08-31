"use client"

/**
 * AssetDetailView — Business Asset Library™ (Phase 12.1)
 * ---------------------------------------------------------------------------
 * Answers the four required questions for a single Business Asset™, adapted
 * to the founder's live Communication Style™ (lib/business-comprehension):
 * what is this, why does it matter, who helps me build it, and how do I
 * build it. Same canonical asset — only the explanation adapts.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CheckCircle2, MessageCircle } from "lucide-react"
import {
  BUSINESS_COMPREHENSION_EVENT,
  getCommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension-store"
import {
  DEFAULT_COMMUNICATION_STYLE,
  getCommunicationStyle as getStyleDef,
  type CommunicationStyle,
} from "@/lib/business-comprehension/business-comprehension"
import type { BusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import { getBusinessStage as getStageDef } from "@/lib/business-stage/business-stage"
import { getBuildMode, type BuildModeId } from "@/lib/business-asset-library/build-modes"
import { isLiveAiBuildAvailable } from "@/lib/business-asset-library/live-build"
import {
  getLatestCompletedBuildForAsset,
  type BusinessAssetBuildRecord,
  type BusinessAssetReviewStatus,
} from "@/utils/business-asset-build-storage"
import { BuildModePicker } from "./build-mode-picker"
import { GuidedBuildFlow } from "./guided-build-flow"
import { LiveAiBuildChat } from "./live-ai-build-chat"
import { DelegationBrief } from "./delegation-brief"
import { ExpertScopeBrief } from "./expert-scope-brief"
import { BuyVsBuildGuidance } from "./buy-vs-build-guidance"
import { FounderAssetOwnershipCard } from "./founder-asset-ownership-card"
import { CommunicationStyleModal } from "./communication-style-modal"

export function AssetDetailView({
  asset,
  onOwnedBuildChange,
}: {
  asset: BusinessAsset
  /** Fires whenever the real, saved completion record for this asset resolves or changes — lets a
   *  host (e.g. the CEO Workday's Today's Work queue) reflect the founder's TRUE build status
   *  instead of a manually-toggled one. */
  onOwnedBuildChange?: (build: BusinessAssetBuildRecord | null) => void
}) {
  const [style, setStyle] = useState<CommunicationStyle>(DEFAULT_COMMUNICATION_STYLE)
  const [mounted, setMounted] = useState(false)
  const [activeMode, setActiveMode] = useState<BuildModeId | null>(null)
  const [ownedBuild, setOwnedBuild] = useState<BusinessAssetBuildRecord | null>(null)
  const [showStyleModal, setShowStyleModal] = useState(false)
  const buildSectionRef = useRef<HTMLDivElement>(null)

  /** Reopens the exact build mode that produced the founder's saved asset — the flow components resume that SAME build row rather than starting a new one. */
  const handleEditBuild = useCallback(() => {
    if (!ownedBuild) return
    setActiveMode(ownedBuild.buildMode)
    buildSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [ownedBuild])

  useEffect(() => {
    setStyle(getCommunicationStyle())
    setMounted(true)
    const onChange = () => setStyle(getCommunicationStyle())
    window.addEventListener(BUSINESS_COMPREHENSION_EVENT, onChange)
    return () => window.removeEventListener(BUSINESS_COMPREHENSION_EVENT, onChange)
  }, [])

  const refreshOwnedBuild = useCallback(() => {
    getLatestCompletedBuildForAsset(asset.id).then((build) => {
      setOwnedBuild(build)
      onOwnedBuildChange?.(build)
    })
  }, [asset.id, onOwnedBuildChange])

  useEffect(() => {
    refreshOwnedBuild()
  }, [refreshOwnedBuild])

  const explanation = asset.explanations[style]
  const styleDef = getStyleDef(style)
  const owners = asset.ownerExecutiveIds.map((id) => getExecutive(id)).filter(Boolean) as ReturnType<
    typeof getExecutive
  >[]
  const primaryOwnerName = owners[0]?.name ?? "Cherry Blossom™"
  const prerequisiteAssets = (asset.prerequisites ?? [])
    .map((id) => getBusinessAsset(id))
    .filter(Boolean) as BusinessAsset[]
  const mode = activeMode ? getBuildMode(activeMode) : null

  return (
    <div>
      {/* Communication Style™ indicator */}
      <div className="flex items-center justify-between gap-3">
        <p className="ds-eyebrow">{asset.category}</p>
        <button
          type="button"
          onClick={() => setShowStyleModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-ink-soft ds-transition hover:text-brand-ink"
          suppressHydrationWarning
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          Explained in your {mounted ? styleDef.name : "Business Owner™"} style
        </button>
      </div>

      <h1 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
        {asset.name}
      </h1>
      <p className="mt-3 text-pretty text-base leading-relaxed text-brand-ink-soft" suppressHydrationWarning>
        {explanation.headline}. {explanation.body}
      </p>

      {/* Prerequisites, if any */}
      {prerequisiteAssets.length > 0 && (
        <div className="mt-5 rounded-xl border border-brand-coral/20 bg-brand-coral/[0.05] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-coral">Before you start</p>
          <p className="mt-1 text-sm text-brand-ink-soft">
            This builds on{" "}
            {prerequisiteAssets.map((p, i) => (
              <span key={p.id}>
                <Link href={`/business-asset-library/${p.id}`} className="font-semibold text-brand-ink underline-offset-4 hover:underline">
                  {p.name}
                </Link>
                {i < prerequisiteAssets.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        </div>
      )}

      {/* The four questions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="ds-card ds-card-pad">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">What is this?</p>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-ink">{asset.whatIsThis}</p>
        </div>
        <div className="ds-card ds-card-pad">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Why does it matter?</p>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-ink">{asset.whyItMatters}</p>
        </div>
        <div className="ds-card ds-card-pad">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Who helps me build it?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {owners.map((o) => (
              <span key={o!.id} className="ds-badge-green">
                {o!.name}
              </span>
            ))}
          </div>
        </div>
        <div className="ds-card ds-card-pad">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-ink-soft">Best fit for</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {asset.recommendedBusinessStages.map((s) => (
              <span key={s} className="ds-badge-neutral">
                {getStageDef(s).name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How do I build it? */}
      <div ref={buildSectionRef} className="mt-10">
        <p className="ds-eyebrow">How do I build it?</p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-brand-ink">
          Choose how you&apos;d like to work
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-brand-ink-soft">
          Either way, {primaryOwnerName} guides you through it — you&apos;re never left to figure this out alone.
        </p>

        <div className="mt-5">
          <BuildModePicker
            activeMode={activeMode}
            onSelect={setActiveMode}
            availableModeIds={asset.availableBuildModeIds}
          />
        </div>

        {mode && (
          <div className="mt-6">
            {mode.id === "give-to-team" ? (
              <DelegationBrief
                asset={asset}
                communicationStyle={style}
                executiveName={primaryOwnerName}
                onExit={() => setActiveMode(null)}
              />
            ) : mode.id === "hire-expert" ? (
              <ExpertScopeBrief
                asset={asset}
                communicationStyle={style}
                onExit={() => setActiveMode(null)}
              />
            ) : mode.id === "buy-it" ? (
              <BuyVsBuildGuidance asset={asset} onExit={() => setActiveMode(null)} />
            ) : isLiveAiBuildAvailable(asset.id) ? (
              <LiveAiBuildChat
                asset={asset}
                mode={mode}
                style={style}
                executiveName={primaryOwnerName}
                onExit={() => setActiveMode(null)}
                onAssetSaved={refreshOwnedBuild}
              />
            ) : (
              <GuidedBuildFlow
                asset={asset}
                mode={mode}
                style={style}
                executiveName={primaryOwnerName}
                onExit={() => setActiveMode(null)}
                onAssetSaved={refreshOwnedBuild}
              />
            )}
          </div>
        )}
      </div>

      {/* Founder Asset Ownership Card™ — what you've actually finished for this asset, regardless of which mode built it */}
      {ownedBuild && (
        <div className="mt-10">
          <FounderAssetOwnershipCard
            assetName={asset.name}
            executiveName={primaryOwnerName}
            build={ownedBuild}
            onStatusChange={(next: BusinessAssetReviewStatus) =>
              setOwnedBuild((prev) => (prev ? { ...prev, reviewStatus: next } : prev))
            }
            onEdit={handleEditBuild}
          />
        </div>
      )}

      {/* Reassurance footer */}
      <div className="mt-10 flex items-start gap-3 rounded-xl border border-black/[0.06] bg-brand-cream/50 px-5 py-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden />
        <p className="text-pretty text-xs leading-relaxed text-brand-ink-soft">
          This is the same {asset.name} every founder in Harmony Lane™ builds — only the explanation changes to fit
          how you like things communicated. Change your Communication Style™{" "}
          <button
            type="button"
            onClick={() => setShowStyleModal(true)}
            className="font-semibold text-brand-ink underline-offset-4 hover:underline"
          >
            anytime
          </button>
          .
        </p>
      </div>

      <CommunicationStyleModal open={showStyleModal} onClose={() => setShowStyleModal(false)} />
    </div>
  )
}
