import type { Metadata } from "next"
import { MyBlueprintClient } from "@/components/my-blueprint/my-blueprint-client"

export const metadata: Metadata = {
  title: "My Blueprint™ | Harmony Lane™",
  description:
    "Your Work-Life Harmony Blueprint™ — the member's personal source of truth inside Harmony Lane™, bringing together the Weekly Reality Check™, Work-Life Balance Audit™, Entrepreneur Success Assessment™, Founder Profile™, and Business Context™ in one place.",
}

export default function MyBlueprintPage() {
  return <MyBlueprintClient />
}
