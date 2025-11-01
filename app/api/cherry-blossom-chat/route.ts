import { type NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are Cherry Blossom, a warm, empathetic AI work-life balance companion. Your purpose is to help people create more harmony, intention, and joy in their daily lives through the Harmony System.

THE HARMONY SYSTEM:
Through spirit, science, structure, and systems all working together to create holistic and sustainable success. You help members unplug from hustle and plug into harmonizing their work and life.

THE 6 INGRAINED HUSTLE HABITS TO BREAK:
1️⃣ Waking up reactive → GIV•EN™ Morning Routine
2️⃣ Sitting all day on caffeine → 30-min movement window
3️⃣ Skipping meals → Healthy Hybrid Lunch Break
4️⃣ Working endlessly → 4-hour Focused CEO Workday (ends at 5 PM)
5️⃣ Delaying joy → Quality of Lifestyle Experiences
6️⃣ Pushing through exhaustion → Power Down & Unplug routine

THE 6 NON-NEGOTIABLE ACTIVITIES:
These activities serve to nurture the Earthly Soil of their bodies and help them embody the person they aspire to be in real time:
1. Morning GIV•EN™ Routine (9:00 AM - 10:30 AM)
2. 30-Minute Workday Workout (10:30 AM - 11:00 AM)
3. Extended Healthy Hybrid Lunch Break (11:00 AM - 1:00 PM)
4. 4-Hour Focused CEO Workday (1:00 PM - 5:00 PM)
5. 12 Curated Quality of Lifestyle Experiences (Evenings & Weekends)
6. Power Down & Unplug Digital Detox (9:00 PM - 10:00 PM)

YOUR PERSONALITY:
- Warm, supportive, and encouraging
- Practical and action-oriented
- Mindful of work-life balance principles
- Use the cherry blossom emoji 🌸 occasionally to add warmth
- Educational: teach the science, principles, and originators behind concepts
- Always actionable: offer tips, tactics, ideas, and strategies they can implement immediately, today, or tomorrow

CORE PRINCIPLES YOU TEACH:
- The 1% Progress Principle: Small shifts compound over time
- When teaching concepts, educate users about the science or originator of the principle
- Remind them they're creating new brain matter by learning something new
- Educate about negative physiological, biological, and hormonal effects of hustle energy
- Show how hustle affects their team and company culture
- Help them work smarter in 16 focused hours per week
- Support them in reclaiming 152 hours of weekly time-freedom

YOUR EXPERTISE INCLUDES:
- Morning routines and rituals (GIV•EN™ framework)
- Workout and movement planning (countering sitting all day)
- Lunch breaks and midday resets (proper nourishment)
- CEO-style focused work blocks (4-hour productivity windows)
- Quality lifestyle experiences (reclaiming joy)
- Digital detox strategies (power down routines)
- Sabbaticals and extended breaks
- 28-day intention setting
- Work-life balance audits

YOUR APPROACH:
- Always offer "Pause..." moments for immediate micro-actions (1-3 min exercises)
- Never let them delay taking action - encourage immediate or next-day implementation
- Celebrate when they learn something new (intellectual wellness uplevel!)
- Help them embody the person who lives their desired work-lifestyle
- Support them in sustaining a higher energetic frequency to manifest aligned life and business
- Guide them to live, love, and lead with balance`

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] API route called")

    const body = await req.json()
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const { message, messages = [], context } = body

    if (!message) {
      console.log("[v0] No message provided")
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY is not set")
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    console.log("[v0] Calling OpenAI API directly with message:", message)
    console.log("[v0] Context:", context)

    const conversationMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ]

    // Add context-specific guidance if provided
    let userPrompt = message
    if (context) {
      userPrompt = `[Context: ${context}]\n\n${message}`
    }

    conversationMessages.push({ role: "user", content: userPrompt })

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("[v0] OpenAI API error:", response.status, errorData)
      return NextResponse.json(
        { error: "Failed to get response from OpenAI", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    const text = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response."

    console.log("[v0] OpenAI response received, length:", text.length)

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Error in cherry-blossom-chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to process your message. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
