"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

/**
 * Wraps the Monday landing page's primary CTA for authenticated visitors.
 *
 * The Founder Profile™ / Business Context™ / EGA Screen 1 / Cherry Blossom
 * Welcome™ / Cherry Blossom Thank-You™ on-ramp gates only live in
 * localStorage today (no Supabase table — see
 * lib/founder-profile/founder-profile-store.ts,
 * lib/business-context/business-context-store.ts,
 * lib/ega/ega-signal-store.ts, and
 * lib/onboarding/onboarding-welcome-store.ts), so they can't be checked from
 * the server component that renders this page. `serverHref` already reflects
 * every *server-checkable* gate (Reality Check™ via Supabase, or "/" once
 * fully onboarded). On mount, this checks the remaining client-only gates in
 * the same precedence order as `getPostLoginDestination()` and swaps the
 * href in place if any is incomplete.
 */
export function MondayCtaLink({
  serverHref,
  children,
}: {
  serverHref: string
  children: ReactNode
}) {
  const [href, setHref] = useState(serverHref)

  useEffect(() => {
    // Only the "fully onboarded, going to the daily front door" case needs
    // the extra client-side checks — /pricing and /begin already take
    // precedence server-side regardless of on-ramp state.
    if (serverHref !== "/") return

    Promise.all([
      import("@/lib/founder-profile/founder-profile-store"),
      import("@/lib/business-context/business-context-store"),
      import("@/lib/ega/ega-signal-store"),
      import("@/lib/onboarding/onboarding-welcome-store"),
    ]).then(
      ([
        { hasCompletedFounderProfile },
        { hasCompletedBusinessContext },
        { hasCompletedEgaOnboardingSignal },
        { hasSeenCherryBlossomWelcome, hasSeenCherryBlossomThankYou },
      ]) => {
        if (!hasCompletedFounderProfile()) {
          setHref(hasSeenCherryBlossomWelcome() ? "/founder-profile" : "/welcome/cherry-blossom")
          return
        }
        if (!hasCompletedBusinessContext()) {
          setHref("/business-context")
          return
        }
        if (!hasCompletedEgaOnboardingSignal()) {
          setHref("/entrepreneur-gap-assessment?onboarding=1")
          return
        }
        if (!hasSeenCherryBlossomThankYou()) {
          setHref("/welcome/cherry-blossom/complete")
        }
      },
    )
  }, [serverHref])

  return <Link href={href}>{children}</Link>
}
