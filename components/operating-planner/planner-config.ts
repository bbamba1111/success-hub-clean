import type { BlockId } from "@/operating-engine"
import type { RuleType } from "@/lib/operating-rules/storage"
import type { SceneVariant } from "@/components/cherry-blossom/cherry-blossom-scene"

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
  /** Short workspace title shown at the top of the planner dropdown toggle. */
  title: string
  /**
   * The segment's welcome name — what Cherry Blossom™ says in the hero card heading.
   * e.g. "Welcome to Time Freedom™" rather than "Design My Time Freedom™".
   */
  welcomeName: string
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
  /**
   * Panoramic background image path for this segment's Cherry Blossom™ Hero.
   * Should match the segment's card image from the schedule.
   */
  backgroundImage: string
  /**
   * Which CherryBlossomScene variant to use for this segment's hero.
   * Defaults to "garden" if omitted.
   */
  sceneVariant?: SceneVariant
  /**
   * Cherry Blossom™ welcome message for this segment's Design Space hero.
   * A warm, personal introduction to the purpose and benefit of this segment.
   */
  cherryBlossomMessage: string
}

export const PLANNER_CONFIG: Partial<Record<BlockId, PlannerSegmentConfig>> = {
  "early-access": {
    title: "Design My Flex Time™",
    welcomeName: "Welcome to Flex Time™",
    workspaceLabel: "Your Flex Time Design Space",
    atmosphere: "Quiet · Unhurried · Open",
    surface: "#FBF4EC",
    backgroundImage: "/images/block-early-access.png",
    cherryBlossomMessage:
      "Welcome to your Flex Time™ — a protected 2-hour buffer at the start of every day, designed to absorb life's unavoidable demands without ever touching your CEO Workday™. This is not wasted time. It is your most powerful act of daily protection. Use it to prepare, handle what life asks of you, and arrive at your CEO Workday™ with clarity and full presence. What you design here determines the quality of everything that follows.",
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
    title: "Design My Morning Routine™",
    welcomeName: "Welcome to Morning GIV•EN™",
    workspaceLabel: "Your Morning Design Space",
    atmosphere: "Light · Fresh · Hopeful",
    surface: "#FBF1F3",
    backgroundImage: "/images/block-morning-given.png",
    cherryBlossomMessage:
      "Welcome to Morning GIV•EN™ — your 90-minute intentional morning operating ritual. GIV•EN™ stands for Gratitude, Invitation to Your Creator, Vision and Visualization, Emotional Embodiment, and Nurture. This is where you lead yourself before you lead your business. When you begin your day aligned in mind, body, and spirit, everything that follows — your decisions, your creativity, your presence — flows from a place of wholeness rather than depletion.",
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
    title: "Design My 30-Minute Movement™",
    welcomeName: "Welcome to Your Movement Window™",
    workspaceLabel: "Your Movement Design Space",
    atmosphere: "Energizing · Present · Alive",
    surface: "#EFF5EC",
    backgroundImage: "/images/block-movement-window.png",
    cherryBlossomMessage:
      "Welcome to your 30-Minute Movement Window™ — a non-negotiable block built directly into your Work-Life Balance Business Day™. The goal is not athletic performance. The goal is movement consistency. A 3-minute stretch performed every day compounds into far more value than an intense workout performed occasionally. When you move your body, you prepare your mind. The energy you bring to your CEO Workday™ at 1:00 PM is built right here.",
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
    title: "Design My Lunch Experience™",
    welcomeName: "Welcome to Your Healthy Hybrid Lunch™",
    workspaceLabel: "Your Lunch Design Space",
    atmosphere: "Nourishing · Warm · Restorative",
    surface: "#F5F1E7",
    backgroundImage: "/images/block-lunch-break.png",
    cherryBlossomMessage:
      "Welcome to your Extended Healthy Hybrid Lunch Break™ — a nourishing midday pause that refuels your body, creates a natural rhythm break, and prepares you for your most important work. This window is not a gap between tasks. It is a deliberate Sustainable Operating Practice™. What happens here — the meal you choose, the air you breathe, the presence you cultivate — directly determines the quality of your 4-Hour CEO Workday™. Nourishment is productive.",
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
    title: "Design My CEO Workday™",
    welcomeName: "Welcome to Your CEO Workday™",
    workspaceLabel: "Your CEO Workday Design Space",
    atmosphere: "Focused · Grounded · Executive",
    // Soft sage — the protected execution room.
    surface: "#E7F0E3",
    backgroundImage: "/images/block-ceo-workday.png",
    sceneVariant: "ceo-office",
    cherryBlossomMessage:
      "Welcome to your 4-Hour Focused CEO Workday™ — the most protected and powerful four hours in your entire Work-Life Balance Business Week™. This is not your busiest time. This is your most strategic time. Deep, uninterrupted work produces 4 to 5 times more output than scattered, reactive hours. Here you lead from your Human Zone of Genius™. You decide what only you can decide. You create what only you can create. Nothing enters this space uninvited.",
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
    title: "Design My Time Freedom™",
    welcomeName: "Welcome to Time Freedom™",
    workspaceLabel: "Your Time Freedom Design Space",
    atmosphere: "Golden · Spacious · Free",
    // Golden-hour warmth — sunset sand, not a cool spa. Time Freedom™ is the
    // reward at the end of a beautifully lived Business Day™: work is finished,
    // life begins now.
    surface: "#F7EDDD",
    backgroundImage: "/images/block-time-freedom.png",
    cherryBlossomMessage:
      "Welcome to Time Freedom™ — the protected life your business exists to support. From 5:00 PM to 10:00 PM, you are fully present. The business does not follow you here. This five-hour window belongs to your relationships, your passions, your rest, and your joy. Work is finished. You kept your commitment. Now receive the reward you built your operating system to protect. Be here. Be whole. Be free.",
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
    title: "Design My Evening Routine™",
    welcomeName: "Welcome to Power Down™",
    workspaceLabel: "Your Evening Design Space",
    atmosphere: "Quiet · Warm · Restorative",
    surface: "#EEEFF3",
    backgroundImage: "/images/block-power-down.png",
    cherryBlossomMessage:
      "Welcome to Power Down™ — your intentional evening transition from productivity to restoration. This is how you close the day with the same intention you opened it. Honor what you accomplished. Set down what you didn't. Prepare tomorrow so your mind can release its grip on today. Quality rest is not a reward for good performance — it is the foundation of tomorrow's excellence. What you do in this hour determines how you wake.",
    guidance:
      "Let the day come to a gentle close. Honor what you accomplished, set down what you didn't, and prepare tomorrow so your mind can finally slow.",
    defaultRuleType: "human",
    prompts: [
      "What are you most proud of from today?",
      "What is tomorrow's single priority?",
      "What will help your mind begin to slow?",
    ],
  },
  "digital-detox": {
    title: "Design My Digital Detox™",
    welcomeName: "Welcome to Your Digital Detox™",
    workspaceLabel: "Your Digital Detox Design Space",
    atmosphere: "Still · Restful · Restorative",
    surface: "#EDEEF2",
    backgroundImage: "/images/block-digital-detox.png",
    cherryBlossomMessage:
      "Welcome to your Unplug Digital Detox™ — the final and most restorative practice of your Work-Life Balance Business Day™. This is where you turn off the devices and give your nervous system the deep recovery it needs. Tomorrow's clarity, creativity, and performance are being built right now, in the quiet. The most successful founders protect their sleep as fiercely as they protect their CEO Workday™. Rest is a business strategy.",
    guidance:
      "Devices off. Mind quieted. This is how the best version of tomorrow is built — not by working later, but by resting deeper.",
    defaultRuleType: "human",
    prompts: [
      "What will you put down tonight to rest fully?",
      "What intention do you want to carry into tomorrow?",
      "What does your body need from you right now?",
    ],
  },
}

/** True when a segment has a Design Space (all segments now have one).
 *  power-down is excluded — its planner section has been removed from the home page. */
export function segmentHasPlanner(blockId: BlockId): boolean {
  if (blockId === "power-down") return false
  return Boolean(PLANNER_CONFIG[blockId])
}
