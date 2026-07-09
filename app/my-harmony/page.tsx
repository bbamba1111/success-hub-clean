import type { Metadata } from "next"
import { Flower2 } from "lucide-react"
import { ComingSoon } from "@/components/navigation/coming-soon"

export const metadata: Metadata = {
  title: "My Harmony™ | Make Time For More™",
  description:
    "Your results, memory, milestones, and long-term Human Sustainability™ — all in one place.",
}

/**
 * My Harmony™ — a permanent navigation destination and the future home of the
 * member's profile. Placeholder for now (Pass 4A.1); Results, Memory, and
 * account settings will consolidate here in a later pass. Their existing routes
 * remain live in the meantime.
 */
export default function MyHarmonyPage() {
  return (
    <ComingSoon
      eyebrow="The Work-Life Balance Operating System™"
      title="My Harmony™"
      tagline="Not a settings page — the story of your journey. Soon, this brings together everything that reflects your growth across the Operating System™, in one calm home."
      icon={Flower2}
      planned={[
        "Work-Life Balance Reality Check™ history and trends",
        "Business Foundation profile and Operating Rules™",
        "Cherry Blossom Memory™, badges, and milestones",
        "Human Sustainability™ trends and account settings",
      ]}
    />
  )
}
