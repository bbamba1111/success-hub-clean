/**
 * Executive Capability Intelligence™ — Capability Memory Store (Phase 10.4)
 * ---------------------------------------------------------------------------
 * localStorage-backed store for tracking briefing outcomes and capability
 * dimension scores. Emits a CustomEvent on every write for reactive UI sync.
 */

"use client"

import type { BriefingOutcome, CapabilityDimensionId, CapabilityProfile, ExecutiveBriefingTopicId } from "@/lib/executive-capability/types"
import { BRIEFING_TOPIC_META } from "@/lib/executive-capability/briefing-registry"
import type { CommunicationLevel } from "@/lib/founder-learning/types"

const STORAGE_KEY = "hl:exec-capability:v1"
export const CAPABILITY_MEMORY_UPDATED = "hl:capability-memory-updated"

// ─── Default profile ──────────────────────────────────────────────────────────

function defaultProfile(): CapabilityProfile {
  return {
    dimensions: {
      "strategic-thinking": 0,
      "financial-capability": 0,
      "marketing-capability": 0,
      "operational-excellence": 0,
      "leadership": 0,
      "decision-making": 0,
      "ai-leverage": 0,
      "customer-experience": 0,
      "business-asset-thinking": 0,
    },
    topicsMastered: [],
    topicsInProgress: [],
    topicsDeferred: [],
    topicsSkipped: [],
    completedBriefingIds: [],
    lastUpdated: new Date().toISOString(),
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getCapabilityMemory(): CapabilityProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CapabilityProfile
  } catch {
    return null
  }
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function saveCapabilityMemory(profile: CapabilityProfile): void {
  if (typeof window === "undefined") return
  try {
    profile.lastUpdated = new Date().toISOString()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    window.dispatchEvent(new CustomEvent(CAPABILITY_MEMORY_UPDATED))
  } catch {
    // Storage unavailable — silent fail
  }
}

// ─── Record Outcome ───────────────────────────────────────────────────────────

export function recordBriefingOutcome(
  topicId: ExecutiveBriefingTopicId,
  level: CommunicationLevel,
  outcome: BriefingOutcome,
): void {
  if (typeof window === "undefined") return
  const profile = getCapabilityMemory() ?? defaultProfile()
  const briefingId = `${topicId}:${level}`
  const meta = BRIEFING_TOPIC_META.find((m) => m.id === topicId)

  // Remove from all arrays first to avoid duplicates
  profile.topicsMastered = profile.topicsMastered.filter((id) => id !== topicId)
  profile.topicsInProgress = profile.topicsInProgress.filter((id) => id !== topicId)
  profile.topicsDeferred = profile.topicsDeferred.filter((id) => id !== topicId)
  profile.topicsSkipped = profile.topicsSkipped.filter((id) => id !== topicId)

  if (outcome === "completed") {
    profile.topicsMastered.push(topicId)
    if (!profile.completedBriefingIds.includes(briefingId)) {
      profile.completedBriefingIds.push(briefingId)
      // Award dimension points
      if (meta) {
        const dim = meta.capabilityDimension as CapabilityDimensionId
        const current = profile.dimensions[dim] ?? 0
        profile.dimensions[dim] = Math.min(100, current + meta.pointValue)
        // Award 1 point to decision-making on every completed briefing
        profile.dimensions["decision-making"] = Math.min(
          100,
          (profile.dimensions["decision-making"] ?? 0) + 1,
        )
      }
    }
  } else if (outcome === "deferred") {
    profile.topicsDeferred.push(topicId)
  } else {
    profile.topicsSkipped.push(topicId)
  }

  saveCapabilityMemory(profile)
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export function hasMastered(topicId: ExecutiveBriefingTopicId): boolean {
  if (typeof window === "undefined") return false
  const profile = getCapabilityMemory()
  return profile?.topicsMastered.includes(topicId) ?? false
}

export function wasRecentlyShown(
  topicId: ExecutiveBriefingTopicId,
  withinDays = 7,
): boolean {
  if (typeof window === "undefined") return false
  const profile = getCapabilityMemory()
  if (!profile) return false
  // Check completedBriefingIds for any entry with this topicId shown within N days
  const keyPrefix = `${topicId}:`
  const recent = profile.completedBriefingIds.some((id) => id.startsWith(keyPrefix))
  if (!recent) return false
  const lastUpdated = new Date(profile.lastUpdated)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - withinDays)
  return lastUpdated > cutoff
}

export function clearCapabilityMemory(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(CAPABILITY_MEMORY_UPDATED))
  } catch {
    // Ignore
  }
}
