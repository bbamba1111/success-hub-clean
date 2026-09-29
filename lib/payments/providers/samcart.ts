/**
 * SamCart provider (Phase 1 default).
 *
 * SamCart hosts its own checkout pages, so "creating a checkout" simply means
 * resolving the right hosted checkout URL for the plan. Product URLs are
 * configured via env vars so no code changes are needed to point at real
 * SamCart products:
 *
 *   SAMCART_CHECKOUT_URL_MONTHLY
 *   SAMCART_CHECKOUT_URL_ANNUAL
 *   SAMCART_CHECKOUT_URL_VIP
 *
 * If a URL isn't configured yet, we fall back to the internal account-creation
 * page (/welcome) so the end-to-end member flow is walkable during Phase 1.
 */
import type { CheckoutRequest, CheckoutResult, PaymentProvider, Plan } from "../types"

function configuredUrl(planId: string): string | undefined {
  const key = `SAMCART_CHECKOUT_URL_${planId.toUpperCase()}`
  return process.env[key]
}

export const samcartProvider: PaymentProvider = {
  id: "samcart",
  createCheckout(plan: Plan, request: CheckoutRequest): CheckoutResult {
    const base = configuredUrl(plan.id)

    // Fallback keeps the flow demoable before real SamCart products are wired.
    const fallback = `/welcome?product=${encodeURIComponent(plan.name)}${
      request.email ? `&email=${encodeURIComponent(request.email)}` : ""
    }`

    if (!base) {
      return { url: fallback, provider: "samcart" }
    }

    const url = new URL(base)
    if (request.email) url.searchParams.set("email", request.email)
    return { url: url.toString(), provider: "samcart" }
  },
}
