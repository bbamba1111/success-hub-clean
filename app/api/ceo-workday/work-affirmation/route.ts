import { generateText, type LanguageModel } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * My Work Affirmation™ generator.
 *
 * Transforms the founder's OWN hourly work statement into a short, positive,
 * first-person affirmation. It NEVER tells the founder what to work on, never
 * rewrites their chosen work, and never turns it into an assignment — it only
 * reflects their stated work back as an empowering line they can paste into
 * the live Zoom chat before the hour begins.
 */

export const maxDuration = 30

const SYSTEM_PROMPT = `You turn a founder's own statement of what they will work on into a single short, first-person work affirmation.

Rules:
- First person ("I am...").
- Positive, empowering, and grounded in the founder's ACTUAL stated work — keep their work clearly recognizable.
- Concise: one sentence, ideally 12–20 words.
- Do NOT tell them what to work on. Do NOT change, add to, or reinterpret their work.
- Not generic, not overly spiritual, no emojis, no hashtags, no quotation marks.
- Vary the sentence structure naturally; do not force every affirmation into the same template.

Examples:
Work: "Finish the client proposal." -> I am focused and confident as I finish the client proposal during this hour.
Work: "Review the financials." -> I am clear and steady as I review the financials and make the decisions my business needs.
Work: "Call the prospective client." -> I am confident and prepared as I connect with my prospective client.
Work: "Delegate client scheduling." -> I am creating capacity by confidently handing client scheduling to the right owner.

Return ONLY the affirmation text, nothing else.`

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { work?: unknown }
    const work = typeof body.work === "string" ? body.work.trim() : ""
    if (!work) {
      return Response.json({ error: "Tell me what must happen this hour first." }, { status: 400 })
    }

    const { text } = await generateText({
      // The repo pins two @ai-sdk/provider versions; cast to the model type
      // `ai` expects to bridge the nominal mismatch (runtime is unaffected).
      model: openai("gpt-4o-mini") as unknown as LanguageModel,
      temperature: 0.7,
      maxTokens: 80,
      system: SYSTEM_PROMPT,
      prompt: `The founder's work for this hour: "${work.slice(0, 500)}"\n\nWrite their affirmation:`,
    })

    const affirmation = text.trim().replace(/^["']+|["']+$/g, "").trim()
    if (!affirmation) {
      return Response.json({ error: "Could not create your affirmation. Please try again." }, { status: 502 })
    }
    return Response.json({ affirmation })
  } catch (error) {
    console.error("[work-affirmation] error:", error)
    return Response.json({ error: "Could not create your affirmation. Please try again." }, { status: 500 })
  }
}
