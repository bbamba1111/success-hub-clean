"use client"

/**
 * Today's Declaration™ — the visual thread that runs through the entire
 * Work-Life Balance Business Day™.
 *
 * Created during Morning GIV•EN™ (Intention & Invitation): the founder sets
 * an intention, and Cherry Blossom™ transforms it into an identity-based
 * declaration, persisted via the existing `segment_intentions` /
 * `segment_declarations` infrastructure (segment_id: "morning-given").
 *
 * This card is the persistent, panoramic reminder of that declaration. It
 * lives immediately below the founder's intro message/portrait and above
 * the rest of the day's segments — never inside Decide & Design or any
 * individual Time & Space Boundary™. Renders nothing until a declaration
 * exists for today, and re-fetches whenever the founder completes Morning
 * GIV•EN™ (no separate persistence system is created).
 */

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
          }
        }
      } catch (error) {
        console.error("[v0] DailyDeclaration load failed:", error)
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    load()

    // Refetch the moment Morning GIV•EN™ is completed, so this card
    // populates automatically without a full page reload.
    function handleCompleted() {
      load()
    }
    window.addEventListener("morning-given:completed", handleCompleted)

    return () => {
      cancelled = true
      window.removeEventListener("morning-given:completed", handleCompleted)
    }
  }, [])

  if (!loaded || !data) return null

  return (
    <section className="w-full bg-[#FDFAF5] px-6 pb-10 sm:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[1.75rem]"
        style={{
          backgroundImage: "url('/images/cherry-blossom-intention-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          boxShadow: "0 24px 60px rgba(193,59,107,0.14), 0 6px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,250,245,0.55) 45%, rgba(255,247,240,0.8) 100%)" }}
          aria-hidden
        />
        <div className="relative flex flex-col items-center gap-4 px-8 py-12 text-center sm:px-16 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/50 bg-white/80 px-4 py-1.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6D2F] shadow-sm backdrop-blur-sm">
            {"My Intention Today"}
          </span>

          <p className="max-w-[760px] font-playfair text-xl italic leading-relaxed text-[#2E1F27] sm:text-2xl lg:text-[27px]">
            {data.declaration}
          </p>

          {data.whyItMatters && (
            <p className="max-w-[640px] rounded-xl bg-white/55 px-5 py-3 font-montserrat text-[13px] leading-relaxed text-[#4A3A42] backdrop-blur-sm">
              <span className="font-semibold text-[#5C8A63]">{"Why this matters: "}</span>
              {data.whyItMatters}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  )
}
