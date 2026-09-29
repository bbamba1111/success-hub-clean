/**
 * Thought Leadership Studio™ — Template generation
 * ---------------------------------------------------------------------------
 * When the founder needs a piece the built-in Business Template Library™ does
 * not already contain, the assigned AI Executive™ generates a template for it:
 * a display name, the owning executive, a one-line "what is this", why it
 * matters, and the ordered Steps to build it. The client mints a Template
 * Code™ and saves it so the library grows.
 *
 * Follows the same server-fetch-to-OpenAI pattern as
 * app/api/business-asset-build/route.ts (no streaming, existing OPENAI_API_KEY).
 */

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"

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
      return NextResponse.json({ error: "You must be signed in to create a template." }, { status: 401 })
    }

    const { request: formatRequest } = (await req.json()) as { request?: string }
    if (!formatRequest || typeof formatRequest !== "string" || !formatRequest.trim()) {
      return NextResponse.json({ error: "Describe what you need to create." }, { status: 400 })
    }

    const executiveMenu = EXECUTIVE_TEAM.map((e) => `- ${e.id}: ${e.name} (${e.department}) — ${e.mission}`).join("\n")

    const systemPrompt = `You are the Executive Conductor of a founder's AI Executive Team™. A founder needs to create a piece of thought leadership or communications work, and the Business Template Library™ does not yet contain a template for it. Design a clean, reusable template.

Assign the single most appropriate owning executive by id from this roster:
${executiveMenu}

Return ONLY valid JSON (no markdown, no commentary) in exactly this shape:
{
  "name": "short display name for the piece, in Title Case",
  "category": "one of: speaking | publishing | pr-media | social",
  "executiveId": "one id from the roster above",
  "whatIsThis": "one plain sentence describing what this piece is",
  "whyItMatters": "one plain sentence on why it moves the business forward",
  "steps": ["5 to 7 ordered steps the founder fills in to produce it — each a short, concrete prompt, no numbering in the text"]
}`

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
          { role: "user", content: `The founder needs to create: ${formatRequest.trim()}` },
        ],
        temperature: 0.5,
        max_tokens: 700,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error (generate-template):", response.status, errorData)
      return NextResponse.json({ error: "Could not create a template. Please try again." }, { status: response.status })
    }

    const data = await response.json()
    const raw: string = data.choices[0]?.message?.content ?? ""
    let parsed: {
      name?: string
      category?: string
      executiveId?: string
      whatIsThis?: string
      whyItMatters?: string
      steps?: unknown
    }
    try {
      parsed = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: "Could not create a template. Please try again." }, { status: 502 })
    }

    const validExec = EXECUTIVE_TEAM.some((e) => e.id === parsed.executiveId)
    const category = ["speaking", "publishing", "pr-media", "social"].includes(String(parsed.category))
      ? (parsed.category as string)
      : "publishing"
    const steps = Array.isArray(parsed.steps)
      ? parsed.steps.map((s) => String(s).trim()).filter(Boolean).slice(0, 8)
      : []

    if (!parsed.name || steps.length === 0) {
      return NextResponse.json({ error: "Could not create a usable template. Please try again." }, { status: 502 })
    }

    return NextResponse.json({
      name: String(parsed.name).trim(),
      category,
      executiveId: validExec ? parsed.executiveId : "growth",
      whatIsThis: String(parsed.whatIsThis ?? "").trim(),
      whyItMatters: String(parsed.whyItMatters ?? "").trim(),
      steps,
    })
  } catch (error) {
    console.error("[v0] Error in generate-template API:", error)
    return NextResponse.json({ error: "Failed to create a template. Please try again." }, { status: 500 })
  }
}
