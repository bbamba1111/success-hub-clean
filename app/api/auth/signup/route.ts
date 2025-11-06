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
      .select("id, email")
      .eq("email", email)
      .maybeSingle()

    if (existingProfile) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "Account already exists. Please use the login tab." }, { status: 400 })
    }

    console.log("[v0] Creating new auth user...")
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

    const { error: profileError } = await adminClient.from("user_profiles").insert(profileData)

    if (profileError) {
      console.error("[v0] Profile creation error:", {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
      })

      await adminClient.auth.admin.deleteUser(authData.user.id)

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
