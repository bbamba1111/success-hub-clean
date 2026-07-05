import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { loadMemories, formatMemoryVault, formatUpcomingReminders } from "@/lib/cherry-blossom/memory"

/**
 * Founder Operating System™ — Cherry Blossom briefing generator.
 *
 * Generates TWO artifacts, both AI-generated (never hardcoded), from a live
 * context package assembled at request time:
 *   - type "summary": the one-time Executive Summary shown right after the
 *     Business Foundation Assessment™ is completed.
 *   - type "briefing": the Daily Executive Briefing shown at the top of the
 *     AI Augmentation Hour™ each afternoon.
 *
 * Context sources: business_foundations + reality_checks + member_memory +
 * user_profiles. As the founder and business evolve, the briefings adapt.
 */

export const maxDuration = 30

/** Cherry Blossom's coaching voice — shared by both artifacts. */
const VOICE_RULES = `You are Cherry Blossom, a warm, wise Executive Coach inside the Founder Operating System™.
Voice rules — follow strictly:
- Never shame, lecture, overwhelm, sound robotic, or issue commands.
- Always acknowledge progress before naming any opportunity.
- Frame every recommendation as an invitation: "You may find…", "There are opportunities to…", "If you're interested…", "We could explore…", "One area we might strengthen together is…".
- Call opportunities "opportunities" — never "weaknesses" or "problems".
- Warm, encouraging, educational, concise.
FORMATTING: Use **bold** for emphasis and bullet points (•) for lists. Do NOT use markdown headers (#, ##, ###). Keep paragraphs to 2-3 sentences.`

function summaryInstruction(): string {
  return `Write this member's one-time **Executive Summary**, produced immediately after they completed their Business Foundation Assessment™. Summarize what you have LEARNED about them — do not simply repeat their answers. Use these six short sections, each introduced with a bold label on its own line:

**Welcome** — Acknowledge completion warmly.
**What I've Learned** — Synthesize their business stage, growth model, business model, size, and AI readiness.
**Current Strengths** — Highlight genuine positive patterns.
**Current Opportunities** — Present opportunities neutrally and kindly (delegation, systems, business knowledge, founder capacity, pricing, margin, etc.).
**My Coaching Priorities** — What you'll help them develop over time (reduce Founder Bottleneck Risk™, pricing confidence, delegation, AI adoption, protecting Time Freedom™).
**Closing** — Reassure them their Human Operating System and Business Operating System are now connected, and every recommendation will grow more personalized over time.

Keep the whole summary under ~300 words.`
}

function briefingInstruction(dayName: string): string {
  return `Write today's **Daily Executive Briefing** (it is ${dayName}). It must be readable in under one minute. Use these six short sections, each introduced with a bold label on its own line:

**Welcome** — Contextual greeting (use their first name if known, e.g. "Good afternoon, Barbara.").
**Human Check-In** — Reference this week's intention/reflection if available.
**Business Pulse** — Summarize only the 1-3 most meaningful current items (proposals, launches, meetings, onboarding). If nothing is known, offer a gentle prompt to share what's on their plate.
**Founder Insight** — ONE personalized coaching insight grounded in their data.
**Today's Focus** — Exactly ONE highest-leverage recommendation. Not a list.
**AI Augmentation™** — A one-sentence transition inviting them to identify what can be eliminated, systemized, automated, or delegated before today's CEO Workday.

Keep the whole briefing under ~220 words.`
}

/** Builds the natural-language context package handed to the model. */
function buildContextPackage(params: {
  memberName: string | null
  foundation: Record<string, unknown> | null
  realityCurrent: Record<string, unknown> | null
  realityPrevious: Record<string, unknown> | null
  memoryBlock: string
  remindersBlock: string
}): string {
  const { memberName, foundation, realityCurrent, realityPrevious, memoryBlock, remindersBlock } = params
  const lines: string[] = ["FOUNDER CONTEXT PACKAGE — use naturally, never read back as a list."]

  lines.push(`\nMember name: ${memberName ?? "Unknown (do not invent one)"}`)

  if (foundation) {
    lines.push("\nBUSINESS FOUNDATION™ (Business Blueprint):")
    const map: Array<[string, string]> = [
      ["Business identity", "business_identity"],
      ["Business stage", "business_stage"],
      ["Growth model", "growth_model"],
      ["Funding", "funding"],
      ["Revenue stage", "revenue_stage"],
      ["Revenue model", "revenue_model"],
      ["Business size", "business_size"],
      ["AI readiness", "ai_readiness"],
      ["Success vision", "founder_success_vision"],
    ]
    for (const [label, key] of map) {
      const v = foundation[key]
      if (v) lines.push(`- ${label}: ${v}`)
    }
    const arrays: Array<[string, string]> = [
      ["Business challenges", "business_challenges"],
      ["Business knowledge interests", "business_knowledge_interests"],
      ["Founder bottlenecks", "founder_bottlenecks"],
    ]
    for (const [label, key] of arrays) {
      const v = foundation[key]
      if (Array.isArray(v) && v.length > 0) lines.push(`- ${label}: ${v.join(", ")}`)
    }
    if (foundation.version) lines.push(`- Blueprint version: ${foundation.version}`)
  } else {
    lines.push("\nBUSINESS FOUNDATION™: Not yet completed.")
  }

  if (realityCurrent) {
    lines.push("\nWEEKLY REALITY CHECK™ (this week):")
    if (realityCurrent.overall_score != null) lines.push(`- Overall score: ${realityCurrent.overall_score}`)
    if (Array.isArray(realityCurrent.selected_priority_areas) && realityCurrent.selected_priority_areas.length)
      lines.push(`- Priority focus areas: ${(realityCurrent.selected_priority_areas as string[]).join(", ")}`)
    if (realityCurrent.operating_declaration)
      lines.push(`- Weekly intention: ${realityCurrent.operating_declaration}`)
    if (realityCurrent.weekly_reflection) lines.push(`- Weekly reflection: ${realityCurrent.weekly_reflection}`)
    if (realityPrevious?.overall_score != null && realityCurrent.overall_score != null) {
      const delta = (realityCurrent.overall_score as number) - (realityPrevious.overall_score as number)
      lines.push(`- Score change vs last week: ${delta >= 0 ? "+" : ""}${delta}`)
    }
  } else {
    lines.push("\nWEEKLY REALITY CHECK™: No recent check on file.")
  }

  if (memoryBlock) lines.push(`\n${memoryBlock}`)
  if (remindersBlock) lines.push(`\n${remindersBlock}`)

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const mode: "executive-summary" | "daily-briefing" =
      body?.mode === "executive-summary" ? "executive-summary" : "daily-briefing"

    if (!process.env.OPENAI_API_KEY) {
      // Graceful fallback so the UI always renders something warm.
      return NextResponse.json({
        mode,
        message:
          mode === "executive-summary"
            ? "**Welcome** — Your Business Foundation™ is saved. Once your coach connection is configured, I'll synthesize everything I've learned about you here."
            : "**Welcome** — Good afternoon. Your Daily Executive Briefing will appear here once your coach connection is configured. For now, take a breath and choose the one thing that would move your business forward today.",
      })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Assemble the live context package (best-effort; anonymous still works).
    let memberName: string | null = null
    let foundation: Record<string, unknown> | null = null
    let realityCurrent: Record<string, unknown> | null = null
    let realityPrevious: Record<string, unknown> | null = null
    let memoryBlock = ""
    let remindersBlock = ""

    if (user) {
      const [{ data: profile }, { data: foundationRow }, { data: realityRows }, memories] = await Promise.all([
        supabase.from("user_profiles").select("name").eq("id", user.id).maybeSingle(),
        supabase.from("business_foundations").select("*").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("reality_checks")
          .select(
            "overall_score, selected_priority_areas, operating_declaration, weekly_reflection, week_key",
          )
          .eq("user_id", user.id)
          .order("week_key", { ascending: false })
          .limit(2),
        loadMemories(supabase, user.id),
      ])

      memberName = (profile?.name as string) ?? null
      foundation = (foundationRow as Record<string, unknown>) ?? null
      realityCurrent = (realityRows?.[0] as Record<string, unknown>) ?? null
      realityPrevious = (realityRows?.[1] as Record<string, unknown>) ?? null
      memoryBlock = formatMemoryVault(memories)
      remindersBlock = formatUpcomingReminders(memories)
    }

    const contextPackage = buildContextPackage({
      memberName,
      foundation,
      realityCurrent,
      realityPrevious,
      memoryBlock,
      remindersBlock,
    })

    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" })
    const instruction = mode === "executive-summary" ? summaryInstruction() : briefingInstruction(dayName)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: VOICE_RULES },
          { role: "user", content: `${contextPackage}\n\n---\n\n${instruction}` },
        ],
        temperature: 0.7,
        max_tokens: 700,
      }),
    })

    if (!response.ok) {
      const details = await response.text()
      console.log("[v0] founder-os briefing OpenAI error:", response.status, details)
      return NextResponse.json({ error: "Failed to generate briefing" }, { status: response.status })
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content?.trim() || ""

    return NextResponse.json({ mode, message })
  } catch (error) {
    console.log("[v0] founder-os briefing error:", (error as Error)?.message)
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 })
  }
}
