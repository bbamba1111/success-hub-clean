"use client"

/**
 * Client-side entry to start a purchase. Components call `startCheckout(planId)`
 * and are redirected to the active provider's checkout. They never import a
 * provider or know which gateway is live.
 */
export async function startCheckout(planId: string, email?: string): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, email }),
  })

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "Checkout failed" }))
    throw new Error(error ?? "Checkout failed")
  }

  const { url } = (await res.json()) as { url: string }
  window.location.href = url
}
