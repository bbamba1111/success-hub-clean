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

    console.log("[v0] SamCart webhook received with enhanced data:", {
      email: body.email,
      product: body.product_name,
      order_id: body.order_id,
      timestamp: new Date().toISOString(),
      fullBody: JSON.stringify(body),
    })

    const email = body.email || body.customer?.email
    const firstName = body.first_name || body.customer?.first_name || ""
    const lastName = body.last_name || body.customer?.last_name || ""
    const name = body.name || `${firstName} ${lastName}`.trim() || email
    const productName = body.product_name || body.product?.name || ""

    const orderId = body.order_id || body.id
    const purchaseAmount = body.amount || body.total
    const purchaseDate = body.purchase_date || body.created_at

    if (!email) {
      console.error("[v0] Webhook error: No email provided")
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Determine membership tier based on product
    let membershipTier = "monday_only"
    if (productName?.toLowerCase().includes("7-day") || productName?.toLowerCase().includes("7 day")) {
      membershipTier = "7_day"
    } else if (productName?.toLowerCase().includes("21-day") || productName?.toLowerCase().includes("21 day")) {
      membershipTier = "21_day"
    }

    console.log("[v0] Determined membership tier:", membershipTier, "from product:", productName)

    const supabase = createAdminClient()

    console.log("[v0] Checking if user exists:", email)
    const { data: existingProfile, error: lookupError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .single()

    if (lookupError && lookupError.code !== "PGRST116") {
      console.error("[v0] Error looking up user:", lookupError)
    }

    if (existingProfile) {
      console.log("[v0] User exists, updating:", email, "Current tier:", existingProfile.membership_tier)

      const { data: updateData, error: updateError } = await supabase
        .from("user_profiles")
        .update({
          membership_tier: membershipTier,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()

      if (updateError) {
        console.error("[v0] Error updating user profile:", {
          error: updateError,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          code: updateError.code,
        })
        return NextResponse.json(
          {
            error: "Failed to update user",
            details: updateError.message,
            code: updateError.code,
            hint: updateError.hint,
          },
          { status: 500 },
        )
      }

      console.log("[v0] User updated successfully:", email, "Update result:", updateData)
      return NextResponse.json({
        success: true,
        message: "User updated",
        email: email,
        membership_tier: membershipTier,
      })
    }

    const onboardingToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    console.log("[v0] Creating new user:", email, "with membership tier:", membershipTier)

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
      console.error("[v0] Error creating auth user:", {
        error: authError,
        message: authError?.message,
        status: authError?.status,
      })
      return NextResponse.json(
        {
          error: "Failed to create user",
          details: authError?.message,
          status: authError?.status,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Auth user created:", authData.user.id, "Now creating profile...")

    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .insert({
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
      .select()

    if (profileError) {
      console.error("[v0] Error creating user profile:", {
        error: profileError,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
      })

      console.log("[v0] Cleaning up auth user due to profile creation failure")
      await supabase.auth.admin.deleteUser(authData.user.id)

      return NextResponse.json(
        {
          error: "Failed to create profile",
          details: profileError.message,
          code: profileError.code,
          hint: profileError.hint,
        },
        { status: 500 },
      )
    }

    console.log("[v0] User created successfully:", {
      email,
      user_id: authData.user.id,
      membership_tier: membershipTier,
      token_expiry: tokenExpiresAt.toISOString(),
      profile: profileData,
    })

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      email: email,
      user_id: authData.user.id,
      membership_tier: membershipTier,
    })
  } catch (error) {
    console.error("[v0] SamCart webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
