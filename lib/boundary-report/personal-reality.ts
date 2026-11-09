/** Personal & Work-From-Home Reality™ — unscored indicators of what the founder's life requires. */

export interface PersonalRealityOption {
  id: string
  label: string
}

export interface PersonalRealityGroup {
  id: string
  title: string
  options: PersonalRealityOption[]
}

export const PERSONAL_REALITY_GROUPS: PersonalRealityGroup[] = [
  {
    id: "household",
    title: "Home and household responsibilities",
    options: [
      { id: "household-chores", label: "Household chores, cooking, cleaning, and errands compete with work" },
      { id: "home-maintenance", label: "Home maintenance and deliveries interrupt focused work" },
      { id: "household-into-workday", label: "Household responsibilities extend into my planned workday" },
      { id: "household-mental-load", label: "I carry the mental load of managing the household" },
    ],
  },
  {
    id: "family",
    title: "Family and caregiving",
    options: [
      { id: "childcare", label: "Childcare or school responsibilities" },
      { id: "elder-care", label: "Caring for an aging parent or another family member" },
      { id: "assumed-available", label: "Family assumes I'm available because I work from home" },
      { id: "family-interrupts", label: "Family responsibilities interrupt protected work or personal time" },
    ],
  },
  {
    id: "health",
    title: "Personal health and daily routines",
    options: [
      { id: "appointments-postponed", label: "Doctors' appointments and checkups get postponed or are hard to fit in" },
      { id: "health-competes", label: "Personal health needs and follow-up care compete with business commitments" },
      { id: "routines-displaced", label: "Meals, movement, sleep, rest, and recovery get displaced by work" },
    ],
  },
  {
    id: "connection",
    title: "Relationships, social connection, and entrepreneurial isolation",
    options: [
      { id: "relationships-interrupted", label: "Personal relationships and family time are interrupted by business" },
      { id: "friendships-postponed", label: "Friendships and social commitments keep getting postponed" },
      { id: "entrepreneurial-isolation", label: "Limited connection with people who understand building a business" },
      { id: "entrepreneurial-loneliness", label: "I feel alone carrying business decisions, uncertainty, and pressure" },
      { id: "wfh-limits-interaction", label: "Working from home limits everyday human interaction" },
      { id: "limited-community", label: "Little time for community, recreation, and meaningful connection" },
    ],
  },
  {
    id: "wfh",
    title: "Work-from-home boundaries and environment",
    options: [
      { id: "no-separation", label: "No clear separation between workspace and living space" },
      { id: "work-intrudes", label: "Business tasks intrude into evenings, weekends, or personal time" },
      { id: "household-interruptions", label: "Household interruptions break focused work" },
      { id: "workspace-limits", label: "Noise, shared spaces, privacy, or workspace limits affect my work" },
      { id: "cant-disconnect", label: "It's hard to mentally disconnect from the business at home" },
    ],
  },
  {
    id: "mental-load",
    title: "Mental load and competing expectations",
    options: [
      { id: "always-productive", label: "I feel obligated to be productive whenever I'm home" },
      { id: "tasks-unfinished", label: "Household tasks stay mentally unfinished during business hours" },
      { id: "guilt", label: "I feel guilty working instead of tending to home, or resting instead of working" },
      { id: "no-support", label: "I manage business and household responsibilities without adequate support" },
    ],
  },
]

const OPTION_INDEX = new Map(
  PERSONAL_REALITY_GROUPS.flatMap((g) => g.options.map((o) => [o.id, { ...o, groupId: g.id }] as const)),
)

export function personalRealityById(id: string) {
  return OPTION_INDEX.get(id)
}
