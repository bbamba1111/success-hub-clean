/**
 * The Distribution Engine™ — Distribution Catalog (Phase 5.3)
 * ---------------------------------------------------------------------------
 * Part of the Deliverable Output Architecture™. Once the Render Engine™ has
 * produced a format, the Distribution Engine™ delivers it to the right
 * destination.
 *
 * Distribution is decoupled from rendering on purpose: the same rendered output
 * can be downloaded, emailed, saved to the Harmony Library™, or posted to Slack
 * without regenerating the content. Architecture only — no integrations are
 * wired this phase. New methods are added by appending to DISTRIBUTION_METHODS.
 */

/** Every way a rendered deliverable can be delivered. */
export type DistributionMethod =
  | "download"
  | "print"
  | "email"
  | "copy"
  | "save-to-library"
  | "share-with-team"
  | "slack"
  | "teams"
  | "notion"
  | "future-integration"

export interface DistributionDefinition {
  id: DistributionMethod
  label: string
  description: string
  /** lucide-react icon name, mapped at the presentation layer. */
  icon: string
  /** Reserved handler key for a future phase. Not wired now. */
  futureHandler: string
}

/** DISTRIBUTION_METHODS — the Distribution Engine™ catalog. */
export const DISTRIBUTION_METHODS: DistributionDefinition[] = [
  {
    id: "download",
    label: "Download",
    description: "Save the rendered file to the founder's device.",
    icon: "Download",
    futureHandler: "distribute/download",
  },
  {
    id: "print",
    label: "Print",
    description: "Send a print-optimized version to a printer.",
    icon: "Printer",
    futureHandler: "distribute/print",
  },
  {
    id: "email",
    label: "Email",
    description: "Deliver the output directly to one or more recipients.",
    icon: "Mail",
    futureHandler: "distribute/email",
  },
  {
    id: "copy",
    label: "Copy to Clipboard",
    description: "Copy the rendered content for pasting anywhere.",
    icon: "Copy",
    futureHandler: "distribute/copy",
  },
  {
    id: "save-to-library",
    label: "Save to Harmony Library™",
    description: "Store the deliverable in the founder's Harmony Library™ for reuse.",
    icon: "Library",
    futureHandler: "distribute/harmony-library",
  },
  {
    id: "share-with-team",
    label: "Share with Team",
    description: "Make the deliverable available to the founder's team members.",
    icon: "Users",
    futureHandler: "distribute/share-with-team",
  },
  {
    id: "slack",
    label: "Slack",
    description: "Post the rendered message to a Slack channel or person.",
    icon: "MessageSquare",
    futureHandler: "distribute/slack",
  },
  {
    id: "teams",
    label: "Microsoft Teams",
    description: "Post the rendered message to a Teams channel or person.",
    icon: "MessagesSquare",
    futureHandler: "distribute/teams",
  },
  {
    id: "notion",
    label: "Export to Notion",
    description: "Publish the deliverable as a Notion page.",
    icon: "BookOpen",
    futureHandler: "distribute/notion",
  },
  {
    id: "future-integration",
    label: "Future Integrations",
    description: "A reserved slot for destinations added in later phases.",
    icon: "Plug",
    futureHandler: "distribute/future",
  },
]

/** Look up a distribution definition by id. */
export function getDistribution(id: DistributionMethod): DistributionDefinition | undefined {
  return DISTRIBUTION_METHODS.find((d) => d.id === id)
}
