"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Shuffle, Volume2, VolumeX, Loader2 } from "lucide-react"

// ─── Audio URLs ───────────────────────────────────────────────────────────────
// Free-to-use ambient loops from publicly accessible CDNs

const AUDIO_URLS: Record<string, string> = {
  "gentle-rain":          "https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3",
  "ocean-waves":          "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "forest-morning":       "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "fireplace":            "https://cdn.freesound.org/previews/472/472688_9948930-lq.mp3",
  "rain":                 "https://cdn.freesound.org/previews/243/243627_4284968-lq.mp3",
  "classical-focus":      "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "soft-piano":           "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "dawn-chorus":          "https://cdn.freesound.org/previews/398/398703_4921277-lq.mp3",
  "ocean-sunrise":        "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "nature-walk":          "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "beach-walk":           "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "night-garden":         "https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3",
  "forest-wind":          "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "ocean-white-noise":    "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "evening-nature":       "https://cdn.freesound.org/previews/398/398703_4921277-lq.mp3",
  "sleep-piano":          "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "park":                 "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "nature-breeze":        "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "garden-lunch":         "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "outdoor-breeze":       "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "spring-garden":        "https://cdn.freesound.org/previews/398/398703_4921277-lq.mp3",
  "cherry-blossom-garden":"https://cdn.freesound.org/previews/398/398703_4921277-lq.mp3",
  "tropical-breeze":      "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "botanical-garden":     "https://cdn.freesound.org/previews/398/398703_4921277-lq.mp3",
  "beach":                "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "park-picnic":          "https://cdn.freesound.org/previews/264/264560_4921277-lq.mp3",
  "waterfront-patio":     "https://cdn.freesound.org/previews/372/372011_6687992-lq.mp3",
  "european-cafe":        "https://cdn.freesound.org/previews/243/243627_4284968-lq.mp3",
  "quiet-morning-cafe":   "https://cdn.freesound.org/previews/243/243627_4284968-lq.mp3",
  "quiet-library":        "https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3",
  "classical-energy":     "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "instrumental-focus":   "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "gentle-rhythmic":      "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "acoustic-instruments": "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
  "light-acoustic":       "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3",
}

// ─── Soundscape catalogue ─────────────────────────────────────────────────────

export interface Soundscape {
  id: string
  emoji: string
  label: string
}

const SOUNDSCAPES: Record<string, Soundscape[]> = {
  "morning-given": [
    { id: "cherry-blossom-garden", emoji: "🌸", label: "Cherry Blossom Garden" },
    { id: "dawn-chorus",           emoji: "🕊️", label: "Dawn Chorus" },
    { id: "ocean-sunrise",         emoji: "🌊", label: "Ocean Sunrise" },
    { id: "forest-morning",        emoji: "🍃", label: "Forest Morning" },
    { id: "quiet-morning-cafe",    emoji: "☕", label: "Quiet Morning Café" },
    { id: "soft-piano",            emoji: "🎹", label: "Soft Piano Reflection" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "movement-window": [
    { id: "nature-walk",           emoji: "🌿", label: "Nature Walk" },
    { id: "beach-walk",            emoji: "🌊", label: "Beach Walk" },
    { id: "tropical-breeze",       emoji: "🌺", label: "Tropical Breeze" },
    { id: "classical-energy",      emoji: "🎼", label: "Classical Energy" },
    { id: "gentle-rhythmic",       emoji: "🥁", label: "Gentle Rhythmic Instrumentals" },
    { id: "spring-garden",         emoji: "🌸", label: "Spring Garden" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "extended-lunch": [
    { id: "european-cafe",         emoji: "☕", label: "European Café" },
    { id: "garden-lunch",          emoji: "🌿", label: "Garden Lunch" },
    { id: "waterfront-patio",      emoji: "🌊", label: "Waterfront Patio" },
    { id: "park-picnic",           emoji: "🌳", label: "Park Picnic" },
    { id: "acoustic-instruments",  emoji: "🎻", label: "Acoustic Instrumentals" },
    { id: "outdoor-breeze",        emoji: "🍃", label: "Outdoor Breeze" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "lunch-break": [
    { id: "european-cafe",         emoji: "☕", label: "European Café" },
    { id: "garden-lunch",          emoji: "🌿", label: "Garden Lunch" },
    { id: "waterfront-patio",      emoji: "🌊", label: "Waterfront Patio" },
    { id: "park-picnic",           emoji: "🌳", label: "Park Picnic" },
    { id: "acoustic-instruments",  emoji: "🎻", label: "Acoustic Instrumentals" },
    { id: "outdoor-breeze",        emoji: "🍃", label: "Outdoor Breeze" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "ceo-workday": [
    { id: "gentle-rain",           emoji: "🌧️", label: "Gentle Rain" },
    { id: "ocean-white-noise",     emoji: "🌊", label: "Ocean White Noise" },
    { id: "forest-wind",           emoji: "🍃", label: "Forest Wind" },
    { id: "quiet-library",         emoji: "📚", label: "Quiet Library" },
    { id: "classical-focus",       emoji: "🎼", label: "Classical Focus" },
    { id: "instrumental-focus",    emoji: "🎹", label: "Instrumental Focus" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "time-freedom": [
    { id: "beach",                 emoji: "🌊", label: "Beach" },
    { id: "park",                  emoji: "🌳", label: "Park" },
    { id: "botanical-garden",      emoji: "🌸", label: "Botanical Garden" },
    { id: "light-acoustic",        emoji: "🎶", label: "Light Acoustic" },
    { id: "nature-breeze",         emoji: "🍃", label: "Nature Breeze" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
  "power-down": [
    { id: "night-garden",          emoji: "🌙", label: "Night Garden" },
    { id: "rain",                  emoji: "🌧️", label: "Rain" },
    { id: "fireplace",             emoji: "🔥", label: "Fireplace" },
    { id: "ocean-waves",           emoji: "🌊", label: "Ocean Waves" },
    { id: "sleep-piano",           emoji: "🎹", label: "Sleep Piano" },
    { id: "evening-nature",        emoji: "🦉", label: "Evening Nature" },
    { id: "silent",                emoji: "🤍", label: "Silent" },
  ],
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

type PlayState = "idle" | "loading" | "playing"

export function SoundRitual({ blockId }: SoundRitualProps) {
  const options = getSoundscapes(blockId)
  const nonSilent = options.filter((s) => s.id !== "silent")

  const [selected, setSelected]   = useState<string | null>(null)
  const [remember, setRemember]   = useState(false)
  const [playState, setPlayState] = useState<PlayState>("idle")
  const [volume, setVolume]       = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(blockId))
      if (saved) { setSelected(saved); setRemember(true) }
    } catch {}
  }, [blockId])

  // Stop + destroy audio on unmount or blockId change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
      setPlayState("idle")
    }
  }, [blockId])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlayState("idle")
  }, [])

  const playAudio = useCallback((soundId: string) => {
    const url = AUDIO_URLS[soundId]
    if (!url) { setPlayState("idle"); return }

    setPlayState("loading")

    // Reuse or create
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.loop = true
    }

    const audio = audioRef.current
    audio.volume = volume

    if (audio.src !== url) {
      audio.src = url
      audio.load()
    }

    audio.oncanplay = () => {
      audio.play()
        .then(() => setPlayState("playing"))
        .catch(() => setPlayState("idle"))
    }
    audio.onerror = () => setPlayState("idle")

    // If already loaded enough, play immediately
    if (audio.readyState >= 3) {
      audio.play()
        .then(() => setPlayState("playing"))
        .catch(() => setPlayState("idle"))
    }
  }, [volume])

  const choose = useCallback((id: string | null) => {
    setSelected(id)

    if (!id || id === "silent") {
      stopAudio()
    } else {
      playAudio(id)
    }

    if (remember && id) {
      try { localStorage.setItem(storageKey(blockId), id) } catch {}
    }
  }, [blockId, remember, stopAudio, playAudio])

  const surpriseMe = useCallback(() => {
    if (nonSilent.length === 0) return
    const pool = nonSilent.filter((s) => s.id !== selected)
    const pick = (pool.length > 0 ? pool : nonSilent)[Math.floor(Math.random() * (pool.length > 0 ? pool : nonSilent).length)]
    choose(pick.id)
  }, [nonSilent, selected, choose])

  const togglePlay = () => {
    if (!selected || selected === "silent") return
    if (playState === "playing") {
      stopAudio()
    } else {
      playAudio(selected)
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

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
  const isPlaying = playState === "playing"
  const isLoading = playState === "loading"
  const hasAudio  = selected && selected !== "silent"

  return (
    <div className="px-7 py-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/50">
            Sound Ritual™
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B5860]/60">
            Choose the environment that will support you during this Operating Segment™.
          </p>
        </div>
        <button
          type="button"
          onClick={surpriseMe}
          title="Surprise Me"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.14em] text-[#78AD7D] transition-colors hover:bg-[#78AD7D]/10"
        >
          <Shuffle className="h-3 w-3" aria-hidden />
          Surprise Me
        </button>
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
          const isSilent   = s.id === "silent"
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

      {/* Playback controls — only shown when a non-silent soundscape is selected */}
      {hasAudio && (
        <div className="mt-4 flex items-center gap-3">
          {/* Play / pause / loading */}
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
            aria-label={isLoading ? "Loading" : isPlaying ? "Pause soundscape" : "Play soundscape"}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : isPlaying ? (
              <VolumeX className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Volume2 className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            aria-label="Volume"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#D9E8D2] accent-[#7FB069]"
          />

          <span className="font-montserrat text-[10px] text-[#6B5860]/50 tabular-nums">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Confirmation + remember preference */}
      {selected && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-[#78AD7D] font-medium">
            {selectedSoundscape?.emoji}{" "}
            {selected === "silent"
              ? "Silent mode — no ambient sound"
              : `${selectedSoundscape?.label} — ${isPlaying ? "playing" : isLoading ? "loading…" : "paused"}`}
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
