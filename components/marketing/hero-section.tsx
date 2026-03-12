"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "./countdown-timer"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#FDF8F5] via-[#FEF1EE] to-[#F5FAF5] overflow-hidden">
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <p className="text-lg font-poppins font-medium tracking-widest text-[#E26C73] uppercase mb-6">
            Welcome to
          </p>

          <h1 className="text-6xl md:text-8xl font-playfair font-bold text-[#2F4F4F] mb-8 tracking-tight text-balance">
            Make Time For More<sup className="text-3xl">™</sup>
          </h1>

          <p className="text-2xl md:text-3xl font-poppins text-[#4A5568] max-w-4xl mb-6 leading-relaxed">
            A premium boutique Work-Life Balance installation for women entrepreneurs who left high-stress careers — and accidentally recreated burnout in their business.
          </p>
         
          <p className="text-xl md:text-2xl font-poppins text-[#7FB069] italic max-w-3xl mb-12">
            Inside the Harmony Lane™, work is intentionally contained so life can expand.
          </p>
          

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <Link href="#sunday-shift">
              <Button 
                size="lg" 
                className="bg-[#E26C73] hover:bg-[#D15A61] text-white px-10 py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Start With Make The Sunday Shift™
              </Button>
            </Link>
            <Link href="#experience">
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-10 py-7 text-xl font-poppins font-semibold rounded-full transition-all"
              >
                Explore The Experience
              </Button>
            </Link>
          </div>
        </div>

        {/* Countdown Timer with Cherry Blossom Image */}
        <div className="w-full max-w-5xl mx-auto">
          <CountdownTimer />
        </div>
      </div>
    </section>
  )
}
