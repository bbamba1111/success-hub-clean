"use client"

/**
 * Client-side assembler for the Founder Intelligence Context™.
 *
 * Pulls the live Operating Engine snapshot plus every already-owned data
 * source (membership, Reality Check™, Business Foundation™, progressive
 * memory) and returns a single structured context. Every source degrades
 * gracefully: anonymous visitors and transient errors yield safe nulls so the
 * Command Center always renders.
 */
import { getMemberExperience } from "@/operating-engine/engine"
import { resolveDayAccess, type DayIndex } from "@/lib/membership/access"
import { resolveAccessLevel, getActiveMembership } from "@/utils/membership-storage"
import { getOperatingCenterData } from "@/utils/reality-check-storage"
import { getBusinessFoundation } from "@/utils/business-foundation-storage"
import { createClient } from "@/lib/supabase/client"
import { loadMemories } from "@/lib/cherry-blossom/memory"
import type { FounderIntelligenceContext, MemorySummaryItem } from "./types"

/** Loads the member's progressive memory as trimmed summary items. */
async function loadMemorySummaries(): Promise<{ items: MemorySummaryItem[]; firstName: string | null }> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { items: [], firstName: null }

    const rows = await loadMemories(supabase, user.id)
    const items: MemorySummaryItem[] = rows.map((row) => {
      let date: string | null = null
      if (row.memory_type === "important_date" && row.event_month && row.event_day) {
        const y = new Date().getFullYear()
        date = `${y}-${String(row.event_month).padStart(2, "0")}-${String(row.event_day).padStart(2, "0")}`
      }
      return { type: row.memory_type, content: row.memory_value, date }
    })
    return { items, firstName: null }
  } catch {
    return { items: [], firstName: null }
  }
}

/**
 * Assembles the full context for the current moment. Safe to call on the
 * client; never throws.
 */
export async function loadFounderContext(now: Date = new Date()): Promise<FounderIntelligenceContext> {
  const experience = getMemberExperience(now, { authenticated: true })

  const [accessLevel, membership, realityCheck, foundation, memory] = await Promise.all([
    resolveAccessLevel().catch(() => "business_week" as const),
    getActiveMembership().catch(() => null),
    getOperatingCenterData().catch(() => null),
    getBusinessFoundation().catch(() => null),
    loadMemorySummaries(),
  ])

  const today = resolveDayAccess(accessLevel, now.getDay() as DayIndex)

  return {
    experience,
    accessLevel,
    today,
    membership,
    realityCheck,
    foundation,
    memories: memory.items,
    // Prefer the name the Reality Check loader resolved from user_profiles.
    firstName: realityCheck?.memberName ?? experience.member.firstName ?? null,
  }
}
