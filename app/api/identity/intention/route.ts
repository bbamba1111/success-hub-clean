import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const {
    segment_id,
    movement_type,
    duration_minutes,
    intention_notes,
  } = body

  if (!segment_id) {
    return NextResponse.json({ error: "segment_id required" }, { status: 400 })
  }

  const today = new Date().toISOString().split("T")[0]

  const { data, error } = await supabase
    .from("segment_intentions")
    .upsert(
      {
        user_id: user.id,
        segment_id,
        segment_date: today,
        movement_type: movement_type ?? null,
        duration_minutes: duration_minutes ?? null,
        intention_notes: intention_notes ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,segment_id,segment_date" }
    )
    .select()
    .single()

  if (error) {
    console.error("[identity/intention] upsert error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ intention: data })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const segment_id = searchParams.get("segment_id")
  const today = new Date().toISOString().split("T")[0]

  let query = supabase
    .from("segment_intentions")
    .select("*, segment_declarations(*)")
    .eq("user_id", user.id)
    .eq("segment_date", today)

  if (segment_id) {
    query = query.eq("segment_id", segment_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ intentions: data })
}
