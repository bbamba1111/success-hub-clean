"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

/**
 * `experiencesHref` lets pages that reuse this nav but don't render the
 * `#experiences` section (e.g. /monday) point "Experiences" and "Begin Your
 * Journey" somewhere that actually exists on that page instead — the $497
 * embedded checkout on /monday, rather than a section that isn't there.
 */
export function LandingNav({ experiencesHref = "#experiences" }: { experiencesHref?: string }) {
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { label: "The Business Day", href: "#business-day" },
    { label: "The Ritual", href: "#ritual" },
    { label: "Cherry Blossom AI", href: "#cherry-blossom" },
    { label: "Experiences", href: experiencesHref },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="#top" className="flex items-center gap-2.5">
          <img
            src="/images/logo.png"
            alt="Make Time For More"
            width={36}
            height={36}
            className="rounded-full shadow-sm"
          />
          <span className="font-playfair text-lg font-bold tracking-tight text-[#4A3A42]">
            Make Time For More
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-poppins text-sm font-medium text-[#5A4A52] transition-colors hover:text-[#C13B6B]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/auth/login"
            className="font-poppins rounded-full px-4 py-2 text-sm font-medium text-[#5A4A52] transition-colors hover:text-[#C13B6B]"
          >
            Log In
          </Link>
          <a
            href={experiencesHref}
            className="font-poppins rounded-full bg-[#E26C73] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#E26C73]/25 transition-transform hover:scale-[1.03] hover:bg-[#d65a62]"
          >
            Begin Your Journey
          </a>
        </div>
      </nav>
    </header>
  )
}
