import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { upsertMemories, type MemoryInput, type MemoryType } from "@/lib/cherry-blossom/memory"

/**
 * Cherry Blossom's Memory Vault™ writer.
 *
 * This endpoint runs *after* a chat reply (fire-and-forget from the client). It
 * makes one cheap extraction call to pull only meaningful, durable facts out of
 * the latest exchange and upserts them into `member_memory`. It never blocks the
 * conversation and silently no-ops for anonymous visitors or empty extractions.
 *
 * Guiding principle (from product): prioritize high-quality, meaningful memories
 * over quantity. Save a child's name, an anniversary, a planning preference, a
 * love of botanical gardens — not "ate a turkey sandwich."
 */

const VALID_TYPES: MemoryType[] = [
  "relationship",
  "important_date",
  "lifestyle_preference",
  "planning_preference",
  "work_life_preference",
  "ai_learning",
]

const EXTRACTION_SYSTEM_PROMPT = `You extract durable, meaningful long-term memories about a member from a single coaching exchange with Cherry Blossom (a work-life balance guide).

Return STRICT JSON of the shape:
{ "memories": [ { "memory_type": string, "memory_key": string, "memory_value": string, "confidence": "low"|"medium"|"high", "event_month": number|null, "event_day": number|null } ] }

memory_type must be one of:
- "relationship" — a person in their life. memory_key = relationship (e.g. "daughter", "spouse", "mentor"), memory_value = the person's name/details (e.g. "Ashley").
- "important_date" — a birthday, anniversary, vacation, holiday, conference, or speaking engagement. memory_key = short label (e.g. "Ashley's birthday", "Wedding anniversary"), memory_value = readable description. Set event_month (1-12) and event_day (1-31) when a specific calendar date is known; otherwise null.
- "lifestyle_preference" — favorite places/things (e.g. memory_key "favorite park", memory_value "Golden Gate Park").
- "work_life_preference" — how they like to live/work (e.g. memory_key "nature", memory_value "loves walking outdoors"; "family day", "Fridays are for family").
- "ai_learning" — a meaningful general insight about them worth remembering (e.g. memory_key "reading", memory_value "reads during lunch to unwind").

STRICT RULES:
- Only extract facts that will make FUTURE coaching more personal or useful.
- Do NOT extract trivia, one-off actions, moods, or anything with no future value (e.g. "ate a turkey sandwich", "wore a blue shirt", "felt tired today").
- Do NOT invent facts. Only use what the member clearly stated.
- Do NOT extract planning_preference here (that is captured separately by button choices).
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
    const { userMessage, assistantMessage } = body as {
      userMessage?: string
      assistantMessage?: string
    }

    if (!userMessage || userMessage === "WELCOME_MESSAGE") {
      return NextResponse.json({ saved: 0 })
    }

    const exchange = [
      `Member said: ${userMessage}`,
      assistantMessage ? `Cherry Blossom replied: ${assistantMessage}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")

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
          { role: "user", content: exchange },
        ],
        temperature: 0,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      console.log("[v0] remember extraction failed:", response.status)
      return NextResponse.json({ saved: 0 })
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content
    if (!raw) return NextResponse.json({ saved: 0 })

    let parsed: { memories?: unknown }
    try {
      parsed = JSON.parse(raw)
    } catch {
      console.log("[v0] remember: could not parse extraction JSON")
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
          source: "conversation",
          event_month: clamp(m.event_month, 1, 12),
          event_day: clamp(m.event_day, 1, 31),
        }),
      )
      .filter((m) => m.memory_key.length > 0 && m.memory_value.length > 0)

    const saved = await upsertMemories(supabase, user.id, memories)
    return NextResponse.json({ saved })
  } catch (error) {
    console.log("[v0] remember endpoint error:", (error as Error)?.message)
    return NextResponse.json({ saved: 0 })
  }
}
