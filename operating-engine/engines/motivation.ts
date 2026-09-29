/**
 * Motivation Engine
 * Returns the daily affirmation set, AI coaching message, reflection
 * question, and quote — all rotating daily and grouped by part of day.
 */
import type { CircadianPhase, MotivationState, TimeContext } from "../types"
import { AFFIRMATIONS, COACHING_MESSAGES, QUOTES, REFLECTION_QUESTIONS } from "../config/content"
import { pickDaily } from "./time"

export function getMotivationState(time: TimeContext, phase: CircadianPhase): MotivationState {
  const part = phase.part
  const affirmationSets = AFFIRMATIONS[part]
  const affirmations = pickDaily(affirmationSets, time.dayOfYear, affirmationSets[0])

  return {
    affirmations,
    coachingMessage: pickDaily(COACHING_MESSAGES[part], time.dayOfYear, COACHING_MESSAGES[part][0]),
    reflectionQuestion: pickDaily(REFLECTION_QUESTIONS[part], time.dayOfYear, REFLECTION_QUESTIONS[part][0]),
    quote: pickDaily(QUOTES, time.dayOfYear, QUOTES[0]),
  }
}
