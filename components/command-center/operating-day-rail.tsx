"use client"

/**
 * The Operating Day™ rail — the full Work-Life Balance Business Day™ timeline,
 * rendered from the live Operating Engine so it always matches the moment.
 * Members see where they are, what's next, and what they've already moved
 * through, with one tap into each experience.
 */
import Link from "next/link"
import { CheckCircle2, CircleDot, Circle } from "lucide-react"
import type { MemberExperience } from "@/operating-engine/types"

const STATE_META = {
  completed: { Icon: CheckCircle2, className: "text-[#5D9D61]", label: "Completed" },
  current: { Icon: CircleDot, className: "text-[#E26C73]", label: "Now" },
  upcoming: { Icon: Circle, className: "text-[#3A2E33]/30", label: "Upcoming" },
} as const

export function OperatingDayRail({ experience }: { experience: MemberExperience }) {
  const { timeline } = experience.businessDay

  return (
    <section aria-label="Your Operating Day" className="rounded-3xl border border-[#3A2E33]/10 bg-white p-6 sm:p-8 shadow-sm">
      <h2 className="font-playfair text-xl italic text-[#3A2E33]">Your Operating Day™</h2>
      <p className="mt-1 text-sm text-[#5C4F55]">Contained Work. Expanded Life. Sustainable Success.™</p>

      <ol className="mt-5 space-y-1">
        {timeline.map(({ block, state }) => {
          const meta = STATE_META[state]
          const { Icon } = meta
          const isCurrent = state === "current"
          const inner = (
            <div
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                isCurrent ? "bg-[#E26C73]/8" : "hover:bg-[#F4EFE7]"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${meta.className}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm ${isCurrent ? "font-semibold text-[#3A2E33]" : "text-[#3A2E33]"}`}>
                  {block.emoji} {block.shortTitle}
                </p>
                <p className="truncate text-xs text-[#5C4F55]">{block.timeLabel}</p>
              </div>
              <span className="shrink-0 text-xs font-medium text-[#5C4F55]">{meta.label}</span>
            </div>
          )

          return (
            <li key={block.id}>
              {block.href ? (
                <Link href={block.href} target={block.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
