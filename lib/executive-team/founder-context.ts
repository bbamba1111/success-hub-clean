import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Founder Context™ — the single source the AI Executive Team™ reads before
 * creating or filling any Business Template™. Templates stay reusable for any
 * founder; this context is what makes each one specific to *this* business.
 */

function listText(value: unknown): string {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean).join(", ")
  if (value && typeof value === "object") return Object.values(value).map((v) => String(v)).filter(Boolean).join(", ")
  return typeof value === "string" ? value.trim() : ""
}

export async function getFounderContext(supabase: SupabaseClient, userId: string): Promise<string> {
  const [{ data: founder }, { data: business }] = await Promise.all([
    supabase
      .from("founder_profiles")
      .select("full_name, preferred_name, professional_title, custom_title, city, state_province, country")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("business_context_profiles")
      .select(
        "business_name, industry, business_stage, business_model, founder_role, team_size, revenue_stage, offer_statement, ideal_client_definition, acquisition_channel, conversion_mechanism, delivery_model, referral_mechanism, biggest_goal_text, biggest_goals, biggest_challenge_text, success_vision, growth_vision",
      )
      .eq("user_id", userId)
      .maybeSingle(),
  ])

  const location = [founder?.city, founder?.state_province, founder?.country].filter(Boolean).join(", ")
  const lines: [string, string][] = [
    ["Founder name", founder?.preferred_name || founder?.full_name || ""],
    ["Title", founder?.custom_title || founder?.professional_title || business?.founder_role || ""],
    ["Location", location],
    ["Business name", business?.business_name ?? ""],
    ["Industry", business?.industry ?? ""],
    ["Business stage", business?.business_stage ?? ""],
    ["Business model", listText(business?.business_model)],
    ["Team size", business?.team_size ?? ""],
    ["Revenue stage", business?.revenue_stage ?? ""],
    ["Core offer", business?.offer_statement ?? ""],
    ["Ideal client", business?.ideal_client_definition ?? ""],
    ["How clients find them", business?.acquisition_channel ?? ""],
    ["How clients buy", business?.conversion_mechanism ?? ""],
    ["How the work is delivered", business?.delivery_model ?? ""],
    ["Referral mechanism", business?.referral_mechanism ?? ""],
    ["Biggest goal", business?.biggest_goal_text || listText(business?.biggest_goals)],
    ["Biggest challenge", business?.biggest_challenge_text ?? ""],
    ["Vision of success", business?.success_vision || business?.growth_vision || ""],
  ]

  const filled = lines.filter(([, v]) => v && v.trim())
  if (filled.length === 0) return ""

  return `FOUNDER CONTEXT™ (from the founder's approved Founder Profile and Business Profile — use it to make every Step specific to this business; never invent credentials, clients, results, or contacts beyond it):
${filled.map(([k, v]) => `- ${k}: ${v.trim()}`).join("\n")}`
}
