"use client"

/**
 * CEO Workday™ — Business Function Selector
 * ---------------------------------------------------------------------------
 * The Five Business Functions are the only top-level categories of CEO work.
 * They are not departments or sequential steps — work can move among them.
 * This menu is no longer tied to the Business Asset Builder™: the founder
 * names the work, it lands in Today's CEO Work, and the same function links
 * into The BO$$ Business Work Queue, Human & AI Workforce, and Systems.
 */

import { useRef, useState } from "react"
import Link from "next/link"
import { ChevronDown, ListChecks, Plug, Users } from "lucide-react"

import { CEO_WORK_CATEGORIES, type CeoWorkCategory, type CeoWorkCategoryId } from "@/lib/ceo-workday/categories"
import { getWorkflowEntry } from "@/lib/ceo-workday/workflow-registry"
import { addWorkItem } from "@/lib/ceo-workday/todays-work-store"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

export function CategorySelectorRow({ onItemAdded }: { onItemAdded?: () => void }) {
  const [openCategory, setOpenCategory] = useState<CeoWorkCategoryId | null>(null)
  const [workTitle, setWorkTitle] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => {
    setOpenCategory(null)
    setWorkTitle("")
  })

  function handleAdd(category: CeoWorkCategory) {
    const title = workTitle.trim()
    if (!title) return
    addWorkItem({
      category: category.id,
      selectedOptionLabel: title,
      workflowId: getWorkflowEntry(category.id).workflowId,
      availability: getWorkflowEntry(category.id).availability,
      source: "founder",
      sourceDetail: `Added under ${category.label}`,
      tangibleOutcome: category.tangibleOutcome,
    })
    setWorkTitle("")
    setOpenCategory(null)
    onItemAdded?.()
  }

  return (
    <div ref={containerRef} className="flex flex-wrap gap-2">
      {CEO_WORK_CATEGORIES.map((category) => (
        <div key={category.id} className="relative">
          <button
            type="button"
            onClick={() => {
              setOpenCategory((current) => (current === category.id ? null : category.id))
              setWorkTitle("")
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-4 py-2 font-sans text-sm font-bold text-[#3A2E33] transition-colors hover:border-[#5A7A45]/40 aria-expanded:border-[#5A7A45] aria-expanded:bg-[#F4F7F0]"
            aria-expanded={openCategory === category.id}
          >
            {category.label}
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </button>

          {openCategory === category.id && (
            <FunctionMenu
              category={category}
              title={workTitle}
              onTitleChange={setWorkTitle}
              onAdd={() => handleAdd(category)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function FunctionMenu({
  category,
  title,
  onTitleChange,
  onAdd,
}: {
  category: CeoWorkCategory
  title: string
  onTitleChange: (value: string) => void
  onAdd: () => void
}) {
  const inputId = `fn-work-${category.id}`
  const queueHref = category.bossFunction ? `/boss/queue?fn=${category.bossFunction}` : "/boss/queue"

  return (
    <div className="absolute left-0 top-full z-20 mt-2 flex w-80 max-w-[calc(100vw-3rem)] flex-col gap-3 rounded-2xl border border-[#E8DFE2] bg-white p-4 shadow-lg">
      <p className="font-sans text-sm leading-relaxed text-[#3A2E33] text-pretty">{category.definition}</p>

      {category.examples && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Examples of ${category.label} work`}>
          {category.examples.map((example) => (
            <li key={example} className="rounded-full bg-[#F4F7F0] px-2.5 py-1 font-sans text-xs text-[#4A5E3A]">
              {example}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-sans text-sm font-bold text-[#2E1F27]">
          What needs to happen?
        </label>
        <input
          id={inputId}
          type="text"
          autoFocus
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder="e.g. Pitch two podcasts"
          className="w-full rounded-lg border border-[#E8DFE2] px-3 py-2 font-sans text-sm text-[#3A2E33] outline-none transition-colors focus:border-[#5A7A45]/60"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!title.trim()}
          className="mt-1 rounded-lg bg-[#5A7A45] px-3 py-2 font-sans text-sm font-bold text-white transition-colors disabled:opacity-40"
        >
          Add to Today&apos;s CEO Work
        </button>
      </div>

      <div className="flex flex-col gap-1 border-t border-[#E8DFE2] pt-3">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-[#6B5860]">Open in The BO$$</p>
        <BossLink href={queueHref} icon={<ListChecks className="h-4 w-4" aria-hidden />} label="Business Work Queue" />
        <BossLink href="/boss/workforce" icon={<Users className="h-4 w-4" aria-hidden />} label="Human & AI Workforce" />
        <BossLink
          href="/boss/systems"
          icon={<Plug className="h-4 w-4" aria-hidden />}
          label="Systems, Integrations & Automation"
        />
      </div>
    </div>
  )
}

function BossLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-sans text-sm text-[#3A2E33] transition-colors hover:bg-[#F4F7F0]"
    >
      <span className="text-[#5A7A45]">{icon}</span>
      {label}
    </Link>
  )
}
