"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export async function setUserPassword(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    const adminClient = createAdminClient()

    // Look up user by email
    const { data: profile, error: profileError } = await adminClient
      .from("user_profiles")
      .select("id, email")
      .eq("email", email)
      .single()

    if (profileError || !profile) {
      console.error("[v0] Profile lookup error:", profileError)
      return { error: "User not found" }
    }

    // Update user password using admin API
    const { error: updateError } = await adminClient.auth.admin.updateUserById(profile.id, {
      password: password,
    })

    if (updateError) {
      console.error("[v0] Password update error:", updateError)
      return { error: "Failed to set password" }
    }

    // Mark password as set
    await adminClient.from("user_profiles").update({ password_set: true }).eq("id", profile.id)

    return { success: true }
  } catch (error) {
    console.error("[v0] Set password error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to set password",
    }
  }
}
