import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { EgaPageClient } from "@/components/ega/ega-page-client"
import { getOnboardingProgressServer } from "@/lib/onboarding/onboarding-progress"

export default async function EntrepreneurGapAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card px-8 py-10 text-center shadow-sm">
          <h1 className="ds-page-title mb-3">Entrepreneur Gap Assessment™</h1>
          <p className="font-sans text-sm leading-relaxed text-muted-foreground mb-6">
            Sign in to answer &quot;What is getting in your way?&quot; and start building your
            personal Signal → Gap → Solution record.
          </p>
          <Link href="/auth/login" className="ds-btn-primary">
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  // ?onboarding=1 — reached from the required Founder Profile™ → Business
  // Context™ → EGA Screen 1 on-ramp (see business-context-onboarding-flow.tsx
  // and utils/reality-check-storage.ts). In this mode EGA shows ONLY Screen 1
  // (the founder recognizes what's happening, no obstacle diagnosis) and then
  // continues straight to the Cherry Blossom Thank-You™ transition. EGA is
  // not a recurring weekly assessment — outside onboarding this same page
  // runs the full Screen 1 → Screen 2 → Results flow as a self-directed
  // Harmony Blueprint™ destination.
  const params = await searchParams
  const isOnboarding = params.onboarding === "1"
  const progress = isOnboarding ? await getOnboardingProgressServer() : undefined

  return <EgaPageClient onboarding={isOnboarding} progress={progress} />
}
