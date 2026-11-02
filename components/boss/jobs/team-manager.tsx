"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import {
  addTeamMember,
  setTeamMemberArchived,
  updateTeamMember,
  type TeamMemberInput,
} from "@/app/actions/boss-jobs"
import { EXECUTIVES, JOB_FUNCTIONS, labelFor, type TeamMember } from "@/lib/boss/jobs/definitions"
import { fieldClass, labelClass } from "@/components/boss/primitives"

const smallButton =
  "inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-brand-ink hover:bg-muted disabled:opacity-60"

function MemberForm({ member, onDone }: { member?: TeamMember; onDone: () => void }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const idPrefix = member ? `member-${member.id}` : "new-member"

  function submit(fd: FormData) {
    const input: TeamMemberInput = {
      name: String(fd.get("name") ?? ""),
      role: String(fd.get("role") ?? ""),
      memberType: String(fd.get("memberType") ?? "employee"),
      businessFunctions: fd.getAll("businessFunctions").map(String),
      note: String(fd.get("note") ?? ""),
    }
    startTransition(async () => {
      const result = member ? await updateTeamMember(member.id, input) : await addTeamMember(input)
      if (!result.ok) return setError(result.error)
      setError(null)
      onDone()
    })
  }

  return (
    <form action={submit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            required
            maxLength={120}
            defaultValue={member?.name}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-role`} className={labelClass}>
            Role <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-role`}
            name="role"
            maxLength={120}
            defaultValue={member?.role ?? ""}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-type`} className={labelClass}>
            Type
          </label>
          <select
            id={`${idPrefix}-type`}
            name="memberType"
            defaultValue={member?.memberType ?? "employee"}
            className={fieldClass}
          >
            <option value="employee">Employee</option>
            <option value="contractor">Contractor</option>
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelClass}>Business functions they work in</legend>
        <div className="flex flex-wrap gap-3">
          {JOB_FUNCTIONS.map((f) => (
            <label key={f.key} className="inline-flex items-center gap-2 text-base text-brand-ink">
              <input
                type="checkbox"
                name="businessFunctions"
                value={f.key}
                defaultChecked={member?.businessFunctions.includes(f.key)}
                className="h-5 w-5 accent-brand-green"
              />
              {f.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-note`} className={labelClass}>
          Note <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-note`}
          name="note"
          rows={2}
          maxLength={1000}
          defaultValue={member?.note ?? ""}
          className={`${fieldClass} h-auto py-3`}
        />
      </div>

      {error && (
        <p role="alert" className="text-base text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center rounded-xl bg-brand-green px-6 text-base font-medium text-primary-foreground hover:bg-brand-green-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : member ? "Save changes" : "Add team member"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex h-12 items-center rounded-xl border border-border px-6 text-base font-medium text-brand-ink hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function MemberRow({ member, openJobs }: { member: TeamMember; openJobs: number }) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (editing) return <MemberForm member={member} onDone={() => setEditing(false)} />

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-semibold text-brand-ink">
          {member.name}
          {member.archived && <span className="ml-2 text-sm font-normal text-muted-foreground">(archived)</span>}
        </p>
        <p className="text-base text-muted-foreground">
          {[member.role, member.memberType === "contractor" ? "Contractor" : "Employee"].filter(Boolean).join(" · ")}
          {member.businessFunctions.length > 0 &&
            ` · ${member.businessFunctions.map((f) => labelFor(JOB_FUNCTIONS, f)).join(", ")}`}
        </p>
        <p className="text-sm text-muted-foreground">
          {openJobs} open {openJobs === 1 ? "job" : "jobs"}
        </p>
        {error && (
          <p role="alert" className="text-base text-destructive">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {!member.archived && (
          <button type="button" className={smallButton} onClick={() => setEditing(true)}>
            Change
          </button>
        )}
        <button
          type="button"
          className={smallButton}
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await setTeamMemberArchived(member.id, !member.archived)
              setError(result.ok ? null : result.error)
            })
          }
        >
          {member.archived ? "Bring back" : "Archive"}
        </button>
      </div>
    </li>
  )
}

export function TeamManager({ team, openJobsByMember }: { team: TeamMember[]; openJobsByMember: Record<string, number> }) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-brand-ink">Your people</h2>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex h-12 items-center gap-2 self-start rounded-xl bg-brand-green px-6 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              Add a team member
            </button>
          )}
        </div>
        {adding && <MemberForm onDone={() => setAdding(false)} />}
        {team.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-base text-muted-foreground">
            No team members yet. Add the people who help you, then give them jobs.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {team.map((m) => (
              <MemberRow key={m.id} member={m} openJobs={openJobsByMember[m.id] ?? 0} />
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-brand-ink">Cherry Blossom™ and your executives</h2>
        <p className="text-base leading-relaxed text-muted-foreground">
          These are built in and can&apos;t be changed. You decide what each job allows them to do.
        </p>
        <ul className="grid gap-3 md:grid-cols-2">
          {[{ id: "cherry", name: "Cherry Blossom™" }, ...EXECUTIVES].map((e) => (
            <li key={e.id} className="rounded-xl border border-border bg-card p-4 text-base font-medium text-brand-ink">
              {e.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
