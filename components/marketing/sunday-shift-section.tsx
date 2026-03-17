"use client"

import { SundayShiftForm } from "./sunday-shift-form"

export function SundayShiftSection() {
  return (
    <section id="sunday-shift" className="py-28 bg-gradient-to-br from-[#FDF8F5] via-white to-[#F0F7F4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-poppins text-lg font-semibold tracking-widest text-[#7FB069] uppercase mb-4">
            Your First Step
          </p>
          <h2 className="font-poppins text-4xl md:text-6xl font-bold text-[#2F4F4F] mb-6">
            Make The Sunday Shift<sup className="text-2xl">™</sup>
          </h2>
          <p className="font-poppins text-2xl text-[#E26C73] font-medium mb-4">
            Your first step to safely merge into Harmony.
          </p>
          <p className="font-poppins text-xl text-[#4A5568] max-w-2xl mx-auto leading-relaxed">
            A free weekly reset where women entrepreneurs design the week before it begins.
          </p>
        </div>

        {/* No More Grinding Quote Image */}
        <div className="max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl mb-16">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%2026%2C%202026%2C%2006_51_34%20PM-8N6Xj3b72aWeyWXFbZdj21YBKi2Yij.png"
            alt="No more grinding into the week. You now ease into it harmonized, intentional, and fully aligned. - Make Time For More On Mondays"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Intro Text Above Cards */}
        <div className="text-center mb-12">
          <p className="font-poppins text-xl lg:text-2xl text-[#2F4F4F] max-w-4xl mx-auto leading-relaxed">
            Complete these three steps to assess where you are, set your intention, and prepare to live in The Harmony Lane.
          </p>
        </div>

        {/* Three Step Cards - Compact like Harmony Lane section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 - Take The Work-Life Balance Audit (Green - exact from screenshot) */}
          <div className="bg-[#7FB069] rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-[#5A8A4A] text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 1
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Take The Work-Life Balance Audit
            </h3>
            
            <p className="font-poppins text-xl text-white/95 leading-relaxed">
              Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get personalized insights and identify your biggest opportunities for growth.
            </p>
          </div>

          {/* Card 2 - Set Your Intention (Coral/Pink - exact from screenshot) */}
          <div className="bg-[#E26C73] rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-[#C25A60] text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 2
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Set Your Desired Work-LifeStyle Intention
            </h3>
            
            <p className="font-poppins text-xl text-white/95 leading-relaxed">
              Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let Cherry Blossom guide you through creating your personalized 7-day transformation plan.
            </p>
          </div>

          {/* Card 3 - Prepare For Your Experience (Green to Coral Gradient - exact from screenshot) */}
          <div className="bg-gradient-to-br from-[#7FB069] via-[#A08060] to-[#E26C73] rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-white/30 text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 3
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl font-bold mb-4">
              Prepare For Your Experience: Download Your Preparation Checklist
            </h3>
            
            <p className="font-poppins text-xl text-white/95 leading-relaxed">
              Get ready for your transformation with our comprehensive preparation checklist. Complete these steps to create the optimal environment for your work-life balance journey.
            </p>
          </div>
        </div>

        {/* Email Capture Form */}
        <SundayShiftForm />
      </div>
    </section>
  )
}
