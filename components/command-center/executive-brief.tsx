"use client"

/**
 * Cherry Blossom Executive Brief™ — a concise executive briefing, not a
 * motivational speech. Each card is one or two sentences and only appears when
 * the member data justifies it.
 */
import { Target, TrendingUp, ShieldAlert, PartyPopper, Bell, Lightbulb } from "lucide-react"
import type { BriefCard, BriefCardKind, ExecutiveBrief } from "@/lib/founder-intelligence/types"

const CARD_META: Record<BriefCardKind, { icon: typeof Target; accent: string }> = {
  focus: { icon: Target, accent: "text-[#5D9D61]" },
  opportunity: { icon: TrendingUp, accent: "text-[#5D9D61]" },
  risk: { icon: ShieldAlert, accent: "text-[#E26C73]" },
  celebration: { icon: PartyPopper, accent: "text-[#E26C73]" },
  reminder: { icon: Bell, accent: "text-[#C79A3A]" },
  insight: { icon: Lightbulb, accent: "text-[#5D9D61]" },
}

function BriefRow({ card }: { card: BriefCard }) {
  const meta = CARD_META[card.kind]
  const Icon = meta.icon
  return (
    <li className="flex gap-3 border-t border-[#3A2E33]/10 py-4 first:border-t-0 first:pt-0">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${meta.accent}`} aria-hidden="true" />
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#3A2E33]">{card.title}</h3>
        <p className="mt-1 leading-relaxed text-[#5C4F55] text-pretty">{card.body}</p>
      </div>
    </li>
  )
}

export function ExecutiveBriefCard({ brief }: { brief: ExecutiveBrief }) {
  return (
    <section
      aria-label="Cherry Blossom Executive Brief"
      className="rounded-3xl border border-[#3A2E33]/10 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[#3A2E33]">
        <span className="text-sm font-medium uppercase tracking-wide">Cherry Blossom Executive Brief™</span>
      </div>

      <p className="mt-2 font-playfair text-xl italic text-[#3A2E33] text-balance">{brief.greeting}</p>

      <ul className="mt-4">
        {brief.cards.map((card) => (
          <BriefRow key={`${card.kind}-${card.title}`} card={card} />
        ))}
      </ul>
    </section>
  )
}
