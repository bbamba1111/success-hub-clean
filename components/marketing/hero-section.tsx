"use client"

import { Button } from "@/components/ui/button"
import { CountdownTimer } from "./countdown-timer"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-[#F7E9D6] overflow-hidden">
      {/* Transparent Background Image Overlay - Full Width */}
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2027%2C%202025%2C%2001_52_43%20AM-YXHlRDw4ynWk2MHKKfV1Flm3qZbI1k.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      
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

          <p className="text-2xl md:text-3xl font-poppins text-[#4A5568] max-w-4xl mb-12 leading-relaxed">
            A premium boutique Work-Life Balance installation for women entrepreneurs who left high-stress careers — and accidentally recreated burnout in their business.
          </p>

          {/* Countdown Timer */}
          <div className="w-full max-w-5xl mx-auto mb-12">
            <CountdownTimer />
          </div>

          {/* CTAs - Now below countdown */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href="#sunday-shift">
              <Button 
                size="lg" 
                className="bg-[#E26C73] hover:bg-[#D15A61] text-white px-10 py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Make The Sunday Shift™
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
      </div>
    </section>
  )
}
