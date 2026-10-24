"use client"

import { useMemo, useState, useTransition } from "react"
import { setMemberEntitlement, setMemberTier } from "@/app/admin/members/actions"
import {
  GRANTABLE_ENTITLEMENTS,
  MEMBERSHIP_TIERS,
  isMembershipTier,
  membershipTierLabel,
  type MemberAccessRow,
} from "@/lib/admin/member-access"

export function MemberAccessTable({ members }: { members: MemberAccessRow[] }) {
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState(members)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const [, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((m) => m.email.toLowerCase().includes(q) || (m.fullName ?? "").toLowerCase().includes(q))
  }, [rows, query])

  function updateRow(id: string, patch: (row: MemberAccessRow) => MemberAccessRow) {
    setRows((prev) => prev.map((r) => (r.id === id ? patch(r) : r)))
  }

  function toggleEntitlement(member: MemberAccessRow, entitlementId: string, active: boolean) {
    const key = `${member.id}:${entitlementId}`
    setPendingKey(key)
    setMessage(null)
    startTransition(async () => {
      const result = await setMemberEntitlement({ userId: member.id, entitlement: entitlementId, active })
      setPendingKey(null)
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error })
        return
      }
      updateRow(member.id, (r) => ({
        ...r,
        entitlements: {
          ...r.entitlements,
          [entitlementId]: { status: active ? "active" : "canceled", source: r.entitlements[entitlementId]?.source ?? "admin_grant" },
        },
      }))
      setMessage({ tone: "ok", text: `${active ? "Granted" : "Removed"} access for ${member.email}` })
    })
  }

  function changeTier(member: MemberAccessRow, tier: string) {
    const key = `${member.id}:tier`
    setPendingKey(key)
    setMessage(null)
    startTransition(async () => {
      const result = await setMemberTier({ userId: member.id, tier })
      setPendingKey(null)
      if (!result.ok) {
        setMessage({ tone: "error", text: result.error })
        return
      }
      updateRow(member.id, (r) => ({ ...r, membershipTier: tier }))
      setMessage({ tone: "ok", text: `Updated tier for ${member.email}` })
    })
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="member-list-heading">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 id="member-list-heading" className="text-sm font-semibold text-foreground">
          {filtered.length} of {rows.length} members
        </h2>
        <label className="flex w-full flex-col gap-1 md:w-80">
          <span className="sr-only">Search members</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <p role="status" aria-live="polite" className={message?.tone === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
        {message?.text ?? ""}
      </p>

      <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {filtered.map((member) => (
          <li key={member.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-medium text-foreground">{member.fullName || member.email}</p>
              {member.fullName && <p className="truncate text-sm text-muted-foreground">{member.email}</p>}
              {member.role === "platform_admin" && (
                <span className="w-fit rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  Platform Administrator
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Tier
                <select
                  value={member.membershipTier ?? ""}
                  disabled={pendingKey === `${member.id}:tier`}
                  onChange={(e) => changeTier(member, e.target.value)}
                  className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  {!member.membershipTier && <option value="">Not set</option>}
                  {member.membershipTier && !isMembershipTier(member.membershipTier) && (
                    <option value={member.membershipTier} disabled>
                      {membershipTierLabel(member.membershipTier)}
                    </option>
                  )}
                  {MEMBERSHIP_TIERS.map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.label}
                    </option>
                  ))}
                </select>
              </label>

              {GRANTABLE_ENTITLEMENTS.map((ent) => {
                const active = member.entitlements[ent.id]?.status === "active"
                const busy = pendingKey === `${member.id}:${ent.id}`
                return (
                  <label key={ent.id} className="flex items-center gap-3 text-sm text-foreground" title={ent.description}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      disabled={busy}
                      onClick={() => toggleEntitlement(member, ent.id, !active)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${active ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className="sr-only">{ent.label}</span>
                      <span
                        aria-hidden="true"
                        className={`inline-block h-5 w-5 rounded-full bg-background shadow transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                    <span aria-hidden="true">{ent.label}</span>
                  </label>
                )
              })}
            </div>
          </li>
        ))}
        {filtered.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No members match that search.</li>}
      </ul>
    </section>
  )
}
