/**
 * Execution Paths — Delivery Levels (Phase 5.3)
 * ---------------------------------------------------------------------------
 * Part of the Deliverable Output Architecture™. Every deliverable can eventually
 * be produced through one or more execution paths — the "who does the work"
 * dimension, independent of the format (Render Engine™) or destination
 * (Distribution Engine™).
 *
 * Architecture only: NO workflow logic, routing, or fulfillment is implemented
 * this phase. These are the declared levels future phases will orchestrate.
 */

/** The escalating levels of hands-on help behind a deliverable. */
export type ExecutionPath = "diy" | "ai-assisted" | "done-with-you" | "done-for-you" | "certified-partner"

export interface ExecutionPathDefinition {
  id: ExecutionPath
  label: string
  description: string
  /** lucide-react icon name, mapped at the presentation layer. */
  icon: string
}

/** EXECUTION_PATHS — ordered from most self-directed to fully delegated. */
export const EXECUTION_PATHS: ExecutionPathDefinition[] = [
  {
    id: "diy",
    label: "DIY",
    description: "The founder uses the structure and guidance to produce it themselves.",
    icon: "User",
  },
  {
    id: "ai-assisted",
    label: "AI Assisted",
    description: "Cherry Blossom™ and the team draft it; the founder refines and approves.",
    icon: "Sparkles",
  },
  {
    id: "done-with-you",
    label: "Done With You",
    description: "A collaborative build with hands-on guidance from a person.",
    icon: "Handshake",
  },
  {
    id: "done-for-you",
    label: "Done For You",
    description: "Fully produced on the founder's behalf, ready for review.",
    icon: "PackageCheck",
  },
  {
    id: "certified-partner",
    label: "Certified Partner",
    description: "Delivered by a vetted partner from the future Partner Network™.",
    icon: "BadgeCheck",
  },
]

/** Look up an execution path definition by id. */
export function getExecutionPath(id: ExecutionPath): ExecutionPathDefinition | undefined {
  return EXECUTION_PATHS.find((e) => e.id === id)
}
