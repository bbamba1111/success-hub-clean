"use client"

import { usePathname } from "next/navigation"
import { TopNavigation } from "@/components/top-navigation"

export function ConditionalNav() {
  const pathname = usePathname()

  // Hide the default nav on sunday-shift pages (they have their own nav)
  if (pathname?.startsWith("/sunday-shift")) {
    return null
  }

  return <TopNavigation />
}
