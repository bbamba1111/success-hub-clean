/**
 * Business Articulation Training™ — API Route (Phase 4 MVP)
 * ---------------------------------------------------------------------------
 * Powers the two AI steps of the articulation practice loop:
 *
 *   1. "recommend" — given a source work item's real content, determine the
 *      best information order and produce a founder-ready spoken version.
 *   2. "feedback"  — given the founder's typed/spoken practice attempt,
 *      return specific, actionable feedback (no numeric score).
 *
 * Follows the exact proven, non-streaming pattern from
 * app/api/business-asset-build/route.ts: a server route calling OpenAI
 * directly via fetch with the existing OPENAI_API_KEY. This is a SEPARATE,
 * narrow endpoint — it does NOT read or write CommunicationPackage,
 * BusinessAssetBuildRecord, or any new table. Nothing is persisted; every
 * practice session is ephemeral, as approved.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCommunicationStyle } from "@/lib/business-comprehension/business-comprehension"

type ArticulationAction = "recommend" | "feedback"

interface ArticulationRequestBody {
  action: ArticulationAction
  sourceTitle: string
  sourceKind: string
  sourceContent: string
  purpose: string
  audience: string
  communicationStyle?: string
  /** Required for action "feedback" — the version the founder was practicing against. */
  recommendedSpokenVersion?: string
  /** Required for action "feedback" — what the founder actually typed or spoke. */
  practiceAttempt?: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "You must be signed in to practice this." }, { status: 401 })
    }

    const body: ArticulationRequestBody = await req.json()
    const { action, sourceTitle, sourceKind, sourceContent, purpose, audience, communicationStyle } = body

    if (action !== "recommend" && action !== "feedback") {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 })
    }
    if (!sourceTitle || !sourceContent || !purpose || !audience) {
      return NextResponse.json({ error: "Missing required source context." }, { status: 400 })
    }

    const style = getCommunicationStyle(communicationStyle)

    const styleInstruction = `Communication Style™: use the "${style.name}" register — ${style.description} Preferred vocabulary: ${style.preferredVocabulary} Preferred examples: ${style.preferredExamples} This affects vocabulary, tone, explanation depth, and examples ONLY — never the underlying business meaning of the source.`

    let systemPrompt: string
    let userPrompt: string

    if (action === "recommend") {
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. A founder needs to communicate real work they are currently doing — out loud, to a real person. Your job has two parts:

1. Decide the most effective information sequence for THIS specific source, audience, and purpose. Do not mechanically use every possible section. Choose only what's appropriate from: context, problem, insight, decision, recommendation, rationale, consequence, action/ask — in whatever order actually serves this specific communication. Usually 3-5 steps is right, not 8.

2. Write a founder-ready SPOKEN version — words a capable founder would actually say out loud. Clear, intelligent, direct, persuasive, and business-credible. Do NOT write inflated executive jargon and do NOT write a formal document — this is something a person says in a room or on a call.

${styleInstruction}

Output STRICTLY in this format, with no other text before, after, or between the two blocks:
[ORDER_START]
- <Step label>: <one short sentence on why this step comes here>
- <Step label>: <one short sentence on why this step comes here>
(3-5 lines total, no more)
[ORDER_END]
[SPOKEN_START]
<the full spoken version, as natural paragraphs, no headers, no bullet points>
[SPOKEN_END]`

      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}

WHAT THE FOUNDER IS COMMUNICATING:
${sourceContent}

PURPOSE: ${purpose}
AUDIENCE: ${audience}

Determine the best information order and write the recommended spoken version.`
    } else {
      if (!body.recommendedSpokenVersion || !body.practiceAttempt) {
        return NextResponse.json(
          { error: "recommendedSpokenVersion and practiceAttempt are required for feedback." },
          { status: 400 },
        )
      }

      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. The founder just attempted, out loud or in writing, to communicate real work they are doing. Compare their attempt against the recommended version and the source, then give SPECIFIC, ACTIONABLE feedback.

Evaluate: clarity, logical order, completeness, repetition, audience fit, business terminology, persuasiveness, directness, whether the main point is easy to understand, and whether the explanation supports the intended outcome.

Do NOT give vague praise or vague criticism like "be more confident." Instead, name the SPECIFIC thing that worked or didn't, and say exactly what to do differently, e.g.: "You introduced the solution before establishing the business consequence. For this audience, state the consequence first, then explain the change."

Do NOT produce a numeric score. Do NOT be harsh — be direct and useful. Keep it to 2-5 sentences.

${styleInstruction}

Output STRICTLY in this format, with no other text before, after, or between the block markers:
[FEEDBACK_START]
<2-5 sentences of specific, actionable feedback>
[FEEDBACK_END]`

      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}

WHAT THE FOUNDER IS COMMUNICATING:
${sourceContent}

PURPOSE: ${purpose}
AUDIENCE: ${audience}

RECOMMENDED SPOKEN VERSION:
${body.recommendedSpokenVersion}

FOUNDER'S PRACTICE ATTEMPT:
${body.practiceAttempt}

Give specific, actionable feedback on this attempt.`
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 700,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json({ error: "Failed to get a response. Please try again." }, { status: response.status })
    }

    const data = await response.json()
    const text: string = data.choices[0]?.message?.content || ""

    if (action === "recommend") {
      const orderMatch = text.match(/\[ORDER_START\]([\s\S]*?)\[ORDER_END\]/)
      const spokenMatch = text.match(/\[SPOKEN_START\]([\s\S]*?)\[SPOKEN_END\]/)

      const recommendedOrder = orderMatch
        ? orderMatch[1]
            .split("\n")
            .map((line) => line.replace(/^[\s-]+/, "").trim())
            .filter(Boolean)
        : []
      const recommendedSpokenVersion = spokenMatch ? spokenMatch[1].trim() : text.trim()

      if (!recommendedSpokenVersion) {
        return NextResponse.json({ error: "Couldn't generate a recommendation. Please try again." }, { status: 502 })
      }

      return NextResponse.json({ recommendedOrder, recommendedSpokenVersion })
    }

    const feedbackMatch = text.match(/\[FEEDBACK_START\]([\s\S]*?)\[FEEDBACK_END\]/)
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : text.trim()

    if (!feedback) {
      return NextResponse.json({ error: "Couldn't generate feedback. Please try again." }, { status: 502 })
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("[v0] Error in articulation-practice API:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
