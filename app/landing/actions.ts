"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { nextSessionDate } from "@/lib/reality-check/session"

export type RegistrationState = {
  status: "idle" | "success" | "error"
  message?: string
  sessionDate?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function registerForRealityCheck(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", sessionDate: nextSessionDate() }
  }

  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const mobileRaw = String(formData.get("mobile") ?? "").trim()
  const smsConsent = formData.get("smsConsent") === "on"

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
  if (smsConsent && !mobile) {
    return { status: "error", message: "Add a mobile number to receive text reminders." }
  }

  const sessionDate = nextSessionDate()

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("reality_check_registrations").upsert(
      {
        full_name: fullName,
        email,
        mobile: mobile || null,
        sms_consent: smsConsent,
        session_date: sessionDate,
        source: "landing-holiday",
      },
      { onConflict: "email,session_date", ignoreDuplicates: true },
    )
    if (error) throw error
  } catch (err) {
    console.error("[reality-check] registration failed", err)
    return { status: "error", message: "We couldn't save your seat just now. Please try again." }
  }

  return { status: "success", sessionDate }
}
