import type { Metadata } from "next"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { MyBlueprintClient } from "@/components/my-blueprint/my-blueprint-client"

export const metadata: Metadata = {
  title: "My Blueprint™ | Harmony Lane™",
  description:
    "Your Work-Life Harmony Blueprint™ — the member's personal source of truth inside Harmony Lane™, bringing together the Weekly Reality Check™, Work-Life Balance Audit™, Entrepreneur Success Assessment™, Founder Profile™, Business Context™, and your Founder GPS™ Next Best Move™ in one place.",
}

// `OperatingEngineProvider` is already global via the root `app/layout.tsx`.
// `HarmonyProvider` is added here (Phase 7) so `MyBlueprintClient` can read
// `useHarmonyContext()` to surface the canonical Founder GPS™ Next Best Move™.
export default function MyBlueprintPage() {
  return (
    <HarmonyProvider>
      <MyBlueprintClient />
    </HarmonyProvider>
  )
}
