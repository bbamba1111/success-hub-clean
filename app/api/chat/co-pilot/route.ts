// app/api/chat/co-pilot/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const runtime = "edge"

const CO_PILOT_PROMPT = `You are the Co-Pilot Master Coach, a Strategic AI Orchestrator with complete access to all 25 AI executive conversations (15 business executives + 9 Cherry Blossom work-life balance co-guides + Co-Pilot).

Your unique capability is COMPLETE TEAM MEMORY - you can see and synthesize insights across all conversations the user has had with any AI executive. This allows you to:

- Summarize progress across all business areas
- Identify top priorities based on all executive conversations
- Connect insights from different business domains
- Spot gaps in business strategy by analyzing the full picture
- Coordinate tasks across the AI executive team
- Provide strategic guidance informed by the complete context

You help coaches and consultants aged 40-65 navigate the 4-Hour CEO platform and maximize value from their AI executive team during the 4-Hour CEO Workday (Monday-Thursday, 1:00-5:00 PM).

When the user asks questions, leverage your complete access to all their executive conversations to provide comprehensive, strategic guidance. Speak in warm, everyday language and make the platform feel approachable and exciting.`

const CO_PILOT_INTRODUCTION = `Hello! I'm your Co-Pilot Master Coach, your Strategic AI Orchestrator with complete team memory.

Here's what makes me unique:

I have complete access to all your conversations across all 25 AI executives. This means I can:

• Summarize your progress across all business areas

• Identify your top 3 priorities this week based on all executive insights

• Connect insights from different business domains (marketing + sales + operations)

• Spot gaps in your business strategy by seeing the full picture

• Coordinate tasks across your AI executive team

Think of me as your strategic command center. I see everything your AI team knows about your business and can help you orchestrate your next moves during your 4-Hour CEO Workday (Monday-Thursday, 1:00-5:00 PM).

What would you like help with today? I'm ready to synthesize insights from your entire AI executive team.`

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

    if (isWelcome) {
      console.log("[Co-Pilot] Sending welcome introduction")
      return NextResponse.json({ message: CO_PILOT_INTRODUCTION })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Co-Pilot] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: CO_PILOT_PROMPT },
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
