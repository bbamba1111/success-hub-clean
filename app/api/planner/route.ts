import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { message, userName } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are Cherry Blossom, an AI-powered Work-Life Balance Co-Guide and planner. A user named ${userName || "there"} is asking: ${message}

Please provide guidance about planning work-life balance activities, scheduling wellness practices, and organizing daily routines for optimal balance.

Respond with practical planning advice and organizational strategies.`,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("Error in planner:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
