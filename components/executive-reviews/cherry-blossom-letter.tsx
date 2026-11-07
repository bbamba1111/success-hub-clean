/**
 * CherryBlossomLetter™ — Phase 14.0
 * Premium narrative letter card from Cherry Blossom.
 * Used for monthly and quarterly reviews.
 */

import { Flower2 } from "lucide-react"

export function CherryBlossomLetter({ letter }: { letter: string }) {
  const paragraphs = letter.split("\n\n").filter(Boolean)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.07] bg-card">
      {/* Decorative top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E26C73] via-[#C8A84B] to-[#5D9D61]" aria-hidden />

      <div className="px-6 py-6 sm:px-8">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E26C73]/10">
            <Flower2 className="h-5 w-5 text-[#E26C73]" />
          </span>
          <div>
            <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-brand-ink-soft">
              A Letter From
            </p>
            <p className="font-playfair text-lg font-semibold text-brand-ink">Cherry Blossom</p>
          </div>
        </div>

        {/* Letter body */}
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className={
                para.startsWith("Dear ")
                  ? "font-playfair text-base font-medium italic text-brand-ink"
                  : para.startsWith("With ")
                    ? "font-playfair text-sm italic text-brand-ink-soft"
                    : "font-montserrat text-sm leading-relaxed text-brand-ink"
              }
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
