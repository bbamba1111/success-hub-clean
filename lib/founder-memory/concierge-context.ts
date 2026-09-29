/**
 * Founder Memory™ Concierge Context — Phase 16.0
 * ---------------------------------------------------------------------------
 * Pure function — no React, no DOM, no side effects.
 * Builds a ConciergeContext (including the coachingNote string) from
 * FounderMemory[], GPS history, and the installation profile.
 */

import type { FounderMemory, ConciergeContext } from "./types"
import type { RecommendationHistoryEntry } from "@/lib/founder-gps/history/recommendation-history-store"
import type { InstallationProfile } from "@/lib/installation/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysBetween(isoA: string, isoB: string): number {
  return Math.abs(
    Math.round((new Date(isoA).getTime() - new Date(isoB).getTime()) / 86400000),
  )
}

function formatStreakLabel(days: number): string {
  if (days === 0) return "No active streak yet"
  if (days === 1) return "1-day streak"
  return `${days}-day streak`
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function buildConciergeContext(
  memories: FounderMemory[],
  gpsHistory: RecommendationHistoryEntry[],
  profile: InstallationProfile | null,
): ConciergeContext {
  const firstName = profile?.founderProfile?.firstName?.trim() || "Founder"

  // ── Latest milestone ──────────────────────────────────────────────────────
  const latestMilestone = memories.find((m) => m.category === "milestone") ?? null

  // ── Recent wins (last 7 days) ─────────────────────────────────────────────
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const cutoffIso = cutoff.toISOString().slice(0, 10)
  const recentWins = memories.filter(
    (m) => m.category === "win" && m.date >= cutoffIso,
  )

  // ── Streak info (from GPS history) ────────────────────────────────────────
  let streakDays = 0
  if (gpsHistory.length > 0) {
    const completionDates = Array.from(
      new Set(
        gpsHistory
          .filter((h) => h.outcome === "completed")
          .map((h) => h.date),
      ),
    ).sort().reverse()

    let expected = new Date().toISOString().slice(0, 10)
    for (const date of completionDates) {
      if (date === expected) {
        streakDays++
        const d = new Date(expected)
        d.setDate(d.getDate() - 1)
        expected = d.toISOString().slice(0, 10)
      } else {
        break
      }
    }
  }

  // ── Community pattern ─────────────────────────────────────────────────────
  const communityEvents = memories.filter((m) => m.category === "community")
  let communityPattern: string | null = null
  if (communityEvents.length >= 4) {
    communityPattern = `${firstName} regularly attends community sessions — a strong indicator of sustained engagement.`
  } else if (communityEvents.length > 0) {
    communityPattern = `${firstName} has attended ${communityEvents.length} community session${communityEvents.length > 1 ? "s" : ""}.`
  }

  // ── Score pattern ─────────────────────────────────────────────────────────
  const scoredMemories = memories.filter(
    (m) => m.category === "review" && typeof m.harmonyScore === "number",
  )
  let scorePattern: string | null = null
  if (scoredMemories.length >= 2) {
    const latest = scoredMemories[0].harmonyScore as number
    const prev = scoredMemories[1].harmonyScore as number
    const delta = latest - prev
    if (delta > 3) scorePattern = `Harmony Score™ is trending upward — currently ${latest}/100.`
    else if (delta < -3) scorePattern = `Harmony Score™ has shifted to ${latest}/100 — worth a focused recalibration.`
    else scorePattern = `Harmony Score™ is holding steady at ${latest}/100.`
  }

  // ── Coaching note ─────────────────────────────────────────────────────────
  const parts: string[] = []

  if (latestMilestone) {
    parts.push(`Your most recent milestone — "${latestMilestone.title}" — is still shaping your operating identity.`)
  }

  if (recentWins.length > 0) {
    parts.push(
      `You have recorded ${recentWins.length} win${recentWins.length > 1 ? "s" : ""} this week — that is the compound effect activating.`,
    )
  } else if (streakDays > 0) {
    parts.push(`Your ${streakDays}-day consistency streak is one of the most powerful signals I track.`)
  }

  if (scorePattern) {
    parts.push(scorePattern)
  }

  if (communityPattern) {
    parts.push(communityPattern)
  }

  if (parts.length === 0) {
    // Warm fallback for new founders with minimal history
    if (profile?.completedAt) {
      parts.push(`${firstName}, your Operating System™ is installed and your story is just beginning. Every action from here compounds.`)
    } else {
      parts.push(`${firstName}, I'm tracking your journey so every conversation we have is rooted in your real operating history.`)
    }
  }

  const coachingNote = parts.join(" ")

  return {
    latestMilestone,
    recentWins,
    streakInfo: { days: streakDays, label: formatStreakLabel(streakDays) },
    communityPattern,
    scorePattern,
    coachingNote,
  }
}
