"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface CollapsibleSectionProps {
  /** Emoji shown in the workspace header (e.g. "🌸"). Decorative. */
  emoji?: string
  /** The workspace title, e.g. "Executive Briefing". */
  title: string
  /** Optional short subtitle under the title. */
  subtitle?: string
  /** Optional small pill shown on the right (e.g. "Step 1 of 5"). */
  badge?: string
  /** Whether the section starts open. Defaults to false. */
  defaultOpen?: boolean
  /** Accent color for the title + chevron. Defaults to sage green. */
  accent?: string
  children: ReactNode
}

/**
 * Reusable workspace wrapper for the 4-Hour Focused CEO Dashboard™.
 *
 * Renders a glass-card section with an accessible toggle header (emoji, title,
 * subtitle, chevron) and a framer-motion open/close body. Used to sequence the
 * Founder Operating System™ workspaces (understand → prepare → prioritize →
 * execute → review).
 */
export function CollapsibleSection({
  emoji,
  title,
  subtitle,
  badge,
  defaultOpen = false,
  accent = "#5D9D61",
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const contentId = `section-${title.replace(/\s+/g, "-").toLowerCase()}`

  // Each step's accent is a descending shade of sage green. Only the header is
  // softly tinted; the content sits on a clean white background for the text.
  const softHeaderBg = `${accent}12` // ~7% tint
  const softBorder = `${accent}33` // ~20% border

  return (
    <div
      className="rounded-2xl border bg-white shadow-sm overflow-hidden"
      style={{ borderColor: softBorder }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:brightness-[0.98] md:px-6"
        style={{ backgroundColor: softHeaderBg }}
      >
        {emoji && (
          <span className="text-2xl md:text-3xl" aria-hidden="true">
            {emoji}
          </span>
        )}
        <span className="flex-1 min-w-0">
          <span className="block text-lg font-bold leading-tight md:text-xl" style={{ color: accent }}>
            {title}
          </span>
          {subtitle && <span className="mt-0.5 block text-sm text-muted-foreground text-pretty">{subtitle}</span>}
        </span>
        {badge && (
          <span
            className="hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-block"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            {badge}
          </span>
        )}
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform duration-300"
          style={{ color: accent, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t bg-white px-5 py-6 md:px-6" style={{ borderColor: softBorder }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
