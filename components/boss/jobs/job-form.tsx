"use client"

import { useState, useTransition } from "react"
import { createJob, updateJob, type JobInput } from "@/app/actions/boss-jobs"
import {
  EXECUTIVES,
  JOB_FUNCTIONS,
  PERMISSION_LEVELS,
  type AssigneeType,
  type Job,
  type TeamMember,
} from "@/lib/boss/jobs/definitions"
import { fieldClass, labelClass } from "@/components/boss/primitives"

function assigneeValue(job?: Job) {
  if (!job) return "founder"
  if (job.assigneeType === "executive") return `executive:${job.assigneeExecutiveId}`
  if (job.assigneeType === "team_member") return `team_member:${job.assigneeTeamMemberId}`
  return job.assigneeType
}

function parseAssignee(value: string): JobInput["assignee"] {
  const [type, id] = value.split(":") as [AssigneeType, string | undefined]
  if (type === "executive") return { type, executiveId: id }
  if (type === "team_member") return { type, teamMemberId: id }
  return { type }
}

export function JobForm({
  job,
  team,
  onDone,
}: {
  job?: Job
  team: TeamMember[]
  onDone: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const activeTeam = team.filter((m) => !m.archived || m.id === job?.assigneeTeamMemberId)

  function submit(formData: FormData) {
    const input: JobInput = {
      title: String(formData.get("title") ?? ""),
      details: String(formData.get("details") ?? ""),
      businessFunction: String(formData.get("businessFunction") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
      assignee: parseAssignee(String(formData.get("assignee") ?? "founder")),
      permissionLevel: String(formData.get("permissionLevel") ?? "research"),
    }
    startTransition(async () => {
      const result = job ? await updateJob(job.id, input) : await createJob(input)
      if (!result.ok) return setError(result.error)
      setError(null)
      onDone()
    })
  }

  const idPrefix = job ? `job-${job.id}` : "new-job"

  return (
    <form action={submit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-title`} className={labelClass}>
          What is the job?
        </label>
        <input
          id={`${idPrefix}-title`}
          name="title"
          required
          maxLength={200}
          defaultValue={job?.title}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${idPrefix}-details`} className={labelClass}>
          Details <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-details`}
          name="details"
          rows={3}
          maxLength={4000}
          defaultValue={job?.details ?? ""}
          className={`${fieldClass} h-auto py-3 leading-relaxed`}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-assignee`} className={labelClass}>
            Who is doing it?
          </label>
          <select
            id={`${idPrefix}-assignee`}
            name="assignee"
            defaultValue={assigneeValue(job)}
            className={fieldClass}
          >
            <option value="founder">Me</option>
            <option value="cherry">Cherry Blossom™</option>
            <optgroup label="Executives">
              {EXECUTIVES.map((e) => (
                <option key={e.id} value={`executive:${e.id}`}>
                  {e.name}
                </option>
              ))}
            </optgroup>
            {activeTeam.length > 0 && (
              <optgroup label="My team">
                {activeTeam.map((m) => (
                  <option key={m.id} value={`team_member:${m.id}`}>
                    {m.name}
                    {m.role ? ` (${m.role})` : ""}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-function`} className={labelClass}>
            Business function
          </label>
          <select
            id={`${idPrefix}-function`}
            name="businessFunction"
            defaultValue={job?.businessFunction ?? "operations"}
            className={fieldClass}
          >
            {JOB_FUNCTIONS.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-due`} className={labelClass}>
            Due date <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-due`}
            name="dueDate"
            type="date"
            defaultValue={job?.dueDate ?? ""}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${idPrefix}-permission`} className={labelClass}>
            What are they allowed to do?
          </label>
          <select
            id={`${idPrefix}-permission`}
            name="permissionLevel"
            defaultValue={job?.permissionLevel ?? "research"}
            className={fieldClass}
          >
            {PERMISSION_LEVELS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}: {p.hint}
              </option>
            ))}
          </select>
        </div>
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
          {pending ? "Saving…" : job ? "Save changes" : "Save job"}
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
