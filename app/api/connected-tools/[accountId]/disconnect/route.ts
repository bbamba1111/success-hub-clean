import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(_request: NextRequest, context: { params: { accountId: string } }) {
  const accountId = context.params.accountId
  if (!UUID.test(accountId)) return NextResponse.json({ error: "That account could not be found." }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })

  const { data, error } = await supabase.rpc("connected_account_disconnect", { p_account_id: accountId })
  if (error || data !== true) {
    return NextResponse.json({ error: "The account could not be disconnected." }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
