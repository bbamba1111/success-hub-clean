import type { BlockId } from "@/operating-engine"
import type { RuleType } from "@/lib/operating-rules/storage"

/**
 * Per-segment content for the reusable Operating Planner™ (Phase 3B.1).
 *
 * This is placeholder-level structure only: guidance copy, a starter checklist,
 * and the default Operating Rule™ type for each segment. Internal functionality
 * (AI, scoring, reflections) is intentionally deferred to later passes.
 *
 * The Work-Life Balance Business Day™ has 8 blocks; 7 of them get a planner.
 * Unplug Digital Detox™ (digital-detox) is a closed block and has none.
 */

/** One placeholder execution block inside the CEO Workday planner. */
export interface CeoBlock {
  id: string
  title: string
  description: string
}

export interface PlannerSegmentConfig {
  /** Short workspace title shown at the top of the planner. */
  title: string
  /**
   * Soft panel background for the planner workspace. Intentionally distinct
   * from the page / Work-Life Balance Business Day™ schedule space so the
   * active planner reads as its own calm room. The CEO Workday uses soft sage.
   */
  surface: string
  /** Cherry Blossom Guidance™ — a calm, one-line orientation for the segment. */
  guidance: string
  /** The default Operating Rule™ type members set for this segment. */
  defaultRuleType: RuleType
  /** Operating Planner™ starter checklist (placeholder practice steps). */
  checklist: string[]
  /**
   * CEO Workday only — the five placeholder execution blocks. Rendered as
   * collapsed placeholder sections; internals are built in a later pass.
   */
  ceoBlocks?: CeoBlock[]
}

export const PLANNER_CONFIG: Partial<Record<BlockId, PlannerSegmentConfig>> = {
  "early-access": {
    title: "Early Access & Flex Time™",
    surface: "#FBF4EC",
    guidance:
      "Ease in before the day makes demands on you. Prepare your mind, your space, and your priorities so you begin with clarity instead of chaos.",
    defaultRuleType: "human",
    checklist: [
      "Set your intention for how you want to feel today",
      "Clear one thing that would create friction later",
      "Review your one most important priority",
    ],
  },
  "morning-given": {
    title: "Morning GIV•EN™ Routine",
    surface: "#FBF1F3",
    guidance:
      "Lead yourself before you lead your business. Align mind, body, and spirit through Gratitude, Invitation, Vision, Emotional embodiment, and Nurture.",
    defaultRuleType: "human",
    checklist: [
      "Name three things you're grateful for",
      "Set today's vision and invitation",
      "Nurture one non-negotiable for yourself",
    ],
  },
  "movement-window": {
    title: "30-Minute Workday Movement™",
    surface: "#EFF5EC",
    guidance:
      "Care for the body that carries your vision. A short, intentional movement window restores energy and sharpens focus for the work ahead.",
    defaultRuleType: "human",
    checklist: [
      "Choose today's movement (walk, stretch, strength, mobility)",
      "Move for the full window without multitasking",
      "Notice your energy before and after",
    ],
  },
  "lunch-break": {
    title: "Extended Healthy Hybrid Lunch™",
    surface: "#F5F1E7",
    guidance:
      "Nourishment is productive. Step away, eat well, get outside, and reconnect — return to the afternoon genuinely restored.",
    defaultRuleType: "human",
    checklist: [
      "Step fully away from work",
      "Nourish your body with intention",
      "Spend a few minutes in nature or with someone you care about",
    ],
  },
  "ceo-workday": {
    title: "4-Hour Focused CEO Workday™",
    // Soft sage — the protected execution room.
    surface: "#E7F0E3",
    guidance:
      "This is your protected execution window. Do the deep, high-leverage work only you can do — augmented, focused, and free of friction.",
    defaultRuleType: "business",
    checklist: [
      "Confirm the one outcome that would make today a win",
      "Protect this window from meetings and noise",
      "Work in focused blocks with intentional recovery",
    ],
    ceoBlocks: [
      {
        id: "ai-augmentation-hour",
        title: "AI Augmentation Hour™",
        description: "Partner with AI to accelerate your highest-leverage work.",
      },
      {
        id: "ai-executive-team",
        title: "AI Executive Leadership Team™",
        description: "Consult your AI executive advisors for strategy and decisions.",
      },
      {
        id: "business-operating-rule",
        title: "Business Operating Rule™",
        description: "Set today's rule for meetings, delegation, and decisions.",
      },
      {
        id: "human-zone-of-genius",
        title: "Human Zone of Genius™",
        description: "Focus your human energy where only you can create value.",
      },
      {
        id: "execution-friction",
        title: "Execution Friction™",
        description: "Identify and remove what's slowing your execution.",
      },
    ],
  },
  "time-freedom": {
    title: "Time Freedom™",
    surface: "#ECF3F4",
    guidance:
      "Enjoy the life your business exists to support. Be fully present with the people and experiences that matter most — presence is the real success.",
    defaultRuleType: "human",
    checklist: [
      "Choose how you want to spend this freedom",
      "Put work fully down",
      "Be present with who and what matters",
    ],
  },
  "power-down": {
    title: "Power Down & Unplug™",
    surface: "#EEEFF3",
    guidance:
      "Transition intentionally from productivity to restoration. Reflect on today, prepare tomorrow, and let your mind begin to slow.",
    defaultRuleType: "human",
    checklist: [
      "Reflect briefly on today's wins",
      "Prepare tomorrow's one priority",
      "Reduce stimulation and begin to wind down",
    ],
  },
}

/** True when a segment has a planner (i.e. is not the closed detox block). */
export function segmentHasPlanner(blockId: BlockId): boolean {
  return Boolean(PLANNER_CONFIG[blockId])
}
