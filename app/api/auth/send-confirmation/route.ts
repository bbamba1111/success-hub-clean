import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { email, password, name, membershipTier } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Check if user already exists
    const { data: existingProfile } = await adminClient
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    let userId: string

    if (existingProfile) {
      // User exists, just update their password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingProfile.id, {
        password: password,
      })

      if (updateError) {
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
      }

      await adminClient.from("user_profiles").update({ password_set: true }).eq("id", existingProfile.id)
      userId = existingProfile.id
    } else {
      // Create new user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // We'll confirm via email link
      })

      if (authError || !authData.user) {
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
      }

      userId = authData.user.id

      // Create user profile
      const { error: profileError } = await adminClient.from("user_profiles").insert({
        id: authData.user.id,
        email: email,
        name: name || email.split("@")[0],
        membership_tier: membershipTier || "basic",
        password_set: true,
        joined_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })

      if (profileError) {
        await adminClient.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }
    }

    // Generate confirmation token and store in database
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await adminClient.from("password_reset_tokens").insert({
      token,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    })

    // Send confirmation email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY)
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/confirm-email?token=${token}`

    await resend.emails.send({
      from: "Make Time For More <noreply@hub.maketimeformore.com>",
      to: email,
      subject: "Confirm Your Email - Make Time For More Success Hub",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Make Time For More!</h1>
            </div>
            <div style="background: #ffffff; padding: 30px; border: 2px solid #7FB069; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #333;">Hi ${name || "there"},</p>
              <p style="font-size: 16px; color: #333;">Thank you for joining the Make Time For More Success Hub! We're excited to have you on this journey to better work-life balance.</p>
              <p style="font-size: 16px; color: #333;">Please confirm your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmUrl}" style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Confirm Email</a>
              </div>
              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 14px; color: #7FB069; word-break: break-all;">${confirmUrl}</p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="font-size: 12px; color: #999; text-align: center;">Make Time For More Success Hub<br>Creating balance, one day at a time</p>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send confirmation email" },
      { status: 500 },
    )
  }
}
