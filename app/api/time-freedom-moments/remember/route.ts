import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertMemories, type MemoryInput, type MemoryType } from "@/lib/cherry-blossom/memory"

/**
 * Cherry Blossom's Memory Vault™ writer for Time Freedom Moments™.
 *
 * Runs fire-and-forget from the client after a member shares a Moment. It makes
 * one cheap extraction call over the caption (plus the day it was shared) to
 * learn durable, meaningful things about how the member spends their expanded
 * life — favorite activities, the people they love, places they return to,
 * travel, and celebrations — then upserts them into `member_memory`.
 *
 * It never blocks sharing and silently no-ops for anonymous visitors, empty
 * captions, or empty extractions. Guiding principle: prioritize a few
 * high-quality memories ("hikes with her daughter Ashley on Saturdays") over
 * quantity ("posted a photo").
 */

const VALID_TYPES: MemoryType[] = [
  "relationship",
  "important_date",
  "lifestyle_preference",
  "work_life_preference",
  "ai_learning",
]

const EXTRACTION_SYSTEM_PROMPT = `You extract durable, meaningful long-term memories about a member from a single "Time Freedom Moment" they shared — a short caption describing how they spent time away from work (family, hobbies, travel, rest, celebrations, nature, friends).

Return STRICT JSON of the shape:
{ "memories": [ { "memory_type": string, "memory_key": string, "memory_value": string, "confidence": "low"|"medium"|"high", "event_month": number|null, "event_day": number|null } ] }

memory_type must be one of:
- "relationship" — a person in their life. memory_key = relationship (e.g. "daughter", "spouse", "best friend"), memory_value = the person's name/details (e.g. "Ashley").
- "important_date" — a birthday, anniversary, vacation, holiday, or recurring celebration tied to a specific date. memory_key = short label (e.g. "Anniversary trip to Maui"), memory_value = readable description. Set event_month (1-12) and event_day (1-31) only when a specific calendar date is clearly stated; otherwise null.
- "lifestyle_preference" — favorite activities, places, or things they return to (e.g. memory_key "favorite hike", memory_value "Marin headlands"; memory_key "hobby", memory_value "pottery").
- "work_life_preference" — how they like to spend their Time Freedom (e.g. memory_key "weekends", memory_value "reserved for family"; memory_key "mornings", memory_value "long walks by the water").
- "ai_learning" — a meaningful general insight worth remembering (e.g. memory_key "renewal", memory_value "feels most restored near the ocean").

STRICT RULES:
- Only extract facts that will make FUTURE coaching more personal or that let you warmly recall this moment later.
- Do NOT extract trivia, one-off details, moods, or anything with no future value (e.g. "the weather was nice", "wore sandals").
- Do NOT invent facts. Only use what the caption clearly states or strongly implies.
- Prefer fewer, higher-quality memories. It is completely fine to return an empty list.
- Keep memory_key short (a few words). Keep memory_value concise.
- If nothing meaningful was shared, return { "memories": [] }.`

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ saved: 0 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Only signed-in members have a Memory Vault.
    if (!user) return NextResponse.json({ saved: 0 })

    const body = await req.json()
    const { caption, dayTheme } = body as { caption?: string; dayTheme?: string }

    const text = (caption ?? "").trim()
    // Nothing to learn from an empty or trivially short caption.
    if (text.length < 8) {
      return NextResponse.json({ saved: 0 })
    }

    const moment = [
      dayTheme ? `Shared during: ${dayTheme}` : "",
      `Time Freedom Moment caption: ${text}`,
    ]
      .filter(Boolean)
      .join("\n")

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: moment },
        ],
        temperature: 0,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      console.log("[v0] moments remember extraction failed:", response.status)
      return NextResponse.json({ saved: 0 })
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content
    if (!raw) return NextResponse.json({ saved: 0 })

    let parsed: { memories?: unknown }
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.log("[v0] moments remember: could not parse extraction JSON")
      return NextResponse.json({ saved: 0 })
    }

    const candidates = Array.isArray(parsed.memories) ? parsed.memories : []
    const clamp = (n: unknown, min: number, max: number): number | null => {
      const v = typeof n === "number" ? n : Number(n)
      if (!Number.isFinite(v)) return null
      const r = Math.round(v)
      return r >= min && r <= max ? r : null
    }

    const memories: MemoryInput[] = candidates
      .filter((m): m is Record<string, unknown> => typeof m === "object" && m !== null)
      .filter((m) => VALID_TYPES.includes(m.memory_type as MemoryType))
      .map(
        (m): MemoryInput => ({
          memory_type: m.memory_type as MemoryType,
          memory_key: String(m.memory_key ?? "").trim(),
          memory_value: String(m.memory_value ?? "").trim(),
          confidence:
            m.confidence === "low" || m.confidence === "high" ? (m.confidence as "low" | "high") : "medium",
          source: "time_freedom_moment",
          event_month: clamp(m.event_month, 1, 12),
          event_day: clamp(m.event_day, 1, 31),
        }),
      )
      .filter((m) => m.memory_key.length > 0 && m.memory_value.length > 0)

    const saved = await upsertMemories(supabase, user.id, memories)
    return NextResponse.json({ saved })
  } catch (error) {
    console.log("[v0] moments remember endpoint error:", (error as Error)?.message)
    return NextResponse.json({ saved: 0 })
  }
}
