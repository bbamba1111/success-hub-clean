import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Generate the password reset link using Admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/reset-password`,
      },
    })

    if (error) {
      console.error("[v0] Password reset link generation error:", error)
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 })
    }

    if (!data?.properties?.action_link) {
      console.error("[v0] No action link generated")
      return NextResponse.json({ error: "Failed to generate reset link" }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error: emailError } = await resend.emails.send({
      from: "Make Time For More <noreply@hub.maketimeformore.com>",
      to: [email],
      subject: "Reset Your Password - Make Time For More",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    <!-- Gradient Header Banner -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
                      </td>
                    </tr>
                    
                    <!-- Email Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">Hello,</p>
                        
                        <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">
                          We received a request to reset your password for your Make Time For More Success Hub account.
                        </p>
                        
                        <p style="font-size: 16px; color: #333333; margin: 0 0 30px;">
                          Click the button below to reset your password:
                        </p>
                        
                        <!-- Reset Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${data.properties.action_link}" 
                                 style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="font-size: 14px; color: #666666; margin: 30px 0 0; padding-top: 20px; border-top: 1px solid #eeeeee;">
                          This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.
                        </p>
                        
                        <p style="font-size: 14px; color: #666666; margin: 20px 0 0;">
                          Best regards,<br>
                          <strong style="color: #7FB069;">Make Time For More Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #999999; margin: 0;">
                          Make Time For More Success Hub<br>
                          <a href="https://maketimeformore.com" style="color: #7FB069; text-decoration: none;">maketimeformore.com</a>
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
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
    }

    console.log("[v0] Password reset email sent successfully via Resend")
    return NextResponse.json({ success: true, message: "Password reset email sent" })
  } catch (error) {
    console.error("[v0] Password reset error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reset email" },
      { status: 500 },
    )
  }
}
