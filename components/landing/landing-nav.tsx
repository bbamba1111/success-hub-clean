"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

/**
 * `experiencesHref` lets pages that reuse this nav but don't render the
 * `#experiences` section (e.g. /monday) point "Experiences" and "Begin Your
 * Journey" somewhere that actually exists on that page instead — the $497
 * embedded checkout on /monday, rather than a section that isn't there.
 */
export function LandingNav({
  experiencesHref = "#experiences",
  links,
  ctaLabel = "Experience the Week",
  tone = "light",
  showLogin = true,
}: {
  /** "dark" renders white brand/link/login text for pages with a dark hero. */
  tone?: "light" | "dark"
  experiencesHref?: string
  /** Optional override for the primary nav links (pages compose different sections). */
  links?: { label: string; href: string }[]
  /** Label for the primary nav CTA button. */
  ctaLabel?: string
  /** Hide member login on public entry pages that should remain a focused funnel. */
  showLogin?: boolean
}) {
  const [scrolled, setScrolled] = useState(false)

  const navLinks = links ?? [
    { label: "The Boundary", href: "#boundary-first" },
    { label: "The Audit", href: "#boundary-audit" },
    { label: "The Week", href: "#week" },
    { label: "The Experience", href: experiencesHref },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const dark = tone === "dark"
  const brandText = dark ? "text-[#FFF8F4]" : "text-[#4A3A42]"
  const linkText = dark ? "text-[#FFF8F4]" : "text-[#5A4A52]"
  const scrolledBg = dark
    ? "border-b border-white/10 bg-[#2E2228]/85 backdrop-blur-xl shadow-sm"
    : "border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm"

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? scrolledBg : "bg-transparent"}`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#top" className="flex items-center gap-2.5">
          <img
            src="/images/logo.png"
            alt="Harmony Lane"
            width={36}
            height={36}
            className="rounded-full shadow-sm"
          />
          <span className={`font-playfair text-lg font-bold tracking-tight ${brandText}`}>
            Harmony Lane™
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-poppins text-sm font-medium ${linkText} transition-colors hover:text-[#F6A9C2]`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {showLogin && (
            <Link
              href="/auth/login"
              className={`font-poppins rounded-full px-4 py-2 text-sm font-medium ${linkText} transition-colors hover:text-[#F6A9C2]`}
            >
              Log In
            </Link>
          )}
          <a
            href={experiencesHref}
            className="font-poppins rounded-full bg-[#E26C73] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
          >
            {ctaLabel}
          </a>
        </div>
      </nav>
    </header>
  )
}
