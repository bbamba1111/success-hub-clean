/**
 * Session-only reader for the week installed via Sunday Design Day™ (Phase 4B.1).
 *
 * This intentionally reads the SAME sessionStorage key the SDD flow writes to
 * (see components/sunday-design-day/sdd-state.tsx). It lets Monday's Live
 * Today™ experience reference the design the member just installed — with no
 * database yet. Long-term, cross-device persistence is Phase 4B.2.
 */

const STORAGE_KEY = "sdd:v1"

export interface InstalledSegment {
  id: string
  rule: string
  planner: string
  nonNegotiable: string
  committed: boolean
}

/**
 * CEO Workday™ context captured during Design Tomorrow™. Keys mirror the
 * CeoSection ids in sdd-config.ts. `priorities` is the ceo-workday planner
 * ("the ONE outcome that would make tomorrow a win").
 */
export interface InstalledCeoContext {
  priorities: string
  aiAugmentation: string
  businessOperatingRule: string
  humanZoneOfGenius: string
  executionFriction: string
}

export interface InstalledWeek {
  installedAt: string
  intention: string
  declaration: string
  focusAreas: string[]
  segments: InstalledSegment[]
  ceo: InstalledCeoContext
}

/**
 * Returns the installed week for this browser session, or null if the member
 * hasn't completed Sunday Design Day™ yet. Client-side only.
 */
export function getInstalledWeek(): InstalledWeek | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      data?: {
        installedAt?: string | null
        weekly?: { intention?: string; declaration?: string }
        focusAreas?: string[]
        segments?: Record<
          string,
          { rule?: string; planner?: string; nonNegotiable?: string; committed?: boolean }
        >
        ceo?: Record<string, string>
      }
    }
    const data = parsed.data
    if (!data?.installedAt) return null
    const ceo = data.ceo ?? {}
    return {
      installedAt: data.installedAt,
      intention: data.weekly?.intention?.trim() ?? "",
      declaration: data.weekly?.declaration?.trim() ?? "",
      focusAreas: data.focusAreas ?? [],
      segments: Object.entries(data.segments ?? {}).map(([id, s]) => ({
        id,
        rule: s.rule?.trim() ?? "",
        planner: s.planner?.trim() ?? "",
        nonNegotiable: s.nonNegotiable?.trim() ?? "",
        committed: Boolean(s.committed),
      })),
      ceo: {
        // CEO Priorities™ = the ceo-workday planner ("ONE outcome that would make tomorrow a win").
        priorities: data.segments?.["ceo-workday"]?.planner?.trim() ?? "",
        aiAugmentation: ceo["ai-augmentation-hour"]?.trim() ?? "",
        businessOperatingRule: ceo["business-operating-rule"]?.trim() ?? "",
        humanZoneOfGenius: ceo["human-zone-of-genius"]?.trim() ?? "",
        executionFriction: ceo["execution-friction"]?.trim() ?? "",
      },
    }
  } catch {
    return null
  }
}
