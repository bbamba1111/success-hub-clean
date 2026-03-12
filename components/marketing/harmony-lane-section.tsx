import { ArrowRight } from "lucide-react"

export function HarmonyLaneSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#FDF8F5] via-[#FEF7F5] to-[#F5FAF5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-lg font-poppins font-medium tracking-widest text-[#E26C73] uppercase mb-6">
            A New Lane Awaits
          </p>
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-[#2F4F4F] mb-8 tracking-tight text-balance">
            Merge Into Harmony — The Parallel Lane to Hustle Entrepreneurship
          </h2>
          <p className="text-xl md:text-2xl font-poppins text-[#4A5568] max-w-4xl mx-auto leading-relaxed">
            Harmony is the counterpart to hustle. It is the lane women entrepreneurs merge into when they need to recover, restore, realign, and sustain success.
          </p>
        </div>

        {/* Visual Journey Image */}
        <div className="relative mb-16">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1Lo-69OI13Z8ayTZmvn4Zy98USTNf31fGS.png"
              alt="Woman transitioning from corporate hustle to cherry blossom harmony"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Lane Steps */}
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Step 1 - Hustle Lane */}
          <div className="bg-gradient-to-br from-[#FEE2E2] to-[#FFF5F5] rounded-2xl p-10 text-center border border-[#E26C73]/20 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-[#E26C73]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-playfair font-bold text-[#E26C73]">1</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-[#2F4F4F] mb-4">Hustle Lane</h3>
              <p className="text-xl font-poppins text-[#4A5568] leading-relaxed">Where most entrepreneurs start — grinding, pushing, over-efforting</p>
            </div>
          </div>

          {/* Step 2 - Merge */}
          <div className="bg-gradient-to-br from-[#FEE2E2]/50 via-[#FFF5F5] to-[#ECFDF5]/50 rounded-2xl p-10 text-center border border-[#F8C8C8]/30 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#E26C73]/20 to-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-playfair font-bold text-[#2F4F4F]">2</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-[#2F4F4F] mb-4">Merge Into Harmony</h3>
              <p className="text-xl font-poppins text-[#4A5568] leading-relaxed">The transition point where you choose a sustainable rhythm</p>
            </div>
            <div className="flex justify-center mt-4">
              <ArrowRight className="w-8 h-8 text-[#7FB069]" />
            </div>
          </div>

          {/* Step 3 - Cherry Blossom Garden */}
          <div className="bg-gradient-to-br from-[#ECFDF5] to-[#F0FDF4] rounded-2xl p-10 text-center border border-[#7FB069]/20 shadow-lg min-h-[320px] flex flex-col justify-between">
            <div>
              <div className="w-20 h-20 bg-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-playfair font-bold text-[#7FB069]">3</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-[#2F4F4F] mb-4">The Cherry Blossom Garden</h3>
              <p className="text-xl font-poppins text-[#4A5568] leading-relaxed">Where work-life balance becomes your sustainable operating system</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
