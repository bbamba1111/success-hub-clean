import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { loadMemories, getUpcomingMemoryEvents, getUpcomingSeasonalHolidays } from "@/lib/cherry-blossom/memory"

/**
 * Lightweight read-only feed for the Time Freedom™ "Life Events™" mini-list —
 * merges the signed-in member's Memory Vault™ important dates with the fixed
 * seasonal holidays, within the next 30 days, soonest first. Anonymous
 * visitors still see the seasonal holidays (no memory rows for them).
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const windowDays = 30
    const now = new Date()

    let memoryEvents: { label: string; detail: string; days: number }[] = []
    if (user) {
      const memories = await loadMemories(supabase, user.id)
      memoryEvents = getUpcomingMemoryEvents(memories, windowDays, now)
    }

    const seasonalEvents = getUpcomingSeasonalHolidays(windowDays, now)

    const events = [...memoryEvents, ...seasonalEvents].sort((a, b) => a.days - b.days)

    return NextResponse.json({ events })
  } catch (error) {
    console.log("[v0] upcoming-events error:", (error as Error)?.message)
    return NextResponse.json({ events: [] })
  }
}
