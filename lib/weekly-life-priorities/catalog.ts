/**
 * Weekly Life Priorities™ — the categories a founder can choose to make room
 * for during a Work-Life Balance Business Week™.
 *
 * This is a life-focus vocabulary, NOT a business task list. A founder may
 * select as MANY of these as they want for a given week — there is no 1–3 cap.
 * The list ends with a "Create my own" path in the UI (not represented here).
 *
 * `id` values intentionally match the legacy life_priority_option_id values
 * used by lib/weekly-commitments so migrated historical rows map cleanly.
 */

export interface LifePriorityCategory {
  id: string
  label: string
  /** Lower-case phrase that reads naturally inside a first-person sentence. */
  phrase: string
}

export const LIFE_PRIORITY_CATEGORIES: LifePriorityCategory[] = [
  { id: "family", label: "Family", phrase: "my family" },
  { id: "partner", label: "Partner / Relationship", phrase: "my relationship" },
  { id: "friends", label: "Friends", phrase: "time with friends" },
  { id: "rest", label: "Rest", phrase: "real rest" },
  { id: "movement", label: "Movement / Health", phrase: "my health and movement" },
  { id: "recreation", label: "Recreation", phrase: "recreation" },
  { id: "personal-project", label: "Personal Project", phrase: "a personal project" },
  { id: "spiritual", label: "Spiritual Time", phrase: "spiritual time" },
  { id: "home", label: "Home", phrase: "my home" },
  { id: "community", label: "Community", phrase: "my community" },
  { id: "travel", label: "Travel", phrase: "travel" },
  { id: "creativity", label: "Creativity", phrase: "my creativity" },
  { id: "learning", label: "Learning", phrase: "learning" },
  { id: "celebration", label: "Celebration", phrase: "celebration" },
]

/** Turn free text into a phrase that sits naturally inside a sentence. */
export function toLifePhrase(label: string): string {
  const t = label.trim().replace(/[.!]+$/, "")
  if (!t) return t
  const looksProper = /^[A-Z][a-z]+\s+[A-Z]/.test(t) || /™/.test(t)
  return looksProper ? t : t[0].toLowerCase() + t.slice(1)
}

/** Map a Reality Check priority-focus-area key/label to a suggested life category. */
export function suggestLifeCategoriesFromFocus(
  focusLabels: string[],
): LifePriorityCategory[] {
  const hay = focusLabels.map((l) => l.toLowerCase())
  const out: LifePriorityCategory[] = []
  const push = (id: string) => {
    const cat = LIFE_PRIORITY_CATEGORIES.find((c) => c.id === id)
    if (cat && !out.some((o) => o.id === cat.id)) out.push(cat)
  }
  for (const l of hay) {
    if (/(relationship|partner|spouse|marriage)/.test(l)) push("partner")
    if (/(family|children|kids|parent)/.test(l)) push("family")
    if (/(friend|social)/.test(l)) push("friends")
    if (/(sleep|rest|recovery|energy)/.test(l)) push("rest")
    if (/(movement|exercise|physical|fitness|health|body)/.test(l)) push("movement")
    if (/(fun|recreation|play|hobby|leisure)/.test(l)) push("recreation")
    if (/(spiritual|faith|meaning|purpose)/.test(l)) push("spiritual")
    if (/(home|space|environment)/.test(l)) push("home")
    if (/(community|belonging|contribution)/.test(l)) push("community")
    if (/(travel|adventure)/.test(l)) push("travel")
    if (/(creative|creativity|art|expression)/.test(l)) push("creativity")
    if (/(learning|growth|develop)/.test(l)) push("learning")
    if (/(celebrat|joy|reward)/.test(l)) push("celebration")
  }
  return out
}
