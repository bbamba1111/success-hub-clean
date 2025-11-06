import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, product, fromSamCart } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if user already exists
    const { data: existingProfile } = await adminClient
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    if (existingProfile) {
      // User exists, just update their password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingProfile.id, {
        password: password,
      })

      if (updateError) {
        console.error("[v0] Password update error:", updateError)
        return NextResponse.json({ error: "Failed to set password" }, { status: 500 })
      }

      await adminClient.from("user_profiles").update({ password_set: true }).eq("id", existingProfile.id)

      return NextResponse.json({ success: true, message: "Password set successfully" })
    }

    // Create new user if they don't exist
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      console.error("[v0] Auth user creation error:", authError)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await adminClient.from("user_profiles").insert({
      id: authData.user.id,
      email: email,
      first_name: firstName || email.split("@")[0],
      product_name: product || "coaching program",
      membership_tier: "monday_only",
      password_set: true,
    })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)
      // Clean up auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Account created successfully" })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account" },
      { status: 500 },
    )
  }
}
