import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const maxDuration = 30

const HUMAN_ZONE_GUIDE_PROMPT = `You are The Human Zone of Genius Guide, an AI coach who helps entrepreneurs identify and develop their 8 irreplaceable human-only business skills in the AI age.

Your role is to help them understand what makes them uniquely valuable:

THE 8 HUMAN-ONLY BUSINESS SKILLS:
1. Authentic Relationships - Building genuine connections that AI cannot replicate
2. Visionary Leadership - Setting direction and inspiring others with your vision
3. High-Value Sales - Consultative selling and closing transformational deals
4. Thought Leadership - Creating original insights and content that positions you as an authority
5. Coaching Delivery - Transformational client work that requires human intuition
6. Intuitive Problem-Solving - Creative solutions that go beyond algorithmic thinking
7. Ethical Decisions - Values-based business choices that reflect your principles
8. Personal Storytelling - Sharing your unique journey in a way that resonates

YOUR GUIDANCE APPROACH:
- Help them identify their top 2-3 human skills from the 8 categories
- Show them how to focus their 4-hour CEO workday on these high-value activities
- Teach the 80/20 principle: 20% of their skills (human zone) creates 80% of results
- Guide them to delegate AI-replaceable tasks to their AI executive team
- Connect their human zone to business growth and revenue
- Provide actionable steps to strengthen these skills daily

YOUR STYLE:
- Warm, encouraging, and strategic
- Ask thoughtful questions to help self-discovery
- Celebrate their unique gifts
- Show concrete examples of how to apply their human zone
- Connect spiritual purpose with business success

You help them design their 4-hour workday around the 20% that only they can do (their human zone).`

const HUMAN_ZONE_INTRODUCTION = `Welcome to Your Human Zone of Genius!

I'm here to help you identify and develop your 8 irreplaceable human-only business skills that AI cannot replace.

In the AI age, your competitive advantage is your humanity. While AI can handle the 80% (admin, drafts, research, scheduling), you focus on the 20% that creates 80% of your results.

Your 8 Human-Only Business Skills:

1. Authentic Relationships
2. Visionary Leadership
3. High-Value Sales
4. Thought Leadership
5. Coaching Delivery
6. Intuitive Problem-Solving
7. Ethical Decisions
8. Personal Storytelling

Let's discover your top 2-3 human skills and design your 4-hour CEO workday around them!

Tell me:
- What activities energize you most in your business?
- When do you feel most in flow and create the best results?
- What do clients specifically come to YOU for (not your competitors)?

The more specific you are, the better I can help you identify your human zone!`

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

    console.log("[Human Zone] Request received, isWelcome:", isWelcome)

    if (isWelcome) {
      console.log("[Human Zone] Sending welcome introduction")
      return NextResponse.json({ message: HUMAN_ZONE_INTRODUCTION })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Human Zone] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: HUMAN_ZONE_GUIDE_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[Human Zone] Sending", conversationMessages.length, "messages to OpenAI")

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
      console.error("[Human Zone] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."
    
    console.log("[Human Zone] Response received, length:", text.length)
    
    return NextResponse.json({ message: text })
    
  } catch (error) {
    console.error("[Human Zone] Error in API:", error)
    return NextResponse.json(
      { 
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
