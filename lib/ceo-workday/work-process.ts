import type { CeoPlanItem, CeoTreatment } from "./plan-types"

export interface WorkProcessStep {
  id: string
  title: string
  detail: string
  minutes: number
}

interface StepTemplate {
  title: string
  detail: string
  /** Relative weight used to split the assignment's minutes across steps. */
  weight: number
}

interface ProcessPattern {
  match: RegExp
  steps: StepTemplate[]
}

const PATTERNS: ProcessPattern[] = [
  {
    match: /proposal|quote|estimate|statement of work|\bsow\b/i,
    steps: [
      { title: "Gather what you know", detail: "Pull your notes on this client: their problem, the result they want, budget, and timeline.", weight: 2 },
      { title: "Outline the proposal", detail: "Problem → desired outcome → your solution → what's included → investment → next step.", weight: 2 },
      { title: "Write it", detail: "Fill in each section in their words. Keep it to one or two pages.", weight: 4 },
      { title: "Check price and terms", detail: "Confirm the investment, payment terms, and start date are correct.", weight: 1 },
      { title: "Send it with a clear next step", detail: "Email it with a short note and a specific ask (e.g. a decision call or a reply by a date).", weight: 1 },
    ],
  },
  {
    match: /follow[- ]?up|check[- ]?in|reach out|outreach|reconnect/i,
    steps: [
      { title: "List who you're following up with", detail: "Write down each name and where the conversation left off.", weight: 2 },
      { title: "Decide the one ask", detail: "Choose the single next step you want from each person.", weight: 1 },
      { title: "Write the messages", detail: "Short, personal, and end with the ask.", weight: 3 },
      { title: "Send and log them", detail: "Send each one and note the date so you know when to follow up again.", weight: 1 },
    ],
  },
  {
    match: /sales call|discovery call|consult|strategy call|\bcall\b|meeting/i,
    steps: [
      { title: "Review the person", detail: "Read their notes, intake, or last messages so you walk in prepared.", weight: 2 },
      { title: "Set the outcome of the call", detail: "Decide what a successful call ends with (a booked next step, a yes, a decision).", weight: 1 },
      { title: "Hold the conversation", detail: "Ask about the problem, the cost of the problem, and the result they want.", weight: 5 },
      { title: "Capture the next step", detail: "Write down what was agreed and send a recap.", weight: 1 },
    ],
  },
  {
    match: /post|content|newsletter|blog|article|video|reel|podcast|caption/i,
    steps: [
      { title: "Pick the one message", detail: "Choose a single idea your ideal client needs to hear today.", weight: 1 },
      { title: "Draft it", detail: "Hook → story or insight → takeaway → call to action.", weight: 4 },
      { title: "Edit for clarity", detail: "Cut anything that doesn't serve the one message.", weight: 2 },
      { title: "Publish it", detail: "Post or schedule it on the channel you chose.", weight: 1 },
    ],
  },
  {
    match: /email|message|reply|dm\b/i,
    steps: [
      { title: "Decide the purpose", detail: "What should the reader do after reading?", weight: 1 },
      { title: "Draft it", detail: "Open with why it matters to them, then the ask.", weight: 3 },
      { title: "Tighten and send", detail: "Read it once out loud, cut the extra words, send.", weight: 1 },
    ],
  },
  {
    match: /offer|pricing|package|price/i,
    steps: [
      { title: "Name who it's for", detail: "Write the client and the problem the offer solves.", weight: 1 },
      { title: "Define the result", detail: "Describe the transformation in one sentence.", weight: 2 },
      { title: "List what's included", detail: "The deliverables, format, and timeline.", weight: 2 },
      { title: "Set the price", detail: "Price it against the value of the result, not your hours.", weight: 2 },
      { title: "Write it down where it lives", detail: "Save it on your sales page, document, or offer sheet.", weight: 1 },
    ],
  },
  {
    match: /page|website|landing|funnel|form/i,
    steps: [
      { title: "Decide the one action", detail: "What should a visitor do on this page?", weight: 1 },
      { title: "Write the copy", detail: "Headline → problem → solution → proof → call to action.", weight: 4 },
      { title: "Build it", detail: "Put the copy into the page and connect the button or form.", weight: 4 },
      { title: "Test it", detail: "Click through it yourself on desktop and phone.", weight: 1 },
    ],
  },
]

const TREATMENT_FALLBACK: Record<CeoTreatment, StepTemplate[]> = {
  "build-change": [
    { title: "Define what you're building", detail: "Write what it is, who it's for, and what finished looks like.", weight: 1 },
    { title: "Gather what you need", detail: "Collect the notes, examples, tools, or files before you start.", weight: 1 },
    { title: "Build the first complete version", detail: "Get it done end to end. Good, not perfect.", weight: 5 },
    { title: "Review it against the outcome", detail: "Check it against “done when” below and fix the gaps.", weight: 2 },
    { title: "Put it where it will be used", detail: "Save, publish, or hand it off so it actually exists.", weight: 1 },
  ],
  "implement-operate": [
    { title: "Get set up", detail: "Open what you need and close what you don't.", weight: 1 },
    { title: "Do the work", detail: "Work straight through the task without switching.", weight: 6 },
    { title: "Check it against the outcome", detail: "Make sure it matches “done when” below.", weight: 2 },
    { title: "Send, save, or ship it", detail: "Make the outcome real: send it, file it, or publish it.", weight: 1 },
  ],
  "practice-develop": [
    { title: "Choose the skill to practice", detail: "Name the one thing you're getting better at.", weight: 1 },
    { title: "Learn or review", detail: "Read, watch, or review your example.", weight: 3 },
    { title: "Practice it", detail: "Do a real rep, not a hypothetical one.", weight: 4 },
    { title: "Write what you learned", detail: "Note one thing you'll do differently next time.", weight: 1 },
  ],
  "delegate-transfer": [
    { title: "Define the outcome", detail: "Write exactly what finished looks like.", weight: 1 },
    { title: "Choose who owns it", detail: "Pick the person and confirm they have the capacity.", weight: 1 },
    { title: "Write the handoff", detail: "Steps, resources, deadline, and who to ask for help.", weight: 4 },
    { title: "Hand it off and set a check-in", detail: "Send the handoff and put a check-in date on the calendar.", weight: 2 },
  ],
  "systemize-augment-automate-ai": [
    { title: "Map how it's done today", detail: "List each step you currently do by hand.", weight: 2 },
    { title: "Pick the step to systemize", detail: "Choose the repeatable step that costs you the most time.", weight: 1 },
    { title: "Set up the system, template, or tool", detail: "Build the checklist, template, automation, or AI prompt.", weight: 5 },
    { title: "Run it once to test", detail: "Use it on real work and fix what breaks.", weight: 2 },
  ],
}

function splitMinutes(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1
  const raw = weights.map((w) => Math.max(1, Math.round((w / sum) * total)))
  const diff = total - raw.reduce((a, b) => a + b, 0)
  const largest = raw.indexOf(Math.max(...raw))
  raw[largest] = Math.max(1, raw[largest] + diff)
  return raw
}

/** A concrete, timed process for doing a non-asset assignment inside its hour. */
export function buildWorkProcess(item: Pick<CeoPlanItem, "title" | "treatment" | "estimatedMinutes">): WorkProcessStep[] {
  const pattern = PATTERNS.find((p) => p.match.test(item.title))
  const steps = pattern?.steps ?? TREATMENT_FALLBACK[item.treatment] ?? TREATMENT_FALLBACK["implement-operate"]
  const minutes = splitMinutes(Math.max(steps.length, item.estimatedMinutes || 30), steps.map((s) => s.weight))
  return steps.map((s, i) => ({ id: `step-${i}`, title: s.title, detail: s.detail, minutes: minutes[i] }))
}
