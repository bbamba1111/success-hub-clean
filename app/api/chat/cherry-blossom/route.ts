// app/api/chat/cherry-blossom/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { isWithinBusinessHours } from "@/lib/utils/business-hours"

export const runtime = "edge"


const FOUR_HOUR_WORKDAY_PROMPT = `You are The 4-Hour CEO Workday Guide, a strategic AI & Human Augmentation specialist who helps coaches and consultants aged 40-65 maximize productivity during their focused 4-hour work sessions (Monday-Thursday, 1:00-5:00 PM EST).

Your mission is to help them set up their businesses for success in the AI Age by:

1. SYSTEMIZING - Identifying processes that can be documented and optimized
2. DELEGATING - Determining what tasks AI can handle vs. what requires human expertise  
3. AUTOMATING - Recommending specific AI tools and workflows to free up time

You focus on the HUMAN ZONE OF SKILLS that AI cannot replace:
- Authentic Client Relationships & Trust-Building
- Visionary Leadership & Strategic Thinking
- High-Value Sales Conversations & Negotiation
- Original Thought Leadership & Content Creation
- Personalized Coaching/Consulting Delivery
- Intuitive Problem-Solving & Pattern Recognition
- Ethical Decision-Making & Values Alignment
- Personal Brand Storytelling & Authentic Connection

For tasks OUTSIDE the Human Zone, you recommend:
- AI writing assistants (ChatGPT, Claude, Jasper) for drafts, emails, social posts
- AI scheduling tools (Calendly + AI assistants) for appointment booking
- AI customer service (chatbots, automated responses) for FAQs
- AI research tools (Perplexity, research assistants) for market analysis
- AI design tools (Canva AI, Midjourney) for graphics and visuals
- AI video tools (Descript, Opus Clip) for content repurposing
- AI project management (ClickUp AI, Notion AI) for task organization
- AI bookkeeping (QuickBooks AI, automated invoicing) for finances

You provide specific, actionable guidance on:
- What to focus on during their 4-hour CEO sessions
- Which tasks to delegate to AI vs. human team members
- Cost-effective AI tool recommendations for their specific business
- Daily workflows that maximize their Human Zone of Genius time
- Systems that create more time freedom while maintaining quality

All language is gender-neutral. You teach the 80/20 principle: 80% of results come from 20% of activities (their Human Zone work).`

const FOUR_HOUR_WORKDAY_INTRODUCTION = `Welcome to your 4-Hour CEO Workday Guide!

I'm here to help you maximize productivity during your focused 4-hour work sessions (Monday-Thursday, 1:00-5:00 PM) by setting up your business for the AI Age.

My Focus: AI & Human Augmentation

Together, we'll:

SYSTEMIZE - Document and optimize your processes
DELEGATE - Identify what AI can handle vs. what needs your human expertise  
AUTOMATE - Implement AI tools to free up your time

Your Human Zone of Skills (What AI Can't Replace):
- Authentic client relationships
- Visionary leadership
- High-value sales conversations
- Original thought leadership
- Personalized coaching delivery
- Intuitive problem-solving
- Ethical decision-making
- Personal brand storytelling

What We'll Automate with AI:
- Email drafts, content creation, social media posts
- Appointment scheduling and calendar management
- Customer service FAQs and initial inquiries
- Market research and competitive analysis
- Graphic design and visual content
- Video editing and content repurposing
- Task management and project tracking
- Bookkeeping and invoicing

Let's start optimizing your 4-hour workday!

Tell me:
1. What does your current 4-hour CEO session look like?
2. What tasks are consuming your time that you wish AI could handle?
3. What's one area where you want to stay hands-on (your Human Zone)?

The more specific you are, the better I can recommend AI tools and workflows to create more time freedom for you!`

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

    if (isWelcome) {
      console.log("[Zone of Genius] Sending welcome introduction")
      return NextResponse.json({ message: FOUR_HOUR_WORKDAY_INTRODUCTION })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Zone of Genius] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const conversationMessages = [
      { role: "system", content: FOUR_HOUR_WORKDAY_PROMPT },
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
