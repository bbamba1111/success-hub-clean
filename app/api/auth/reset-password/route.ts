import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/reset-password`,
    })

    if (error) {
      console.error("[v0] Password reset error:", error)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Password reset email sent" })
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reset email" },
      { status: 500 },
    )
  }
}
