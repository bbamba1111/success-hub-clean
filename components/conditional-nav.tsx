"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

// Pages that should not show the main navigation (free access funnel)
const HIDDEN_NAV_PATHS = [
  "/sunday-shift",
  "/cherry-blossom-intentions",
]

export function ConditionalNav() {
  const pathname = usePathname()

  // Hide the default nav on restricted pages (free access funnel - no navigation)
  const shouldHideNav = HIDDEN_NAV_PATHS.some(path => pathname?.startsWith(path))
  
  if (shouldHideNav) {
    return null
  }

  return <TopNavigation />
}
