/** Weekly 7-Day Work-Life Balance Audit™ — stored as boundary_reports rows with assessment_type = 'weekly_7_day'. */

export const WEEKLY_ASSESSMENT = "weekly_7_day"
export const FULL_ASSESSMENT = "full_30_day"
export const MAX_WEEKLY_PRIORITIES = 3

export interface WeeklyAuditDraft {
  answers: Record<number, number>
  questionIndex: number
}

export interface WeeklyAreaScore {
  key: string
  label: string
  score: number
}

/** How this week's scores moved against an earlier, completed assessment. */
export interface WeeklyComparison {
  reportId: string
  assessmentType: "weekly_7_day" | "full_30_day"
  completedAt: string
  periodStart: string | null
  periodEnd: string | null
  overall: number
  overallDelta: number
  /** Current score minus that assessment's score, per area key. */
  areaDeltas: Record<string, number>
}

/** Shape of the `report` jsonb on a completed weekly row. */
export interface WeeklyAuditReport {
  kind: "weekly_7_day"
  completedAt: string
  periodStart: string
  periodEnd: string
  overall: number
  areas: WeeklyAreaScore[]
  answers: Record<number, number>
  priorityAreas: WeeklyAreaScore[]
  comparisons: {
    previousWeekly: WeeklyComparison | null
    initialBaseline: WeeklyComparison | null
  }
}

export interface WeeklyHistoryItem {
  id: string
  completedAt: string
  periodStart: string | null
  periodEnd: string | null
  overall: number
  priorityLabels: string[]
}

/** The priorities Decide & Design™ should use right now, and where they came from. */
export interface CurrentPriorityFocus {
  source: "weekly_7_day" | "full_30_day"
  reportId: string
  date: string
  periodStart: string | null
  periodEnd: string | null
  priorityAreas: WeeklyAreaScore[]
}
