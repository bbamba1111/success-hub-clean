import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up user by email
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile lookup error:", profileError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, {
      password: password,
    })

    if (updateError) {
      console.error("[v0] Password update error:", updateError)
      return NextResponse.json({ error: "Failed to set password" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Set password error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
