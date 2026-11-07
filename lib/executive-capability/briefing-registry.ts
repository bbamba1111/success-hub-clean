/**
 * Executive Capability Intelligence™ — Briefing Registry (Phase 10.4)
 * ---------------------------------------------------------------------------
 * 15 briefing topic definitions, each with 5 communication-level variants.
 * All content is pre-authored — no LLM calls at runtime.
 *
 * Each section is concise by design: founders read these in 5 minutes or less.
 */

import type { CommunicationLevel } from "@/lib/founder-learning/types"
import type {
  ExecutiveBriefing,
  ExecutiveBriefingTopicId,
  ExecutiveBriefingTopicMeta,
  ResolvedBriefing,
} from "@/lib/executive-capability/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

type BriefingRecord = Record<ExecutiveBriefingTopicId, ExecutiveBriefing>

// ─── Topic Metadata ───────────────────────────────────────────────────────────

export const BRIEFING_TOPIC_META: ExecutiveBriefingTopicMeta[] = [
  { id: "business-credit",        title: "Business Credit",            capabilityUnlock: "Borrow on your business, not yourself", executiveOwner: "Finance Executive™",     capabilityDimension: "financial-capability",    pointValue: 12 },
  { id: "delegation",             title: "Delegation",                 capabilityUnlock: "Free your highest-value hours",          executiveOwner: "Operations Executive™",  capabilityDimension: "operational-excellence",  pointValue: 10 },
  { id: "hiring",                 title: "Hiring",                     capabilityUnlock: "Build a team that multiplies you",        executiveOwner: "People Executive™",      capabilityDimension: "leadership",              pointValue: 10 },
  { id: "capital-strategy",       title: "Capital Strategy",           capabilityUnlock: "Raise, borrow, or bootstrap strategically", executiveOwner: "Finance Executive™",  capabilityDimension: "financial-capability",    pointValue: 14 },
  { id: "pricing",                title: "Pricing Strategy",           capabilityUnlock: "Price for value, not cost",               executiveOwner: "Sales Executive™",       capabilityDimension: "strategic-thinking",      pointValue: 12 },
  { id: "recurring-revenue",      title: "Recurring Revenue",          capabilityUnlock: "Build predictable monthly income",        executiveOwner: "Sales Executive™",       capabilityDimension: "business-asset-thinking", pointValue: 14 },
  { id: "customer-lifetime-value",title: "Customer Lifetime Value",    capabilityUnlock: "Understand what each customer is worth",   executiveOwner: "Client Success Executive™", capabilityDimension: "customer-experience",  pointValue: 10 },
  { id: "operating-rules",        title: "Operating Rules",            capabilityUnlock: "Run your business on principles",         executiveOwner: "Operations Executive™",  capabilityDimension: "operational-excellence",  pointValue: 8  },
  { id: "sops",                   title: "Standard Operating Procedures", capabilityUnlock: "Systemize everything that repeats",    executiveOwner: "Operations Executive™",  capabilityDimension: "operational-excellence",  pointValue: 10 },
  { id: "ai-delegation",          title: "AI Delegation",              capabilityUnlock: "Delegate to AI like a team member",       executiveOwner: "Innovation Executive™",  capabilityDimension: "ai-leverage",             pointValue: 12 },
  { id: "cash-flow",              title: "Cash Flow Management",       capabilityUnlock: "Never be surprised by your bank account", executiveOwner: "Finance Executive™",     capabilityDimension: "financial-capability",    pointValue: 12 },
  { id: "profit-margins",         title: "Profit Margins",             capabilityUnlock: "Know your real business profitability",   executiveOwner: "Finance Executive™",     capabilityDimension: "financial-capability",    pointValue: 10 },
  { id: "business-banking",       title: "Business Banking",           capabilityUnlock: "Separate your money the right way",       executiveOwner: "Finance Executive™",     capabilityDimension: "financial-capability",    pointValue: 8  },
  { id: "exit-planning",          title: "Exit Planning",              capabilityUnlock: "Build a business worth selling",          executiveOwner: "Strategy Executive™",    capabilityDimension: "strategic-thinking",      pointValue: 14 },
  { id: "wealth-building",        title: "Wealth Building",            capabilityUnlock: "Make your business build lasting wealth",  executiveOwner: "Finance Executive™",     capabilityDimension: "financial-capability",    pointValue: 12 },
]

export function getBriefingTopicMeta(id: ExecutiveBriefingTopicId): ExecutiveBriefingTopicMeta {
  return BRIEFING_TOPIC_META.find((m) => m.id === id) ?? BRIEFING_TOPIC_META[0]
}

// ─── Briefing Registry ────────────────────────────────────────────────────────

const LEVELS: CommunicationLevel[] = ["foundation", "developing", "professional", "executive", "executive-mba"]

/** Helper: create the same structure for all five levels with level-specific text variation. */
function makeBriefing(
  variants: Partial<Record<CommunicationLevel, Partial<import("@/lib/executive-capability/types").ExecutiveBriefingSection>>> &
    { _base: import("@/lib/executive-capability/types").ExecutiveBriefingSection }
): ExecutiveBriefing {
  const result = {} as ExecutiveBriefing
  for (const level of LEVELS) {
    result[level] = { ...variants._base, ...(variants[level] ?? {}) }
  }
  return result
}

// ─── Business Credit ─────────────────────────────────────────────────────────

const businessCreditBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Business credit is a credit profile built in your company's name — separate from your personal credit score. Lenders, vendors, and partners use it to evaluate your business's ability to pay its bills.",
    whyItMatters:
      "Without a business credit profile, you're either using personal credit (risking your personal financial life) or unable to access the capital your business needs to grow. Business credit unlocks equipment financing, vendor net terms, business credit cards, and SBA loans — all without a personal guarantee.",
    whyNow: "Your business context shows you haven't established business credit yet. The earlier you build it, the stronger your profile when you need it most.",
    commonMistakes: [
      "Using personal credit cards for business expenses — this ties your personal credit score to your business performance.",
      "Skipping EIN registration — your Employer Identification Number is the foundation of your business credit identity.",
      "Never opening a dedicated business bank account — this is step one.",
      "Ignoring vendor net terms — net-30 accounts with suppliers are often the fastest way to start building a credit history.",
      "Waiting until you need a loan — business credit takes 6–24 months to build; start now.",
    ],
    executivePerspective:
      "Business credit is infrastructure — not a luxury. Your Finance Executive™ treats it the same way a CFO treats any capital structure decision: build it before you need it, protect it like a strategic asset, and never let it go dormant. A strong business credit profile is worth hundreds of thousands of dollars in future borrowing capacity.",
    fiveMinuteTakeaway:
      "Step 1: Register your business with an EIN (free at IRS.gov). Step 2: Open a dedicated business bank account. Step 3: Get a DUNS number from Dun & Bradstreet (free). Step 4: Open one or two net-30 vendor accounts (Uline, Quill, Grainger). Step 5: Monitor your Dun & Bradstreet, Experian Business, and Equifax Business profiles. Do these five things and you will have more business credit than 90% of small business owners.",
    exploreFurther: [
      "Business Credit Foundations Learning Path™",
      "Financial Architecture™ Executive Insight",
      "The Capital Strategy Briefing™",
    ],
  },
  executive: {
    whatIsIt:
      "Business credit is a formal creditworthiness profile maintained under your EIN with the major commercial credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business). It governs access to non-recourse commercial capital.",
    executivePerspective:
      "At the executive level, business credit strategy intersects with capital structure optimization. The objective is to migrate financing risk from personal guarantee to entity-level creditworthiness — reducing founder liability while expanding borrowing capacity. Your Finance Executive™ manages this alongside cash flow forecasting and debt service ratios.",
  },
  "executive-mba": {
    whatIsIt:
      "Business credit is the commercial credit profile maintained under a legal entity's EIN, tracked by commercial bureaus (D&B Paydex, Experian Intelliscore Plus, Equifax Business Credit Risk Score) and used by lenders to underwrite non-recourse commercial lending.",
    executivePerspective:
      "From a capital markets perspective, business credit is the first layer of a founder's credit stack — establishing the entity's payment behavior record that eventually supports unsecured lines of credit, SBA 7(a) loans, equipment financing, and commercial real estate. It is a prerequisite for any serious growth capital conversation. The Altman Z-Score and DSCR models lenders use downstream are fed by the foundation you build here.",
  },
})

// ─── Delegation ──────────────────────────────────────────────────────────────

const delegationBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Delegation is the practice of assigning tasks, decisions, and responsibilities to others so you can focus on the work only you can do. It is a core leadership skill and the primary lever for scaling a business without burning out.",
    whyItMatters:
      "The founder who cannot delegate is the ceiling of their own business. Every hour you spend on $15/hour tasks is an hour not spent on $1,500/hour decisions. Delegation is how you multiply your effective output without working more hours.",
    whyNow: "Your business context shows delegation as a growth opportunity. This briefing gives you the framework to start today.",
    commonMistakes: [
      "Delegating tasks without delegating outcomes — tell people what result you want, not just what to do.",
      "Delegating and then micro-managing — trust the process you designed.",
      "Not training the person you're delegating to — delegation without context sets people up to fail.",
      "Delegating your Zone of Genius™ work — only delegate tasks below your highest value.",
      "Waiting until you're overwhelmed to start — delegate proactively, not reactively.",
    ],
    executivePerspective:
      "Your Operations Executive™ views delegation not as giving up control, but as precision resource deployment. The goal is to have every task in your business performed by the lowest-cost resource capable of performing it at the required quality level — so your highest-value hours are always deployed on your highest-value work.",
    fiveMinuteTakeaway:
      "Make a list of every task you did this week. Circle the ones only you can do. Put a star next to the ones you enjoy. Everything else without a circle or star is your delegation list. Start with the task that took the most time and costs the least to delegate — often email management, scheduling, or data entry. Document the task, train your delegate, set a clear outcome and deadline, then let go.",
    exploreFurther: [
      "Delegation Mastery™ Learning Path",
      "SOPs Briefing™",
      "Executive Zone of Genius™ Workshop",
    ],
  },
})

// ─── Pricing Strategy ────────────────────────────────────────────────────────

const pricingBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Pricing strategy is how you decide what to charge for your products and services. It involves understanding your costs, your customer's perceived value, your market positioning, and your revenue goals — then setting a price that serves all four.",
    whyItMatters:
      "Pricing is the single highest-leverage variable in your business. A 10% price increase on the same volume of sales creates a 10% revenue increase with zero additional cost. Most founders are underpriced because they anchored to cost rather than value.",
    whyNow: "Pricing is one of your declared growth opportunities. This briefing will help you understand why your current price may be leaving significant revenue on the table.",
    commonMistakes: [
      "Cost-plus pricing — adding a margin to your costs ignores what customers are actually willing to pay.",
      "Competing on price — the lowest price attracts the most demanding customers with the lowest loyalty.",
      "Never raising prices — prices should be reviewed at least annually.",
      "Offering too many pricing options — simplicity converts better than complexity.",
      "Charging less because you feel guilty — price confidence is a founder skill, not a personality trait.",
    ],
    executivePerspective:
      "Your Sales Executive™ frames pricing as a positioning decision, not a math problem. Price communicates value, quality, and who your ideal customer is. Premium pricing signals premium value — and premium customers spend more, complain less, and refer more. The question is never 'what will people pay?' but 'what does the right customer pay for this level of outcome?'",
    fiveMinuteTakeaway:
      "Calculate your current effective hourly rate (total revenue ÷ total hours worked). If it's under $200, you are likely underpriced. Research your three closest competitors' pricing. Identify one tier you could add above your current highest offer. Test a 20–30% price increase on new clients before touching existing client pricing. Measure conversion rate, not just revenue.",
    exploreFurther: [
      "Pricing Strategy™ Executive Insight",
      "Recurring Revenue Briefing™",
      "Customer Lifetime Value Briefing™",
    ],
  },
})

// ─── Recurring Revenue ───────────────────────────────────────────────────────

const recurringRevenueBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Recurring revenue is income that is contractually or behaviorally predictable — subscriptions, retainers, memberships, maintenance agreements, and any offer where the customer pays on a regular schedule without being re-sold.",
    whyItMatters:
      "Recurring revenue transforms your business from a hunting operation (find new customers every month) to a farming operation (serve and grow existing customers). It increases business valuation, reduces revenue volatility, and creates the breathing room to build strategically instead of reactively.",
    whyNow: "Building recurring revenue is one of your declared growth priorities. This briefing gives you the framework to design your first or next recurring revenue stream.",
    commonMistakes: [
      "Building a membership before validating that customers want ongoing value — test first.",
      "Pricing recurring revenue too low because it feels like 'less' — recurring revenue should be priced to reflect the certainty and predictability it provides to you.",
      "Letting churn run without a retention system — track monthly churn from day one.",
      "Not designing the recurring value clearly — customers stay when they see ongoing ROI.",
      "Launching recurring revenue without an offboarding process — cancellations handled well create referrals.",
    ],
    executivePerspective:
      "Your Sales Executive™ treats recurring revenue as a business architecture decision, not a pricing tactic. The compounding effect of reducing churn by even 1% per month is substantial — and founders consistently undervalue it. A business with 70% recurring revenue is worth 3–5x more than the same revenue from one-time transactions.",
    fiveMinuteTakeaway:
      "Identify one service you currently sell as a one-time transaction that could be converted to a recurring model. Package it as a retainer, subscription, or membership. Price it at a slight premium to the one-time equivalent (buyers should pay for the convenience and continuity). Offer it to your 3 best existing clients first. Track month-one churn carefully — it tells you everything about whether the value proposition is landing.",
    exploreFurther: [
      "Recurring Revenue Architecture™ Learning Path",
      "Business Asset Building™ Framework",
      "Customer Lifetime Value Briefing™",
    ],
  },
})

// ─── SOPs ─────────────────────────────────────────────────────────────────────

const sopsBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Standard Operating Procedures (SOPs) are documented step-by-step instructions for completing recurring tasks in your business. They capture how things should be done so the outcome is consistent regardless of who does the work.",
    whyItMatters:
      "Without SOPs, your business runs on tribal knowledge that lives in your head. Every new hire, every delegation, every task you attempt to hand off starts from zero. SOPs convert your experience into business infrastructure that compounds in value over time.",
    whyNow: "Systems and SOPs are on your radar as a growth opportunity. Start with one — the one task you explain most often or that causes the most rework when done wrong.",
    commonMistakes: [
      "Making SOPs too long — an SOP should fit on one page. If it takes longer, break it into stages.",
      "Writing SOPs in the future tense — write them as present-tense instructions: 'Open the CRM. Click New Contact.'",
      "Never updating SOPs after the process changes — assign one person ownership per SOP.",
      "Building SOPs for tasks you should eliminate — don't document what you should automate or stop doing.",
      "Storing SOPs where no one can find them — the best SOP system is the one people actually use.",
    ],
    executivePerspective:
      "Your Operations Executive™ treats every SOP as a unit of delegatable infrastructure. The goal is not documentation for documentation's sake — it's systems that allow you to delegate with confidence and scale without chaos. A business with documented processes is worth more and runs easier than one that depends on institutional memory.",
    fiveMinuteTakeaway:
      "Pick the one task in your business that causes the most confusion, rework, or bottleneck. Record yourself doing it once (Loom, screen recording, or voice memo). Transcribe the key steps. Turn those steps into a numbered list with one action per step. Share it with the person who should own that task. That's your first SOP. Repeat weekly until your top 10 processes are documented.",
    exploreFurther: [
      "Operational Excellence™ Learning Path",
      "Delegation Briefing™",
      "AI Delegation Briefing™",
    ],
  },
})

// ─── AI Delegation ───────────────────────────────────────────────────────────

const aiDelegationBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "AI delegation is the practice of assigning specific, well-defined tasks to AI tools as if they were team members — with clear instructions, defined outputs, and quality review. It extends your capacity without hiring.",
    whyItMatters:
      "Founders who master AI delegation in the next 18 months will have a structural operating advantage over those who don't. The gap between founders who use AI tactically (occasional chatting) and those who use it systematically (AI-powered workflows) is growing rapidly.",
    whyNow: "AI implementation is one of your declared opportunities. This briefing gives you the framework to start assigning work to AI tools today.",
    commonMistakes: [
      "Using AI for tasks where human judgment is required — AI is best for well-defined, repeatable tasks.",
      "Not providing enough context — AI output quality is directly proportional to the quality of your input.",
      "Delegating to AI without reviewing the output — AI makes errors; always quality-check.",
      "Using too many AI tools — pick 2-3 core tools and master them before expanding.",
      "Waiting for the perfect AI workflow — start with one task, refine, then replicate.",
    ],
    executivePerspective:
      "Your Innovation Executive™ approaches AI delegation the same way a COO approaches any automation decision: identify the task, define the standard output, assign it to the lowest-cost capable resource, review the output, and improve the process. AI is not magic — it is an infinitely patient, instantly available, low-cost team member that needs very specific instructions to do great work.",
    fiveMinuteTakeaway:
      "List the three tasks you do weekly that involve writing, research, or summarizing information. Those are your first AI delegation candidates. For each one, write a detailed prompt that explains: (1) the context, (2) the desired output format, (3) the tone and audience, (4) what to avoid. Save the prompt as a template. Run the task through AI, review the output, edit for accuracy. You just got back an hour per week.",
    exploreFurther: [
      "AI Leverage™ Executive Insight",
      "AI Implementation Learning Path™",
      "SOPs Briefing™",
    ],
  },
})

// ─── Cash Flow ───────────────────────────────────────────────────────────────

const cashFlowBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Cash flow is the movement of money in and out of your business. Positive cash flow means more money comes in than goes out. Negative cash flow means you're spending more than you're receiving — regardless of what your profit-and-loss statement shows.",
    whyItMatters:
      "More businesses fail from cash flow problems than from lack of profitability. You can be profitable on paper and still run out of money if the timing of income and expenses doesn't align. Cash flow visibility is survival intelligence.",
    whyNow: "Understanding and managing cash flow is a core financial skill for your current business stage.",
    commonMistakes: [
      "Confusing profit with cash — a sale made on net-30 terms adds to profit immediately but doesn't add to cash for 30 days.",
      "Not forecasting cash flow at least 30 days forward — surprises kill businesses.",
      "Spending based on bank balance rather than a cash flow projection.",
      "Not maintaining a cash reserve — 3 months of operating expenses as a minimum.",
      "Mixing personal and business finances — this destroys your ability to read your actual business cash flow.",
    ],
    executivePerspective:
      "Your Finance Executive™ monitors cash flow with the same discipline applied to a profit and loss statement — except cash flow matters more. Revenue is an opinion; cash is a fact. The goal is to always know, at least 30 days in advance, whether the business will have the cash to meet its obligations. That visibility is what separates reactive founders from strategic ones.",
    fiveMinuteTakeaway:
      "Open a spreadsheet. List every income source and when payments arrive. List every expense and when it's due. Map them on a 30-day calendar. Find the gaps. That's your cash flow map. Do this monthly. Consider moving invoice due dates earlier and negotiating delayed payment on your largest fixed expenses to improve cash timing without changing a single revenue or cost number.",
    exploreFurther: [
      "Financial Architecture™ Executive Insight",
      "Business Banking Briefing™",
      "Profit Margins Briefing™",
    ],
  },
})

// ─── Profit Margins ──────────────────────────────────────────────────────────

const profitMarginsBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Profit margin is the percentage of revenue remaining after subtracting costs. Gross margin subtracts the direct cost of delivering your product or service. Net margin subtracts all expenses, including overhead. Both numbers tell you how efficient your business model is.",
    whyItMatters:
      "High revenue with low margins means you're working hard to create very little wealth. Understanding your margins tells you which offers to double down on, which to reprice, and which to eliminate.",
    whyNow: "Financial clarity is a core skill at your current business stage. This briefing helps you understand the numbers that matter most.",
    commonMistakes: [
      "Focusing only on revenue — a $500K revenue business with 10% net margin generates $50K in profit. A $200K business with 40% margin generates $80K.",
      "Not knowing your gross margin by product or service — some offerings subsidize others.",
      "Ignoring owner compensation when calculating margins — you are a cost of the business.",
      "Letting lifestyle creep raise fixed overhead without raising prices — margins erode slowly.",
      "Not benchmarking margins against your industry — what's good in services is terrible in retail.",
    ],
    executivePerspective:
      "Your Finance Executive™ tracks margin by offer, by client segment, and by delivery channel. The goal is not just to be profitable — it is to understand which parts of your business are most and least efficient, so resources flow toward high-margin activity. Margin improvement is often more valuable than revenue growth because it drops directly to profit.",
    fiveMinuteTakeaway:
      "Calculate your gross margin for your top three offers: (Revenue − Direct Delivery Cost) ÷ Revenue × 100. If you don't know your direct delivery cost, start there — it includes your time, contractor costs, materials, and software specific to that offer. Rank your three offers by gross margin. The highest-margin offer deserves your most marketing attention. The lowest deserves a price increase or elimination.",
    exploreFurther: [
      "Cash Flow Management Briefing™",
      "Pricing Strategy Briefing™",
      "Financial Architecture™ Executive Insight",
    ],
  },
})

// ─── Business Banking ────────────────────────────────────────────────────────

const businessBankingBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Business banking refers to maintaining dedicated financial accounts (checking, savings, merchant processing) in your business's legal name — completely separate from your personal finances.",
    whyItMatters:
      "Mixing personal and business finances creates legal liability exposure, makes tax preparation difficult, and prevents you from accurately reading your business's financial health. It is also the first requirement for building business credit.",
    whyNow: "A dedicated business bank account is the foundation of your financial architecture. If you don't have one yet, this is the highest-priority financial action to take this week.",
    commonMistakes: [
      "Using a personal account for business transactions — even occasionally.",
      "Choosing a bank based on fees alone rather than business services offered.",
      "Not setting up a business savings account alongside checking — the Operating Reserve™ protects cash flow.",
      "Skipping a merchant account — don't take business payments through personal Venmo or PayPal.",
      "Not reviewing business account statements monthly — your bank statement is your primary financial dashboard.",
    ],
    executivePerspective:
      "Your Finance Executive™ treats the business bank account as the nerve center of financial intelligence. Every transaction is data. Clean separation between business and personal finances is not just a bookkeeping preference — it's a legal protection, a tax strategy, and the prerequisite for every capital decision that follows. Open the account the week you register the business. No exceptions.",
    fiveMinuteTakeaway:
      "If you don't have a dedicated business checking account: open one this week. Recommended banks for small businesses: Chase Business Complete Banking, Mercury (online, no fees), or your local credit union. Bring your EIN, business registration documents, and a $25–$100 opening deposit. Once open: route all business income to it, pay all business expenses from it, and never transfer personal funds in except as documented owner contributions.",
    exploreFurther: [
      "Business Credit Briefing™",
      "Financial Architecture™ Executive Insight",
      "Cash Flow Management Briefing™",
    ],
  },
})

// ─── Capital Strategy ────────────────────────────────────────────────────────

const capitalStrategyBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Capital strategy is your plan for how your business will be funded — now and as it grows. It includes decisions about bootstrapping, revenue-based financing, SBA loans, lines of credit, angel investment, venture capital, and equity crowdfunding.",
    whyItMatters:
      "The capital structure you choose determines how much of your company you own, how much debt service you carry, how much risk you assume, and what options you have when opportunities or emergencies arise. Wrong capital choices are expensive to reverse.",
    whyNow: "Capital strategy is one of your declared growth priorities. Understanding your options before you need them is the strategic advantage.",
    commonMistakes: [
      "Taking equity investment when debt financing would suffice — giving up ownership has a permanent cost.",
      "Waiting until you're cash-strapped to seek capital — desperation weakens your negotiating position.",
      "Confusing revenue with fundability — investors and lenders look at margins, growth rate, and recurring revenue, not just topline.",
      "Not understanding the total cost of capital — interest rates, equity dilution, and repayment terms all have long-term costs.",
      "Ignoring SBA loan programs — often the best-rate capital available to small businesses.",
    ],
    executivePerspective:
      "Your Finance Executive™ approaches capital strategy the way a CFO does: matching the type and cost of capital to the use and return of what it funds. Operational working capital is best funded by revolving credit. Equipment is best funded by equipment financing. Growth is often best funded by equity or revenue-based financing. The wrong capital for the right use is still a bad decision.",
    fiveMinuteTakeaway:
      "Identify what you would fund if you had $50K available. Is it working capital, equipment, marketing, or hiring? That tells you what type of capital you need. Match the capital type to the use: (1) Working capital → business line of credit or revenue-based financing. (2) Equipment → equipment loan. (3) Long-term growth → SBA 7(a) or equity. (4) Short-term runway → business credit card or receivables factoring. Don't raise more than you need.",
    exploreFurther: [
      "Business Credit Briefing™",
      "Capital Strategy™ Learning Path",
      "Exit Planning Briefing™",
    ],
  },
})

// ─── Operating Rules ─────────────────────────────────────────────────────────

const operatingRulesBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Operating rules are the non-negotiable principles that govern how your business runs — decisions made once that remove the need to decide the same thing repeatedly. They define what you will and won't do, how you work with clients, and what standards your business holds.",
    whyItMatters:
      "Without operating rules, every situation becomes a decision point. With them, your team and clients know what to expect, your boundaries are respected, and your operating energy is protected. Operating rules are the difference between a business that runs on principles and one that runs on reaction.",
    whyNow: "Operating rules reduce decision fatigue and protect your Human Sustainability™. Now is the right time to define them.",
    commonMistakes: [
      "Having operating rules in your head but never writing them down.",
      "Setting rules you don't actually enforce — rules only have value if they're held.",
      "Creating rules that serve your comfort but not your client experience.",
      "Never revisiting rules as the business grows — what made sense at launch may not make sense at scale.",
      "Confusing preferences with principles — only promote a preference to a rule if you're willing to lose business over it.",
    ],
    executivePerspective:
      "Your Operations Executive™ views operating rules as the constitution of the business. They don't change for individual client requests. They don't bend under short-term pressure. And they communicate to the market exactly who the business is and who it serves. The founder who leads by principle builds a business clients trust — and that trust is compound interest.",
    fiveMinuteTakeaway:
      "Write down five statements that complete this sentence: 'In my business, we always...' Then write five that complete: 'In my business, we never...' Post them somewhere you see them daily. These are your operating rules. Review them quarterly and update as the business evolves. Share them with your team and with high-value clients — they signal professionalism and build trust.",
    exploreFurther: [
      "SOPs Briefing™",
      "CEO Workday Architecture™",
      "Business Context Foundations™",
    ],
  },
})

// ─── Hiring ──────────────────────────────────────────────────────────────────

const hiringBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Hiring is the process of identifying, attracting, evaluating, and selecting people to join your business — as employees, contractors, or fractional support. Done well, it multiplies your capacity without proportionally multiplying your cost or management burden.",
    whyItMatters:
      "The right hire at the right time accelerates your business more than almost any other decision. The wrong hire at the wrong time can set you back six months. Hiring is a high-stakes, high-return decision that deserves a process.",
    whyNow: "Hiring is one of your declared growth priorities. This briefing gives you a framework before you make your first or next hire.",
    commonMistakes: [
      "Hiring out of desperation rather than strategy — reactive hiring produces poor results.",
      "Hiring for skills over character — skills can be trained; attitude and work ethic cannot.",
      "Not writing a clear role definition before posting a job — unclear roles attract the wrong candidates.",
      "Skipping reference checks — they reveal patterns that interviews hide.",
      "Under-paying to save money — underpaying drives turnover, which costs far more than a competitive salary.",
    ],
    executivePerspective:
      "Your People Executive™ approaches every hire as an investment thesis: what is the expected return on this person's salary over 12 months? A $60K hire who generates $300K in revenue or frees $200K of your time has a clear ROI. A hire without a clear revenue or capacity contribution should be deferred. Hire to outcomes, not to org charts.",
    fiveMinuteTakeaway:
      "Before your next hire, write: (1) The specific outcome this role must produce in 90 days. (2) The 3 skills that are non-negotiable. (3) The 3 character traits that must fit your operating culture. (4) What this person will handle that you currently do. (5) What you'll do with the time this hire frees. If you can't answer all five, you're not ready to hire — you're ready to think more clearly about what you actually need.",
    exploreFurther: [
      "Team Building & Leadership™ Learning Path",
      "Delegation Briefing™",
      "Operating Rules Briefing™",
    ],
  },
})

// ─── Customer Lifetime Value ─────────────────────────────────────────────────

const cltBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Customer Lifetime Value (CLV or LTV) is the total revenue a single customer is expected to generate over the full course of their relationship with your business. It accounts for repeat purchases, upsells, renewals, and referrals.",
    whyItMatters:
      "Knowing your CLV tells you how much you can afford to spend to acquire a customer, which customer segments are most valuable, and where to invest in retention. Businesses that understand CLV grow more efficiently because they stop spending equal resources on unequal customers.",
    whyNow: "Understanding the long-term value of your customers changes how you price, market, and serve them.",
    commonMistakes: [
      "Calculating CLV based only on the first purchase — the full value includes all future transactions.",
      "Treating all customers as equal — CLV reveals which 20% of customers generate 80% of lifetime revenue.",
      "Ignoring churn in the CLV calculation — high churn destroys CLV even if acquisition is strong.",
      "Not using CLV to set acquisition budget — if CLV is $3,000, spending $300 to acquire a customer is excellent; spending $2,800 is dangerous.",
      "Measuring CLV annually instead of quarterly — CLV changes as your business model matures.",
    ],
    executivePerspective:
      "Your Client Success Executive™ uses CLV as the north star for every retention and upsell decision. The goal is not just to keep customers — it is to grow their lifetime value deliberately. A 25% improvement in CLV through better onboarding, proactive value delivery, and thoughtful expansion offers often has more bottom-line impact than a 25% increase in new customer acquisition.",
    fiveMinuteTakeaway:
      "Calculate your average CLV: (Average purchase value × purchases per year × average customer lifespan in years). Compare it to your average customer acquisition cost (CAC). The ratio should be at least 3:1 (CLV:CAC). If it's lower, either your prices are too low, churn is too high, or acquisition costs are too high — likely all three. Start with the one most within your control.",
    exploreFurther: [
      "Recurring Revenue Briefing™",
      "Pricing Strategy Briefing™",
      "Client Retention™ Executive Insight",
    ],
  },
})

// ─── Exit Planning ───────────────────────────────────────────────────────────

const exitPlanningBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Exit planning is the process of preparing your business to be sold, transitioned, or passed on — in a way that maximizes its value and serves your personal financial goals. It is not just for founders thinking about selling soon; it is for anyone who wants to build a business that could be sold.",
    whyItMatters:
      "Building a business with exit optionality in mind changes how you build it — in ways that make it more valuable, more systemized, and less dependent on you. Even if you never sell, a business ready to sell is a business ready to scale.",
    whyNow: "Exit planning is a declared growth priority. Understanding what makes a business valuable is essential for building one.",
    commonMistakes: [
      "Waiting until you want to sell to start planning — preparation takes 2–5 years to fully execute.",
      "Building a business that only runs with you in it — buyers discount owner-dependent businesses heavily.",
      "Not understanding your business valuation multiple — varies wildly by industry, recurring revenue %, and growth rate.",
      "Mixing personal and business assets — creates legal complexity that depresses acquisition value.",
      "Having no documented systems, IP, or processes — undocumented businesses are difficult to transfer.",
    ],
    executivePerspective:
      "Your Strategy Executive™ views exit planning as the capstone of business architecture. Every decision about recurring revenue, systems, team, brand, IP, and financial documentation feeds the exit. The founder who builds with an exit in mind builds better regardless of whether they ever sell. Acquirers pay multiples for recurring revenue, transferable systems, and documented processes — exactly the things that make a business excellent to operate.",
    fiveMinuteTakeaway:
      "Calculate a rough valuation of your business today: Annual net profit × your industry multiple (typically 2–5× for service businesses, 4–8× for SaaS, 1–3× for retail). That's your baseline. Now ask: what would double that number in the next 3 years? Usually the answer involves more recurring revenue, documented systems, or a team that runs without you. Pick one and start building it today.",
    exploreFurther: [
      "Capital Strategy Briefing™",
      "Wealth Building Briefing™",
      "Business Valuation™ Executive Insight",
    ],
  },
})

// ─── Wealth Building ─────────────────────────────────────────────────────────

const wealthBuildingBriefing = makeBriefing({
  _base: {
    whatIsIt:
      "Wealth building is the intentional process of converting business income into long-term personal financial assets — real estate, investment accounts, business equity, and other vehicles that grow independently of your active work.",
    whyItMatters:
      "Your business generates income; wealth building converts that income into assets that generate income even when you stop working. Most founders reinvest everything into the business and retire with less wealth than their employees. Intentional wealth building is the answer.",
    whyNow: "Wealth building is one of your declared financial priorities. The sooner you start, the more time compounding has to work.",
    commonMistakes: [
      "Treating the business as the only retirement plan — businesses can fail, be sold, or become illiquid.",
      "Not paying yourself a consistent salary — irregular owner draws make personal wealth building impossible to plan.",
      "Starting wealth building 'after the business is more stable' — that day rarely comes without intention.",
      "Ignoring tax-advantaged accounts — SEP-IRA, Solo 401(k), and HSA are powerful tools for business owners.",
      "Building wealth in a single asset class — diversification protects against industry or market cycles.",
    ],
    executivePerspective:
      "Your Finance Executive™ treats wealth building as a parallel track to business building — not something that starts after the business is 'done.' The goal is to establish a Personal Finance Operating System™ alongside your Business Finance Operating System™: consistent owner pay, automatic investment contributions, tax strategy, and asset diversification. Your business should be funding your wealth, not replacing it.",
    fiveMinuteTakeaway:
      "Set a fixed monthly owner salary — even if it's small. Open a SEP-IRA or Solo 401(k) if you don't have one. Automate a monthly contribution, even $100. Open a business savings account for tax reserves (set aside 25-30% of profit). These four steps create the financial infrastructure that wealth compounds on top of. Do them before your business gets 'bigger.' Wealth building that starts at $50K revenue beats wealth building that starts at $500K revenue by 20 years of compounding.",
    exploreFurther: [
      "Capital Strategy Briefing™",
      "Exit Planning Briefing™",
      "Business Credit Briefing™",
    ],
  },
})

// ─── Assemble Registry ───────────────────────────────────────────────────────

export const EXECUTIVE_BRIEFINGS: BriefingRecord = {
  "business-credit": businessCreditBriefing,
  "delegation": delegationBriefing,
  "hiring": hiringBriefing,
  "capital-strategy": capitalStrategyBriefing,
  "pricing": pricingBriefing,
  "recurring-revenue": recurringRevenueBriefing,
  "customer-lifetime-value": cltBriefing,
  "operating-rules": operatingRulesBriefing,
  "sops": sopsBriefing,
  "ai-delegation": aiDelegationBriefing,
  "cash-flow": cashFlowBriefing,
  "profit-margins": profitMarginsBriefing,
  "business-banking": businessBankingBriefing,
  "exit-planning": exitPlanningBriefing,
  "wealth-building": wealthBuildingBriefing,
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Resolve a briefing topic + level into a fully typed `ResolvedBriefing`.
 * The `triggerContext` explains why this briefing surfaced right now.
 */
export function resolveBriefing(
  topicId: ExecutiveBriefingTopicId,
  level: CommunicationLevel,
  triggerContext: string,
): ResolvedBriefing {
  const briefing = EXECUTIVE_BRIEFINGS[topicId]
  const meta = getBriefingTopicMeta(topicId)
  const section = briefing[level]

  return {
    topicId,
    topicTitle: meta.title,
    executiveOwner: meta.executiveOwner,
    triggerContext,
    section,
    communicationLevel: level,
  }
}
