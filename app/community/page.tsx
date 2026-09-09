/**
 * Community™ — Page
 * -----------------
 * Server component with metadata. All rendering delegated to CommunityClient.
 */

import type { Metadata } from "next"
import { CommunityClient } from "./community-client"

export const metadata: Metadata = {
  title: "Community™ | Harmony Lane™",
  description:
    "Connect with fellow founders in the Harmony Lane™ Community. Check in daily, celebrate wins, join live sessions, and stay in rhythm together.",
}

export default function CommunityPage() {
  return <CommunityClient />
}
