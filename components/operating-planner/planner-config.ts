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
   * The workspace's own name — members enter the SEGMENT, not "the planner."
   * e.g. "Your Executive Workspace", "Your Morning Sanctuary".
   */
  workspaceLabel: string
  /**
   * A short, atmospheric mood line for the room (three words, editorial).
   * Communicates atmosphere before functionality. e.g. "Focused · Grounded · Executive".
   */
  atmosphere: string
  /**
   * Soft panel background for the planner workspace. Intentionally distinct
   * from the page / Work-Life Balance Business Day™ schedule space so the
   * active planner reads as its own calm room. The CEO Workday uses soft sage.
   */
  surface: string
  /** Cherry Blossom Guidance™ — a warm, concierge-style orientation (2–3 sentences). */
  guidance: string
  /** The default Operating Rule™ type members set for this segment. */
  defaultRuleType: RuleType
  /**
   * Operating Planner™ reflective prompts — an executive planning session, not
   * a checklist. Members answer a few calm questions to design the segment.
   */
  prompts: string[]
  /**
   * CEO Workday only — the five execution blocks, rendered as a step-by-step
   * journey. Internals are built in a later pass.
   */
  ceoBlocks?: CeoBlock[]
}

export const PLANNER_CONFIG: Partial<Record<BlockId, PlannerSegmentConfig>> = {
  "early-access": {
    title: "Early Access & Flex Time™",
    workspaceLabel: "Your Early Access Space",
    atmosphere: "Quiet · Unhurried · Open",
    surface: "#FBF4EC",
    guidance:
      "The day hasn't asked anything of you yet. Before it does, let's set the tone. A few unhurried minutes now — for your mind, your space, your priorities — is how clarity replaces chaos.",
    defaultRuleType: "human",
    prompts: [
      "How do you want to feel as today unfolds?",
      "What one thing, cleared now, would remove friction later?",
      "What is the single priority you'll protect today?",
    ],
  },
  "morning-given": {
    title: "Morning GIV•EN™ Routine",
    workspaceLabel: "Your Morning Sanctuary",
    atmosphere: "Light · Fresh · Hopeful",
    surface: "#FBF1F3",
    guidance:
      "Lead yourself before you lead your business. This is your sanctuary — a few grounded moments of Gratitude, Invitation, Vision, Emotional embodiment, and Nurture — so you meet the day already whole.",
    defaultRuleType: "human",
    prompts: [
      "What are you most grateful for as today begins?",
      "What is your vision and invitation for today?",
      "What one thing will you nurture for yourself, no matter what?",
    ],
  },
  "movement-window": {
    title: "30-Minute Workday Movement™",
    workspaceLabel: "Your Movement Window",
    atmosphere: "Energizing · Present · Alive",
    surface: "#EFF5EC",
    guidance:
      "Care for the body that carries your vision. Thirty intentional minutes — walk, stretch, strength, whatever your body asks for — is how you return sharper than you left.",
    defaultRuleType: "human",
    prompts: [
      "How does your body want to move today?",
      "What will you let go of during this movement?",
      "What shifts in your energy when you move with intention?",
    ],
  },
  "lunch-break": {
    title: "Extended Healthy Hybrid Lunch™",
    workspaceLabel: "Your Midday Restoration",
    atmosphere: "Nourishing · Warm · Restorative",
    surface: "#F5F1E7",
    guidance:
      "Nourishment is productive. Step fully away, eat well, get outside, reconnect. The afternoon belongs to the version of you that took this time.",
    defaultRuleType: "human",
    prompts: [
      "How will you step fully away from work right now?",
      "What will genuinely nourish you this hour?",
      "Who or what will you reconnect with?",
    ],
  },
  "ceo-workday": {
    title: "4-Hour Focused CEO Workday™",
    workspaceLabel: "Your Executive Workspace",
    atmosphere: "Focused · Grounded · Executive",
    // Soft sage — the protected execution room.
    surface: "#E7F0E3",
    guidance:
      "This is your protected execution window. Today's priority isn't doing more — it's protecting uninterrupted thinking. Let's install one operating rule that guards your Human Zone of Genius™.",
    defaultRuleType: "business",
    prompts: [
      "What ONE outcome would make today successful?",
      "How will you protect this work from interruption?",
      "What distraction will you intentionally eliminate?",
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
    workspaceLabel: "Your Time Freedom Space",
    atmosphere: "Golden · Spacious · Free",
    // Golden-hour warmth — sunset sand, not a cool spa. Time Freedom™ is the
    // reward at the end of a beautifully lived Business Day™: work is finished,
    // life begins now.
    surface: "#F7EDDD",
    guidance:
      "Good evening. You've protected your work — now protect your life with the same intention. Set it down, step outside, and be fully here. Presence is today's greatest achievement.",
    defaultRuleType: "human",
    prompts: [
      "How do you want to spend this freedom?",
      "What will help you put work fully down?",
      "Who deserves your full presence right now?",
    ],
  },
  "power-down": {
    title: "Power Down & Unplug™",
    workspaceLabel: "Your Evening Wind-Down",
    atmosphere: "Quiet · Warm · Restorative",
    surface: "#EEEFF3",
    guidance:
      "Let the day come to a gentle close. Honor what you accomplished, set down what you didn't, and prepare tomorrow so your mind can finally slow.",
    defaultRuleType: "human",
    prompts: [
      "What are you most proud of from today?",
      "What is tomorrow's single priority?",
      "What will help your mind begin to slow?",
    ],
  },
}

/** True when a segment has a planner (i.e. is not the closed detox block). */
export function segmentHasPlanner(blockId: BlockId): boolean {
  return Boolean(PLANNER_CONFIG[blockId])
}
