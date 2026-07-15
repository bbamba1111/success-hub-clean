import type { Metadata } from "next"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { TodaysOperatingSystem } from "@/components/live-today/todays-operating-system"
import { DeveloperToolbar } from "@/components/developer-toolbar"

export const metadata: Metadata = {
  title: "Live & Lead Today™ | Harmony Lane™",
  description:
    "Live your Life Operating System™ and lead your Business Operating System™ — your daily operating workspace.",
}

/**
 * Live & Lead Today™ — the founder's primary daily operating workspace.
 *
 * One guide. One voice. One next step.
 * Cherry Blossom™ presents the current Operating Segment™, the Daily
 * Non-Negotiable™, the Intention Declaration™, and the CEO Workday™ workspace.
 * All competing intelligence blocks (Executive Brief, Founder Intelligence hero,
 * BusinessDaySchedule) have been removed per the Single Voice Principle™.
 */
export default function LiveTodayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F5F1E8] to-white">
      <HarmonyProvider>
        <TodaysOperatingSystem />
        <DeveloperToolbar />
      </HarmonyProvider>
    </main>
  )
}
