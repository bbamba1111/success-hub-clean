import type { MemoryInput } from "@/lib/cherry-blossom/memory"
import type { FounderProfileData } from "@/utils/founder-profile-storage"

/**
 * Life Events™ — derives Cherry Blossom Memory Vault™ `important_date` rows
 * straight from a member's Founder Profile™ (birthdate, anniversary,
 * children's birthdays). No manual re-entry, no separate data-entry screen:
 * every time a founder saves their profile, whatever they've shared becomes
 * a reminder Cherry Blossom can proactively surface. The more they share via
 * My Work-Life Harmony Blueprint™, the more personalized their experience
 * becomes.
 */

/**
 * Best-effort month/day extraction from a stored date string. Founder
 * Profile™ dates come from `<input type="date">` (`YYYY-MM-DD`) but this
 * falls back to native Date parsing for any other format that slips through.
 */
function parseMonthDay(value: string | null | undefined): { month: number; day: number } | null {
  if (!value?.trim()) return null

  const isoMatch = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const month = Number(isoMatch[2])
    const day = Number(isoMatch[3])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day }
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return { month: parsed.getMonth() + 1, day: parsed.getDate() }
}

/**
 * Builds the set of `important_date` MemoryInput rows implied by a Founder
 * Profile™ record. Safe to call with a partially-filled profile — every
 * field is optional and simply contributes nothing when blank.
 */
export function seedLifeEventMemories(profile: FounderProfileData): MemoryInput[] {
  const memories: MemoryInput[] = []

  const birthdate = parseMonthDay(profile.birthdate)
  if (birthdate) {
    const name = profile.preferredName?.trim() || profile.fullName?.trim() || "Your birthday"
    memories.push({
      memory_type: "important_date",
      memory_key: "founder_birthday",
      memory_value: `${name}'s birthday`,
      confidence: "high",
      source: "founder_profile",
      event_month: birthdate.month,
      event_day: birthdate.day,
    })
  }

  const anniversary = parseMonthDay(profile.anniversary)
  if (anniversary && profile.partnerName?.trim()) {
    memories.push({
      memory_type: "important_date",
      memory_key: "anniversary",
      memory_value: `Anniversary with ${profile.partnerName.trim()}`,
      confidence: "high",
      source: "founder_profile",
      event_month: anniversary.month,
      event_day: anniversary.day,
    })
  }

  for (const child of profile.children ?? []) {
    const childBirthday = parseMonthDay(child.birthday)
    if (!childBirthday || !child.name?.trim()) continue
    memories.push({
      memory_type: "important_date",
      memory_key: `child_birthday_${child.name.trim().toLowerCase().replace(/\s+/g, "_")}`,
      memory_value: `${child.name.trim()}'s birthday`,
      confidence: "high",
      source: "founder_profile",
      event_month: childBirthday.month,
      event_day: childBirthday.day,
    })
  }

  return memories
}
