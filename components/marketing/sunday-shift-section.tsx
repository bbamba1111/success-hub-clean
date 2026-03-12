import { ClipboardCheck, Target, Calendar } from "lucide-react"
import { SundayShiftForm } from "./sunday-shift-form"

export function SundayShiftSection() {
  return (
    <section id="sunday-shift" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest text-[#7FB069] uppercase mb-4">
            Your First Step
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2F4F4F] mb-4">
            Make The Sunday Shift<sup className="text-xl">™</sup>
          </h2>
          <p className="text-xl text-[#E26C73] font-medium mb-4">
            Your first step to safely merge into Harmony.
          </p>
          <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
            A free weekly reset where women entrepreneurs design the week before it begins.
          </p>
        </div>

        {/* Image placeholder */}
        <div 
          className="w-full h-64 rounded-2xl bg-gradient-to-r from-[#F8C8C8]/30 to-[#7FB069]/20 mb-16 relative"
          style={{
            backgroundImage: "url('/images/sunday-shift-placeholder.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <p className="text-sm text-[#6B7280] mb-2">Image Placeholder</p>
              <p className="text-[#2F4F4F] font-medium">/images/sunday-shift-placeholder.jpg</p>
            </div>
          </div>
        </div>

        {/* Three Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-8 shadow-lg border border-[#F8C8C8]/20 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#E26C73]/10 rounded-xl flex items-center justify-center mb-6">
              <ClipboardCheck className="w-7 h-7 text-[#E26C73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-3">
              Take The Work-Life Balance Audit
            </h3>
            <p className="text-[#4A5568] leading-relaxed">
              Assess where you are now. Identify the imbalances keeping you stuck in hustle mode.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-8 shadow-lg border border-[#F8C8C8]/20 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#7FB069]/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-[#7FB069]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-3">
              Set Your Intention
            </h3>
            <p className="text-[#4A5568] leading-relaxed">
              Choose your 1-3 non-negotiable priorities. Clarify what matters most this week.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-white rounded-2xl p-8 shadow-lg border border-[#F8C8C8]/20 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-[#E26C73]/10 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-7 h-7 text-[#E26C73]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F4F4F] mb-3">
              Prepare For The Week Ahead
            </h3>
            <p className="text-[#4A5568] leading-relaxed">
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

