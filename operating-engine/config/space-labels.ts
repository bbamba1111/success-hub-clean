/**
 * Canonical Space™ label map — single source of truth for the "Enter {Space™}"
 * naming shown across the Hero CTA, the Welcome section CTA, and each
 * `BusinessDayBlock` accordion toggle. Matches `schedule.ts` block ids.
 */
import type { BlockId } from "../types"

export const SPACE_LABEL: Record<BlockId, string> = {
  "monday-flex": "Flex Time Space™",
  "monday-reality-check": "Reflection Space™",
  "monday-debrief": "Debrief Space™",
  "early-access": "Flex Time Space™",
  "morning-given": "Alignment Space™",
  "movement-window": "Movement Space™",
  "lunch-break": "Midday Space™",
  "ceo-workday": "CEO Workspace™",
  "time-freedom": "Time Freedom Space™",
  "power-down": "Power Down Space™",
  "digital-detox": "Unplug Space™",
}
