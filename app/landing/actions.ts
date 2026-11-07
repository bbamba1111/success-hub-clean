"use server"

import { headers } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import { nextSessionDate } from "@/lib/reality-check/session"
import { sendConfirmationEmail } from "@/lib/reality-check/email"
import { allowRegistrationAttempt, clientIp } from "@/lib/reality-check/rate-limit"

export type RegistrationState = {
  status: "idle" | "success" | "error"
  message?: string
  sessionDate?: string
  email?: string
  /** sent: delivered now · already_sent: earlier submission · failed: seat saved, email not delivered */
  emailStatus?: "sent" | "already_sent" | "failed"
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function registerForRealityCheck(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", sessionDate: nextSessionDate(), emailStatus: "sent" }
  }

  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const mobileRaw = String(formData.get("mobile") ?? "").trim()

  if (fullName.length < 1 || fullName.length > 120) {
    return { status: "error", message: "Please enter your full name." }
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address." }
  }
  const mobile = mobileRaw.replace(/[^\d+]/g, "")
  if (mobileRaw && (mobile.length < 7 || mobile.length > 25)) {
    return { status: "error", message: "Please enter a valid mobile number, or leave it blank." }
  }

  const sessionDate = nextSessionDate()
  let supabase: ReturnType<typeof createAdminClient>
  let registration: { id: string; full_name: string; confirmation_sent_at: string | null }

  try {
    supabase = createAdminClient()

    if (!(await allowRegistrationAttempt(supabase, clientIp(headers())))) {
      return { status: "error", message: "Too many attempts. Please wait a few minutes and try again." }
    }

    const { error: upsertError } = await supabase.from("reality_check_registrations").upsert(
      { full_name: fullName, email, mobile: mobile || null, session_date: sessionDate, source: "landing-holiday" },
      { onConflict: "email,session_date", ignoreDuplicates: true },
    )
    if (upsertError) throw upsertError

    const { data, error: selectError } = await supabase
      .from("reality_check_registrations")
      .select("id, full_name, confirmation_sent_at")
      .eq("email", email)
      .eq("session_date", sessionDate)
      .single()
    if (selectError || !data) throw selectError ?? new Error("Registration not found after save")
    registration = data
  } catch (err) {
    console.error("[reality-check] registration failed", err)
    return { status: "error", message: "We couldn't save your seat just now. Please try again." }
  }

  if (registration.confirmation_sent_at) {
    return { status: "success", sessionDate, email, emailStatus: "already_sent" }
  }

  const result = await sendConfirmationEmail({
    id: registration.id,
    fullName: registration.full_name,
    email,
    sessionDate,
  })

  await supabase
    .from("reality_check_registrations")
    .update(
      result.ok
        ? { confirmation_sent_at: new Date().toISOString(), confirmation_error: null }
        : { confirmation_error: result.error.slice(0, 500) },
    )
    .eq("id", registration.id)

  if (!result.ok) {
    console.error("[reality-check] confirmation email failed", result.error)
    return { status: "success", sessionDate, email, emailStatus: "failed" }
  }
  return { status: "success", sessionDate, email, emailStatus: "sent" }
}
