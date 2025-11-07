import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(tokenData.user_id, {
      password: password,
    })

    if (updateError) {
      console.error("[v0] Error updating password:", updateError)
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    await supabase.from("password_reset_tokens").update({ used: true }).eq("token", token)

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("[v0] Update password error:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
