import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Per-segment system prompt templates for Cherry Blossom™ declarations
const DECLARATION_PROMPTS: Record<string, (ctx: Record<string, string>) => string> = {
  "early-access": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their Flex Time & Preparation™ segment today.

Their intention: ${ctx.intention_notes || "to prepare intentionally for their day"}

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Be identity-based, not task-based (who they are becoming, not what they're doing)
- Feel warm, grounding, and empowering
- Connect Flex Time™ to their larger purpose as a founder or leader
- Never sound generic or motivational-poster-ish

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "morning-given": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their Morning GIV•EN™ Routine today.

Their intention: ${ctx.intention_notes || "to lead themselves before leading their business"}

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Anchor the morning ritual as an act of self-leadership, not discipline
- Reference the GIV•EN™ framework lightly if natural (Gratitude, Invitation, Vision, Emotional Embodiment, Nurture)
- Feel sacred and personal, not corporate or performative

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "movement-window": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their 30-Minute Movement Window™.

Movement type: ${ctx.movement_type || "movement"}
Duration: ${ctx.duration_minutes || 30} minutes

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Honor the body as the vehicle for their vision
- Connect this movement specifically to their chosen type and duration
- Frame consistency (not intensity) as the identity they are building
- Feel energizing yet grounded

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "lunch-break": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their Extended Healthy Hybrid Lunch™.

Their intention: ${ctx.intention_notes || "to nourish and restore"}

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Affirm nourishment and rest as productive, not indulgent
- Connect the lunch break to their CEO Workday™ performance
- Sound like a person who genuinely takes care of themselves

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "ceo-workday": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their 4-Hour Focused CEO Workday™.

Their intention: ${ctx.intention_notes || "to lead with focus and protect their Human Zone of Genius™"}

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Frame the CEO Workday™ as an act of strategic leadership, not just productivity
- Reference their Human Zone of Genius™ — what only they can do
- Project executive confidence and clarity

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "time-freedom": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member entering their Time Freedom™ window.

Their intention: ${ctx.intention_notes || "to be fully present in their life"}

Write 2-4 sentences in first person ("Today I..."). The declaration should:
- Honor the decision to put work down as a disciplined act of self-respect
- Affirm presence with people, passions, or rest — not achievement
- Feel like a sigh of relief and deep personal meaning

Output only the declaration text. No quotes, no labels, no extra commentary.`,

  "power-down": (ctx) => `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

Generate a single personalized identity-based declaration for a member beginning their Power Down™ evening routine.

Their intention: ${ctx.intention_notes || "to close the day with intention and prepare for restorative rest"}

Write 2-4 sentences in first person ("Tonight I..."). The declaration should:
- Honor the day without cataloguing it
- Frame sleep and rest as a strategic investment in tomorrow
- Feel like a gentle, earned release at the end of a full day

Output only the declaration text. No quotes, no labels, no extra commentary.`,
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const { intention_id, segment_id, movement_type, duration_minutes, intention_notes } = body

  if (!intention_id || !segment_id) {
    return new Response("intention_id and segment_id required", { status: 400 })
  }

  const promptFn = DECLARATION_PROMPTS[segment_id]
  if (!promptFn) {
    return new Response(`No declaration prompt for segment: ${segment_id}`, { status: 400 })
  }

  const systemPrompt = promptFn({ movement_type, duration_minutes, intention_notes })

  // Stream the declaration from OpenAI
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 200,
    temperature: 0.85,
    messages: [{ role: "system", content: systemPrompt }],
  })

  // Collect the full text while streaming to the client
  let fullText = ""
  const encoder = new TextEncoder()

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ""
        if (delta) {
          fullText += delta
          controller.enqueue(encoder.encode(delta))
        }
      }
      controller.close()

      // Persist the full declaration once streaming is complete
      const today = new Date().toISOString().split("T")[0]
      await supabase.from("segment_declarations").insert({
        user_id: user.id,
        intention_id,
        segment_id,
        segment_date: today,
        declaration: fullText.trim(),
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
