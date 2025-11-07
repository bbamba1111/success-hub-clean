import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const { data: resetToken, error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token is expired
    const expiresAt = new Date(resetToken.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Token has expired" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      userId: resetToken.user_id,
    })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
