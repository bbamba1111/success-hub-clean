import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Check if user exists
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, email, name")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate confirmation token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store token in password_reset_tokens table (reusing for confirmations)
    const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
      user_id: profile.id,
      token: token,
      expires_at: expiresAt.toISOString(),
      used: false,
    })

    if (tokenError) {
      console.error("[v0] Token creation error:", tokenError)
      return NextResponse.json({ error: "Failed to generate confirmation token" }, { status: 500 })
    }

    // Create confirmation URL
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/confirm?token=${token}`

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Make Time For More <noreply@hub.maketimeformore.com>",
      to: email,
      subject: "Confirm Your Email - Success Hub",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #F5F1E8;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F1E8; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header with gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Success Hub!</h1>
                      </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                          Hi ${profile.name || "there"},
                        </p>
                        <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                          Thank you for creating your account! Please confirm your email address by clicking the button below:
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                Confirm Your Email
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="font-size: 12px; color: #999; word-break: break-all; margin: 10px 0;">
                          ${confirmUrl}
                        </p>
                        <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 20px 0 0 0;">
                          This link will expire in 24 hours.
                        </p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #F5F1E8; padding: 20px 30px; text-align: center;">
                        <p style="font-size: 12px; color: #999; margin: 0;">
                          Make Time For More Success Hub
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (emailError) {
      console.error("[v0] Resend email error:", emailError)
      return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Confirmation email sent successfully" })
  } catch (error) {
    console.error("[v0] Send confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send confirmation email" },
      { status: 500 },
    )
  }
}
