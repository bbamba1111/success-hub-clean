/**
 * The 15 approved Work-Life Balance Audit™ questions and their scoring.
 * Shared by the audit UI (client) and the weekly audit save action (server)
 * so a submitted score is always recomputed with the same formula.
 */

import { CATEGORY_LABELS } from "@/utils/life-value-categories"

export const AUDIT_QUESTION_BODIES = [
  { id: 1,  category: "spiritual",           body: "how often have you had time to nurture your spiritual well-being — through prayer, study, fellowship, praise, music, meditation, or nature — within your busy schedule?" },
  { id: 2,  category: "mental",              body: "how often have you had time to care for your mental well-being — managing stress, thinking clearly, and making decisions without rushing — within your busy schedule?" },
  { id: 3,  category: "physicalMovement",    body: "how often have you had time to prioritize intentional movement or exercise within your busy schedule?" },
  { id: 4,  category: "physicalNourishment", body: "how often have you had time to nourish your body with adequate hydration and healthy meals within your busy schedule?" },
  { id: 5,  category: "physicalSleep",       body: "how often have you had time to go to bed on time and get 8 hours of restorative sleep within your busy schedule?" },
  { id: 6,  category: "emotional",           body: "how often have you had time to tend to your emotional well-being — making room for peace, balance, and joy — within your busy schedule?" },
  { id: 7,  category: "personal",            body: "how often have you had time for self-care and personal growth within your busy schedule?" },
  { id: 8,  category: "intellectual",        body: "how often have you had time to learn something new or build a new skill within your busy schedule?" },
  { id: 9,  category: "professional",        body: "how often have you had time to share your expertise and expand your professional visibility — through partnerships, collaboration, speaking, publishing, media, or podcast interviews — within your busy schedule?" },
  { id: 10, category: "financial",          body: "how often have you had time to focus intentionally on your financial health — revenue generation, financial and retirement planning, business valuation, or exit planning — within your busy schedule?" },
  { id: 11, category: "environmental",      body: "how often have you had time to create beauty, balance, or order in your home or office environment, or to spend time in nature, within your busy schedule?" },
  { id: 12, category: "relational",         body: "how often have you had time to nurture your important relationships and be attentive and present with your loved ones within your busy schedule?" },
  { id: 13, category: "social",             body: "how often have you had time to connect with friends or supportive, like-minded people within your busy schedule?" },
  { id: 14, category: "recreational",       body: "how often have you had time for joy, creativity, vacation, travel, or play within your busy schedule?" },
  { id: 15, category: "charitable",         body: "how often have you had time to support or inspire others through giving, charity, volunteering, or other philanthropic endeavors within your busy schedule?" },
] as const

export const AUDIT_QUESTION_COUNT = AUDIT_QUESTION_BODIES.length

export type AuditAnswers = Record<number, number>

export interface AuditCategoryScore {
  category: string
  label: string
  percentage: number
}

function isScaleValue(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5
}

/** Keeps only answers to known questions on the 1–5 scale. */
export function sanitizeAuditAnswers(raw: unknown): AuditAnswers {
  const out: AuditAnswers = {}
  if (!raw || typeof raw !== "object") return out
  const source = raw as Record<string, unknown>
  for (const q of AUDIT_QUESTION_BODIES) {
    const v = source[q.id] ?? source[String(q.id)]
    if (isScaleValue(v)) out[q.id] = v
  }
  return out
}

export function isCompleteAuditAnswers(answers: AuditAnswers): boolean {
  return AUDIT_QUESTION_BODIES.every((q) => isScaleValue(answers[q.id]))
}

/** Category % = average answer / 5 × 100; overall = mean of category %. */
export function scoreAuditAnswers(answers: AuditAnswers): { overallScore: number; results: AuditCategoryScore[] } {
  const byCategory: Record<string, number[]> = {}
  for (const q of AUDIT_QUESTION_BODIES) {
    ;(byCategory[q.category] ??= []).push(answers[q.id] || 0)
  }
  const results = Object.entries(byCategory).map(([category, scores]) => ({
    category,
    label: CATEGORY_LABELS[category] ?? category,
    percentage: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length / 5) * 100),
  }))
  const overallScore = Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
  return { overallScore, results }
}
