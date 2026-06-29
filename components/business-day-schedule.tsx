"use client"

import { BusinessDayBlock } from "@/components/business-day-block"

const EARLY_ACCESS_USES = [
  "Cherry Blossom™",
  "Planning",
  "Journaling",
  "Weekly Intention",
  "Community Chat",
  "Team Meetings",
  "Client Meetings",
  "Leadership Meetings",
  "Sales Calls",
  "Doctor Appointments",
  "Dental Appointments",
  "Therapy",
  "Running Errands",
  "Grocery Shopping",
  "Banking",
  "School Meetings",
  "Family Responsibilities",
  "Unexpected Life Events",
  "Strategic Planning",
  "Email",
  "Quiet Preparation",
]

export function BusinessDaySchedule() {
  return (
    <div className="w-full bg-gradient-to-br from-[#F5F1E8] to-white py-10">
      <div className="mx-auto max-w-7xl">
        {/* 7:00–9:00 AM — Early Access, Flex Time™ & Preparation (with featured Collaboration Window) */}
        <BusinessDayBlock
          sectionId="block-early-access"
          emoji="🌅"
          time="7:00–9:00 AM"
          title="Early Access, Flex Time™ & Preparation"
          buttonText="Enter Early Access™"
          status="upcoming"
          description={
            <>
              <p>
                The Harmony community is open before the official Work-Life Balance Business Day™ begins. This is
                intentionally designed as flexible capacity to prepare for the day, collaborate, manage life, and enter
                the workday with clarity instead of chaos.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {EARLY_ACCESS_USES.map((use) => (
                  <span
                    key={use}
                    className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </>
          }
        >
          {/* Featured sub-card: Intentional Collaboration Window™ (overlaps Early Access) */}
          <div className="mt-6 rounded-2xl border border-[#7FB069]/40 bg-[#7FB069]/25 p-5 backdrop-blur-sm">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#7FB069] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                Featured Window
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/90">8:00–9:00 AM</span>
            </div>
            <h4 className="text-lg font-bold text-white">Intentional Collaboration Window™</h4>
            <p className="mt-1 text-sm leading-relaxed text-white/90">
              A focused hour within Early Access for team meetings, client calls, leadership syncs, and strategic
              collaboration—so deep work stays protected later in the day.
            </p>
          </div>
        </BusinessDayBlock>

        {/* 9:00–10:30 AM — Morning GIV•EN™ Routine */}
        <BusinessDayBlock
          sectionId="block-morning-given"
          emoji="🌸"
          time="9:00–10:30 AM"
          title="Morning GIV•EN™ Routine™"
          buttonText="Join Morning GIV•EN™"
          status="upcoming"
          description={
            <>
              <p>Align your mind, body, spirit, and priorities before beginning your workday.</p>
              <ul className="space-y-1">
                <li>
                  <span className="font-semibold text-white">G</span> — Gratitude
                </li>
                <li>
                  <span className="font-semibold text-white">I</span> — Invitation: invite your Creator into your
                  workday.
                </li>
                <li>
                  <span className="font-semibold text-white">V</span> — Vision
                </li>
                <li>
                  <span className="font-semibold text-white">E</span> — Emotional Embodiment
                </li>
                <li>
                  <span className="font-semibold text-white">N</span> — Nurture Non-Negotiables™
                </li>
              </ul>
            </>
          }
        />

        {/* 10:30–11:00 AM — 30-Minute Workday Movement Window™ */}
        <BusinessDayBlock
          sectionId="block-movement-window"
          emoji="💪"
          time="10:30–11:00 AM"
          title="30-Minute Workday Movement Window™"
          buttonText="Start Movement Window™"
          status="upcoming"
          description={
            <p>
              Increase energy. Improve circulation. Support cognitive performance. Prepare your body for focused work.
            </p>
          }
        />

        {/* 11:00 AM–1:00 PM — Extended Healthy Hybrid Lunch Break™ */}
        <BusinessDayBlock
          sectionId="block-lunch-break"
          emoji="🥗"
          time="11:00 AM–1:00 PM"
          title="Extended Healthy Hybrid Lunch Break™"
          buttonText="Begin Lunch Break™"
          status="upcoming"
          description={
            <>
              <p>
                Nourish your body. Spend time in nature. Connect with family, friends, clients, or colleagues. Restore
                your energy. Begin your workday refreshed, focused, and feeling successful.
              </p>
              <p>
                Members may intentionally use up to 60 minutes of this block for Flex Time™ while preserving a
                meaningful lunch experience.
              </p>
            </>
          }
        />

        {/* 1:00–5:00 PM — 4-Hour Focused CEO Workday™ */}
        <BusinessDayBlock
          sectionId="block-ceo-workday"
          emoji="💼"
          time="1:00–5:00 PM"
          title="4-Hour Focused CEO Workday™"
          buttonText="Enter CEO Workday™"
          status="upcoming"
          description={
            <>
              <p>Your protected execution period.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["AI Augmentation™", "Deep Work™", "Strategic Thinking™", "Decision Making™", "Implementation™", "Delivery™"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </>
          }
        />

        {/* 5:00–10:00 PM — Time Freedom™ */}
        <BusinessDayBlock
          sectionId="block-time-freedom"
          emoji="🌸"
          time="5:00–10:00 PM"
          title="Time Freedom™"
          buttonText="Enjoy Time Freedom™"
          status="upcoming"
          description={
            <p>
              Enjoy the life you built your business to support. Spend intentional time with family, health,
              relationships, recreation, creativity, faith, hobbies, and personal growth.
            </p>
          }
        />

        {/* 10:00–11:00 PM — Power Down™ */}
        <BusinessDayBlock
          sectionId="block-power-down"
          emoji="🌙"
          time="10:00–11:00 PM"
          title="Power Down™"
          buttonText="Join Power Down™"
          status="upcoming"
          description={
            <>
              <p>Transition intentionally from productivity to restoration.</p>
              <p>Reflect. Prepare tomorrow. Slow your mind. Reduce stimulation.</p>
            </>
          }
        />

        {/* 11:00 PM–7:00 AM — Unplug Digital Detox™ */}
        <BusinessDayBlock
          sectionId="block-digital-detox"
          emoji="🌙"
          time="11:00 PM–7:00 AM"
          title="Unplug Digital Detox™"
          buttonText="Community Closed"
          status="upcoming"
          description={
            <>
              <p>Devices off. Community closes. Prioritize restorative sleep.</p>
              <p>Tomorrow&apos;s success begins tonight.</p>
            </>
          }
        />
      </div>
    </div>
  )
}
