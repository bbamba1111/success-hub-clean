"use client" 

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export function MondayPreviewSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#2F4F4F] to-[#1a3535] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-lg font-semibold tracking-widest text-[#F8C8C8] uppercase mb-4">
            After The Sunday Shift
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-8">
            Make Time For More On Mondays<sup className="text-2xl">™</sup>
          </h2>
          <p className="font-poppins text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            A boutique Monday-only installation where work is intentionally contained inside a focused rhythm so life can expand.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Co-working Image */}
          <div className="w-full rounded-4xl overflow-hidden shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1anon-f6DnKVdDqrWZd278GJHmxEwZjGq8j6.png"
              alt="Diverse women entrepreneurs co-working - The New 9-to-5 Non-Negotiable Co-Working"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-8">
            <h3 className="font-playfair text-3xl md:text-4xl font-bold">
              Together We Co-Work Our Non-Negotiables<sup className="text-xl">™</sup>
            </h3>
            <p className="font-poppins text-xl text-white/80 leading-relaxed">
              Exclusively for women who resonate and are ready to harmonize work and life.
            </p>

            {/* Highlight */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#7FB069]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-10 h-10 text-[#7FB069]" />
                </div>
                <div>
                  <p className="font-playfair text-4xl font-bold text-[#7FB069]">20 Hours</p>
                  <p className="font-poppins text-lg text-white/70">of Time Freedom Every Monday</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 font-poppins text-xl text-white/80">
              <p>This is not a course.</p>
              <p>Not traditional coworking.</p>
              <p>Not another productivity hack.</p>
              <p className="text-[#E26C73] font-semibold pt-2 text-2xl">
                It is a live guided installation experience.
              </p>
            </div>

            <Link href="/mondays">
              <Button 
                size="lg"
                className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-10 py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Preview Mondays
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
