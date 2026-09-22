/**
 * Original Entrepreneurial Intention™ — the selectable inventory of life
 * intentions a founder recognizes as "what I wanted this business to make
 * possible." This is a recognition exercise, not an assessment: the founder
 * picks what resonates, optionally adds their own, and we compose a concise
 * personalized summary. Grouped so the UI can present it in digestible themes.
 */

export interface IntentionGroup {
  id: string
  label: string
  items: string[]
}

export const INTENTION_GROUPS: IntentionGroup[] = [
  {
    id: "time-freedom",
    label: "Time, Flexibility & Freedom",
    items: [
      "Flex Time™",
      "fewer hours",
      "part-time hours",
      "full pay without full-time hours",
      "a 4-day workweek",
      "less than a 4-day workweek",
      "3-day weekends",
      "Fridays off",
      "more unscheduled time",
      "the ability to be unavailable",
      "freedom from always being on",
    ],
  },
  {
    id: "workday-design",
    label: "Workday Design",
    items: [
      "an easier entry into the workday",
      "an easier entry into the workweek",
      "time to pause",
      "time to decide how to show up",
      "fewer meetings",
      "fewer interruptions",
      "fewer notifications",
      "uninterrupted creative time",
      "deep work",
      "focused CEO time",
      "strategic thinking",
      "time to create",
      "time to write",
      "time to innovate",
    ],
  },
  {
    id: "health-movement",
    label: "Health & Movement",
    items: [
      "time to move",
      "exercise",
      "a Movement Window™",
      "healthy meals",
      "hydration",
      "physical health",
      "medical & preventive care",
      "physical recovery",
    ],
  },
  {
    id: "sleep-rest",
    label: "Sleep, Rest & Recovery",
    items: [
      "8 hours of sleep",
      "going to bed on time",
      "restorative sleep",
      "protected evenings",
      "Power Down™",
      "Unplug™",
      "digital rest",
      "relaxation",
      "restoration",
      "naps",
      "lazy days",
      "doing nothing without guilt",
      "time simply to be",
    ],
  },
  {
    id: "relationships",
    label: "Relationships, Love & Family",
    items: [
      "time with my partner",
      "nurturing a relationship",
      "date nights",
      "intimacy",
      "meaningful conversations",
      "anniversaries",
      "birthdays",
      "special occasions",
      "dinner with family",
      "time with my children",
      "playing with my children",
      "school events & activities",
      "time with my parents",
      "siblings",
      "extended family",
      "family traditions",
      "making memories",
      "emotional presence",
    ],
  },
  {
    id: "friends-community",
    label: "Friends & Community",
    items: [
      "time with friends",
      "a social life",
      "community",
      "like-minded people",
      "a founder community",
      "less entrepreneurial isolation",
      "peer relationships",
      "mentorship",
      "accountability",
      "belonging",
    ],
  },
  {
    id: "hobbies-play",
    label: "Hobbies, Play & Creativity",
    items: [
      "hobbies",
      "reading",
      "music",
      "dancing",
      "cooking",
      "gardening",
      "art",
      "photography",
      "writing",
      "crafts",
      "personal projects",
      "learning for enjoyment",
      "curiosity",
      "play",
      "laughter",
      "fun",
      "creativity",
      "rediscovering myself outside work",
    ],
  },
  {
    id: "travel",
    label: "Travel, Vacation & Recreation",
    items: [
      "vacation",
      "travel",
      "long weekends",
      "extended travel",
      "spontaneous trips",
      "family vacations",
      "couple vacations",
      "solo travel",
      "adventure",
      "nature",
      "culture",
      "recreation",
      "leisure",
      "leaving town without the business",
      "vacation without checking in",
      "returning without an overwhelming backlog",
    ],
  },
  {
    id: "self-care",
    label: "Self-Care & Personal Life",
    items: [
      "self-care",
      "personal wellness",
      "beauty & grooming",
      "time alone",
      "privacy",
      "quiet",
      "solitude",
      "personal growth",
      "emotional restoration",
      "reconnecting with myself",
    ],
  },
  {
    id: "spiritual",
    label: "Spiritual & Inner Life",
    items: [
      "prayer",
      "meditation",
      "worship",
      "study",
      "fellowship",
      "gratitude",
      "reflection",
      "contemplation",
      "time in nature",
      "peace",
      "a spiritual practice",
      "grounding",
      "meaning",
    ],
  },
  {
    id: "home",
    label: "Home & Everyday Life",
    items: [
      "caring for my home",
      "beauty & order",
      "cooking at home",
      "organizing",
      "decluttering",
      "enjoying my home",
      "my neighborhood",
      "the outdoors",
    ],
  },
  {
    id: "pets",
    label: "Pets",
    items: [
      "time with my pets",
      "walking my pets",
      "playing with my pets",
      "caring for my pets",
      "pet appointments",
      "traveling with my pets",
      "companionship",
    ],
  },
  {
    id: "celebration",
    label: "Celebration",
    items: [
      "celebrating success",
      "holidays",
      "weddings",
      "graduations",
      "reunions",
      "milestones",
      "my children's milestones",
      "business milestones",
      "appreciating what I built",
    ],
  },
  {
    id: "charity",
    label: "Charity, Service & Philanthropy",
    items: [
      "charity",
      "volunteering",
      "philanthropy",
      "mentoring",
      "community service",
      "supporting causes",
      "helping others",
      "contributing beyond the business",
    ],
  },
  {
    id: "financial",
    label: "Financial & Life Autonomy",
    items: [
      "financial independence",
      "financial security",
      "greater income",
      "wealth creation",
      "generational wealth",
      "financial choices",
      "retirement flexibility",
      "the ability to work less",
      "the ability to stop working",
      "building an asset instead of another job",
      "income less dependent on my physical presence",
    ],
  },
  {
    id: "deeper",
    label: "The Deeper Intention",
    items: [
      "more freedom",
      "more autonomy",
      "more choice",
      "more presence",
      "more peace",
      "more joy",
      "more health",
      "more energy",
      "more creativity",
      "more connection",
      "more family",
      "more love",
      "more community",
      "more adventure",
      "more meaning",
      "more purpose",
      "more contribution",
      "more rest",
      "more life",
      "more ability to enjoy what I built",
      "more ability to be human",
      "a business that supports my life",
      "a business that makes more of my life possible",
    ],
  },
]

/**
 * Compose a concise, personalized Original Entrepreneurial Intention™ summary
 * from the founder's selections. Deterministic — no invented selections.
 */
export function composeIntentionSummary(selections: string[], somethingElse?: string): string {
  const all = [...selections]
  if (somethingElse?.trim()) all.push(somethingElse.trim())
  if (all.length === 0) return ""

  const lead = all.slice(0, 3)
  const rest = all.slice(3)

  const list = (arr: string[]) => {
    if (arr.length === 1) return arr[0]
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
    return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`
  }

  let summary = `You didn't build this business only to grow revenue — you built it to make room for ${list(lead)}`
  if (rest.length > 0) {
    summary += `. Underneath that, you named ${list(rest)}`
  }
  summary += `. That is what this business was always meant to protect.`
  return summary
}
