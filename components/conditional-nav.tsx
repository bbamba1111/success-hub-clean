"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // Hide the default nav on pages that supply their own (sunday-shift, the
  // public marketing site, the Monday landing page, and the installation
  // engine).
  if (
    pathname?.startsWith("/sunday-shift") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/monday") ||
    pathname?.startsWith("/installation")
  ) {
    return null
  }

  return <TopNavigation />
}
