import {
  FOUNDING_PRICE_DEADLINE_LABEL,
  FUTURE_PRICE_EFFECTIVE_LABEL,
  FUTURE_PRICE_LABELS,
} from "@/lib/payments/config"

export function FoundingPriceNote({
  level,
  className = "",
}: {
  level: keyof typeof FUTURE_PRICE_LABELS
  className?: string
}) {
  return (
    <p className={`font-poppins text-sm leading-relaxed text-[#6A5A62] ${className}`}>
      Founding price through {FOUNDING_PRICE_DEADLINE_LABEL}. Planned price beginning {FUTURE_PRICE_EFFECTIVE_LABEL}:{" "}
      <span className="font-semibold text-[#4A3A42]">{FUTURE_PRICE_LABELS[level]}</span>.
    </p>
  )
}
