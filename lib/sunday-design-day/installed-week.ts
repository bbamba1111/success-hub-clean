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
  committed: boolean
}

export interface InstalledWeek {
  installedAt: string
  intention: string
  declaration: string
  focusAreas: string[]
  segments: InstalledSegment[]
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
        segments?: Record<string, { rule?: string; planner?: string; committed?: boolean }>
      }
    }
    const data = parsed.data
    if (!data?.installedAt) return null
    return {
      installedAt: data.installedAt,
      intention: data.weekly?.intention?.trim() ?? "",
      declaration: data.weekly?.declaration?.trim() ?? "",
      focusAreas: data.focusAreas ?? [],
      segments: Object.entries(data.segments ?? {}).map(([id, s]) => ({
        id,
        rule: s.rule?.trim() ?? "",
        planner: s.planner?.trim() ?? "",
        committed: Boolean(s.committed),
      })),
    }
  } catch {
    return null
  }
}
