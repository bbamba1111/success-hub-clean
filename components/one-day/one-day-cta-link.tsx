import type { ReactNode } from "react"
import { ONE_DAY_CHECKOUT_URL } from "@/lib/one-day/config"

/**
 * Wraps the /1day primary CTA. Unlike MondayCtaLink (which routes already-
 * onboarded members into the app), this offer has no existing gated
 * on-ramp to check — it leads straight to the future Paperbell checkout.
 *
 * Until lib/one-day/config.ts#ONE_DAY_CHECKOUT_URL is set to a real
 * Paperbell URL, this renders the CTA as a non-navigating, visibly
 * "Coming Soon" control rather than linking to a fake or unrelated URL.
 */
export function OneDayCtaLink({ children }: { children: ReactNode }) {
  if (!ONE_DAY_CHECKOUT_URL) {
    return (
      <span className="inline-flex cursor-not-allowed opacity-70" aria-disabled="true" title="Checkout opening soon">
        {children}
      </span>
    )
  }

  return (
    <a href={ONE_DAY_CHECKOUT_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
