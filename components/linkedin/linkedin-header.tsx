"use client"

/**
 * LinkedInHeader — a dedicated, responsive LinkedIn profile banner that is a
 * direct visual extension of the Harmony Lane™ landing page. It reuses the same
 * panoramic Work-Life Balance Business Day™ imagery (the canonical SCHEDULE
 * backgrounds the landing hero cycles through), recomposed for LinkedIn's
 * 1584×396 (4:1) banner rather than shrinking the landing-page section.
 *
 * Deliberate departures from the landing hero:
 *  - No large glass / glassmorphism panel. The panoramic environment is the hero.
 *  - Text is minimal, anchored to the upper-right, and kept out of the
 *    lower-left safe area where LinkedIn overlays the profile photo + name.
 *  - object-position keeps the primary subjects visible across breakpoints.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SCHEDULE } from "@/operating-engine/config/schedule"

export function LinkedInHeader({
  showSafeArea = false,
  capture = false,
  captureIndex = 0,
}: {
  showSafeArea?: boolean
  /** Freeze on a single image with no animation/rounding — for exporting a static PNG. */
  capture?: boolean
  /** Which SCHEDULE phase image to freeze on when capturing. */
  captureIndex?: number
}) {
  const [index, setIndex] = useState(capture ? captureIndex % SCHEDULE.length : 0)

  useEffect(() => {
    if (capture) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SCHEDULE.length)
    }, 5200)
    return () => clearInterval(timer)
  }, [capture])

  const block = SCHEDULE[index]
  const image = (Array.isArray(block.backgroundImage) ? block.backgroundImage[0] : block.backgroundImage) || "/placeholder.svg"

  return (
    <div className={`relative w-full overflow-hidden bg-[#FFF1F5] ${capture ? "" : "rounded-xl"}`}>
      {/* LinkedIn banner ratio: 1584 × 396 = 4:1 */}
      <div className="relative aspect-[4/1] w-full">
        {/* Panoramic Work-Life Balance Business Day™ imagery, in motion */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={image}
              src={image}
              alt=""
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.8, ease: "easeInOut" }, scale: { duration: 7, ease: "easeOut" } }}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "center 42%" }}
            />
          </AnimatePresence>

          {/* Right-weighted readability wash — keeps the upper-right text crisp
              while leaving the lower-left safe area and focal subjects clear. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(74,58,66,0) 0%, rgba(74,58,66,0) 40%, rgba(74,58,66,0.28) 68%, rgba(74,58,66,0.62) 100%)",
            }}
          />
        </div>

        {/* Minimal editorial text, anchored upper-right, away from the safe area */}
        <div className="relative z-10 flex h-full items-start justify-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-[56%] px-[4%] pt-[6%] text-right sm:max-w-[52%]"
          >
            <p className="font-poppins text-[clamp(0.5rem,1.1vw,0.85rem)] font-semibold uppercase tracking-[0.28em] text-white/85">
              Thought Leader Barbara
            </p>
            <h2 className="font-playfair mt-[0.4em] text-pretty text-[clamp(1rem,3vw,2.6rem)] font-bold leading-[1.05] text-white drop-shadow-sm">
              Human Sustainability&trade; <span className="text-[#F4B8C6]">in the AI Age</span>
            </h2>
            <p className="font-poppins mt-[0.5em] text-[clamp(0.55rem,1.15vw,1rem)] font-medium leading-snug text-white/80">
              Build the business. Make room for the human.
            </p>
          </motion.div>
        </div>

        {/* Optional safe-area guide (preview only) */}
        {showSafeArea && (
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute bottom-0 left-0 h-[62%] w-[22%] border-2 border-dashed border-white/70 bg-white/10">
              <span className="font-poppins absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                Profile photo / name
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
