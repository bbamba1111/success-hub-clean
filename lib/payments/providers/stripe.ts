/**
 * Stripe provider.
 *
 * Creates a Stripe Checkout Session (hosted, redirect-based) for a plan and
 * returns its `url`. The browser is sent to Stripe's own hosted page — this
 * app never collects or touches card details. Entitlement is granted only
 * after Stripe confirms payment via the `checkout.session.completed` webhook
 * (see app/api/stripe/webhook/route.ts), never at checkout-session creation
 * time.
 *
 * Each plan's Stripe Price ID is configured via env var so the plan catalog
 * in lib/payments/config.ts never has to hardcode Stripe identifiers:
 *
 *   STRIPE_PRICE_MONTHLY
 *   STRIPE_PRICE_ANNUAL
 *   STRIPE_PRICE_VIP
 */
import { stripe } from "@/lib/stripe"
import type { CheckoutRequest, CheckoutResult, PaymentProvider, Plan } from "../types"

function priceIdFor(planId: string): string | undefined {
  const key = `STRIPE_PRICE_${planId.toUpperCase()}`
  return process.env[key]
}

/** VIP is the only plan billed monthly-recurring in the current catalog notes; all current plans are recurring subscriptions. */
function isRecurring(_plan: Plan): boolean {
  return true
}

export const stripeProvider: PaymentProvider = {
  id: "stripe",
  async createCheckout(plan: Plan, request: CheckoutRequest): Promise<CheckoutResult> {
    const priceId = priceIdFor(plan.id)
    if (!priceId) {
      throw new Error(
        `Stripe is not configured for plan "${plan.id}". Set STRIPE_PRICE_${plan.id.toUpperCase()} to a Stripe Price ID.`,
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://success-hub-clean.vercel.app"

    const session = await stripe.checkout.sessions.create({
      mode: isRecurring(plan) ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: request.successUrl || `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: request.cancelUrl || `${appUrl}/pricing`,
      customer_email: request.email,
      // planId travels with the session so the webhook can resolve the exact
      // plan/tier purchased without re-deriving it from product name strings.
      metadata: { planId: plan.id },
      subscription_data: isRecurring(plan) ? { metadata: { planId: plan.id } } : undefined,
    })

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL")
    }

    return { url: session.url, provider: "stripe" }
  },
}
