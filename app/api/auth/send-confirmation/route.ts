import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { email, password, name, membershipTier } = await request.json()

    console.log("[v0] Send confirmation request for:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    let adminClient
    try {
      adminClient = createAdminClient()
      console.log("[v0] Admin client created successfully")
    } catch (err) {
      console.error("[v0] Failed to create admin client:", err)
      return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 })
    }

    // Check if user exists in Auth
    let existingAuthUser = null
    try {
      const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers()

      if (listError) {
        console.error("[v0] Error listing users:", listError)
      } else {
        existingAuthUser = existingUsers?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())
        console.log("[v0] Existing auth user found:", existingAuthUser?.id || "none")
      }
    } catch (err) {
      console.error("[v0] Exception listing users:", err)
    }

    let userId: string

    if (existingAuthUser) {
      console.log("[v0] Updating existing auth user:", existingAuthUser.id)

      // User exists in auth, update their password
      const { error: updateError } = await adminClient.auth.admin.updateUserById(existingAuthUser.id, {
        password: password,
        email_confirm: true,
      })

      if (updateError) {
        console.error("[v0] Error updating user password:", updateError)
        return NextResponse.json({ error: "Failed to update password: " + updateError.message }, { status: 500 })
      }

      userId = existingAuthUser.id

      // Check if profile exists
      const { data: existingProfile, error: profileCheckError } = await adminClient
        .from("user_profiles")
        .select("id")
        .eq("id", existingAuthUser.id)
        .single()

      console.log(
        "[v0] Existing profile check:",
        existingProfile?.id || "none",
        profileCheckError?.message || "no error",
      )

      if (!existingProfile) {
        console.log("[v0] Creating missing profile for existing auth user")
        const { error: profileError } = await adminClient.from("user_profiles").insert({
          id: existingAuthUser.id,
          email: email,
          name: name || email.split("@")[0],
          membership_tier: membershipTier || "basic",
          password_set: true,
          joined_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("[v0] Error creating profile for existing user:", profileError)
          // Continue anyway - user can log in
        } else {
          console.log("[v0] Profile created successfully for existing user")
        }
      } else {
        // Update existing profile
        const { error: updateProfileError } = await adminClient
          .from("user_profiles")
          .update({
            password_set: true,
            membership_tier: membershipTier || "basic",
            name: name || existingProfile.name,
          })
          .eq("id", existingAuthUser.id)

        if (updateProfileError) {
          console.error("[v0] Error updating profile:", updateProfileError)
        }
      }
    } else {
      console.log("[v0] Creating new user for:", email)

      // Create new user
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError || !authData.user) {
        console.error("[v0] Error creating auth user:", authError)
        return NextResponse.json(
          { error: "Failed to create account: " + (authError?.message || "Unknown error") },
          { status: 500 },
        )
      }

      userId = authData.user.id
      console.log("[v0] Created new auth user:", userId)

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
        console.error("[v0] Error creating profile:", profileError)
        // Don't fail - user can still log in
      } else {
        console.log("[v0] Profile created successfully")
      }
    }

    // Generate confirmation token
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const { error: tokenError } = await adminClient.from("password_reset_tokens").insert({
      token,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    })

    if (tokenError) {
      console.error("[v0] Error creating token:", tokenError)
    }

    // Send confirmation email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"}/auth/confirm-email?token=${token}`

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
                <p style="font-size: 16px; color: #333;">Thank you for joining the Make Time For More Success Hub!</p>
                <p style="font-size: 16px; color: #333;">Please confirm your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${confirmUrl}" style="background: linear-gradient(135deg, #7FB069 0%, #E26C73 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">Confirm Email</a>
                </div>
                <p style="font-size: 14px; color: #666;">Or copy and paste this link:</p>
                <p style="font-size: 14px; color: #7FB069; word-break: break-all;">${confirmUrl}</p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">This link expires in 24 hours.</p>
              </div>
            </body>
          </html>
        `,
      })
      console.log("[v0] Confirmation email sent successfully")
    } catch (emailError) {
      console.error("[v0] Error sending email:", emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send confirmation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create user account" },
      { status: 500 },
    )
  }
}
