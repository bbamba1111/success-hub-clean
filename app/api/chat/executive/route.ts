// app/api/chat/executive/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const runtime = "edge"

function getExecutivePrompt(role: string): string {
  const prompts: Record<string, string> = {
    "COO": "You are Optima Sage, your AI COO and empathetic partner in streamlining operations. While I'm an AI trained on Barbara's proven methodology, I speak with warmth and accessibility.",
    "CFO": "You are Ledger Maven, your AI CFO specializing in financial strategy for coaches and consultants.",
    "CMO": "You are Brand Beacon, your AI CMO focusing on marketing strategies.",
    "Sales Director": "You are Deal Catalyst, your AI Sales Director optimizing sales systems.",
    "Customer Success": "You are Success Harmony, your AI Customer Success partner.",
    "Operations Manager": "You are Flow Architect, your AI Operations Manager.",
    "PR Executive": "You are Voice Amplifier, your AI PR Executive.",
    "Speaking Coach": "You are Stage Presence, your AI Speaking Coach.",
    "Virtual Events Director": "You are Event Orchestrator, your AI Virtual Events Director.",
    "Podcast Producer": "You are Audio Storyteller, your AI Podcast Producer.",
    "Publishing Coach": "You are Page Turner, your AI Publishing Coach.",
    "Partnership Executive": "You are Alliance Builder, your AI Partnership Executive.",
    "Video Content Creator": "You are Visual Narrator, your AI Video Content Creator.",
    "Social Media Executive": "You are Social Pulse, your AI Social Media Executive.",
    "Graphic Designer": "You are Design Artisan, your AI Graphic Designer.",
  }

  return prompts[role] || "You are a helpful AI executive assistant."
}

export async function POST(req: NextRequest) {
  try {
    // 1. Check business hours
    if (!isWithinBusinessHours()) {
      return NextResponse.json(
        { error: "The Success Hub is closed for the night (11 PM - 7 AM ET). We'll see you tomorrow!" },
        { status: 403 }
      )
    }

    // 2. Parse request
    const body = await req.json()
    const { messages = [], executiveRole } = body

    console.log("[Executive] Request received for role:", executiveRole)

    // 3. Validate API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("[Executive] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // 4. Get system prompt for this executive
    const systemPrompt = getExecutivePrompt(executiveRole)

    // 5. Build conversation messages
    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[Executive] Sending", conversationMessages.length, "messages to OpenAI")

    // 6. DIRECT FETCH TO OPENAI (No AI SDK)
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
      console.error("[Executive] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status }
      )
    }

    // 7. RETURN JSON (Not streaming)
    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    console.log("[Executive] Response received, length:", text.length)
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[Executive] Error in API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
