"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Home", href: "/" },
  { label: "The Sunday Shift", href: "#sunday-shift" },
  { label: "Mondays", href: "/mondays" },
  { label: "Experiences", href: "/experiences" },
  { label: "About Barbara", href: "/about" },
  { label: "Speaking", href: "/speaking" },
  { label: "Media", href: "/media" },
]

export function MarketingNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#F8C8C8]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-[#2F4F4F]">
              Make Time For More<sup className="text-xs">™</sup>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#4A5568] hover:text-[#E26C73] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link href="#sunday-shift">
              <Button className="bg-[#E26C73] hover:bg-[#D15A61] text-white rounded-full px-6">
                Enter the Garden
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#2F4F4F]" />
            ) : (
              <Menu className="w-6 h-6 text-[#2F4F4F]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-[#F8C8C8]/30">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-[#4A5568] hover:text-[#E26C73] transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="#sunday-shift" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#E26C73] hover:bg-[#D15A61] text-white rounded-full mt-2">
                  Enter the Garden
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

