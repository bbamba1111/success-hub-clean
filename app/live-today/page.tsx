import type { Metadata } from "next"
import { OperatingEngineProvider } from "@/components/operating-engine-provider"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { BusinessDayHero } from "@/components/business-day-hero"
import { BusinessDaySchedule } from "@/components/business-day-schedule"
import { DeveloperToolbar } from "@/components/developer-toolbar"
import { TodaysOperatingSystem } from "@/components/live-today/todays-operating-system"
import { OperatingBrief } from "@/components/founder-intelligence/operating-brief"

export const metadata: Metadata = {
  title: "Live Today™ | Make Time For More™",
  description:
    "Your daily front door — what today looks like, your current Operating Experience™, and your next best step.",
}

/**
 * Live Today™ — Pass 1 primary daily experience and post-login home.
 *
 * Composes the EXISTING engine-driven home components (hero + schedule +
 * reality check) into their new IA home. No redesign in this pass — this simply
 * establishes Live Today™ as the single daily front door for returning members.
 */
export default function LiveTodayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <OperatingEngineProvider>
        {/* Harmony Context Engine™ — the single operating-context layer that
            composes the engine snapshot with Sunday's installed week. */}
        <HarmonyProvider>
          {/* Engine-driven hero — the in-session Operating Experience™ + tools */}
          <BusinessDayHero />

          {/* Operating Brief™ — Founder Intelligence™ orchestrates today's team,
              insight, and deliverables from live Harmony Context™. */}
          <OperatingBrief />

          {/* Today's Operating System™ — Cherry Blossom's context-aware guidance */}
          <TodaysOperatingSystem />

          {/* Today's Work-Life Balance Business Day™ — full daily rhythm */}
          <BusinessDaySchedule />

          {/* Admin-only Developer Toolbar (renders nothing for regular members) */}
          <DeveloperToolbar />
        </HarmonyProvider>
      </OperatingEngineProvider>
    </main>
  )
}
