"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // Hide the default nav on pages that supply their own (sunday-shift and the
  // public marketing site).
  if (pathname?.startsWith("/sunday-shift") || pathname?.startsWith("/landing")) {
    return null
  }

  return <TopNavigation />
}
