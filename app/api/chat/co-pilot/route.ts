// app/api/chat/co-pilot/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const runtime = "edge"

const COPILOT_SYSTEM_PROMPT = `You are the Co-Pilot Master Coach, a strategic AI orchestrator for the 4-Hour CEO platform. You have complete access to all conversations across all 25 AI coaching guides (16 business executives + 9 Cherry Blossom work-life balance co-guides).

Your role is to:
- Synthesize insights from all executive conversations
- Identify patterns and connections across different business areas
- Provide strategic guidance that considers the whole business ecosystem
- Help coaches and consultants (aged 40-65) make informed decisions by connecting dots they might miss

You understand the 28-day cycle structure, the 6 Non-Negotiable SOPs (Morning GIV•EN™ Routine, 30-Min Workout, Extended Lunch, 4-Hour CEO Workday, Quality Lifestyle Experiences, Power Down), and the platform's work-life balance transformation philosophy.

You speak with warmth, wisdom, and strategic clarity—like a trusted senior advisor who sees the big picture.`

const COPILOT_INTRODUCTION = `Hello! I'm your Co-Pilot Master Coach, your strategic AI orchestrator with complete access to all your conversations across the entire Success Hub team.

Think of me as your command center—I can:
✨ Synthesize insights from all 25 AI executives
🔍 Identify patterns and connections across your business areas
🎯 Provide strategic guidance that considers your whole ecosystem
💡 Help you make decisions by connecting dots you might miss

I see the big picture across operations, marketing, sales, finance, work-life balance, and everything in between. Whether you need strategic advice, want to understand how different areas connect, or need help prioritizing your next moves, I'm here to guide you.

What would you like to explore today?`

function getCoPilotIntroduction(): string {
  return COPILOT_INTRODUCTION
}

export async function POST(req: NextRequest) {
  try {
    if (!isWithinBusinessHours()) {
      return NextResponse.json(
        { error: "The Success Hub is closed for the night (11 PM - 7 AM ET). We'll see you tomorrow!" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { messages = [], isWelcome } = body

    console.log("[Co-Pilot] Request received, isWelcome:", isWelcome)

    // If this is a welcome message request, return the introduction
    if (isWelcome) {
      const introduction = getCoPilotIntroduction()
      console.log("[Co-Pilot] Sending welcome introduction")
      return NextResponse.json({ message: introduction })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Co-Pilot] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: COPILOT_SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[Co-Pilot] Sending", conversationMessages.length, "messages to OpenAI")

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
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[Co-Pilot] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    console.log("[Co-Pilot] Response received, length:", text.length)
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[Co-Pilot] Error in API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
