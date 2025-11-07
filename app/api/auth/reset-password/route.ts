import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    console.log("[v0] Starting password reset request")

    const { email } = await request.json()
    console.log("[v0] Email received:", email)

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY is not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    console.log("[v0] Creating admin client")
    const supabase = createAdminClient()

    console.log("[v0] Generating recovery link")
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/reset-password`,
      },
    })

    if (error) {
      console.error("[v0] Error generating recovery link:", error)
      // Return success message anyway for security (don't reveal if email exists)
      return NextResponse.json(
        {
          success: true,
          message: "Password reset email sent! Check your inbox & SPAM",
        },
        { status: 200 },
      )
    }

    // Extract the hashed token from the generated link
    const resetUrl = data.properties.action_link

    console.log("[v0] Sending email via Resend")
    const { error: emailError } = await resend.emails.send({
      from: "noreply@hub.maketimeformore.com",
      to: email,
      subject: "Reset Your Password - Make Time For More",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; }
              .header { background: linear-gradient(135deg, #E26C73 0%, #7FB069 100%); padding: 30px; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { padding: 30px; background: #ffffff; }
              .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
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

    console.log("[v0] Password reset email sent successfully")

    return NextResponse.json(
      {
        success: true,
        message: "Password reset email sent! Check your inbox & SPAM",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Failed to process request",
      },
      { status: 500 },
    )
  }
}
