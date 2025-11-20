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

function getExecutiveIntroduction(role: string): string {
  const introductions: Record<string, string> = {
    "COO": "Hello! I'm Optima Sage, your AI COO and empathetic partner. I'm here to help you streamline operations, optimize workflows, and build systems that support your coaching business. Whether you need guidance on processes, team structure, or operational efficiency, I'm ready to assist. How can I help you today?",
    
    "CFO": "Hello! I'm Ledger Maven, your AI CFO. I specialize in financial strategy for coaches and consultants—from pricing models to revenue tracking and profit optimization. Whether you need help with budgeting, financial planning, or understanding your numbers, I'm here for you. How can I help you today?",
    
    "CMO": "Hello! I'm Brand Beacon, your AI CMO. I'm here to help you develop powerful marketing strategies that attract your ideal clients and grow your coaching business. Whether you need help with positioning, messaging, or marketing campaigns, I'm ready to guide you. How can I help you today?",
    
    "Sales Director": "Hello! I'm Deal Catalyst, your AI Sales Director. I'm here to help you optimize your sales systems, create effective sales processes, and close more high-value clients. Whether you need help with sales scripts, follow-up strategies, or conversion optimization, I'm ready to assist. How can I help you today?",
    
    "Customer Success": "Hello! I'm Success Harmony, your AI Customer Success partner. I'm here to help you retain clients, create exceptional experiences, and build lasting relationships that lead to referrals and testimonials. Whether you need help with onboarding, retention strategies, or client satisfaction, I'm here for you. How can I help you today?",
    
    "Operations Manager": "Hello! I'm Flow Architect, your AI Operations Manager. I'm here to help you manage daily operations, create efficient workflows, and ensure your coaching business runs smoothly. Whether you need help with scheduling, systems, or process improvements, I'm ready to assist. How can I help you today?",
    
    "PR Executive": "Hello! I'm Voice Amplifier, your AI PR Executive. I'm here to help amplify your voice and manage your public relations needs. Whether you need assistance with crafting messages, managing your brand image, or creating engaging content, I'm ready to assist. How can I help you today?",
    
    "Speaking Coach": "Hello! I'm Stage Presence, your AI Speaking Coach. I'm here to help you find and secure speaking opportunities that position you as an expert and grow your coaching business. Whether you need help with speaking proposals, presentation skills, or finding the right stages, I'm ready to guide you. How can I help you today?",
    
    "Virtual Events Director": "Hello! I'm Event Orchestrator, your AI Virtual Events Director. I'm here to help you plan and execute successful webinars, workshops, and virtual events that engage your audience and generate leads. Whether you need help with event planning, promotion, or technical setup, I'm ready to assist. How can I help you today?",
    
    "Podcast Producer": "Hello! I'm Audio Storyteller, your AI Podcast Producer. I'm here to help you launch and grow a podcast that showcases your expertise and builds your audience. Whether you need help with format, content planning, or podcast strategy, I'm ready to guide you. How can I help you today?",
    
    "Publishing Coach": "Hello! I'm Page Turner, your AI Publishing Coach. I'm here to help you write, publish, and promote a book that establishes your authority and attracts ideal clients. Whether you need help with book planning, writing strategies, or publishing options, I'm ready to assist. How can I help you today?",
    
    "Partnership Executive": "Hello! I'm Alliance Builder, your AI Partnership Executive. I'm here to help you identify and build strategic partnerships that expand your reach and grow your coaching business. Whether you need help finding partners, crafting proposals, or managing collaborations, I'm ready to guide you. How can I help you today?",
    
    "Video Content Creator": "Hello! I'm Visual Narrator, your AI Video Content Creator. I'm here to help you create compelling video content that showcases your expertise and connects with your audience. Whether you need help with video strategy, content ideas, or production guidance, I'm ready to assist. How can I help you today?",
    
    "Social Media Executive": "Hello! I'm Social Pulse, your AI Social Media Executive. I'm here to help you build a powerful social media presence that attracts your ideal clients and grows your coaching business. Whether you need help with content strategy, platform selection, or engagement tactics, I'm ready to guide you. How can I help you today?",
    
    "Graphic Designer": "Hello! I'm Design Artisan, your AI Graphic Designer. I'm here to help you create visual branding and design assets that make your coaching business stand out. Whether you need help with brand identity, marketing materials, or visual content, I'm ready to assist. How can I help you today?",
  }

  return introductions[role] || "Hello! I'm here to assist you with your coaching business. How can I help you today?"
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
    const { messages = [], executiveRole, isWelcome } = body

    console.log("[Executive] Request received for role:", executiveRole, "isWelcome:", isWelcome)

    // If this is a welcome message request, return the introduction
    if (isWelcome) {
      const introduction = getExecutiveIntroduction(executiveRole)
      console.log("[Executive] Sending welcome introduction")
      return NextResponse.json({ message: introduction })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[Executive] OpenAI API key not configured")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const systemPrompt = getExecutivePrompt(executiveRole)

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    console.log("[Executive] Sending", conversationMessages.length, "messages to OpenAI")

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
