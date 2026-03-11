"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "./countdown-timer"
import { PetalAnimation } from "./petal-animation"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#FAF7F2] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Placeholder for hero image */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[#F8C8C8]/30 via-[#FAF7F2] to-[#FAF7F2]"
            style={{
              backgroundImage: "url('/images/women-in-garden-hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-[#FAF7F2]" />
          </div>
        </div>
      </div>

      {/* Petal Animation */}
      <PetalAnimation enabled={true} />

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase mb-4">
            Welcome to
          </p>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2F4F4F] mb-6 text-balance">
            Make Time For More<sup className="text-2xl">™</sup>
          </h1>

          <p className="text-xl md:text-2xl text-[#4A5568] max-w-3xl mb-4 leading-relaxed">
            A premium boutique Work-Life Balance installation for women entrepreneurs who left high-stress careers — and accidentally recreated burnout in their business.
          </p>

          <p className="text-lg text-[#7FB069] italic max-w-2xl mb-10">
            Inside the Harmony Lane™, work is intentionally contained so life can expand.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="#sunday-shift">
              <Button 
                size="lg" 
                className="bg-[#E26C73] hover:bg-[#D15A61] text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Start With Make The Sunday Shift™
              </Button>
            </Link>
            <Link href="#experience">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-8 py-6 text-lg font-semibold rounded-full transition-all"
              >
                Explore The Experience
              </Button>
            </Link>
          </div>

          {/* Countdown Timer */}
          <div className="w-full max-w-2xl">
            <CountdownTimer />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}

