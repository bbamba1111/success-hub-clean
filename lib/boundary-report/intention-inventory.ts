/**
 * Original Entrepreneurial Intention™ — the selectable inventory of life
 * intentions a founder recognizes as "what I wanted this business to make
 * possible." This is a recognition exercise, not an assessment: the founder
 * picks one item per category, optionally adds their own, and we compose a concise
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
    label: "Time & Freedom",
    items: [
      "Flex Time™",
      "a 4-day workweek with 3-day weekends",
      "full pay without full-time hours",
      "the ability to be unavailable",
      "an easier entry into the workday and the workweek",
      "fewer meetings, interruptions & notifications",
      "focused CEO time & deep work",
    ],
  },
  {
    id: "health-rest",
    label: "Health & Rest",
    items: [
      "time to move & exercise",
      "a Movement Window™",
      "healthy meals",
      "physical health & preventive care",
      "restorative sleep",
      "Power Down™ & protected evenings",
      "Unplug™ & digital rest",
    ],
  },
  {
    id: "relationships",
    label: "Relationships & Family",
    items: [
      "time with my partner",
      "date nights & intimacy",
      "time with my children",
      "school events & activities",
      "family dinners & traditions",
      "time with my parents & extended family",
      "birthdays, anniversaries, holidays & milestones",
    ],
  },
  {
    id: "community",
    label: "Community & Giving",
    items: [
      "time with friends",
      "a founder community of like-minded peers",
      "less entrepreneurial isolation",
      "mentorship & accountability",
      "belonging",
      "volunteering & helping others",
      "contributing beyond the business",
    ],
  },
  {
    id: "play-travel",
    label: "Play, Travel & Creativity",
    items: [
      "hobbies & personal projects",
      "creative pursuits (art, music, writing)",
      "learning for enjoyment",
      "play, laughter & fun",
      "vacation & long weekends",
      "leaving town without the business",
      "returning without an overwhelming backlog",
    ],
  },
  {
    id: "home-self",
    label: "Home, Self & Inner Life",
    items: [
      "self-care & personal wellness",
      "time alone, quiet & doing nothing without guilt",
      "reconnecting with myself",
      "meditation, prayer & reflection",
      "time in nature & the outdoors",
      "caring for my home & my pets",
      "peace & meaning",
    ],
  },
  {
    id: "financial",
    label: "Financial & Life Autonomy",
    items: [
      "financial independence & security",
      "greater income & wealth creation",
      "generational wealth",
      "the ability to work less or stop working",
      "building an asset instead of another job",
      "income less dependent on my physical presence",
    ],
  },
  {
    id: "deeper",
    label: "The Deeper Intent",
    items: [
      "more freedom & choice",
      "more presence",
      "more peace & joy",
      "more connection & love",
      "more meaning & purpose",
      "more ability to enjoy what I built",
      "more ability to be human",
      "a business that supports my life",
      "a business that makes more of my life possible",
    ],
  },
]

const DEEPER_INTENT_GROUP_ID = "deeper"

const formatList = (arr: string[]) => {
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
  return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`
}

/**
 * Compose the founder's Original Entrepreneurial Intention™ in first person,
 * so they read it back as their own statement. One choice per category, keyed
 * by group id. The Deeper Intent (or the founder's own words) leads; the other
 * category choices describe what that looks like in their life.
 */
export function composeIntentionSummary(
  choices: Record<string, string>,
  somethingElse?: string,
): string {
  const ownWords = somethingElse?.trim()
  const deeper = choices[DEEPER_INTENT_GROUP_ID]
  const lifeChoices = INTENTION_GROUPS.filter((g) => g.id !== DEEPER_INTENT_GROUP_ID)
    .map((g) => choices[g.id])
    .filter((v): v is string => Boolean(v))

  const leadParts = [deeper, ownWords].filter((v): v is string => Boolean(v))
  if (leadParts.length === 0 && lifeChoices.length === 0) return ""

  const lead = leadParts.length > 0 ? leadParts : [lifeChoices.shift() as string]

  let summary = `I didn't build this business only to grow revenue — I built it to make room for ${formatList(lead)}.`
  if (lifeChoices.length > 0) {
    summary += ` For me, that means ${formatList(lifeChoices)}.`
  }
  summary += ` That is what this business was always meant to protect.`
  return summary
}
