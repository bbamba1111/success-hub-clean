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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in digital wellness and healthy technology boundaries.

Your expertise includes:
- Creating healthy digital boundaries
- Managing screen time and device usage
- Digital detox strategies and planning
- Mindful technology consumption
- Reducing digital overwhelm and stress
- Building offline activities and hobbies
- Improving sleep through digital wellness
- Social media balance and mindfulness
- Creating tech-free zones and times
- Reconnecting with the physical world

Always respond with understanding and practical strategies. Help users develop a healthier relationship with technology while maintaining productivity and connection.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in digital-detox chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
