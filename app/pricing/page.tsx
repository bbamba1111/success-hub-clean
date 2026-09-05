import { redirect } from "next/navigation"

/**
 * /pricing — retired as a separate page. There was too much drift between
 * /pricing, /experiences, and /landing#experiences (three different-looking
 * pricing surfaces). /experiences is now the single canonical destination —
 * this route just forwards here (preserving query params like
 * ?upgrade=true from the middleware paywall redirect) so old links and
 * bookmarks still work.
 */
export default async function PricingRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value)
  }

  const suffix = query.toString()
  redirect(`/experiences${suffix ? `?${suffix}` : ""}`)
}
