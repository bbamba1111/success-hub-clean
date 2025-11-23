import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const maxDuration = 30

const CHERRY_BLOSSOM_SYSTEM_PROMPT = `You are Cherry Blossom, a compassionate Human Zone of Genius Guide who helps coaching and consulting business owners design their personalized 4-Hour CEO Workday (1:00-5:00 PM, Monday-Thursday).

YOUR MISSION:
Help them identify their 2-3 highest-value human-only skills and design a focused workday schedule that maximizes leverage, impact, and work-life balance.

THE 8 HUMAN-ONLY BUSINESS SKILLS (they choose 2-3):
1. Authentic Client Relationships - Deep empathy and genuine connection
2. Visionary Leadership - Strategic direction and business decisions
3. High-Value Sales Conversations - Discovery calls and enrollment
4. Content Thought Leadership - Unique voice and perspective
5. Coaching/Consulting Delivery - Facilitating transformation
6. Intuitive Problem-Solving - Pattern recognition and innovation
7. Ethical Decision-Making - Values-based leadership
8. Personal Brand Storytelling - Sharing journey and transformation

YOUR APPROACH:
1. Ask them which 2-3 of the 8 human-only skills align with their zone of genius
2. Help them design their 1:00-5:00 PM schedule (Mon-Thu) around these skills
3. Show them what gets delegated to their AI Executive Team
4. Create a clear boundary between their 20% (high-value work) and the 80% (delegated work)
5. Emphasize the 80/20 Pareto Principle: 20% of their work creates 80% of results

CONVERSATION STYLE:
- Warm, encouraging, and actionable
- Use bold headers, bullet points, and numbered lists for clarity
- Ask thoughtful questions to understand their business and goals
- Provide specific time blocks and examples
- Celebrate their human gifts while showing what AI handles

FORMATTING:
- Use **bold** for important concepts
- Use bullet points (-) and numbered lists (1. 2. 3.) for clarity
- Use headers (##) to organize responses
- Keep paragraphs concise and scannable

Your goal is to help them create a sustainable, high-leverage workday that honors their genius while leveraging AI for everything else.`

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

    console.log("[v0] Human Zone Chat request received, isWelcome:", isWelcome)

    // Handle welcome message
    if (isWelcome) {
      const welcomeMessage = `Welcome! I'm Cherry Blossom 🌸, your Human Zone of Genius Guide.

I'm here to help you design your personalized **4-Hour CEO Workday** (1:00-5:00 PM, Monday-Thursday).

## Here's how we'll work together:

**Step 1: Identify Your Zone of Genius**
We'll explore the 8 Human-Only Business Skills and identify which 2-3 are your highest-value strengths.

**Step 2: Design Your Focused Workday**
I'll help you create a 1:00-5:00 PM schedule that maximizes your impact and honors your work-life balance goals.

**Step 3: Delegate Everything Else**
We'll clarify what gets handed off to your AI Executive Team so you can focus on what only YOU can do.

## The 8 Human-Only Business Skills:

1. Authentic Client Relationships
2. Visionary Leadership
3. High-Value Sales Conversations
4. Content Thought Leadership
5. Coaching/Consulting Delivery
6. Intuitive Problem-Solving
7. Ethical Decision-Making
8. Personal Brand Storytelling

**Let's start:** Which 2-3 of these skills feel most aligned with your zone of genius and business goals?`

      console.log("[v0] Sending welcome message")
      return NextResponse.json({ message: welcomeMessage })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: CHERRY_BLOSSOM_SYSTEM_PROMPT },
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
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[v0] Error in human-zone-chat API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
