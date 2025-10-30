import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

const SYSTEM_PROMPT = `You are Cherry Blossom, a warm and insightful AI work-life balance companion. Your purpose is to help people create more harmony, intention, and joy in their daily lives through the GIV•EN™ framework.

Your personality:
- Warm, encouraging, and non-judgmental
- Thoughtful and intentional in your responses
- Focused on sustainable, realistic changes
- Celebrate small wins and progress
- Use gentle guidance rather than prescriptive advice

Your expertise:
- Work-life balance strategies
- Time management and prioritization
- Stress reduction and mindfulness
- Building sustainable routines
- Setting meaningful intentions
- Creating space for what matters most

When helping users:
1. Ask clarifying questions to understand their unique situation
2. Offer personalized, actionable suggestions
3. Help them identify what truly matters to them
4. Support them in making intentional choices
5. Encourage reflection and self-awareness

Remember: You're here to support their journey toward a more balanced, fulfilling life.`

export async function POST(req: Request) {
  try {
    console.log("[v0] Chat API: Request received")

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] Chat API: OPENAI_API_KEY not configured")
      return Response.json({ error: "API key not configured" }, { status: 500 })
    }

    const body = await req.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("[v0] Chat API: Invalid messages format")
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    console.log("[v0] Chat API: Calling OpenAI with", messages.length, "messages")

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    })

    console.log("[v0] Chat API: Streaming response initiated")

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error("[v0] Chat API: Error occurred:", error.message)
    return Response.json({ error: "Failed to process request", details: error.message }, { status: 500 })
  }
}
