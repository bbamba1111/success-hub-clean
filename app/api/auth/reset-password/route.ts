import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if user exists
    const { data: profile, error: profileError } = await adminClient
      .from("user_profiles")
      .select("id, email, name")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ success: true })
    }

    // Generate reset token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await adminClient.from("password_reset_tokens").insert({
      token,
      user_id: profile.id,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`

    // Send reset email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: "Make Time For More <noreply@hub.maketimeformore.com>",
      to: email,
      subject: "Reset Your Password - Make Time For More Success Hub",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Request</h1>
            </div>
            <div style="background: #ffffff; padding: 30px; border: 2px solid #7FB069; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Hi ${profile.name || "there"},</p>
              <p style="font-size: 16px; color: #333;">We received a request to reset your password for your Make Time For More Success Hub account.</p>
              <p style="font-size: 16px; color: #333;">Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Reset Password</a>
              </div>
              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 14px; color: #7FB069; word-break: break-all;">${resetUrl}</p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 1 hour.</p>
              <p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn't request a password reset, you can safely ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">Make Time For More Success Hub<br>Creating balance, one day at a time</p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reset email" },
      { status: 500 },
    )
  }
}
