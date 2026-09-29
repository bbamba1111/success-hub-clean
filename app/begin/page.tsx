import { redirect } from "next/navigation"

/**
 * /begin — Weekly Reality Check™ entry point.
 *
 * Reached from getPostLoginDestination() when the founder's one-time
 * Founder Profile™ + Business Context™ on-ramp is already complete but
 * this week's Weekly Reality Check™ (the Work-Life Balance Audit™) hasn't
 * been done yet. /founder-profile is a REQUIRED ONE-TIME on-ramp gate —
 * completed members must never be sent back through it here.
 *
 * /begin redirects to /audit so any existing links or email campaigns that
 * point to /begin continue to work.
 */
export default function BeginPage() {
  redirect("/audit")
}
