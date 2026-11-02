import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { loadBusinessProfile } from "@/lib/business-profile/server"
import { PageHeader } from "@/components/boss/primitives"
import { BusinessProfileEditor } from "@/components/boss/business-profile/profile-editor"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PageHeader
        eyebrow="Business Profile"
        title="What Cherry Blossom™ may say about your business"
        description="Build this over time. Add what you know today, approve the wording you stand behind, and only approved information will ever be used on your behalf."
      />
      {user ? (
        <BusinessProfileEditor data={await loadBusinessProfile(supabase, user.id)} />
      ) : (
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-lg leading-relaxed text-brand-ink">Sign in to view and manage your Business Profile.</p>
          <Link
            href="/auth/login?redirect=/boss/business-profile"
            className="inline-flex h-11 items-center rounded-full bg-brand-green px-5 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
          >
            Sign in
          </Link>
        </section>
      )}
    </>
  )
}
