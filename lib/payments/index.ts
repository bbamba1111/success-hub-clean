/**
 * Payment layer entry point. The app imports from here, never from a specific
 * provider, so the active gateway can change without touching callers.
 */
import { getActiveProviderId } from "./config"
import { samcartProvider } from "./providers/samcart"
import { stripeProvider } from "./providers/stripe"
import type { PaymentProvider } from "./types"

export * from "./types"
export { PLANS, getPlan, getActiveProviderId } from "./config"

export function getActiveProvider(): PaymentProvider {
  return getActiveProviderId() === "stripe" ? stripeProvider : samcartProvider
}
