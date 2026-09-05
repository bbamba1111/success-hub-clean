import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

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

    // NOTE: no separate "confirm your email" step is needed here — the
    // updateUserById call above already set email_confirm: true, so the
    // member's email is confirmed and their password is live immediately.
    // The client signs them in right after this call succeeds and routes
    // them into the required on-ramp (Cherry Blossom Welcome™ → Founder
    // Profile™ → Business Context™) via getPostLoginDestination().

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user account" },
      { status: 500 },
    )
  }
}
