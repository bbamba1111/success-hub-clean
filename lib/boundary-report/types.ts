/** Work-Life Balance Boundary Report™ — the persisted output of the $97 diagnostic. */

export type BusinessStage = "start" | "grow" | "scale"

export type SelectedPath = "JOINED_WEEK" | "GO_IT_ALONE"

export type AlignmentChoice = "willing" | "unsure"

/** One stored answer to a Work-Life Balance Alignment™ willingness question. */
export interface AlignmentResponse {
  id: string
  title: string
  question: string
  choice: AlignmentChoice
}

/** One of the 15 Core Value Areas as scored in the 30-Day Baseline. */
export interface BaselineArea {
  key: string
  label: string
  score: number
  /** True when score <= 60 — a Priority Focus Area™ candidate. */
  isCandidate: boolean
}

/** A founder-articulated Life Boundary™ for one selected priority area. */
export interface LifeBoundary {
  areaKey: string
  areaLabel: string
  /** What am I trying to protect? */
  protect: string
  /** What would protected time or space look like? */
  looksLike: string
  /** When does that time belong to life rather than the business? */
  belongsToLife: string
  /** What would tell me the boundary is being honored? */
  honoredSignal: string
}

/** A possible business requirement surfaced by the diagnostic (never asserted as certain). */
export interface BusinessRequirement {
  id: string
  label: string
  /** "suggested" = "your diagnostic suggests this may need attention." */
  note: string
}

export interface BoundaryReportData {
  originalIntention: {
    selections: string[]
    somethingElse?: string
    summary: string
  }
  baseline: {
    overall: number
    date: string
    areas: BaselineArea[]
  }
  priorityFocusAreas: string[]
  /** Labels for the selected priority areas, kept for report rendering. */
  priorityAreas: { key: string; label: string; score: number }[]
  /** Work-Life Balance Alignment™ willingness answers (replaces Life Boundary Discovery). */
  alignmentResponses: AlignmentResponse[]
  /** Answer to the final "ready to experience it?" question. */
  finalAlignment?: AlignmentChoice
  /** Deprecated: free-text Life Boundary Discovery, no longer collected. */
  lifeBoundaries?: LifeBoundary[]
  boundaryCollisions: string[]
  businessRequirements: BusinessRequirement[]
  stage: BusinessStage
  stageConsiderations: string[]
  selectedPath?: SelectedPath
}
