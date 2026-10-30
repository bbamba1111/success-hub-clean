"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBoss } from "@/lib/boss/store"
import { CATEGORIES, FUNCTIONS, isClosed } from "@/lib/boss/constants"
import type { BusinessFunction, ResourceCategory } from "@/lib/boss/types"
import { FunctionBadge, LevelBadge, PageHeader, Panel, PermissionStatusBadge, StatusBadge, fieldClass, labelClass, DemoTag } from "./primitives"

const CATEGORY_FIELDS: Record<ResourceCategory, string[]> = {
  founder: ["Authority", "Decision rights"],
  employee: ["Employment type", "Manager", "Start date"],
  contractor: ["Engagement", "Scope of work", "Contract renews"],
  external: ["Relationship", "Point of contact", "Agreement"],
  ai: ["Type", "Data access"],
  automation: ["Trigger", "Platform", "Last run"],
}

export function WorkforceRegistry() {
  const { state } = useBoss()
  const [tab, setTab] = useState<ResourceCategory | "all">("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string>(state.resources[1]?.id ?? "")
  const [adding, setAdding] = useState(false)

  const list = state.resources.filter(
    (r) => (tab === "all" || r.category === tab) && `${r.name} ${r.role} ${r.capabilities.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  )
  const res = state.resources.find((r) => r.id === selected)
  const work = state.work.filter((w) => w.assigneeId === selected && !isClosed(w.status))
  const perms = state.permissions.filter((p) => p.resourceId === selected)

  return (
    <>
      <PageHeader
        eyebrow="Workforce Registry"
        title="Everyone and everything doing business work"
        description="Being listed here never grants authority. Permissions are granted separately, per action and scope."
        actions={
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Add resource
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setTab(tab === c.id ? "all" : c.id)}
            aria-pressed={tab === c.id}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
              tab === c.id ? "border-brand-green bg-brand-sage-light/70" : "border-border bg-card hover:bg-muted/60",
            )}
          >
            <span className="font-display text-2xl font-semibold">{state.resources.filter((r) => r.category === c.id).length}</span>
            <span className="text-xs font-medium leading-snug text-brand-ink">{c.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          <input className={fieldClass} placeholder="Search name, role, or capability" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the registry" />
          <ul className="flex flex-col gap-2">
            {list.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSelected(r.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                    selected === r.id ? "border-brand-ink bg-card shadow-ds-sm" : "border-border bg-card hover:bg-muted/50",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-brand-ink">{r.name}</span>
                    <span className="text-[11px] text-muted-foreground">{CATEGORIES.find((c) => c.id === r.category)?.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{r.role}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {res && (
          <Panel
            title={res.name}
            description={`${CATEGORIES.find((c) => c.id === res.category)?.label} · ${res.role}`}
            action={<DemoTag />}
          >
            <div className="flex flex-col gap-5">
              {res.category === "external" && (
                <p className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-brand-ink">
                  An independent collaborator — not an employee and not under your direct control. Work with them is a request they can accept or decline.
                </p>
              )}
              {(res.category === "ai" || res.category === "automation") && (
                <p className="rounded-lg bg-muted p-3 text-xs leading-relaxed text-brand-ink">
                  {res.category === "ai"
                    ? "An AI capability coordinated by the Central AI Operations Coordinator. Prototype record; no live AI is connected."
                    : "Executes predictable steps only. Prototype record; no live automation is running."}
                </p>
              )}
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                {CATEGORY_FIELDS[res.category].map((k) => (
                  <div key={k}>
                    <dt className={labelClass}>{k}</dt>
                    <dd className="text-brand-ink">{res.detail[k] || "Not recorded"}</dd>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <dt className={labelClass}>Availability</dt>
                  <dd className="text-brand-ink">{res.availability}</dd>
                </div>
              </dl>
              <div className="flex flex-col gap-2">
                <p className={labelClass}>Capabilities</p>
                <div className="flex flex-wrap gap-1.5">
                  {res.capabilities.map((c) => (
                    <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-xs">{c}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {res.functions.map((f) => <FunctionBadge key={f} fn={f} />)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className={labelClass}>Authority & permissions ({perms.length})</p>
                {perms.length === 0 ? (
                  <p className="text-xs text-muted-foreground">{res.category === "founder" ? "Final authority on all business decisions." : "No permissions granted."}</p>
                ) : (
                  <ul className="flex flex-col gap-1.5">
                    {perms.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground">{p.id}</span>
                        <span className="text-brand-ink">{p.action}</span>
                        <LevelBadge level={p.level} />
                        <PermissionStatusBadge status={p.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className={labelClass}>Current assignments ({work.length})</p>
                <ul className="flex flex-col gap-1.5">
                  {work.map((w) => (
                    <li key={w.id} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-muted-foreground">{w.id}</span>
                      <span className="flex-1 truncate">{w.title}</span>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        )}
      </div>

      <AddResourceDialog open={adding} onClose={() => setAdding(false)} />
    </>
  )
}

function AddResourceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dispatch } = useBoss()
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [category, setCategory] = useState<ResourceCategory>("contractor")
  const [fns, setFns] = useState<BusinessFunction[]>([])
  const [caps, setCaps] = useState("")

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Add a resource</DialogTitle>
          <DialogDescription>New resources start with no permissions.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Category</span>
            <select className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value as ResourceCategory)}>
              {CATEGORIES.filter((c) => c.id !== "founder").map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Name</span>
            <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Role</span>
            <input className={fieldClass} value={role} onChange={(e) => setRole(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Capabilities (comma-separated)</span>
            <input className={fieldClass} value={caps} onChange={(e) => setCaps(e.target.value)} />
          </label>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={cn(labelClass, "mb-1")}>Business functions</legend>
            {FUNCTIONS.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[hsl(var(--primary))]"
                  checked={fns.includes(f.id)}
                  onChange={(e) => setFns(e.target.checked ? [...fns, f.id] : fns.filter((x) => x !== f.id))}
                />
                {f.label}
              </label>
            ))}
          </fieldset>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              dispatch({
                type: "RESOURCE_ADD",
                resource: {
                  name: name.trim(),
                  role: role.trim() || "Not recorded",
                  category,
                  functions: fns,
                  capabilities: caps.split(",").map((c) => c.trim()).filter(Boolean),
                  availability: "Not recorded",
                  directControl: category !== "external",
                  detail: {},
                },
              })
              setName("")
              setRole("")
              setCaps("")
              setFns([])
              onClose()
            }}
          >
            Add resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
