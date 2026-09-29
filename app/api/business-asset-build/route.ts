/**
 * Live AI Build™ — API Route (Phase 12.2 proof of concept)
 * ---------------------------------------------------------------------------
 * Powers a REAL, live AI conversation for building a Business Asset™ — used
 * by "Build With AI", "Let AI Do It", and "Do It Myself" modes (the only
 * difference is how directive, autonomous, or Socratic the system prompt
 * asks the model to be).
 *
 * Follows the exact proven pattern from app/api/cherry-blossom-chat/route.ts:
 * a server route calling OpenAI directly via fetch with the existing
 * OPENAI_API_KEY, no streaming. This is a SEPARATE endpoint from Cherry
 * Blossom's own chat — her engine, memory vault, and system prompt are not
 * touched. This route reuses the SAME Communication Styles™ content already
 * authored in business-asset-registry.ts as the adaptive-language contract.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getBusinessAsset } from "@/lib/business-asset-library/business-asset-registry"
import { isLiveAiBuildAvailable } from "@/lib/business-asset-library/live-build"
import { getCommunicationStyle } from "@/lib/business-comprehension/business-comprehension"
import { getExecutive } from "@/lib/executive-team/executive-registry"
import type { BuildModeId } from "@/lib/business-asset-library/build-modes"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
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
      return NextResponse.json({ error: "You must be signed in to build this asset." }, { status: 401 })
    }

    const body = await req.json()
    const {
      assetId,
      buildMode,
      message,
      messages = [],
      communicationStyle,
      fieldValues = [],
    }: {
      assetId: string
      buildMode: BuildModeId
      message: string
      messages: ChatMessage[]
      communicationStyle?: string
      /** Current contents of the founder's structured template fields, in guided-step order — the live workspace the founder sees alongside this chat. */
      fieldValues?: (string | null | undefined)[]
    } = body

    if (!assetId || !isLiveAiBuildAvailable(assetId)) {
      return NextResponse.json({ error: "Live AI build is not available for this asset yet." }, { status: 400 })
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const asset = getBusinessAsset(assetId)
    if (!asset) {
      return NextResponse.json({ error: "Unknown Business Asset." }, { status: 404 })
    }

    const ownerExecutive = getExecutive(asset.ownerExecutiveIds[0])
    const executiveName = ownerExecutive?.name ?? "Your Executive Team™"
    const style = getCommunicationStyle(communicationStyle)

    const isAutonomous = buildMode === "let-ai-do-it"
    const isGuidedDiy = buildMode === "guided-diy"

    const modeInstruction =
      buildMode === "build-with-ai"
        ? "The founder chose Build With AI: be directive. Ask one focused question at a time, then draft language FOR them based on their answer, and let them refine it. Do most of the writing yourself."
        : isAutonomous
          ? `The founder chose Let AI Do It: be maximally autonomous. Do NOT walk through the guided steps one at a time — that pacing is for the other modes only. As soon as the founder has given you ANY real information about their business (even a single sentence), immediately write a complete first draft covering all the guided steps below in one shot, filling every gap with sound, reasonable, clearly-labeled assumptions instead of asking a question. Only ask a clarifying question first if the founder's very first message is empty, off-topic, or contains literally nothing usable — and even then, ask at most ONE question before drafting. The moment you produce that complete draft, wrap it in [FINAL_DRAFT_START]/[FINAL_DRAFT_END] in the SAME response — do not wait for a confirmation round-trip. After delivering it, invite them to tell you what to change.`
          : "The founder chose Do It Myself, guided: be Socratic. Ask one focused question at a time and coach them to write their OWN answer, in their own words, directly into the matching Builder Step. Do not draft Builder Step content for them unprompted — only offer a suggested version of a specific Builder Step if they explicitly say they're stuck and ask for help with that step."

    const guidedSteps = asset.instructions[style.id] ?? asset.instructions.business_owner

    // The founder sees these guided steps as real, editable "Builder Steps"
    // in a structured template alongside this chat — never as a plain
    // checklist buried in the conversation, and NEVER as "Field N" (that's
    // internal machine syntax only — see the [FIELD:n] tag below, which the
    // app strips before the founder ever sees it). `n` is the 0-based index
    // the [FIELD:n] tag must use to target the matching Builder Step.
    const fieldList = guidedSteps.map((step, i) => `Builder Step ${i + 1} [FIELD:${i}]: ${step}`).join("\n")

    const normalizedFieldValues = guidedSteps.map((_, i) => {
      const v = fieldValues[i]
      return typeof v === "string" && v.trim() ? v.trim() : null
    })
    const hasAnyFieldValue = normalizedFieldValues.some(Boolean)
    const fieldStateBlock = hasAnyFieldValue
      ? `\n\nCurrent contents of the founder's Builder Steps right now (the founder can also edit these directly, independent of this chat):\n${normalizedFieldValues
          .map((v, i) => `Builder Step ${i + 1}: ${v ?? "(empty)"}`)
          .join("\n")}`
      : ""

    const fieldTagInstruction = isGuidedDiy
      ? `You do NOT write Builder Step content unprompted in this mode — the founder types their own answers directly into their Builder Steps. Only emit a [FIELD:n]...[/FIELD] tag (n = the field index shown above in brackets, e.g. "[FIELD:2]") if the founder explicitly asks you to suggest or improve the wording for that specific Builder Step; they will still choose whether to accept it.`
      : `As soon as you have drafted or refined the content for a specific Builder Step — even one at a time, well before the whole asset is done — wrap ONLY that step's text in [FIELD:n]...[/FIELD] (n = the field index shown above in brackets, e.g. "[FIELD:2]") so it appears live in the founder's Builder Step. Do this every time you draft or improve a Builder Step's content, not just once at the end. Never mention "[FIELD:n]" or the word "field" to the founder — always call these "Builder Steps" in your own words.`

    const systemPrompt = `You are the ${executiveName}, one of the founder's AI Executive Team™ inside the Harmony Lane™ Operating System.

You are guiding the founder through building their "${asset.name}" — ${asset.whatIsThis}

Why this matters: ${asset.whyItMatters}

${modeInstruction}

Communication Style™: respond in the "${style.name}" register — ${style.description} Preferred vocabulary: ${style.preferredVocabulary} Preferred examples: ${style.preferredExamples}

The founder is looking at a structured template with one editable "Builder Step" per guided step below, sitting right next to this chat — it is the actual workspace, not just a talking point. Ground the conversation in these Builder Steps${isAutonomous ? " (make sure your draft covers all of them, but write them into flowing prose — do not present this as a checklist to the founder)" : " (cover them in order, one at a time, in your own words — do not just recite this list)"}. Always call these "Builder Steps" when speaking with the founder — never say the word "field" or "Field N":
${fieldList}${fieldStateBlock}

${fieldTagInstruction}

Formatting: do NOT use markdown headers (***, **, *, ###, ##, #). Use bold text (**text**) for emphasis instead. Keep responses warm, concise, and conversational — this is a chat, not a document.

${
  isAutonomous
    ? `When you write the complete draft (per the instructions above — as early as possible, ideally in your very next response), wrap ONLY that final text between the exact markers [FINAL_DRAFT_START] and [FINAL_DRAFT_END] so the app can save it, IN ADDITION TO the individual [FIELD:n] tags for each field.`
    : `When every field has solid content (whether you or the founder wrote it), tell them so, and offer to compile the final version. When you write the final compiled version, wrap ONLY that final text between the exact markers [FINAL_DRAFT_START] and [FINAL_DRAFT_END] so the app can save it — do this only once, when the founder confirms they're ready. The founder can also compile and save their fields themselves at any time without waiting for you.`
}`

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get a response. Please try again." },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text: string = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    let finalDraft: string | null = null
    const draftMatch = text.match(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/)
    if (draftMatch) {
      finalDraft = draftMatch[1].trim()
    }

    // Extract every [FIELD:n]...[/FIELD] the model wrote this turn — the live
    // template updates the founder sees appear in their structured fields,
    // separate from (and in addition to) the chat transcript itself.
    const fieldUpdates: { index: number; value: string }[] = []
    const fieldTagPattern = /\[FIELD:(\d+)\]([\s\S]*?)\[\/FIELD\]/g
    let fieldMatch: RegExpExecArray | null
    while ((fieldMatch = fieldTagPattern.exec(text)) !== null) {
      const index = Number(fieldMatch[1])
      const value = fieldMatch[2].trim()
      if (Number.isInteger(index) && index >= 0 && index < guidedSteps.length && value) {
        fieldUpdates.push({ index, value })
      }
    }

    // Strip both marker types from what's shown in the chat itself.
    const displayText = text
      .replace(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/, "$1")
      .replace(fieldTagPattern, "")
      .trim()

    return NextResponse.json({ message: displayText, finalDraft, fieldUpdates, executiveName })
  } catch (error) {
    console.error("[v0] Error in business-asset-build API:", error)
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 },
    )
  }
}
