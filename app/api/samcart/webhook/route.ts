import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "SamCart webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] SamCart webhook received:", body)

    const email = body.email || body.customer?.email
    const firstName = body.first_name || body.customer?.first_name || ""
    const lastName = body.last_name || body.customer?.last_name || ""
    const name = body.name || `${firstName} ${lastName}`.trim() || email
    const productName = body.product_name || body.product?.name || ""

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Determine membership tier based on product
    let membershipTier = "monday_only"
    if (productName?.toLowerCase().includes("7-day") || productName?.toLowerCase().includes("7 day")) {
      membershipTier = "7_day"
    } else if (productName?.toLowerCase().includes("21-day") || productName?.toLowerCase().includes("21 day")) {
      membershipTier = "21_day"
    }

    const supabase = createAdminClient()

    // Check if user already exists
    const { data: existingProfile } = await supabase.from("user_profiles").select("*").eq("email", email).single()

    if (existingProfile) {
      // User exists, update their tier
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          membership_tier: membershipTier,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)

      if (updateError) {
        console.error("[v0] Error updating user profile:", updateError)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "User updated",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`,
      })
    }

    // Generate secure onboarding token (also used as temp password)
    const onboardingToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours for Zapier delay

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: onboardingToken,
      email_confirm: true,
      user_metadata: {
        name,
        membership_tier: membershipTier,
      },
    })

    if (authError || !authData.user) {
      console.error("[v0] Error creating auth user:", authError)
      return NextResponse.json({ error: "Failed to create user", details: authError?.message }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from("user_profiles").insert({
      id: authData.user.id,
      email,
      name,
      membership_tier: membershipTier,
      onboarding_token: onboardingToken,
      token_expires_at: tokenExpiresAt.toISOString(),
      password_set: false,
      joined_date: new Date().toISOString(),
      cycle_start_date: new Date().toISOString(),
      current_cycle: 1,
    })

    if (profileError) {
      console.error("[v0] Error creating user profile:", profileError)
      return NextResponse.json({ error: "Failed to create profile", details: profileError.message }, { status: 500 })
    }

    console.log("[v0] User created successfully:", email)

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      email: email,
    })
  } catch (error) {
    console.error("[v0] SamCart webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
