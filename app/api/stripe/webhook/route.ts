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

/** Map Stripe plan IDs to values accepted by user_profiles.membership_tier. */
function membershipTierForPlan(planId: string | undefined): string {
  switch (planId) {
    case "harmony-lane":
      return "monthly_member"
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return entities[character]
  })
}

/**
 * Send the password-setup link. Resend errors are treated as webhook failures
 * so Stripe retries; the existing-profile path below reuses the stored token.
 */
async function sendOnboardingEmail({
  email,
  name,
  planId,
  token,
}: {
  email: string
  name: string
  planId: string | undefined
  token: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured")

  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://free-reality-check.vercel.app"
  const appUrl = configuredAppUrl.endsWith("/") ? configuredAppUrl.slice(0, -1) : configuredAppUrl
  const welcomeUrl = `${appUrl}/welcome?email=${encodeURIComponent(email)}&product=${encodeURIComponent(
    planId || "membership",
  )}&token=${token}`

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: "Make Time For More <noreply@hub.maketimeformore.com>",
    to: email,
    subject: "Set Up Your Account - Make Time For More Success Hub",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Make Time For More!</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 2px solid #7FB069; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333;">Hi ${escapeHtml(name || "there")},</p>
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

  if (error) {
    console.error("[stripe-webhook] Resend rejected onboarding email:", error)
    throw new Error("Resend could not send the onboarding email")
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured")
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  if (!signature) {
    console.error("[stripe-webhook] Missing stripe-signature header")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const rawBody = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    console.error("[stripe-webhook] Signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription
      const customerId =
        typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id
      const customer = await stripe.customers.retrieve(customerId)
      const email = customer.deleted ? null : (customer as Stripe.Customer).email
      if (!email) return NextResponse.json({ received: true, skipped: "no customer email" })

      const { error } = await createAdminClient()
        .from("user_profiles")
        .update({ membership_tier: "free", updated_at: new Date().toISOString() })
        .eq("email", email)

      if (error) {
        console.error("[stripe-webhook] Could not end membership:", error.message)
        return NextResponse.json({ error: "Failed to update membership" }, { status: 500 })
      }
      return NextResponse.json({ received: true, membership_tier: "free" })
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: event.type })
    }

    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status !== "paid") {
      console.log("[stripe-webhook] Session is not paid; skipping:", session.id, session.payment_status)
      return NextResponse.json({ received: true, skipped: "not paid" })
    }

    const email = session.customer_details?.email || session.customer_email
    const name = session.customer_details?.name || ""
    const planId = session.metadata?.planId
    const membershipTier = membershipTierForPlan(planId)

    if (!email) {
      console.error("[stripe-webhook] Completed session has no customer email:", session.id)
      return NextResponse.json({ error: "No customer email on session" }, { status: 400 })
    }

    console.log("[stripe-webhook] Paid checkout received:", {
      email,
      planId,
      membershipTier,
      session_id: session.id,
    })

    const supabase = createAdminClient()
    const { data: existingProfile, error: lookupError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (lookupError) {
      console.error("[stripe-webhook] User lookup failed:", lookupError.message)
      return NextResponse.json({ error: "Failed to look up member" }, { status: 500 })
    }

    if (existingProfile) {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ membership_tier: membershipTier, updated_at: new Date().toISOString() })
        .eq("email", email)

      if (updateError) {
        console.error("[stripe-webhook] Failed to update existing member:", updateError.message)
        return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
      }

      // An established account does not need password setup. If onboarding was
      // started but not completed, re-send a valid link using a fresh token.
      if (existingProfile.password_set) {
        return NextResponse.json({
          received: true,
          message: "Existing member membership updated; account already active",
          email,
          membership_tier: membershipTier,
        })
      }

      const onboardingToken = crypto.randomBytes(32).toString("hex")
      const tokenExpiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      const { error: tokenError } = await supabase
        .from("user_profiles")
        .update({ onboarding_token: onboardingToken, token_expires_at: tokenExpiresAt })
        .eq("email", email)

      if (tokenError) {
        console.error("[stripe-webhook] Failed to refresh onboarding token:", tokenError.message)
        return NextResponse.json({ error: "Failed to prepare onboarding link" }, { status: 500 })
      }

      await sendOnboardingEmail({ email, name: name || existingProfile.name || "", planId, token: onboardingToken })
      console.log("[stripe-webhook] Onboarding email re-sent to existing incomplete member:", email)

      return NextResponse.json({
        received: true,
        message: "Existing member updated and onboarding email sent",
        email,
        membership_tier: membershipTier,
      })
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
      console.error("[stripe-webhook] Auth user creation failed:", authError)
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
      console.error("[stripe-webhook] Profile creation failed:", profileError.message)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
    }

    try {
      await sendOnboardingEmail({ email, name, planId, token: onboardingToken })
    } catch (emailError) {
      // Return 500 so Stripe retries. On retry, the existing-profile path
      // refreshes the token and attempts delivery again.
      console.error("[stripe-webhook] Onboarding email delivery failed:", emailError)
      return NextResponse.json({ error: "Onboarding email delivery failed" }, { status: 500 })
    }

    console.log("[stripe-webhook] New member created and onboarding email sent:", email)
    return NextResponse.json({
      received: true,
      message: "New member created and onboarding email sent",
      email,
      user_id: authData.user.id,
      membership_tier: membershipTier,
    })
  } catch (error) {
    console.error("[stripe-webhook] Processing failed:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
