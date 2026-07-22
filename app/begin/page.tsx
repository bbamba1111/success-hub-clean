import { redirect } from "next/navigation"

/**
 * /begin — Onboarding entry point.
 *
 * Updated flow (Phase 11):
 *   /begin → /founder-profile → /audit → /entrepreneur-success-assessment
 *   → /harmony-blueprint → /design-my-week → /live-today
 *
 * /begin now redirects immediately to /founder-profile so any existing
 * links or email campaigns that point to /begin continue to work.
 */
export default function BeginPage() {
  redirect("/founder-profile")
}
