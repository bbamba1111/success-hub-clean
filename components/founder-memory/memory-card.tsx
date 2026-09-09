"use client"

/**
 * MemoryCard — Phase 16.0
 * Pure presentational. Per-category accent color, Cherry Blossom reflection,
 * optional CTA. No hooks.
 */

import Link from "next/link"
import { Trophy, Zap, BookOpen, Lightbulb, Users, BarChart2, Star } from "lucide-react"
import type { FounderMemory, MemoryCategory } from "@/lib/founder-memory/types"

// ─── Category config ─────────────────────────────────────────────────────────

interface CategoryConfig {
  label: string
  accent: string
  bg: string
  border: string
  Icon: React.ComponentType<{ className?: string }>
}

const CATEGORY_CONFIG: Record<MemoryCategory, CategoryConfig> = {
  milestone: {
    label: "Milestone",
    accent: "#B8860B",
    bg: "#FFFBEB",
    border: "#FCD34D30",
    Icon: Trophy,
  },
  win: {
    label: "Win",
    accent: "#5D9D61",
    bg: "#F0FDF4",
    border: "#86EFAC30",
    Icon: Zap,
  },
  reflection: {
    label: "Reflection",
    accent: "#BE185D",
    bg: "#FFF1F2",
    border: "#FDA4AF30",
    Icon: BookOpen,
  },
  decision: {
    label: "Decision",
    accent: "#3730A3",
    bg: "#EEF2FF",
    border: "#A5B4FC30",
    Icon: Lightbulb,
  },
  community: {
    label: "Community",
    accent: "#0F766E",
    bg: "#F0FDFA",
    border: "#5EEAD430",
    Icon: Users,
  },
  review: {
    label: "Review",
    accent: "#7C3AED",
    bg: "#F5F3FF",
    border: "#C4B5FD30",
    Icon: BarChart2,
  },
  celebration: {
    label: "Celebration",
    accent: "#D97706",
    bg: "#FFFBEB",
    border: "#FCD34D30",
    Icon: Star,
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface MemoryCardProps {
  memory: FounderMemory
  compact?: boolean
}

export function MemoryCard({ memory, compact = false }: MemoryCardProps) {
  const config = CATEGORY_CONFIG[memory.category]
  const { Icon } = config

  const formattedDate = new Date(memory.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <article
      className="rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
      style={{ borderColor: config.border, borderLeftWidth: 3, borderLeftColor: config.accent }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: config.bg }}
            >
              {/* Wrap in a span so we can apply the accent color without passing style to the Icon */}
              <span style={{ color: config.accent }} className="flex items-center">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-widest"
              style={{ backgroundColor: config.bg, color: config.accent }}
            >
              {config.label}
            </span>
          </div>
          <time
            dateTime={memory.date}
            className="flex-shrink-0 font-montserrat text-[11px] text-gray-400"
          >
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h3 className="mb-1 font-playfair text-[15px] font-semibold leading-snug text-[#1C161A]">
          {memory.title}
        </h3>

        {/* Summary */}
        {!compact && (
          <p className="mb-3 font-montserrat text-[13px] leading-relaxed text-gray-500">
            {memory.summary}
          </p>
        )}

        {/* Harmony Score badge */}
        {typeof memory.harmonyScore === "number" && (
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5D9D61]" />
            <span className="font-montserrat text-[11px] font-semibold text-[#5D9D61]">
              Harmony Score™ {memory.harmonyScore}/100
            </span>
          </div>
        )}

        {/* Cherry Blossom reflection */}
        {!compact && memory.cherryBlossomReflection && (
          <blockquote className="mb-3 border-l-2 border-[#E8C5CA] pl-3">
            <p className="font-montserrat text-[12px] italic leading-relaxed text-[#8B5E63]">
              &ldquo;{memory.cherryBlossomReflection}&rdquo;
            </p>
            <footer className="mt-1 font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#C4909A]">
              Cherry Blossom
            </footer>
          </blockquote>
        )}

        {/* CTA */}
        {memory.ctaLabel && memory.ctaHref && (
          <Link
            href={memory.ctaHref}
            className="inline-flex items-center gap-1 font-montserrat text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-70"
            style={{ color: config.accent }}
          >
            {memory.ctaLabel} &rarr;
          </Link>
        )}
      </div>
    </article>
  )
}
