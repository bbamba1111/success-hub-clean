import { Metadata } from "next"
import { HarmonyBlueprintClient } from "@/components/harmony-blueprint/harmony-blueprint-client"

export const metadata: Metadata = {
  title: "Your Harmony Blueprint™ | Harmony Lane™",
  description: "Your personal Harmony Blueprint™ — the foundation of your Work-Life Balance Operating System™.",
}

export default function HarmonyBlueprintPage() {
  return <HarmonyBlueprintClient />
}
