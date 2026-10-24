/**
 * Business Articulation Training™ — API Route (Phase 4B)
 * ---------------------------------------------------------------------------
 * Five AI actions powering the full articulation coaching loop:
 *
 *   1. "understand"  — restate the core idea/objective/audience/key claims
 *                       so the founder can confirm or correct before anything
 *                       else is generated.
 *   2. "versions"    — 2-3 named, block-structured spoken versions (Direct /
 *                       Story-led / Problem-led), restructured for the
 *                       chosen duration, purpose, audience, and style.
 *   3. "strengthen"  — gap/support suggestions to insert into a chosen
 *                       version's block array at a specific position.
 *   4. "feedback"    — specific, actionable critique of the founder's
 *                       practice attempt, grounded in a client-computed
 *                       transcript diff summary.
 *   5. "challenge"   — optional, unscored "challenge my thinking" questions.
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
import type { ArticulationBlock } from "@/lib/articulation/types"

type ArticulationAction = "understand" | "versions" | "strengthen" | "feedback" | "challenge"

interface ArticulationRequestBody {
  action: ArticulationAction
  sourceTitle: string
  sourceKind: string
  sourceContent: string
  purpose: string
  audience: string
  communicationStyle?: string
  practiceLanguage?: string
  durationSeconds?: number
  /** Required for "strengthen" and "feedback" — the version's current blocks. */
  blocks?: ArticulationBlock[]
  /** Required for "feedback" — what the founder actually typed or spoke. */
  practiceAttempt?: string
  /** Required for "feedback" — client-computed transcript diff summary. */
  diffSummary?: string
  /** Optional for "understand" — passed through so it can inform the restatement. */
  understanding?: {
    coreIdea: string
    objective: string
    audienceSummary: string
    keyClaims: string[]
    assumptions: string[]
  }
}

function extractTagged(text: string, tag: string): string | null {
  const match = text.match(new RegExp(`\\[${tag}_START\\]([\\s\\S]*?)\\[${tag}_END\\]`))
  return match ? match[1].trim() : null
}

function parseJsonBlock<T>(text: string, tag: string): T | null {
  const raw = extractTagged(text, tag)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
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
    const { action, sourceTitle, sourceKind, sourceContent, purpose, audience, communicationStyle, practiceLanguage } =
      body

    if (!["understand", "versions", "strengthen", "feedback", "challenge"].includes(action)) {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 })
    }
    if (!sourceTitle || !sourceContent || !purpose || !audience) {
      return NextResponse.json({ error: "Missing required source context." }, { status: 400 })
    }

    const style = getCommunicationStyle(communicationStyle)
    const styleInstruction = `Communication Style™: use the "${style.name}" register — ${style.description} Preferred vocabulary: ${style.preferredVocabulary} Preferred examples: ${style.preferredExamples} This affects vocabulary, tone, explanation depth, and examples ONLY — never the underlying business meaning of the source.`
    const languageInstruction = practiceLanguage && practiceLanguage !== "en" ? `Write all spoken/output text in ${practiceLanguage}. Field names and JSON keys stay in English.` : ""
    const antiFabricationRule =
      "Never invent statistics, quotes, or attributions that are not present in the source content. If a supporting statistic or quote would help but none exists in the source, say so as a suggestion for the founder to find their own — do not fabricate one."

    let systemPrompt: string
    let userPrompt: string

    if (action === "understand") {
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. Restate the founder's real work back to them, plainly, so they can confirm you both understand the same thing before anything is generated. ${antiFabricationRule}

Output STRICTLY as JSON inside tags, no other text:
[UNDERSTANDING_START]
{"coreIdea": "one sentence", "objective": "one sentence — what should happen as a result of saying this", "audienceSummary": "one sentence on what this specific audience cares about here", "keyClaims": ["claim 1", "claim 2"], "assumptions": ["assumption 1"]}
[UNDERSTANDING_END]`
      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}\n\nCONTENT:\n${sourceContent}\n\nPURPOSE: ${purpose}\nAUDIENCE: ${audience}`
    } else if (action === "versions") {
      const duration = body.durationSeconds ?? 60
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. Produce 2-3 distinct, founder-ready SPOKEN versions of the same underlying content — each RESTRUCTURED (not just truncated or padded) to fit approximately ${duration} seconds of natural speech (roughly ${Math.max(1, Math.round(duration / 2.5))}-${Math.round(duration / 1.8)} words per version). Each version breaks the message into an ordered sequence of typed blocks. Use only blocks that genuinely help — usually 3-6 blocks per version, not more.

Block types: spoken, pause, statistic, evidence, quote, story, example, question, audience-interaction, transition, emphasis, objection-response, call-to-action, ask.

${antiFabricationRule}
${styleInstruction}
${languageInstruction}

Output STRICTLY as JSON inside tags, no other text before/after:
[VERSIONS_START]
[{"name": "Direct", "approach": "direct", "blocks": [{"type": "spoken", "content": "...", "rationale": "why this line/order"}]}, {"name": "Story-led", "approach": "story-led", "blocks": [...]}]
[VERSIONS_END]`
      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}\n\nCONTENT:\n${sourceContent}\n\nPURPOSE: ${purpose}\nAUDIENCE: ${audience}\nTARGET DURATION: ${duration} seconds`
    } else if (action === "strengthen") {
      if (!body.blocks || body.blocks.length === 0) {
        return NextResponse.json({ error: "blocks are required for strengthen." }, { status: 400 })
      }
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. Review this spoken version's blocks and suggest 1-4 SPECIFIC gap or support insertions — a missing statistic slot, a supporting example, a transition that would smooth the flow, an objection response, a stronger call to action, etc. Each suggestion names exactly where it goes (after which existing block id) and exactly what content to insert. ${antiFabricationRule}
${languageInstruction}

Output STRICTLY as JSON inside tags, no other text:
[SUGGESTIONS_START]
[{"what": "short label", "where": "e.g. after the problem statement", "why": "one sentence", "blockType": "statistic", "insertAfterBlockId": "<an id from the provided blocks, or null for the start>", "content": "the actual suggested block content"}]
[SUGGESTIONS_END]`
      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}\n\nCONTENT:\n${sourceContent}\n\nPURPOSE: ${purpose}\nAUDIENCE: ${audience}\n\nCURRENT BLOCKS:\n${JSON.stringify(
        body.blocks.map((b) => ({ id: b.id, type: b.type, content: b.content })),
      )}`
    } else if (action === "challenge") {
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. Generate 3-5 tough, specific "challenge my thinking" questions a skeptical listener might actually ask about this content — not generic questions. These are for the founder's own private reflection, not scored, not shared. ${antiFabricationRule}

Output STRICTLY as JSON inside tags, no other text:
[CHALLENGE_START]
["question 1", "question 2", "question 3"]
[CHALLENGE_END]`
      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}\n\nCONTENT:\n${sourceContent}\n\nPURPOSE: ${purpose}\nAUDIENCE: ${audience}`
    } else {
      // feedback
      if (!body.blocks || body.blocks.length === 0 || !body.practiceAttempt) {
        return NextResponse.json({ error: "blocks and practiceAttempt are required for feedback." }, { status: 400 })
      }
      const expectedText = body.blocks.map((b) => b.content).join(" ")
      systemPrompt = `You are a business articulation coach inside the Harmony Lane™ Operating System. The founder just attempted, out loud or in writing, to communicate real work they are doing. Compare their attempt against the intended version, the source, AND the provided transcript-diff summary (which tells you exactly what was skipped or added), then give SPECIFIC, ACTIONABLE feedback.

Evaluate: clarity, logical order, completeness, repetition, audience fit, business terminology, persuasiveness, directness, whether the main point is easy to understand, and whether the explanation supports the intended outcome. Reference the diff summary directly when it shows something meaningful (e.g. "you skipped the statistic block — that's the piece giving this its credibility").

Do NOT give vague praise or vague criticism. Do NOT produce a numeric score. Do NOT be harsh — be direct and useful. Keep it to 2-5 sentences.
${styleInstruction}
${languageInstruction}

Output STRICTLY in this format, with no other text before, after, or between the block markers:
[FEEDBACK_START]
<2-5 sentences of specific, actionable feedback>
[FEEDBACK_END]`
      userPrompt = `SOURCE (${sourceKind}): ${sourceTitle}\n\nCONTENT:\n${sourceContent}\n\nPURPOSE: ${purpose}\nAUDIENCE: ${audience}\n\nINTENDED VERSION:\n${expectedText}\n\nFOUNDER'S PRACTICE ATTEMPT:\n${body.practiceAttempt}\n\nTRANSCRIPT DIFF SUMMARY:\n${body.diffSummary ?? "Not available — typed practice, exact match assumed."}\n\nGive specific, actionable feedback on this attempt.`
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
        max_tokens: 1400,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json({ error: "Failed to get a response. Please try again." }, { status: response.status })
    }

    const data = await response.json()
    const text: string = data.choices[0]?.message?.content || ""

    if (action === "understand") {
      const understanding = parseJsonBlock<{
        coreIdea: string
        objective: string
        audienceSummary: string
        keyClaims: string[]
        assumptions: string[]
      }>(text, "UNDERSTANDING")
      if (!understanding) {
        return NextResponse.json({ error: "Couldn't generate understanding. Please try again." }, { status: 502 })
      }
      return NextResponse.json({ understanding })
    }

    if (action === "versions") {
      const rawVersions = parseJsonBlock<
        { name: string; approach: string; blocks: { type: string; content: string; rationale?: string }[] }[]
      >(text, "VERSIONS")
      if (!rawVersions || rawVersions.length === 0) {
        return NextResponse.json({ error: "Couldn't generate versions. Please try again." }, { status: 502 })
      }
      const versions = rawVersions.map((v) => ({
        id: makeId("version"),
        name: v.name,
        approach: v.approach,
        blocks: v.blocks.map((b) => ({
          id: makeId("block"),
          type: b.type,
          content: b.content,
          source: "ai" as const,
          rationale: b.rationale,
        })),
      }))
      return NextResponse.json({ versions })
    }

    if (action === "strengthen") {
      const rawSuggestions = parseJsonBlock<
        { what: string; where: string; why: string; blockType: string; insertAfterBlockId: string | null; content: string }[]
      >(text, "SUGGESTIONS")
      if (!rawSuggestions) {
        return NextResponse.json({ error: "Couldn't generate suggestions. Please try again." }, { status: 502 })
      }
      const suggestions = rawSuggestions.map((s) => ({ id: makeId("suggestion"), ...s }))
      return NextResponse.json({ suggestions })
    }

    if (action === "challenge") {
      const questions = parseJsonBlock<string[]>(text, "CHALLENGE")
      if (!questions) {
        return NextResponse.json({ error: "Couldn't generate questions. Please try again." }, { status: 502 })
      }
      return NextResponse.json({ questions })
    }

    // feedback
    const feedback = extractTagged(text, "FEEDBACK") ?? text.trim()
    if (!feedback) {
      return NextResponse.json({ error: "Couldn't generate feedback. Please try again." }, { status: 502 })
    }
    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("[v0] Error in articulation-practice API:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
