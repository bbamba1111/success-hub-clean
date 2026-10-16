/**
 * Founder Operating System™ Installation Engine — Store (Phase 12.0)
 * ---------------------------------------------------------------------------
 * localStorage key: "hl:installation:v1"
 * Autosaves after every field change. On completion, bridges directly into
 * the existing BusinessContextProfile and BusinessStage stores so that GPS,
 * Digital Twin, Adaptive Workspace, and Cherry Blossom all activate immediately.
 */

import type { InstallationProfile, FounderProfileAnswers } from "./types"
import { EMPTY_INSTALLATION_PROFILE } from "./types"
import type { BusinessStageOption } from "@/lib/business-context/types"

/**
 * Maps the installation's 4-tier BusinessStage™ to the BusinessContextProfile's
 * more granular BusinessStageOption so both stores stay in sync.
 */
function toBusinessStageOption(stage: FounderProfileAnswers["founderStage"]): BusinessStageOption {
  const map: Record<FounderProfileAnswers["founderStage"], BusinessStageOption> = {
    launch: "early-revenue",
    growth: "growth",
    scale: "scaling",
    legacy: "established",
  }
  return map[stage]
}

const STORAGE_KEY = "hl:installation:v1"

/** Fired on window after any save so live listeners can refresh. */
export const INSTALLATION_UPDATED = "hl:installation:updated"

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getInstallationProfile(): InstallationProfile {
  if (typeof window === "undefined") return { ...EMPTY_INSTALLATION_PROFILE }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_INSTALLATION_PROFILE }
    return JSON.parse(raw) as InstallationProfile
  } catch {
    return { ...EMPTY_INSTALLATION_PROFILE }
  }
}

export function isInstallationComplete(): boolean {
  if (typeof window === "undefined") return false
  try {
    const profile = getInstallationProfile()
    return !!profile.completedAt
  } catch {
    return false
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function saveInstallationProfile(profile: InstallationProfile): void {
  if (typeof window === "undefined") return
  try {
    const toSave: InstallationProfile = {
      ...profile,
      lastSavedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    window.dispatchEvent(new CustomEvent(INSTALLATION_UPDATED))
  } catch (error) {
    console.error("[Installation] Error saving profile:", error)
  }
}

export function clearInstallationProfile(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(INSTALLATION_UPDATED))
  } catch {
    // no-op
  }
}

// ─── Completion Bridge ────────────────────────────────────────────────────────

/**
 * Called when the founder completes Step 6.
 * Marks the installation as complete, then bridges the collected data into the
 * existing BusinessContextProfile and BusinessStage stores so the full
 * operating system activates immediately.
 */
export async function completeInstallation(profile: InstallationProfile): Promise<void> {
  if (typeof window === "undefined") return

  const completed: InstallationProfile = {
    ...profile,
    completedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  window.dispatchEvent(new CustomEvent(INSTALLATION_UPDATED))

  // ── Bridge → BusinessStage ────────────────────────────────────────────────
  try {
    const { setBusinessStage } = await import("@/lib/business-stage/business-stage-store")
    const stage = profile.founderProfile.founderStage ?? "launch"
    setBusinessStage(stage)
  } catch {
    // non-fatal
  }

  // ── Bridge → BusinessContextProfile ──────────────────────────────────────
  try {
    const { saveBusinessContext } = await import("@/lib/business-context/business-context-store")
    const fp = profile.founderProfile

    // Build a minimal BusinessContextProfile so all downstream engines activate.
    // Non-collected fields are set to safe defaults matching the type.
    saveBusinessContext({
      completedAt: new Date().toISOString(),
      businessName: fp.firstName ? `${fp.firstName}'s Business` : "My Business",
      businessStage: fp.founderStage ? toBusinessStageOption(fp.founderStage) : "idea",
      businessModel: fp.businessModel ? [fp.businessModel] : ["other"],
      industry: fp.industry ?? "",
      founderRole: "solopreneur",
      teamSize: fp.teamSize ?? "solo",
      revenueStage: "pre-revenue",
      biggestGoals: ["achieve-time-freedom"],
      biggestChallenges: ["time"],
      longTermVision: {
        oneYear: "",
        threeYear: "",
        fiveYear: "",
        tenYear: "",
        description: "",
      },
      capitalStrategy: ["bootstrapped"],
      growthVision: "lifestyle-business",
      exitVision: "undecided",
      businessCredit: "not-sure",
      businessBanking: "not-sure",
      financialFoundation: [],
      wealthBuildingInterests: [],
      communicationLevel: "foundation",
      learningInterests: [],
    })
  } catch {
    // non-fatal
  }
}
