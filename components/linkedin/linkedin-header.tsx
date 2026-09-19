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
    }, 6400)
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
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 2.6, ease: "easeInOut" }, scale: { duration: 8.5, ease: "easeOut" } }}
              className="absolute inset-0 h-full w-full object-contain"
              style={{ objectPosition: "center" }}
            />
          </AnimatePresence>

          {/* Right-weighted readability wash — keeps the upper-right text crisp
              while leaving the lower-left safe area and focal subjects clear. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(58,44,52,0) 0%, rgba(58,44,52,0) 30%, rgba(58,44,52,0.34) 55%, rgba(58,44,52,0.7) 80%, rgba(58,44,52,0.82) 100%)",
            }}
          />
        </div>

        {/* Fixed editorial message, anchored upper-right, away from the safe area */}
        <div className="relative z-10 flex h-full items-center justify-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-[60%] px-[4%] py-[3%] text-right sm:max-w-[56%]"
          >
            <p className="font-poppins text-[clamp(0.45rem,1vw,0.8rem)] font-semibold uppercase tracking-[0.28em] text-white/85">
              Thought Leader Barbara
            </p>
            <h2 className="font-playfair mt-[0.35em] text-pretty text-[clamp(0.85rem,2.35vw,2rem)] font-bold leading-[1.08] text-white drop-shadow-sm">
              You became an entrepreneur for freedom.{" "}
              <span className="text-[#F4B8C6]">So why are you working like this?</span>
            </h2>
            <p className="font-poppins mt-[0.7em] text-[clamp(0.42rem,0.95vw,0.72rem)] font-semibold uppercase tracking-[0.2em] text-white/90">
              The Work-Life Balance Business Day&trade;
            </p>
            <p className="font-poppins mt-[0.35em] text-pretty text-[clamp(0.48rem,1.02vw,0.86rem)] font-medium leading-snug text-white/80">
              The Destination for Founders Ready to Create Boundaries in Their Businesses So Life Has Space to Expand.
            </p>
            <p className="font-playfair mt-[0.6em] text-[clamp(0.55rem,1.25vw,1.05rem)] font-bold italic text-[#F4B8C6]">
              Make Time For More&trade; On Mondays
            </p>
            <p className="font-poppins mt-[0.3em] text-[clamp(0.45rem,1vw,0.8rem)] font-semibold text-white">
              Enter the experience &rarr;
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
