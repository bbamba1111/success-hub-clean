import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getSection, type PrimarySectionId } from "@/lib/navigation/primary-nav"

/**
 * SectionHub — Pass 1 landing page for a primary IA section (Lead / Share / Grow).
 *
 * Composes the section's EXISTING workspaces into a single, clear home. No
 * feature is redesigned here; each card links to the workspace's current route.
 */
export function SectionHub({ sectionId }: { sectionId: PrimarySectionId }) {
  const section = getSection(sectionId)
  if (!section) return null

  const Icon = section.icon

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Hub header */}
        <header className="mb-10 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5D9D61]/10">
            <Icon className="h-7 w-7 text-[#5D9D61]" />
          </div>
          <div>
            <h1 className="font-playfair text-3xl font-medium italic text-[#3A2E33] sm:text-4xl text-balance">
              {section.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[#5C4F55] leading-relaxed text-pretty">{section.tagline}</p>
          </div>
        </header>

        {/* Workspace cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {section.workspaces.map((ws) => (
            <Link key={ws.href} href={ws.href} className="group block">
              <Card className="h-full border-[#E7DFD3] bg-white/70 transition-all hover:-translate-y-0.5 hover:border-[#5D9D61]/40 hover:shadow-md">
                <CardContent className="flex h-full items-start justify-between gap-4 p-5">
                  <div>
                    <h2 className="font-playfair text-lg font-medium text-[#3A2E33]">{ws.label}</h2>
                    <p className="mt-1 text-sm text-[#5C4F55] leading-relaxed">{ws.description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#B7AEA4] transition-colors group-hover:text-[#5D9D61]" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
