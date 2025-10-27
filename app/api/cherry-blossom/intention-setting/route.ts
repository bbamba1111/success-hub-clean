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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in intention setting and creating powerful 28-day transformation plans.

Your expertise includes:
- The GIV•EN™ Framework for intention setting
- Creating meaningful and achievable intentions
- 28-day transformation planning
- Goal setting and achievement strategies
- Personal development and growth planning
- Habit formation and behavior change
- Accountability and progress tracking
- Overcoming obstacles and setbacks
- Celebrating milestones and progress
- Creating sustainable life changes

Always respond with wisdom, encouragement, and practical guidance. Help users set powerful intentions and create actionable plans for meaningful life transformation.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in intention-setting chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
