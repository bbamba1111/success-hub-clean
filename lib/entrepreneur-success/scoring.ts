/**
 * Entrepreneur Success Assessment™ — Scoring Engine (Phase 6.0)
 * ---------------------------------------------------------------------------
 * Pure functions. No side effects. No rendering. No storage.
 *
 * The 5-point scale matches the Work-Life Balance Audit™ exactly:
 *   Always     → 100
 *   Often      →  75
 *   Sometimes  →  50
 *   Rarely     →  25
 *   Never      →   0
 *
 * Pillar scores are averaged across their questions. The Overall
 * Entrepreneur Success Score™ is averaged across all questions (not
 * averaged-of-averages, to avoid over-weighting pillars with few questions).
 */

import { ASSESSMENT_QUESTIONS, OPERATING_PILLARS, OPERATING_PRACTICES } from "./esa-registry"
import type { EsaResults, PillarScore, PracticeScore } from "./types"

/** The five response options — identical to Work-Life Balance Audit™. */
export const RESPONSE_OPTIONS = [
  { label: "Always", value: 100 },
  { label: "Often", value: 75 },
  { label: "Sometimes", value: 50 },
  { label: "Rarely", value: 25 },
  { label: "Never", value: 0 },
] as const

export type ResponseValue = (typeof RESPONSE_OPTIONS)[number]["value"]

/**
 * Compute the full EsaResults from a map of questionId → response value.
 * All questions must be answered (caller's responsibility).
 */
export function computeEsaResults(responses: Record<string, number>): EsaResults {
  // ── per-practice scores ──────────────────────────────────────────────────
  const practiceScores: PracticeScore[] = OPERATING_PRACTICES.filter((p) => p.status === "active").map((practice) => {
    const practiceQuestions = ASSESSMENT_QUESTIONS.filter(
      (q) => q.practiceId === practice.id && q.status === "active"
    )
    const values = practiceQuestions
      .map((q) => responses[q.id])
      .filter((v): v is number => typeof v === "number")
    const percentage =
      values.length > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0

    return {
      practiceId: practice.id,
      practiceName: practice.name,
      pillarId: practice.pillarId,
      percentage,
    }
  })

  // ── per-pillar scores ────────────────────────────────────────────────────
  const pillarScores: PillarScore[] = OPERATING_PILLARS.filter((p) => p.status === "active").map((pillar) => {
    const pillarQuestions = ASSESSMENT_QUESTIONS.filter(
      (q) => q.pillarId === pillar.id && q.status === "active"
    )
    const values = pillarQuestions
      .map((q) => responses[q.id])
      .filter((v): v is number => typeof v === "number")
    const percentage =
      values.length > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0

    return {
      pillarId: pillar.id,
      pillarName: pillar.name,
      percentage,
      practiceCount: pillarQuestions.length,
    }
  })

  // ── overall score (mean across ALL active questions) ─────────────────────
  const activeQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.status === "active")
  const allValues = activeQuestions
    .map((q) => responses[q.id])
    .filter((v): v is number => typeof v === "number")
  const overallScore =
    allValues.length > 0 ? Math.round(allValues.reduce((s, v) => s + v, 0) / allValues.length) : 0

  return {
    overallScore,
    pillarScores,
    practiceScores,
    responses,
    completedAt: new Date().toISOString(),
  }
}

/** Human-readable label for a percentage score. */
export function scoreLabel(percentage: number): string {
  if (percentage >= 85) return "Exceptional"
  if (percentage >= 70) return "Strong"
  if (percentage >= 55) return "Developing"
  if (percentage >= 40) return "Emerging"
  return "Foundation"
}

/** Hex color for a score band — matches the Harmony Lane™ neutral palette. */
export function scoreColor(percentage: number): string {
  if (percentage >= 85) return "#16a34a" // green-600
  if (percentage >= 70) return "#2563eb" // blue-600
  if (percentage >= 55) return "#d97706" // amber-600
  if (percentage >= 40) return "#ea580c" // orange-600
  return "#dc2626" // red-600
}

/** The top N lowest-scoring practices — used by the results page. */
export function lowestPractices(results: EsaResults, n = 3): PracticeScore[] {
  return [...results.practiceScores].sort((a, b) => a.percentage - b.percentage).slice(0, n)
}

/** The top N highest-scoring practices — used for celebration in results. */
export function highestPractices(results: EsaResults, n = 3): PracticeScore[] {
  return [...results.practiceScores].sort((a, b) => b.percentage - a.percentage).slice(0, n)
}
