import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Verify token is valid and not used
    const { data: resetToken, error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token is expired
    const expiresAt = new Date(resetToken.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    // Update user password
    const { error: updateError } = await adminClient.auth.admin.updateUserById(resetToken.user_id, {
      password: password,
    })

    if (updateError) {
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    // Mark token as used
    await adminClient.from("password_reset_tokens").update({ used: true }).eq("token", token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update password error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update password",
      },
      { status: 500 },
    )
  }
}
