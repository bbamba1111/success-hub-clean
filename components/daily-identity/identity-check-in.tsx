"use client"

/**
 * Cherry Blossom Check-in™ — a small, standalone 4-state check-in shown when
 * ~5 minutes remain in the "Decide My Identity & Design My Business
 * Boundaries™" block. Modeled visually on the 🌸 badge and card language used
 * elsewhere (`business-day-block.tsx`, `guided-moments`), but not built on
 * top of the checklist engine — this is a single decision, not a list.
 */

import { useState } from "react"
import type { IdentityCheckInStatus } from "@/lib/daily-identity/types"

interface CheckInOption {
  status: IdentityCheckInStatus
  label: string
  /** Shown once selected — celebrates, encourages, nudges, or reassures depending on the state. */
  response: string
}

const OPTIONS: CheckInOption[] = [
  {
    status: "done",
    label: "Did it",
    response: "Beautiful. Your identity and boundaries are holding — carry that into the rest of your day.",
  },
  {
    status: "partial",
    label: "Partially",
    response: "Partial counts. You made a decision and moved on it — that's the practice.",
  },
  {
    status: "not-yet",
    label: "Haven't yet",
    response: "No penalty. Your decision is still here waiting — you can return to it the moment you're ready.",
  },
  {
    status: "changed",
    label: "Something changed",
    response: "Life happens. Adjust your identity, boundary, or CEO Workday™ outcome above — that's allowed.",
  },
]

interface IdentityCheckInProps {
  onRecord: (status: IdentityCheckInStatus) => void
  recorded?: IdentityCheckInStatus
  /**
   * Phase 8 — course correction (§11). When the founder selects "Something
   * changed," shown alongside that state's response as a way back to
   * re-decide — e.g. a link to Decide & Design. Ignored for the other three
   * states, which need no redirect.
   */
  changedAction?: { label: string; href: string }
}

export function IdentityCheckIn({ onRecord, recorded, changedAction }: IdentityCheckInProps) {
  const [selected, setSelected] = useState<IdentityCheckInStatus | undefined>(recorded)

  const handleSelect = (status: IdentityCheckInStatus) => {
    setSelected(status)
    onRecord(status)
  }

  const activeOption = selected ? OPTIONS.find((o) => o.status === selected) : undefined

  return (
    <div className="rounded-3xl border border-[#E26C73]/25 bg-[#FDF6F0] px-6 py-5 sm:px-7 sm:py-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
          <span
            className="absolute inset-[-3px] rounded-full animate-ping"
            style={{ backgroundColor: "rgba(226,108,115,0.25)", animationDuration: "2s" }}
          />
          <span className="relative text-sm leading-none">🌸</span>
        </span>
        <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          Cherry Blossom Check-in™
        </p>
      </div>

      <p className="mb-4 font-sans text-sm leading-relaxed text-[#3A2E33]">
        This block is almost over. Did your identity and Business Boundaries™ decision hold today?
      </p>

      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => {
          const isSelected = selected === option.status
          return (
            <button
              key={option.status}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleSelect(option.status)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-sans text-sm transition-colors ${
                isSelected
                  ? "border-[#E26C73] bg-[#E26C73] text-white"
                  : "border-[#E26C73]/30 bg-white text-[#3A2E33] hover:bg-[#E26C73]/10"
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {activeOption && (
        <p className="mt-4 font-sans text-sm leading-relaxed text-[#5C4F55]">{activeOption.response}</p>
      )}

      {activeOption?.status === "changed" && changedAction && (
        <a
          href={changedAction.href}
          // `business-day-schedule.tsx` reads `?openSpace=` from
          // `window.location` in a mount-only effect so a page refresh can't
          // re-trigger the jump. A same-route Next.js client transition
          // (e.g. next/link, or a plain <a> intercepted by the router) would
          // change the URL without remounting that effect, so the accordion
          // would never open. Forcing a full reload here guarantees it does.
          onClick={(event) => {
            event.preventDefault()
            window.location.href = changedAction.href
          }}
          className="mt-3 inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[#C0545A] underline underline-offset-2 hover:text-[#A5424A]"
        >
          {changedAction.label}
        </a>
      )}
    </div>
  )
}
