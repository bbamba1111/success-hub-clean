"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react"
import { CherryBlossomScene, CherryBlossomSceneCard } from "@/components/cherry-blossom/cherry-blossom-scene"

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
      "opening my heart to gratitude before anything else",
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
      science: "The Reticular Activating System (RAS) in the brain acts as a filter — when you clearly visualize and emotionally embody your desired outcomes, the RAS begins directing your attention toward opportunities that match. Behavioral science research (Duhigg, Clear, Dispenza) confirms that emotional conditioning and consistent repetition rewire identity at the neurological level. Nervous system regulation through gratitude and visualization also lowers cortisol, improving executive decision-making throughout the day.",
      businessValue: "Founders who protect Morning GIV\u2022EN\u2122 report higher focus during their CEO Workday\u2122, clearer decision-making, stronger sense of purpose, and reduced entrepreneurial isolation. This is not indulgence — it is operational preparation. The 30-minute borrow buffer ensures you never lose this practice entirely, even on demanding days.",
      commonMistakes: [
        "Checking email or social media before completing Morning GIV\u2022EN\u2122.",
        "Skipping the ritual when time is tight — that is exactly when you need it most.",
        "Rushing through the steps without genuine emotional engagement.",
        "Making the ritual so complex it becomes unsustainable over time.",
      ],
      bestPractices: [
        "Move through each GIV\u2022EN\u2122 element in sequence: Gratitude \u2192 Invitation \u2192 Vision \u2192 Emotional Embodiment \u2192 Nurture.",
        "Wear comfortable clothing after Flex Time\u2122 so you flow directly into the Workout Window\u2122 at 10:30 AM.",
        "Complete your ritual before opening any device-based communication.",
        "Depth of engagement matters more than duration. 30 focused minutes outperforms 90 distracted ones.",
      ],
      cbTip: "The GIV\u2022EN\u2122 framework aligns your spirit and your science simultaneously. When you open with Gratitude and invite your Creator into co-creation, then see and feel your desired life through Vision & Visualization and Emotional Embodiment, you are not just preparing for the day — you are becoming the founder who already lives it.",
    },
  },
  {
    id: "workout",
    title: "Workout Window\u2122",
    time: "10:30 AM – 11:00 AM",
    type: "life" as const,
    description:
      "Your protected 30-minute Movement Window\u2122 — built directly into your Work-Life Balance Business Day\u2122. Non-negotiable for sustained energy, mental clarity, and long-term health.",
    examples: [
      "a 3-minute stretch to open my body for the day",
      "a 5-minute walk to reset my energy",
      "a 10-minute mobility session for flexibility and recovery",
      "a 15-minute yoga flow to ground my mind and body",
      "a 20-minute strength circuit to build physical resilience",
      "a 25-minute brisk walk for cardiovascular health",
      "a full 30-minute workout of my choice",
    ],
    learnMore: {
      purpose: "The Workout Window\u2122 is your protected 30-minute Movement Window\u2122 — a non-negotiable block built into the Work-Life Balance Business Day\u2122 from 10:30 AM to 11:00 AM. Examples never exceed 30 minutes. A 3-minute stretch counts. A full 30-minute workout counts. What matters is that you move.",
      whyItMatters: "Exercise is the single highest-ROI Sustainable Operating Practice\u2122 available to a founder. It directly improves cognitive performance, emotional regulation, stress resilience, hormonal balance, and sleep quality — all of which are prerequisites for high-level executive decision-making during your CEO Workday\u2122.",
      science: "Neuroscience research (Ratey, Harvard Medical School) demonstrates that aerobic exercise increases BDNF (Brain-Derived Neurotrophic Factor), which accelerates learning, improves memory consolidation, and enhances creative problem-solving. Even 15\u201330 minutes of moderate movement produces measurable cognitive benefits that last 4\u20136 hours — directly improving your 1:00 PM CEO Workday\u2122 performance.",
      businessValue: "Founders who exercise consistently report 23% higher self-reported productivity and significantly reduced decision fatigue during their CEO Workday\u2122. Your Workout Window\u2122 is not separate from your business — it is the engine that powers it. Protecting this 30-minute window is one of the highest-leverage decisions in your entire operating day.",
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
      cbTip: "Physical movement is not a reward for completing your work — it is preparation for doing your best work. The 30 minutes you invest in your body at 10:30 AM returns hours of enhanced cognitive performance during your CEO Workday\u2122.",
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
      science: "Research in chronobiology confirms a natural post-lunch cognitive dip between 1:00 PM and 3:00 PM when blood glucose regulation causes reduced alertness. A genuine midday break with intentional nutrition and movement counteracts this dip, improving afternoon performance by 20\u201335%. Stepping away also activates the brain\u2019s default mode network — the neural system responsible for creative insight and strategic thinking — making the CEO Workday\u2122 more productive and inventive. Consistent behavioral repetition of this practice builds it into an automatic operating default within 21\u201366 days.",
      businessValue: "Founders who take a genuine lunch break report higher afternoon focus, better quality decisions during their CEO Workday\u2122, and lower rates of late-day exhaustion. This is one of the most underrated Sustainable Operating Practices\u2122 available. The Progress Principle confirms that small protected recovery windows compound into dramatically higher creativity and motivation over a week, month, and year.",
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
      science: "Cal Newport\u2019s research on Deep Work demonstrates that knowledge workers are capable of only 4 hours of peak cognitive performance per day. Parkinson\u2019s Law confirms that work expands to fill the time available — a defined 4-hour window forces prioritization and eliminates low-leverage activity. Flow state research (Csikszentmihalyi) demonstrates that full immersion in high-challenge, high-skill work produces exponential output. The Progress Principle (Amabile & Kramer) confirms that 1% daily improvement compounds into extraordinary results — and that protecting meaningful daily progress is the strongest driver of founder motivation and engagement.",
      businessValue: "Business Operating Rules\u2122 installed during the CEO Workday\u2122 reduce execution friction, improve decision quality, increase AI leverage, strengthen delegation, and build compounding business assets. Replacing hustle culture with a disciplined 4-hour CEO Workday\u2122 and proven Sustainable Operating Practices\u2122 is not a compromise in ambition — it is the sustainable transformation model that allows founders to build larger, more leveraged businesses without sacrificing health, relationships, or Time Freedom\u2122.",
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
      whyItMatters: "Founders who never fully disconnect report higher burnout, relationship deterioration, declining creative capacity, and accelerated entrepreneurial isolation. Time Freedom\u2122 is not a privilege earned by finishing work — it is a non-negotiable component of sustainable high performance and the direct antidote to hustle culture. Accountability to this practice, and community connection within Harmony Lane\u2122, are what sustain it over time.",
      science: "Research in recovery psychology (Sonnentag & Fritz) demonstrates that psychological detachment from work during off-hours is the strongest predictor of next-day job performance, engagement, and creativity. Entrepreneurs who protect non-work time outperform those who do not over a 12-month horizon. Weekly reflection and monthly recalibration within Time Freedom\u2122 also activate the brain\u2019s default mode network — producing the strategic insights and creative breakthroughs that are impossible in reactive work mode. Behavioral repetition of this boundary builds it into an automatic operating default through habit formation and identity-based behavior change.",
      businessValue: "Time Freedom\u2122 is the entire purpose of the Work-Life Balance Business Week\u2122. Every CEO Workday\u2122, every Operating Rule\u2122, every AI leverage and delegation decision is in service of expanding and protecting this segment. It is not the reward — it is the goal. A business that consistently delivers Time Freedom\u2122 is a business that is working. The New 9-to-5 & Nighttime Non-Negotiable SOPs\u2122 exist precisely to protect this outcome.",
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
    title: "Power Down & Unplug\u2122",
    time: "10:00 PM – 11:00 PM \u2022 Closed at 11:00 PM",
    type: "life" as const,
    description:
      "The intentional close to every Work-Life Balance Business Day\u2122. Power Down\u2122 begins at 10:00 PM. Unplug\u2122 at 11:00 PM. The business day officially closes and does not reopen until 7:00 AM. Founders may Power Down earlier — Harmony Lane\u2122 does not have a minimum. But the standard operating rhythm closes at 11:00 PM.",
    examples: [
      "beginning my Power Down\u2122 ritual at 10:00 PM every night",
      "placing all devices out of reach by 10:00 PM",
      "spending 15 minutes in evening reflection and gratitude",
      "reading a book instead of scrolling before sleep",
      "stretching to release the day from my body",
      "reviewing my intentions for tomorrow before I rest",
    ],
    learnMore: {
      purpose: "Power Down & Unplug\u2122 is the intentional close to every Work-Life Balance Business Day\u2122. Power Down\u2122 begins at 10:00 PM. Unplug\u2122 is complete by 11:00 PM. The Work-Life Balance Business Day\u2122 is officially Closed For Business\u2122 and does not reopen until 7:00 AM. Founders may choose to Power Down earlier — Harmony Lane\u2122 encourages it — but the standard operating rhythm is 10:00 PM to 11:00 PM.",
      whyItMatters: "Sleep quality is the single most important recovery variable for cognitive performance. Founders who do not have a deliberate wind-down practice experience poorer sleep onset, lighter sleep stages, and reduced next-day executive function. Power Down\u2122 is the Sustainable Operating Practice\u2122 that protects sleep quality and makes every other segment in the operating day possible.",
      science: "Harvard sleep research (Walker, \u2018Why We Sleep\u2019) confirms that blue light exposure within 90 minutes of sleep onset reduces melatonin production by up to 50%. Cognitive arousal — from email, work content, or social media — keeps the prefrontal cortex activated and delays sleep onset by 30\u201360 minutes on average. Nervous system regulation and hormonal rebalancing also require consistent sleep onset timing to maintain cortisol and melatonin cycles.",
      businessValue: "A well-rested founder makes better decisions, thinks more creatively, manages emotions more skillfully, and sustains high performance over time. Power Down\u2122 is not a soft habit — it is the physiological foundation of the entire Work-Life Balance Business Day\u2122. Protect it the same way you protect your CEO Workday\u2122.",
      commonMistakes: [
        "Bringing your phone to bed and scrolling after 10:00 PM.",
        "Checking email or reviewing work in the Power Down\u2122 window.",
        "Not having a defined close of business ritual — the mind stays \u2018on\u2019 without one.",
        "Allowing the Power Down\u2122 window to start later and later each night.",
      ],
      bestPractices: [
        "Create a clear \u2018close of business\u2019 ritual at 10:00 PM — a physical or symbolic act that signals the end of the business day.",
        "Place all devices out of reach by 10:00 PM. Unplug\u2122 means fully unplugged by 11:00 PM.",
        "End with something that feeds the mind gently: reading, reflection, or gratitude.",
        "If you choose to Power Down earlier, honor it. Earlier is always encouraged.",
      ],
      cbTip: "The way you end today determines how you begin tomorrow. Power Down\u2122 is not the end of the operating cycle — it is the preparation for the next one. A 7:00 AM reopening becomes effortless when you are fully unplugged by 11:00 PM.",
    },
  },
]

/* ── Intention Declaration generator ───────────────────────────────────── */
function elevateDeclaration(segmentId: string, rawInput: string): string {
  const input = rawInput.trim()
  if (!input) return ""

  // Strip leading "I am committed to " if the founder typed the full phrase
  const clean = input
    .replace(/^I am committed to\s+/i, "")
    .replace(/\.$/, "")
    .trim()

  const lower = clean.toLowerCase()

  // Segment-aware elevation patterns
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

    case "workout":
      if (/walk/i.test(clean))
        return `I strengthen my body and renew my energy through a daily walk, honoring my health as the non-negotiable foundation of everything I build.`
      if (/yoga/i.test(clean))
        return `I restore my body and center my mind through a daily yoga practice, arriving at each day flexible, grounded, and energized.`
      if (/strength|lift|weight/i.test(clean))
        return `I build physical strength daily, knowing that a strong body creates the sustained energy and resilience my vision requires.`
      if (/danc/i.test(clean))
        return `I move my body joyfully through dance, celebrating the energy and vitality that fuels everything I create.`
      if (/cycl|bike/i.test(clean))
        return `I build endurance and mental clarity through cycling, arriving at every CEO Workday\u2122 with energy to execute at my highest level.`
      if (/stretch/i.test(clean))
        return `I honor my body with a daily stretching practice, maintaining the flexibility and recovery that high performance demands.`
      return `I protect my body through ${lower}, treating my physical health as the irreplaceable engine that powers everything I am building.`

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
      if (/phone|device|screen|9\s*pm|10\s*pm|11\s*pm/i.test(clean))
        return `I end each business day by unplugging completely, creating the space for deep, restorative rest that makes tomorrow's performance possible.`
      if (/reflect|journal/i.test(clean))
        return `I close each day with intentional reflection, acknowledging what I accomplished, what I learned, and what I am grateful for.`
      if (/read|book/i.test(clean))
        return `I transition into rest each evening through reading, stepping away from screens and allowing my mind to decompress and restore.`
      if (/stretch|yoga|meditat/i.test(clean))
        return `I prepare my body and mind for deep rest each evening through movement and stillness, honoring the recovery that high performance requires.`
      if (/prepare|tomorrow|plan/i.test(clean))
        return `I close each day with calm preparation for tomorrow — reviewing my intentions, organizing my space, and entering rest with a clear and peaceful mind.`
      return `I create a clear and intentional end to every business day by ${lower}, protecting the rest that makes tomorrow's focus, energy, and leadership possible.`

    default:
      return `I am committed to ${lower}.`
  }
}

/* ── Types ──────────────────────────────────────────────────────────────── */
type InstallState = {
  input: string
  declaration: string | null
  confirmed: boolean
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

/* ── Component ──────────────────────────────────────────────────────────── */
export function DesignMyWeekClient() {
  const [step, setStep] = useState(0)
  const [states, setStates] = useState<Record<string, InstallState>>(
    Object.fromEntries(
      SEGMENTS.map((s) => [s.id, { input: "", declaration: null, confirmed: false }])
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

  // Scroll to top on initial mount so the hero is always visible first
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  // Auto-scroll to completion card after final install
  useEffect(() => {
    if (allConfirmed && completionRef.current) {
      setTimeout(() => {
        completionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 120)
    }
  }, [allConfirmed])

  // Collapse Learn More between segments
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
    // 1. Mark confirmed immediately so chips refresh
    setStates(nextStates)
    // 2. Persist declaration to dmw:v1 so Live Today™ Practice™ panels can read it
    try {
      const existing: Record<string, string> = JSON.parse(
        window.sessionStorage.getItem("dmw:v1") ?? "{}"
      )
      existing[current.id] = confirmedDeclaration
      window.sessionStorage.setItem("dmw:v1", JSON.stringify(existing))
    } catch { /* best-effort */ }
    // 3. If this confirmation completes the week, write sdd:v1 so hasDesignedWeek becomes true
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
        // Ensure dmw:v1 is complete at this point
        window.sessionStorage.setItem("dmw:v1", JSON.stringify(dmwDecls))
      } catch { /* best-effort */ }
    }
    // 4. Advance step (unless last)
    if (step < SEGMENTS.length - 1) {
      goToStep(step + 1)
    }
    // allConfirmed useEffect handles scroll to completion
  }

  function handleEdit() {
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...prev[current.id], declaration: null },
    }))
  }

  const isFlex = current.type === "flex"
  const flexSegment = SEGMENTS.find((s) => s.id === "early-entry")!

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Scene header */}
      <CherryBlossomScene variant="pond" minHeight="min-h-[55vh]">
        <CherryBlossomSceneCard title="Design My Week™" time="Approx. 10 mins">
          <p>
            Now we install your seven <strong>Operating Segments™</strong> — the daily structure
            that protects your life <em>and</em> builds your business simultaneously.
          </p>
          <p>
            For each segment, complete the commitment. I will transform it into an{" "}
            <strong>Intention Declaration™</strong> you will live from, starting today.
          </p>
        </CherryBlossomSceneCard>
      </CherryBlossomScene>

      {/* Installation card */}
      <div className="w-full max-w-4xl mx-auto px-4 py-10" ref={cardRef}>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-green">
              Operating Segments™
            </span>
            <span className="font-sans text-xs font-medium text-brand-ink-soft">
              {confirmedCount} of {SEGMENTS.length} installed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-brand-green/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-green transition-all duration-500"
              style={{ width: `${(confirmedCount / SEGMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Installed segment chips — all confirmed segments always shown */}
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
              </div>

              <h2 className="font-playfair text-3xl font-bold text-brand-ink mb-2 text-balance">
                {current.title}
              </h2>
              <p className="font-sans text-[17px] font-medium leading-relaxed text-brand-ink text-pretty mb-6">
                {current.description}
              </p>

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

              {/* Borrow note for Morning GIV•EN and Healthy Hybrid Lunch */}
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

              {/* Examples */}
              <div className="mb-6">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-ink-soft mb-2">
                  Examples
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
                /* ── Input state ── */
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
                /* ── Declaration state ── */
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

        {/* Prev / Next / Back / Continue navigation */}
        {!allConfirmed && (
          <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
            {/* Left side — Previous / Back */}
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
                aria-label="Back to first segment"
              >
                Back to Start
              </button>
            </div>

            {/* Right side — Next / Continue */}
            <div className="flex items-center gap-2">
              {/* Jump to a confirmed segment */}
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

        {/* Completion — Cherry Blossom confirmation. Shown after all confirmed. */}
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
                Your Work-Life Balance Business Week™ is now designed.
              </p>
              <p className="font-sans text-base font-semibold text-brand-coral mb-5">Congratulations.</p>
              <div className="font-sans text-[16px] leading-relaxed text-brand-ink space-y-4 text-pretty mb-7">
                <p>
                  Your <strong>Daily Non-Negotiables™</strong> and{" "}
                  <strong>Sustainable Operating Practices™</strong> will protect your health,
                  relationships, recovery, and Time Freedom™ throughout the week.
                </p>
                <p>
                  Your <strong>Business Operating Rules™</strong> will reduce execution friction,
                  improve decision-making, increase AI leverage, strengthen delegation, and help you
                  build business assets that continue creating value long after today&apos;s work is
                  finished.
                </p>
                <p>
                  Together they create the business you intended to build — a business that supports
                  your life instead of consuming it.
                </p>
              </div>
              <Link
                href="/live-today"
                className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-sans text-sm font-bold text-white shadow-ds transition-colors hover:bg-brand-green-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30"
              >
                Now Go Live, Lead &amp; Love Today!™
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
