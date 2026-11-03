"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

const HERO_SCENES = [
  { src: "/images/holiday/togetherness.png", caption: "Time for the people you love" },
  { src: "/images/holiday/garden-meditation.png", caption: "Time to be still" },
  { src: "/images/holiday/kwanzaa-rest.png", caption: "Time to rest and renew" },
  { src: "/images/holiday/cafe-gathering.png", caption: "Time to gather" },
  { src: "/images/holiday/hanukkah-tai-chi.png", caption: "Time to move, together" },
  { src: "/images/holiday/team-celebration.png", caption: "Time to celebrate the work" },
  { src: "/images/holiday/winter-stroll.png", caption: "Time to wander" },
  { src: "/images/holiday/digital-detox-sign.png", caption: "Time to unplug" },
]

export function HolidayHero({ sessionLabel }: { sessionLabel: string }) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % HERO_SCENES.length), 5200)
    return () => clearInterval(timer)
  }, [])

  const scene = HERO_SCENES[index]

  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#2E2228]">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={scene.src}
            src={scene.src}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, ease: "easeInOut" }, scale: { duration: 7, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E2228]/85 via-[#2E2228]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#2E2228]/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-28 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex max-w-2xl flex-col gap-5"
        >
          <p className="font-poppins w-fit rounded-full border border-[#F6D6E1]/40 bg-[#2E2228]/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F6D6E1] backdrop-blur-sm">
            Free Weekly Reality Check™ · {sessionLabel} · Live online
          </p>
          <h1 className="font-playfair text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#FFF8F4] sm:text-6xl">
            Make Time For More <span className="italic text-[#F6A9C2]">This Holiday Season</span>
          </h1>
          <p className="font-poppins text-pretty text-base font-semibold tracking-wide text-[#E9F0DF] sm:text-lg">
            Redesign Your Entry Into the Workweek™
          </p>
          <p className="font-playfair text-pretty text-xl leading-snug text-[#FFF8F4] sm:text-2xl">
            AI is about to give founders back a lot of time. This season, decide what you&apos;ll do with it.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <a
              href="#register"
              className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#FFF8F4] shadow-xl shadow-[#C13B6B]/30 transition-transform hover:scale-[1.03] hover:bg-[#A8305B]"
            >
              Save My Free Seat
            </a>
            <span className="font-poppins text-sm text-[#F6D6E1]">Free · No card needed</span>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={scene.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="font-playfair text-sm italic text-[#FFF8F4]/90 sm:text-base"
            aria-live="polite"
          >
            {scene.caption}
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Holiday scenes">
          {HERO_SCENES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.caption}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#F6A9C2]" : "w-1.5 bg-[#FFF8F4]/50 hover:bg-[#FFF8F4]/80"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
