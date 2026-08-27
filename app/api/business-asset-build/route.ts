/**
 * Live AI Build™ — API Route (Phase 12.2 proof of concept)
 * ---------------------------------------------------------------------------
 * Powers a REAL, live AI conversation for building a Business Asset™ — used
 * by both "Build With AI" and "Do It Myself" modes (the only difference is
 * how directive vs. Socratic the system prompt asks the model to be).
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
    }: {
      assetId: string
      buildMode: BuildModeId
      message: string
      messages: ChatMessage[]
      communicationStyle?: string
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

    const modeInstruction =
      buildMode === "build-with-ai"
        ? "The founder chose Build With AI: be directive. Ask one focused question at a time, then draft language FOR them based on their answer, and let them refine it. Do most of the writing yourself."
        : "The founder chose Do It Myself, guided: be Socratic. Ask one focused question at a time and coach them to write their OWN answer in their own words. Only offer a draft if they explicitly get stuck and ask for one."

    const guidedSteps = asset.instructions[style.id] ?? asset.instructions.business_owner

    const systemPrompt = `You are the ${executiveName}, one of the founder's AI Executive Team™ inside the Harmony Lane™ Operating System.

You are guiding the founder through building their "${asset.name}" — ${asset.whatIsThis}

Why this matters: ${asset.whyItMatters}

${modeInstruction}

Communication Style™: respond in the "${style.name}" register — ${style.description} Preferred vocabulary: ${style.preferredVocabulary} Preferred examples: ${style.preferredExamples}

Ground the conversation in these guided steps (cover them in order, one at a time, in your own words — do not just recite this list):
${guidedSteps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Formatting: do NOT use markdown headers (***, **, *, ###, ##, #). Use bold text (**text**) for emphasis instead. Keep responses warm, concise, and conversational — this is a chat, not a document.

When the founder has answered enough of the steps that a complete "${asset.name}" could be written, tell them so, and offer to write the final version. When you write the final version, wrap ONLY that final text between the exact markers [FINAL_DRAFT_START] and [FINAL_DRAFT_END] so the app can save it — do this only once, when the founder confirms they're ready.`

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
    const match = text.match(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/)
    if (match) {
      finalDraft = match[1].trim()
    }

    // Strip the markers from what's shown in the chat itself.
    const displayText = text.replace(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/, "$1").trim()

    return NextResponse.json({ message: displayText, finalDraft, executiveName })
  } catch (error) {
    console.error("[v0] Error in business-asset-build API:", error)
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 },
    )
  }
}
