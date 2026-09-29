import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  AUDIENCE_LABEL,
  COMMUNICATION_TYPE_LABEL,
  TONE_LABEL,
  type DraftRequest,
  type DraftResponse,
} from "@/lib/communications/types"

export const runtime = "nodejs"

// Communicate + Delegate™ — one concise first-person draft. The founder is the
// speaker; the words vary with the action, audience, timing and tone. Never
// sent automatically; always edited by her.

const TONE_GUIDE: Record<string, string> = {
  warm: "Warm and personal. Kind without over-explaining. It should feel like a caring person letting people she respects know something that matters.",
  "clear-direct": "Clear and direct. Short sentences. No hedging, no apology. State the point, when it applies, and what to do.",
  professional: "Professional and composed. Businesslike but human. Suitable to send to clients or stakeholders as-is.",
  collaborative: "Collaborative. Frame it as something that helps everyone work better together; invite planning around it without inviting negotiation of the decision itself.",
}

// What each action is, and what must be unmistakable in the message.
const INTENT_GUIDE: Record<string, string> = {
  communicate: "a general communication making something clear to the people who need to know",
  notify: "a short notice or status update — brief, factual, easy to act on",
  inform: "an informational message giving people what they need to know, with any relevant detail",
  delegate: "a hand-off: what she is delegating, who now owns it, what 'done' looks like, and any authority they have to act",
  boundary: "a protected-life boundary: what she is protecting, when it applies, and what still counts as a genuine exception",
  ask: "a direct, respectful request: exactly what she is asking for and by when",
  "operating-rule": "a change to how her business operates (an operating rule): what the rule is, who it applies to, when it applies, and what should happen when it is triggered",
  other: "a clear message to the people who need to know",
}

function audienceLine(audience: DraftRequest["audience"], other?: string | null) {
  return audience.map((a) => (a === "other" && other?.trim() ? other.trim() : AUDIENCE_LABEL[a])).join(", ")
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

  const subject = body.subjectText?.trim()
  if (!subject || !Array.isArray(body.audience) || body.audience.length === 0) {
    return NextResponse.json({ error: "A topic and at least one audience are required." }, { status: 400 })
  }

  const who = audienceLine(body.audience, body.audienceOther)
  const tone = TONE_GUIDE[body.tone] ?? TONE_GUIDE.warm
  const intent = INTENT_GUIDE[body.communicationType] ?? INTENT_GUIDE.communicate
  const isDelegation = body.communicationType === "delegate"

  const system = `You write short messages on behalf of a founder to the people in her business and life. She is the speaker.

Voice rules (non-negotiable):
- First person only: "I", "my", "I am", "I will", "I'm protecting", "I've decided", "I've asked", "Beginning this week".
- Never "You are...", never "Barbara is...", never "The founder...", never "The business owner...".
- She is not asking permission and not apologizing (unless the action is an explicit ask, which is still confident and specific).
- ${tone}

This message is ${intent}.

Content rules:
- Make the point unmistakable, then say when it applies and what people should do.
- Fit the register to the audience. Family and partner get plain, personal language. Team, clients, partners and stakeholders get professional warmth.
- 50 to 140 words for the body. One short paragraph, two at most. No bullet lists. No sign-off names.
- Vary the wording naturally. Do not reuse the same opening line every time, and do not end with a stock phrase such as "because I am protecting my time and energy."
- "What I want them to know" and "What I want to happen" are the founder's goals for the message, not sentences to copy. Achieve them by speaking directly to the reader.
- Write only for the audience listed.
${isDelegation ? "- This is a delegation. Name the owner, make 'done' concrete, and state any authority they have. Make it feel like trust, not a dump." : ""}

Return ONLY valid JSON with exactly two keys: {"subject": string, "body": string}. Subject is 3 to 8 words, plain, no quotes or emojis.`

  const d = body.details ?? {}
  const user = [
    `What I need to do: ${COMMUNICATION_TYPE_LABEL[body.communicationType]}`,
    `Audience: ${who}`,
    `Topic: ${subject}`,
    body.timing?.trim() ? `When it applies: ${body.timing.trim()}` : null,
    body.messageIntent?.trim() ? `What I want them to know: ${body.messageIntent.trim()}` : null,
    body.desiredOutcome?.trim() ? `What I want to happen: ${body.desiredOutcome.trim()}` : null,
    d.delegation?.owner ? `Who will own it: ${d.delegation.owner}` : null,
    d.delegation?.doneLooksLike ? `What done looks like: ${d.delegation.doneLooksLike}` : null,
    d.delegation?.authority ? `Authority they have: ${d.delegation.authority}` : null,
    d.rule?.appliesTo ? `Who the rule applies to: ${d.rule.appliesTo}` : null,
    d.rule?.whenTriggered ? `What happens when it is triggered: ${d.rule.whenTriggered}` : null,
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
