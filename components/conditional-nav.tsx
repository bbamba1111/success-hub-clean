"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // Keep member navigation out of public checkout and first-time account setup.
  // The member workspace becomes available after the password is created.
  if (
    pathname?.startsWith("/sunday-shift") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/linkedin-header/capture") ||
    pathname?.startsWith("/installation") ||
    pathname?.startsWith("/boss") ||
    pathname?.startsWith("/checkout/success") ||
    pathname === "/welcome" ||
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
