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
          content: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide specializing in helping people review their work-life balance audit results and create actionable improvement plans.

Your expertise includes:
- Analyzing work-life balance assessment results
- Identifying patterns and areas for improvement
- Creating personalized action plans
- Setting realistic and achievable goals
- Prioritizing changes for maximum impact
- Understanding the interconnections between different life areas
- Providing encouragement and motivation for change
- Breaking down overwhelming changes into manageable steps
- Celebrating progress and small wins
- Adjusting plans based on real-world constraints

Always respond with insight, empathy, and practical guidance. Help users understand their audit results and feel empowered to make positive changes in their work-life balance.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in audit-review chat:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
