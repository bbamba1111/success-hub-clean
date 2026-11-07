/**
 * Checkout CTA for a public offer. When the offer has no verified checkout URL
 * it renders a non-interactive "opening soon" state instead of a dead or wrong link.
 */
export function OfferCta({
  href,
  label,
  variant = "primary",
}: {
  href?: string
  label: string
  variant?: "primary" | "secondary"
}) {
  const base =
    "font-poppins inline-flex w-fit items-center justify-center rounded-full px-8 py-4 text-sm font-semibold tracking-wide transition-transform"

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${base} cursor-not-allowed border border-[#D9CFD3] bg-[#F7F1F3] text-[#8A7A82]`}
      >
        {label} &middot; Enrollment Opening Soon
      </span>
    )
  }

  const styles =
    variant === "primary"
      ? "bg-[#8AA06A] text-white shadow-lg shadow-[#8AA06A]/25 hover:scale-[1.03] hover:bg-[#788e5a]"
      : "bg-[#C13B6B] text-white shadow-lg shadow-[#C13B6B]/20 hover:scale-[1.03] hover:bg-[#a8325c]"

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles}`}>
      {label}
    </a>
  )
}
