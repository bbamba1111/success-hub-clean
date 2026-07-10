/**
 * Harmony Business Academy™ — Business Stage™ placeholders (Phase 5.4)
 * ---------------------------------------------------------------------------
 * Architecture-only scaffolding so future learning can map to Business Stage™.
 *
 * There are NO lessons this phase. This module reserves one learning track per
 * Business Stage™ so a future Academy phase can attach lessons WITHOUT a
 * redesign. Every track references a BusinessStage id from the single source of
 * truth (lib/business-stage/business-stage.ts).
 */

import { ALL_BUSINESS_STAGES, getBusinessStage, type BusinessStage } from "@/lib/business-stage/business-stage"

/** Lifecycle of an Academy track. Only placeholders exist this phase. */
export type AcademyTrackStatus = "placeholder"

/** A reserved learning lesson slot. Populated by a future Academy phase. */
export interface AcademyLesson {
  id: string
  title: string
  status: AcademyTrackStatus
}

/** A learning track scoped to a single Business Stage™. No lessons yet. */
export interface AcademyTrack {
  /** Stable id, derived from the stage (e.g. "academy-launch"). */
  id: string
  /** The Business Stage™ this track serves. */
  businessStage: BusinessStage
  /** Track name (e.g. "Launch™ Track"). */
  name: string
  /** What this track will eventually help founders learn. */
  description: string
  /** Reserved for future lessons — intentionally empty this phase. */
  lessons: AcademyLesson[]
  status: AcademyTrackStatus
}

/**
 * ACADEMY_TRACKS — one placeholder track per Business Stage™, built from the
 * stage registry so the two never drift.
 */
export const ACADEMY_TRACKS: AcademyTrack[] = ALL_BUSINESS_STAGES.map((stage) => {
  const def = getBusinessStage(stage)
  return {
    id: `academy-${stage}`,
    businessStage: stage,
    name: `${def.name} Track`,
    description: `Future learning for founders in the ${def.name} stage. ${def.tagline}`,
    lessons: [],
    status: "placeholder" as const,
  }
})

/** Look up the placeholder track for a Business Stage™. */
export function getAcademyTrack(stage: BusinessStage): AcademyTrack | undefined {
  return ACADEMY_TRACKS.find((t) => t.businessStage === stage)
}
