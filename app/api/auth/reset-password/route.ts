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
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                We received a request to reset your password for your Make Time For More Success Hub account.
              </p>
              
              <p style="font-size: 16px; margin-bottom: 30px;">
                Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.properties.action_link}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This link will expire in 1 hour for security reasons.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #999; text-align: center;">
                Make Time For More Success Hub<br>
                <a href="https://maketimeformore.com" style="color: #667eea; text-decoration: none;">maketimeformore.com</a>
              </p>
            </div>
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
