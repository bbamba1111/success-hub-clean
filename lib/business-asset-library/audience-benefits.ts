/**
 * Audience Benefits — per Business Asset™ "Why build this?" copy.
 * ---------------------------------------------------------------------------
 * Hand-written, asset-specific benefit statements shown on the CEO Workday
 * card before a founder clicks "Start Building." Each entry answers, in
 * plain language, why THIS specific asset matters — never a generic,
 * reusable paragraph.
 *
 * Deliberately data-only (same philosophy as business-asset-registry.ts):
 * no live generation, no boilerplate. `team` is omitted for assets where a
 * team/partner audience genuinely doesn't apply — every other field is
 * always present, even when the connection to a customer is indirect,
 * because indirect-but-honest is better than fabricated.
 */

export interface AudienceBenefit {
  founder: string
  business: string
  customer: string
  team?: string
}

export const ASSET_AUDIENCE_BENEFITS: Record<string, AudienceBenefit> = {
  // ---------------------------------------------------------------------
  // START HERE
  // ---------------------------------------------------------------------
  "founder-destination": {
    founder: "You get a clear picture of the income, lifestyle, and impact you're actually working toward.",
    business: "Every other decision — pricing, hiring, marketing — has something real to aim at instead of guesswork.",
    customer: "Your business stays focused on the outcome it's meant to deliver, instead of drifting.",
  },
  "founder-onboarding-template": {
    founder: "You stop re-explaining the same things to every new client or team member.",
    business: "Every new relationship starts the same, thoughtful way instead of being improvised each time.",
    customer: "New clients feel welcomed and know what to expect from the very first interaction.",
    team: "Your team has a consistent script to follow, so nothing important gets missed.",
  },
  "business-stage-snapshot": {
    founder: "You get an honest, current picture of where your business actually stands, not where you assume it stands.",
    business: "Every recommendation and next step you get is grounded in your real numbers, not a generic playbook.",
    customer: "Guidance that fits your real stage means you can show up for clients with the right level of capacity.",
  },
  "business-idea-canvas": {
    founder: "Your idea moves out of your head and into something you can actually test.",
    business: "You find out quickly whether the idea has real demand, before you invest a lot of time or money.",
    customer: "The people you want to serve get an offer built around a real problem, not a guess.",
  },
  "desired-work-lifestyle-design": {
    founder: "You define the hours and pace you actually want, instead of letting the business quietly decide for you.",
    business: "Staffing, pricing, and delivery decisions get built around a sustainable pace from the start.",
    customer: "A founder who isn't burning out shows up more consistently for the people they serve.",
  },
  "daily-intention": {
    founder: "You start the day already knowing what actually matters, instead of reacting to whatever comes in first.",
    business: "Your energy goes toward the one thing that moves the business forward today.",
    customer: "Clients get your best, most focused attention on the work that serves them.",
  },

  // ---------------------------------------------------------------------
  // BUILD THE BUSINESS
  // ---------------------------------------------------------------------
  "ideal-client-compass": {
    founder: "You'll know exactly who you want to serve and what to focus on.",
    business: "Your marketing, offers, and sales become sharper and more effective because they're aimed at a real person.",
    customer: "The right people recognize immediately that your business was built to help them.",
  },
  "problem-solution-canvas": {
    founder: "You can explain your value in one breath instead of stumbling to describe what you do.",
    business: "Marketing and sales get easier because the connection between problem and solution is obvious.",
    customer: "Prospects understand quickly why your offer is the right fit for their problem.",
  },
  "offer-design-canvas": {
    founder: "You can price and explain your offer with confidence instead of winging it.",
    business: "A coherent, well-packaged offer is easier to sell and easier to deliver consistently.",
    customer: "Clients know exactly what they're getting, at what price, and how it's delivered.",
  },
  "business-model-canvas": {
    founder: "You can see your whole business on one page instead of only the piece you're heads-down in.",
    business: "Gaps and dependencies that are invisible day-to-day become obvious once you zoom out.",
    customer: "A business that understands its own model delivers more reliably to the people it serves.",
  },
  "positioning-canvas": {
    founder: "You get language ready for why someone should pick you, instead of freezing when asked.",
    business: "You stop competing on price alone and start competing on a reason that actually matters to your ideal client.",
    customer: "Clients get clarity on what makes you different, so they can choose you with confidence.",
  },
  "revenue-model": {
    founder: "You can see exactly what it takes — in price, volume, and frequency — to hit your revenue goal.",
    business: "A revenue goal without a model behind it stays a wish. This turns it into a plan you can execute.",
    customer: "Sustainable revenue means you can keep showing up reliably for the clients you already have.",
  },

  // ---------------------------------------------------------------------
  // SELL THE BUSINESS
  // ---------------------------------------------------------------------
  "discovery-call-blueprint": {
    founder: "You walk into sales calls with a plan instead of winging it and hoping it goes well.",
    business: "Every sales call follows a proven structure, so results stop depending on how confident you feel that day.",
    customer: "Prospects get a call that actually listens to their problem before being sold to.",
  },
  "problem-solution-grid": {
    founder: "You're never caught improvising an answer to a problem you've heard a hundred times before.",
    business: "Sales conversations become more consistent because your best responses are already written down.",
    customer: "Prospects get clear, confident answers instead of a hesitant or inconsistent pitch.",
  },
  "objection-map": {
    founder: "You respond to hesitation with confidence instead of getting flustered in the moment.",
    business: "Fewer deals get lost to objections you could have easily prepared for.",
    customer: "Prospects get honest, thoughtful answers to their real concerns instead of a defensive reaction.",
  },
  "sales-journey": {
    founder: "You can finally see where prospects are quietly dropping off, instead of just feeling like sales are \"slow.\"",
    business: "Fixing the weakest step in your funnel has a direct, visible impact on how many clients you close.",
    customer: "A smoother path from first contact to signed client means less friction and confusion along the way.",
  },
  "referral-blueprint": {
    founder: "You stop hoping referrals happen and start generating them on purpose.",
    business: "Referrals are some of your highest-trust leads — this turns them into a reliable channel, not luck.",
    customer: "Happy clients get an easy, natural way to send people they care about your way.",
  },

  // ---------------------------------------------------------------------
  // MARKET THE BUSINESS
  // ---------------------------------------------------------------------
  "brand-foundation": {
    founder: "You get a foundation to build from, instead of reinventing your voice every time you create something.",
    business: "Everything you make — posts, emails, your website — starts to feel consistently and recognizably yours.",
    customer: "Clients get a brand experience that feels trustworthy because it's consistent everywhere they encounter it.",
  },
  "messaging-map": {
    founder: "You always have your best language ready instead of writing new copy from scratch every time.",
    business: "Your website, social, and sales conversations stay consistent instead of drifting apart.",
    customer: "People hear the same clear, compelling story about what you do, wherever they find you.",
  },
  "content-planning-canvas": {
    founder: "You stop guessing what to post and start creating content that's actually working toward something.",
    business: "Content compounds toward a real goal instead of just filling a calendar.",
    customer: "The content people see from you builds real trust and understanding, not just noise.",
  },
  "campaign-brief": {
    founder: "You launch with a plan instead of scrambling to pull it together the week it goes live.",
    business: "Planned launches convert better and feel less chaotic to run.",
    customer: "Customers experience a clear, well-timed offer instead of a confusing, last-minute push.",
  },
  "conversion-test-canvas": {
    founder: "You learn what actually works from real data, instead of guessing which version is better.",
    business: "Small, structured tests protect you from betting big on the wrong headline, price, or image.",
    customer: "Customers get an experience that's been shaped by what actually resonates with people like them.",
  },

  // ---------------------------------------------------------------------
  // OPERATE THE BUSINESS
  // ---------------------------------------------------------------------
  "business-scorecard": {
    founder: "You know in seconds whether things are on track, instead of running on gut feeling.",
    business: "Problems get caught early, while they're still small and easy to fix.",
    customer: "A business that's watching its own health stays reliable enough to keep serving its clients well.",
  },
  "initiative-brief": {
    founder: "Your projects get a real finish line instead of quietly sprawling or stalling out.",
    business: "Everyone involved is aligned on the same goal, owner, and definition of done.",
    customer: "Projects that actually reach a finish line are more likely to deliver something clients experience.",
    team: "Your team knows exactly what they're building toward and who's responsible for it.",
  },
  "accountability-map": {
    founder: "You can see clearly who owns what, instead of assuming something is covered when it isn't.",
    business: "Nothing important slips through the cracks because ownership was never assigned.",
    customer: "Work that has a clear owner is far less likely to be dropped or delayed for the client waiting on it.",
    team: "Everyone knows their lane, and where the gaps actually are.",
  },
  "sop-playbook-template": {
    founder: "A process finally lives on paper instead of only in your head.",
    business: "Tasks become delegable, so the business doesn't grind to a halt when you're unavailable.",
    customer: "Clients get the same quality of service no matter who on your team is doing the work.",
    team: "Anyone can follow the steps and get consistent results, not just you.",
  },
  "tool-stack-audit": {
    founder: "You see exactly what you're paying for and whether it's actually earning its place.",
    business: "Unused or overlapping subscriptions stop quietly draining cash every month.",
    customer: "Money freed up from unused tools can go toward things that directly improve their experience.",
  },

  // ---------------------------------------------------------------------
  // GROW THE BUSINESS
  // ---------------------------------------------------------------------
  "28-day-focus-plan": {
    founder: "You get real momentum on the one thing that matters, instead of scattering effort across everything.",
    business: "A focused 28 days produces visible progress instead of a long list of half-finished ideas.",
    customer: "Real momentum on what matters most usually shows up as a better experience for the people you serve.",
  },
  "good-better-best-outcome-ladder": {
    founder: "Real progress still counts as a win, even when you fall short of the biggest number.",
    business: "You set a realistic target and a stretch target instead of one all-or-nothing goal.",
    customer: "A team optimizing for a range of good outcomes, not just one bar, tends to make steadier decisions for clients.",
    team: "Everyone knows what \"good\" actually looks like, not just the ideal scenario.",
  },
  "priority-clarity-score": {
    founder: "The right next step becomes obvious instead of foggy when everything feels important.",
    business: "Decisions get based on impact, confidence, and ease — not just whichever idea feels loudest today.",
    customer: "Effort goes toward what will actually help clients most, instead of whatever feels urgent in the moment.",
    team: "Your team can see why one priority won out over another, instead of guessing.",
  },
  "growth-plan": {
    founder: "A revenue goal turns into a real plan with specific, ownable actions instead of just a hope.",
    business: "You can see exactly which levers you're pulling to close the gap between where you are and where you want to be.",
    customer: "Sustainable growth means you can keep serving more people well, not just chase a number.",
  },
  "long-term-horizon-map": {
    founder: "You get to zoom out and steer intentionally instead of letting years pass on autopilot.",
    business: "Near-term decisions stay aligned with where you actually want the business to end up.",
    customer: "A business with clear direction is a more stable, dependable one to be a client of.",
  },

  // ---------------------------------------------------------------------
  // BUILD THE TEAM
  // ---------------------------------------------------------------------
  "role-scorecard": {
    founder: "You know exactly what \"doing a great job\" looks like before you ever post the job.",
    business: "Hiring against a vague description stops leading to mismatched hires.",
    customer: "Clients are served by people hired against a clear standard, not a guess.",
    team: "New hires and existing team members know exactly what they're accountable for.",
  },
  "hiring-plan": {
    founder: "You hire ahead of the need instead of scrambling once you're desperate.",
    business: "Hiring decisions get made on purpose, with a real budget and timeline, not in a panic.",
    customer: "Clients don't feel the strain of a team that's stretched too thin before help arrives.",
    team: "The team grows in the right order, so nobody's stretched past their limit waiting for backup.",
  },
  "interview-scorecard": {
    founder: "You stop hiring on gut feeling alone and start hiring against something concrete.",
    business: "Every candidate gets judged on the same things, which makes hiring more consistent and fair.",
    customer: "Clients end up served by people who were evaluated against real standards, not a hunch.",
    team: "Interviewers agree on what they're actually evaluating, instead of everyone judging something different.",
  },
  "new-hire-onboarding": {
    founder: "A new hire ramps up with confidence instead of being left to guess what's expected.",
    business: "A confusing first few weeks stops costing you productivity — or the hire entirely.",
    customer: "Clients are served by team members who were set up to succeed, not left to figure it out.",
    team: "New team members know exactly what they should be learning and doing at 30, 60, and 90 days.",
  },
  "team-accountability-map": {
    founder: "You can see who owns what across your whole team, not just guess.",
    business: "As the team grows, ownership stays clear instead of quietly becoming unclear or duplicated.",
    customer: "Work that has a clear owner is far less likely to be dropped for the client waiting on it.",
    team: "Everyone's lane is visible to everyone else, so nothing important goes unowned.",
  },
}

/** Look up the audience-specific "Why build this?" benefits for a given asset id. */
export function getAudienceBenefits(assetId: string): AudienceBenefit | undefined {
  return ASSET_AUDIENCE_BENEFITS[assetId]
}
