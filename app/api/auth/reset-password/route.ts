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
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F1E8;">
            <!-- Updated branding to match Make Time For More style -->
            <div style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <img src="https://success-hub-clean.vercel.app/images/logo.png" alt="Make Time For More" style="width: 60px; height: 60px; border-radius: 50%;" />
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 2px solid #7FB069; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; margin-bottom: 20px; color: #333;">Hello,</p>
              
              <p style="font-size: 16px; margin-bottom: 20px; color: #555;">
                We received a request to reset your password for your <strong>Make Time For More Success Hub</strong> account.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px; color: #555;">
                Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 35px 0;">
                <a href="${data.properties.action_link}" 
                   style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 8px rgba(127, 176, 105, 0.3);">
                  Reset My Password
                </a>
              </div>
              
              <div style="background: #FFF8E7; border-left: 4px solid #E26C73; padding: 16px; margin: 30px 0; border-radius: 4px;">
                <p style="font-size: 14px; color: #666; margin: 0;">
                  <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #E8E8E8; margin: 30px 0;">
              
              <div style="text-align: center;">
                <p style="font-size: 14px; color: #7FB069; font-weight: 600; margin-bottom: 8px;">
                  Make Time For More Success Hub
                </p>
                <p style="font-size: 12px; color: #999; margin: 4px 0;">
                  Your partner in achieving work-life balance
                </p>
                <p style="font-size: 12px; margin: 12px 0;">
                  <a href="https://maketimeformore.com" style="color: #7FB069; text-decoration: none; font-weight: 500;">maketimeformore.com</a>
                </p>
              </div>
            </div>
            
            <p style="text-align: center; font-size: 11px; color: #999; margin-top: 20px;">
              This is an automated email. Please do not reply to this message.
            </p>
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
