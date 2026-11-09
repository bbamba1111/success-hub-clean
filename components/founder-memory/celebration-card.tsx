"use client"

/**
 * CelebrationCard — Phase 16.0
 * Premium milestone card with CSS shimmer, Playfair headline.
 * Used for major achievements: score bands, streak milestones, etc.
 */

import Link from "next/link"
import type { FounderMemory } from "@/lib/founder-memory/types"

interface CelebrationCardProps {
  memory: FounderMemory
  /** Large centred metric (e.g. "100" for score, "30" for streak). */
  metricValue?: string | number
  metricLabel?: string
}

export function CelebrationCard({
  memory,
  metricValue,
  metricLabel,
}: CelebrationCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-[#1C161A] px-6 py-8 text-white shadow-xl">
      {/* Shimmer overlay — pure CSS, no JS animation */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background:
            "repeating-linear-gradient(105deg, transparent, transparent 40px, rgba(255,255,255,0.4) 40px, rgba(255,255,255,0.4) 42px)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        }}
        aria-hidden
      />

      {/* Category chip */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#F6C44B]" aria-hidden />
        <span className="font-montserrat text-[10px] font-semibold uppercase tracking-widest text-[#F6C44B]">
          Celebration
        </span>
      </div>

      {/* Metric */}
      {metricValue !== undefined && (
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-playfair text-6xl font-bold leading-none text-white">
            {metricValue}
          </span>
          {metricLabel && (
            <span className="font-montserrat text-sm font-medium text-white/60">
              {metricLabel}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 font-playfair text-2xl font-semibold leading-tight text-white">
        {memory.title}
      </h3>

      {/* Summary */}
      <p className="mb-4 font-montserrat text-[13px] leading-relaxed text-white/70">
        {memory.summary}
      </p>

      {/* Cherry Blossom reflection */}
      {memory.cherryBlossomReflection && (
        <blockquote className="mb-4 border-l-2 border-white/20 pl-3">
          <p className="font-montserrat text-[12px] italic leading-relaxed text-white/60">
            &ldquo;{memory.cherryBlossomReflection}&rdquo;
          </p>
          <footer className="mt-1 font-montserrat text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Cherry Blossom
          </footer>
        </blockquote>
      )}

      {/* CTA */}
      {memory.ctaLabel && memory.ctaHref && (
        <Link
          href={memory.ctaHref}
          className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-4 py-2 font-montserrat text-[11px] font-semibold text-white transition-all hover:bg-white/20"
        >
          {memory.ctaLabel} &rarr;
        </Link>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </article>
  )
}
