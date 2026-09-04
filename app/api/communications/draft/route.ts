import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AUDIENCE_LABEL, TONE_LABEL, type DraftRequest, type DraftResponse } from "@/lib/communications/types"

export const runtime = "nodejs"

// Communicate My Change™ / Communicate My Boundary™ — one concise first-person
// draft. The founder is the speaker; the words vary with commitment, audience,
// timing, outcome and tone. Never sent automatically; always edited by her.

const TONE_GUIDE: Record<string, string> = {
  warm: "Warm and personal. Kind without over-explaining. It should feel like a caring person letting people she respects know something that matters.",
  "clear-direct": "Clear and direct. Short sentences. No hedging, no apology. State the change, when it applies, and what to do instead.",
  professional: "Professional and composed. Businesslike but human. Suitable to send to clients or stakeholders as-is.",
  collaborative: "Collaborative. Frame the change as something that helps everyone work better together; invite planning around it without inviting negotiation of the rule itself.",
}

function audienceLine(audience: DraftRequest["audience"], other?: string | null) {
  const labels = audience.map((a) => (a === "other" && other?.trim() ? other.trim() : AUDIENCE_LABEL[a]))
  return labels.join(", ")
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return NextResponse.json({ error: "Please sign in." }, { status: 401 })

  let body: DraftRequest
  try {
    body = (await req.json()) as DraftRequest
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const commitment = body.commitmentText?.trim()
  if (!commitment || !Array.isArray(body.audience) || body.audience.length === 0) {
    return NextResponse.json({ error: "A commitment and at least one audience are required." }, { status: 400 })
  }

  const isRule = body.commitmentType === "operating-rule"
  const who = audienceLine(body.audience, body.audienceOther)
  const tone = TONE_GUIDE[body.tone] ?? TONE_GUIDE.warm

  const system = `You write short communications on behalf of a founder to the people in her business and life. She is the speaker.

Voice rules (non-negotiable):
- First person only: "I", "my", "I am", "I will", "I'm protecting", "I've decided", "Beginning this week".
- Never "You are...", never "Barbara is...", never "The founder...".
- She is not asking permission and not apologizing. She is making a change clear so people can plan around it.
- ${tone}

Content rules:
- This is a ${isRule ? "change to how her business operates (an operating rule)" : "protected-life boundary (a life priority)"}.
- Make three things unmistakable: what is changing, when it applies, and what people should do instead (or what still qualifies as an exception).
- Fit the register to the audience. Family and partner get plain, personal language. Team, clients, partners and stakeholders get professional warmth.
- 60 to 140 words for the body. One short paragraph, two at most. No bullet lists. No sign-off names.
- Vary the wording naturally. Do NOT end with a stock phrase such as "because I am protecting my time and energy." Do not reuse the same opening line every time.
- Write only for the audience listed; do not address groups that are not present.
- "What I want them to understand" is the founder's private goal for the message, not a sentence to repeat. Achieve it by speaking directly to the reader (e.g. tell them what counts as a genuine emergency and what should wait) — never paraphrase it as a statement about them.
- Do not default to opening with "Beginning this week" — it is one option among many. Often the strongest opening states the change itself or why it matters to the reader.

Return ONLY valid JSON with exactly two keys: {"subject": string, "body": string}. Subject is 3 to 8 words, plain, no quotes or emojis.`

  const user = [
    `Audience: ${who}`,
    `${isRule ? "Operating rule" : "Life priority"}: ${commitment}`,
    body.timing?.trim() ? `When it applies: ${body.timing.trim()}` : null,
    body.desiredOutcome?.trim() ? `What I want them to understand: ${body.desiredOutcome.trim()}` : null,
    body.identity?.trim() ? `Who I am being today (for voice, not to quote): ${body.identity.trim()}` : null,
    `Tone: ${TONE_LABEL[body.tone] ?? "Warm"}`,
  ]
    .filter(Boolean)
    .join("\n")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.85,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  })

  if (!response.ok) {
    console.error("[v0] communications/draft OpenAI error:", response.status, await response.text())
    return NextResponse.json({ error: "Could not write a draft right now. Please try again." }, { status: 502 })
  }

  const data = await response.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ""
  try {
    const parsed = JSON.parse(raw) as Partial<DraftResponse>
    if (!parsed.body || !parsed.subject) throw new Error("incomplete")
    return NextResponse.json({ subject: String(parsed.subject).trim(), body: String(parsed.body).trim() } satisfies DraftResponse)
  } catch {
    console.error("[v0] communications/draft bad JSON:", raw.slice(0, 200))
    return NextResponse.json({ error: "The draft came back malformed. Please try again." }, { status: 502 })
  }
}
