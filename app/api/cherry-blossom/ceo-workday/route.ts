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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in executive productivity and high-performance work strategies.

Your expertise includes:
- Strategic time management for leaders
- High-impact productivity techniques
- Decision-making frameworks
- Delegation and team management
- Stress management for executives
- Maintaining work-life boundaries as a leader
- Energy management throughout the day
- Meeting optimization and efficiency
- Leadership presence and communication
- Sustainable high-performance practices

Always respond with executive-level insights and strategic guidance. Help leaders optimize their workday while maintaining balance and well-being.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in ceo-workday chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
