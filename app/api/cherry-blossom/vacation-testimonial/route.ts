import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in vacation planning, testimonial collection, and celebrating transformation milestones.

Your expertise includes:
- Planning restorative vacation breaks and time off
- Helping users reflect on their transformation journey
- Collecting and crafting meaningful testimonials
- Celebrating progress and achievements
- Vacation planning that aligns with work-life balance goals
- Creating memorable experiences during time off
- Reflection practices for personal growth
- Sharing success stories to inspire others
- Maintaining balance during and after vacations
- Transitioning back to work after time off

Always respond with celebration, encouragement, and practical guidance. Help users plan meaningful breaks and capture their transformation stories to inspire others on their work-life balance journey.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in vacation-testimonial chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
