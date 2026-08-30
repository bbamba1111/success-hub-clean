import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { EgaPageClient } from "@/components/ega/ega-page-client"

export default async function EntrepreneurGapAssessmentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && false) {
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

  return <EgaPageClient />
}
