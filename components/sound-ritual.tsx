"use client"

/**
 * Sound Ritual™
 *
 * An intentional environmental design feature — not a music player.
 * Helps members mentally and emotionally transition into each Operating Segment™.
 *
 * Features:
 * - Curated soundscape options per segment
 * - "Remember my preference" persistence via localStorage
 * - "Surprise Me" — random pick from the segment's collection
 * - Premium calm aesthetic: Apple / Calm / Headspace register
 */

import { useState, useEffect, useCallback } from "react"
import { Shuffle } from "lucide-react"

// ─── Soundscape data ──────────────────────────────────────────────────────────

export interface Soundscape {
  id: string
  emoji: string
  label: string
}

const SOUNDSCAPES: Record<string, Soundscape[]> = {
  "morning-given": [
    { id: "cherry-blossom-garden", emoji: "🌸", label: "Cherry Blossom Garden" },
    { id: "dawn-chorus",          emoji: "🕊️", label: "Dawn Chorus" },
    { id: "ocean-sunrise",        emoji: "🌊", label: "Ocean Sunrise" },
    { id: "forest-morning",       emoji: "🍃", label: "Forest Morning" },
    { id: "quiet-morning-cafe",   emoji: "☕", label: "Quiet Morning Café" },
    { id: "soft-piano",           emoji: "🎹", label: "Soft Piano Reflection" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  "movement-window": [
    { id: "nature-walk",          emoji: "🌿", label: "Nature Walk" },
    { id: "beach-walk",           emoji: "🌊", label: "Beach Walk" },
    { id: "tropical-breeze",      emoji: "🌺", label: "Tropical Breeze" },
    { id: "classical-energy",     emoji: "🎼", label: "Classical Energy" },
    { id: "gentle-rhythmic",      emoji: "🥁", label: "Gentle Rhythmic Instrumentals" },
    { id: "spring-garden",        emoji: "🌸", label: "Spring Garden" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  "extended-lunch": [
    { id: "european-cafe",        emoji: "☕", label: "European Café" },
    { id: "garden-lunch",         emoji: "🌿", label: "Garden Lunch" },
    { id: "waterfront-patio",     emoji: "🌊", label: "Waterfront Patio" },
    { id: "park-picnic",          emoji: "🌳", label: "Park Picnic" },
    { id: "acoustic-instruments", emoji: "🎻", label: "Acoustic Instrumentals" },
    { id: "outdoor-breeze",       emoji: "🍃", label: "Outdoor Breeze" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  "ceo-workday": [
    { id: "gentle-rain",          emoji: "🌧️", label: "Gentle Rain" },
    { id: "ocean-white-noise",    emoji: "🌊", label: "Ocean White Noise" },
    { id: "forest-wind",          emoji: "🍃", label: "Forest Wind" },
    { id: "quiet-library",        emoji: "📚", label: "Quiet Library" },
    { id: "classical-focus",      emoji: "🎼", label: "Classical Focus" },
    { id: "instrumental-focus",   emoji: "🎹", label: "Instrumental Focus" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  "time-freedom": [
    { id: "beach",                emoji: "🌊", label: "Beach" },
    { id: "park",                 emoji: "🌳", label: "Park" },
    { id: "botanical-garden",     emoji: "🌸", label: "Botanical Garden" },
    { id: "light-acoustic",       emoji: "🎶", label: "Light Acoustic" },
    { id: "nature-breeze",        emoji: "🍃", label: "Nature Breeze" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  "power-down": [
    { id: "night-garden",         emoji: "🌙", label: "Night Garden" },
    { id: "rain",                 emoji: "🌧️", label: "Rain" },
    { id: "fireplace",            emoji: "🔥", label: "Fireplace" },
    { id: "ocean-waves",          emoji: "🌊", label: "Ocean Waves" },
    { id: "sleep-piano",          emoji: "🎹", label: "Sleep Piano" },
    { id: "evening-nature",       emoji: "🦉", label: "Evening Nature" },
    { id: "silent",               emoji: "🤍", label: "Silent" },
  ],
  // Monday block shares morning-given collection
  "monday-reality-check": [
    { id: "cherry-blossom-garden", emoji: "🌸", label: "Cherry Blossom Garden" },
    { id: "dawn-chorus",           emoji: "🕊️", label: "Dawn Chorus" },
    { id: "ocean-sunrise",         emoji: "🌊", label: "Ocean Sunrise" },
    { id: "forest-morning",        emoji: "🍃", label: "Forest Morning" },
    { id: "quiet-morning-cafe",    emoji: "☕", label: "Quiet Morning Café" },
    { id: "soft-piano",            emoji: "🎹", label: "Soft Piano Reflection" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
}

// Fallback for any segment not in the map
const DEFAULT_SOUNDSCAPES: Soundscape[] = [
  { id: "cherry-blossom-garden", emoji: "🌸", label: "Cherry Blossom Garden" },
  { id: "ocean-sunrise",         emoji: "🌊", label: "Ocean Sunrise" },
  { id: "forest-morning",        emoji: "🍃", label: "Forest Morning" },
  { id: "soft-piano",            emoji: "🎹", label: "Soft Piano" },
  { id: "silent",                emoji: "🤍", label: "Silent" },
]

function getSoundscapes(blockId: string): Soundscape[] {
  return SOUNDSCAPES[blockId] ?? DEFAULT_SOUNDSCAPES
}

function storageKey(blockId: string) {
  return `sound-ritual-pref:${blockId}`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SoundRitualProps {
  blockId: string
}

export function SoundRitual({ blockId }: SoundRitualProps) {
  const options = getSoundscapes(blockId)
  const nonSilent = options.filter((s) => s.id !== "silent")

  const [selected, setSelected] = useState<string | null>(null)
  const [remember, setRemember] = useState(false)

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(blockId))
      if (saved) {
        setSelected(saved)
        setRemember(true)
      }
    } catch {
      // localStorage unavailable
    }
  }, [blockId])

  const choose = useCallback(
    (id: string | null) => {
      setSelected(id)
      if (remember && id) {
        try { localStorage.setItem(storageKey(blockId), id) } catch {}
      }
    },
    [blockId, remember],
  )

  const surpriseMe = useCallback(() => {
    if (nonSilent.length === 0) return
    const pool = nonSilent.filter((s) => s.id !== selected)
    const pick = pool.length > 0 ? pool : nonSilent
    choose(pick[Math.floor(Math.random() * pick.length)].id)
  }, [nonSilent, selected, choose])

  const toggleRemember = () => {
    const next = !remember
    setRemember(next)
    if (next && selected) {
      try { localStorage.setItem(storageKey(blockId), selected) } catch {}
    } else {
      try { localStorage.removeItem(storageKey(blockId)) } catch {}
    }
  }

  const selectedSoundscape = options.find((s) => s.id === selected)

  return (
    <div className="px-7 py-5">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/50">
              Sound Ritual™
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B5860]/60">
              Choose the environment that will support you during this Operating Segment™.
            </p>
          </div>
          {/* Surprise Me */}
          <button
            type="button"
            onClick={surpriseMe}
            title="Surprise Me — random soundscape"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#78AD7D] transition-colors hover:bg-[#78AD7D]/10"
          >
            <Shuffle className="h-3 w-3" aria-hidden />
            Surprise Me
          </button>
        </div>
      </div>

      {/* Soundscape grid */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
        role="group"
        aria-label="Sound Ritual options"
      >
        {options.map((s) => {
          const isSelected = selected === s.id
          const isSilent = s.id === "silent"
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => choose(isSelected ? null : s.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium transition-all duration-150 ${
                isSelected
                  ? isSilent
                    ? "bg-[#F0ECE8] text-[#6B5860] ring-1 ring-[#C8B89A]/60"
                    : "bg-[#7FB069]/12 text-[#3A6B47] ring-1 ring-[#7FB069]/40 shadow-sm"
                  : "text-[#5C4F55] hover:bg-black/[0.03] hover:text-[#3A2E33]"
              }`}
            >
              <span className="text-[14px] leading-none shrink-0" aria-hidden>{s.emoji}</span>
              <span className="leading-snug">{s.label}</span>
              {isSelected && !isSilent && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#7FB069] animate-pulse" aria-hidden />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected confirmation + remember preference */}
      {selected && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-[#78AD7D] font-medium">
            {selectedSoundscape?.emoji} {selectedSoundscape?.label} selected
            {selected === "silent" ? " — silent mode" : " — your environment is set"}
          </p>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={toggleRemember}
              className="h-3.5 w-3.5 rounded accent-[#7FB069] cursor-pointer"
            />
            <span className="font-montserrat text-[10px] uppercase tracking-[0.14em] text-[#6B5860]/60">
              Remember for this segment
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
