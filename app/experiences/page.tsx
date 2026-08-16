import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getSection } from "@/lib/navigation/primary-nav"

export const metadata: Metadata = {
  title: "Make Time For More Experiences™ | Harmony Lane™",
  description:
    "Your pathway to continue or deepen your Harmony Lane™ experience — from Make Time For More™ on Mondays to the full Harmony Lane™ Membership.",
}

/**
 * /experiences — "Make Time For More Experiences™"
 *
 * The member's upgrade / continuation pathway. This page is navigation
 * architecture only: it surfaces the roadmap (Monday → Week → Month →
 * Quarter → Membership) without hard-coding any Week/Month/Quarter pricing,
 * which is still being finalized. Monday is the only confirmed, purchasable
 * offer today and links to the real /monday checkout experience.
 */
export default function ExperiencesPage() {
  const section = getSection("experiences")
  if (!section) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="mx-auto max-w-4xl px-6 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5D9D61]/10">
            <Sparkles className="h-7 w-7 text-[#5D9D61]" aria-hidden />
          </div>
          <h1 className="font-playfair text-3xl font-medium italic text-[#3A2E33] sm:text-4xl text-balance">
            {section.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[#5C4F55] leading-relaxed text-pretty">
            {section.tagline}
          </p>
        </header>

        {/* Roadmap */}
        <div className="space-y-4">
          {section.workspaces.map((ws) =>
            ws.comingSoon ? (
              <Card
                key={ws.label}
                aria-disabled="true"
                className="border-dashed border-[#E7DFD3] bg-white/40 opacity-80"
              >
                <CardContent className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-playfair text-lg font-medium text-[#3A2E33]">{ws.label}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8C4A0]/30 px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#3A2E33]">
                        <Clock className="h-3 w-3" aria-hidden />
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#5C4F55] leading-relaxed">{ws.description}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Link key={ws.label} href={ws.href} className="group block">
                <Card className="h-full border-[#E7DFD3] bg-white/70 transition-all hover:-translate-y-0.5 hover:border-[#5D9D61]/40 hover:shadow-md">
                  <CardContent className="flex h-full items-start justify-between gap-4 p-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-playfair text-lg font-medium text-[#3A2E33]">{ws.label}</h2>
                        <span className="inline-flex items-center rounded-full bg-[#5D9D61]/10 px-2.5 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#5D9D61]">
                          Available Now
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#5C4F55] leading-relaxed">{ws.description}</p>
                    </div>
                    <ArrowRight
                      className="mt-1 h-5 w-5 shrink-0 text-[#B7AEA4] transition-colors group-hover:text-[#5D9D61]"
                      aria-hidden
                    />
                  </CardContent>
                </Card>
              </Link>
            ),
          )}
        </div>

        <p className="mt-10 text-center font-montserrat text-xs text-[#5C4F55]/70">
          Week, Month, Quarter, and Membership pricing is still being finalized and will appear here once confirmed.
        </p>
      </div>
    </main>
  )
}
