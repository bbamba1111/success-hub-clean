import { Button } from "@/components/ui/button"

export function OfferCardsSection() {
  return (
    <section id="experience" className="py-24 bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase mb-4">
            Choose Your Rhythm
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2F4F4F] mb-4 text-balance">
            Choose the Level of Support and Frequency That Fits the Season You're In
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 1-Day Pass */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#F8C8C8]/20 hover:shadow-xl transition-all group">
            <div className="h-3 bg-[#F8C8C8]" />
            <div className="p-8">
              <p className="text-sm font-medium text-[#E26C73] uppercase tracking-wide mb-2">
                Starter
              </p>
              <h3 className="text-2xl font-bold text-[#2F4F4F] mb-2">1-Day Pass</h3>
              <p className="text-[#6B7280] mb-6">24-hour access</p>
              
              <div className="space-y-3 mb-8">
                <p className="text-[#4A5568]">Perfect for experiencing the rhythm before committing.</p>
                <ul className="space-y-2 text-sm text-[#4A5568]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Full day access to the rhythm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Live guided installation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Cherry Blossom Garden access</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#F8C8C8] hover:bg-[#E26C73] text-[#2F4F4F] hover:text-white font-semibold py-6 rounded-full transition-all"
              >
                Choose 1-Day Pass
              </Button>
            </div>
          </div>

          {/* 1-Week Model */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl border-2 border-[#7FB069] hover:shadow-2xl transition-all group relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#7FB069] text-white text-xs font-bold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <div className="h-3 bg-[#7FB069]" />
            <div className="p-8">
              <p className="text-sm font-medium text-[#7FB069] uppercase tracking-wide mb-2">
                Immersion
              </p>
              <h3 className="text-2xl font-bold text-[#2F4F4F] mb-2">1-Week Model</h3>
              <p className="text-[#6B7280] mb-6">7-day access</p>
              
              <div className="space-y-3 mb-8">
                <p className="text-[#4A5568]">Experience a full week of work-life balance rhythm.</p>
                <ul className="space-y-2 text-sm text-[#4A5568]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Monday-Thursday installations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Full SOP access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Community support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Integration guidance</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#7FB069] hover:bg-[#6FA055] text-white font-semibold py-6 rounded-full transition-all"
              >
                Choose 1-Week Model
              </Button>
            </div>
          </div>

          {/* 1-Month Model */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#F8C8C8]/20 hover:shadow-xl transition-all group">
            <div className="h-3 bg-[#E26C73]" />
            <div className="p-8">
              <p className="text-sm font-medium text-[#E26C73] uppercase tracking-wide mb-2">
                Transformation
              </p>
              <h3 className="text-2xl font-bold text-[#2F4F4F] mb-2">1-Month Model</h3>
              <p className="text-[#6B7280] mb-6">30-day access</p>
              
              <div className="space-y-3 mb-8">
                <p className="text-[#4A5568]">Full installation to rewire your operating rhythm.</p>
                <ul className="space-y-2 text-sm text-[#4A5568]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Complete 28-day cycle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Habit building support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Integration weeks included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#7FB069]">•</span>
                    <span>Personalized guidance</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="w-full bg-[#E26C73] hover:bg-[#D15A61] text-white font-semibold py-6 rounded-full transition-all"
              >
                Choose 1-Month Model
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-[#6B7280] mt-8 text-sm italic">
          Pricing details shared upon entry to the Garden
        </p>
      </div>
    </section>
  )
}
