"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // The public marketing site and the free Reality Check onboarding are
  // standalone journeys. Do not expose the authenticated member workspace
  // navigation before a participant has purchased the Business Week.
  if (
    pathname?.startsWith("/sunday-shift") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/linkedin-header/capture") ||
    pathname?.startsWith("/installation") ||
    pathname?.startsWith("/boss") ||
    pathname === "/founder-profile" ||
    pathname === "/business-context" ||
    pathname === "/boundary-report" ||
    pathname === "/pricing" ||
    pathname === "/welcome/cherry-blossom/complete"
  ) {
    return null
  }

  return <TopNavigation />
}
