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

        {/* Three Step Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Card 1 - Take The Work-Life Balance Audit (Soft Green) */}
          <div className="bg-[#8FBC8F]/90 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-[#5A7A5A] text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 1
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold mb-4">
              Take The Work-Life Balance Audit
            </h3>
            
            <p className="font-poppins text-lg text-white/90 mb-6 leading-relaxed">
              Discover exactly where you stand across 15 key life areas with our comprehensive assessment. Get personalized insights and identify your biggest opportunities for growth.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>15-question comprehensive assessment</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Instant personalized results</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>AI-powered insights from Cherry Blossom</span>
              </li>
            </ul>
            
            <button className="w-full bg-white/20 hover:bg-white/30 border-2 border-white text-white font-poppins font-semibold py-4 px-6 rounded-xl transition-all text-lg">
              Take The Work-Life Balance Audit
            </button>
          </div>

          {/* Card 2 - Set Your Intention (Soft Coral/Pink) */}
          <div className="bg-[#E8A0A0]/90 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-[#C07070] text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 2
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold mb-4">
              Set Your Desired Work-LifeStyle Intention
            </h3>
            
            <p className="font-poppins text-lg text-white/90 mb-6 leading-relaxed">
              Transform your audit insights into powerful, actionable intentions. Choose 1-3 focus areas and let Cherry Blossom guide you through creating your personalized 7-day transformation plan.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Select 1-3 focus areas for maximum impact</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>AI-guided intention crafting with Cherry Blossom</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Personalized daily practices & action plan</span>
              </li>
            </ul>
            
            <button className="w-full bg-white/20 hover:bg-white/30 border-2 border-white text-white font-poppins font-semibold py-4 px-6 rounded-xl transition-all text-lg mb-3">
              Choose Your 1-3 Priority Focus Areas
            </button>
            <button className="w-full bg-[#C07070] hover:bg-[#A06060] text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all text-base flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Open The Intention Setting Guide
            </button>
          </div>

          {/* Card 3 - Prepare For Your Experience (Soft Tan/Olive) */}
          <div className="bg-[#C4A77D]/90 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
              </div>
              <span className="bg-[#9A8060] text-white text-sm font-poppins font-medium px-4 py-1 rounded-full">
                Step 3
              </span>
            </div>
            
            <h3 className="font-playfair text-2xl lg:text-3xl font-bold mb-4">
              Prepare For Your Experience: Download Your Preparation Checklist
            </h3>
            
            <p className="font-poppins text-lg text-white/90 mb-6 leading-relaxed">
              Get ready for your transformation with our comprehensive preparation checklist. Complete these steps to create the optimal environment for your work-life balance journey.
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Clear your physical space</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Block off your calendar</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Notify your family & team</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Delegate or delay tasks</span>
              </li>
              <li className="flex items-start gap-3 font-poppins text-base">
                <svg className="w-5 h-5 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Prepare your spirit</span>
              </li>
            </ul>
            
            <button className="w-full bg-white/30 hover:bg-white/40 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all text-base flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Open The Preparation Checklist
            </button>
          </div>
        </div>

        {/* Email Capture Form */}
        <SundayShiftForm />
      </div>
    </section>
  )
}
