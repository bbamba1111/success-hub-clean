"use client"

/** Small shared building blocks for the Sunday Design Day™ phases. */

import { Sparkles } from "lucide-react"
import type { ReactNode } from "react"

/** Cherry Blossom Guidance™ note (placeholder intelligence this pass). */
export function GuidanceNote({ children, size = "sm" }: { children: ReactNode; size?: "sm" | "lg" }) {
  return (
    <div className={`harmony-glass ${size === "lg" ? "p-6 sm:p-7" : "p-5"}`}>
      <div className="flex items-center gap-2 text-brand-green-dark">
        <Sparkles className="ds-icon-sm" aria-hidden />
        <span className="ds-eyebrow text-brand-green-dark/80">Cherry Blossom Guidance™</span>
      </div>
      <p
        className={`mt-2 font-serif italic leading-relaxed text-brand-ink-soft text-pretty ${
          size === "lg" ? "text-lg text-brand-ink" : "text-[15px]"
        }`}
      >
        {children}
      </p>
    </div>
  )
}

/** A labelled reflective textarea used across the Reality Check™ + segments. */
export function ReflectField({
  label,
  prompt,
  placeholder,
  value,
  onChange,
  rows = 3,
  readOnly = false,
}: {
  label: string
  prompt?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  rows?: number
  readOnly?: boolean
}) {
  return (
    <label className="block">
      <span className="block font-display text-base font-semibold text-brand-ink">{label}</span>
      {prompt && <span className="mt-0.5 block text-sm leading-relaxed text-brand-ink-soft">{prompt}</span>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
        className={`mt-2 w-full resize-y rounded-lg border border-black/[0.08] bg-card px-3.5 py-3 text-sm leading-relaxed text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
          readOnly ? "cursor-default opacity-90" : ""
        }`}
      />
    </label>
  )
}

/** Section heading inside a phase. */
export function PhaseHeading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-brand-ink">{children}</h3>
      {note && <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{note}</p>}
    </div>
  )
}
