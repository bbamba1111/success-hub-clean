"use client"

import { Button } from "@/components/ui/button"

export function OfferCardsSection() {
  return (
    <section id="experience" className="py-28 bg-gradient-to-br from-[#FAF7F2] via-[#FDF8F5] to-[#F0F7F4]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-lg font-semibold tracking-widest text-[#E26C73] uppercase mb-4">
            Choose Your Rhythm
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#2F4F4F] mb-6 text-balance">
            Choose the Level of Support and Frequency That Fits the Season You're In
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 1-Day Pass */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#F8C8C8]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-4 bg-gradient-to-r from-[#F8C8C8] to-[#E26C73]/50" />
            <div className="p-10">
              <p className="font-poppins text-base font-semibold text-[#E26C73] uppercase tracking-wide mb-3">
                Starter
              </p>
              <h3 className="font-playfair text-3xl font-bold text-[#2F4F4F] mb-3">1-Day Pass</h3>
              <p className="font-poppins text-lg text-[#6B7280] mb-8">24-hour access</p>
              
              <div className="space-y-4 mb-10">
                <p className="font-poppins text-lg text-[#4A5568]">Perfect for experiencing the rhythm before committing.</p>
                <ul className="space-y-3 font-poppins text-base text-[#4A5568]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Full day access to the rhythm</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Live guided installation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Cherry Blossom Garden access</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-[#F8C8C8] to-[#E26C73]/70 hover:from-[#E26C73] hover:to-[#E26C73] text-[#2F4F4F] hover:text-white font-poppins font-semibold py-7 text-lg rounded-full transition-all"
              >
                Choose 1-Day Pass
              </Button>
            </div>
          </div>

          {/* 1-Week Model */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#7FB069] hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#7FB069] text-white font-poppins text-sm font-bold px-6 py-2 rounded-full">
              MOST POPULAR
            </div>
            <div className="h-4 bg-gradient-to-r from-[#7FB069] to-[#7FB069]/70" />
            <div className="p-10">
              <p className="font-poppins text-base font-semibold text-[#7FB069] uppercase tracking-wide mb-3">
                Immersion
              </p>
              <h3 className="font-playfair text-3xl font-bold text-[#2F4F4F] mb-3">1-Week Model</h3>
              <p className="font-poppins text-lg text-[#6B7280] mb-8">7-day access</p>
              
              <div className="space-y-4 mb-10">
                <p className="font-poppins text-lg text-[#4A5568]">Experience a full week of work-life balance rhythm.</p>
                <ul className="space-y-3 font-poppins text-base text-[#4A5568]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Monday-Thursday installations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Full SOP access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Integration guidance</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-poppins font-semibold py-7 text-lg rounded-full transition-all"
              >
                Choose 1-Week Model
              </Button>
            </div>
          </div>

          {/* 1-Month Model */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#F8C8C8]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-4 bg-gradient-to-r from-[#E26C73] to-[#E26C73]/70" />
            <div className="p-10">
              <p className="font-poppins text-base font-semibold text-[#E26C73] uppercase tracking-wide mb-3">
                Transformation
              </p>
              <h3 className="font-playfair text-3xl font-bold text-[#2F4F4F] mb-3">1-Month Model</h3>
              <p className="font-poppins text-lg text-[#6B7280] mb-8">30-day access</p>
              
              <div className="space-y-4 mb-10">
                <p className="font-poppins text-lg text-[#4A5568]">Full installation to rewire your operating rhythm.</p>
                <ul className="space-y-3 font-poppins text-base text-[#4A5568]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Complete 28-day cycle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Habit building support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Integration weeks included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#7FB069] text-xl">•</span>
                    <span>Personalized guidance</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#E26C73] hover:bg-[#D15A61] text-white font-poppins font-semibold py-7 text-lg rounded-full transition-all"
              >
                Choose 1-Month Model
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center font-poppins text-lg text-[#6B7280] mt-10 italic">
          Pricing details shared upon entry to the Garden
        </p>
      </div>
    </section>
  )
}
