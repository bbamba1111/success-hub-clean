/**
 * Thought Leadership Studio™ — Write / Research with AI
 * ---------------------------------------------------------------------------
 * A live conversation with the assigned AI Executive™ to write (or research)
 * a piece from a template's Steps. The founder sees each Step fill in live via
 * [FIELD:n] tags, exactly like the Business Asset build flow, and the finished
 * piece is returned between [FINAL_DRAFT_START]/[FINAL_DRAFT_END].
 *
 *   - mode "write-with-ai"    → the executive drafts polished prose for the
 *     piece, filling every Step and compiling a finished, formatted draft.
 *   - mode "research-with-ai" → the executive gathers and organizes angles,
 *     key points, and supporting material into each Step, compiling a
 *     research brief the founder can then write from.
 *
 * Server-fetch-to-OpenAI, no streaming, existing OPENAI_API_KEY — same proven
 * pattern as app/api/business-asset-build/route.ts.
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
      return NextResponse.json({ error: "You must be signed in to build this piece." }, { status: 401 })
    }

    const body = await req.json()
    const {
      mode,
      formatName,
      whatIsThis,
      whyItMatters,
      steps = [],
      executiveName = "Your Executive Team™",
      executiveTitle = "",
      message,
      messages = [],
      fieldValues = [],
    }: {
      mode: "write-with-ai" | "research-with-ai"
      formatName: string
      whatIsThis?: string
      whyItMatters?: string
      steps: string[]
      executiveName?: string
      executiveTitle?: string
      message: string
      messages: ChatMessage[]
      fieldValues?: (string | null | undefined)[]
    } = body

    if (!formatName || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: "This piece has no template to build from." }, { status: 400 })
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const isResearch = mode === "research-with-ai"

    // The founder sees each Step as a real, editable "Step N" in a structured
    // template beside the chat — never as "Field N" (that is internal machine
    // syntax only; the [FIELD:n] tag is stripped before display).
    const stepList = steps.map((s, i) => `Step ${i + 1} [FIELD:${i}]: ${s}`).join("\n")

    const normalized = steps.map((_, i) => {
      const v = fieldValues[i]
      return typeof v === "string" && v.trim() ? v.trim() : null
    })
    const hasAny = normalized.some(Boolean)
    const stateBlock = hasAny
      ? `\n\nCurrent contents of the founder's Steps right now (they can also edit these directly):\n${normalized
          .map((v, i) => `Step ${i + 1}: ${v ?? "(empty)"}`)
          .join("\n")}`
      : ""

    const roleLine = executiveTitle ? `${executiveName}, ${executiveTitle},` : `${executiveName},`

    const modeInstruction = isResearch
      ? `The founder chose RESEARCH WITH AI. Your job is to gather, organize, and sharpen the raw material for this piece — NOT to write the final prose. For each Step, provide the angles, key points, talking points, supporting facts, examples, and considerations the founder needs. Be substantive and specific. As soon as you have real material for a Step, wrap it in [FIELD:n]...[/FIELD]. When every Step has solid research, compile a clean RESEARCH BRIEF between [FINAL_DRAFT_START]/[FINAL_DRAFT_END].`
      : `The founder chose WRITE WITH AI. Your job is to WRITE this piece for them in polished, ready-to-use prose. Ask at most one quick clarifying question only if the founder's input is genuinely unusable; otherwise draft immediately, filling every Step with reasonable, clearly-grounded content. As soon as you draft a Step, wrap it in [FIELD:n]...[/FIELD]. When the piece is complete, compile the finished, formatted document between [FINAL_DRAFT_START]/[FINAL_DRAFT_END].`

    const systemPrompt = `You are ${roleLine} one of the founder's AI Executive Team™ inside the Harmony Lane™ Operating System. You have been assigned to help the founder create their "${formatName}".${whatIsThis ? ` What this is: ${whatIsThis}` : ""}${whyItMatters ? ` Why it matters: ${whyItMatters}` : ""}

${modeInstruction}

The founder is looking at a structured template with one editable "Step" per item below, sitting right next to this chat — it is the actual workspace. Ground everything in these Steps and always call them "Steps" when speaking with the founder — never say the word "field" or "Field N":
${stepList}${stateBlock}

Every time you draft or improve the content for a specific Step, wrap ONLY that step's text in [FIELD:n]...[/FIELD] (n = the index shown in brackets above, e.g. "[FIELD:2]") so it appears live in the founder's Step. Do this each time, not just once at the end.

FORMATTING OF THE FINAL DRAFT — this is important. The text you place between [FINAL_DRAFT_START] and [FINAL_DRAFT_END] must be a clean, polished, ready-to-read document:
- Use **bold** for headings, names, and key emphasis.
- Use *italic* sparingly for subtle emphasis or titles.
- Use "- " bullet points for lists.
- Separate paragraphs and sections with a blank line for clear spacing.
- Do NOT use markdown headers (#, ##, ###), horizontal rules, tables, or code fences.
- Write in complete, well-structured prose appropriate for a ${formatName}.

In the CHAT itself (outside the draft markers), stay warm, concise, and conversational — do not paste the whole document into the chat; it appears in the Steps and the final draft panel.`

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
        max_tokens: 1600,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error (tl-write):", response.status, errorData)
      return NextResponse.json({ error: "Failed to get a response. Please try again." }, { status: response.status })
    }

    const data = await response.json()
    const text: string = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    let finalDraft: string | null = null
    const draftMatch = text.match(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/)
    if (draftMatch) finalDraft = draftMatch[1].trim()

    const fieldUpdates: { index: number; value: string }[] = []
    const fieldTagPattern = /\[FIELD:(\d+)\]([\s\S]*?)\[\/FIELD\]/g
    let m: RegExpExecArray | null
    while ((m = fieldTagPattern.exec(text)) !== null) {
      const index = Number(m[1])
      const value = m[2].trim()
      if (Number.isInteger(index) && index >= 0 && index < steps.length && value) {
        fieldUpdates.push({ index, value })
      }
    }

    const displayText = text
      .replace(/\[FINAL_DRAFT_START\]([\s\S]*?)\[FINAL_DRAFT_END\]/, "")
      .replace(fieldTagPattern, "")
      .trim()

    return NextResponse.json({
      message: displayText || "Here's what I've got so far — take a look at your Steps.",
      finalDraft,
      fieldUpdates,
    })
  } catch (error) {
    console.error("[v0] Error in thought-leadership write API:", error)
    return NextResponse.json({ error: "Failed to process your message. Please try again." }, { status: 500 })
  }
}
