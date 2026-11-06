"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HOLIDAY_SCENES as HERO_SCENES, HOLIDAY_SCENE_INTERVAL_MS } from "@/lib/holiday-scenes"
import { SESSION_TIME_LABEL, nextSessionDate, sessionStartsAt } from "@/lib/reality-check/session"

function SundayCountdown({ sessionLabel }: { sessionLabel: string }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const target = sessionStartsAt(nextSessionDate(new Date()))
      const total = Math.max(0, target.getTime() - Date.now())
      setRemaining({
        days: Math.floor(total / 86_400_000),
        hours: Math.floor((total % 86_400_000) / 3_600_000),
        minutes: Math.floor((total % 3_600_000) / 60_000),
        seconds: Math.floor((total % 60_000) / 1_000),
      })
    }
    update()
    const timer = window.setInterval(update, 1_000)
    return () => window.clearInterval(timer)
  }, [])

  const units = [
    { value: remaining.days, label: "Days" },
    { value: remaining.hours, label: "Hours" },
    { value: remaining.minutes, label: "Minutes" },
    { value: remaining.seconds, label: "Seconds" },
  ]

  return (
    <div className="flex flex-col gap-2" aria-live="off">
      <p className="font-poppins text-xs font-semibold uppercase tracking-[0.18em] text-[#F6D6E1]">
        Next: {sessionLabel} · Every Sunday at {SESSION_TIME_LABEL}
      </p>
      <div className="flex flex-wrap gap-2">
        {units.map((unit) => (
          <div key={unit.label} className="min-w-[4.4rem] rounded-xl border border-[#F6D6E1]/25 bg-[#2E2228]/55 px-3 py-2 text-center backdrop-blur-sm">
            <span className="font-playfair block text-2xl font-bold tabular-nums text-[#FFF8F4]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="font-poppins text-[10px] uppercase tracking-[0.12em] text-[#F6D6E1]">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HolidayHero({ sessionLabel }: { sessionLabel: string }) {
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reduceMotion) return
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setIndex((i) => (i + 1) % HERO_SCENES.length)
    }, HOLIDAY_SCENE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [inView, reduceMotion])

  const scene = HERO_SCENES[index]

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-[#2E2228]">
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={scene.src}
            src={scene.src}
            alt=""
            aria-hidden="true"
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
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
            Free Sunday Reality Check™ · Every Sunday · {SESSION_TIME_LABEL}
          </p>
          <h1 className="font-playfair text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#FFF8F4] sm:text-6xl">
            Make Time For More This Holiday Season
          </h1>
          <p className="font-playfair text-balance text-2xl font-semibold leading-tight text-[#F6A9C2] sm:text-3xl">
            Give Yourself the Gift of Work-Life Balance, Time Freedom &amp; Sustainable Success.
          </p>
          <p className="font-poppins text-pretty text-lg leading-relaxed text-[#FFF8F4] sm:text-xl">
            Redesign how you enter the workweek. Set work-life balance boundaries in your business—and start living them in real time.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <a
              href="#register"
              className="font-poppins inline-flex w-fit items-center justify-center rounded-full bg-[#C13B6B] px-8 py-4 text-sm font-semibold tracking-[0.04em] text-[#FFF8F4] shadow-xl shadow-[#C13B6B]/30 transition-transform hover:scale-[1.03] hover:bg-[#A8305B]"
            >
              <span>Reserve Your First</span>
              <span className="ml-1 font-normal italic opacity-85">(or Next)</span>
              <span className="ml-1">Work-Life Balance Business Week™</span>
            </a>
          </div>
          <SundayCountdown sessionLabel={sessionLabel} />
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
