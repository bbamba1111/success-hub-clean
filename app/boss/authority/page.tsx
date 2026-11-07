import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { loadJobsData } from "@/lib/boss/jobs/server"
import { ACTION_KINDS, PERMISSION_LEVELS, isClosed, labelFor } from "@/lib/boss/jobs/definitions"
import { PageHeader, Panel } from "@/components/boss/primitives"
import { PreauthorizationPanel } from "@/components/boss/jobs/preauthorization-panel"
import { PreauthorizationList } from "@/components/boss/authority/preauthorization-list"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const header = (
    <PageHeader
      eyebrow="Authority & Permissions"
      title="Who is allowed to do what"
      description="Every job has a permission level you choose. Cherry Blossom™ and your executives can only suggest work. Nothing happens without your OK, unless you set limits here."
    />
  )

  if (!user) {
    return (
      <>
        {header}
        <section className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-lg leading-relaxed text-brand-ink">Sign in to see and manage your permissions.</p>
          <Link
            href="/auth/login?redirect=/boss/authority"
            className="inline-flex h-11 items-center rounded-full bg-brand-green px-5 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
          >
            Sign in
          </Link>
        </section>
      </>
    )
  }

  const data = await loadJobsData(supabase, user.id)
  const openJobs = data.jobs.filter((job) => !isClosed(job))
  const levelCounts = new Map<string, number>()
  for (const job of openJobs) levelCounts.set(job.permissionLevel, (levelCounts.get(job.permissionLevel) ?? 0) + 1)

  return (
    <>
      {header}

      <section aria-labelledby="levels-heading" className="flex flex-col gap-4">
        <h2 id="levels-heading" className="text-xl font-semibold text-brand-ink">
          The four permission levels
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {PERMISSION_LEVELS.map((level) => {
            const kinds = ACTION_KINDS.filter((k) => k.requires === level.key)
            return (
              <li key={level.key} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-lg font-semibold text-brand-ink">{level.label}</p>
                  <p className="text-sm text-brand-ink-soft">
                    {levelCounts.get(level.key) ?? 0} open {levelCounts.get(level.key) === 1 ? "job" : "jobs"}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-brand-ink-soft">{level.hint}</p>
                {kinds.length > 0 && (
                  <p className="text-sm leading-relaxed text-brand-ink">
                    Unlocks: {kinds.map((k) => k.label).join(", ")}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        <p className="text-base leading-relaxed text-brand-ink-soft">
          You set a job&apos;s level when you create or edit it on the{" "}
          <Link href="/boss/queue" className="font-medium text-brand-green-dark underline underline-offset-4">
            Jobs page
          </Link>
          . Even at &ldquo;Do within limits&rdquo;, an action only runs on its own if an active limit below covers it.
        </p>
      </section>

      <Panel
        title="Pre-approved limits"
        description="Everything you have allowed ahead of time, read directly from your saved records. Withdrawing a limit takes effect immediately."
      >
        <PreauthorizationList preauthorizations={data.preauthorizations} jobs={data.jobs} />
      </Panel>

      <Panel
        title="Set limits for a job"
        description="Open a job to allow specific actions ahead of time. Limits only apply to jobs set to “Do within limits”."
      >
        {openJobs.length === 0 ? (
          <p className="text-base leading-relaxed text-brand-ink-soft">
            You have no open jobs yet.{" "}
            <Link href="/boss/queue" className="font-medium text-brand-green-dark underline underline-offset-4">
              Add a job
            </Link>{" "}
            first.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {openJobs.map((job) => (
              <li key={job.id}>
                <details className="group rounded-xl border border-border">
                  <summary className="flex cursor-pointer flex-col gap-1 p-4 md:flex-row md:items-center md:justify-between">
                    <span className="text-base font-medium text-brand-ink">{job.title}</span>
                    <span className="text-sm text-brand-ink-soft">
                      {labelFor(PERMISSION_LEVELS, job.permissionLevel)}
                    </span>
                  </summary>
                  <div className="border-t border-border p-4">
                    <PreauthorizationPanel job={job} preauthorizations={data.preauthorizations} />
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}
