"use client"

/**
 * CommunityClosedGate — Premium cinematic "Community Closed" hero state.
 *
 * Renders a full-screen cherry blossom evening scene with a glass-morphism
 * card. Shown ONLY when `access.locked` is true (11 PM – 7 AM ET).
 * Platform admins with Developer Mode enabled are never locked out.
 */

import { useOperatingEngine } from "@/components/operating-engine-provider"

export function CommunityClosedGate() {
  const experience = useOperatingEngine()
  if (!experience || !experience.access.locked) return null

  const { countdown } = experience.community

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">

      {/* ── Cinematic background ───────────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src="/images/block-digital-detox.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Evening atmosphere overlay — very light so artwork stays visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(18,12,28,0.45) 0%, rgba(30,20,40,0.30) 45%, rgba(18,12,28,0.50) 100%)",
          }}
        />
        {/* Subtle warm lantern glow from bottom-right */}
        <div
          className="absolute bottom-0 right-0 h-[60%] w-[50%]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 100%, rgba(212,160,80,0.18) 0%, transparent 65%)",
          }}
          aria-hidden
        />
      </div>

      {/* ── Floating petal accents ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden>
        <span className="absolute left-[12%] top-[18%] text-2xl opacity-40" style={{ transform: "rotate(-15deg)" }}>🌸</span>
        <span className="absolute left-[28%] top-[8%] text-lg opacity-30" style={{ transform: "rotate(10deg)" }}>🌸</span>
        <span className="absolute right-[18%] top-[22%] text-xl opacity-35" style={{ transform: "rotate(20deg)" }}>🌸</span>
        <span className="absolute right-[32%] top-[12%] text-sm opacity-25" style={{ transform: "rotate(-8deg)" }}>🌸</span>
        <span className="absolute bottom-[25%] left-[8%] text-base opacity-30" style={{ transform: "rotate(5deg)" }}>🌸</span>
      </div>

      {/* ── Glass card — left-anchored, max 33% width on large screens ── */}
      <div className="relative z-10 flex h-full items-center justify-start px-8 py-10 lg:px-16">
        <div
          className="w-full max-w-sm rounded-2xl p-8 shadow-2xl lg:max-w-md"
          style={{
            background: "rgba(253, 250, 247, 0.82)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow:
              "0 8px 48px rgba(18,12,28,0.22), 0 2px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >

          {/* Now Being Lived label */}
          <div className="mb-5 inline-flex items-center gap-2">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-[#78AD7D] opacity-50"
                style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              <span className="relative text-[10px] leading-none">🌸</span>
            </span>
            <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#78AD7D]">
              Now Being Lived
            </span>
          </div>

          {/* Current segment */}
          <h2 className="font-playfair text-2xl font-semibold leading-tight text-[#C13B6B] lg:text-3xl">
            Unplug Digital Detox™
          </h2>
          <p className="mt-1 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-[#5A4A52]">
            11:00 PM – 7:00 AM ET
          </p>

          {/* Divider */}
          <div className="my-5 h-px bg-[#C8B89A]/40" />

          {/* Primary message */}
          <p className="font-playfair text-xl font-semibold leading-snug text-[#1C161A] lg:text-2xl">
            Our Day Has Ended &amp;
          </p>
          <p className="font-playfair text-xl font-semibold leading-snug text-[#1C161A] lg:text-2xl">
            {"We're Closed For The Evening."}
          </p>

          {/* Supporting copy */}
          <p className="mt-4 font-montserrat text-sm leading-relaxed text-[#5A4A52]">
            The Harmony Lane™ community is intentionally offline so you can disconnect from technology, restore your mind and body, and enjoy restorative sleep.
          </p>
          <p className="mt-2 font-montserrat text-sm italic leading-relaxed text-[#7A6A72]">
            Because {"tomorrow's"} success begins with {"tonight's"} recovery.
          </p>

          {/* Inspirational quote */}
          <blockquote
            className="mt-5 rounded-xl px-4 py-3"
            style={{ background: "rgba(120,173,125,0.10)", borderLeft: "3px solid #78AD7D" }}
          >
            <p className="font-playfair text-sm italic leading-relaxed text-[#3a5c3d]">
              &ldquo;Your devices are resting. Now let your mind and body do the same.&rdquo;
            </p>
          </blockquote>

          {/* Community Closed button */}
          <div className="mt-6">
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl bg-[#78AD7D]/70 py-3 font-montserrat text-sm font-semibold tracking-wide text-white opacity-80"
              aria-label="Community is currently closed"
            >
              Community Closed
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-[#C8B89A]/40" />

          {/* Up Next */}
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#7A6A72]">
              Up Next
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-base">🌅</span>
              <div>
                <p className="font-playfair text-base font-semibold text-[#1C161A]">
                  Flex Time™
                </p>
                <p className="font-montserrat text-xs text-[#5A4A52]">7:00–9:00 AM ET</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#F5EFE4] px-3 py-2">
              <span className="font-montserrat text-xs font-medium text-[#7A6A72]">Opens in</span>
              <span className="font-montserrat text-sm font-bold text-[#78AD7D]">
                {countdown.label}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Ping keyframe injection */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>

    </div>
  )
}
