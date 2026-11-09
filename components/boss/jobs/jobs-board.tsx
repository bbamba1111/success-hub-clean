"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { JOB_AREAS, isClosed, jobInArea, type JobArea, type JobsData } from "@/lib/boss/jobs/definitions"
import { JobCard } from "./job-card"
import { JobForm } from "./job-form"

export function JobsBoard({ data }: { data: JobsData }) {
  const [area, setArea] = useState<JobArea>("mine")
  const [adding, setAdding] = useState(false)

  const openJobs = data.jobs.filter((j) => !isClosed(j))
  const rankOf = new Map(openJobs.map((j, i) => [j.id, i + 1]))
  const visible = data.jobs.filter((j) => jobInArea(j, area))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Job areas" className="flex flex-wrap gap-2">
          {JOB_AREAS.map((a) => {
            const count = data.jobs.filter((j) => jobInArea(j, a.key)).length
            const selected = area === a.key
            return (
              <button
                key={a.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setArea(a.key)}
                className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-base font-medium ${
                  selected
                    ? "bg-brand-ink text-background"
                    : "border border-border bg-card text-brand-ink hover:bg-muted"
                }`}
              >
                {a.label}
                <span className={selected ? "text-background/80" : "text-muted-foreground"}>{count}</span>
              </button>
            )
          })}
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex h-12 items-center gap-2 self-start rounded-xl bg-brand-green px-6 text-base font-medium text-primary-foreground hover:bg-brand-green-dark"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
            Give someone a job
          </button>
        )}
      </div>

      {adding && <JobForm team={data.team} onDone={() => setAdding(false)} />}

      {!data.todayPlanId && (
        <p className="rounded-xl bg-muted p-4 text-base leading-relaxed text-brand-ink">
          Once you design today&apos;s CEO Workday™, you can add any job here to it.
        </p>
      )}

      <section role="tabpanel" aria-label={JOB_AREAS.find((a) => a.key === area)?.label} className="flex flex-col gap-4">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-base text-muted-foreground">
            No jobs here yet.
          </p>
        ) : (
          visible.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              allJobs={data.jobs}
              team={data.team}
              position={rankOf.get(job.id) ?? 0}
              total={openJobs.length}
              canReorder={!isClosed(job)}
                hasTodaysWorkday={Boolean(data.todayPlanId)}
                preauthorizations={data.preauthorizations}
            />
          ))
        )}
      </section>
    </div>
  )
}
