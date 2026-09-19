/**
 * Business Asset Library™ — Build Modes (Phase 12.1 → Phase 12.2)
 * ---------------------------------------------------------------------------
 * "Decision 2" — once the founder knows WHAT to build (Decision 1, the
 * Founder GPS™ recommendation), this is HOW they get it done. Mirrors the
 * vocabulary of the existing macro Build Path™ system
 * (lib/build-strategy/types.ts, used inside Founder GPS™ for a whole
 * business move) at the scale of a single asset:
 *
 *   - "build-with-ai" → the AI Executive actively collaborates: asking
 *     questions, drafting, and refining together with the founder.
 *   - "let-ai-do-it"  → an autonomous variant of the above: the AI Executive
 *     asks at most one essential question, then writes a complete first
 *     draft for the founder to review and edit. Same live chat surface as
 *     "build-with-ai", different system-prompt instruction (see
 *     app/api/business-asset-build/route.ts).
 *   - "guided-diy"    → the founder does the work themselves, but the AI
 *     Executive still teaches, checks answers, and advances them step by
 *     step. This is NOT a blank worksheet — the founder is never left to
 *     "figure it out" alone.
 *   - "give-to-team"  → generates a ready-to-send Delegation Brief™ built
 *     entirely from the asset's own registry content — no live AI call.
 *   - "hire-expert"   → generates an external Scope of Work brief framed for
 *     a freelancer or agency — no live AI call.
 *   - "buy-it"        → honest buy-vs-build guidance. Harmony Lane has no
 *     vendor marketplace yet, so this is guidance only, clearly labeled.
 *   - "print-offline" → a printable version of the same asset. Declared as
 *     architecture only: NO PDF generation happens this phase. Rendered as a
 *     disabled/coming-soon control until a future Render Engine™ pass wires
 *     in real generation (see lib/output-architecture/render-engine.ts).
 *
 * Only "build-with-ai" and "let-ai-do-it" make a live LLM call (gated by the
 * same allowlist in lib/business-asset-library/live-build.ts). The rest are
 * scripted, static, UI-only — honestly labeled, clearly future-hookable
 * without a redesign.
 */

export type BuildModeId =
  | "build-with-ai"
  | "let-ai-do-it"
  | "guided-diy"
  | "give-to-team"
  | "hire-expert"
  | "buy-it"
  | "print-offline"

export interface BuildModeDefinition {
  id: BuildModeId
  /** Short label for buttons. */
  label: string
  /** One-line description of what this mode does. */
  description: string
  /** The voice/framing this mode uses when presenting a guided step. */
  stepFraming: "ai-drafts" | "ai-autonomous" | "founder-does-with-coaching" | "static-brief"
  /** lucide-react icon name, mapped to a component at the presentation layer. */
  icon: string
  /** Whether this mode is available to interact with this phase. */
  available: boolean
}

export const BUILD_MODES: BuildModeDefinition[] = [
  {
    id: "build-with-ai",
    label: "Build With AI",
    description:
      "The appropriate AI Executive actively helps create this with you — asking questions, drafting, and refining together.",
    stepFraming: "ai-drafts",
    icon: "Sparkles",
    available: true,
  },
  {
    id: "let-ai-do-it",
    label: "Let AI Do It",
    description:
      "The AI Executive builds this for you end-to-end — you confirm a few key details, then review and edit the finished draft.",
    stepFraming: "ai-autonomous",
    icon: "Zap",
    available: true,
  },
  {
    id: "guided-diy",
    label: "Do It Myself",
    description:
      "You do the work yourself. The AI Executive explains each step, checks your answers, and guides you to the next one.",
    stepFraming: "founder-does-with-coaching",
    icon: "GraduationCap",
    available: true,
  },
  {
    id: "give-to-team",
    label: "Give It to My Team",
    description: "Generate a ready-to-send Delegation Brief™ so a team member can build this for you.",
    stepFraming: "static-brief",
    icon: "Users",
    available: true,
  },
  {
    id: "hire-expert",
    label: "Hire an Expert",
    description: "Generate an external Scope of Work brief to hand to a freelancer or agency.",
    stepFraming: "static-brief",
    icon: "Briefcase",
    available: true,
  },
  {
    id: "buy-it",
    label: "Buy It",
    description: "Get honest buy-vs-build guidance before you commit to building this yourself.",
    stepFraming: "static-brief",
    icon: "ShoppingBag",
    available: true,
  },
  {
    id: "print-offline",
    label: "Print / Work Offline",
    description: "Download a printable version to work on offline. Coming soon.",
    stepFraming: "founder-does-with-coaching",
    icon: "Printer",
    available: false,
  },
]

/** Look up a build mode definition by id. */
export function getBuildMode(id: BuildModeId): BuildModeDefinition | undefined {
  return BUILD_MODES.find((m) => m.id === id)
}
