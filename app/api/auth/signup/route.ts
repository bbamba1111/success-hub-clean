import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, product, fromSamCart } = await request.json()

    console.log("[v0] Signup request received:", { email, firstName, product, fromSamCart })

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    console.log("[v0] Admin client created successfully")

    // Check if user already exists
    const { data: existingProfile } = await adminClient
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    console.log("[v0] Existing profile check:", existingProfile ? "User exists" : "New user")

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
    console.log("[v0] Creating new auth user...")
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authData.user) {
      console.error("[v0] Auth user creation error:", authError)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    console.log("[v0] Auth user created successfully:", authData.user.id)

    const profileData = {
      id: authData.user.id,
      email: email,
      name: firstName || email.split("@")[0],
      membership_tier: "monday_only",
      password_set: true,
      joined_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    console.log("[v0] Attempting to insert profile with data:", profileData)

    // Create user profile with correct column names from database schema
    const { error: profileError } = await adminClient.from("user_profiles").insert(profileData)

    if (profileError) {
      console.error("[v0] Profile creation error - Full details:", {
        error: profileError,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
        stack: (profileError as any).stack,
      })
      // Clean up auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        {
          error: "Failed to create user profile",
          details: profileError.message,
          hint: profileError.hint,
          code: profileError.code,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Profile created successfully")
    return NextResponse.json({ success: true, message: "Account created successfully" })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account" },
      { status: 500 },
    )
  }
}
