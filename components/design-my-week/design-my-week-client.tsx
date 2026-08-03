"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Info, Plus, Trash2 } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

/* ── Movement activities library (Part 3) ──────────────────────────────── */
const MOVEMENT_ACTIVITIES = [
  "Walking",
  "Walk Away the Pounds™",
  "Tai Chi",
  "Yoga",
  "Stretching",
  "Pilates",
  "Strength Training",
  "Resistance Bands",
  "Bodyweight Exercises",
  "Dance",
  "Zumba",
  "Chair Exercise",
  "Mobility",
  "Swimming",
  "Cycling",
  "Running",
  "Hiking",
  "Elliptical",
  "Treadmill",
  "Rowing",
  "Jump Rope",
  "Meditation Walk",
  "Rebounding",
  "Gardening",
  "Other",
]

const SLEEP_OPTIONS = [
  { value: 6.5, label: "6.5 hours" },
  { value: 7, label: "7 hours" },
  { value: 7.5, label: "7.5 hours" },
  { value: 8, label: "8 hours", recommended: true },
  { value: 8.5, label: "8.5 hours" },
  { value: 9, label: "9 hours" },
]

/* ── Segments ──────────────────────────────────────────────────────────── */
const SEGMENTS = [
  {
    id: "early-entry",
    title: "Early Entry / Flex Time™",
    time: "7:00 AM – 9:00 AM",
    type: "flex" as const,
    description:
      "A protected 2-hour flexibility buffer at the start of every day — designed to absorb life's unavoidable demands without ever touching your CEO Workday™.",
    examples: [
      "preparing for the day and getting myself organized",
      "sleeping in an extra hour when my body needs recovery",
      "handling school drop-offs every weekday morning",
      "scheduling all medical appointments in this window",
      "attending a networking breakfast or coffee meeting",
      "taking care of family responsibilities before my day begins",
      "running personal errands so they never touch my CEO Workday\u2122",
      "fulfilling community or volunteer commitments I value",
    ],
    learnMore: {
      purpose: "Early Entry / Flex Time\u2122 is a deliberately engineered buffer — not wasted time. It is one of The New 9-to-5 & Nighttime Non-Negotiable SOPs\u2122 that protects your Daily Non-Negotiables\u2122 and ensures life\u2019s unavoidable demands never spill into your CEO Workday\u2122.",
      whyItMatters: "Without a protected flexibility window, life events become fires. The CEO Workday\u2122 gets stolen. Sustainable Operating Practices\u2122 get sacrificed. Flex Time\u2122 is how high-performing founders stay anchored to their operating rhythm even when life is unpredictable.",
      science: "Research in cognitive load and decision fatigue shows that unplanned interruptions during deep work windows reduce overall productivity by up to 40%. The Progress Principle (Amabile & Kramer) demonstrates that protecting small daily wins — like keeping the CEO Workday\u2122 intact — compounds into significantly higher motivation, creativity, and performance over time. Pre-scheduling a flex buffer eliminates reactive decision-making and protects the cognitive resources reserved for flow state during the CEO Workday\u2122.",
      businessValue: "Every hour you protect your CEO Workday\u2122 is an hour available for your highest-leverage business work. Flex Time\u2122 is the front-line defense that makes that protection possible. Founders who install this buffer report fewer scheduling conflicts, lower stress, and stronger consistency with their Sustainable Operating Practices\u2122 — even during the most demanding weeks.",
      commonMistakes: [
        "Allowing Flex Time\u2122 to expand beyond 4 hours on a regular basis.",
        "Using borrowed Flex Time\u2122 every day rather than occasionally.",
        "Not having a defined anchor commitment for this window — defaulting to reactive behavior.",
        "Treating personal errands and family responsibilities as interruptions rather than protected commitments.",
      ],
      bestPractices: [
        "Install one consistent anchor commitment (e.g. school drop-off, networking breakfast, morning prep).",
        "Treat borrowing as a weekly exception — not a daily routine.",
        "Use this window for medical appointments, community commitments, and family responsibilities by design.",
        "Return borrowed time the next opportunity by compressing flex needs.",
      ],
      cbTip: "Your Flex Time\u2122 commitment is not about filling every minute. It is about knowing in advance how your morning unfolds so your CEO Workday\u2122 always begins on time — and your Sustainable Operating Practices\u2122 remain intact, even on imperfect days.",
    },
    flexNote: {
      default: "2 hours available by default.",
      borrow: [
        { from: "Morning GIV\u2022EN\u2122", max: "up to 1 hour" },
        { from: "Healthy Hybrid Lunch\u2122", max: "up to 1 hour" },
      ],
      max: "4 hours maximum when both are borrowed.",
      rule: "Borrowing is reserved for genuine life demands — not a daily habit. Your 4-Hour CEO Workday\u2122 (1:00\u2009PM\u2013\u20095:00\u2009PM) is never borrowed from and never shortened.",
    },
  },
  {
    id: "morning-given",
    title: "Morning GIV\u2022EN\u2122",
    time: "9:00 AM – 10:30 AM",
    type: "life" as const,
    description:
      "Your 90-minute intentional morning operating ritual — grounding your mind, aligning your spirit, and setting the tone for your entire Work-Life Balance Business Day™. GIV\u2022EN\u2122 stands for: Gratitude \u2022 Invitation to Your Creator \u2022 Vision & Visualization \u2022 Emotional Embodiment \u2022 Nurture.",
    examples: [
      "opening my heart and mind to gratitude, allowing abundance, possibility, and peace to become today's starting point",
      "inviting my Creator to co-create my day with me",
      "visualizing my ideal life and business with all five senses",
      "embodying the emotions of the work-life balanced founder I am becoming",
      "nurturing my Daily Non-Negotiables\u2122 with consistent action",
      "journaling my intentions and setting a clear focus for the day",
    ],
    borrowNote: "Up to 1 hour of this 90-minute segment may be temporarily reallocated to Flex Time\u2122 when life requires it — preserving at least 30 minutes for Morning GIV\u2022EN\u2122.",
    learnMore: {
      purpose: "Morning GIV\u2022EN\u2122 is your 90-minute intentional morning operating ritual. GIV\u2022EN\u2122 stands for: Gratitude \u2022 Invitation to Your Creator \u2022 Vision & Visualization \u2022 Emotional Embodiment \u2022 Nurture. It combines spiritual alignment with scientific habit formation to create sustainable transformation from the inside out.",
      whyItMatters: "How you begin your morning determines how you execute your day. Harmony Lane\u2122 combines two powerful forces: spiritual alignment — inviting your Creator and planting seeds of intention — and scientific habit formation through neuroscience, identity-based behavior change, and the Reticular Activating System (RAS). Together they align both your beliefs and your behaviors.",
      science: "The Reticular Activating System (RAS) in the brain acts as a filter — when you clearly visualize and emotionally embody your desired outcomes, the RAS begins directing your attention toward opportunities that match. Behavioral science research (Duhigg, Clear, Dispenza) confirms that emotional conditioning and consistent repetition rewire identity at the neurological level. Nervous system regulation through gratitude and visualization also lowers cortisol, improving executive decision-making throughout the day. Harmony Lane\u2122 doesn\u2019t ask you to choose between science and spirituality. It uses both to help you intentionally redesign how you live, lead, and build your business.",
      businessValue: "Founders who protect Morning GIV\u2022EN\u2122 report higher focus during their CEO Workday\u2122, clearer decision-making, stronger sense of purpose, and reduced entrepreneurial isolation. This is not indulgence — it is operational preparation. The 30-minute borrow buffer ensures you never lose this practice entirely, even on demanding days.",
      commonMistakes: [
        "Checking email or social media before completing Morning GIV\u2022EN\u2122.",
        "Skipping the ritual when time is tight — that is exactly when you need it most.",
        "Rushing through the steps without genuine emotional engagement.",
        "Making the ritual so complex it becomes unsustainable over time.",
      ],
      bestPractices: [
        "Move through each GIV\u2022EN\u2122 element in sequence: Gratitude \u2192 Invitation \u2192 Vision \u2192 Emotional Embodiment \u2192 Nurture.",
        "Wear comfortable clothing after Flex Time\u2122 so you flow directly into the Movement Window\u2122 at 10:30 AM.",
        "Complete your ritual before opening any device-based communication.",
        "Depth of engagement matters more than duration. 30 focused minutes outperforms 90 distracted ones.",
      ],
      cbTip: "The GIV\u2022EN\u2122 framework aligns your spirit and your science simultaneously. When you open with Gratitude and invite your Creator into co-creation, then see and feel your desired life through Vision & Visualization and Emotional Embodiment, you are not just preparing for the day — you are becoming the founder who already lives it.",
    },
  },
  {
    id: "workout",
    title: "Set My 30-Minute Movement Intention\u2122",
    time: "10:30 AM – 11:00 AM",
    type: "life" as const,
    description:
      "Your protected 30-minute Movement Window\u2122 — built directly into your Work-Life Balance Business Day\u2122. Non-negotiable for sustained energy, mental clarity, and long-term health. The goal is not athletic performance. The goal is movement consistency.",
    examples: [
      "a 3-minute stretch to open my body for the day",
      "a 5-minute walk to reset my energy",
      "a 10-minute mobility session for flexibility and recovery",
      "a 15-minute yoga flow to ground my mind and body",
      "15 minutes of Walk Away the Pounds\u2122 followed by 15 minutes of Tai Chi",
      "a 20-minute strength circuit to build physical resilience",
      "a 25-minute brisk walk for cardiovascular health",
      "a full 30-minute workout of my choice",
    ],
    learnMore: {
      purpose: "The Movement Window\u2122 is your protected 30-minute movement practice — a non-negotiable block built into the Work-Life Balance Business Day\u2122 from 10:30 AM to 11:00 AM. Examples never exceed 30 minutes. A 3-minute stretch counts. A full 30-minute workout counts. What matters is that you move consistently.",
      whyItMatters: "Exercise is the single highest-ROI Sustainable Operating Practice\u2122 available to a founder. It directly improves cognitive performance, emotional regulation, stress resilience, hormonal balance, and sleep quality — all of which are prerequisites for high-level executive decision-making during your CEO Workday\u2122.",
      science: "Neuroscience research (Ratey, Harvard Medical School) demonstrates that aerobic exercise increases BDNF (Brain-Derived Neurotrophic Factor), which accelerates learning, improves memory consolidation, and enhances creative problem-solving. Even 15\u201330 minutes of moderate movement produces measurable cognitive benefits that last 4\u20136 hours — directly improving your 1:00 PM CEO Workday\u2122 performance.",
      businessValue: "Founders who exercise consistently report 23% higher self-reported productivity and significantly reduced decision fatigue during their CEO Workday\u2122. Your Movement Window\u2122 is not separate from your business — it is the engine that powers it. Protecting this 30-minute window is one of the highest-leverage decisions in your entire operating day.",
      commonMistakes: [
        "Treating movement as optional and skipping it when work pressures build — that is exactly when you need it.",
        "Planning a workout that exceeds 30 minutes and then skipping it entirely when time is short.",
        "Not wearing comfortable clothing after Morning GIV\u2022EN\u2122, which creates friction at 10:30 AM.",
      ],
      bestPractices: [
        "Wear comfortable clothing after Morning GIV\u2022EN\u2122 so you are ready when the Movement Window\u2122 begins at 10:30 AM.",
        "Choose a form of movement you genuinely enjoy — consistency beats intensity every time.",
        "Even the shortest movement counts. A 3-minute stretch is a kept commitment.",
        "Protect this window as fiercely as you protect your CEO Workday\u2122.",
      ],
      cbTip: "The goal of the Movement Window\u2122 is not athletic performance. The goal is movement consistency. A 3-minute stretch performed every day for a year creates more compounding value than an intense 60-minute workout performed occasionally. Physical movement is not a reward for completing your work — it is preparation for doing your best work.",
    },
  },
  {
    id: "healthy-lunch",
    title: "Healthy Hybrid Lunch\u2122",
    time: "11:00 AM – 1:00 PM",
    type: "life" as const,
    description:
      "A nourishing midday pause that refuels your body, creates a natural rhythm break, and prepares you for your most important work.",
    examples: [
      "eating lunch away from my desk every day",
      "taking an outdoor walk during my lunch break",
      "having lunch with a friend or colleague once a week",
      "preparing a healthy meal so I control what I eat",
      "drinking at least 64 oz of water by midday",
      "taking a full midday pause away from all screens",
    ],
    borrowNote: "Up to 1 hour of this segment may be temporarily reallocated to Flex Time\u2122 when life requires it.",
    learnMore: {
      purpose: "Healthy Hybrid Lunch\u2122 is your nourishing midday pause — a deliberate Sustainable Operating Practice\u2122 that refuels your body, transitions your mind from morning commitments, and prepares you for your most important work. It is a core part of The New 9-to-5 & Nighttime Non-Negotiable SOPs\u2122.",
      whyItMatters: "Most founders work through lunch, believing it demonstrates dedication. In reality, it depletes the mental resources needed for high-quality CEO Workday\u2122 execution. The pause is not a cost — it is an investment in the quality of your afternoon, your nervous system regulation, and your hormonal balance.",
      science: "Research in chronobiology confirms a natural post-lunch cognitive dip between 1:00 PM and 3:00 PM when blood glucose regulation causes reduced alertness. A genuine midday break with intentional nutrition and movement counteracts this dip, improving afternoon performance by 20\u201335%. Stepping away also activates the brain\u2019s default mode network — the neural system responsible for creative insight and strategic thinking — making the CEO Workday\u2122 more productive and inventive.",
      businessValue: "Founders who take a genuine lunch break report higher afternoon focus, better quality decisions during their CEO Workday\u2122, and lower rates of late-day exhaustion. This is one of the most underrated Sustainable Operating Practices\u2122 available.",
      commonMistakes: [
        "Eating at the desk while continuing to work.",
        "Skipping lunch entirely and running on caffeine into the CEO Workday\u2122.",
        "Using the lunch window reactively — responding to emails or attending calls.",
      ],
      bestPractices: [
        "Step fully away from your workspace, even if only for 20 minutes.",
        "Include a brief movement element — a short walk, stretching, or fresh air.",
        "Eat with intention: prioritize protein and healthy fats over high-glycemic carbohydrates.",
      ],
      cbTip: "Think of Healthy Hybrid Lunch\u2122 as the bridge between your morning commitments and your CEO Workday\u2122. What happens in this window directly determines the quality of work you do in the four hours that follow.",
    },
  },
  {
    id: "ceo-workday",
    title: "4-Hour CEO Workday\u2122",
    time: "1:00 PM – 5:00 PM",
    type: "business" as const,
    description:
      "Your protected, high-leverage CEO execution window. Four focused hours dedicated exclusively to the most important work that moves your business forward.",
    examples: [
      "only scheduling meetings that have an agenda, owner, and clear decision",
      "having AI draft first and reviewing before I send anything",
      "turning every recurring process into an SOP after the third time I do it",
      "sending every client proposal within 24 hours of the conversation",
      "beginning every CEO Workday\u2122 by reviewing my Executive Brief\u2122",
      "having one leveraged sales conversation every working day",
    ],
    learnMore: {
      purpose: "The 4-Hour CEO Workday\u2122 is your protected high-leverage execution window — four focused hours dedicated exclusively to the most important work that moves your business forward. It is the Business Operating System\u2122 in action.",
      whyItMatters: "Most founders believe they need to work more hours to produce better results. The research says the opposite. Deep, focused, uninterrupted work produces 4\u20135x more output than the same hours worked in reactive, fragmented mode. Four focused hours in a flow state outperforms eight scattered, interrupted ones every time.",
      science: "Cal Newport\u2019s research on Deep Work demonstrates that knowledge workers are capable of only 4 hours of peak cognitive performance per day. Parkinson\u2019s Law confirms that work expands to fill the time available — a defined 4-hour window forces prioritization and eliminates low-leverage activity. Flow state research (Csikszentmihalyi) demonstrates that full immersion in high-challenge, high-skill work produces exponential output.",
      businessValue: "Business Operating Rules\u2122 installed during the CEO Workday\u2122 reduce execution friction, improve decision quality, increase AI leverage, strengthen delegation, and build compounding business assets.",
      commonMistakes: [
        "Allowing meetings, phone calls, or email to interrupt the CEO Workday\u2122.",
        "Starting the CEO Workday\u2122 without a clear Executive Outcome\u2122 defined.",
        "Using CEO Workday\u2122 time for tasks that belong in delegation queues.",
      ],
      bestPractices: [
        "Begin every CEO Workday\u2122 by reviewing your Executive Brief\u2122.",
        "Define one Executive Outcome\u2122 — the single most important result for the day.",
        "AI drafts first. Human judgment second. Never the reverse.",
      ],
      cbTip: "Your CEO Workday\u2122 Operating Rule\u2122 is not a task — it is a governing standard. It defines HOW you operate during this window, not just what you do. A great Operating Rule\u2122 applies to every CEO Workday\u2122 this week, next week, and every week after.",
    },
  },
  {
    id: "time-freedom",
    title: "Time Freedom\u2122",
    time: "5:00 PM – 10:00 PM",
    type: "life" as const,
    description:
      "The protected life your business exists to support. Five hours of fully present, fully free time — for your relationships, passions, rest, and joy. The business does not follow you here.",
    examples: [
      "being fully present with my family every evening",
      "attending every one of my child\u2019s activities this week",
      "reading for pleasure for at least 30 minutes each evening",
      "spending quality time with my partner at least twice this week",
      "gardening and reconnecting with nature after work",
      "volunteering my time to a cause that matters to me",
    ],
    learnMore: {
      purpose: "Time Freedom\u2122 is the protected life your business exists to support. From 5:00 PM to 10:00 PM, you are fully present — in your relationships, your passions, your rest, and your joy. This is a core Sustainable Operating Practice\u2122. The business does not follow you here.",
      whyItMatters: "Founders who never fully disconnect report higher burnout, relationship deterioration, declining creative capacity, and accelerated entrepreneurial isolation. Time Freedom\u2122 is not a privilege earned by finishing work — it is a non-negotiable component of sustainable high performance.",
      science: "Research in recovery psychology (Sonnentag & Fritz) demonstrates that psychological detachment from work during off-hours is the strongest predictor of next-day job performance, engagement, and creativity.",
      businessValue: "Time Freedom\u2122 is the entire purpose of the Work-Life Balance Business Week\u2122. Every CEO Workday\u2122, every Operating Rule\u2122, every AI leverage and delegation decision is in service of expanding and protecting this segment.",
      commonMistakes: [
        "Checking email or Slack during Time Freedom\u2122.",
        "Taking \u2018just one more call\u2019 that erodes the boundary.",
        "Treating Time Freedom\u2122 as optional when the business is demanding.",
      ],
      bestPractices: [
        "Define what Time Freedom\u2122 looks like for you specifically.",
        "Protect this window with the same discipline you apply to your CEO Workday\u2122.",
        "Let the people you love know this time belongs to them.",
      ],
      cbTip: "The founder who can walk away from their business at 5:00 PM with a clear conscience has built something extraordinary. That clarity comes from completing meaningful work during the CEO Workday\u2122 — not from working longer hours.",
    },
  },
  {
    id: "power-down",
    title: "Power Down\u2122",
    time: "10:00 PM – 11:00 PM",
    type: "life" as const,
    description:
      "The intentional close to every Work-Life Balance Business Day\u2122. Power Down\u2122 begins at 10:00 PM. You are fully winding down — transitioning away from screens, releasing the day, and preparing your mind and body for deep, restorative rest.",
    examples: [
      "beginning my Power Down\u2122 ritual at 10:00 PM every night",
      "placing all devices out of reach by 10:00 PM",
      "spending 15 minutes in evening reflection and gratitude",
      "reading a book instead of scrolling before sleep",
      "stretching to release the day from my body",
      "reviewing my intentions for tomorrow before I rest",
      "a skincare routine and gentle self-care ritual",
      "quiet conversation with someone I love",
      "light music and candlelight relaxation",
      "preparing tomorrow's clothes and laying out workout wear",
      "prayer or meditation to close the day",
      "deep breathing to signal rest to my nervous system",
    ],
    learnMore: {
      purpose: "Power Down\u2122 is your intentional evening ritual — the 60-minute transition between Time Freedom\u2122 and Unplug\u2122. It begins at 10:00 PM and prepares your mind and body for deep, restorative sleep. The business day closes at 11:00 PM sharp.",
      whyItMatters: "Sleep quality is the single most important recovery variable for cognitive performance. Founders who do not have a deliberate wind-down practice experience poorer sleep onset, lighter sleep stages, and reduced next-day executive function.",
      science: "Harvard sleep research (Walker, \u2018Why We Sleep\u2019) confirms that blue light exposure within 90 minutes of sleep onset reduces melatonin production by up to 50%. Cognitive arousal from email, work content, or social media keeps the prefrontal cortex activated and delays sleep onset by 30\u201360 minutes on average.",
      businessValue: "A well-rested founder makes better decisions, thinks more creatively, manages emotions more skillfully, and sustains high performance over time. Power Down\u2122 is not a soft habit — it is the physiological foundation of the entire Work-Life Balance Business Day\u2122.",
      commonMistakes: [
        "Bringing your phone to bed and scrolling after 10:00 PM.",
        "Checking email or reviewing work in the Power Down\u2122 window.",
        "Not having a defined close of business ritual — the mind stays \u2018on\u2019 without one.",
        "Allowing the Power Down\u2122 window to start later and later each night.",
      ],
      bestPractices: [
        "Create a clear \u2018close of business\u2019 ritual at 10:00 PM — a physical or symbolic act that signals the end of the business day.",
        "Place all devices out of reach by 10:00 PM.",
        "End with something that feeds the mind gently: reading, reflection, or gratitude.",
        "If you choose to Power Down earlier, honor it. Earlier is always encouraged.",
      ],
      cbTip: "The way you end today determines how you begin tomorrow. At 11:00 PM, today's business is officially closed. Tomorrow deserves a fully restored CEO. Power Down\u2122 is not the end of the operating cycle — it is the preparation for the next one. A 7:00 AM reopening becomes effortless when you are fully unplugged by 11:00 PM.",
    },
  },
  {
    id: "unplug",
    title: "Unplug\u2122",
    time: "11:00 PM \u2022 Closed For Business\u2122",
    type: "life" as const,
    description:
      "The official close of the Work-Life Balance Business Day\u2122. At 11:00 PM, Harmony Lane\u2122 is Closed For Business\u2122. All devices are away. The community is closed. You are in full rest. Tomorrow deserves a fully restored CEO.",
    examples: [
      "fully unplugged from all devices by 11:00 PM every night",
      "asleep or in bed with no screens by 11:00 PM",
      "honoring the close of business every night at 11:00 PM",
      "protecting my restorative sleep as a non-negotiable CEO investment",
      "trusting that Harmony Lane\u2122 will be here at 7:00 AM — rested and ready",
    ],
    learnMore: {
      purpose: "Unplug\u2122 is the 8th Operating Segment\u2122 — the official close of the Work-Life Balance Business Day\u2122. At 11:00 PM, the business day is Closed For Business\u2122. There is no partial unplugging. This commitment protects the restorative sleep that makes everything else in your operating day possible.",
      whyItMatters: "Sleep onset, sleep depth, and sleep consistency are directly governed by the signals you send your nervous system between 10:00 PM and 11:00 PM. Unplug\u2122 installs the final boundary that makes true recovery possible.",
      science: "Consistent sleep timing regulates the circadian clock, which governs cortisol, melatonin, growth hormone, and immune function simultaneously. Even a single night of disrupted sleep reduces next-day executive decision-making by a measurable margin.",
      businessValue: "Tomorrow\u2019s CEO Workday\u2122 performance is built tonight. Every hour of quality sleep compounds into clearer thinking, faster decisions, better emotional regulation, and more creative problem-solving the following day.",
      commonMistakes: [
        "Telling yourself \u2018just five more minutes\u2019 — that is how 11:00 PM becomes 1:00 AM.",
        "Keeping your phone on your nightstand within reach.",
        "Treating Unplug\u2122 as optional on high-stress nights — those are exactly the nights you need it most.",
      ],
      bestPractices: [
        "Make Unplug\u2122 a physical act: put the phone in another room.",
        "Your Power Down\u2122 ritual should lead you naturally into Unplug\u2122 without willpower.",
        "If you wake during the night, do not reach for your phone.",
      ],
      cbTip: "Your business is now Closed For Business\u2122. Tomorrow deserves a fully restored CEO. Unplug\u2122 is not a restriction — it is the highest form of executive self-respect. Sleep well.",
    },
  },
]

/* ── Intention Declaration generator (Part 1 — full commitment preserved) ── */
function elevateDeclaration(segmentId: string, rawInput: string): string {
  const input = rawInput.trim()
  if (!input) return ""

  // Strip leading "I am committed to " if the founder typed the full phrase
  const clean = input
    .replace(/^I am committed to\s+/i, "")
    .replace(/\.$/, "")
    .trim()

  const lower = clean.toLowerCase()

  // ── Workout segment: preserve ALL activities mentioned ───────────────────
  if (segmentId === "workout") {
    // Build activity list from the raw input so nothing is dropped
    const hasWalkAwayPounds = /walk away the pounds/i.test(clean)
    const hasTaiChi = /tai chi/i.test(clean)
    const hasYoga = /yoga/i.test(clean)
    const hasWalk = /\bwalk\b/i.test(clean) && !hasWalkAwayPounds
    const hasDance = /danc/i.test(clean)
    const hasStrength = /strength|lift|weight/i.test(clean)
    const hasCycl = /cycl|bike/i.test(clean)
    const hasStretch = /stretch/i.test(clean)
    const hasPilates = /pilates/i.test(clean)
    const hasZumba = /zumba/i.test(clean)
    const hasRun = /\brun\b|\brunning\b/i.test(clean)

    // Multiple distinct activities detected — generate a compound declaration
    const activities: string[] = []
    if (hasWalkAwayPounds) activities.push("Walk Away the Pounds\u2122")
    if (hasTaiChi) activities.push("Tai Chi")
    if (hasYoga) activities.push("yoga")
    if (hasWalk) activities.push("walking")
    if (hasDance) activities.push("dance")
    if (hasStrength) activities.push("strength training")
    if (hasCycl) activities.push("cycling")
    if (hasStretch) activities.push("stretching")
    if (hasPilates) activities.push("Pilates")
    if (hasZumba) activities.push("Zumba")
    if (hasRun) activities.push("running")

    if (activities.length >= 2) {
      // Build natural language list: "A, B, and C"
      const list =
        activities.length === 2
          ? `${activities[0]} and ${activities[1]}`
          : activities.slice(0, -1).join(", ") + `, and ${activities[activities.length - 1]}`

      return `Today I honor my body by completing both my ${list} during my Movement Window\u2122. Every minute of intentional movement strengthens my energy, supports my health, and prepares me to lead with greater focus and vitality.`
    }

    // Single activity — original precise patterns
    if (hasWalkAwayPounds)
      return `I honor my body and energize my morning through my Walk Away the Pounds\u2122 routine, building the physical foundation that powers my CEO Workday\u2122.`
    if (hasTaiChi)
      return `I center my mind and strengthen my body through my daily Tai Chi practice, arriving at each CEO Workday\u2122 grounded, focused, and fully present.`
    if (hasYoga)
      return `I restore my body and center my mind through a daily yoga practice, arriving at each day flexible, grounded, and energized.`
    if (hasWalk)
      return `I strengthen my body and renew my energy through a daily walk, honoring my health as the non-negotiable foundation of everything I build.`
    if (hasDance)
      return `I move my body joyfully through dance, celebrating the energy and vitality that fuels everything I create.`
    if (hasStrength)
      return `I build physical strength daily, knowing that a strong body creates the sustained energy and resilience my vision requires.`
    if (hasCycl)
      return `I build endurance and mental clarity through cycling, arriving at every CEO Workday\u2122 with energy to execute at my highest level.`
    if (hasStretch)
      return `I honor my body with a daily stretching practice, maintaining the flexibility and recovery that high performance demands.`

    return `I protect my body through ${lower}, treating my physical health as the irreplaceable engine that powers everything I am building.`
  }

  // ── Segment-aware elevation patterns (all other segments) ────────────────
  switch (segmentId) {
    case "early-entry":
      if (/school|drop.?off|kids|children/i.test(clean))
        return `I honor my family responsibilities by making school drop-off a protected part of my morning, knowing my CEO Workday\u2122 begins on time at 1:00\u2009PM.`
      if (/doctor|appointment|medical/i.test(clean))
        return `I take care of my health and personal needs during Flex Time\u2122, protecting my 4-Hour CEO Workday\u2122 and everything that matters most.`
      if (/network|coffee|breakfast|meeting/i.test(clean))
        return `I invest in meaningful connections and relationships during my Flex Time\u2122 window, keeping my CEO Workday\u2122 fully protected.`
      return `I use my Flex Time\u2122 intentionally for ${lower}, so that nothing interrupts my 4-Hour CEO Workday\u2122 from 1:00\u2009PM to 5:00\u2009PM.`

    case "morning-given":
      if (/gratitude|thank/i.test(clean))
        return `I begin every morning by cultivating gratitude, setting the tone for a focused, intentional, and high-performing day.`
      if (/prayer|faith|spiritual/i.test(clean))
        return `I begin every morning grounded in prayer, entering each day with clarity of purpose and strength of spirit.`
      if (/journal/i.test(clean))
        return `I begin every morning by journaling my intentions and insights, creating clarity and focus before the day begins.`
      if (/meditat/i.test(clean))
        return `I begin every morning with meditation, cultivating the stillness and mental clarity that makes everything else possible.`
      if (/visuali/i.test(clean))
        return `I begin every morning visualizing the day I intend to create, aligning my mind and energy before I take a single action.`
      if (/read/i.test(clean))
        return `I begin every morning with purposeful reading, feeding my mind with wisdom that compounds into extraordinary results over time.`
      return `I begin every morning with ${lower}, creating the intentional foundation from which my most productive and fulfilling days are built.`

    case "healthy-lunch":
      if (/away.*(desk|screen|computer)/i.test(clean) || /desk/i.test(clean))
        return `I nourish my body and reset my mind each day by stepping completely away from my desk at lunch — honoring the pause that makes the afternoon possible.`
      if (/outdoor|outside|walk|fresh air/i.test(clean))
        return `I refresh my mind and body at midday with an outdoor break, arriving at my CEO Workday\u2122 energized and ready to lead.`
      if (/friend|family/i.test(clean))
        return `I invest in meaningful relationships at lunch, knowing that connection nourishes both the life and the business I am building.`
      if (/meal prep|cook/i.test(clean))
        return `I fuel my afternoon with intentional nutrition by preparing a healthy meal, treating my body as the high-performance asset it is.`
      if (/hydrat/i.test(clean))
        return `I make hydration a conscious midday practice, knowing that clarity of mind and sustained energy begin with how I fuel my body.`
      return `I nourish my body at midday with ${lower}, honoring the reset that prepares me for my most important CEO work of the day.`

    case "ceo-workday":
      if (/keynote|present/i.test(clean))
        return `I protect my 4-Hour CEO Workday\u2122 as dedicated time for high-value creation — and this week, I complete my keynote presentation with full focus and creative excellence.`
      if (/podcast|record/i.test(clean))
        return `I use my CEO Workday\u2122 to create content that compounds — recording the podcast episode that builds my authority and impact.`
      if (/proposal|client/i.test(clean))
        return `I protect my CEO Workday\u2122 for the high-leverage client work that drives revenue and builds lasting business relationships.`
      if (/sales|conversation|call/i.test(clean))
        return `I use my CEO Workday\u2122 to lead high-quality sales conversations that convert with integrity and create genuine client value.`
      if (/AI|delegation|delegate|SOP/i.test(clean))
        return `I use my CEO Workday\u2122 to build the systems and delegation frameworks that give me leverage — so I can work fewer hours and produce greater results.`
      if (/webinar|course|program/i.test(clean))
        return `I protect my CEO Workday\u2122 for building the programs and content that scale my impact beyond the hours I work.`
      return `I protect my 4-Hour CEO Workday\u2122 from 1:00\u2009PM to 5:00\u2009PM as sacred time for ${lower} — the high-leverage work that builds my business and my future.`

    case "time-freedom":
      if (/child|kid|son|daughter|family/i.test(clean))
        return `I protect my family time as fiercely as I protect my CEO Workday\u2122 — being fully present with the people I am building this business for.`
      if (/date|partner|spouse|husband|wife/i.test(clean))
        return `I invest in my relationship by creating protected, phone-free time with my partner — because the most important business I run is my life.`
      if (/read|book/i.test(clean))
        return `I restore my mind and feed my imagination through reading during Time Freedom\u2122 — knowing that the best leaders never stop learning.`
      if (/garden/i.test(clean))
        return `I reconnect with nature and find peace through gardening during my Time Freedom\u2122 — restoring the energy I invest in everything I build.`
      if (/volunteer|community/i.test(clean))
        return `I give my time and energy to my community during Time Freedom\u2122, fulfilling the deeper purpose that makes my work meaningful.`
      return `I protect my Time Freedom\u2122 as the sacred, non-negotiable reward for doing disciplined, high-value work during my CEO Workday\u2122 — so I can be fully present for ${lower}.`

    case "power-down":
      if (/phone|device|screen/i.test(clean))
        return `I end each business day by unplugging completely, creating the space for deep, restorative rest that makes tomorrow's performance possible.`
      if (/reflect|journal/i.test(clean))
        return `I close each day with intentional reflection, acknowledging what I accomplished, what I learned, and what I am grateful for.`
      if (/read|book/i.test(clean))
        return `I transition into rest each evening through reading, stepping away from screens and allowing my mind to decompress and restore.`
      if (/stretch|yoga|meditat|breath/i.test(clean))
        return `I prepare my body and mind for deep rest each evening through movement and stillness, honoring the recovery that high performance requires.`
      if (/prayer|gratitude/i.test(clean))
        return `I close each day in gratitude and prayer, releasing the day with a peaceful heart and welcoming tomorrow with an open one.`
      if (/prepare|tomorrow|plan|clothes/i.test(clean))
        return `I close each day with calm preparation for tomorrow — reviewing my intentions, organizing my space, and entering rest with a clear and peaceful mind.`
      if (/skincare|self.care/i.test(clean))
        return `I honor my body each evening with intentional self-care, transitioning from the business day into the rest that restores me.`
      return `I create a clear and intentional end to every business day by ${lower}, protecting the rest that makes tomorrow's focus, energy, and leadership possible.`

    case "unplug":
      return `At 11:00 PM, my business is Closed For Business\u2122. I am fully unplugged, fully rested, and fully prepared to lead again tomorrow. My commitment to restorative sleep is an investment in every CEO Workday\u2122 yet to come.`

    default:
      return `I am committed to ${lower}.`
  }
}

/* ── Types ──────────────────────────────────────────────────────────────── */
type PlannedActivity = {
  id: string
  activity: string
  minutes: number
  isCustom: boolean
  customActivity: string
}

type InstallState = {
  input: string
  declaration: string | null
  confirmed: boolean
  // Movement Window planner (workout segment)
  plannedActivities: PlannedActivity[]
  // Power Down sleep goal
  plannedSleepHours: number | null
}

const TYPE_LABEL: Record<string, string> = {
  flex: "Flex Time™",
  life: "Daily Non-Negotiable™",
  business: "Business Operating Rule™",
}

const TYPE_INPUT_LABEL: Record<string, string> = {
  flex: "My Flex Time™ Commitment",
  life: "My Daily Non-Negotiable™",
  business: "My Operating Rule™",
}

const TYPE_DECLARATION_LABEL: Record<string, string> = {
  flex: "Your Flex Time™ Declaration",
  life: "Your Daily Non-Negotiable™",
  business: "Your Operating Rule™",
}

const TYPE_COLOR: Record<string, string> = {
  flex: "text-brand-coral",
  life: "text-brand-green",
  business: "text-[#5B835F]",
}

const TYPE_CHIP_COLOR: Record<string, string> = {
  flex: "bg-brand-coral/10 text-brand-coral",
  life: "bg-brand-green/10 text-brand-green",
  business: "bg-[#5B835F]/10 text-[#5B835F]",
}

/* ── Movement Window Planner (Part 3) ───────────────────────────────────── */
function MovementPlanner({
  activities,
  onChange,
}: {
  activities: PlannedActivity[]
  onChange: (activities: PlannedActivity[]) => void
}) {
  const totalMinutes = activities.reduce((sum, a) => sum + a.minutes, 0)

  function addActivity() {
    onChange([
      ...activities,
      {
        id: crypto.randomUUID(),
        activity: MOVEMENT_ACTIVITIES[0],
        minutes: 15,
        isCustom: false,
        customActivity: "",
      },
    ])
  }

  function removeActivity(id: string) {
    onChange(activities.filter((a) => a.id !== id))
  }

  function updateActivity(id: string, patch: Partial<PlannedActivity>) {
    onChange(activities.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  return (
    <div className="mb-6 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-green/10">
        <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">
          For this segment I will transform your intention into an Intention Declaration™ you will live from, in this segment.
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
        {activities.length === 0 && (
          <p className="font-sans text-sm text-brand-ink-soft italic">
            No activities added yet. Add one below, or skip and use the free-text commitment above.
          </p>
        )}

        {activities.map((act, idx) => (
          <div key={act.id} className="flex items-start gap-3 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <label className="sr-only">Activity {idx + 1}</label>
              <select
                value={act.isCustom ? "Other" : act.activity}
                onChange={(e) => {
                  const val = e.target.value
                  updateActivity(act.id, {
                    activity: val,
                    isCustom: val === "Other",
                  })
                }}
                className="w-full rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              >
                {MOVEMENT_ACTIVITIES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {act.isCustom && (
                <input
                  type="text"
                  placeholder="Describe your activity..."
                  value={act.customActivity}
                  onChange={(e) => updateActivity(act.id, { customActivity: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink placeholder:text-brand-ink-soft/50 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                />
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={act.minutes}
                onChange={(e) => updateActivity(act.id, { minutes: Number(e.target.value) })}
                className="rounded-xl border border-brand-blush bg-white px-3 py-2.5 font-sans text-sm text-brand-ink focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
              >
                {[3, 5, 10, 15, 20, 25, 30].map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeActivity(act.id)}
                className="rounded-lg p-2 text-brand-ink-soft hover:text-brand-coral transition-colors"
                aria-label={`Remove activity ${idx + 1}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addActivity}
          disabled={totalMinutes >= 30}
          className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-white px-4 py-2 font-sans text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add Activity
        </button>
      </div>

      {activities.length > 0 && (
        <div className="px-5 py-4 border-t border-brand-green/10 flex items-center justify-between">
          <p className="font-sans text-sm font-bold text-brand-green">
            Today&apos;s Planned Movement™
          </p>
          <span className={`font-sans text-base font-bold ${totalMinutes > 30 ? "text-brand-coral" : "text-brand-green"}`}>
            {totalMinutes} {totalMinutes === 1 ? "Minute" : "Minutes"}
            {totalMinutes > 30 && " — over 30 min"}
            {totalMinutes === 30 && " — perfect"}
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Sleep Planner (Part 5) ─────────────────────────────────────────────── */
function SleepPlanner({
  value,
  onChange,
}: {
  value: number | null
  onChange: (hours: number) => void
}) {
  return (
    <div className="mb-6 rounded-2xl border border-brand-green/20 bg-brand-green/[0.04] overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-green/10">
        <p className="font-sans text-sm font-bold text-brand-green">
          Sleep Planning™
        </p>
        <p className="mt-0.5 font-sans text-xs text-brand-ink-soft">
          How many hours of restorative sleep are you committed to getting each night?
        </p>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          {SLEEP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors ${
                value === opt.value
                  ? "bg-brand-green text-white"
                  : "border border-brand-blush bg-white text-brand-ink-soft hover:border-brand-green/40 hover:text-brand-green"
              }`}
            >
              {opt.label}
              {opt.recommended && (
                <span className={`text-[10px] font-bold uppercase tracking-wide ${value === opt.value ? "text-white/80" : "text-brand-coral"}`}>
                  Recommended
                </span>
              )}
            </button>
          ))}
        </div>
        {value !== null && (
          <div className="rounded-xl border border-brand-green/20 bg-white/60 px-4 py-3">
            <p className="font-sans text-sm font-medium text-brand-ink">
              <strong className="text-brand-green">{value} hours</strong> of restorative sleep committed.{" "}
              {value < 7
                ? "Harmony Lane\u2122 recommends 8 hours for peak executive performance, but honors your current season of life."
                : value === 8
                ? "Harmony Lane\u2122 recommends exactly 8 hours — you are honoring the science of sustainable peak performance."
                : "This commitment supports the deep recovery your CEO performance requires."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function DesignMyWeekClient() {
  const [step, setStep] = useState(0)
  const [states, setStates] = useState<Record<string, InstallState>>(
    Object.fromEntries(
      SEGMENTS.map((s) => [s.id, {
        input: "",
        declaration: null,
        confirmed: false,
        plannedActivities: [],
        plannedSleepHours: null,
      }])
    )
  )
  const [showFlexInfo, setShowFlexInfo] = useState(false)
  const [showLearnMore, setShowLearnMore] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const completionRef = useRef<HTMLDivElement>(null)

  const current = SEGMENTS[step]
  const state = states[current.id]
  const confirmedCount = SEGMENTS.filter((s) => states[s.id].confirmed).length
  const allConfirmed = confirmedCount === SEGMENTS.length

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    if (allConfirmed && completionRef.current) {
      setTimeout(() => {
        completionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 120)
    }
  }, [allConfirmed])

  useEffect(() => {
    setShowLearnMore(false)
    setShowFlexInfo(false)
  }, [step])

  function scrollToCard() {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function goToStep(index: number) {
    const clamped = Math.max(0, Math.min(SEGMENTS.length - 1, index))
    setStep(clamped)
    setTimeout(() => scrollToCard(), 80)
  }

  function handleGenerate() {
    if (!state.input.trim()) return
    const declaration = elevateDeclaration(current.id, state.input)
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration },
    }))
  }

  function handleConfirm() {
    const confirmedDeclaration = states[current.id].declaration ?? ""
    const nextStates = {
      ...states,
      [current.id]: { ...states[current.id], confirmed: true },
    }
    setStates(nextStates)
    try {
      const existing: Record<string, string> = JSON.parse(
        window.sessionStorage.getItem("dmw:v1") ?? "{}"
      )
      existing[current.id] = confirmedDeclaration
      // Persist planned activities and sleep for Progress Intelligence™
      if (current.id === "workout" && nextStates[current.id].plannedActivities.length > 0) {
        window.sessionStorage.setItem(
          "dmw:movement:v1",
          JSON.stringify(nextStates[current.id].plannedActivities)
        )
      }
      if (current.id === "power-down" && nextStates[current.id].plannedSleepHours !== null) {
        window.sessionStorage.setItem(
          "dmw:sleep:v1",
          JSON.stringify({ plannedHours: nextStates[current.id].plannedSleepHours })
        )
      }
      window.sessionStorage.setItem("dmw:v1", JSON.stringify(existing))
    } catch { /* best-effort */ }
    const allNowConfirmed = SEGMENTS.every((s) => nextStates[s.id].confirmed)
    if (allNowConfirmed) {
      try {
        const dmwDecls: Record<string, string> = JSON.parse(
          window.sessionStorage.getItem("dmw:v1") ?? "{}"
        )
        const segmentData: Record<string, { nonNegotiable: string; committed: boolean }> = {}
        SEGMENTS.forEach((s) => {
          segmentData[s.id] = {
            nonNegotiable: nextStates[s.id].declaration ?? nextStates[s.id].input,
            committed: true,
          }
        })
        const sddPayload = {
          data: {
            installedAt: new Date().toISOString(),
            weekly: { intention: "", declaration: "" },
            focusAreas: [],
            segments: segmentData,
          },
        }
        window.sessionStorage.setItem("sdd:v1", JSON.stringify(sddPayload))
        window.sessionStorage.setItem("dmw:v1", JSON.stringify(dmwDecls))
      } catch { /* best-effort */ }
    }
    if (step < SEGMENTS.length - 1) {
      goToStep(step + 1)
    }
  }

  function handleEdit() {
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration: null },
    }))
  }

  const isFlex = current.type === "flex"
  const isWorkout = current.id === "workout"
  const isPowerDown = current.id === "power-down"
  const isUnplug = current.id === "unplug"
  const flexSegment = SEGMENTS.find((s) => s.id === "early-entry")!

  return (
    <div className="min-h-screen bg-brand-cream">
      <CherryBlossomScene variant="design-my-week" minHeight="min-h-[55vh]">
        <CherryBlossomSceneCard title="Design My Week™" time="Approx. 10 mins" scrollPrompt="Design My Week™">
          <p>
            Now we design your eight <strong>Operating Segments™</strong> — the daily structure
            that protects your life <em>and</em> builds your business simultaneously.
          </p>
          <p>
            For each segment, complete the commitment. I will transform it into an{" "}
            <strong>Intention Declaration™</strong> you will live from, starting today.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
              Operating Segments™
            </span>
            <span className="font-sans text-xs font-medium text-brand-ink-soft">
              {confirmedCount} of {SEGMENTS.length} designed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-brand-green/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${(confirmedCount / SEGMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Installed segment chips */}
        {confirmedCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {SEGMENTS.filter((s) => states[s.id].confirmed).map((s) => (
              <span
                key={s.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-xs font-semibold ${TYPE_CHIP_COLOR[s.type]}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                {s.title}
                <span className="ml-0.5 opacity-60">· {TYPE_LABEL[s.type]}</span>
              </span>
            ))}
          </div>
        )}

        {/* Active segment card */}
        {!allConfirmed && (
          <div className="rounded-3xl bg-white border border-brand-blush shadow-lg overflow-hidden">
            <div className="px-8 py-10 sm:px-10">

              {/* Segment meta */}
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <span className={`font-sans text-xs font-bold uppercase tracking-[0.22em] ${TYPE_COLOR[current.type]}`}>
                  {TYPE_LABEL[current.type]}
                </span>
                <span className="flex items-center gap-1 font-sans text-xs font-medium text-brand-ink-soft">
                  <Clock className="h-3 w-3" aria-hidden />
                  {current.time}
                </span>
                {isUnplug && (
                  <span className="rounded-full bg-brand-coral/10 px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-coral">
                    Segment 8
                  </span>
                )}
              </div>

              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-2 text-balance">
                {current.title}
              </h2>
              <p className="font-sans text-[17px] font-medium leading-relaxed text-brand-ink text-pretty mb-6">
                {current.description}
              </p>

              {/* Unplug™ — special CB message */}
              {isUnplug && (
                <div className="mb-6 rounded-2xl border border-brand-coral/20 bg-brand-coral/[0.04] px-5 py-4">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-coral mb-2">
                    Cherry Blossom™ says:
                  </p>
                  <p className="font-sans text-[15px] font-medium leading-relaxed text-brand-ink italic">
                    &ldquo;Your business is now{" "}
                    <strong className="not-italic">Closed For Business™</strong>. Tomorrow deserves
                    a fully restored CEO.&rdquo;
                  </p>
                </div>
              )}

              {/* Flex Time™ info panel */}
              {isFlex && (
                <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 p-5">
                  <button
                    onClick={() => setShowFlexInfo((v) => !v)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={showFlexInfo}
                  >
                    <span className="flex items-center gap-2 font-sans text-sm font-bold text-brand-ink">
                      <Info className="h-4 w-4 text-brand-coral" aria-hidden />
                      How Flex Time™ works
                    </span>
                    <span className="font-sans text-xs font-medium text-brand-ink-soft">
                      {showFlexInfo ? "Hide" : "Show"}
                    </span>
                  </button>
                  {showFlexInfo && (
                    <div className="mt-4 space-y-3 font-sans text-[15px] font-medium leading-relaxed text-brand-ink">
                      <p>
                        <strong className="text-brand-ink">Default:</strong>{" "}
                        {flexSegment.flexNote!.default}
                      </p>
                      <p>
                        <strong className="text-brand-ink">Borrowing:</strong> When life requires
                        it, you may temporarily expand Flex Time™ by borrowing:
                      </p>
                      <ul className="ml-4 space-y-1 list-disc">
                        {flexSegment.flexNote!.borrow.map((b) => (
                          <li key={b.from}>
                            <strong className="text-brand-ink">{b.from}</strong> — {b.max}
                          </li>
                        ))}
                      </ul>
                      <p className="font-semibold text-brand-ink">{flexSegment.flexNote!.max}</p>
                      <p className="rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3 text-brand-ink-soft">
                        <strong className="text-brand-ink">Important:</strong>{" "}
                        {flexSegment.flexNote!.rule}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Borrow note */}
              {"borrowNote" in current && current.borrowNote && (
                <div className="mb-6 flex items-start gap-2 rounded-xl border border-brand-blush bg-brand-cream/50 px-4 py-3">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-brand-ink-soft" aria-hidden />
                  <p className="font-sans text-[13px] font-medium text-brand-ink-soft">
                    <strong className="text-brand-ink">Borrow Flex Time™:</strong>{" "}
                    {(current as typeof SEGMENTS[1]).borrowNote}
                  </p>
                </div>
              )}

              {/* Learn More About This Segment™ */}
              {"learnMore" in current && current.learnMore && (() => {
                const lm = current.learnMore as {
                  purpose: string; whyItMatters: string; science: string
                  businessValue: string; commonMistakes: string[]
                  bestPractices: string[]; cbTip: string
                }
                return (
                  <div className="mb-6 rounded-2xl border border-brand-blush bg-brand-cream/50 overflow-hidden">
                    <button
                      onClick={() => setShowLearnMore((v) => !v)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                      aria-expanded={showLearnMore}
                    >
                      <span className="flex items-center gap-2 font-sans text-sm font-bold text-brand-ink">
                        <Info className="h-4 w-4 text-brand-green" aria-hidden />
                        Learn More About This Segment™
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-brand-ink-soft transition-transform duration-200 ${showLearnMore ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {showLearnMore && (
                      <div className="px-5 pb-6 space-y-5 font-sans text-[15px] leading-relaxed text-brand-ink">
                        <Section heading="Purpose" body={lm.purpose} />
                        <Section heading="Why It Matters" body={lm.whyItMatters} />
                        <Section heading="Scientific Foundation" body={lm.science} />
                        <Section heading="Business Value" body={lm.businessValue} />
                        <div>
                          <p className="font-bold text-brand-ink mb-1.5">Common Mistakes</p>
                          <ul className="space-y-1 list-disc ml-4">
                            {lm.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="font-bold text-brand-ink mb-1.5">Best Practices</p>
                          <ul className="space-y-1 list-disc ml-4">
                            {lm.bestPractices.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-brand-coral/20 bg-brand-coral/5 px-4 py-3">
                          <p className="font-bold text-brand-coral mb-1">Cherry Blossom™ Tip</p>
                          <p>{lm.cbTip}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}

              {/* Movement Planner — workout segment only (Part 3) */}
              {isWorkout && (
                <MovementPlanner
                  activities={state.plannedActivities}
                  onChange={(acts) =>
                    setStates((prev) => ({
                      ...prev,
                      [current.id]: { ...prev[current.id], plannedActivities: acts },
                    }))
                  }
                />
              )}

              {/* Sleep Planner — power-down segment only (Part 5) */}
              {isPowerDown && (
                <SleepPlanner
                  value={state.plannedSleepHours}
                  onChange={(h) =>
                    setStates((prev) => ({
                      ...prev,
                      [current.id]: { ...prev[current.id], plannedSleepHours: h },
                    }))
                  }
                />
              )}

              {/* Examples — Part 2: "Choose one... or create your own." */}
              <div className="mb-6">
                <p className="font-sans text-sm font-semibold text-brand-ink mb-1">
                  {isWorkout ? "Choose an intention below \u2026 or create your own." : "Choose one\u2026 or create your own."}
                </p>
                <p className="font-sans text-xs text-brand-ink-soft mb-3">
                  Click any example to use it, then customize it as you like.
                </p>
                <div className="flex flex-wrap gap-2">
                  {current.examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() =>
                        setStates((prev) => ({
                          ...prev,
                          [current.id]: {
                            ...prev[current.id],
                            input: ex,
                            declaration: null,
                          },
                        }))
                      }
                      className="rounded-full border border-brand-blush bg-white px-3 py-1.5 font-sans text-xs font-medium text-brand-ink-soft transition-colors hover:border-brand-green/40 hover:text-brand-green"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {!state.declaration ? (
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor={`input-${current.id}`}
                      className="block font-sans text-sm font-bold text-brand-ink mb-3"
                    >
                      {TYPE_INPUT_LABEL[current.type]}
                    </label>
                    <div className="flex items-start rounded-xl border border-brand-blush bg-brand-cream/40 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 transition-all overflow-hidden">
                      <span className="shrink-0 px-4 pt-3.5 font-sans text-[15px] font-semibold text-brand-green select-none">
                        I am committed to
                      </span>
                      <textarea
                        id={`input-${current.id}`}
                        value={state.input}
                        onChange={(e) =>
                          setStates((prev) => ({
                            ...prev,
                            [current.id]: {
                              ...prev[current.id],
                              input: e.target.value,
                              declaration: null,
                            },
                          }))
                        }
                        placeholder="completing the sentence..."
                        rows={2}
                        className="flex-1 bg-transparent px-2 py-3.5 font-sans text-[15px] text-brand-ink placeholder:text-brand-ink-soft/40 focus:outline-none resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                            e.preventDefault()
                            handleGenerate()
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={!state.input.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Create My Intention Declaration™
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-brand-green/20 bg-brand-green/5 px-6 py-5">
                    <p className={`font-sans text-xs font-bold uppercase tracking-[0.2em] mb-3 ${TYPE_COLOR[current.type]}`}>
                      {TYPE_DECLARATION_LABEL[current.type]}
                    </p>
                    <p className="font-sans text-lg font-semibold leading-relaxed text-brand-ink text-balance">
                      &ldquo;{state.declaration}&rdquo;
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleConfirm}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 font-sans text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-green-dark"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      Install This™
                    </button>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-transparent px-6 py-3.5 font-sans text-sm font-semibold text-brand-green transition-all hover:bg-brand-green/5"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        {!allConfirmed && (
          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:border-brand-green/30 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous segment"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Previous
              </button>
              <button
                type="button"
                onClick={() => goToStep(0)}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:border-brand-green/30 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Review first segment"
              >
                Review First Segment
              </button>
            </div>
            <div className="flex items-center gap-2">
              {states[current.id].confirmed && step < SEGMENTS.length - 1 && (
                <button
                  type="button"
                  onClick={() => goToStep(step + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-white px-4 py-2.5 font-sans text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              )}
              <button
                type="button"
                onClick={() => goToStep(step + 1)}
                disabled={step === SEGMENTS.length - 1}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-blush bg-white px-4 py-2.5 font-sans text-sm font-semibold text-brand-ink-soft transition-colors hover:border-brand-green/30 hover:text-brand-green disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next segment"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* Segment dot indicators */}
        {!allConfirmed && (
          <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Segment navigation">
            {SEGMENTS.map((seg, i) => (
              <button
                key={seg.id}
                type="button"
                role="tab"
                aria-selected={i === step}
                aria-label={`Go to ${seg.title}`}
                onClick={() => goToStep(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === step
                    ? "w-6 bg-brand-green"
                    : states[seg.id].confirmed
                    ? "w-2 bg-brand-green/50"
                    : "w-2 bg-brand-blush"
                }`}
              />
            ))}
          </div>
        )}

        {/* Completion card */}
        {allConfirmed && (
          <div
            ref={completionRef}
            className="rounded-2xl border border-brand-blush bg-white/70 backdrop-blur-sm shadow-ds overflow-hidden relative"
          >
            <div aria-hidden className="absolute inset-y-0 left-0 w-1 bg-brand-coral/70 rounded-l-2xl" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-blush/50 blur-3xl"
            />
            <div className="relative px-8 py-10 sm:px-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-brand-blush shadow-sm">
                  <img src="/images/logo.png" alt="Cherry Blossom" className="h-full w-full object-cover" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-coral">
                  Cherry Blossom™
                </span>
              </div>
              <p className="font-playfair text-2xl font-bold text-brand-ink mb-1 text-balance">
                Your Work-Life Balance Business Week™ Has Been Designed.
              </p>
              <p className="font-sans text-base font-semibold text-brand-coral mb-5">Congratulations.</p>
              <div className="font-sans text-[16px] leading-relaxed text-brand-ink space-y-4 text-pretty mb-7">
                <p>
                  Beginning Monday, Harmony Lane™ will help you live each{" "}
                  <strong>Operating Segment™</strong>, reinforce your{" "}
                  <strong>Sustainable Operating Practices™</strong>, and gradually install the
                  behaviors that create lasting <strong>Work-Life Harmony™</strong>.
                </p>
                <p>
                  Your <strong>Daily Non-Negotiables™</strong> protect your energy, health,
                  relationships, recovery, and Time Freedom™. Your{" "}
                  <strong>Business Operating Rules™</strong> reduce decision fatigue, eliminate
                  execution friction, and build business assets that create value long after
                  today&apos;s work is finished.
                </p>
                <p>
                  Installation happens through behavior — one Operating Segment™ at a time.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
              >
                Go Live, Lead &amp; Love Today!™
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <div>
      <p className="font-bold text-brand-ink mb-1">{heading}</p>
      <p>{body}</p>
    </div>
  )
}
