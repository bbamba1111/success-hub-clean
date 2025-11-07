import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Invalid or expired confirmation link" }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Confirmation link has expired" }, { status: 400 })
    }

    // Confirm the user's email in Supabase Auth
    const { error: confirmError } = await supabase.auth.admin.updateUserById(tokenData.user_id, {
      email_confirm: true,
    })

    if (confirmError) {
      console.error("[v0] Email confirmation error:", confirmError)
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 })
    }

    // Mark token as used
    await supabase.from("password_reset_tokens").update({ used: true }).eq("token", token)

    return NextResponse.json({ success: true, message: "Email confirmed successfully" })
  } catch (error) {
    console.error("[v0] Confirm email error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to confirm email" },
      { status: 500 },
    )
  }
}
