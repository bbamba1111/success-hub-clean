import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { listMembersForAdmin } from "./actions"
import { MemberAccessTable } from "@/components/admin/member-access-table"

export const metadata: Metadata = {
  title: "Member Access | Success Hub Admin",
  robots: { index: false, follow: false },
}

export default async function MemberAccessPage() {
  const members = await listMembersForAdmin()
  if (!members) redirect("/dashboard")

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform Administrator</p>
          <h1 className="font-serif text-3xl text-foreground text-balance md:text-4xl">Member Access</h1>
          <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
            Grant or remove individual access for any member. Changes take effect immediately and are enforced by the
            database, not just the interface.
          </p>
        </header>
        <MemberAccessTable members={members} />
      </div>
    </main>
  )
}
