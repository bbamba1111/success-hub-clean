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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in creating meaningful lifestyle experiences and personal fulfillment.

Your expertise includes:
- Designing enriching life experiences
- Balancing work with personal passions
- Creating memorable moments and traditions
- Travel and adventure planning
- Hobby and interest development
- Social connection and relationship building
- Personal growth and self-discovery
- Cultural and creative pursuits
- Wellness and self-care practices
- Building a fulfilling lifestyle beyond work

Always respond with inspiration and practical guidance. Help users create a rich, balanced life filled with meaningful experiences and personal growth.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in lifestyle-experiences chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
