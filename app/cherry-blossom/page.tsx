import type { Metadata } from "next"
import { OperatingEngineProvider } from "@/components/operating-engine-provider"
import { HarmonyProvider } from "@/components/harmony-context/harmony-context-provider"
import { MorningExecutiveBriefPanel } from "@/components/cherry-blossom/morning-executive-brief"
import { CherryBlossomIdentitySection } from "@/components/cherry-blossom/cherry-blossom-identity"

export const metadata: Metadata = {
  title: "Cherry Blossom™ | Chief of Staff & Executive Conductor™",
  description:
    "Cherry Blossom™ is your Executive Chief of Staff & Executive Conductor™ — she orchestrates your Harmony Lane™ Operating System so you can focus on doing your best work.",
}

/**
 * Cherry Blossom™ — Phase 7.1
 *
 * This is Cherry Blossom's home: the Morning Executive Brief™ experience.
 * She is not a chatbot. She is the Chief of Staff & Executive Conductor™.
 * She already knows the context. She has already prepared the brief.
 * The founder arrives here to receive it — not to ask for it.
 */
export default function CherryBlossomPage() {
  return (
    <main className="min-h-screen bg-white">
      <OperatingEngineProvider>
        <HarmonyProvider>
          {/* Cherry Blossom's identity statement — who she is and what she does */}
          <CherryBlossomIdentitySection />

          {/* The Morning Executive Brief™ — the core experience */}
          <MorningExecutiveBriefPanel />
        </HarmonyProvider>
      </OperatingEngineProvider>
    </main>
  )
}
