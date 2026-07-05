"use client"

/**
 * SegmentWorkspace — the shared, collapsible set of planner + tools + resources
 * that belongs to a single Work-Life Balance Business Day™ segment.
 *
 * It is rendered in BOTH places ("as above, so below"):
 *   • inside the Dynamic Hero's glass card for the segment currently in session
 *   • inside that same segment's panoramic activity card in the schedule below
 *
 * Everything is keyed off the block id, so the two locations always expose the
 * exact same controls and behave identically. Only ONE panel is open at a time.
 *
 * Per-segment features:
 *   • Planner  — Cherry Blossom's inline planning workstation (segments that
 *                support planning; early-access & digital-detox do not)
 *   • Tool     — the segment's dashboard/resource (Workout Planner → Movement
 *                Window, Sleep Tracker → Power Down, CEO Dashboard → CEO Workday)
 *   • Social   — Time Freedom Social Media Sharing (Time Freedom only)
 */

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Briefcase, ChevronDown, Dumbbell, ExternalLink, Moon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CherryBlossomWorkstation } from "@/components/cherry-blossom-workstation"
import { TimeFreedomSocial } from "@/components/time-freedom-social"
import type { BlockId } from "@/operating-engine"

/** Chat context understood by Cherry Blossom's planning workstation. */
const BLOCK_CHAT_CONTEXT: Partial<Record<BlockId, string>> = {
  "morning-given": "morning-routine",
  "movement-window": "workout-window",
  "lunch-break": "lunch-break",
  "ceo-workday": "ceo-workday",
  "time-freedom": "lifestyle-experiences",
  "power-down": "digital-detox",
}

interface SegmentTool {
  label: string
  href: string
  icon: React.ElementType
  description: string
}

/** The dashboard/resource that belongs to each segment (shown when in session). */
const SEGMENT_TOOLS: Partial<Record<BlockId, SegmentTool>> = {
  "movement-window": {
    label: "Workout Planner",
    href: "/workout-planner",
    icon: Dumbbell,
    description: "Plan and track today's movement.",
  },
  "ceo-workday": {
    label: "4-Hour Focused CEO Dashboard™",
    href: "/human-zone-of-genius-team",
    icon: Briefcase,
    description: "Your Founder Operating System™ command center.",
  },
  "power-down": {
    label: "Sleep Tracker",
    href: "/sleep-tracker",
    icon: Moon,
    description: "Wind down and log tonight's rest.",
  },
}

/** True when a segment exposes any planner / tool / social feature. */
export function segmentHasWorkspace(blockId: BlockId): boolean {
  return Boolean(BLOCK_CHAT_CONTEXT[blockId]) || Boolean(SEGMENT_TOOLS[blockId]) || blockId === "time-freedom"
}

type PanelId = "planner" | "tool" | "social"

interface SegmentWorkspaceProps {
  blockId: BlockId
  /** Only the segment currently in session exposes its workspace. */
  isCurrent: boolean
  /** Space-separated RGB used to tint the expanded panels (matches the card). */
  tint?: string
}

const TOGGLE_CLASS =
  "border-[#7FB069]/40 bg-white/70 text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38]"

export function SegmentWorkspace({ blockId, isCurrent, tint = "255 255 255" }: SegmentWorkspaceProps) {
  const [openPanel, setOpenPanel] = useState<PanelId | null>(null)

  const chatContext = BLOCK_CHAT_CONTEXT[blockId]
  const tool = SEGMENT_TOOLS[blockId]
  const hasSocial = blockId === "time-freedom"

  // Nothing to offer for this segment (e.g. early-access), or not in session.
  if (!isCurrent || (!chatContext && !tool && !hasSocial)) return null

  const toggle = (panel: PanelId) => setOpenPanel((current) => (current === panel ? null : panel))

  return (
    <div className="mt-5">
      {/* Toggle row — identical controls wherever this workspace is rendered */}
      <div className="flex flex-wrap items-center gap-2.5">
        {chatContext && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggle("planner")}
            aria-expanded={openPanel === "planner"}
            className={TOGGLE_CLASS}
          >
            <span className="mr-1.5" aria-hidden>
              🌸
            </span>
            {openPanel === "planner" ? "Close Planning" : "Plan with Cherry Blossom"}
            <ChevronDown
              className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${openPanel === "planner" ? "rotate-180" : ""}`}
            />
          </Button>
        )}

        {tool && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggle("tool")}
            aria-expanded={openPanel === "tool"}
            className={TOGGLE_CLASS}
          >
            <tool.icon className="mr-1.5 h-4 w-4" aria-hidden />
            {openPanel === "tool" ? `Close ${tool.label}` : tool.label}
            <ChevronDown
              className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${openPanel === "tool" ? "rotate-180" : ""}`}
            />
          </Button>
        )}

        {hasSocial && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggle("social")}
            aria-expanded={openPanel === "social"}
            className={TOGGLE_CLASS}
          >
            <Users className="mr-1.5 h-4 w-4" aria-hidden />
            {openPanel === "social" ? "Close Sharing" : "Social Media Sharing"}
            <ChevronDown
              className={`ml-1.5 h-4 w-4 transition-transform duration-300 ${openPanel === "social" ? "rotate-180" : ""}`}
            />
          </Button>
        )}
      </div>

      {/* Collapsible panels — one open at a time */}
      <AnimatePresence initial={false} mode="wait">
        {openPanel === "planner" && chatContext && (
          <motion.div
            key="planner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <CherryBlossomWorkstation context={chatContext} active={openPanel === "planner"} />
            </div>
          </motion.div>
        )}

        {openPanel === "tool" && tool && (
          <motion.div
            key="tool"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <div
                className="overflow-hidden rounded-2xl border border-[#7FB069]/25 bg-white/80 shadow-inner"
                style={{ backgroundColor: `rgb(${tint})` }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#7FB069]/15 bg-white/70 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7FB069]/12">
                      <tool.icon className="h-4 w-4 text-[#5B835F]" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#3A2E33]">{tool.label}</p>
                      <p className="text-xs text-[#6B5860]">{tool.description}</p>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className={TOGGLE_CLASS}>
                    <a href={tool.href} target="_blank" rel="noopener noreferrer">
                      Open full page
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden />
                    </a>
                  </Button>
                </div>
                <iframe
                  src={tool.href}
                  title={tool.label}
                  loading="lazy"
                  className="h-[520px] w-full border-0 bg-white"
                />
              </div>
            </div>
          </motion.div>
        )}

        {openPanel === "social" && hasSocial && (
          <motion.div
            key="social"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <div className="mb-4">
                <h4 className="font-playfair text-lg font-medium italic text-[#3A2E33]">
                  Time Freedom Social Media Sharing
                </h4>
                <p className="mt-0.5 text-sm text-[#5C4F55]">
                  Share how you&apos;re spending your Time Freedom and connect with the community.
                </p>
              </div>
              <TimeFreedomSocial active={openPanel === "social"} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SegmentWorkspace
