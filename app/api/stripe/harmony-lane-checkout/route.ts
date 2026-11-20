import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

/**
 * Dedicated recurring checkout for the Harmony Lane™ founding membership.
 * The Stripe Price ID is supplied through STRIPE_PRICE_HARMONY_LANE_MONTHLY.
 * The configured Stripe Price must be $1,997 USD recurring every 30 days.
 */
export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_HARMONY_LANE_MONTHLY

    if (!priceId) {
      return NextResponse.json(
        { error: "Harmony Lane checkout is not configured yet. Please contact us for enrollment." },
        { status: 503 },
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://free-reality-check.vercel.app"
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?source=reality-check`,
      metadata: { planId: "harmony-lane" },
      subscription_data: { metadata: { planId: "harmony-lane" } },
    })

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 })
    }

    return NextResponse.json({ url: session.url, provider: "stripe" })
  } catch (error) {
    console.error("[harmony-lane-checkout] Stripe session creation failed:", error)
    return NextResponse.json(
      { error: "We couldn't start secure checkout. Please try again shortly." },
      { status: 500 },
    )
  }
}
