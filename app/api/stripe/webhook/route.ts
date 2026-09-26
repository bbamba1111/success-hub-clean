import { createAdminClient } from "@/lib/supabase/admin"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from "crypto"
import type Stripe from "stripe"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Stripe webhook endpoint is ready",
    timestamp: new Date().toISOString(),
  })
}

/**
 * DB constraint on user_profiles.membership_tier only allows a fixed set of
 * values. Map this app's plan ids (lib/payments/config.ts) to one of them.
 */
function membershipTierForPlan(planId: string | undefined): string {
  switch (planId) {
    case "monthly":
      return "monthly"
    case "annual":
      return "annual"
    case "vip":
      return "premium"
    default:
      return "monthly"
  }
}

/**
 * SECURITY — this is the single source of truth for granting paid access via
 * Stripe. Every request is verified with Stripe's own signature scheme
 * (`stripe.webhooks.constructEvent`, HMAC-SHA256 over the raw body using
 * STRIPE_WEBHOOK_SECRET) BEFORE the body is parsed or any account/entitlement
 * change is made. There is no fallback path — if the signature is missing,
 * malformed, or does not match, the request is rejected and nothing happens.
 *
 * This mirrors app/api/samcart/webhook/route.ts's entitlement-granting logic
 * (create-or-update user_profiles, generate + email a one-time
 * onboarding_token) so /api/auth/send-confirmation works identically
 * regardless of which payment provider produced the purchase.
 */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("[v0] Stripe webhook rejected: STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  if (!signature) {
    console.error("[v0] Stripe webhook rejected: missing stripe-signature header")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  // Signature verification requires the exact raw request body — never
  // request.json() before this, since re-serializing would change the bytes
  // and break the HMAC check.
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("[v0] Stripe webhook rejected: signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type !== "checkout.session.completed") {
      // Acknowledge everything else so Stripe doesn't retry, but take no action.
      return NextResponse.json({ received: true, ignored: event.type })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status !== "paid") {
      console.log("[v0] Stripe webhook: session not paid, skipping:", session.id, session.payment_status)
      return NextResponse.json({ received: true, skipped: "not paid" })
    }

    const email = session.customer_details?.email || session.customer_email
    const name = session.customer_details?.name || ""
    const planId = session.metadata?.planId
    const membershipTier = membershipTierForPlan(planId)

    if (!email) {
      console.error("[v0] Stripe webhook error: no email on completed session", session.id)
      return NextResponse.json({ error: "No customer email on session" }, { status: 400 })
    }

    console.log("[v0] Stripe checkout completed:", { email, planId, membershipTier, session_id: session.id })

    const supabase = createAdminClient()

    const { data: existingProfile, error: lookupError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) {
      console.error("[v0] Error looking up user:", lookupError)
    }

    if (existingProfile) {
      console.log("[v0] User exists, updating tier:", email, "->", membershipTier)

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ membership_tier: membershipTier, updated_at: new Date().toISOString() })
        .eq("email", email)

      if (updateError) {
        console.error("[v0] Error updating user profile:", updateError)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: "User updated", email, membership_tier: membershipTier })
    }

    const onboardingToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: onboardingToken,
      email_confirm: true,
      user_metadata: { name, membership_tier: membershipTier },
    })

    if (authError || !authData.user) {
      console.error("[v0] Error creating auth user:", authError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

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
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    console.log("[v0] User created successfully via Stripe:", { email, user_id: authData.user.id, membership_tier })

    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"
      const welcomeUrl = `${appUrl}/welcome?email=${encodeURIComponent(email)}&product=${encodeURIComponent(
        planId || "membership",
      )}&token=${onboardingToken}`

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
                <p style="font-size: 16px; color: #333;">Hi ${name || "there"},</p>
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
      email,
      user_id: authData.user.id,
      membership_tier: membershipTier,
    })
  } catch (error) {
    console.error("[v0] Stripe webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
