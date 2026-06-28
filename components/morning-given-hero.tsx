"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useMemo } from "react"

// Deterministic-ish petal configuration generated once per mount
function usePetals(count: number) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 12,
        size: 10 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 120,
        rotate: Math.random() * 360,
      })),
    [count],
  )
}

function FallingPetals() {
  const petals = usePetals(14)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="absolute top-[-5%] block rounded-[100%_0_100%_0]"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size,
            background: "linear-gradient(135deg, rgba(255,214,224,0.95), rgba(226,108,115,0.55))",
            boxShadow: "0 0 6px rgba(255,214,224,0.5)",
          }}
          initial={{ y: "-10%", x: 0, opacity: 0, rotate: petal.rotate }}
          animate={{
            y: "115%",
            x: [0, petal.drift, 0],
            opacity: [0, 0.9, 0.9, 0],
            rotate: petal.rotate + 220,
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export function MorningGivenHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "min(680px, 90vh)" }}>
      {/* Cinematic background image with slow movement */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.18 }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
      >
        <img
          src="/images/vacation-celebration-women-cherry-blossoms.png"
          alt="Cherry blossom garden at sunrise"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Subtle dark gradient only behind the text (bottom-left weighted) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(28,22,26,0.72) 0%, rgba(28,22,26,0.45) 38%, rgba(28,22,26,0.08) 70%, rgba(28,22,26,0) 100%)",
        }}
      />

      {/* Floating cherry blossom petals */}
      <FallingPetals />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
          }}
          className="max-w-2xl rounded-3xl border border-white/15 bg-black/15 p-8 backdrop-blur-md sm:p-10"
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-sm font-medium uppercase tracking-[0.3em] text-[#FFD6E0]"
          >
            Harmony Presents
          </motion.p>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mt-4 text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Morning GIV•EN<sup className="text-2xl align-super">™</sup> Routine
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-5 text-pretty text-base leading-relaxed text-white/90 sm:text-lg"
          >
            Welcome back to The Cherry Blossom Garden™—the place where entrepreneurs contain work so life has space to
            expand.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-5 space-y-1 text-white/85"
          >
            <p className="text-lg font-medium text-white">Good morning, Barbara 🌸</p>
            <p className="text-sm leading-relaxed text-white/80">Before the world asks anything of you...</p>
            <p className="text-sm leading-relaxed text-white/80">
              Pause. Breathe. Express gratitude. Set today&apos;s intention. Protect what matters most.
            </p>
            <p className="text-sm leading-relaxed text-white/80">Lead yourself before leading your business.</p>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://join.butter.us/make-time-for-more/onboarding"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full bg-[#E26C73] text-white shadow-lg hover:bg-[#d15a61] sm:w-auto"
                >
                  Join Morning Live
                </Button>
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <a href="#wellness-dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-white/70 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto"
                >
                  View Today&apos;s Business Day
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default MorningGivenHero
