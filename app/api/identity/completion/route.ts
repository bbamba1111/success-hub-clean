import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const REFLECTION_PROMPTS: Record<
  string,
  (ctx: Record<string, string | number | null>) => string
> = {
  "movement-window": (ctx) => `You are Cherry Blossom™, Barbara's warm AI guide for the Make Time For More™ community.

A member just completed their Movement Window™.
Status: ${ctx.completion_status}
Intended: ${ctx.intended_type || "movement"} for ${ctx.intended_duration || 30} minutes
Completed: ${ctx.actual_type || ctx.intended_type || "movement"} for ${ctx.actual_duration || ctx.intended_duration || 30} minutes
Notes: ${ctx.notes || "none"}

Write a 1-2 sentence Cherry Blossom™ reflection that:
- Acknowledges exactly what they did (honored / modified / missed — respond appropriately to each)
- For "honored": celebrates consistency as identity-building, not just a task completed
- For "modified": validates adaptation as wisdom, not failure; consistency > perfection
- For "not-completed": offers gentle compassion and forward momentum; tomorrow is another opportunity
- Feels personal, warm, and grounded — never generic

Output only the reflection text.`,

  "early-access": (ctx) => `You are Cherry Blossom™.

A member completed their Flex Time & Preparation™.
Status: ${ctx.completion_status}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences acknowledging how they showed up for their preparation time. Warm, personal, forward-looking.

Output only the reflection.`,

  "morning-given": (ctx) => `You are Cherry Blossom™.

A member completed their Morning GIV•EN™ Routine.
Status: ${ctx.completion_status}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences honoring their act of self-leadership this morning. Connect it to the quality of the day ahead.

Output only the reflection.`,

  "lunch-break": (ctx) => `You are Cherry Blossom™.

A member completed their Healthy Hybrid Lunch™.
Status: ${ctx.completion_status}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences celebrating their decision to nourish and restore. Connect it to their CEO Workday performance ahead.

Output only the reflection.`,

  "ceo-workday": (ctx) => `You are Cherry Blossom™.

A member completed their 4-Hour Focused CEO Workday™.
Status: ${ctx.completion_status}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences honoring the deep work they protected and completed today. Frame it as an act of strategic leadership.

Output only the reflection.`,

  "time-freedom": (ctx) => `You are Cherry Blossom™.

A member completed their Time Freedom™ window.
Status: ${ctx.completion_status}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences honoring that they stepped fully into their life — that they chose presence and held the boundary. Warm, affirming.

Output only the reflection.`,

  "power-down": (ctx) => `You are Cherry Blossom™.

A member completed their Power Down™ evening routine.
Status: ${ctx.completion_status}
Bedtime: ${ctx.bedtime || "not recorded"}
Notes: ${ctx.notes || "none"}

Write 1-2 sentences honouring how they closed the day with intention. Frame rest as tomorrow's strategic foundation.

Output only the reflection.`,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const {
    intention_id,
    segment_id,
    completion_status,
    actual_movement_type,
    actual_duration_mins,
    notes,
    bedtime,
    wake_time,
    sleep_quality,
    // context for reflection generation
    intended_type,
    intended_duration,
    // Phase 1: Check — the raw 4-state founder-facing value
    // (done | partial | not-yet | changed) alongside the mapped 3-state
    // completion_status the reflection prompts above already expect.
    founder_check_in_status,
  } = body

  if (!segment_id || !completion_status) {
    return new Response("segment_id and completion_status required", { status: 400 })
  }

  const promptFn = REFLECTION_PROMPTS[segment_id]
  if (!promptFn) {
    return new Response(`No reflection prompt for segment: ${segment_id}`, { status: 400 })
  }

  const systemPrompt = promptFn({
    completion_status,
    intended_type,
    intended_duration,
    actual_type: actual_movement_type,
    actual_duration: actual_duration_mins,
    notes,
    bedtime,
  })

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 120,
    temperature: 0.8,
    messages: [{ role: "system", content: systemPrompt }],
  })

  let fullReflection = ""
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ""
        if (delta) {
          fullReflection += delta
          controller.enqueue(encoder.encode(delta))
        }
      }
      controller.close()

      // Persist the completion record with the reflection
      const today = new Date().toISOString().split("T")[0]
      await supabase.from("segment_completions").insert({
        user_id: user.id,
        intention_id: intention_id ?? null,
        segment_id,
        segment_date: today,
        completion_status,
        actual_movement_type: actual_movement_type ?? null,
        actual_duration_mins: actual_duration_mins ?? null,
        notes: notes ?? null,
        bedtime: bedtime ?? null,
        wake_time: wake_time ?? null,
        sleep_quality: sleep_quality ?? null,
        cb_reflection: fullReflection.trim(),
        founder_check_in_status: founder_check_in_status ?? null,
      })
    },
  })

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const segment_id = searchParams.get("segment_id")
  const limit = parseInt(searchParams.get("limit") ?? "30", 10)

  let query = supabase
    .from("segment_completions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (segment_id) {
    query = query.eq("segment_id", segment_id)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ completions: data })
}
