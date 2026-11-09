import "server-only"
import { NextResponse } from "next/server"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const MEMBER_LIMITS = { perMinute: 10, perHour: 60, maxBytes: 64 * 1024 }
export const PUBLIC_LIMITS = { perMinute: 10, perHour: 10, maxBytes: 8 * 1024 }

type Refusal = { ok: false; response: NextResponse }
export type MemberGuardResult = { ok: true; user: User } | Refusal
export type PublicGuardResult = { ok: true } | Refusal

function refuse(status: number, error: string, headers?: Record<string, string>): Refusal {
  return { ok: false, response: NextResponse.json({ error }, { status, headers }) }
}

const SHUTDOWN = () => refuse(503, "AI features are temporarily switched off. Please try again later.")
const UNAVAILABLE = () => refuse(503, "AI features are unavailable right now. Please try again shortly.")

function envShutdown() {
  return process.env.AI_EMERGENCY_SHUTDOWN?.trim().toLowerCase() === "true"
}

function bodyTooLarge(req: Request, maxBytes: number): Refusal | null {
  const raw = req.headers.get("content-length")
  if (raw === null) return refuse(411, "Request size is required.")
  const size = Number(raw)
  if (!Number.isFinite(size) || size < 0) return refuse(400, "Invalid request size.")
  if (size > maxBytes) return refuse(413, "Request is too large.")
  return null
}

export function isActiveMember(profile: { role: string | null; membership_tier: string | null } | null) {
  if (!profile) return false
  if (profile.role === "platform_admin") return true
  const tier = profile.membership_tier?.trim().toLowerCase() ?? ""
  return tier !== "" && !tier.includes("free") && tier !== "premium_member"
}

async function aiSwitchOn(admin: ReturnType<typeof createAdminClient>) {
  const { data, error } = await admin.from("app_settings").select("value").eq("key", "ai_enabled").maybeSingle()
  if (error) throw error
  return data?.value === true
}

async function consume(
  admin: ReturnType<typeof createAdminClient>,
  scope: "member" | "public",
  subject: string,
  route: string,
  limits: { perMinute: number; perHour: number },
): Promise<Refusal | null> {
  const { data, error } = await admin.rpc("ai_consume_quota", {
    p_scope: scope,
    p_subject: subject,
    p_route: route,
    p_per_minute: limits.perMinute,
    p_per_hour: limits.perHour,
  })
  if (error || !data) throw error ?? new Error("No quota result")
  const result = data as { allowed: boolean; retry_after?: number }
  if (result.allowed) return null
  const retry = String(result.retry_after ?? 60)
  return refuse(429, "You've reached the AI usage limit for now. Please try again a little later.", {
    "Retry-After": retry,
  })
}

/** Gate for member AI routes: login, active paid membership, shutdown switch, shared usage limit, size cap. */
export async function guardMemberAi(req: Request, route: string): Promise<MemberGuardResult> {
  if (envShutdown()) return SHUTDOWN()
  const tooLarge = bodyTooLarge(req, MEMBER_LIMITS.maxBytes)
  if (tooLarge) return tooLarge

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return refuse(401, "Please sign in to use this.")

    const admin = createAdminClient()
    if (!(await aiSwitchOn(admin))) return SHUTDOWN()

    const { data: profile, error } = await admin
      .from("user_profiles")
      .select("role, membership_tier")
      .eq("id", user.id)
      .maybeSingle()
    if (error) throw error
    if (!isActiveMember(profile)) return refuse(403, "An active paid membership is required for this.")

    const limited = await consume(admin, "member", user.id, route, MEMBER_LIMITS)
    if (limited) return limited

    return { ok: true, user }
  } catch (error) {
    console.error(`[ai-guard] ${route} refused: could not verify`, error instanceof Error ? error.message : error)
    return UNAVAILABLE()
  }
}

// Web Crypto keeps this usable from both Edge and Node route runtimes.
async function visitorKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const ip = forwarded || req.headers.get("x-real-ip")?.trim() || "unknown"
  const salt = process.env.SUPABASE_JWT_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`public-ai:${salt}:${ip}`))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")
}

/** Gate for the public homepage AI route: shutdown switch, per-visitor limit, size cap. No member data. */
export async function guardPublicAi(req: Request, route: string): Promise<PublicGuardResult> {
  if (envShutdown()) return SHUTDOWN()
  const tooLarge = bodyTooLarge(req, PUBLIC_LIMITS.maxBytes)
  if (tooLarge) return tooLarge

  try {
    const admin = createAdminClient()
    if (!(await aiSwitchOn(admin))) return SHUTDOWN()
    const limited = await consume(admin, "public", await visitorKey(req), route, PUBLIC_LIMITS)
    if (limited) return limited
    return { ok: true }
  } catch (error) {
    console.error(`[ai-guard] ${route} refused: could not verify`, error instanceof Error ? error.message : error)
    return UNAVAILABLE()
  }
}

export function goneResponse() {
  return NextResponse.json({ error: "This feature has been retired." }, { status: 410 })
}
