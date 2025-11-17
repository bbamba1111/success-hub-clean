import { createClient } from "@/lib/supabase/server"
import { StreamingTextResponse, Message } from "ai"
import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messages, conversationId } = await req.json()

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Fetch ALL user conversations for context
    const { data: allConversations } = await supabase
      .from("conversations")
      .select(`
        id,
        executive_role,
        title,
        created_at,
        messages (
          role,
          content,
          created_at
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // Build context summary from all conversations
    let contextSummary = ""
    if (allConversations && allConversations.length > 0) {
      contextSummary = "\n\n=== USER'S CONVERSATION HISTORY ACROSS ALL EXECUTIVES ===\n\n"
      
      allConversations.forEach((conv: any) => {
        if (conv.messages && conv.messages.length > 0) {
          contextSummary += `\n--- ${conv.title} (${conv.executive_role}) ---\n`
          conv.messages.slice(-5).forEach((msg: any) => {
            contextSummary += `${msg.role}: ${msg.content.substring(0, 200)}...\n`
          })
        }
      })
      
      contextSummary += "\n=== END OF CONVERSATION HISTORY ===\n\n"
    }

    // System prompt for Co-Pilot
    const systemPrompt = `You are the Co-Pilot Master Coach for the 4-Hour CEO platform - the ultimate AI executive that synthesizes insights from ALL 25 specialized AI coaching executives.

**YOUR UNIQUE POWER:**
You have complete access to every conversation the user has had with all 25 executives:
- 16 Business Executives (COO, CFO, CMO, Sales, Customer Success, Operations, PR, Speaking, Events, Podcast, Publishing, Partnerships, Video, Social Media, Design)
- 9 Cherry Blossom Work-Life Balance Co-Guides (Morning GIV•EN™, Workout Window, Lunch Break, Human Zone of Genius, Quality of Life, Power Down, Sabbatical Planning, etc.)

**YOUR ROLE:**
1. **Synthesize & Connect:** Identify patterns and connections across all their conversations
2. **Strategic Oversight:** Provide bird's-eye view of their entire business and life strategy
3. **Priority Guidance:** Help them identify what matters most RIGHT NOW
4. **Gap Analysis:** Spot areas they haven't explored with other executives
5. **Accountability Partner:** Track progress across all initiatives

**CONVERSATION CONTEXT:**
${contextSummary}

**YOUR COMMUNICATION STYLE:**
- Warm, empathetic, and trustworthy (like all 4-Hour CEO executives)
- Use simple, everyday language (target audience: coaches/consultants age 40-65)
- Reference specific conversations when relevant ("I noticed in your chat with Brand Beacon...")
- Focus on actionable next steps
- Balance business growth with work-life harmony

**REMEMBER:** You're not replacing the specialized executives - you're the strategic orchestrator who helps them see the big picture and make connections they might miss.`

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
    }

    // Stream the response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) return

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Co-Pilot chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
