import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"

/**
 * SECURITY: This endpoint sets the initial password for a member's account.
 * It must never be reachable without proof of a verified purchase.
 *
 * That proof is the `onboarding_token` the SamCart webhook
 * (app/api/samcart/webhook/route.ts) generates and emails to the customer
 * after a verified payment. This route requires that exact token to match
 * an un-expired, not-yet-consumed token on a user_profiles row before it will
 * create or update any credentials — an email address alone (which is
 * guessable/knowable) is never sufficient.
 *
 * membership_tier is never read from the request body and is never written
 * here — paid tiers are set exclusively by the SamCart webhook.
 */
export async function POST(request: Request) {
  try {
    const { email, password, name, token } = await request.json()

    console.log("[v0] Send confirmation request for:", email)

    if (!email || !password || !token) {
      return NextResponse.json({ error: "Email, password, and a valid onboarding link are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    let adminClient
    try {
      adminClient = createAdminClient()
      console.log("[v0] Admin client created successfully")
    } catch (err) {
      console.error("[v0] Failed to create admin client:", err)
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 })
    }

    // Look up the profile the SamCart webhook created for this email. This
    // is the trusted, server-side record of the verified purchase.
    const { data: profile, error: profileLookupError } = await adminClient
      .from("user_profiles")
      .select("id, name, onboarding_token, token_expires_at, password_set")
      .eq("email", email)
      .maybeSingle()

    if (profileLookupError) {
      console.error("[v0] Error looking up profile:", profileLookupError)
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }

    if (!profile) {
      console.error("[v0] Send confirmation rejected: no profile/purchase found for", email)
      return NextResponse.json(
        { error: "We couldn't find a purchase for this email. Please complete your purchase first." },
        { status: 403 },
      )
    }

    if (profile.password_set) {
      console.error("[v0] Send confirmation rejected: account already set up for", email)
      return NextResponse.json(
        { error: "This account is already set up. Please log in, or use 'Forgot password' to reset it." },
        { status: 403 },
      )
    }

    if (!profile.onboarding_token || profile.onboarding_token !== token) {
      console.error("[v0] Send confirmation rejected: invalid onboarding token for", email)
      return NextResponse.json(
        { error: "This onboarding link is invalid. Please use the link from your purchase confirmation email." },
        { status: 403 },
      )
    }

    if (!profile.token_expires_at || new Date(profile.token_expires_at) < new Date()) {
      console.error("[v0] Send confirmation rejected: expired onboarding token for", email)
      return NextResponse.json(
        { error: "This onboarding link has expired. Please contact support for a new one." },
        { status: 403 },
      )
    }

    const userId: string = profile.id

    // Set the password on the auth user the webhook created for this profile.
    const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    })

    if (updateError) {
      console.error("[v0] Error setting password:", updateError)
      return NextResponse.json({ error: "Failed to set password: " + updateError.message }, { status: 500 })
    }

    // Mark onboarding complete and consume the token so it can't be replayed.
    // SECURITY: membership_tier is intentionally never touched here.
    const { error: updateProfileError } = await adminClient
      .from("user_profiles")
      .update({
        password_set: true,
        name: name || profile.name,
        onboarding_token: null,
        token_expires_at: null,
      })
      .eq("id", userId)

    if (updateProfileError) {
      console.error("[v0] Error updating profile:", updateProfileError)
    }

    // Generate confirmation token
    const confirmToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const { error: tokenError } = await adminClient.from("password_reset_tokens").insert({
      token: confirmToken,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    })

    if (tokenError) {
      console.error("[v0] Error creating token:", tokenError)
    }

    // Send confirmation email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/confirm-email?token=${confirmToken}`

      await resend.emails.send({
        from: "Make Time For More <noreply@hub.maketimeformore.com>",
        to: email,
        subject: "Confirm Your Email - Make Time For More Success Hub",
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
                <p style="font-size: 16px; color: #333;">Thank you for joining the Make Time For More Success Hub!</p>
                <p style="font-size: 16px; color: #333;">Please confirm your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Confirm Email</a>
                </div>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link:</p>
                <p style="font-size: 14px; color: #7FB069; word-break: break-all;">${confirmUrl}</p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">This link expires in 24 hours.</p>
              </div>
            </body>
          </html>
        `,
      })
      console.log("[v0] Confirmation email sent successfully")
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user account" },
      { status: 500 },
    )
  }
}
