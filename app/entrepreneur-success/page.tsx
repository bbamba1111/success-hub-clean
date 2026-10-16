import { redirect } from "next/navigation"

/**
 * /entrepreneur-success — canonical redirect to the full assessment route.
 * Handles direct URL access and any legacy links pointing to this shorter path.
 */
export default function EntrepreneurSuccessRedirectPage() {
  redirect("/entrepreneur-success-assessment")
}
