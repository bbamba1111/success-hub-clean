"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp, ArrowDown, ArrowUp } from "lucide-react"

export type WorkdaySectionId = "declaration" | "work" | "hours"

const DEFAULT_ORDER: WorkdaySectionId[] = ["declaration", "work", "hours"]
const STORAGE_KEY = "ceo-workday:section-layout"

type Layout = { order: WorkdaySectionId[]; collapsed: WorkdaySectionId[] }

function readLayout(): Layout {
  if (typeof window === "undefined") return { order: DEFAULT_ORDER, collapsed: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { order: DEFAULT_ORDER, collapsed: [] }
    const parsed = JSON.parse(raw) as Partial<Layout>
    const order = (parsed.order ?? []).filter((id): id is WorkdaySectionId => DEFAULT_ORDER.includes(id as WorkdaySectionId))
    for (const id of DEFAULT_ORDER) if (!order.includes(id)) order.push(id)
    const collapsed = (parsed.collapsed ?? []).filter((id): id is WorkdaySectionId => DEFAULT_ORDER.includes(id as WorkdaySectionId))
    return { order, collapsed }
  } catch {
    return { order: DEFAULT_ORDER, collapsed: [] }
  }
}

/** Founder-controlled order + open/closed state of the CEO Workday™ sections. */
export function useWorkdaySectionLayout() {
  const [layout, setLayout] = useState<Layout>({ order: DEFAULT_ORDER, collapsed: [] })

  useEffect(() => {
    setLayout(readLayout())
  }, [])

  const update = useCallback((fn: (l: Layout) => Layout) => {
    setLayout((prev) => {
      const next = fn(prev)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage failures
      }
      return next
    })
  }, [])

  const move = useCallback(
    (id: WorkdaySectionId, dir: -1 | 1) =>
      update((l) => {
        const order = [...l.order]
        const i = order.indexOf(id)
        const j = i + dir
        if (i < 0 || j < 0 || j >= order.length) return l
        ;[order[i], order[j]] = [order[j], order[i]]
        return { ...l, order }
      }),
    [update],
  )

  const toggle = useCallback(
    (id: WorkdaySectionId) =>
      update((l) => ({
        ...l,
        collapsed: l.collapsed.includes(id) ? l.collapsed.filter((c) => c !== id) : [...l.collapsed, id],
      })),
    [update],
  )

  const expand = useCallback(
    (id: WorkdaySectionId) => update((l) => (l.collapsed.includes(id) ? { ...l, collapsed: l.collapsed.filter((c) => c !== id) } : l)),
    [update],
  )

  return { order: layout.order, collapsed: layout.collapsed, move, toggle, expand }
}

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E8DFE2] bg-white text-[#6B5860] transition-colors hover:border-[#7FB069]/60 hover:text-[#3A6B3E] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#E8DFE2] disabled:hover:text-[#6B5860]"

export function WorkdaySection({
  id,
  title,
  isFirst,
  isLast,
  collapsed,
  onMove,
  onToggle,
  children,
}: {
  id: WorkdaySectionId
  title: string
  isFirst: boolean
  isLast: boolean
  collapsed: boolean
  onMove: (dir: -1 | 1) => void
  onToggle: () => void
  children: ReactNode
}) {
  const contentId = `workday-section-${id}`
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-controls={contentId}
          className="inline-flex items-center gap-1.5 font-montserrat text-[13px] font-bold uppercase tracking-[0.16em] text-[#6B5860] hover:text-[#3A6B3E]"
        >
          {collapsed ? <ChevronDown className="h-4 w-4" aria-hidden /> : <ChevronUp className="h-4 w-4" aria-hidden />}
          {title}
          <span className="font-sans text-[13px] font-semibold normal-case tracking-normal text-[#6B5860]/70">
            {collapsed ? "· Reopen" : "· Close"}
          </span>
        </button>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onMove(-1)} disabled={isFirst} className={iconBtn} aria-label={`Move ${title} up`}>
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={isLast} className={iconBtn} aria-label={`Move ${title} down`}>
            <ArrowDown className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
      <div id={contentId} hidden={collapsed}>
        {children}
      </div>
    </section>
  )
}
