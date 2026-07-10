/**
 * Cherry Blossom™ Operating Guidance (Phase 4B.2).
 *
 * Pure, framework-free logic that turns the Harmony Context Engine™ snapshot
 * into Cherry Blossom's context-aware voice. She is the Executive Operating
 * Guide™ — she never asks "what would you like to work on today?"; she
 * reinforces what the member intentionally designed on Sunday.
 *
 * Tone: calm, warm, encouraging, executive, grounded. Never robotic, never
 * hype, never guilt. There is NO AI chat or recommendation logic here — that
 * is a later phase. This is deterministic reinforcement built on real context.
 */

import type { HarmonyContextValue } from "./types"

export interface CherryBlossomGuidance {
  /** Personalized greeting line, e.g. "Good Morning, Barbara." */
  greeting: string
  /** One or two calm sentences reinforcing the current designed moment. */
  message: string
}

/** Join non-empty clauses into a single spaced string. */
function compose(...parts: (string | false | null | undefined)[]): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(" ")
}

/**
 * Produce Cherry Blossom's greeting + reinforcing message for the current
 * operating moment. Everything is derived from real designed context; blank
 * fields are gracefully omitted so she never references something empty.
 */
export function getCherryBlossomGuidance(ctx: HarmonyContextValue): CherryBlossomGuidance {
  const name = ctx.firstName?.trim()
  const greeting = name ? `${ctx.greeting}, ${name}.` : `${ctx.greeting}.`

  // No installed week yet — invite the member into Sunday Design Day™.
  if (!ctx.hasDesignedWeek) {
    return {
      greeting,
      message:
        "Your week hasn't been designed yet. When you're ready, Sunday Design Day™ will install the Operating Rules™ and Daily Non-Negotiables™ that guide each part of your day.",
    }
  }

  const intentionClause = ctx.weeklyIntention
    ? `This week's intention: "${ctx.weeklyIntention}".`
    : ""

  const seg = ctx.currentSegment

  // Week is designed, but the current moment is outside a designed segment
  // (overnight Digital Detox). Protect rest.
  if (!seg) {
    return {
      greeting,
      message: compose(
        "The day is complete. Tomorrow has already been designed —",
        "let your devices rest, and let your mind do the same.",
      ),
    }
  }

  const rule = seg.rule.trim()
  const nn = seg.nonNegotiable.trim()

  switch (seg.id) {
    case "early-access":
      return {
        greeting,
        message: compose(
          `Welcome to ${ctx.dayName}.`,
          intentionClause,
          nn && `Before the day asks anything of you, honor your first commitment: ${nn}`,
        ),
      }
    case "morning-given":
      return {
        greeting,
        message: compose(
          "Before you lead your business, lead yourself.",
          nn ? `Honor today's Morning Non-Negotiable™: ${nn}` : "Move through your GIV•EN™ routine with intention.",
        ),
      }
    case "movement":
      return {
        greeting,
        message: compose(
          "Next, let's protect your energy.",
          nn ? `Today's Movement Non-Negotiable™: ${nn}` : "Give your body the movement it needs to carry your vision.",
        ),
      }
    case "lunch":
      return {
        greeting,
        message: compose(
          "Step fully away and return restored.",
          nn && `Today's midday commitment: ${nn}`,
        ),
      }
    case "ceo-workday":
      return {
        greeting,
        message: compose(
          "Welcome to your Focused CEO Workday™.",
          rule && `Today's CEO Operating Rule™: "${rule}".`,
          ctx.ceo.humanZoneOfGenius && `Your Human Zone of Genius™ focus: "${ctx.ceo.humanZoneOfGenius}".`,
          "Begin with AI Augmentation Hour™ before entering deep executive work.",
        ),
      }
    case "time-freedom":
      return {
        greeting,
        message: compose(
          "You earned this time. Be fully present with the life your business exists to support.",
          nn && `Tonight's commitment: ${nn}`,
        ),
      }
    case "power-down":
      return {
        greeting,
        message: compose(
          "You intentionally designed tomorrow on Sunday. Tonight's role is simple: protect it.",
          nn ? `Honor your Power Down & Unplug™ commitment: ${nn}` : "Let the day come to a gentle close.",
        ),
      }
    default:
      return {
        greeting,
        message: compose(
          intentionClause,
          rule && `Today's Operating Rule™ for ${seg.title}: "${rule}".`,
          nn && `Honor today's Non-Negotiable™: ${nn}`,
        ),
      }
  }
}
