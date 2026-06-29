"use client"

import { BusinessDayBlock } from "@/components/business-day-block"

export function BusinessDaySchedule() {
  return (
    <div id="todays-business-day" className="w-full scroll-mt-20 bg-gradient-to-br from-[#F5F1E8] to-white py-8">
      <div className="mx-auto max-w-7xl">
        <div className="px-6 pb-2 text-center">
          <h2 className="text-pretty text-2xl font-bold text-[#C13B6B] sm:text-3xl">
            Today&apos;s <span className="text-[#7FB069]">Work-Life Balance Business Day™</span>
          </h2>
          <p className="mt-1 text-sm font-medium text-[#6B5860]">Continue into today&apos;s rhythm.</p>
        </div>

        {/* 7:00–9:00 AM — Early Access, Flex Time™ & Preparation */}
        <BusinessDayBlock
          sectionId="block-early-access"
          emoji="🌅"
          time="7:00–9:00 AM"
          title="Early Access, Flex Time™ & Preparation"
          buttonText="Enter Early Access™"
          status="upcoming"
          description="Open before the official day begins—flexible time to prepare, collaborate, manage life, and enter your workday with clarity instead of chaos."
        />

        {/* 9:00–10:30 AM — Morning GIV•EN™ Routine */}
        <BusinessDayBlock
          sectionId="block-morning-given"
          backgroundImage="/images/block-morning-given.png"
          emoji="🌸"
          time="9:00–10:30 AM"
          title="Morning GIV•EN™ Routine™"
          buttonText="Join Morning GIV•EN™"
          status="upcoming"
          description="Align mind, body, spirit, and priorities before work—Gratitude, Invitation, Vision, Emotional Embodiment, and Nurture Non-Negotiables™."
        />

        {/* 10:30–11:00 AM — 30-Minute Workday Movement Window™ */}
        <BusinessDayBlock
          sectionId="block-movement-window"
          backgroundImage="/images/block-movement-window.png"
          emoji="💪"
          time="10:30–11:00 AM"
          title="30-Minute Workday Movement Window™"
          buttonText="Start Movement Window™"
          status="upcoming"
          description="Increase energy, improve circulation, and support cognitive performance—preparing your body for focused work."
        />

        {/* 11:00 AM–1:00 PM — Extended Healthy Hybrid Lunch Break™ */}
        <BusinessDayBlock
          sectionId="block-lunch-break"
          backgroundImage="/images/block-lunch-break.png"
          emoji="🥗"
          time="11:00 AM–1:00 PM"
          title="Extended Healthy Hybrid Lunch Break™"
          buttonText="Begin Lunch Break™"
          status="upcoming"
          description="Nourish your body, spend time in nature, and connect with the people who matter—restoring your energy for the afternoon."
        />

        {/* 1:00–5:00 PM — 4-Hour Focused CEO Workday™ */}
        <BusinessDayBlock
          sectionId="block-ceo-workday"
          emoji="💼"
          time="1:00–5:00 PM"
          title="4-Hour Focused CEO Workday™"
          buttonText="Enter CEO Workday™"
          status="upcoming"
          description="Your protected execution period for AI Augmentation™, Deep Work™, strategic thinking, decisions, and delivery."
        />

        {/* 5:00–10:00 PM — Time Freedom™ */}
        <BusinessDayBlock
          sectionId="block-time-freedom"
          emoji="🌸"
          time="5:00–10:00 PM"
          title="Time Freedom™"
          buttonText="Enjoy Time Freedom™"
          status="upcoming"
          description="Enjoy the life you built your business to support—family, health, relationships, recreation, creativity, faith, and growth."
        />

        {/* 10:00–11:00 PM — Power Down™ */}
        <BusinessDayBlock
          sectionId="block-power-down"
          emoji="🌙"
          time="10:00–11:00 PM"
          title="Power Down™"
          buttonText="Join Power Down™"
          status="upcoming"
          description="Transition intentionally from productivity to restoration—reflect, prepare tomorrow, slow your mind, and reduce stimulation."
        />

        {/* 11:00 PM–7:00 AM — Unplug Digital Detox™ */}
        <BusinessDayBlock
          sectionId="block-digital-detox"
          emoji="🌙"
          time="11:00 PM–7:00 AM"
          title="Unplug Digital Detox™"
          buttonText="Community Closed"
          status="upcoming"
          description="Devices off. Community closes. Prioritize restorative sleep—tomorrow's success begins tonight."
        />
      </div>
    </div>
  )
}
