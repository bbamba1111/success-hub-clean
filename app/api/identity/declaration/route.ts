import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"
import { SEGMENT_DISPLAY_NAMES } from "@/lib/founder-opportunities/segment-options"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Phase 1: Decide → Embody. Builds a generic, non-per-segment-hardcoded
 * identity declaration prompt from a founder-chosen opportunity area + the
 * action they decided to take, regardless of which segment they forward it
 * to. Used only when the request carries opportunity context — every other
 * caller (e.g. a remounted IdentityInstallationPanel) keeps using the
 * per-segment DECLARATION_PROMPTS below unchanged.
 */
function buildOpportunityDeclarationPrompt(ctx: {
  opportunity_area: string
  chosen_action: string
  segment_id: string
}): string {
  const segmentName = SEGMENT_DISPLAY_NAMES[ctx.segment_id] ?? "today's Time & Space Boundary™"
  return `You are Cherry Blossom™, Barbara's warm and empowering AI guide for the Make Time For More™ community.

A founder identified "${ctx.opportunity_area}" as an area they want to focus on today, and decided on this action:
"${ctx.chosen_action}"

They will carry out this action during their ${segmentName}.

Generate a single personalized identity-based declaration, written in first person ("As someone who values..., I will..."), that:
- Names the value or identity behind their chosen focus area (not the score, not "opportunity")
- States their specific chosen action in their own words
- Names the segment (${segmentName}) naturally, once
- Is 1-2 sentences, warm, grounding, and never generic or motivational-poster-ish

Output only the declaration text. No quotes, no labels, no extra commentary.`
}

/**
 * Short, first-person "why this matters" companion to the declaration above.
 * Non-streaming — generated once, after the declaration, and appended to the
 * response after a delimiter so the client can split it out without a second
 * round-trip.
 */
function buildWhyItMattersPrompt(ctx: { opportunity_area: string; chosen_action: string }): string {
  return `You are Cherry Blossom™, Barbara's warm AI guide for the Make Time For More™ community.

A founder decided to do the following today: "${ctx.chosen_action}" — to make progress on "${ctx.opportunity_area}".

Write 1-2 first-person sentences explaining why this specific action matters, in plain, concrete, encouraging language.

Requirements:
- First person ("This matters because...")
- Specific to the chosen action, not a generic wellness lecture
- Concise and evidence-informed
- No unsupported medical claims

Output only the explanation text.`
}

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
  const {
    intention_id,
    segment_id,
    movement_type,
    duration_minutes,
    intention_notes,
    // Phase 1: Decide → Embody — present only when the founder started from
    // the opportunity picker. intention_notes doubles as the chosen action.
    opportunity_area,
  } = body

  if (!intention_id || !segment_id) {
    return new Response("intention_id and segment_id required", { status: 400 })
  }

  const isOpportunityDeclaration = Boolean(opportunity_area && intention_notes)

  const systemPrompt = isOpportunityDeclaration
    ? buildOpportunityDeclarationPrompt({
        opportunity_area,
        chosen_action: intention_notes,
        segment_id,
      })
    : DECLARATION_PROMPTS[segment_id]?.({ movement_type, duration_minutes, intention_notes })

  if (!systemPrompt) {
    return new Response(`No declaration prompt for segment: ${segment_id}`, { status: 400 })
  }

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
  const WHY_DELIMITER = "\n\n---WHY---\n\n"

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? ""
        if (delta) {
          fullText += delta
          controller.enqueue(encoder.encode(delta))
        }
      }

      const declaration = fullText.trim()

      // Educate: one short, non-streaming follow-up call for "why this
      // matters," only for opportunity-originated declarations.
      let whyItMatters = ""
      if (isOpportunityDeclaration) {
        try {
          const whyCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 120,
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content: buildWhyItMattersPrompt({ opportunity_area, chosen_action: intention_notes }),
              },
            ],
          })
          whyItMatters = whyCompletion.choices[0]?.message?.content?.trim() ?? ""
          if (whyItMatters) {
            controller.enqueue(encoder.encode(WHY_DELIMITER + whyItMatters))
          }
        } catch (error) {
          console.error("[identity/declaration] why-it-matters generation failed:", error)
        }
      }

      controller.close()

      // Persist the full declaration (and why-it-matters, if generated) once
      // streaming is complete.
      const today = new Date().toISOString().split("T")[0]
      await supabase.from("segment_declarations").insert({
        user_id: user.id,
        intention_id,
        segment_id,
        segment_date: today,
        declaration,
        why_it_matters: whyItMatters || null,
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
