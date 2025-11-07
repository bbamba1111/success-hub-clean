import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { randomBytes } from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
      console.error("[v0] Error listing users:", userError)
      // Don't reveal if user exists
      return NextResponse.json({ message: "If an account exists, a reset email will be sent." })
    }

    const user = userData.users.find((u) => u.email === email)

    if (!user) {
      // Don't reveal if user doesn't exist
      return NextResponse.json({ message: "If an account exists, a reset email will be sent." })
    }

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (tokenError) {
      console.error("[v0] Error creating reset token:", tokenError)
      return NextResponse.json({ error: "Failed to create reset token" }, { status: 500 })
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/reset-password?token=${token}`

    const { error: emailError } = await resend.emails.send({
      from: "noreply@hub.maketimeformore.com",
      to: email,
      subject: "Reset Your Password - Make Time For More",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #E26C73 0%, #7FB069 100%); padding: 30px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { padding: 30px; background: #ffffff; }
              .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reset Your Password</h1>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>We received a request to reset your password for your Make Time For More Success Hub account.</p>
                <p>Click the button below to create a new password:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #7FB069;">${resetUrl}</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, you can safely ignore this email.</p>
                <p>Best regards,<br>The Make Time For More Team</p>
              </div>
              <div class="footer">
                <p>© 2025 Make Time For More. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (emailError) {
      console.error("[v0] Error sending email:", emailError)
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    return NextResponse.json({ message: "If an account exists, a reset email will be sent." })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
