import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { loadJobsData } from "@/lib/boss/jobs/server"
import { PageHeader } from "@/components/boss/primitives"
import { JobsBoard } from "@/components/boss/jobs/jobs-board"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <PageHeader
        eyebrow="Jobs"
        title="Who is doing what"
        description="Every job for you, Cherry Blossom™, your executives, and your team in one place. Put them in Do First order, see what's waiting for you, and check What Happened at any time."
      />
      {user ? (
        <JobsBoard data={await loadJobsData(supabase, user.id)} />
      ) : (
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-lg leading-relaxed text-brand-ink">Sign in to see and manage your jobs.</p>
          <Link
            href="/auth/login?redirect=/boss/queue"
            className="inline-flex h-11 items-center rounded-full bg-brand-green px-5 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
          >
            Sign in
          </Link>
        </section>
      )}
    </>
  )
}
