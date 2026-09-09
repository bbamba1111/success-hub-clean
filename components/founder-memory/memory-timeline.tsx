"use client"

/**
 * MemoryTimeline — Phase 16.0
 * Vertical timeline of FounderMemory[] with date separators,
 * category filter chips, and framer-motion stagger.
 */

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MemoryCard } from "./memory-card"
import type { FounderMemory, MemoryCategory } from "@/lib/founder-memory/types"

// ─── Date group helpers ───────────────────────────────────────────────────────

function getDateGroupLabel(isoDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(isoDate)
  d.setHours(0, 0, 0, 0)
  const diffDays = Math.round((today.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return "This Week"
  if (diffDays < 14) return "Last Week"
  if (diffDays < 31) return "This Month"
  if (diffDays < 60) return "Last Month"
  return "Earlier"
}

interface DateGroup {
  label: string
  memories: FounderMemory[]
}

function groupByDate(memories: FounderMemory[]): DateGroup[] {
  const groups: Map<string, FounderMemory[]> = new Map()
  for (const m of memories) {
    const label = getDateGroupLabel(m.date)
    const arr = groups.get(label) ?? []
    arr.push(m)
    groups.set(label, arr)
  }
  return Array.from(groups.entries()).map(([label, mems]) => ({ label, memories: mems }))
}

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: MemoryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "milestone", label: "Milestones" },
  { value: "win", label: "Wins" },
  { value: "review", label: "Reviews" },
  { value: "reflection", label: "Reflections" },
  { value: "decision", label: "Decisions" },
  { value: "community", label: "Community" },
  { value: "celebration", label: "Celebrations" },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface MemoryTimelineProps {
  memories: FounderMemory[]
}

export function MemoryTimeline({ memories }: MemoryTimelineProps) {
  const [activeFilter, setActiveFilter] = useState<MemoryCategory | "all">("all")

  const filtered =
    activeFilter === "all"
      ? memories
      : memories.filter((m) => m.category === activeFilter)

  const groups = groupByDate(filtered)

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#E8C5CA] bg-[#FDF9FA] px-6 py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-[#F9EFF0]" />
        <p className="font-playfair text-lg text-[#1C161A]">Your memory timeline is empty</p>
        <p className="max-w-sm font-montserrat text-sm leading-relaxed text-gray-500">
          As you complete GPS recommendations, generate reviews, and engage with the community, Cherry
          Blossom will remember every step of your journey here.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-lg bg-[#5D9D61] px-4 py-2 font-montserrat text-xs font-semibold text-white transition-opacity hover:opacity-80"
        >
          Start Today&apos;s Operating Day &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className="rounded-full px-3 py-1 font-montserrat text-[11px] font-semibold uppercase tracking-wider transition-all"
              style={{
                backgroundColor: isActive ? "#1C161A" : "#F5F5F0",
                color: isActive ? "#FFFFFF" : "#6B6369",
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Count */}
      <p className="font-montserrat text-xs text-gray-400">
        {filtered.length} {filtered.length === 1 ? "memory" : "memories"} recorded
      </p>

      {/* Groups */}
      {groups.length === 0 ? (
        <p className="font-montserrat text-sm text-gray-400">No memories in this category yet.</p>
      ) : (
        groups.map((group, gi) => (
          <section key={group.label}>
            {/* Date separator */}
            <div className="mb-4 flex items-center gap-3">
              <span className="font-montserrat text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {group.label}
              </span>
              <div className="flex-1 border-t border-gray-100" />
            </div>

            {/* Memory cards with stagger */}
            <div className="space-y-4">
              {group.memories.map((memory, mi) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05 + mi * 0.04, duration: 0.3 }}
                >
                  <MemoryCard memory={memory} />
                </motion.div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
