import { createClient } from "@/lib/supabase/server"
import {
  loadMemories,
  formatMemoryVault,
  formatUpcomingReminders,
  formatSeasonalHolidays,
  shouldAskMonthlyCheckin,
} from "@/lib/cherry-blossom/memory"

/**
 * Loads the authenticated member's memory (their latest Reality Check snapshot)
 * and formats it as a system-prompt block so Cherry Blossom opens already
 * knowing their current state — no copy/paste required. RLS scopes the read to
 * the signed-in user; anonymous visitors return an empty string (no memory).
 */
export async function buildMemoryContext(): Promise<string> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return ""

    // Load the two most recent weekly records so Cherry Blossom can speak to
    // trends and progress (this week + last week).
    const { data: rows } = await supabase
      .from("reality_checks")
      .select(
        "week_key, overall_score, life_value_scores, selected_priority_areas, operating_declaration, weekly_reflection, completed_at",
      )
      .eq("user_id", user.id)
      .order("week_key", { ascending: false })
      .limit(2)

    // The three layers of Cherry Blossom's understanding are assembled here:
    //   Layer 1 — Weekly context (reality_checks, below)
    //   Layer 2 — Long-term Memory Vault (member_memory)
    //   Layer 3 — Conversation context (handled by the message history)
    const sections: string[] = []

    // ----- Layer 1: Weekly context (this week + last week) -----
    if (rows && rows.length > 0) {
      const current = rows[0]
      const previous = rows[1]

      const lines: string[] = [
        "THIS WEEK — THE MEMBER'S CURRENT REALITY CHECK.",
        "Use it naturally like a coach who remembers them. Do not ask them to repeat it.",
        `Current week: ${current.week_key}`,
      ]

      if (typeof current.overall_score === "number") {
        lines.push(`Overall Work-Life Balance score: ${current.overall_score}%.`)
      }

      if (Array.isArray(current.life_value_scores) && current.life_value_scores.length > 0) {
        const scored = current.life_value_scores
          .map((r: { label?: string; category?: string; percentage?: number }) => `${r.label ?? r.category}: ${r.percentage}%`)
          .join(", ")
        lines.push(`Life value scores — ${scored}.`)
      }

      if (Array.isArray(current.selected_priority_areas) && current.selected_priority_areas.length > 0) {
        lines.push(`Chosen Priority Focus Areas this week: ${current.selected_priority_areas.join(", ")}.`)
      }

      if (current.operating_declaration) {
        lines.push(`Weekly Operating Declaration: "${current.operating_declaration}"`)
      }

      if (current.weekly_reflection) {
        lines.push(`This week's Weekly Reflection: "${current.weekly_reflection}"`)
      }

      // Previous-week context enables natural trend/progress coaching.
      if (previous) {
        lines.push("")
        lines.push(`Previous week: ${previous.week_key}`)
        if (typeof previous.overall_score === "number") {
          lines.push(`Previous overall score: ${previous.overall_score}%.`)
          if (typeof current.overall_score === "number") {
            const delta = current.overall_score - previous.overall_score
            const direction = delta > 0 ? `up ${delta}` : delta < 0 ? `down ${Math.abs(delta)}` : "unchanged"
            lines.push(`Change since last week: ${direction} point(s). Reference this progress naturally when relevant.`)
          }
        }
        if (Array.isArray(previous.life_value_scores) && previous.life_value_scores.length > 0) {
          const prevScored = previous.life_value_scores
            .map((r: { label?: string; category?: string; percentage?: number }) => `${r.label ?? r.category}: ${r.percentage}%`)
            .join(", ")
          lines.push(`Previous life value scores — ${prevScored}.`)
        }
        if (previous.operating_declaration) {
          lines.push(`Last week's Weekly Operating Declaration: "${previous.operating_declaration}"`)
        }
      }

      sections.push(lines.join("\n"))
    }

    // ----- Layer 2: Long-term Memory Vault + reminders + monthly check-in -----
    const memories = await loadMemories(supabase, user.id)

    const vault = formatMemoryVault(memories)
    if (vault) sections.push(vault)

    const reminders = formatUpcomingReminders(memories)
    if (reminders) sections.push(reminders)

    const seasonalDays = formatSeasonalHolidays()
    if (seasonalDays) sections.push(seasonalDays)

    if (shouldAskMonthlyCheckin(memories)) {
      sections.push(
        [
          "MONTHLY CHECK-IN — it has been a new month since you last asked.",
          "At a natural moment (not mid-planning), warmly ask ONCE this month: \"Are there any birthdays, anniversaries, vacations, holidays, family events, speaking engagements, or special occasions coming up this month that you'd like me to remember?\"",
          "Ask this at most once. Do not repeat it in later messages this month.",
        ].join("\n"),
      )
    }

    if (sections.length === 0) return ""

    return `\n\n---\n${sections.join("\n\n")}\n---\n`
  } catch (error) {
    console.log("[v0] buildMemoryContext skipped:", (error as Error)?.message)
    return ""
  }
}
