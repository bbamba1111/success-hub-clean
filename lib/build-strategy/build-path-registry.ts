/**
 * Build Path™ registry (Phase 9F)
 * ---------------------------------------------------------------------------
 * Static definitions for the 8 Build Paths™ a founder can choose from for
 * any given Founder GPS™ recommendation. Plain data, no logic — the same
 * style as `EXECUTION_PATHS` in `lib/output-architecture/execution-engine.ts`.
 */

import type { BuildPathDefinition, BuildPathId } from "./types"

export const BUILD_PATH_DEFINITIONS: BuildPathDefinition[] = [
  {
    id: "founder-build",
    label: "I'll build it myself",
    description: "Get a clear, step-by-step plan and build this yourself, at your own pace.",
    icon: "Hammer",
    fulfillmentStatus: "available-now",
  },
  {
    id: "co-build",
    label: "Build it with AI",
    description: "Work through it as a guided conversation — AI walks with you, step by step.",
    icon: "Users",
    fulfillmentStatus: "available-now",
  },
  {
    id: "ai-build",
    label: "Let AI produce it",
    description: "AI generates the concrete output directly; you review and finish it.",
    icon: "Sparkles",
    fulfillmentStatus: "available-now",
  },
  {
    id: "delegate",
    label: "Delegate to my team",
    description: "Hand this to someone already on your team, with a clear briefing.",
    icon: "UserCheck",
    fulfillmentStatus: "available-now",
  },
  {
    id: "hire",
    label: "Hire for this",
    description: "This calls for a new hire — get a role definition to start recruiting.",
    icon: "UserPlus",
    fulfillmentStatus: "plan-only",
  },
  {
    id: "outsource",
    label: "Outsource it",
    description: "Bring in a freelancer or contractor for this specific piece of work.",
    icon: "Briefcase",
    fulfillmentStatus: "plan-only",
  },
  {
    id: "buy",
    label: "Buy instead of build",
    description: "Skip building this from scratch — buy an existing tool, template, or service.",
    icon: "ShoppingCart",
    fulfillmentStatus: "plan-only",
  },
  {
    id: "partner",
    label: "Bring in a partner",
    description: "Hand this to a strategic partner or agency while you keep the key decisions.",
    icon: "Handshake",
    fulfillmentStatus: "plan-only",
  },
]

export function getBuildPathDefinition(id: BuildPathId): BuildPathDefinition {
  const found = BUILD_PATH_DEFINITIONS.find((p) => p.id === id)
  if (!found) throw new Error(`[BuildStrategy] Unknown Build Path id: ${id}`)
  return found
}
