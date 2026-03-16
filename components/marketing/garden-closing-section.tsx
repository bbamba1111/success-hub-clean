"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GardenClosingSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#FAF7F2] via-[#FDF8F5] to-[#F8C8C8]/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#F8C8C8]/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7FB069]/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hustle to Harmony Image */}
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1Lo-69OI13Z8ayTZmvn4Zy98USTNf31fGS.png"
              alt="Woman transitioning from corporate hustle to harmony in cherry blossom garden"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <p className="font-poppins text-lg font-semibold tracking-widest text-[#E26C73] uppercase">
              Your Sanctuary Awaits
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2F4F4F] leading-tight">
              Welcome to the Cherry Blossom Garden
            </h2>

            <div className="space-y-5 font-poppins text-xl text-[#4A5568] leading-relaxed">
              <p>
                The Cherry Blossom Garden is our virtual studio where women gather to restore rhythm, reconnect with their original entrepreneurial intentions, and Make Time For More.
              </p>

              <p className="text-[#7FB069] italic text-2xl">
                Cherry blossoms remind us that time is fleeting.
              </p>

              <p>
                Life is transient.
              </p>

              <p className="text-[#E26C73] font-medium text-2xl">
                The moments that matter most are not meant to be postponed.
              </p>
            </div>

            <div className="pt-6">
              <Link href="#sunday-shift">
                <Button 
                  size="lg"
                  className="bg-[#E26C73] hover:bg-[#D15A61] text-white px-12 py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Enter The Cherry Blossom Garden
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
