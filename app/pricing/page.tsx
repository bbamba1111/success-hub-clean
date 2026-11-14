import { redirect } from "next/navigation"

export const metadata = {
  title: "Work-Life Balance Business Week™ | Pricing | Harmony Lane™",
  description: "Enrollment information for the Work-Life Balance Business Week™.",
}

/**
 * The Reality Check has its own next-step destination. Keep this page free
 * of unapproved prices and checkout actions until the offer is finalized.
 * Existing member upgrade/paywall links continue to use /experiences.
 */
export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  if (params.source !== "reality-check") {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") query.set(key, value)
    }
    const suffix = query.toString()
    redirect(`/experiences${suffix ? `?${suffix}` : ""}`)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8F4] px-5 py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-[#E8D5DC] bg-white px-7 py-10 text-center shadow-sm sm:px-12 sm:py-14">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#5A7F46]">
          Your Reality Check™ is complete
        </p>
        <h1 className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl">
          Work-Life Balance Business Week™
        </h1>
        <p className="mx-auto mt-5 max-w-xl font-poppins text-base leading-relaxed text-[#5A4A52]">
          You’ve completed your free Work-Life Balance Reality Check™. Enrollment details and pricing for the
          Work-Life Balance Business Week™ are being finalized and will be published here when confirmed.
        </p>
        <p className="mt-6 font-poppins text-sm text-[#8A7A82]">
          No payment is being collected on this page.
        </p>
      </section>
    </main>
  )
}
