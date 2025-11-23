import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const maxDuration = 30

const CO_PILOT_SYSTEM_PROMPT = `You are the Co-Pilot Master Coach, a strategic AI orchestrator with complete access to all conversations across the user's AI Executive Team.

YOUR UNIQUE CAPABILITY:
You have visibility into ALL conversations the user has had with:
- Cherry Blossom (Human Zone of Genius Guide)
- All 16 AI Executives (COO, CFO, CMO, Sales Director, etc.)
- Work-Life Balance Co-Guide
- AI Business Audit conversations

YOUR ROLE:
1. Synthesize insights across ALL conversations to identify patterns and opportunities
2. Connect the dots between different business areas (operations, finances, marketing, sales)
3. Provide strategic guidance that considers the FULL context of their business
4. Identify contradictions or gaps in their strategy across departments
5. Suggest next best moves based on comprehensive understanding
6. Act as their strategic thought partner who sees the big picture

YOUR APPROACH:
- Reference specific conversations when making recommendations
- Highlight patterns you notice across different areas
- Point out where different executives have given complementary or conflicting advice
- Provide integrated strategic guidance that considers all dimensions of their business
- Ask clarifying questions to deepen understanding
- Be their trusted advisor who has the full context

You help them make better decisions by having the complete picture of their business journey.`

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

    console.log("[v0] Co-Pilot Request received, isWelcome:", isWelcome)

    // Handle welcome message
    if (isWelcome) {
      const welcomeMessage = `Welcome to your Co-Pilot Command Center!

I'm your Strategic AI Orchestrator with complete access to all your conversations across your AI Executive Team.

**What makes me unique:**
I have visibility into ALL your conversations with Cherry Blossom, your 16 AI Executives, and other AI coaches. I can synthesize insights, identify patterns, and provide strategic guidance based on the complete picture of your business journey.

**How I help you:**
- Connect the dots between different business areas
- Spot patterns and opportunities across conversations
- Provide integrated strategic guidance
- Identify gaps or contradictions in your strategy
- Suggest your next best moves with full context

What would you like strategic guidance on today? I can help you make sense of everything you've discussed across your entire AI team.`

      console.log("[v0] Sending Co-Pilot welcome message")
      return NextResponse.json({ message: welcomeMessage })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    // Fetch conversation history from Supabase
    const supabase = createServerClient()
    console.log("[v0] Fetching conversation history from Supabase")

    const { data: chatHistory, error: dbError } = await supabase
      .from("chat_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)

    if (dbError) {
      console.error("[v0] Error fetching chat history:", dbError)
    }

    // Group conversations by context
    let contextSummary = ""
    if (chatHistory && chatHistory.length > 0) {
      console.log("[v0] Found", chatHistory.length, "historical messages")
      
      const groupedChats = chatHistory.reduce((acc: any, chat: any) => {
        const context = chat.context || "general"
        if (!acc[context]) acc[context] = []
        acc[context].push(chat)
        return acc
      }, {})

      contextSummary = "\n\nCONVERSATION HISTORY CONTEXT:\n"
      Object.keys(groupedChats).forEach((context) => {
        const chats = groupedChats[context]
        contextSummary += `\n[${context.toUpperCase()}] - ${chats.length} messages`
        chats.slice(0, 5).forEach((chat: any) => {
          contextSummary += `\n- User: ${chat.user_message?.substring(0, 100)}`
          contextSummary += `\n- Response: ${chat.assistant_message?.substring(0, 100)}`
        })
      })
    } else {
      console.log("[v0] No conversation history found")
    }

    const conversationMessages = [
      { role: "system", content: CO_PILOT_SYSTEM_PROMPT + contextSummary },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[v0] Sending", conversationMessages.length, "messages to OpenAI")

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
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    console.log("[v0] Response received, length:", text.length)

    // Save Co-Pilot conversation to database
    if (messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage.role === "user") {
        await supabase.from("chat_history").insert({
          user_message: lastUserMessage.content,
          assistant_message: text,
          context: "co-pilot",
        })
        console.log("[v0] Saved Co-Pilot conversation to database")
      }
    }
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[v0] Error in co-pilot API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
