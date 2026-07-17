"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // Hide the default nav on pages that supply their own (sunday-shift, the
  // public marketing site, and the installation engine).
  if (
    pathname?.startsWith("/sunday-shift") ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/installation")
  ) {
    return null
  }

  return <TopNavigation />
}
