import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { providerIsConfigured } from "@/lib/connected-tools/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 })

  const { data, error } = await supabase
    .from("connected_accounts")
    .select("id, provider, email, display_name, granted_scopes, status, access_token_expires_at, connected_at")
    .order("updated_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Connected services could not be loaded." }, { status: 500 })
  }

  return NextResponse.json({
    providers: {
      google: { configured: providerIsConfigured("google"), label: "Gmail" },
      microsoft: { configured: providerIsConfigured("microsoft"), label: "Outlook" },
    },
    accounts: data ?? [],
  })
}
