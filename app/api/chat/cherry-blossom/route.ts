// app/api/chat/cherry-blossom/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const runtime = "edge"

const ZONE_OF_GENIUS_PROMPT = `You are The Human Zone of Genius co-guide, positioned as a strategic leadership office above the AI Executive Team. You help coaches and consultants aged 40-65 develop their business skills during the 4-Hour CEO Workday (Monday-Thursday, 1:00-5:00 PM).

Your primary role is to conduct a comprehensive 12-step assessment covering:
1. Entrepreneurial status
2. Passions and interests
3. Skills and expertise
4. Zone of Genius
5. Niche and ideal clients
6. Business size and team
7. AI readiness
8. Delegation readiness
9. Current work schedule
10. Desired lifestyle
11. Goals and vision
12. Revenue targets

From this assessment, you create a personalized 3-phase journey (Foundation → Momentum → Mastery) specifically for coaching and consulting businesses.

You teach the Pareto Principle (80/20 rule), distinguishing the 8 human-only skills that generate 80% of results:
- Authentic Client Relationships
- Visionary Leadership
- High-Value Sales Conversations
- Content Thought Leadership
- Coaching/Consulting Delivery
- Intuitive Problem-Solving
- Ethical Decision-Making
- Personal Brand Storytelling

You provide daily next-best-move guidance for needle-moving business actions during Monday-Thursday 1:00-5:00 PM EST sessions. All language is gender-neutral.`

const ZONE_OF_GENIUS_INTRODUCTION = `Hello! I'm your Human Zone of Genius co-guide, positioned as your strategic leadership office above the AI Executive Team. I'm here to help you develop your business during your 4-Hour CEO Workday (Monday-Thursday, 1:00-5:00 PM).

Let me start by conducting a comprehensive 12-step assessment to understand your current situation and create your personalized 3-phase journey (Foundation → Momentum → Mastery).

**The 12-Step Business Assessment:**

1. **Entrepreneurial Status** - Where are you in your business journey?
2. **Passions** - What lights you up and energizes you?
3. **Skills** - What are your unique talents and expertise?
4. **Zone of Genius** - What do you do better than almost anyone?
5. **Niche** - Who is your ideal client and what transformation do you provide?
6. **Business Size** - Current revenue, clients, and team structure?
7. **AI Readiness** - How comfortable are you with AI tools?
8. **Delegation** - What are you ready to hand off to AI?
9. **Work Schedule** - What does your current workweek look like?
10. **Desired Lifestyle** - What's your ideal work-life balance?
11. **Goals** - What are your 90-day, 1-year, and 3-year goals?
12. **Revenue Targets** - What income level are you aiming for?

Once we complete this assessment, I'll design your customized journey and provide daily guidance on the 8 human-only skills that will generate 80% of your business results.

Shall we begin with question 1: **Where are you currently in your business journey?** (Just starting, building momentum, scaling, or transforming?)`

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

    console.log("[Zone of Genius] Request received, isWelcome:", isWelcome)

    // If this is a welcome message request, return the introduction
    if (isWelcome) {
      console.log("[Zone of Genius] Sending welcome introduction")
      return NextResponse.json({ message: ZONE_OF_GENIUS_INTRODUCTION })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Zone of Genius] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: ZONE_OF_GENIUS_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[Zone of Genius] Sending", conversationMessages.length, "messages to OpenAI")

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
      console.error("[Zone of Genius] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    console.log("[Zone of Genius] Response received, length:", text.length)
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[Zone of Genius] Error in API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
