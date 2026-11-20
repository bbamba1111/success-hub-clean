"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // The public marketing site, free Reality Check onboarding, and checkout
  // confirmation are standalone journeys. Do not expose member navigation
  // before the participant enters the member workspace.
  if (
    pathname?.startsWith("/sunday-shift") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/linkedin-header/capture") ||
    pathname?.startsWith("/installation") ||
    pathname?.startsWith("/boss") ||
    pathname?.startsWith("/checkout/success") ||
    pathname === "/founder-profile" ||
    pathname === "/business-context" ||
    pathname === "/boundary-report" ||
    pathname === "/pricing" ||
    pathname?.startsWith("/welcome/cherry-blossom")
  ) {
    return null
  }

  return <TopNavigation />
}
