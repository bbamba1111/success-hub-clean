/**
 * Workspace Intelligence Engine™ — Phase 10.6
 *
 * Pure function. No React, no I/O.
 * Produces a full AdaptiveWorkspaceConfig from the aggregate + optional pattern signals.
 */

import type { HarmonyContextAggregate } from "@/lib/founder-gps/context/harmony-context-aggregator"
import type { PatternSignal } from "@/lib/harmony-memory/types"
import type {
  AdaptiveWorkspaceConfig,
  WorkspaceProfile,
  WorkspaceProfileId,
} from "./types"
import { deriveOperatingMode } from "./operating-mode-engine"
import { deriveExecutiveWeights } from "./executive-weighting-engine"

// ── Workspace Profile Definitions ─────────────────────────────────────────────

const WORKSPACE_PROFILES: Record<WorkspaceProfileId, WorkspaceProfile> = {
  "solo-founder": {
    id: "solo-founder",
    name: "Solo Founder™",
    description: "Everything visible, priority on execution and learning.",
    visibleSections: ["live-today", "capability", "gps", "memory"],
    executiveOfficeProminent: false,
    learningVisible: true,
    memoryInsightsVisible: true,
    predictionsVisible: false,
    patternVisible: true,
  },
  growth: {
    id: "growth",
    name: "Growth Stage™",
    description: "Revenue and scale signals prominent. Executive Office visible.",
    visibleSections: ["live-today", "executive-office", "capability", "gps", "memory"],
    executiveOfficeProminent: true,
    learningVisible: true,
    memoryInsightsVisible: true,
    predictionsVisible: true,
    patternVisible: true,
  },
  "executive-leadership": {
    id: "executive-leadership",
    name: "Executive Leadership™",
    description: "Strategic + executive intelligence foregrounded.",
    visibleSections: ["executive-office", "live-today", "memory", "gps"],
    executiveOfficeProminent: true,
    learningVisible: false,
    memoryInsightsVisible: true,
    predictionsVisible: true,
    patternVisible: true,
  },
  "scaling-team": {
    id: "scaling-team",
    name: "Scaling Team™",
    description: "Operations and people intelligence prominent.",
    visibleSections: ["executive-office", "live-today", "memory", "gps", "capability"],
    executiveOfficeProminent: true,
    learningVisible: false,
    memoryInsightsVisible: true,
    predictionsVisible: true,
    patternVisible: true,
  },
  advisory: {
    id: "advisory",
    name: "Advisory™",
    description: "Wealth, investment, and legacy intelligence foregrounded.",
    visibleSections: ["executive-office", "gps", "memory"],
    executiveOfficeProminent: true,
    learningVisible: false,
    memoryInsightsVisible: true,
    predictionsVisible: true,
    patternVisible: false,
  },
}

// ── Profile derivation ────────────────────────────────────────────────────────

function deriveProfileId(agg: HarmonyContextAggregate): {
  id: WorkspaceProfileId
  rationale: string
} {
  const { businessStage, teamSize } = agg

  if (businessStage === "legacy") {
    return {
      id: "advisory",
      rationale: "Legacy stage founders benefit from the Advisory™ profile, which foregrounds wealth and strategic intelligence.",
    }
  }

  if (
    businessStage === "scale" ||
    teamSize === "11-25" ||
    teamSize === "26-50" ||
    teamSize === "50-plus"
  ) {
    return {
      id: "scaling-team",
      rationale: "Your team size and business stage indicate a scaling operation. The Scaling Team™ profile foregrounds operations and people intelligence.",
    }
  }

  if (businessStage === "growth") {
    return {
      id: "growth",
      rationale: "Growth stage signals indicate the Growth Stage™ profile — balancing revenue, executive office, and learning.",
    }
  }

  if (teamSize === "4-10") {
    return {
      id: "executive-leadership",
      rationale: "With a small team and active leadership role, the Executive Leadership™ profile surfaces strategic and executive intelligence.",
    }
  }

  // Default: solo-founder (launch / pre-revenue / minimal team)
  return {
    id: "solo-founder",
    rationale: "Your current stage is best served by the Solo Founder™ profile — execution and learning visible, fully integrated.",
  }
}

// ── Suppression logic ─────────────────────────────────────────────────────────

function deriveSuppressedFeatures(
  agg: HarmonyContextAggregate,
  patterns: PatternSignal[],
  mode: import("./types").OperatingMode,
): { features: string[]; note: string | null } {
  const features: string[] = []

  if (mode === "restore") {
    features.push("learning-prompts", "predictions")
    return {
      features,
      note: "Learning prompts and predictions are paused while you are in Restore Mode™. Your workspace is focusing on sustainability.",
    }
  }

  // Check for 3+ consecutive skip days in recent patterns
  const skipPattern = patterns.find(
    (p) => p.category === "skip-pattern" && p.strength === "confirmed",
  )
  if (skipPattern) {
    features.push("learning-prompts")
    return {
      features,
      note: "Learning prompts are temporarily reduced — your recent pattern shows high skip frequency. The system adapts to protect your momentum.",
    }
  }

  if (agg.inLifeProtectionMode) {
    features.push("learning-prompts")
    return {
      features,
      note: "Learning prompts are paused during Life Protection Mode™.",
    }
  }

  return { features, note: null }
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Derives a full AdaptiveWorkspaceConfig from the aggregate + optional pattern signals.
 * Pure — no I/O.
 */
export function deriveWorkspaceConfig(
  agg: HarmonyContextAggregate,
  patterns: PatternSignal[] = [],
): AdaptiveWorkspaceConfig {
  const modeResult = deriveOperatingMode(agg)
  const { id: profileId, rationale: profileRationale } = deriveProfileId(agg)
  const executiveWeights = deriveExecutiveWeights(agg, modeResult.mode)
  const { features: suppressedFeatures, note: adaptationNote } = deriveSuppressedFeatures(
    agg,
    patterns,
    modeResult.mode,
  )

  return {
    recommendedMode: modeResult.mode,
    modeConfidence: modeResult.confidence,
    modeRationale: modeResult.rationale,
    recommendedProfile: profileId,
    profileRationale,
    executiveWeights,
    suppressedFeatures,
    adaptationNote,
  }
}
