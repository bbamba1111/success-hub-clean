import { ArrowRight } from "lucide-react"

export function HarmonyLaneSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#FDF8F5] via-[#FEF7F5] to-[#F5FAF5]">
      <div className="max-w-7xl mx-auto px-6">
        {/* New Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-6xl font-montserrat font-bold text-[#2F4F4F] mb-8 tracking-tight text-balance">
            Inside The Harmony Lane<sup className="text-2xl">™</sup>, work is intentionally contained so life can expand
          </h2>
          <p className="text-xl md:text-2xl font-montserrat text-[#4A5568] max-w-4xl mx-auto leading-relaxed">
            Harmony is the counterpart to hustle. It is the lane women entrepreneurs merge into when they need to recover, restore, realign, and sustain success.
          </p>
        </div>

        {/* 3 Images Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Image 1 - Women with Children Picnic */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2020%2C%202026%2C%2002_25_32%20AM-V8DJdzqsH1OgGwEdNX9b1rAik1pJNM.png"
              alt="Mother enjoying quality time with children at cherry blossom picnic - Make Time For More Harmony"
              className="w-full h-80 object-cover"
            />
          </div>
          
          {/* Image 2 - Dinner Date */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Feb%2028%2C%202026%2C%2011_07_56%20PM-Nz2F5DwFg32nSCzQXiBc2mBRTLQn3C.png"
              alt="Couple enjoying romantic dinner with cherry blossom decor - Make Time For More Harmony"
              className="w-full h-80 object-cover"
            />
          </div>
          
          {/* Image 3 - 3 Women Traveling */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2027%2C%202025%2C%2011_49_27%20AM-TRAiXpwlHcY1M8VKFGpyaZgVIc6GS7.png"
              alt="Three diverse women friends traveling together in Japan with cherry blossoms - Make Time For More Harmony"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Lane Steps */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Step 1 - Hustle Lane */}
          <div className="bg-gradient-to-br from-[#FEE2E2] to-[#FFF5F5] rounded-2xl p-10 text-center border border-[#E26C73]/20 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-[#E26C73]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-montserrat font-thin text-[#E26C73]">1</span>
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-[#2F4F4F] mb-4">Hustle Lane</h3>
              <p className="text-xl font-poppins text-[#4A5568] leading-relaxed">Where most entrepreneurs start — grinding, pushing, over-efforting</p>
            </div>
          </div>

          {/* Step 2 - Merge */}
          <div className="bg-gradient-to-br from-[#FEE2E2]/50 via-[#FFF5F5] to-[#ECFDF5]/50 rounded-2xl p-10 text-center border border-[#F8C8C8]/30 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#E26C73]/20 to-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-montserrat font-bold text-[#2F4F4F]">2</span>
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-[#2F4F4F] mb-4">Merge Into Harmony</h3>
              <p className="text-xl font-montserrat text-[#4A5568] leading-relaxed">The transition point where you choose a sustainable rhythm</p>
            </div>
            <div className="flex justify-center mt-4">
              <ArrowRight className="w-8 h-8 text-[#7FB069]" />
            </div>
          </div>

          {/* Step 3 - Cherry Blossom Garden */}
          <div className="bg-gradient-to-br from-[#ECFDF5] to-[#F0FDF4] rounded-2xl p-10 text-center border border-[#7FB069]/20 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-montserrat font-bold text-[#7FB069]">3</span>
              </div>
              <h3 className="text-2xl font-montserrat font-bold text-[#2F4F4F] mb-4">The Cherry Blossom Garden</h3>
              <p className="text-xl font-montserrat text-[#4A5568] leading-relaxed">Where work-life balance becomes your sustainable operating system</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
