import Link from "next/link"
import type { ReactNode } from "react"

export const REALITY_CHECK_HREF = "/reality-check"

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-poppins text-xs font-semibold uppercase tracking-[0.24em] text-[#5A7F46]">{children}</p>
  )
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-playfair text-balance text-3xl font-bold leading-tight text-[#4A3A42] sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  )
}

export function Body({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-poppins text-pretty text-base leading-relaxed text-[#5A4A52] ${className}`}>{children}</p>
}

export function Emphasis({ children }: { children: ReactNode }) {
  return (
    <p className="font-playfair text-pretty text-xl font-semibold leading-snug text-[#C13B6B] sm:text-2xl">
      {children}
    </p>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="font-poppins flex flex-col gap-3 text-base leading-relaxed text-[#4A3A42]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8AA06A]" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function CtaLink({
  href,
  label,
  variant = "primary",
}: {
  href: string
  label: string
  variant?: "primary" | "secondary"
}) {
  const styles =
    variant === "primary"
      ? "bg-[#8AA06A] text-white shadow-lg shadow-[#8AA06A]/25 hover:bg-[#788e5a]"
      : "bg-[#C13B6B] text-white shadow-lg shadow-[#C13B6B]/20 hover:bg-[#a8325c]"
  return (
    <Link
      href={href}
      className={`font-poppins inline-flex w-fit items-center justify-center rounded-full px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] transition-transform hover:scale-[1.03] ${styles}`}
    >
      {label}
    </Link>
  )
}
