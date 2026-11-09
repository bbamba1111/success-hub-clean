import { type NextRequest, NextResponse } from "next/server"
import { getActiveProvider, getPlan } from "@/lib/payments"

/**
 * Provider-agnostic checkout endpoint. The client POSTs a planId and gets back
 * a redirect `url`. Which provider produces that URL (SamCart today, Stripe
 * later) is resolved here — the client never knows or cares.
 */
export async function POST(req: NextRequest) {
  try {
    const { planId, email } = await req.json()

    const plan = getPlan(planId)
    if (!plan) {
      return NextResponse.json({ error: `Unknown plan: ${planId}` }, { status: 400 })
    }

    const provider = getActiveProvider()
    const result = await provider.createCheckout(plan, { planId, email })

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 },
    )
  }
}
