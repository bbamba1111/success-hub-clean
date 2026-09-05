/**
 * Founder Memory™ Seeder — Phase 16.0
 * ---------------------------------------------------------------------------
 * Client-only. Back-fills FounderMemory records from existing localStorage
 * stores on first run so the first-visit experience is meaningful.
 * Does NOT re-implement any store logic — reads existing public APIs only.
 */

import type { FounderMemory } from "./types"
import { getMemoryStore, recordMemories } from "./founder-memory-store"

/** localStorage key used to mark that seeding has already run. */
const SEED_FLAG = "hl:founder-memory:seeded-v1"

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Reads all existing platform stores and synthesises FounderMemory records
 * for any milestones not yet present. Safe to call multiple times —
 * guarded by a seed flag and upsert-by-id in the store.
 *
 * Should be called once in client components on mount, e.g.:
 *   useEffect(() => { seedMemoriesFromExistingData() }, [])
 */
export function seedMemoriesFromExistingData(): void {
  if (!isBrowser()) return

  // Only seed once per device to avoid performance overhead on every mount.
  // The flag is removed by clearMemoryStore() so a fresh install re-seeds.
  if (localStorage.getItem(SEED_FLAG)) return

  const seeds: FounderMemory[] = []

  try {
    // ── Installation Profile → "milestone" ────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getInstallationProfile } = require("@/lib/installation/installation-store")
    const profile = getInstallationProfile()
    if (profile?.completedAt) {
      const firstName = profile.founderProfile?.firstName ?? "Founder"
      seeds.push({
        id: "seed-installation-complete",
        category: "milestone",
        title: "Founder Operating System™ Installed",
        summary: `${firstName} completed the full Founder Operating System™ installation and committed to the Work-Life Balance Business Day™.`,
        date: profile.completedAt.slice(0, 10),
        timestamp: profile.completedAt,
        cherryBlossomReflection:
          "This was the moment everything changed — you chose to build a business that truly works for your life.",
        ctaLabel: "View Installation",
        ctaHref: "/welcome",
      })
    }
  } catch {
    // Store not available — skip
  }

  try {
    // ── GPS History → "win" entries ────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRecommendationHistory } = require("@/lib/founder-gps/history/recommendation-history-store")
    const history = getRecommendationHistory()
    const completions = history.filter(
      (h: { outcome: string }) => h.outcome === "completed",
    )
    // Seed the 10 most recent completions (avoid bloating on first seed)
    const recent = completions.slice(-10)
    for (const entry of recent) {
      seeds.push({
        id: `seed-win-${entry.id}-${entry.date}`,
        category: "win",
        title: entry.recommendationTitle ?? "GPS Recommendation Completed",
        summary: `Completed a Founder GPS™ recommendation during the ${entry.segmentId ?? "CEO Workday™"} session.`,
        date: entry.date,
        timestamp: entry.timestamp,
        ctaLabel: "View GPS",
        ctaHref: "/my-harmony",
        metadata: { segmentId: entry.segmentId, recommendationId: entry.id },
      })
    }

    // First-ever GPS completion → extra milestone
    const firstCompletion = completions[0]
    if (firstCompletion) {
      seeds.push({
        id: "seed-first-gps-completion",
        category: "milestone",
        title: "First Founder GPS™ Completion",
        summary: "You completed your first Founder GPS™ recommendation — the first step in your operating transformation.",
        date: firstCompletion.date,
        timestamp: new Date(firstCompletion.timestamp).getTime() - 1 + "z",
        cherryBlossomReflection:
          "Your first completion is always the hardest. From here, the compound effect begins.",
      })
    }
  } catch {
    // Skip
  }

  try {
    // ── Adaptation History → "decision" entries ────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAdaptationHistory } = require("@/lib/adaptive-workspace/adaptation-store")
    const adaptations = getAdaptationHistory()
    // Seed up to 5 most recent adaptations
    const recent = adaptations.slice(0, 5)
    for (const adapt of recent) {
      seeds.push({
        id: `seed-adapt-${adapt.id}`,
        category: "decision",
        title: "Workspace Adapted",
        summary: `Adapted the ${adapt.targetSegment ?? "operating workspace"} to better fit current energy and priorities.`,
        date: adapt.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        timestamp: adapt.createdAt ?? new Date().toISOString(),
        metadata: { targetSegment: adapt.targetSegment },
      })
    }
  } catch {
    // Skip
  }

  try {
    // ── Executive Reviews → "review" entries ──────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getExecutiveReviews } = require("@/lib/executive-reviews/executive-reviews-store")
    const reviews = getExecutiveReviews()
    for (const review of reviews.weekly.slice(0, 10)) {
      seeds.push({
        id: `seed-review-weekly-${review.id}`,
        category: "review",
        title: `Weekly Executive Review — ${review.period?.label ?? review.id}`,
        summary: review.cherryBlossomLetter?.slice(0, 120) ?? "Weekly operating review generated.",
        date: review.period?.startDate ?? new Date().toISOString().slice(0, 10),
        timestamp: review.period?.generatedAt ?? new Date().toISOString(),
        harmonyScore: review.harmonyScore?.value,
        ctaLabel: "View Review",
        ctaHref: "/executive-reviews",
      })
    }
  } catch {
    // Skip
  }

  // Only write if we have anything to seed and the store is still empty (or sparse)
  const existing = getMemoryStore()
  if (seeds.length > 0 && existing.memories.length < seeds.length) {
    recordMemories(seeds)
  }

  // Mark as seeded
  try {
    localStorage.setItem(SEED_FLAG, "1")
  } catch {
    // no-op
  }
}
