import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find user by token
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("onboarding_token", token)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token is expired
    const tokenExpiry = new Date(profile.token_expires_at)
    if (tokenExpiry < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    // Get user from auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.admin.getUserById(profile.id)

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate a temporary password for auto-login
    const tempPassword = user.email + "_temp_" + token.substring(0, 10)

    // Clear the token (one-time use)
    await supabase
      .from("user_profiles")
      .update({
        onboarding_token: null,
        token_expires_at: null,
      })
      .eq("id", profile.id)

    return NextResponse.json({
      success: true,
      email: profile.email,
      tempPassword,
      name: profile.name,
      membershipTier: profile.membership_tier,
    })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
