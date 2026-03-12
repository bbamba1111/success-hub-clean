"use client"

import { ClipboardCheck, Target, Calendar } from "lucide-react"
import { SundayShiftForm } from "./sunday-shift-form"

export function SundayShiftSection() {
  return (
    <section id="sunday-shift" className="py-28 bg-gradient-to-br from-[#FDF8F5] via-white to-[#F0F7F4]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-lg font-semibold tracking-widest text-[#7FB069] uppercase mb-4">
            Your First Step
          </p>
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-[#2F4F4F] mb-6">
            Make The Sunday Shift<sup className="text-2xl">™</sup>
          </h2>
          <p className="font-poppins text-2xl text-[#E26C73] font-medium mb-4">
            Your first step to safely merge into Harmony.
          </p>
          <p className="font-poppins text-xl text-[#4A5568] max-w-2xl mx-auto leading-relaxed">
            A free weekly reset where women entrepreneurs design the week before it begins.
          </p>
        </div>

        {/* Women in Cherry Blossom Garden Image */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl mb-16">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2027%2C%202025%2C%2001_52_43%20AM-YXHlRDw4ynWk2MHKKfV1Flm3qZbI1k.png"
            alt="Diverse women laughing together with tea under cherry blossoms"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Three Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-10 shadow-xl border border-[#F8C8C8]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#E26C73]/10 rounded-xl flex items-center justify-center mb-6">
              <ClipboardCheck className="w-8 h-8 text-[#E26C73]" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-[#2F4F4F] mb-4">
              Take The Work-Life Balance Audit
            </h3>
            <p className="font-poppins text-lg text-[#4A5568] leading-relaxed">
              Assess where you are now. Identify the imbalances keeping you stuck in hustle mode.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-10 shadow-xl border border-[#F8C8C8]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#7FB069]/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-[#7FB069]" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-[#2F4F4F] mb-4">
              Set Your Intention
            </h3>
            <p className="font-poppins text-lg text-[#4A5568] leading-relaxed">
              Choose your 1-3 non-negotiable priorities. Clarify what matters most this week.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-10 shadow-xl border border-[#F8C8C8]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-[#E26C73]/10 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-[#E26C73]" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-[#2F4F4F] mb-4">
              Prepare For The Week Ahead
            </h3>
            <p className="font-poppins text-lg text-[#4A5568] leading-relaxed">
              Enter Monday with clarity, calm, and a sustainable rhythm already in place.
            </p>
          </div>
        </div>

        {/* Email Capture Form */}
        <SundayShiftForm />
      </div>
    </section>
  )
}
