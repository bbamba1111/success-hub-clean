/**
 * Thought Leadership Studio™ — Format Registry
 * ---------------------------------------------------------------------------
 * The Business Template Library™ for founder-facing thought leadership and
 * communications work: keynote speeches, press releases, Op-Eds, PSAs, and
 * any other piece a founder needs to write or research with AI.
 *
 * Each format is a TEMPLATE — a stable code/ID, the AI Executive™ who owns
 * that kind of work, and the ordered Steps the founder fills in to produce
 * it. When a founder needs something the library does not already contain,
 * the assigned Executive generates a new template on the fly
 * (see app/api/thought-leadership/generate-template/route.ts) and it is
 * saved with a freshly-minted code so it becomes part of the library too
 * (see lib/thought-leadership/template-store.ts).
 *
 * Executive assignment maps to the permanent roster in
 * lib/executive-team/executive-registry.ts:
 *   - "growth"          → Growth Executive™ (speaking, publishing,
 *                          thought leadership).
 *   - "marketing-brand" → Marketing & Brand Executive™ (PR, media, PSAs).
 */

export type ThoughtLeadershipMode = "write-with-ai" | "research-with-ai"

export type ThoughtLeadershipCategory = "speaking" | "publishing" | "pr-media" | "social"

export interface ThoughtLeadershipFormat {
  /** Stable, human-readable Template Code™ (e.g. "TL-KEYNOTE"). */
  code: string
  /** Display name (e.g. "Keynote Speech"). */
  name: string
  /** Grouping used for executive emphasis and UI ordering. */
  category: ThoughtLeadershipCategory
  /** Owning executive id from lib/executive-team/executive-registry.ts. */
  executiveId: string
  /** One-line "what is this". */
  whatIsThis: string
  /** Why it moves the business forward. */
  whyItMatters: string
  /** The ordered Steps the founder fills in to produce the piece. */
  steps: string[]
  /** True for the built-in library; false for AI-generated custom templates. */
  builtIn: boolean
}

export const THOUGHT_LEADERSHIP_FORMATS: ThoughtLeadershipFormat[] = [
  {
    code: "TL-KEYNOTE",
    name: "Keynote Speech",
    category: "speaking",
    executiveId: "growth",
    whatIsThis: "A signature keynote that delivers one transformational idea to a live audience.",
    whyItMatters: "A great keynote positions you as the authority and creates opportunities long after you leave the stage.",
    steps: [
      "The one big idea — the single transformation this keynote delivers",
      "Who is in the room and what they are struggling with right now",
      "The opening hook — the story or moment that earns their attention",
      "The 3 core points that carry the argument",
      "The signature story or evidence that makes it undeniable",
      "The call to action — what you want them to do or believe when you finish",
    ],
    builtIn: true,
  },
  {
    code: "TL-TALK",
    name: "Signature Talk",
    category: "speaking",
    executiveId: "growth",
    whatIsThis: "Your repeatable signature talk — the one presentation you can give anywhere.",
    whyItMatters: "A signature talk turns every speaking opportunity into consistent positioning and lead flow.",
    steps: [
      "The promise — what the audience walks away able to do",
      "Your positioning story — why you are the one to give this talk",
      "The framework or model at the center of the talk",
      "The 3 to 5 teaching points and the example for each",
      "The invitation — the next step you offer the audience",
    ],
    builtIn: true,
  },
  {
    code: "TL-OPED",
    name: "Op-Ed",
    category: "publishing",
    executiveId: "growth",
    whatIsThis: "A persuasive opinion piece that takes a clear stance on an issue you care about.",
    whyItMatters: "A well-placed Op-Ed builds authority and puts your point of view into the public conversation.",
    steps: [
      "The argument — the clear position you are taking in one sentence",
      "Why now — the timely news hook or moment that makes this urgent",
      "The evidence and examples that support your position",
      "The strongest counter-argument and your response to it",
      "The closing — what should change and the reader's role in it",
    ],
    builtIn: true,
  },
  {
    code: "TL-ARTICLE",
    name: "Thought Leadership Article",
    category: "publishing",
    executiveId: "growth",
    whatIsThis: "A long-form article that shares an original insight or framework with your audience.",
    whyItMatters: "Original insight published consistently is how expertise compounds into authority.",
    steps: [
      "The original insight — the idea only you can offer this clearly",
      "The reader and the belief you want to shift",
      "The opening that makes the problem real",
      "The body — the sections or steps that build your case",
      "The takeaway and the action the reader should take next",
    ],
    builtIn: true,
  },
  {
    code: "TL-LINKEDIN",
    name: "LinkedIn Thought Leadership Post",
    category: "social",
    executiveId: "growth",
    whatIsThis: "A short, high-signal LinkedIn post that shares a point of view and invites engagement.",
    whyItMatters: "Consistent, opinionated posts keep you visible to the exact people you want to reach.",
    steps: [
      "The hook — the first line that stops the scroll",
      "The point of view you are sharing",
      "The story, lesson, or data that backs it up",
      "The one clear takeaway",
      "The question or invitation that sparks conversation",
    ],
    builtIn: true,
  },
  {
    code: "TL-PRESS",
    name: "Press Release",
    category: "pr-media",
    executiveId: "marketing-brand",
    whatIsThis: "A formal announcement written for journalists and the media about your news.",
    whyItMatters: "A clear, newsworthy release earns coverage and lends third-party credibility to your business.",
    steps: [
      "The headline — the news in one compelling line",
      "The dateline and lead paragraph (who, what, when, where, why)",
      "The supporting details and context that make it newsworthy",
      "A quote from you or a stakeholder",
      "Boilerplate — the short 'about' paragraph for your business",
      "Media contact information",
    ],
    builtIn: true,
  },
  {
    code: "TL-PSA",
    name: "Public Service Announcement (PSA)",
    category: "pr-media",
    executiveId: "marketing-brand",
    whatIsThis: "A concise public-interest message that informs and prompts responsible action.",
    whyItMatters: "A PSA builds goodwill and positions your business as a trusted, values-driven voice.",
    steps: [
      "The issue and why it matters to the public right now",
      "The single most important message the audience must hear",
      "The facts or context that make it credible",
      "The specific action you are asking people to take",
      "Where to learn more or get help",
    ],
    builtIn: true,
  },
  {
    code: "TL-PITCH",
    name: "Media Pitch",
    category: "pr-media",
    executiveId: "marketing-brand",
    whatIsThis: "A short, personalized pitch to a journalist or producer to earn a story or interview.",
    whyItMatters: "A sharp pitch is how you turn your expertise into earned media and interviews.",
    steps: [
      "The angle — the story you are offering, tailored to their audience",
      "Why you, why now — your credibility and the timely hook",
      "The 2 to 3 talking points you can deliver",
      "The clear ask — interview, quote, or feature",
      "Your contact details and availability",
    ],
    builtIn: true,
  },
]

export function getBuiltInFormat(code: string): ThoughtLeadershipFormat | undefined {
  return THOUGHT_LEADERSHIP_FORMATS.find((f) => f.code === code)
}

/**
 * Best-effort match of a free-text request to a built-in template so we reuse
 * the library before asking an executive to generate a new one. Returns the
 * matched format or null when the founder wants something the library does
 * not already contain.
 */
export function matchBuiltInFormat(request: string): ThoughtLeadershipFormat | null {
  const q = request.trim().toLowerCase()
  if (!q) return null
  const table: Array<{ code: string; keywords: string[] }> = [
    { code: "TL-KEYNOTE", keywords: ["keynote"] },
    { code: "TL-TALK", keywords: ["signature talk", "talk", "presentation", "speech"] },
    { code: "TL-OPED", keywords: ["op-ed", "op ed", "oped", "opinion piece", "opinion"] },
    { code: "TL-ARTICLE", keywords: ["article", "essay", "blog", "long-form", "long form"] },
    { code: "TL-LINKEDIN", keywords: ["linkedin", "post", "social post"] },
    { code: "TL-PRESS", keywords: ["press release", "press-release", "announcement", "news release"] },
    { code: "TL-PSA", keywords: ["psa", "public service"] },
    { code: "TL-PITCH", keywords: ["media pitch", "pitch", "journalist", "reporter", "interview request"] },
  ]
  for (const { code, keywords } of table) {
    if (keywords.some((k) => q.includes(k))) return getBuiltInFormat(code) ?? null
  }
  return null
}
