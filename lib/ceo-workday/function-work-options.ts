import type { CeoBusinessFunction } from "./plan-types"
import { EXPERIENCE_OPTIONS, type ExperienceOptionKey } from "./experience-options"

export type FunctionWorkOption = {
  work: string
  outcome: string
  /** Stable key for options that are tracked by key (Workshops & Webinars). */
  key?: ExperienceOptionKey
  /** Visible for history, but not choosable for new work. */
  retired?: boolean
}

/**
 * Suggested "What needs to happen?" work for each of the Six Business Functions,
 * written for expertise-based businesses (coaching, consulting, speaking,
 * publishing, programs, memberships, advisory and digital products).
 */
export const FUNCTION_WORK_OPTIONS: Partial<Record<CeoBusinessFunction, FunctionWorkOption[]>> = {
  "client-attraction": [
    {
      work: "Write and publish a thought leadership post on LinkedIn.",
      outcome: "Ideal clients see my expertise and engage with the post.",
    },
    {
      work: "Record and publish a short video or podcast episode.",
      outcome: "New audience members discover my work and follow me.",
    },
    {
      work: "Pitch myself to a podcast, stage or event as a speaker.",
      outcome: "A host or event organizer is considering me as a guest.",
    },
    {
      work: "Write and send this week's email newsletter.",
      outcome: "My list hears from me and clicks through to my offer.",
    },
    {
      work: "Create or update a free resource (guide, checklist or quiz).",
      outcome: "New subscribers join my list through the free resource.",
    },
    {
      work: "Reach out to referral partners and past clients for introductions.",
      outcome: "At least one warm introduction to a potential client is in motion.",
    },
    {
      work: "Plan or promote an upcoming webinar, workshop or live event.",
      outcome: "Registrations for the event are coming in.",
    },
    {
      work: "Update my website, bio or profile so it reflects what I offer now.",
      outcome: "Visitors clearly understand who I help and how to work with me.",
    },
  ],
  "sales-conversion": [
    {
      work: "Follow up with leads who have shown interest.",
      outcome: "Interested leads have a clear next step and a reply from me.",
    },
    {
      work: "Hold discovery or sales conversations with potential clients.",
      outcome: "Each conversation ends with a clear yes, no or next step.",
    },
    {
      work: "Write and send a client proposal.",
      outcome: "The proposal is in the client's inbox awaiting a decision.",
    },
    {
      work: "Create or refine my offer and pricing.",
      outcome: "My offer and price are clear and ready to present.",
    },
    {
      work: "Write or update a sales page for my program, course or membership.",
      outcome: "The sales page clearly explains the offer and invites people to join.",
    },
    {
      work: "Send an enrollment email sequence for an open offer.",
      outcome: "Subscribers receive the invitation and start enrolling.",
    },
    {
      work: "Reconnect with past clients about working together again.",
      outcome: "Past clients know what is available and at least one is interested.",
    },
    {
      work: "Prepare and send a speaking, licensing or partnership agreement.",
      outcome: "The agreement is ready for signature.",
    },
  ],
  delivery: [
    {
      work: "Prepare for and hold client coaching or consulting sessions.",
      outcome: "Clients leave the session with progress and clear next steps.",
    },
    {
      work: "Create or update program, course or workshop content.",
      outcome: "The next module or session is ready to deliver.",
    },
    {
      work: "Write or edit a chapter of my book or publication.",
      outcome: "The chapter draft moves forward to the next stage.",
    },
    {
      work: "Prepare and rehearse a keynote, talk or presentation.",
      outcome: "The talk is ready to deliver with confidence.",
    },
    {
      work: "Deliver client deliverables (report, plan, strategy or recommendations).",
      outcome: "The client has received the deliverable on time.",
    },
    {
      work: "Onboard a new client.",
      outcome: "The new client knows what to expect and is ready to begin.",
    },
    {
      work: "Engage my community or membership with new content or a live session.",
      outcome: "Members participate and get value from the community this week.",
    },
    {
      work: "Collect client feedback, results or testimonials.",
      outcome: "I have feedback and evidence of the results clients are getting.",
    },
  ],
  operations: [
    {
      work: "Review finances: send invoices, check payments and expenses.",
      outcome: "Invoices are sent and I know where the money stands.",
    },
    {
      work: "Clear and organize my email inbox.",
      outcome: "Important messages are answered and nothing urgent is missed.",
    },
    {
      work: "Organize my calendar and schedule upcoming client sessions.",
      outcome: "My week is scheduled and protected time stays protected.",
    },
    {
      work: "Check in with my team, contractors or virtual assistant.",
      outcome: "Everyone knows their priorities and what they are responsible for.",
    },
    {
      work: "Update client records and my customer list.",
      outcome: "Client records are current and easy to find.",
    },
    {
      work: "Handle contracts, agreements and business paperwork.",
      outcome: "Outstanding paperwork is complete or sent for signature.",
    },
    {
      work: "Review this week's business numbers and progress toward goals.",
      outcome: "I know what is working and what needs attention.",
    },
    {
      work: "Organize files, documents and digital assets.",
      outcome: "Business files are organized and easy to find.",
    },
  ],
  "operations-design": [
    {
      work: "Document a process I repeat so someone else can do it.",
      outcome: "A written, step-by-step process exists for that task.",
    },
    {
      work: "Decide what to delegate and to whom.",
      outcome: "I have a clear list of work to hand off and who will take it.",
    },
    {
      work: "Set up an automation or AI tool to handle a repeated task.",
      outcome: "The task runs with less of my time and attention.",
    },
    {
      work: "Redesign my client onboarding or delivery process.",
      outcome: "Clients move through the process more smoothly and with less effort from me.",
    },
    {
      work: "Create templates for emails, proposals or client materials.",
      outcome: "Reusable templates save time on future work.",
    },
    {
      work: "Review my offers and remove or simplify what is draining time.",
      outcome: "My business is simpler and focused on what works best.",
    },
    {
      work: "Choose or set up a business tool (scheduling, payments, customer records).",
      outcome: "The tool is set up and tested for how I work.",
    },
    {
      work: "Redesign my week so business work fits inside my protected hours.",
      outcome: "My schedule supports work-life balance and my business priorities.",
    },
  ],
  "trust-experiences": EXPERIENCE_OPTIONS.map((o) => ({ key: o.key, work: o.work, outcome: o.outcome })),
}

/**
 * Work that used to live under another function. It stays visible (so history
 * still reads correctly) but can't be chosen again; the server refuses it too.
 */
export const RETIRED_WORK_OPTIONS: Array<{ work: string; from: CeoBusinessFunction; movedTo: CeoBusinessFunction }> = [
  {
    work: "Plan or promote an upcoming webinar, workshop or live event.",
    from: "client-attraction",
    movedTo: "trust-experiences",
  },
]

export function isRetiredWorkTitle(title: string): boolean {
  const t = title.trim().toLowerCase()
  return RETIRED_WORK_OPTIONS.some((r) => r.work.toLowerCase() === t)
}

export function workOptionsFor(fn: CeoBusinessFunction | null | undefined): FunctionWorkOption[] {
  if (!fn) return []
  return (FUNCTION_WORK_OPTIONS[fn] ?? []).map((o) => (isRetiredWorkTitle(o.work) ? { ...o, retired: true } : o))
}
