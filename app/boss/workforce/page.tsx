import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { loadTeam } from "@/lib/boss/jobs/server"
import { PageHeader } from "@/components/boss/primitives"
import { TeamManager } from "@/components/boss/jobs/team-manager"

export const dynamic = "force-dynamic"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let content
  if (user) {
    const [team, { data: jobs }] = await Promise.all([
      loadTeam(supabase, user.id),
      supabase
        .from("boss_jobs")
        .select("assignee_team_member_id")
        .eq("user_id", user.id)
        .eq("assignee_type", "team_member")
        .eq("stopped", false)
        .neq("status", "done"),
    ])
    const openJobsByMember: Record<string, number> = {}
    for (const j of jobs ?? []) {
      const id = j.assignee_team_member_id as string
      openJobsByMember[id] = (openJobsByMember[id] ?? 0) + 1
    }
    content = <TeamManager team={team} openJobsByMember={openJobsByMember} />
  } else {
    content = (
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6">
        <p className="text-lg leading-relaxed text-brand-ink">Sign in to manage your team.</p>
        <Link
          href="/auth/login?redirect=/boss/workforce"
          className="inline-flex h-11 items-center rounded-full bg-brand-green px-5 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
        >
          Sign in
        </Link>
      </section>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Team"
        title="The people and helpers you give jobs to"
        description="Add your employees and contractors so you can give them jobs. Cherry Blossom™ and your executives are always here."
      />
      {content}
    </>
  )
}
