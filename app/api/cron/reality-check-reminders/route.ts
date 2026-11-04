import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { nextSessionDate } from "@/lib/reality-check/session"
import { sendReminderEmail, type ReminderStage } from "@/lib/reality-check/email"
import { pruneRateLimits } from "@/lib/reality-check/rate-limit"

export const dynamic = "force-dynamic"
export const maxDuration = 300

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type ReminderSchedule = {
  stage: ReminderStage
  sentColumn: string
  errorColumn: string
  label: string
}

function currentReminderStage(now: Date): ReminderSchedule | null {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ""
  const weekday = get("weekday")
  const hour = Number(get("hour"))
  const minute = Number(get("minute"))

  // Five-minute windows tolerate normal Vercel Cron dispatch jitter.
  if (weekday === "Sat" && hour === 15 && minute < 5) {
    return { stage: "saturday", sentColumn: "reminder_1_sent_at", errorColumn: "reminder_1_error", label: "Saturday planning reminder" }
  }
  if (weekday === "Sun" && hour === 13 && minute < 5) {
    return { stage: "sunday-1pm", sentColumn: "reminder_2_sent_at", errorColumn: "reminder_2_error", label: "Sunday preparation reminder" }
  }
  if (weekday === "Sun" && hour === 14 && minute >= 40 && minute < 45) {
    return { stage: "sunday-final", sentColumn: "reminder_3_sent_at", errorColumn: "reminder_3_error", label: "20-minute final reminder" }
  }
  return null
}

/** Runs every five minutes; sends only during the three Eastern-time reminder windows. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const schedule = currentReminderStage(now)
  if (!schedule) return NextResponse.json({ skipped: "Outside reminder window" })

  const sessionDate = nextSessionDate(now)
  const supabase = createAdminClient()
  await pruneRateLimits(supabase).catch((err) => console.error("[reality-check] prune failed", err))

  const { data, error } = await supabase
    .from("reality_check_registrations")
    .select("id, full_name, email")
    .eq("session_date", sessionDate)
    .is(schedule.sentColumn, null)
    .limit(400)

  if (error) {
    console.error("[reality-check] reminder query failed", { stage: schedule.stage, error })
    return NextResponse.json({ error: "Query failed", stage: schedule.stage }, { status: 500 })
  }

  let sent = 0
  let failed = 0
  for (const row of data ?? []) {
    const recipient = { id: row.id, fullName: row.full_name, email: row.email, sessionDate }
    const result = await sendReminderEmail(recipient, schedule.stage)
    const update: Record<string, string | null> = result.ok
      ? { [schedule.sentColumn]: new Date().toISOString(), [schedule.errorColumn]: null }
      : { [schedule.errorColumn]: result.error.slice(0, 500) }

    // Keep the original aggregate marker in sync when the final reminder succeeds.
    if (result.ok && schedule.stage === "sunday-final") {
      update.reminder_sent_at = new Date().toISOString()
      update.reminder_error = null
    }

    const { error: updateError } = await supabase
      .from("reality_check_registrations")
      .update(update)
      .eq("id", row.id)

    if (updateError) {
      console.error("[reality-check] delivery tracking update failed", { id: row.id, stage: schedule.stage, updateError })
      failed++
    } else if (result.ok) {
      sent++
    } else {
      failed++
    }
    await sleep(550)
  }

  return NextResponse.json({ sessionDate, stage: schedule.stage, label: schedule.label, sent, failed })
}
