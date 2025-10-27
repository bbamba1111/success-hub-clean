import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      message: "API is working correctly!",
      timestamp: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Error in test route:", error)
    return NextResponse.json({ error: "Test failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    return NextResponse.json({
      message: "POST request received successfully!",
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Error in test POST route:", error)
    return NextResponse.json({ error: "POST test failed" }, { status: 500 })
  }
}
