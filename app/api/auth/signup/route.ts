import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, product } = await request.json()

    console.log("[v0] Signup request:", { email, firstName, product })

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const { data: existingProfile } = await adminClient
      .from("user_profiles")
      .select("id, email, password_set")
      .eq("email", email)
      .maybeSingle()

    // Check if auth user exists
    const { data: authUsers } = await adminClient.auth.admin.listUsers()
    const existingAuthUser = authUsers?.users?.find((u) => u.email === email)

    console.log("[v0] Existing profile:", existingProfile ? "found" : "not found")
    console.log("[v0] Existing auth user:", existingAuthUser ? "found" : "not found")

    // Case 1: Both profile and auth user exist
    if (existingProfile && existingAuthUser) {
      console.log("[v0] Account fully exists, updating password")

      // Update the password for existing user
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingAuthUser.id, {
        password: password,
      })

      if (updateError) {
        console.error("[v0] Password update error:", updateError)
        return NextResponse.json(
          { error: "Account exists. Please use the login tab or reset your password." },
          { status: 400 },
        )
      }

      // Update profile to mark password as set
      await adminClient.from("user_profiles").update({ password_set: true }).eq("id", existingAuthUser.id)

      console.log("[v0] Password updated successfully")
      return NextResponse.json({
        success: true,
        message: "Password updated. You can now log in.",
      })
    }

    // Case 2: Profile exists but no auth user (orphaned from Zapier)
    if (existingProfile && !existingAuthUser) {
      console.log("[v0] Orphaned profile found, creating auth user")

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { created_from: "signup_recovery" },
      })

      if (authError || !authData.user) {
        console.error("[v0] Auth creation error:", authError)
        return NextResponse.json({ error: "Failed to create account. Please contact support." }, { status: 500 })
      }

      // Update the profile with the new auth user ID
      const { error: updateError } = await adminClient
        .from("user_profiles")
        .update({
          id: authData.user.id,
          password_set: true,
        })
        .eq("email", email)

      if (updateError) {
        console.error("[v0] Profile update error:", updateError)
        // Clean up the auth user we just created
        await adminClient.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: "Failed to link account. Please try again." }, { status: 500 })
      }

      console.log("[v0] Account recovered successfully")
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
      })
    }

    // Case 3: Auth user exists but no profile (shouldn't happen, but handle it)
    if (!existingProfile && existingAuthUser) {
      console.log("[v0] Auth user exists without profile, creating profile")

      const profileData = {
        id: existingAuthUser.id,
        email: email,
        name: firstName || email.split("@")[0],
        membership_tier: "monday_only",
        password_set: true,
        joined_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }

      const { error: profileError } = await adminClient.from("user_profiles").insert(profileData)

      if (profileError) {
        console.error("[v0] Profile creation error:", profileError)
        return NextResponse.json({ error: "Failed to create profile. Please try logging in instead." }, { status: 500 })
      }

      console.log("[v0] Profile created for existing auth user")
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
      })
    }

    // Case 4: Neither exists - create both (normal signup)
    console.log("[v0] Creating new account from scratch")

    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("[v0] Auth creation error:", authError)
      return NextResponse.json({ error: authError.message || "Failed to create account" }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    console.log("[v0] Auth user created:", authData.user.id)

    const { data: profileByIdCheck } = await adminClient
      .from("user_profiles")
      .select("id")
      .eq("id", authData.user.id)
      .maybeSingle()

    const profileData = {
      id: authData.user.id,
      email: email,
      name: firstName || email.split("@")[0],
      membership_tier: "monday_only",
      password_set: true,
      joined_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    console.log("[v0] Creating profile with data:", profileData)

    const { error: profileError } = await adminClient.from("user_profiles").upsert(profileData, { onConflict: "id" })

    if (profileError) {
      console.error("[v0] Profile creation error:", profileError)

      // Clean up auth user only if we just created it
      if (!profileByIdCheck) {
        console.log("[v0] Cleaning up auth user due to profile creation failure")
        await adminClient.auth.admin.deleteUser(authData.user.id)
      }

      return NextResponse.json({ error: "Failed to create user profile. Please try again." }, { status: 500 })
    }

    console.log("[v0] Account created successfully")
    return NextResponse.json({ success: true, message: "Account created successfully" })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account" },
      { status: 500 },
    )
  }
}
