"use client"

/**
 * Today's Declaration™ — the Dynamic Intention of the Day™. The persistent
 * anchor that runs through the entire Work-Life Balance Business Day™.
 *
 * Set during Morning GIV•EN™ (Invitation + Intention): the founder sets an
 * intention, and Cherry Blossom™ transforms it into an identity-based
 * declaration, persisted via the existing `segment_intentions` /
 * `segment_declarations` infrastructure (segment_id: "morning-given").
 *
 * This card occupies ONE fixed position — directly below the founder's
 * intro message/portrait and above the rest of the day's segment cards —
 * for the entire day, regardless of which segment (Decide & Design,
 * Movement, Lunch, CEO Workday, Time Freedom, Power Down) is currently
 * active. It must never disappear and leave an empty gap in that position:
 *
 *   - Before today's intention exists → a quiet "set it" invitation renders
 *     in this exact spot (never a blank space, never `null`).
 *   - Once it exists → the declaration itself renders here, with a subtle
 *     "Edit Intention" affordance so the founder can update it later in the
 *     day. Editing replaces this same record in place — there is exactly
 *     one canonical intention per founder per day, never a second one.
 *
 * Re-fetches whenever Morning GIV•EN™ saves or edits the intention (no
 * separate persistence system is created for this component).
 */

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil } from "lucide-react"

interface TodaysDeclaration {
  declaration: string
  whyItMatters: string | null
}

export function DailyDeclaration() {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState<TodaysDeclaration | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/identity/intention?segment_id=morning-given")
        if (cancelled) return

        if (res.ok) {
          const { intentions } = await res.json()
          const today = intentions?.[0]
          const declarations = today?.segment_declarations
          const latest = Array.isArray(declarations) ? declarations[declarations.length - 1] : undefined
          if (latest?.declaration) {
            setData({
              declaration: latest.declaration,
              whyItMatters: latest.why_it_matters ?? null,
            })
          } else {
            // No declaration saved yet today — show the "set it" invitation,
            // not nothing.
            setData(null)
          }
        }
      } catch (error) {
        console.error("[v0] DailyDeclaration load failed:", error)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()

    // Refetch whenever Morning GIV•EN™ saves or edits today's intention —
    // fired the moment the "I" step's declaration is confirmed, not only
    // when the whole flow finishes. Cherry Blossom's declaration is
    // persisted server-side a beat after the client-visible confirmation, so
    // a short delay here avoids racing an in-flight write and briefly
    // showing stale/empty state.
    function handleUpdated() {
      setTimeout(load, 900)
    }
    window.addEventListener("morning-given:completed", handleUpdated)

    return () => {
      cancelled = true
      window.removeEventListener("morning-given:completed", handleUpdated)
    }
  }, [])

  // Never render nothing once we know where we stand — either state fills
  // this exact position in the page.
  if (!loaded) return null

  return (
    <section className="w-full bg-[#FDFAF5] px-6 pb-10 sm:px-10 lg:px-16">
      <AnimatePresence mode="wait">
        {data ? (
          <motion.div
            key="declaration"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[1.75rem]"
            style={{
              backgroundImage: "url('/images/cherry-blossom-intention-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center 60%",
              boxShadow: "0 24px 60px rgba(193,59,107,0.14), 0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* A light scrim only at the very top/bottom edges keeps the badge and
                card legible without washing out the background image itself —
                the vibrancy of the photo is the point now. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,0.14) 100%)",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-5 px-6 py-12 text-center sm:px-16 sm:py-14">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/50 bg-white/85 px-4 py-1.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6D2F] shadow-sm backdrop-blur-sm">
                  {"My Intention Today"}
                </span>

                {/* Intentional, low-emphasis edit affordance — the founder can
                    change today's intention, but it should never compete with
                    the declaration itself. */}
                <a
                  href="/?openSpace=morning-given"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1.5 font-montserrat text-[11px] font-semibold text-[#4A3A42]/70 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/85 hover:text-[#4A3A42]"
                >
                  <Pencil className="h-3 w-3" aria-hidden />
                  {"Edit Intention"}
                </a>
              </div>

              {/* Frosted glass panel: translucent white + heavy blur so the vibrant
                  background stays visible through it, while the sage-green
                  declaration text stays fully readable on top. Opacity is tuned
                  just high enough for text contrast without going opaque. */}
              <div className="max-w-[820px] rounded-[1.5rem] border border-white/60 bg-white/55 px-8 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.14)] backdrop-blur-xl sm:px-12 sm:py-10">
                <p className="font-playfair text-xl italic leading-relaxed text-[#3D6B44] sm:text-2xl lg:text-[27px]">
                  {data.declaration}
                </p>

                {data.whyItMatters && (
                  <p className="mx-auto mt-5 max-w-[640px] rounded-xl bg-white/60 px-5 py-3 font-montserrat text-[13px] leading-relaxed text-[#4A3A42] backdrop-blur-sm">
                    <span className="font-semibold text-[#3D6B44]">{"Why this matters: "}</span>
                    {data.whyItMatters}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // Before today's intention exists — this occupies the same
          // position and visual weight class as the declaration above, so
          // the anchor never reads as an empty gap on the page.
          <motion.div
            key="empty-invitation"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[1.75rem] border border-[#EADFCB] bg-white/70"
            style={{ boxShadow: "0 24px 60px rgba(193,59,107,0.08), 0 6px 20px rgba(0,0,0,0.04)" }}
          >
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-16 sm:py-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white px-4 py-1.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6D2F] shadow-sm">
                {"My Intention Today"}
              </span>
              <p className="max-w-[520px] font-playfair text-lg italic leading-relaxed text-[#5A4A52] sm:text-xl">
                {"You haven\u2019t set today\u2019s intention yet."}
              </p>
              <p className="max-w-[480px] font-montserrat text-[13px] leading-relaxed text-[#4A3A42]/80">
                {"Set it during Morning GIV\u2022EN\u2122 and it will stay right here, all day, until you change it."}
              </p>
              <a
                href="/?openSpace=morning-given"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#78AD7D] px-6 py-2.5 font-montserrat text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#5F9165]"
              >
                {"Set Today\u2019s Intention"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
