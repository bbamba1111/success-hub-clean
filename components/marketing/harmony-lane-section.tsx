import { ArrowRight } from "lucide-react"

export function HarmonyLaneSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FAF7F2] to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase mb-4">
            A New Lane Awaits
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2F4F4F] mb-6 text-balance">
            Merge Into Harmony — The Parallel Lane to Hustle Entrepreneurship
          </h2>
          <p className="text-xl text-[#4A5568] max-w-3xl mx-auto leading-relaxed">
            Harmony is the counterpart to hustle. It is the lane women entrepreneurs merge into when they need to recover, restore, realign, and sustain success.
          </p>
        </div>

        {/* Visual Journey */}
        <div className="relative">
          {/* Image placeholder */}
          <div 
            className="w-full h-64 md:h-96 rounded-2xl bg-gradient-to-r from-[#E26C73]/20 via-[#F8C8C8]/30 to-[#7FB069]/20 mb-12"
            style={{
              backgroundImage: "url('/images/harmony-lane-placeholder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Placeholder overlay with lane visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-sm text-[#6B7280] mb-2">Image Placeholder</p>
                <p className="text-[#2F4F4F] font-medium">/images/harmony-lane-placeholder.jpg</p>
              </div>
            </div>
          </div>

          {/* Lane Steps */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 - Hustle Lane */}
            <div className="bg-[#E26C73]/10 rounded-2xl p-8 text-center border border-[#E26C73]/20">
              <div className="w-16 h-16 bg-[#E26C73]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#E26C73]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-2">Hustle Lane</h3>
              <p className="text-[#4A5568]">Where most entrepreneurs start — grinding, pushing, over-efforting</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#E26C73] to-[#7FB069]" />
                <ArrowRight className="w-6 h-6 text-[#7FB069]" />
              </div>
            </div>
            <div className="md:hidden flex justify-center py-2">
              <ArrowRight className="w-6 h-6 text-[#7FB069] rotate-90" />
            </div>

            {/* Step 2 - Merge */}
            <div className="bg-gradient-to-br from-[#E26C73]/10 to-[#7FB069]/10 rounded-2xl p-8 text-center border border-[#F8C8C8]/30">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E26C73]/20 to-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#2F4F4F]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-2">Merge Into Harmony</h3>
              <p className="text-[#4A5568]">The transition point where you choose a sustainable rhythm</p>
            </div>

            {/* Arrow for mobile */}
            <div className="md:hidden flex justify-center py-2">
              <ArrowRight className="w-6 h-6 text-[#7FB069] rotate-90" />
            </div>

            {/* Step 3 - Cherry Blossom Garden */}
            <div className="bg-[#7FB069]/10 rounded-2xl p-8 text-center border border-[#7FB069]/20 md:col-start-3">
              <div className="w-16 h-16 bg-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#7FB069]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#2F4F4F] mb-2">The Cherry Blossom Garden</h3>
              <p className="text-[#4A5568]">Where work-life balance becomes your sustainable operating system</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

