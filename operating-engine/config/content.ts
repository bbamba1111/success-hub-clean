/**
 * Motivational content libraries for the Motivation Engine.
 * Content rotates daily (stable for a calendar day) using day-of-year.
 */
import type { PartOfDay } from "../types"

/**
 * "Repeat After Me™" affirmation library, grouped by part of day.
 * Each part has several sets; one set is selected per day.
 */
export const AFFIRMATIONS: Record<PartOfDay, string[][]> = {
  morning: [
    ["I choose intention over reaction.", "I protect my time.", "I lead with clarity.", "I make time for more."],
    ["I begin today aligned.", "I honor my non-negotiables.", "I design my day on purpose.", "I am present."],
    ["I lead myself before I lead others.", "I move with calm and clarity.", "I create from a full cup."],
  ],
  ceo: [
    ["I focus on what matters most.", "I create value with every decision.", "I work smarter.", "I finish well."],
    ["I protect my deep work.", "I make confident decisions.", "I execute with intention.", "I deliver excellence."],
    ["I do the work only I can do.", "I trust my focus.", "I build the future with each action."],
  ],
  evening: [
    ["I release today's work.", "I welcome rest.", "Tomorrow begins with the choices I make tonight."],
    ["I am present with the people I love.", "I let go of what's unfinished.", "I rest with gratitude."],
    ["I close today on purpose.", "I quiet my mind.", "I prepare tomorrow with peace."],
  ],
}

/** Daily AI coaching messages, grouped by part of day. */
export const COACHING_MESSAGES: Record<PartOfDay, string[]> = {
  morning: [
    "Name the one outcome that would make today a win — then protect the time to make it happen.",
    "Before you open a single tab, decide what deserves your best energy this morning.",
    "Start with alignment, not urgency. What matters most rarely shouts the loudest.",
  ],
  ceo: [
    "Close the loops that drain you, then give your sharpest focus to the work only you can do.",
    "Trade busy for effective: choose the single task that moves your business forward most.",
    "Your focus is your most valuable asset today. Spend it on leverage, not noise.",
  ],
  evening: [
    "The workday is complete. Let presence — not productivity — define the next few hours.",
    "Reflect on one thing that went well today, and let that be enough.",
    "Wind down with intention. Rest is how you compound tomorrow's performance.",
  ],
}

/** Daily reflection questions, grouped by part of day. */
export const REFLECTION_QUESTIONS: Record<PartOfDay, string[]> = {
  morning: [
    "What would make today feel meaningful, regardless of what gets done?",
    "Where can you choose intention over reaction today?",
    "What is one non-negotiable you'll honor before noon?",
  ],
  ceo: [
    "What is the highest-leverage decision in front of you right now?",
    "What could you stop doing to create more focus?",
    "If you only finished one thing today, what should it be?",
  ],
  evening: [
    "What are you grateful for from today?",
    "What can you release so you can rest fully tonight?",
    "Who deserves your presence this evening?",
  ],
}

/** Daily quotes pool (rotates daily across all parts of day). */
export const QUOTES: { text: string; author: string }[] = [
  { text: "Time is the coin of your life. It is the only coin you have, and only you can determine how it will be spent.", author: "Carl Sandburg" },
  { text: "You will never find time for anything. If you want time, you must make it.", author: "Charles Buxton" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { text: "Rest when you're weary. Refresh and renew yourself. Then get back to work.", author: "Ralph Marston" },
  { text: "Balance is not something you find, it's something you create.", author: "Jana Kingsford" },
  { text: "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.", author: "Zig Ziglar" },
]
