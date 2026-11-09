import "server-only"
import { createHmac } from "node:crypto"
import type { SupabaseClient } from "@supabase/supabase-js"

const WINDOW_MINUTES = 10
const MAX_ATTEMPTS = 5

/** Keyed hash so raw IP addresses are never stored. */
function hashIp(ip: string) {
  const key = process.env.SUPABASE_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "reality-check"
  return createHmac("sha256", key).update(ip).digest("hex")
}

export function clientIp(headerList: Headers) {
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || "unknown"
}

/** Returns false when this IP has exceeded the window. Fails open if storage is unavailable. */
export async function allowRegistrationAttempt(supabase: SupabaseClient, ip: string): Promise<boolean> {
  const ipHash = hashIp(ip)
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString()
  try {
    const { count, error } = await supabase
      .from("reality_check_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since)
    if (error) throw error
    if ((count ?? 0) >= MAX_ATTEMPTS) return false
    await supabase.from("reality_check_rate_limits").insert({ ip_hash: ipHash })
    return true
  } catch (err) {
    console.error("[reality-check] rate limit check failed", err)
    return true
  }
}

export async function pruneRateLimits(supabase: SupabaseClient) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60_000).toISOString()
  await supabase.from("reality_check_rate_limits").delete().lt("created_at", cutoff)
}
