import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up user by email
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile lookup error:", profileError)
      return NextResponse.json({ error: "User not found. Please contact support." }, { status: 404 })
    }

    // Check if token is still valid (if it exists)
    if (profile.token_expires_at && new Date(profile.token_expires_at) < new Date()) {
      return NextResponse.json({ error: "Onboarding link expired. Please contact support." }, { status: 400 })
    }

    return NextResponse.json({
      email: profile.email,
      userId: profile.id,
      tempPassword: profile.onboarding_token || null,
      name: profile.name,
    })
  } catch (error) {
    console.error("[v0] Verify email error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
