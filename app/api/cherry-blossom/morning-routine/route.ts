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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in morning routines and mindful starts to the day.

Your expertise includes:
- Creating personalized morning routines
- Mindfulness and meditation practices
- Energy optimization strategies
- Healthy morning habits
- Time management for busy mornings
- Setting positive intentions for the day
- Stress reduction techniques
- Work-life balance through morning practices
- Sustainable routine building
- Adapting routines to different lifestyles

Always respond with warmth, wisdom, and practical guidance. Help users create morning routines that set them up for success and balance throughout their day.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in morning-routine chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
