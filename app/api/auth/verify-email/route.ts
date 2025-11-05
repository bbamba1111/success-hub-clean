import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

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

    // Check if token is still valid
    if (profile.token_expires_at && new Date(profile.token_expires_at) < new Date()) {
      return NextResponse.json({ error: "Onboarding link expired. Please contact support." }, { status: 400 })
    }

    // Get the temporary password from auth metadata
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(profile.id)

    if (authError || !authUser) {
      console.error("[v0] Auth user lookup error:", authError)
      return NextResponse.json({ error: "Authentication error. Please contact support." }, { status: 500 })
    }

    // Return user data for auto-login
    // Note: We can't return the actual password, so we'll need to use a different approach
    // We'll create a temporary session token instead
    return NextResponse.json({
      email: profile.email,
      tempPassword: profile.onboarding_token, // Use token as temp password
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
