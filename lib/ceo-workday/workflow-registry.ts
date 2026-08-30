/**
 * CEO Workday™ — Workflow Registry
 * ---------------------------------------------------------------------------
 * The plug-in contract between a CEO Work category and its real, executable
 * workflow. Today only BUILD has one — the existing Business Asset
 * Builder™ (`AssetDetailView`, unmodified). The other 11 categories are
 * declared here with a placeholder workflow id and
 * `"workflow-not-yet-available"` so the architecture recognizes the full
 * range of CEO work without inventing fake builders to fill it in.
 *
 * Do NOT flip an entry to "available" until its real workflow exists.
 */

import type { CeoWorkCategoryId } from "./categories"

export type WorkflowAvailability = "available" | "workflow-not-yet-available"

export interface WorkflowRegistryEntry {
  category: CeoWorkCategoryId
  workflowId: string
  availability: WorkflowAvailability
}

export const WORKFLOW_REGISTRY: Record<CeoWorkCategoryId, WorkflowRegistryEntry> = {
  BUILD: { category: "BUILD", workflowId: "business-asset-builder", availability: "available" },
  DESIGN: { category: "DESIGN", workflowId: "operating-rule-builder", availability: "workflow-not-yet-available" },
  DECIDE: { category: "DECIDE", workflowId: "decision-workflow", availability: "workflow-not-yet-available" },
  SOLVE: { category: "SOLVE", workflowId: "problem-resolution-workflow", availability: "workflow-not-yet-available" },
  SYSTEMIZE: { category: "SYSTEMIZE", workflowId: "systemize-workflow", availability: "workflow-not-yet-available" },
  DELEGATE: { category: "DELEGATE", workflowId: "delegation-workflow", availability: "workflow-not-yet-available" },
  AUGMENT: { category: "AUGMENT", workflowId: "ai-augmentation-workflow", availability: "workflow-not-yet-available" },
  SELL: { category: "SELL", workflowId: "sales-workflow", availability: "workflow-not-yet-available" },
  MARKET: { category: "MARKET", workflowId: "marketing-workflow", availability: "workflow-not-yet-available" },
  CONNECT: { category: "CONNECT", workflowId: "relationship-workflow", availability: "workflow-not-yet-available" },
  DELIVER: { category: "DELIVER", workflowId: "delivery-workflow", availability: "workflow-not-yet-available" },
  COMMUNICATE: { category: "COMMUNICATE", workflowId: "communication-workflow", availability: "workflow-not-yet-available" },
}

export function getWorkflowEntry(category: CeoWorkCategoryId): WorkflowRegistryEntry {
  return WORKFLOW_REGISTRY[category]
}

export function isWorkflowAvailable(category: CeoWorkCategoryId): boolean {
  return WORKFLOW_REGISTRY[category].availability === "available"
}
