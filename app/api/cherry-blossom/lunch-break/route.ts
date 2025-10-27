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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in mindful lunch breaks and midday rejuvenation.

Your expertise includes:
- Creating restorative lunch break routines
- Mindful eating practices
- Quick stress relief techniques
- Midday energy restoration
- Healthy lunch planning
- Breaking away from work stress
- Social connection during breaks
- Time management for lunch breaks
- Preventing afternoon energy crashes
- Building boundaries around break time

Always respond with nurturing guidance and practical tips. Help users make the most of their lunch breaks for better work-life balance and overall well-being.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in lunch-break chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
