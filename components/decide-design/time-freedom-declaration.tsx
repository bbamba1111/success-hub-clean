"use client"

/**
 * My Time Freedom Declaration™
 *
 * Woven from this week's My Weekly Life Priorities™ — the parts of life the
 * founder is protecting, enjoying, or planning for during their Time Freedom™.
 * "Build My Declaration" turns the chosen priorities into one first-person
 * statement the founder can cycle, edit, and keep. It auto-saves and stays put
 * until they change, edit, or rebuild it. Mirrors the CEO Workday Declaration™.
 */

import { RefreshCw, Sparkles } from "lucide-react"
import { useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWeeklyLifePriorities } from "@/lib/weekly-life-priorities/use-weekly-life-priorities"
import { useTimeFreedomDeclaration } from "@/lib/time-freedom-declaration/use-time-freedom-declaration"

const VARIANT_COUNT = 3

function joinList(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s
}

function buildDeclaration(priorityLabels: string[], variant: number): string {
  const list = joinList(priorityLabels.map((l) => lowerFirst(l)))
  if (!list) return ""

  switch (variant % VARIANT_COUNT) {
    case 0:
      return `This week, my Time Freedom is for ${list}. I am protecting this time, and it is not up for negotiation.`
    case 1:
      return `My Time Freedom this week makes room for ${list}. This is what my freedom is for, and I am claiming it.`
    default:
      return `When I step into my Time Freedom this week, I make room for ${list} — the parts of my life that matter most.`
  }
}

export function TimeFreedomDeclaration() {
  const { priorities } = useWeeklyLifePriorities()
  const { declaration, save } = useTimeFreedomDeclaration()
  const [showArrival, setShowArrival] = useState(false)
  const arrivalTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const priorityLabels = useMemo(() => priorities.map((p) => p.label), [priorities])
  const ready = priorityLabels.length > 0

  function build(variant = declaration.variant) {
    const text = buildDeclaration(priorityLabels, variant)
    save({ text, variant, edited: false, builtAt: new Date().toISOString() })
    setShowArrival(true)
    if (arrivalTimer.current) clearTimeout(arrivalTimer.current)
    arrivalTimer.current = setTimeout(() => setShowArrival(false), 8000)
  }

  return (
    <>
      <AnimatePresence>
        {showArrival && (
          <motion.div
            key={declaration.builtAt}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 220 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed left-1/2 top-24 z-50 w-[min(90vw,520px)] -translate-x-1/2 px-6 py-5 text-center"
            style={{ background: "rgba(255,255,255,0.28)", backdropFilter: "blur(16px) saturate(1.3)", WebkitBackdropFilter: "blur(16px) saturate(1.3)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)" }}
          >
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#3F5A36]">Your Time Freedom Declaration™</p>
            <p className="mt-2 font-serif text-lg italic leading-snug text-[#1F2A1F]">{declaration.text}</p>
            <p className="mt-3 font-montserrat text-[10px] font-semibold uppercase tracking-[0.16em] text-[#3F5A36]/80">Arriving in your Time Freedom Space™ …</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rounded-3xl border border-[#C0545A]/20 bg-[#FDF8F5] px-6 py-6 shadow-sm transition-shadow duration-700 hover:shadow-[0_24px_50px_-12px_rgba(28,22,26,0.35)] sm:px-8 sm:py-7">
      <div className="mb-4">
        <p className="font-montserrat text-base font-bold uppercase tracking-[0.18em] text-[#C0545A]">
          My Time Freedom Declaration™
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#6B5860] text-pretty">
          Your Weekly Life Priorities™ become one declaration — what your Time Freedom™ is for this week, and what you
          are protecting it for.
        </p>
      </div>

      {!ready ? (
        <p className="font-sans text-sm italic text-[#6B5860]">
          Choose what you want to make room for above, and your Time Freedom Declaration™ can be built.
        </p>
      ) : !declaration.text ? (
        <button
          type="button"
          onClick={() => build(0)}
          className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-xl bg-[#BED0B7] px-6 py-4 font-sans text-lg font-bold text-white transition-colors hover:bg-[#AFC5A6] focus:outline-none focus:ring-2 focus:ring-[#5B835F]/40"
        >
          <Sparkles className="h-5 w-5" aria-hidden /> Build My Time Freedom Declaration
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <label className="block">
            <span className="sr-only">My Time Freedom Declaration</span>
            <textarea
              value={declaration.text}
              onChange={(e) => save({ text: e.target.value, edited: true })}
              rows={4}
              className="w-full resize-y rounded-2xl border border-[#C0545A]/25 bg-white px-5 py-4 font-serif text-base leading-relaxed text-[#2E1F27] focus:outline-none focus:ring-2 focus:ring-[#C0545A]/30 sm:text-lg"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => build((declaration.variant + 1) % VARIANT_COUNT)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DFE2] bg-white px-3.5 py-1.5 font-sans text-xs font-semibold text-[#3A2E33] hover:bg-black/[0.03]"
            >
              <RefreshCw className="h-3 w-3" aria-hidden /> Say it differently
            </button>
            {declaration.edited && (
              <button
                type="button"
                onClick={() => build()}
                className="font-sans text-xs font-semibold text-[#6B5860] underline underline-offset-2 hover:text-[#3A2E33]"
              >
                Reset to generated
              </button>
            )}
            <span className="ml-auto font-sans text-xs text-[#5B835F]">Saved. It stays here until you change it.</span>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
