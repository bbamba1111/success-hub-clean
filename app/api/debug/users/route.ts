import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Get all user profiles
    const { data: profiles, error: profileError } = await supabase.from("user_profiles").select("*")

    if (profileError) {
      console.error("[v0] Debug endpoint error:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      count: profiles?.length || 0,
      users: profiles?.map((p) => ({
        email: p.email,
        name: p.name,
        membership_tier: p.membership_tier,
        has_token: !!p.onboarding_token,
        token_expires: p.token_expires_at,
        password_set: p.password_set,
        created_at: p.created_at,
      })),
    })
  } catch (error: any) {
    console.error("[v0] Debug endpoint error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
