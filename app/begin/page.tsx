import { redirect } from "next/navigation"

/**
 * /begin — legacy entry point for the optional weekly 7-day Work-Life Balance Audit™.
 *
 * Returning members are no longer routed here automatically after login.
 * My Blueprint™ offers the optional audit whenever a founder chooses to take
 * a fresh weekly measurement. Existing links to /begin continue to work.
 */
export default function BeginPage() {
  redirect("/audit")
}
