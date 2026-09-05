"use client"

import { useMemo } from "react"

/**
 * FloatingPetals — an ambient layer of slowly drifting cherry-blossom petals.
 *
 * Purely decorative (aria-hidden) and non-interactive. Sits behind content via
 * a low z-index and `pointer-events-none`. Honors prefers-reduced-motion (the
 * `.petal` class is hidden in that case via globals.css).
 *
 * Drop it inside any `relative`/`overflow-hidden` container:
 *   <section className="relative overflow-hidden">
 *     <FloatingPetals />
 *     ...content...
 *   </section>
 */
export function FloatingPetals({ count = 14 }: { count?: number }) {
  // Deterministic-per-mount petal configs so layout stays stable across renders.
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map(() => {
        const size = 8 + Math.random() * 12 // 8–20px
        return {
          left: Math.random() * 100, // vw %
          size,
          duration: 14 + Math.random() * 16, // 14–30s slow drift
          delay: -Math.random() * 24, // negative = mid-flight on load
          driftX: (Math.random() * 2 - 1) * 80, // -80 to 80px horizontal drift
          opacity: 0.35 + Math.random() * 0.35, // 0.35–0.7
        }
      }),
    [count],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // Consumed by the petal-drift keyframes in globals.css
            ["--petal-drift-x" as string]: `${p.driftX}px`,
            ["--petal-opacity" as string]: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
