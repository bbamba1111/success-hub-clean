import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "SamCart webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}

/**
 * SECURITY: SamCart's "Notify URL" webhooks do not support custom headers or
 * HMAC request signing. The mechanism SamCart itself supports for
 * authenticating these requests is a shared secret embedded directly in the
 * Notify URL configured in the SamCart Webhooks app (Settings > Webhooks),
 * e.g. https://yourdomain.com/api/samcart/webhook?secret=<SAMCART_WEBHOOK_SECRET>.
 *
 * This verifies that query-string secret against SAMCART_WEBHOOK_SECRET using
 * a timing-safe comparison before any account or entitlement is touched. If
 * the secret is not configured, or does not match, the request is rejected —
 * this endpoint fails closed, never open.
 */
function isVerifiedSamCartRequest(request: Request): boolean {
  const expected = process.env.SAMCART_WEBHOOK_SECRET
  if (!expected) {
    console.error("[v0] SamCart webhook rejected: SAMCART_WEBHOOK_SECRET is not configured")
    return false
  }

  const url = new URL(request.url)
  const provided = url.searchParams.get("secret") ?? ""

  const expectedBuf = Buffer.from(expected)
  const providedBuf = Buffer.from(provided)
  if (expectedBuf.length !== providedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}

export async function POST(request: Request) {
  try {
    if (!isVerifiedSamCartRequest(request)) {
      console.error("[v0] SamCart webhook rejected: invalid or missing secret")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    // Email the customer their personalized onboarding link. The link
    // carries the onboarding_token generated above — this is the credential
    // that /api/auth/send-confirmation requires before it will ever set a
    // password for this email, so account setup stays tied to this verified
    // purchase and can't be triggered by guessing an email address.
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const welcomeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/welcome?email=${encodeURIComponent(email)}&product=${encodeURIComponent(productName)}&token=${onboardingToken}`

      await resend.emails.send({
        from: "Make Time For More <noreply@hub.maketimeformore.com>",
        to: email,
        subject: "Set Up Your Account - Make Time For More Success Hub",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Make Time For More!</h1>
              </div>
              <div style="background: #ffffff; padding: 30px; border: 2px solid #7FB069; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; color: #333;">Hi ${firstName || "there"},</p>
                <p style="font-size: 16px; color: #333;">Thank you for your purchase! Let's finish setting up your Success Hub account.</p>
                <p style="font-size: 16px; color: #333;">Click the button below to create your password and get started:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${welcomeUrl}" style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Set Up My Account</a>
                </div>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link:</p>
                <p style="font-size: 14px; color: #7FB069; word-break: break-all;">${welcomeUrl}</p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">This link expires in 48 hours.</p>
              </div>
            </body>
          </html>
        `,
      })
      console.log("[v0] Onboarding email sent successfully to:", email)
    } catch (emailError) {
      console.error("[v0] Error sending onboarding email:", emailError)
      // Don't fail the webhook over an email delivery issue — the purchase
      // and account are already recorded; support can resend manually.
    }

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
