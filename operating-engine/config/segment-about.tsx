/**
 * segment-about.tsx
 *
 * Rich "About This Segment" content for every block in the Work-Life Balance
 * Business Day™. Keyed by block id (matches SCHEDULE[*].id).
 *
 * Content is verbatim from the Harmony Lane™ operating spec.
 */

import type { ReactNode } from "react"

type Section = { heading: string; body: ReactNode }
export type SegmentAbout = { sections: Section[] }

/* ── shared sub-components ──────────────────────────────────────────────── */

function Para({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-relaxed text-[#5C4F55]">{children}</p>
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#5C4F55]">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C13B6B]/50" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#C13B6B]/20 bg-[#C13B6B]/5 px-4 py-3">
      <p className="mb-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#C13B6B]">
        Cherry Blossom™
      </p>
      <p className="text-sm leading-relaxed text-[#5C4F55]">{children}</p>
    </div>
  )
}

function FlexBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#7FB069]/25 bg-[#7FB069]/8 px-4 py-3">
      <p className="mb-1 font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#5B835F]">
        Flex Time™ Borrowing
      </p>
      <div className="text-sm leading-relaxed text-[#5C4F55]">{children}</div>
    </div>
  )
}

/* ── segment content ────────────────────────────────────────────────────── */

export const SEGMENT_ABOUT: Record<string, SegmentAbout> = {

  /* 1 ─ Early Entry / Flex Time™ ──────────────────────────────────────── */
  "early-access": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Early Entry / Flex Time™ is a deliberately engineered buffer — not wasted time. It is one of The
            New 9-to-5 & Nighttime Non-Negotiable SOPs™ that protects your Daily Non-Negotiables™ and ensures
            life&apos;s unavoidable demands never spill into your CEO Workday™.
          </Para>
        ),
      },
      {
        heading: "How Flex Time™ Works",
        body: (
          <FlexBox>
            <p className="mb-2">
              <strong>Default:</strong> 2 hours available by default (7:00 AM – 9:00 AM).
            </p>
            <p className="mb-2">
              <strong>Borrowing:</strong> When life requires it, you may temporarily expand Flex Time™ by
              borrowing:
            </p>
            <ul className="mb-2 space-y-1 pl-1">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B835F]/50" aria-hidden />
                Morning GIV&bull;EN™ — up to 1 hour
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B835F]/50" aria-hidden />
                Healthy Hybrid Lunch™ — up to 1 hour
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B835F]/50" aria-hidden />
                4 hours maximum when both are borrowed.
              </li>
            </ul>
            <p>
              <strong>Important:</strong> Borrowing is reserved for genuine life demands — not a daily habit.
              Your 4-Hour CEO Workday™ (1:00 PM – 5:00 PM) is never borrowed from and never shortened.
            </p>
          </FlexBox>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Without a protected flexibility window, life events become fires. The CEO Workday™ gets stolen.
            Sustainable Operating Practices™ get sacrificed. Flex Time™ is how high-performing founders stay
            anchored to their operating rhythm even when life is unpredictable.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Research in cognitive load and decision fatigue shows that unplanned interruptions during deep
            work windows reduce overall productivity by up to 40%. The Progress Principle (Amabile & Kramer)
            demonstrates that protecting small daily wins — like keeping the CEO Workday™ intact — compounds
            into significantly higher motivation, creativity, and performance over time. Pre-scheduling a flex
            buffer eliminates reactive decision-making and protects the cognitive resources reserved for flow
            state during the CEO Workday™.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Every hour you protect your CEO Workday™ is an hour available for your highest-leverage business
            work. Flex Time™ is the front-line defense that makes that protection possible. Founders who
            install this buffer report fewer scheduling conflicts, lower stress, and stronger consistency with
            their Sustainable Operating Practices™ — even during the most demanding weeks.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Allowing Flex Time™ to expand beyond 4 hours on a regular basis.",
              "Using borrowed Flex Time™ every day rather than occasionally.",
              "Not having a defined anchor commitment for this window — defaulting to reactive behavior.",
              "Treating personal errands and family responsibilities as interruptions rather than protected commitments.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Install one consistent anchor commitment (e.g. school drop-off, networking breakfast, morning prep).",
              "Treat borrowing as a weekly exception — not a daily routine.",
              "Use this window for medical appointments, community commitments, and family responsibilities by design.",
              "Return borrowed time the next opportunity by compressing flex needs.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Your Flex Time™ commitment is not about filling every minute. It is about knowing in advance how
            your morning unfolds so your CEO Workday™ always begins on time — and your Sustainable Operating
            Practices™ remain intact, even on imperfect days.
          </Tip>
        ),
      },
    ],
  },

  /* 2 ─ Morning GIV•EN™ ──────────────────────────────────────────────── */
  "morning-given": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Morning GIV&bull;EN™ is your 90-minute intentional morning operating ritual. GIV&bull;EN™ stands
            for: Gratitude &bull; Invitation to Your Creator &bull; Vision & Visualization &bull; Emotional
            Embodiment &bull; Nurture. It combines spiritual alignment with scientific habit formation to
            create sustainable transformation from the inside out.
          </Para>
        ),
      },
      {
        heading: "Borrow Flex Time™",
        body: (
          <FlexBox>
            Up to 1 hour of this 90-minute segment may be temporarily reallocated to Flex Time™ when life
            requires it — preserving at least 30 minutes for Morning GIV&bull;EN™.
          </FlexBox>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            How you begin your morning determines how you execute your day. Harmony Lane™ combines two
            powerful forces: spiritual alignment — inviting your Creator and planting seeds of intention —
            and scientific habit formation through neuroscience, identity-based behavior change, and the
            Reticular Activating System (RAS). Together they align both your beliefs and your behaviors.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            The Reticular Activating System (RAS) in the brain acts as a filter — when you clearly visualize
            and emotionally embody your desired outcomes, the RAS begins directing your attention toward
            opportunities that match. Behavioral science research (Duhigg, Clear, Dispenza) confirms that
            emotional conditioning and consistent repetition rewire identity at the neurological level.
            Nervous system regulation through gratitude and visualization also lowers cortisol, improving
            executive decision-making throughout the day. Harmony Lane™ doesn&apos;t ask you to choose
            between science and spirituality. It uses both to help you intentionally redesign how you live,
            lead, and build your business.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Founders who protect Morning GIV&bull;EN™ report higher focus during their CEO Workday™, clearer
            decision-making, stronger sense of purpose, and reduced entrepreneurial isolation. This is not
            indulgence — it is operational preparation. The 30-minute borrow buffer ensures you never lose
            this practice entirely, even on demanding days.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Checking email or social media before completing Morning GIV\u2022EN™.",
              "Skipping the ritual when time is tight — that is exactly when you need it most.",
              "Rushing through the steps without genuine emotional engagement.",
              "Making the ritual so complex it becomes unsustainable over time.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Move through each GIV\u2022EN™ element in sequence: Gratitude → Invitation → Vision → Emotional Embodiment → Nurture.",
              "Wear comfortable clothing after Flex Time™ so you flow directly into the Movement Window™ at 10:30 AM.",
              "Complete your ritual before opening any device-based communication.",
              "Depth of engagement matters more than duration. 30 focused minutes outperforms 90 distracted ones.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The GIV&bull;EN™ framework aligns your spirit and your science simultaneously. When you open with
            Gratitude and invite your Creator into co-creation, then see and feel your desired life through
            Vision & Visualization and Emotional Embodiment, you are not just preparing for the day — you
            are becoming the founder who already lives it.
          </Tip>
        ),
      },
    ],
  },

  /* 3 ─ Movement Window™ ─────────────────────────────────────────────── */
  "movement-window": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Your Movement Window™ is your protected 30-minute movement practice — a non-negotiable block
            built into the Work-Life Balance Business Day™ from 10:30 AM to 11:00 AM. The goal is not
            athletic performance. The goal is movement consistency.
          </Para>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Exercise is the single highest-ROI Sustainable Operating Practice™ available to a founder. It
            directly improves cognitive performance, emotional regulation, stress resilience, hormonal
            balance, and sleep quality — all of which are prerequisites for high-level executive
            decision-making during your CEO Workday™.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Neuroscience research (Ratey, Harvard Medical School) demonstrates that aerobic exercise
            increases BDNF (Brain-Derived Neurotrophic Factor), which accelerates learning, improves memory
            consolidation, and enhances creative problem-solving. Even 15–30 minutes of moderate movement
            produces measurable cognitive benefits that last 4–6 hours — directly improving your 1:00 PM CEO
            Workday™ performance.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Founders who exercise consistently report 23% higher self-reported productivity and significantly
            reduced decision fatigue during their CEO Workday™. Your Movement Window™ is not separate from
            your business — it is the engine that powers it. Protecting this 30-minute window is one of the
            highest-leverage decisions in your entire operating day.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Treating movement as optional and skipping it when work pressures build — that is exactly when you need it.",
              "Planning a workout that exceeds 30 minutes and then skipping it entirely when time is short.",
              "Not wearing comfortable clothing after Morning GIV\u2022EN™, which creates friction at 10:30 AM.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Wear comfortable clothing after Morning GIV\u2022EN™ so you are ready when the Movement Window™ begins at 10:30 AM.",
              "Choose a form of movement you genuinely enjoy — consistency beats intensity every time.",
              "Even the shortest movement counts. A 3-minute stretch is a kept commitment.",
              "Protect this window as fiercely as you protect your CEO Workday™.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The goal of the Movement Window™ is not athletic performance. The goal is movement consistency.
            A 3-minute stretch performed every day for a year creates more compounding value than an intense
            60-minute workout performed occasionally. Physical movement is not a reward for completing your
            work — it is preparation for doing your best work.
          </Tip>
        ),
      },
    ],
  },

  /* 4 ─ Healthy Hybrid Lunch™ ────────────────────────────────────────── */
  "lunch-break": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Healthy Hybrid Lunch™ is your nourishing midday pause — a deliberate Sustainable Operating
            Practice™ that refuels your body, transitions your mind from morning commitments, and prepares
            you for your most important work. It is a core part of The New 9-to-5 & Nighttime
            Non-Negotiable SOPs™.
          </Para>
        ),
      },
      {
        heading: "Borrow Flex Time™",
        body: (
          <FlexBox>
            Up to 1 hour of this segment may be temporarily reallocated to Flex Time™ when life requires it.
          </FlexBox>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Most founders work through lunch, believing it demonstrates dedication. In reality, it depletes
            the mental resources needed for high-quality CEO Workday™ execution. The pause is not a cost —
            it is an investment in the quality of your afternoon, your nervous system regulation, and your
            hormonal balance.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Research in chronobiology confirms a natural post-lunch cognitive dip between 1:00 PM and
            3:00 PM when blood glucose regulation causes reduced alertness. A genuine midday break with
            intentional nutrition and movement counteracts this dip, improving afternoon performance by
            20–35%. Stepping away also activates the brain&apos;s default mode network — the neural system
            responsible for creative insight and strategic thinking — making the CEO Workday™ more productive
            and inventive.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Founders who take a genuine lunch break report higher afternoon focus, better quality decisions
            during their CEO Workday™, and lower rates of late-day exhaustion. This is one of the most
            underrated Sustainable Operating Practices™ available.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Eating at the desk while continuing to work.",
              "Skipping lunch entirely and running on caffeine into the CEO Workday™.",
              "Using the lunch window reactively — responding to emails or attending calls.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Step fully away from your workspace, even if only for 20 minutes.",
              "Include a brief movement element — a short walk, stretching, or fresh air.",
              "Eat with intention: prioritize protein and healthy fats over high-glycemic carbohydrates.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Think of Healthy Hybrid Lunch™ as the bridge between your morning commitments and your CEO
            Workday™. What happens in this window directly determines the quality of work you do in the four
            hours that follow.
          </Tip>
        ),
      },
    ],
  },

  /* 5 ─ 4-Hour CEO Workday™ ──────────────────────────────────────────── */
  "ceo-workday": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            The 4-Hour CEO Workday™ is your protected high-leverage execution window — four focused hours
            dedicated exclusively to the most important work that moves your business forward. It is the
            Business Operating System™ in action.
          </Para>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Most founders believe they need to work more hours to produce better results. The research says
            the opposite. Deep, focused, uninterrupted work produces 4–5x more output than the same hours
            worked in reactive, fragmented mode. Four focused hours in a flow state outperforms eight
            scattered, interrupted ones every time.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Cal Newport&apos;s research on Deep Work demonstrates that knowledge workers are capable of only
            4 hours of peak cognitive performance per day. Parkinson&apos;s Law confirms that work expands
            to fill the time available — a defined 4-hour window forces prioritization and eliminates
            low-leverage activity. Flow state research (Csikszentmihalyi) demonstrates that full immersion
            in high-challenge, high-skill work produces exponential output.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Business Operating Rules™ installed during the CEO Workday™ reduce execution friction, improve
            decision quality, increase AI leverage, strengthen delegation, and build compounding business
            assets.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Allowing meetings, phone calls, or email to interrupt the CEO Workday™.",
              "Starting the CEO Workday™ without a clear Executive Outcome™ defined.",
              "Using CEO Workday™ time for tasks that belong in delegation queues.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Begin every CEO Workday™ by reviewing your Executive Brief™.",
              "Define one Executive Outcome™ — the single most important result for the day.",
              "AI drafts first. Human judgment second. Never the reverse.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Your CEO Workday™ Operating Rule™ is not a task — it is a governing standard. It defines HOW you
            operate during this window, not just what you do. A great Operating Rule™ applies to every CEO
            Workday™ this week, next week, and every week after.
          </Tip>
        ),
      },
    ],
  },

  /* 6 ─ Time Freedom™ ────────────────────────────────────────────────── */
  "time-freedom": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Time Freedom™ is the protected life your business exists to support. From 5:00 PM to 10:00 PM,
            you are fully present — in your relationships, your passions, your rest, and your joy. This is a
            core Sustainable Operating Practice™. The business does not follow you here.
          </Para>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Founders who never fully disconnect report higher burnout, relationship deterioration, declining
            creative capacity, and accelerated entrepreneurial isolation. Time Freedom™ is not a privilege
            earned by finishing work — it is a non-negotiable component of sustainable high performance.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Research in recovery psychology (Sonnentag & Fritz) demonstrates that psychological detachment
            from work during off-hours is the strongest predictor of next-day job performance, engagement,
            and creativity.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Time Freedom™ is the entire purpose of the Work-Life Balance Business Week™. Every CEO
            Workday™, every Operating Rule™, every AI leverage and delegation decision is in service of
            expanding and protecting this segment.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Checking email or Slack during Time Freedom™.",
              'Taking "just one more call" that erodes the boundary.',
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

  /* 7 ─ Power Down™ ──────────────────────────────────────────────────── */
  "power-down": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Power Down™ is your intentional evening ritual — the 60-minute transition between Time
            Freedom™ and Unplug™. It begins at 10:00 PM and prepares your mind and body for deep,
            restorative sleep. The business day closes at 11:00 PM sharp.
          </Para>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Sleep quality is the single most important recovery variable for cognitive performance. Founders
            who do not have a deliberate wind-down practice experience poorer sleep onset, lighter sleep
            stages, and reduced next-day executive function.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Harvard sleep research (Walker, &apos;Why We Sleep&apos;) confirms that blue light exposure
            within 90 minutes of sleep onset reduces melatonin production by up to 50%. Cognitive arousal
            from email, work content, or social media keeps the prefrontal cortex activated and delays sleep
            onset by 30–60 minutes on average.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            A well-rested founder makes better decisions, thinks more creatively, manages emotions more
            skillfully, and sustains high performance over time. Power Down™ is not a soft habit — it is the
            physiological foundation of the entire Work-Life Balance Business Day™.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Bringing your phone to bed and scrolling after 10:00 PM.",
              "Checking email or reviewing work in the Power Down™ window.",
              "Not having a defined close of business ritual — the mind stays 'on' without one.",
              "Allowing the Power Down™ window to start later and later each night.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Create a clear 'close of business' ritual at 10:00 PM — a physical or symbolic act that signals the end of the business day.",
              "Place all devices out of reach by 10:00 PM.",
              "End with something that feeds the mind gently: reading, reflection, or gratitude.",
              "If you choose to Power Down earlier, honor it. Earlier is always encouraged.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            The way you end today determines how you begin tomorrow. At 11:00 PM, today&apos;s business is
            officially closed. Tomorrow deserves a fully restored CEO. Power Down™ is not the end of the
            operating cycle — it is the preparation for the next one. A 7:00 AM reopening becomes effortless
            when you are fully unplugged by 11:00 PM.
          </Tip>
        ),
      },
    ],
  },

  /* 8 ─ Unplug™ ──────────────────────────────────────────────────────── */
  "digital-detox": {
    sections: [
      {
        heading: "Purpose",
        body: (
          <Para>
            Unplug™ is the 8th Operating Segment™ — the official close of the Work-Life Balance Business
            Day™. At 11:00 PM, the business day is Closed For Business™. There is no partial unplugging.
            This commitment protects the restorative sleep that makes everything else in your operating day
            possible.
          </Para>
        ),
      },
      {
        heading: "Why It Matters",
        body: (
          <Para>
            Sleep onset, sleep depth, and sleep consistency are directly governed by the signals you send
            your nervous system between 10:00 PM and 11:00 PM. Unplug™ installs the final boundary that
            makes true recovery possible.
          </Para>
        ),
      },
      {
        heading: "Scientific Foundation",
        body: (
          <Para>
            Consistent sleep timing regulates the circadian clock, which governs cortisol, melatonin, growth
            hormone, and immune function simultaneously. Even a single night of disrupted sleep reduces
            next-day executive decision-making by a measurable margin.
          </Para>
        ),
      },
      {
        heading: "Business Value",
        body: (
          <Para>
            Tomorrow&apos;s CEO Workday™ performance is built tonight. Every hour of quality sleep compounds
            into clearer thinking, faster decisions, better emotional regulation, and more creative
            problem-solving the following day.
          </Para>
        ),
      },
      {
        heading: "Common Mistakes",
        body: (
          <Bullets
            items={[
              "Telling yourself 'just five more minutes' — that is how 11:00 PM becomes 1:00 AM.",
              "Keeping your phone on your nightstand within reach.",
              "Treating Unplug™ as optional on high-stress nights — those are exactly the nights you need it most.",
            ]}
          />
        ),
      },
      {
        heading: "Best Practices",
        body: (
          <Bullets
            items={[
              "Make Unplug™ a physical act: put the phone in another room.",
              "Your Power Down™ ritual should lead you naturally into Unplug™ without willpower.",
              "If you wake during the night, do not reach for your phone.",
            ]}
          />
        ),
      },
      {
        heading: "",
        body: (
          <Tip>
            Your business is now Closed For Business™. Tomorrow deserves a fully restored CEO. Unplug™ is
            not a restriction — it is the highest form of executive self-respect. Sleep well.
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
