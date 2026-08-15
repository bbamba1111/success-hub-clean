"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"

/**
 * Wraps the Monday landing page's primary CTA for authenticated visitors.
 *
 * `Business Context™` completion only lives in localStorage today (no
 * Supabase table — see lib/business-context/business-context-store.ts), so
 * it can't be checked from the server component that renders this page.
 * `serverHref` already reflects every *server-checkable* gate (Reality
 * Check™ via Supabase, or "/" once fully onboarded). On mount, this checks
 * the one remaining client-only gate and swaps the href in place if it's
 * incomplete — same destination `getPostLoginDestination()` would return,
 * just resolved where its data actually lives.
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
    // the extra client-side check — /pricing and /begin already take
    // precedence server-side regardless of Business Context state.
    if (serverHref !== "/") return
    import("@/lib/business-context/business-context-store").then(({ hasCompletedBusinessContext }) => {
      if (!hasCompletedBusinessContext()) {
        setHref("/business-context")
      }
    })
  }, [serverHref])

  return <Link href={href}>{children}</Link>
}
