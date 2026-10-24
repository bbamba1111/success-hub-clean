"use client"

/**
 * CommunityClient — wraps CommunityProvider + CommunityPageLayout.
 * This is the single client boundary for the /community route.
 */

import { CommunityProvider } from "@/components/community/community-provider"
import { CommunityPageLayout } from "@/components/community/community-page-layout"

export function CommunityClient() {
  return (
    <CommunityProvider>
      <CommunityPageLayout />
    </CommunityProvider>
  )
}
