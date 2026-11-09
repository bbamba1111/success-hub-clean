import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { nextSessionDate, sessionStartsAt } from "@/lib/reality-check/session"
import { sendReminderEmail } from "@/lib/reality-check/email"
import { pruneRateLimits } from "@/lib/reality-check/rate-limit"

export const dynamic = "force-dynamic"
export const maxDuration = 300

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Runs Sunday morning via Vercel Cron; sends each registrant one reminder for today's session. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const sessionDate = nextSessionDate(now)
  const msUntilStart = sessionStartsAt(sessionDate).getTime() - now.getTime()
  if (msUntilStart <= 0 || msUntilStart > 24 * 60 * 60_000) {
    return NextResponse.json({ sessionDate, skipped: "No session in the next 24 hours" })
  }

  const supabase = createAdminClient()
  await pruneRateLimits(supabase).catch((err) => console.error("[reality-check] prune failed", err))

  const { data, error } = await supabase
    .from("reality_check_registrations")
    .select("id, full_name, email")
    .eq("session_date", sessionDate)
    .is("reminder_sent_at", null)
    .limit(400)
  if (error) {
    console.error("[reality-check] reminder query failed", error)
    return NextResponse.json({ error: "Query failed" }, { status: 500 })
  }

  let sent = 0
  let failed = 0
  for (const row of data ?? []) {
    const result = await sendReminderEmail({ id: row.id, fullName: row.full_name, email: row.email, sessionDate })
    await supabase
      .from("reality_check_registrations")
      .update(
        result.ok
          ? { reminder_sent_at: new Date().toISOString(), reminder_error: null }
          : { reminder_error: result.error.slice(0, 500) },
      )
      .eq("id", row.id)
    if (result.ok) sent++
    else failed++
    await sleep(550)
  }

  return NextResponse.json({ sessionDate, sent, failed })
}
