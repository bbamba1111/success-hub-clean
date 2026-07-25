/**
 * segment-about.tsx
 *
 * Rich "About This Segment" content for every block in the Work-Life Balance
 * Business Day™. Keyed by block id (matches SCHEDULE[*].id).
 *
 * Used by BusinessDayBlock to populate the "About This Segment" accordion.
 */

import type { ReactNode } from "react"

type Section = { heading: string; body: ReactNode }

export type SegmentAbout = {
  sections: Section[]
}

/* ── shared sub-components ──────────────────────────────────────────────── */

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-[#5C4F55]">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C13B6B]/50" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-[#C13B6B]/20 bg-[#C13B6B]/5 px-4 py-3">
      <p className="mb-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
        Cherry Blossom™ Tip
      </p>
      <p className="text-sm leading-relaxed text-[#5C4F55]">{children}</p>
    </div>
  )
}

/* ── segment content ────────────────────────────────────────────────────── */

export const SEGMENT_ABOUT: Record<string, SegmentAbout> = {

  "early-access": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Early Access™ is the quiet hour before the world starts making demands. From 7:00 AM to 9:00 AM
            you have protected space to prepare, manage personal logistics, collaborate with early risers, and
            arrive at your official workday with clarity instead of chaos. It is the difference between
            leading your day and being managed by it.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Founders who begin the day reactively — phone in hand, inbox first — report higher cortisol,
            reduced decision quality, and diminished creativity throughout the morning. Early Access™ creates
            the conditions for intentional leadership before the operating day begins.
          </p>
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Use this window for life logistics — appointments, family communication, personal tasks.",
              "Prepare your CEO Workday™ priorities so you enter 1:00 PM focused and ready.",
              "Avoid reactive email and social media scrolling during this window.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Early Access™ is not extra work time. It is preparation time. The founder who arrives at the CEO
            Workday™ prepared accomplishes more in four hours than most do in eight.
          </Tip>
        ),
      },
    ],
  },

  "morning-given": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The Morning GIV•EN™ Routine™ is a structured morning practice — Gratitude, Invitation, Vision,
            Emotional Embodiment, and Nurture Non-Negotiables™. It aligns your mind, body, and spirit before
            work begins, ensuring you lead from intention rather than urgency. This is a core Sustainable
            Operating Practice™.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Research consistently demonstrates that a structured morning routine reduces perceived stress,
            improves emotional regulation, and increases productivity throughout the day. Founders who skip
            their morning practice report more reactive decision-making and lower end-of-day satisfaction.
          </p>
        ),
      },
      {
        heading: "The GIV•EN™ Practice",
        body: (
          <Bullets
            items={[
              "Gratitude — acknowledge three specific things you are grateful for this morning.",
              "Invitation — set an intention or theme for your day.",
              "Vision — spend time with your long-term vision to keep daily decisions aligned.",
              "Emotional Embodiment — connect with how you want to feel today, not just what you want to do.",
              "Nurture Non-Negotiables™ — honor the personal commitments that protect your wellbeing.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The quality of your GIV•EN™ Routine™ directly predicts the quality of your CEO Workday™. Invest
            90 minutes in yourself and get four focused hours in return.
          </Tip>
        ),
      },
    ],
  },

  "movement-window": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The 30-Minute Workday Movement Window™ is a protected daily practice of physical activity built
            directly into your operating schedule. From 10:30 to 11:00 AM, you move your body with intention
            — strengthening the physical foundation that high performance requires.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Exercise during the workday increases blood flow to the prefrontal cortex, directly improving
            cognitive function, creativity, and decision quality for the hours that follow. Founders who
            honour this window consistently report higher afternoon focus and lower mid-day energy crashes.
          </p>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Research by John Ratey (Spark) demonstrates that aerobic exercise increases BDNF — Brain-Derived
            Neurotrophic Factor — which acts as fertiliser for brain cells and significantly enhances
            learning, focus, and mood. Thirty minutes is the minimum effective dose.
          </p>
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Any form of movement counts — walk, lift, yoga, dance, stretch.",
              "Pair movement with Barbara's Recommended Playlist™ for an energizing flow.",
              "Treat this window with the same non-negotiable status as a client meeting.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            You will never regret honouring the Movement Window™. You will often regret skipping it when the
            3:00 PM energy dip arrives.
          </Tip>
        ),
      },
    ],
  },

  "lunch-break": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The Extended Healthy Hybrid Lunch Break™ is a two-hour protected restoration window from 11:00 AM
            to 1:00 PM. It is designed for nourishment, connection, nature, and the kind of mental space that
            allows your best ideas to surface. This is not a working lunch. This is a recovery investment.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Founders who eat at their desks, skip lunch, or use this window for additional screen time enter
            the CEO Workday™ depleted. Research on ultradian rhythms shows the brain requires a genuine
            recovery period of 90–120 minutes after the morning work cycle to perform optimally in the
            afternoon. The Lunch Break™ is that recovery period.
          </p>
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Eat a whole, nourishing meal — not at your desk.",
              "Spend at least part of this window outdoors or away from screens.",
              "Connect with someone you enjoy — family, friends, community.",
              "Allow yourself to be unproductive. That is the practice.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The founder who arrives at the 1:00 PM CEO Workday™ genuinely rested, fed, and connected
            outperforms the one who pushed through every time.
          </Tip>
        ),
      },
    ],
  },

  "ceo-workday": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The 4-Hour Focused CEO Workday™ is your protected daily execution window from 1:00 PM to 5:00 PM.
            This is where you bring your full cognitive capacity to your highest-leverage work — AI
            Augmentation™, Deep Work™, strategic thinking, decisions, and creation of lasting Business
            Assets™.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Cal Newport's research on deep work demonstrates that four hours of uninterrupted, focused
            work produces more valuable output than eight hours of fragmented, distraction-interrupted work.
            The CEO Workday™ applies this principle systematically, giving you back time while increasing
            the quality and leverage of everything you produce.
          </p>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Filling the CEO Workday™ with meetings that could be async.",
              "Doing tasks that belong to delegation, automation, or elimination.",
              "Allowing interruptions that break the deep work state.",
              "Entering the window without a clear Executive Outcome™ defined.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Define your single most important Executive Outcome™ before 1:00 PM.",
              "Close every non-essential tab, notification, and app.",
              "Use AI Augmentation™ to multiply output — never to replace thinking.",
              "Protect this window the way a surgeon protects an operating window.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Four focused hours, protected and intentional, will outperform twelve fragmented hours every
            single time. The CEO Workday™ is not a constraint — it is the system that makes Time Freedom™
            possible.
          </Tip>
        ),
      },
    ],
  },

  "time-freedom": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Time Freedom™ is the protected life your business exists to support. From 5:00 PM to 10:00 PM,
            you are fully present — in your relationships, your passions, your rest, and your joy. This is a
            core Sustainable Operating Practice™. The business does not follow you here.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Founders who never fully disconnect report higher burnout, relationship deterioration, declining
            creative capacity, and accelerated entrepreneurial isolation. Time Freedom™ is not a privilege
            earned by finishing work — it is a non-negotiable component of sustainable high performance.
          </p>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Research in recovery psychology (Sonnentag & Fritz) demonstrates that psychological detachment
            from work during off-hours is the strongest predictor of next-day job performance, engagement,
            and creativity.
          </p>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Time Freedom™ is the entire purpose of the Work-Life Balance Business Week™. Every CEO
            Workday™, every Operating Rule™, every AI leverage and delegation decision is in service of
            expanding and protecting this segment.
          </p>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Checking email or Slack during Time Freedom™.",
              "Taking \"just one more call\" that erodes the boundary.",
              "Treating Time Freedom™ as optional when the business is demanding.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Define what Time Freedom™ looks like for you specifically.",
              "Protect this window with the same discipline you apply to your CEO Workday™.",
              "Let the people you love know this time belongs to them.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The founder who can walk away from their business at 5:00 PM with a clear conscience has built
            something extraordinary. That clarity comes from completing meaningful work during the CEO
            Workday™ — not from working longer hours.
          </Tip>
        ),
      },
    ],
  },

  "power-down": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Power Down™ is a structured 60-minute transition from productivity to restoration. From 10:00 PM
            to 11:00 PM, you complete the day with intention — reflecting on what was accomplished, preparing
            tomorrow, slowing your nervous system, and reducing stimulation so your body can enter genuine
            restorative rest.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The quality of your sleep determines the quality of your next day's leadership. Founders who
            engage screens, work email, or high-stimulation content immediately before sleep report
            significantly poorer sleep quality, lower morning energy, and higher rates of decision fatigue.
            Power Down™ creates the conditions for truly restorative rest.
          </p>
        ),
      },
      {
        heading: "The Power Down™ Practice",
        body: (
          <Bullets
            items={[
              "Review what you accomplished today — acknowledge your effort and results.",
              "Write your top three priorities for tomorrow so your mind can release them.",
              "Dim lights and move away from blue-light screens.",
              "Choose a calming ritual — reading, journaling, stretching, or quiet conversation.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Tomorrow's clarity begins tonight. The founder who sleeps well thinks better, decides faster,
            and leads with more presence than the one who stayed up grinding.
          </Tip>
        ),
      },
    ],
  },

  "digital-detox": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            The Unplug Digital Detox™ runs from 11:00 PM to 7:00 AM. Devices are off. The community is
            closed. This window belongs entirely to restorative sleep — the single most evidence-backed
            performance enhancement available to any founder.
          </p>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Sleep is not downtime — it is the period during which memory consolidates, decisions process,
            creative connections form, and the body repairs. Founders who protect eight hours of sleep
            consistently outperform those who treat sleep as negotiable on every measurable dimension of
            executive performance.
          </p>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <p className="text-sm leading-relaxed text-[#5C4F55]">
            Matthew Walker's research (Why We Sleep) demonstrates that just one night of reduced sleep
            impairs prefrontal cortex function equivalently to being legally drunk. Chronic sleep
            restriction compounds this effect silently, without the founder ever feeling "tired enough"
            to notice.
          </p>
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            You cannot outwork sleep deprivation. Protect this window as fiercely as you protect your CEO
            Workday™ — the returns are just as real.
          </Tip>
        ),
      },
    ],
  },
}

/** Render a SegmentAbout as a flat list of heading + body pairs. */
export function renderSegmentAbout(about: SegmentAbout): ReactNode {
  return (
    <>
      {about.sections.map((section, i) => (
        <div key={i}>
          {section.heading && (
            <p className="mb-1.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5860]/70">
              {section.heading}
            </p>
          )}
          {section.body}
        </div>
      ))}
    </>
  )
}
