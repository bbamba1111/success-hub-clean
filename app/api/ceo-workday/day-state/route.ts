import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * CEO Workday™ day state — account persistence for the parts of the workday
 * that previously lived only in the browser: the Today's Work™ queue, the
 * What Must Happen Today™ hourly statements/affirmations, and hour assignments.
 *
 * GET    ?dates=YYYY-MM-DD,YYYY-MM-DD  → the founder's saved rows + import status
 * PUT    { date, kind, payload }       → save one piece of state
 * POST   { entries: [...] }            → one-time browser import (never overwrites)
 *
 * Every query runs as the signed-in founder; RLS restricts rows to auth.uid().
 */

const KINDS = ["todays_work", "hourly_work", "hour_overrides"] as const
type DayStateKind = (typeof KINDS)[number]

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_PAYLOAD_BYTES = 200_000
const MAX_IMPORT_ENTRIES = 60

interface DayStateEntry {
  date: string
  kind: DayStateKind
  payload: Record<string, unknown>
}

function parseEntry(value: unknown): DayStateEntry | null {
  if (!value || typeof value !== "object") return null
  const { date, kind, payload } = value as Record<string, unknown>
  if (typeof date !== "string" || !DATE_RE.test(date)) return null
  if (typeof kind !== "string" || !KINDS.includes(kind as DayStateKind)) return null
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null
  if (JSON.stringify(payload).length > MAX_PAYLOAD_BYTES) return null
  return { date, kind: kind as DayStateKind, payload: payload as Record<string, unknown> }
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function GET(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 })

  const dates = (new URL(req.url).searchParams.get("dates") ?? "")
    .split(",")
    .filter((d) => DATE_RE.test(d))
    .slice(0, 7)
  if (dates.length === 0) return NextResponse.json({ error: "A valid date is required." }, { status: 400 })

  const [rows, imported] = await Promise.all([
    supabase
      .from("ceo_workday_day_state")
      .select("state_date, kind, payload, updated_at")
      .eq("user_id", user.id)
      .in("state_date", dates),
    supabase.from("ceo_workday_browser_imports").select("imported_at").eq("user_id", user.id).maybeSingle(),
  ])

  if (rows.error) {
    console.error("[day-state] read failed:", rows.error.message)
    return NextResponse.json({ error: "Could not load your workday." }, { status: 500 })
  }

  return NextResponse.json({ rows: rows.data ?? [], imported: Boolean(imported.data) })
}

export async function PUT(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 })

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  const entry = parseEntry(body)
  if (!entry) return NextResponse.json({ error: "Invalid workday data." }, { status: 400 })

  // baseUpdatedAt is the version this device last loaded (null = "I believe
  // nothing is saved yet"). A save only lands if the account still holds that
  // version; otherwise the founder is warned instead of overwriting newer work.
  const base = typeof body?.baseUpdatedAt === "string" ? body.baseUpdatedAt : null
  const force = body?.force === true
  const updatedAt = new Date().toISOString()
  const table = () => supabase.from("ceo_workday_day_state")
  const fail = (message: string) => {
    console.error("[day-state] save failed:", message)
    return NextResponse.json({ error: "Could not save your workday." }, { status: 500 })
  }
  const conflict = async () => {
    const { data } = await table()
      .select("state_date, kind, payload, updated_at")
      .eq("user_id", user.id)
      .eq("state_date", entry.date)
      .eq("kind", entry.kind)
      .maybeSingle()
    return NextResponse.json({ error: "conflict", current: data }, { status: 409 })
  }

  if (force) {
    const { error } = await table().upsert(
      {
        user_id: user.id,
        state_date: entry.date,
        kind: entry.kind,
        payload: entry.payload,
        source: "app",
        updated_at: updatedAt,
      },
      { onConflict: "user_id,state_date,kind" },
    )
    return error ? fail(error.message) : NextResponse.json({ updated_at: updatedAt })
  }

  if (base) {
    const { data, error } = await table()
      .update({ payload: entry.payload, source: "app", updated_at: updatedAt })
      .eq("user_id", user.id)
      .eq("state_date", entry.date)
      .eq("kind", entry.kind)
      .eq("updated_at", base)
      .select("updated_at")
    if (error) return fail(error.message)
    if (data && data.length > 0) return NextResponse.json({ updated_at: data[0].updated_at })
    return conflict()
  }

  const { data, error } = await table()
    .insert({
      user_id: user.id,
      state_date: entry.date,
      kind: entry.kind,
      payload: entry.payload,
      source: "app",
      updated_at: updatedAt,
    })
    .select("updated_at")
    .single()
  if (error) return error.code === "23505" ? conflict() : fail(error.message)
  return NextResponse.json({ updated_at: data.updated_at })
}

export async function POST(req: Request) {
  const { supabase, user } = await requireUser()
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 })

  const body = (await req.json().catch(() => null)) as { entries?: unknown } | null
  const rawEntries = Array.isArray(body?.entries) ? body.entries.slice(0, MAX_IMPORT_ENTRIES) : []
  const entries = rawEntries.map(parseEntry).filter((e): e is DayStateEntry => e !== null)

  // The import marker is claimed first; its primary key guarantees the import
  // runs at most once per founder, even across tabs or devices.
  const { error: claimError } = await supabase.from("ceo_workday_browser_imports").insert({
    user_id: user.id,
    summary: {
      received: rawEntries.length,
      accepted: entries.length,
      kinds: entries.map((e) => `${e.kind}:${e.date}`),
    },
  })
  if (claimError) {
    if (claimError.code === "23505") return NextResponse.json({ status: "already_imported" })
    console.error("[day-state] import claim failed:", claimError.message)
    return NextResponse.json({ error: "Could not import your browser workday." }, { status: 500 })
  }

  if (entries.length > 0) {
    // ignoreDuplicates: anything already saved to the account wins; the
    // browser copy only fills gaps and never overwrites account data.
    const { error } = await supabase.from("ceo_workday_day_state").upsert(
      entries.map((e) => ({
        user_id: user.id,
        state_date: e.date,
        kind: e.kind,
        payload: e.payload,
        source: "browser_import",
      })),
      { onConflict: "user_id,state_date,kind", ignoreDuplicates: true },
    )
    if (error) {
      console.error("[day-state] import write failed:", error.message)
      return NextResponse.json({ error: "Could not import your browser workday." }, { status: 500 })
    }
  }

  return NextResponse.json({ status: "imported", accepted: entries.length })
}
