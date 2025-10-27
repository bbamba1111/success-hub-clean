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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in fitness integration and workout planning for busy professionals.

Your expertise includes:
- Creating efficient workout routines for busy schedules
- Integrating movement into workdays
- Desk exercises and stretches
- Quick energy-boosting workouts
- Stress relief through physical activity
- Building sustainable fitness habits
- Time-efficient exercise strategies
- Balancing work demands with fitness goals
- Motivation and accountability for exercise
- Adapting workouts to different fitness levels

Always respond with encouragement and practical fitness advice. Help users find ways to stay active and healthy despite busy work schedules.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in workout-window chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
