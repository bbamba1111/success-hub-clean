import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message, userName } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide. A user named ${userName || "there"} is asking: ${message}

Please provide helpful guidance about work-life balance audit reviews, creating improvement plans, and setting intentions for positive change.

Respond with warmth, wisdom, and practical advice.`,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Error in audit review:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
