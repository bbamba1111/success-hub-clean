"use client"

/**
 * Capability Progress Panel™ (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Client component that reads CapabilityProfile from localStorage and renders
 * a 9-dimension capability growth dashboard. Zero-state aware.
 */

import { useState, useEffect } from "react"
import {
  Brain,
  DollarSign,
  TrendingUp,
  Settings,
  Users,
  Zap,
  Cpu,
  Heart,
  Building2,
  GraduationCap,
} from "lucide-react"
import { getCapabilityMemory, CAPABILITY_MEMORY_UPDATED } from "@/lib/executive-capability/capability-memory-store"
import { deriveCapabilityProfile, CAPABILITY_DIMENSIONS } from "@/lib/executive-capability/capability-engine"
import type { CapabilityDimensionId, CapabilityProfile } from "@/lib/executive-capability/types"
import Link from "next/link"

// ─── Icon map ─────────────────────────────────────────────────────────────────

const DIMENSION_ICONS: Record<CapabilityDimensionId, React.ComponentType<{ className?: string }>> = {
  "strategic-thinking": Brain,
  "financial-capability": DollarSign,
  "marketing-capability": TrendingUp,
  "operational-excellence": Settings,
  "leadership": Users,
  "decision-making": Zap,
  "ai-leverage": Cpu,
  "customer-experience": Heart,
  "business-asset-thinking": Building2,
}

// ─── Single Dimension Row ─────────────────────────────────────────────────────

function DimensionRow({
  id,
  label,
  score,
}: {
  id: CapabilityDimensionId
  label: string
  score: number
}) {
  const Icon = DIMENSION_ICONS[id]
  const capped = Math.min(100, Math.max(0, score))

  let barColor = "#C9A96E"
  if (capped >= 60) barColor = "#7C9A82"
  else if (capped >= 30) barColor = "#6B9BC4"

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
        <Icon className="h-4 w-4 text-[#3A2E33]/50" aria-hidden />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-montserrat text-xs font-semibold text-[#3A2E33]">{label}</span>
          <span className="font-montserrat text-[11px] text-[#3A2E33]/50">{capped}/100</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]" role="progressbar" aria-valuenow={capped} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${capped}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CapabilityProgressPanel() {
  const [profile, setProfile] = useState<CapabilityProfile | null>(null)
  const [mounted, setMounted] = useState(false)

  const loadProfile = () => {
    const stored = getCapabilityMemory()
    setProfile(deriveCapabilityProfile(stored))
    setMounted(true)
  }

  useEffect(() => {
    loadProfile()
    const handler = () => loadProfile()
    window.addEventListener(CAPABILITY_MEMORY_UPDATED, handler)
    return () => window.removeEventListener(CAPABILITY_MEMORY_UPDATED, handler)
  }, [])

  if (!mounted) {
    // Skeleton
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading capability profile">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-black/[0.07]" />
            <div className="flex-1">
              <div className="mb-1.5 h-3 w-28 animate-pulse rounded bg-black/[0.07]" />
              <div className="h-1.5 w-full animate-pulse rounded-full bg-black/[0.07]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const totalMastered = profile?.topicsMastered.length ?? 0
  const totalCompleted = profile?.completedBriefingIds.length ?? 0
  const hasProgress = totalCompleted > 0

  return (
    <div className="space-y-6">
      {/* Zero state */}
      {!hasProgress && (
        <div className="rounded-xl border border-dashed border-[#C9A96E]/30 bg-[#FBF7EE] px-5 py-4 text-center">
          <GraduationCap className="mx-auto h-6 w-6 text-[#C9A96E]/50" aria-hidden />
          <p className="mt-2 font-montserrat text-sm font-semibold text-[#3A2E33]">
            Your capability journey begins with your first briefing
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#3A2E33]/55">
            When Cherry Blossom™ surfaces an Executive Briefing™ in your GPS card, reading and marking it as learned will track your growth across all 9 dimensions here.
          </p>
        </div>
      )}

      {/* Stats bar */}
      {hasProgress && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-montserrat text-2xl font-bold text-[#C9A96E]">{totalMastered}</span>
            <span className="text-xs leading-tight text-[#3A2E33]/55">topics<br />mastered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-montserrat text-2xl font-bold text-[#7C9A82]">{totalCompleted}</span>
            <span className="text-xs leading-tight text-[#3A2E33]/55">briefings<br />completed</span>
          </div>
          {(profile?.topicsDeferred.length ?? 0) > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-montserrat text-2xl font-bold text-[#6B9BC4]">{profile!.topicsDeferred.length}</span>
              <span className="text-xs leading-tight text-[#3A2E33]/55">saved<br />for later</span>
            </div>
          )}
        </div>
      )}

      {/* Dimension bars */}
      <div className="space-y-3">
        {CAPABILITY_DIMENSIONS.map((dim) => (
          <DimensionRow
            key={dim.id}
            id={dim.id}
            label={dim.label}
            score={profile?.dimensions[dim.id] ?? 0}
          />
        ))}
      </div>

      {/* Knowledge library link */}
      <Link
        href="/executive-knowledge-library"
        className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-[#7C9A82] underline-offset-4 hover:underline"
      >
        <GraduationCap className="h-3.5 w-3.5" aria-hidden />
        Explore the Executive Knowledge Library™
      </Link>
    </div>
  )
}
