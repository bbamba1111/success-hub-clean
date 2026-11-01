import type { FunctionWorkOption } from "@/lib/ceo-workday/function-work-options"

export type BoundaryWorkKind = "weekly" | "monthly"

export const WEEKLY_BOUNDARY_WORK: FunctionWorkOption = {
  work: "Choose and build my Weekly Boundary Focus™ into my business.",
  outcome: "This week's boundary is protected by a clear business rule I can follow.",
}

export const MONTHLY_BOUNDARY_WORK: FunctionWorkOption = {
  work: "Choose and build my Monthly Business Boundary Focus™ into my business.",
  outcome: "This cycle's boundary is built into how my business operates.",
}

/** Also matches older items whose title carried the chosen boundary text. */
export function boundaryWorkKind(title: string | null | undefined): BoundaryWorkKind | null {
  if (!title) return null
  if (title.includes("Monthly Business Boundary Focus™")) return "monthly"
  if (title.includes("Weekly Boundary Focus™")) return "weekly"
  return null
}
