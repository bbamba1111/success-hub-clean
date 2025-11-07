import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Verify token
    const { data: tokenData, error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    // Confirm user email in Supabase Auth
    const { error: confirmError } = await adminClient.auth.admin.updateUserById(tokenData.user_id, {
      email_confirm: true,
    })

    if (confirmError) {
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 })
    }

    // Mark token as used
    await adminClient.from("password_reset_tokens").update({ used: true }).eq("token", token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Email confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to confirm email" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Verify token
    const { data: tokenData, error: tokenError } = await adminClient
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .eq("used", false)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 })
    }

    // Confirm user email in Supabase Auth
    const { error: confirmError } = await adminClient.auth.admin.updateUserById(tokenData.user_id, {
      email_confirm: true,
    })

    if (confirmError) {
      return NextResponse.json({ error: "Failed to confirm email" }, { status: 500 })
    }

    // Mark token as used
    await adminClient.from("password_reset_tokens").update({ used: true }).eq("token", token)

    // Redirect to login page
    return NextResponse.redirect(new URL("/auth/login?confirmed=true", request.url))
  } catch (error) {
    console.error("[v0] Email confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to confirm email" },
      { status: 500 },
    )
  }
}
