"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const RHYTHM = [
  "Flex Time™",
  "Morning GIV•EN™",
  "Reality Check™",
  "Decide My Priority Focus Areas For The Week™",
  "Movement™",
  "Extended Healthy Hybrid Lunch™",
  "4-Hour Focused CEO Workday™",
  "Time Freedom™",
]

export function MondayPreviewSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#2F4F4F] to-[#1a3535] text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-lg font-semibold tracking-widest text-[#F8C8C8] uppercase mb-4">
            Make Time For More Monday™
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold mb-8">
            Redesign Your Entry Into The Workweek™
          </h2>
          <p className="font-poppins text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Monday is your weekly Measure + Design + Begin™ anchor — the day you take stock, design the week ahead,
            and step into your first (or next) Work-Life Balance Business Day™.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Co-working Image */}
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1anon-f6DnKVdDqrWZd278GJHmxEwZjGq8j6.png"
              alt="Diverse women entrepreneurs co-working - The New 9-to-5 Non-Negotiable Co-Working"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-8">
            <h3 className="font-playfair text-3xl md:text-4xl font-bold">
              Experience Your First Work-Life Balance Business Day™
            </h3>
            <p className="font-poppins text-xl text-white/80 leading-relaxed">
              Monday isn&apos;t the whole product — it&apos;s the anchor. Your Work-Life Balance Business Week™ runs
              Monday through Thursday, with Time Freedom™ built into every Friday and Saturday.
            </p>

            {/* Rhythm preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="font-poppins text-sm font-semibold tracking-widest text-[#7FB069] uppercase mb-4">
                Today&apos;s Rhythm
              </p>
              <ol className="font-poppins text-lg text-white/85 space-y-2">
                {RHYTHM.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-3">
                    <span className="text-[#7FB069] font-semibold w-5 shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4 font-poppins text-xl text-white/80">
              <p>This is not a course.</p>
              <p>Not traditional coworking.</p>
              <p>Not another productivity hack.</p>
              <p className="text-[#E26C73] font-semibold pt-2 text-2xl">
                It is your Work-Life Balance Business Week™, installed.
              </p>
            </div>

            {/* Public marketing teaser — always takes the visitor straight to
                the embedded SamCart checkout on /monday, never into a gated
                app page like Founder Profile™ (that's post-purchase). */}
            <Link href="/monday#monday-checkout">
              <Button
                size="lg"
                className="bg-[#7FB069] hover:bg-[#6FA055] text-white px-10 py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Experience Your First Work-Life Balance Business Day™
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
