import { createClient } from "@/lib/supabase/client"

/**
 * Founder Profile™ persistence layer — database-backed.
 * ---------------------------------------------------------------------------
 * Founder Profile is a *living* document: ONE record per member, created on
 * first save and thereafter updated whenever the founder edits it from My
 * Work-Life Harmony Blueprint™.
 *
 * This is the source of truth. `lib/founder-profile/founder-profile-store.ts`
 * (localStorage) remains as a fast local cache so the UI can render instantly
 * on repeat visits — it is never authoritative and is refreshed from here.
 *
 * All writes/reads are best-effort: if the member is not signed in (e.g. the
 * public preview) nothing is persisted/loaded and the app continues normally
 * on the local cache alone.
 */

export interface FounderChild {
  name: string
  birthday: string
}

export interface FounderPet {
  name: string
  type: string
}

/** Shape saved by components/founder-profile/founder-profile-form.tsx. */
export interface FounderProfileData {
  profilePhoto: string | null
  fullName: string
  preferredName: string
  professionalTitle: string
  customTitle: string
  birthdate: string
  city: string
  stateProvince: string
  country: string
  maritalStatus: string
  partnerName: string
  anniversary: string
  children: FounderChild[]
  parentNames: string
  numberOfSiblings: string
  siblingNames: string
  grandchildren: string
  hasPets: string
  pets: FounderPet[]
  hobbies: string
  favoriteRelax: string
  bestFriend: string
  mentor: string
  accountabilityPartner: string
}

export interface FounderProfileRecord extends FounderProfileData {
  completedAt: string | null
  updatedAt: string | null
}

/** Resolves the current signed-in user id, or null if anonymous. Never throws. */
async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

function mapRow(row: Record<string, unknown> | null): FounderProfileRecord | null {
  if (!row) return null
  return {
    profilePhoto: (row.photo_url as string) ?? null,
    fullName: (row.full_name as string) ?? "",
    preferredName: (row.preferred_name as string) ?? "",
    professionalTitle: (row.professional_title as string) ?? "",
    customTitle: (row.custom_title as string) ?? "",
    birthdate: (row.birthdate as string) ?? "",
    city: (row.city as string) ?? "",
    stateProvince: (row.state_province as string) ?? "",
    country: (row.country as string) ?? "",
    maritalStatus: (row.marital_status as string) ?? "",
    partnerName: (row.partner_name as string) ?? "",
    anniversary: (row.anniversary as string) ?? "",
    children: (row.children as FounderChild[]) ?? [],
    parentNames: (row.parent_names as string) ?? "",
    numberOfSiblings: (row.number_of_siblings as string) ?? "",
    siblingNames: (row.sibling_names as string) ?? "",
    grandchildren: (row.grandchildren as string) ?? "",
    hasPets: (row.has_pets as string) ?? "",
    pets: (row.pets as FounderPet[]) ?? [],
    hobbies: (row.hobbies as string) ?? "",
    favoriteRelax: (row.favorite_relax as string) ?? "",
    bestFriend: (row.best_friend as string) ?? "",
    mentor: (row.mentor as string) ?? "",
    accountabilityPartner: (row.accountability_partner as string) ?? "",
    completedAt: (row.completed_at as string) ?? null,
    updatedAt: (row.updated_at as string) ?? null,
  }
}

function toColumns(p: FounderProfileData): Record<string, unknown> {
  return {
    photo_url: p.profilePhoto,
    full_name: p.fullName,
    preferred_name: p.preferredName,
    professional_title: p.professionalTitle,
    custom_title: p.customTitle,
    birthdate: p.birthdate,
    city: p.city,
    state_province: p.stateProvince,
    country: p.country,
    marital_status: p.maritalStatus,
    partner_name: p.partnerName,
    anniversary: p.anniversary,
    children: p.children,
    parent_names: p.parentNames,
    number_of_siblings: p.numberOfSiblings,
    sibling_names: p.siblingNames,
    grandchildren: p.grandchildren,
    has_pets: p.hasPets,
    pets: p.pets,
    hobbies: p.hobbies,
    favorite_relax: p.favoriteRelax,
    best_friend: p.bestFriend,
    mentor: p.mentor,
    accountability_partner: p.accountabilityPartner,
  }
}

/**
 * Saves the Founder Profile™ for the current member to the database.
 * No-ops silently when signed out (localStorage cache still applies).
 */
export async function saveFounderProfileToDb(profile: FounderProfileData): Promise<void> {
  const userId = await getUserId()
  if (!userId) return

  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data: existing } = await supabase
      .from("founder_profiles")
      .select("completed_at")
      .eq("user_id", userId)
      .maybeSingle()

    await supabase.from("founder_profiles").upsert(
      {
        user_id: userId,
        ...toColumns(profile),
        completed_at: (existing?.completed_at as string | undefined) ?? now,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
  } catch (error) {
    console.log("[v0] saveFounderProfileToDb skipped:", (error as Error)?.message)
  }
}

/**
 * Loads the member's Founder Profile™ record from the database, or null if
 * they have not yet completed it (or are anonymous/offline).
 */
export async function getFounderProfileFromDb(): Promise<FounderProfileRecord | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const supabase = createClient()
    const { data } = await supabase.from("founder_profiles").select("*").eq("user_id", userId).maybeSingle()

    return mapRow(data as Record<string, unknown> | null)
  } catch (error) {
    console.log("[v0] getFounderProfileFromDb skipped:", (error as Error)?.message)
    return null
  }
}

/** True once the signed-in member has a completed Founder Profile™ in the database. */
export async function hasCompletedFounderProfileInDb(): Promise<boolean> {
  const record = await getFounderProfileFromDb()
  return Boolean(record?.completedAt)
}

/**
 * Uploads a new Founder Profile™ photo to private Blob storage and returns
 * the app-relative URL to render/store (routed through the protected
 * /api/founder-profile/photo/[...pathname] serving route).
 */
export async function uploadFounderProfilePhoto(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/founder-profile/photo", { method: "POST", body: formData })
    if (!res.ok) return null
    const { pathname } = (await res.json()) as { pathname: string }
    return `/api/founder-profile/photo/${pathname}`
  } catch (error) {
    console.log("[v0] uploadFounderProfilePhoto failed:", (error as Error)?.message)
    return null
  }
}
