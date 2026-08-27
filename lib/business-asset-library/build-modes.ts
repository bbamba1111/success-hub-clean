/**
 * Business Asset Library™ — Build Modes (Phase 12.1)
 * ---------------------------------------------------------------------------
 * Every Business Asset™ can be built two ways, and previewed a third:
 *
 *   - "build-with-ai"  → the AI Executive actively collaborates: asking
 *     questions, drafting, and refining together with the founder.
 *   - "guided-diy"     → the founder does the work themselves, but the AI
 *     Executive still teaches, checks answers, and advances them step by
 *     step. This is NOT a blank worksheet — the founder is never left to
 *     "figure it out" alone.
 *   - "print-offline"  → a printable version of the same asset. Declared as
 *     architecture only: NO PDF generation happens this phase. Rendered as a
 *     disabled/coming-soon control until a future Render Engine™ pass wires
 *     in real generation (see lib/output-architecture/render-engine.ts).
 *
 * Neither digital mode makes a live LLM call this phase — this mirrors the
 * current, honestly-labeled state of the real 9-executive roster
 * (lib/executive-team/executive-registry.ts, status: "architecture"). Both
 * are scripted, static, UI-only guided flows that are clearly future-hookable
 * to a live AI Executive without a redesign.
 */

export type BuildModeId = "build-with-ai" | "guided-diy" | "print-offline"

export interface BuildModeDefinition {
  id: BuildModeId
  /** Short label for buttons. */
  label: string
  /** One-line description of what this mode does. */
  description: string
  /** The voice/framing this mode uses when presenting a guided step. */
  stepFraming: "ai-drafts" | "founder-does-with-coaching"
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
    id: "guided-diy",
    label: "Do It Myself",
    description:
      "You do the work yourself. The AI Executive explains each step, checks your answers, and guides you to the next one.",
    stepFraming: "founder-does-with-coaching",
    icon: "GraduationCap",
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
