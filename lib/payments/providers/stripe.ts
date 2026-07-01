/**
 * Stripe provider (future-ready placeholder).
 *
 * When the platform migrates to Stripe, implement `createCheckout` here using
 * the Stripe SDK (create a Checkout Session and return its `url`). The rest of
 * the application does not change — only PAYMENT_PROVIDER=stripe and this file.
 *
 * Intentionally not wired in Phase 1 (we launch on SamCart). Kept as a typed
 * stub so the abstraction is complete and the migration path is obvious.
 */
import type { CheckoutRequest, CheckoutResult, PaymentProvider, Plan } from "../types"

export const stripeProvider: PaymentProvider = {
  id: "stripe",
  createCheckout(_plan: Plan, _request: CheckoutRequest): CheckoutResult {
    // Future: const session = await stripe.checkout.sessions.create({ ... })
    //         return { url: session.url, provider: "stripe" }
    throw new Error(
      "Stripe provider is not configured yet. Set PAYMENT_PROVIDER=samcart, or implement createCheckout in lib/payments/providers/stripe.ts.",
    )
  },
}
