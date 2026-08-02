"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Shuffle, Volume2, VolumeX, Square } from "lucide-react"

// ─── Web Audio synthesis profiles ─────────────────────────────────────────────
// Each profile describes how to synthesize the soundscape using the Web Audio API.
// "noise" type: filtered noise (rain, ocean, wind, fireplace).
// "tone" type: layered sine waves (piano, focus, chime).
// "cafe" type: noise + rhythmic low-freq pulses (cafe ambience).

type NoiseColor = "white" | "pink" | "brown"

interface NoiseProfile {
  kind: "noise"
  color: NoiseColor
  lowpass?: number   // Hz — low-pass cutoff (warmer = lower)
  highpass?: number  // Hz — high-pass cutoff (removes rumble)
  lfo?: number       // Hz — gentle amplitude modulation (waves)
  lfoDepth?: number  // 0–1
}

interface ToneProfile {
  kind: "tone"
  freqs: number[]    // fundamental + harmonics
  detune?: number    // cents of slight detuning for warmth
  lfo?: number
  lfoDepth?: number
}

type AudioProfile = NoiseProfile | ToneProfile

const AUDIO_PROFILES: Record<string, AudioProfile> = {
  // Rain-like
  "gentle-rain":          { kind: "noise", color: "pink",  lowpass: 1200, highpass: 300, lfo: 0.08, lfoDepth: 0.18 },
  "rain":                 { kind: "noise", color: "pink",  lowpass: 1600, highpass: 200 },
  "night-garden":         { kind: "noise", color: "pink",  lowpass: 900,  highpass: 250, lfo: 0.05, lfoDepth: 0.12 },
  "quiet-library":        { kind: "noise", color: "pink",  lowpass: 600,  highpass: 400 },
  "gentle-rhythmic":      { kind: "noise", color: "pink",  lowpass: 800,  highpass: 350, lfo: 0.15, lfoDepth: 0.20 },
  // Ocean-like (deeper brown noise, slow LFO = waves)
  "ocean-waves":          { kind: "noise", color: "brown", lowpass: 900,  highpass: 80,  lfo: 0.10, lfoDepth: 0.35 },
  "ocean-sunrise":        { kind: "noise", color: "brown", lowpass: 1000, highpass: 100, lfo: 0.08, lfoDepth: 0.30 },
  "ocean-white-noise":    { kind: "noise", color: "brown", lowpass: 1400, highpass: 60,  lfo: 0.12, lfoDepth: 0.28 },
  "beach":                { kind: "noise", color: "brown", lowpass: 1100, highpass: 90,  lfo: 0.09, lfoDepth: 0.32 },
  "beach-walk":           { kind: "noise", color: "brown", lowpass: 1200, highpass: 100, lfo: 0.11, lfoDepth: 0.25 },
  "waterfront-patio":     { kind: "noise", color: "brown", lowpass: 1000, highpass: 80,  lfo: 0.08, lfoDepth: 0.28 },
  // Forest/Nature breeze (white noise, medium filter)
  "forest-morning":       { kind: "noise", color: "white", lowpass: 2200, highpass: 400, lfo: 0.06, lfoDepth: 0.15 },
  "forest-wind":          { kind: "noise", color: "white", lowpass: 1800, highpass: 300, lfo: 0.04, lfoDepth: 0.20 },
  "nature-walk":          { kind: "noise", color: "white", lowpass: 2400, highpass: 350, lfo: 0.07, lfoDepth: 0.14 },
  "nature-breeze":        { kind: "noise", color: "white", lowpass: 2000, highpass: 380, lfo: 0.05, lfoDepth: 0.16 },
  "outdoor-breeze":       { kind: "noise", color: "white", lowpass: 1900, highpass: 360, lfo: 0.06, lfoDepth: 0.15 },
  "spring-garden":        { kind: "noise", color: "white", lowpass: 2600, highpass: 320, lfo: 0.07, lfoDepth: 0.13 },
  "tropical-breeze":      { kind: "noise", color: "white", lowpass: 2800, highpass: 280, lfo: 0.08, lfoDepth: 0.14 },
  "cherry-blossom-garden":{ kind: "noise", color: "white", lowpass: 2500, highpass: 350, lfo: 0.06, lfoDepth: 0.13 },
  "botanical-garden":     { kind: "noise", color: "white", lowpass: 2300, highpass: 330, lfo: 0.06, lfoDepth: 0.14 },
  "garden-lunch":         { kind: "noise", color: "white", lowpass: 2100, highpass: 340, lfo: 0.07, lfoDepth: 0.12 },
  "park":                 { kind: "noise", color: "white", lowpass: 2200, highpass: 360, lfo: 0.06, lfoDepth: 0.13 },
  "park-picnic":          { kind: "noise", color: "white", lowpass: 2000, highpass: 340, lfo: 0.07, lfoDepth: 0.12 },
  // Fireplace (brown, warm, crackle sim via LFO)
  "fireplace":            { kind: "noise", color: "brown", lowpass: 700,  highpass: 60,  lfo: 0.40, lfoDepth: 0.22 },
  "evening-nature":       { kind: "noise", color: "pink",  lowpass: 1000, highpass: 200, lfo: 0.05, lfoDepth: 0.10 },
  // Café (pink noise base + subtle mid-freq presence)
  "european-cafe":        { kind: "noise", color: "pink",  lowpass: 2800, highpass: 500, lfo: 0.20, lfoDepth: 0.10 },
  "quiet-morning-cafe":   { kind: "noise", color: "pink",  lowpass: 2000, highpass: 600, lfo: 0.15, lfoDepth: 0.08 },
  // Dawn chorus (bright white)
  "dawn-chorus":          { kind: "noise", color: "white", lowpass: 3500, highpass: 800, lfo: 0.12, lfoDepth: 0.18 },
  // Tone-based (piano, focus, instrumental)
  "soft-piano":           { kind: "tone", freqs: [261.6, 329.6, 392, 523.2], detune: 8,  lfo: 0.08, lfoDepth: 0.12 },
  "sleep-piano":          { kind: "tone", freqs: [174.6, 220, 261.6, 349.2], detune: 10, lfo: 0.06, lfoDepth: 0.10 },
  "classical-focus":      { kind: "tone", freqs: [220, 277.2, 330, 440],     detune: 6,  lfo: 0.10, lfoDepth: 0.08 },
  "instrumental-focus":   { kind: "tone", freqs: [196, 246.9, 293.7, 392],   detune: 7,  lfo: 0.09, lfoDepth: 0.09 },
  "classical-energy":     { kind: "tone", freqs: [246.9, 311.1, 370, 493.9], detune: 5,  lfo: 0.14, lfoDepth: 0.10 },
  "acoustic-instruments": { kind: "tone", freqs: [207.7, 261.6, 311.1, 415.3],detune: 9, lfo: 0.08, lfoDepth: 0.11 },
  "light-acoustic":       { kind: "tone", freqs: [220, 261.6, 329.6, 440],   detune: 8,  lfo: 0.07, lfoDepth: 0.10 },
}

// ─── Web Audio engine ─────────────────────────────────────────────────────────

function createNoise(ctx: AudioContext, color: NoiseColor): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * 4 // 4-second loop
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  if (color === "white") {
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  } else if (color === "pink") {
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0=0.99886*b0+white*0.0555179; b1=0.99332*b1+white*0.0750759
      b2=0.96900*b2+white*0.1538520; b3=0.86650*b3+white*0.3104856
      b4=0.55000*b4+white*0.5329522; b5=-0.7616*b5-white*0.0168980
      data[i]=(b0+b1+b2+b3+b4+b5+b6+white*0.5362)/5.5
      b6=white*0.115926
    }
  } else { // brown
    let last = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
  }

  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.loop = true
  return src
}

interface AudioEngine {
  ctx: AudioContext
  gain: GainNode
  stop: () => void
}

function startAudioEngine(profileId: string, volume: number): AudioEngine | null {
  const profile = AUDIO_PROFILES[profileId]
  if (!profile) return null

  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0, ctx.currentTime)
  masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2)
  masterGain.connect(ctx.destination)

  const nodes: AudioNode[] = []

  if (profile.kind === "noise") {
    const src = createNoise(ctx, profile.color)
    let chain: AudioNode = src

    if (profile.highpass) {
      const hp = ctx.createBiquadFilter()
      hp.type = "highpass"; hp.frequency.value = profile.highpass; hp.Q.value = 0.5
      chain.connect(hp); chain = hp
    }
    if (profile.lowpass) {
      const lp = ctx.createBiquadFilter()
      lp.type = "lowpass"; lp.frequency.value = profile.lowpass; lp.Q.value = 0.8
      chain.connect(lp); chain = lp
    }

    if (profile.lfo && profile.lfoDepth) {
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 1 - profile.lfoDepth
      const lfo = ctx.createOscillator()
      lfo.type = "sine"; lfo.frequency.value = profile.lfo
      const lfoAmp = ctx.createGain()
      lfoAmp.gain.value = profile.lfoDepth
      lfo.connect(lfoAmp); lfoAmp.connect(lfoGain.gain)
      chain.connect(lfoGain); lfoGain.connect(masterGain)
      lfo.start(); nodes.push(lfo)
    } else {
      chain.connect(masterGain)
    }

    src.start(); nodes.push(src)

  } else if (profile.kind === "tone") {
    profile.freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.value = freq
      if (profile.detune) osc.detune.value = (i % 2 === 0 ? 1 : -1) * profile.detune
      const g = ctx.createGain(); g.gain.value = 0.18 / profile.freqs.length
      osc.connect(g)

      if (profile.lfo && profile.lfoDepth) {
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 1 - profile.lfoDepth
        const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = profile.lfo! + i * 0.01
        const lfoAmp = ctx.createGain(); lfoAmp.gain.value = profile.lfoDepth!
        lfo.connect(lfoAmp); lfoAmp.connect(lfoGain.gain)
        g.connect(lfoGain); lfoGain.connect(masterGain)
        lfo.start(); nodes.push(lfo)
      } else {
        g.connect(masterGain)
      }
      osc.start(); nodes.push(osc)
    })
  }

  const stop = () => {
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)
    setTimeout(() => {
      nodes.forEach(n => { try { (n as OscillatorNode | AudioBufferSourceNode).stop?.() } catch {} })
      ctx.close()
    }, 900)
  }

  return { ctx, gain: masterGain, stop }
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

type PlayState = "idle" | "playing"

export function SoundRitual({ blockId }: SoundRitualProps) {
  const options = getSoundscapes(blockId)
  const nonSilent = options.filter((s) => s.id !== "silent")

  const [selected, setSelected]   = useState<string | null>(null)
  const [remember, setRemember]   = useState(false)
  const [playState, setPlayState] = useState<PlayState>("idle")
  const [volume, setVolume]       = useState(0.5)
  const engineRef = useRef<AudioEngine | null>(null)

  // Load saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(blockId))
      if (saved) setSelected(saved)
    } catch {}
  }, [blockId])

  // Stop engine on unmount or blockId change
  useEffect(() => {
    return () => {
      engineRef.current?.stop()
      engineRef.current = null
      setPlayState("idle")
    }
  }, [blockId])

  const stopAudio = useCallback(() => {
    engineRef.current?.stop()
    engineRef.current = null
    setPlayState("idle")
  }, [])

  const playAudio = useCallback((soundId: string) => {
    // Stop any existing engine first
    engineRef.current?.stop()
    engineRef.current = null

    const engine = startAudioEngine(soundId, volume)
    if (!engine) { setPlayState("idle"); return }
    engineRef.current = engine
    setPlayState("playing")
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
    const list = pool.length > 0 ? pool : nonSilent
    const pick = list[Math.floor(Math.random() * list.length)]
    choose(pick.id)
  }, [nonSilent, selected, choose])

  const togglePlay = () => {
    if (!selected || selected === "silent") return
    if (playState === "playing") stopAudio()
    else playAudio(selected)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (engineRef.current) {
      engineRef.current.gain.gain.setValueAtTime(v, engineRef.current.ctx.currentTime)
    }
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
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7FB069] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label={isPlaying ? "Stop soundscape" : "Play soundscape"}
          >
            {isPlaying ? (
              <Square className="h-3 w-3 fill-white" aria-hidden />
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
              : `${selectedSoundscape?.label} — ${isPlaying ? "playing" : "paused"}`}
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
