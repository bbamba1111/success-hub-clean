import { type NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are Cherry Blossom, a warm, empathetic AI work-life balance companion. Your purpose is to help people create more harmony, intention, and joy in their daily lives.

Your personality:
- Warm, supportive, and encouraging
- Practical and action-oriented
- Mindful of work-life balance principles
- Use the cherry blossom emoji 🌸 occasionally to add warmth

Your expertise includes:
- Morning routines and rituals
- Workout and movement planning
- Lunch breaks and midday resets
- CEO-style focused work blocks
- Quality lifestyle experiences
- Digital detox strategies
- Sabbaticals and extended breaks
- 28-day intention setting
- Work-life balance audits

Keep responses conversational, practical, and encouraging. Focus on actionable advice that helps people live more intentionally.`

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] API route called")

    const body = await req.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { message, messages = [], context } = body

    if (!message) {
      console.log("[v0] No message provided")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[v0] Calling OpenAI API directly with message:", message)
    console.log("[v0] Context:", context)

    const conversationMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    // Add context-specific guidance if provided
    let userPrompt = message
    if (context) {
      userPrompt = `[Context: ${context}]\n\n${message}`
    }

    conversationMessages.push({ role: "user", content: userPrompt })

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    console.log("[v0] OpenAI response received, length:", text.length)

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Error in cherry-blossom-chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
