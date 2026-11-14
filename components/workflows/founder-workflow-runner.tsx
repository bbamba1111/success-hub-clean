"use client"

import { useEffect, useMemo, useState } from "react"
import { loadFounderTaskContext, type FounderTaskContext } from "@/lib/founder-gps/task-context"
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, RotateCcw, Sparkles } from "lucide-react"

type Choice = { id: string; label: string; description: string; next: string }
type Node = { id: string; title: string; prompt: string; choices?: Choice[]; action?: string }

const WORKFLOW: Record<string, Node> = {
  start: {
    id: "start",
    title: "Who would you like to find?",
    prompt: "Choose the kind of relationship you want to build. Each choice opens its own path.",
    choices: [
      { id: "customers", label: "Potential customers", description: "People who may need what you offer.", next: "customers" },
      { id: "partners", label: "Potential partners", description: "People or businesses who could work with you.", next: "partners" },
      { id: "groups", label: "Groups and communities", description: "Places where the right people already gather.", next: "groups" },
      { id: "visibility", label: "Media, podcasts and events", description: "Places to share your ideas and expertise.", next: "visibility" },
    ],
  },
  customers: {
    id: "customers",
    title: "How would you like to find customers?",
    prompt: "You do not need an email list to begin. Pick the best place to start.",
    choices: [
      { id: "known", label: "People I already know", description: "Past clients, colleagues and people in your circle.", next: "known" },
      { id: "new", label: "Find people I don't know yet", description: "Research people who fit the kind of customer I want.", next: "new" },
      { id: "referrals", label: "People who can refer customers", description: "Build relationships with trusted connectors.", next: "referrals" },
      { id: "unsure", label: "Help me choose", description: "Start with a few simple questions.", next: "customer-help" },
    ],
  },
  known: {
    id: "known",
    title: "Where are your existing contacts?",
    prompt: "Choose any place where names or relationships may already be saved.",
    choices: [
      { id: "email", label: "My email", description: "People I've emailed before.", next: "contact-review" },
      { id: "social", label: "LinkedIn or another social network", description: "People I already know online.", next: "contact-review" },
      { id: "files", label: "A spreadsheet, phone or contact list", description: "Names I've saved somewhere else.", next: "contact-review" },
      { id: "none", label: "I can't find my contacts", description: "Help me start a new list.", next: "new" },
    ],
  },
  new: {
    id: "new",
    title: "Do you know who your best customer is?",
    prompt: "We can define this together. You do not need perfect answers.",
    choices: [
      { id: "clear", label: "Yes, I know who I'm looking for", description: "I can describe the people or businesses I want to reach.", next: "research-source" },
      { id: "unclear", label: "Not yet", description: "Help me describe the people who need what I offer.", next: "customer-profile" },
    ],
  },
  "research-source": {
    id: "research-source",
    title: "Where should we look?",
    prompt: "Choose a place to begin. We can add more sources later.",
    choices: [
      { id: "linkedin", label: "LinkedIn", description: "People, roles and businesses.", next: "research-brief" },
      { id: "directories", label: "Business directories and websites", description: "Public company and professional listings.", next: "research-brief" },
      { id: "communities", label: "Groups and communities", description: "Associations and places your customers gather.", next: "research-brief" },
      { id: "recommend", label: "Recommend a place for me", description: "Choose based on the customer I want to reach.", next: "research-brief" },
    ],
  },
  "customer-profile": {
    id: "customer-profile",
    title: "Let's describe your best customer",
    prompt: "Start with what you know. You can refine this later.",
    action: "Write down the type of person or business you help, the problem they want solved, and what makes them a good fit. When that description is ready, continue to choose where to look.",
    choices: [{ id: "profile-done", label: "I have a starting description", description: "Continue to choose research sources.", next: "research-source" }],
  },
  "contact-review": {
    id: "contact-review",
    title: "Let's review the people you already know",
    prompt: "The next step is to gather names you are allowed to use and sort them by how well they fit.",
    action: "Create a short list with each person's name, how you know them, why they may be a fit, and the source of the relationship. Do not send messages yet; first review and choose who you want to contact.",
  },
  referrals: {
    id: "referrals",
    title: "Who already knows the people you want to reach?",
    prompt: "Think about trusted people, professional groups and organizations that serve a similar audience.",
    choices: [
      { id: "people", label: "People in my network", description: "Colleagues, clients and trusted contacts.", next: "referral-plan" },
      { id: "organizations", label: "Organizations and associations", description: "Groups connected to my audience.", next: "referral-plan" },
      { id: "not-sure", label: "I'm not sure yet", description: "Help me identify good connectors.", next: "referral-plan" },
    ],
  },
  "customer-help": {
    id: "customer-help",
    title: "Let's choose a good starting point",
    prompt: "If you have people you already know, start there. If not, define your best customer and research where those people gather.",
    choices: [
      { id: "have-contacts", label: "I have people I can start with", description: "Open the existing-contact path.", next: "known" },
      { id: "no-contacts", label: "I need to find new people", description: "Build a customer profile and research plan.", next: "new" },
    ],
  },
  partners: {
    id: "partners",
    title: "What kind of partner are you looking for?",
    prompt: "A partner could help you reach people, deliver your work or create something together.",
    choices: [
      { id: "referral-partner", label: "Someone who can refer people", description: "A trusted source of introductions.", next: "partner-profile" },
      { id: "delivery-partner", label: "Someone who can help deliver", description: "A person or business with complementary skills.", next: "partner-profile" },
      { id: "collaboration", label: "Someone to create with", description: "A shared project, event or offer.", next: "partner-profile" },
    ],
  },
  groups: {
    id: "groups",
    title: "What kind of group do you want to find?",
    prompt: "Choose the place that best matches the people you want to meet.",
    choices: [
      { id: "professional", label: "Professional associations", description: "Industry and business groups.", next: "group-plan" },
      { id: "online", label: "Online communities", description: "Groups where people connect and share.", next: "group-plan" },
      { id: "local", label: "Local business groups and events", description: "In-person communities and gatherings.", next: "group-plan" },
    ],
  },
  visibility: {
    id: "visibility",
    title: "Where would you like to be seen or heard?",
    prompt: "Choose the kind of opportunity you want to explore.",
    choices: [
      { id: "podcasts", label: "Podcasts and interviews", description: "Share your expertise with an audience.", next: "visibility-plan" },
      { id: "speaking", label: "Speaking and conferences", description: "Find stages and events that fit your work.", next: "visibility-plan" },
      { id: "media", label: "Press and media", description: "Connect with journalists and publications.", next: "visibility-plan" },
      { id: "newsletters", label: "Newsletters and publications", description: "Contribute useful ideas to relevant audiences.", next: "visibility-plan" },
    ],
  },
  "partner-profile": { id: "partner-profile", title: "Let's describe the right partner", prompt: "What would make this relationship useful and a good fit?", action: "Write down the kind of partner, what you could offer each other, and the people or audience you would serve. Then identify public sources where those partners can be found." },
  "group-plan": { id: "group-plan", title: "Let's find the right groups", prompt: "Start with the people you want to meet and the places they already gather.", action: "List the audience, location or online setting, and topics that matter. Then research relevant groups and check their public membership and participation information." },
  "visibility-plan": { id: "visibility-plan", title: "Let's find the right opportunities", prompt: "Choose opportunities that reach the people you want to serve.", action: "Write down your topics, ideal audience, preferred format and location. Then build a research list of relevant shows, events, publications or media outlets." },
  "referral-plan": { id: "referral-plan", title: "Let's map your referral relationships", prompt: "Start with people and organizations that already have trust with your intended audience.", action: "Make a list of potential connectors, why each relationship makes sense, and a helpful way to begin a conversation." },
  "research-brief": { id: "research-brief", title: "Your research starting point is ready", prompt: "Before researching, make the search clear enough to find relevant people.", action: "Prepare a short research brief: who you want to find, why they may be a fit, which public sources to search, and what information to record. Review results before deciding whether to contact anyone." },
}

export function FounderWorkflowRunner({ workItemId, taskTitle }: { workItemId: string; taskTitle: string }) {
  const storageKey = `founder-workflow:v1:${workItemId}`
  const [path, setPath] = useState<string[]>(["start"])
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)
  const [taskContext, setTaskContext] = useState<FounderTaskContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [researchLoading, setResearchLoading] = useState(false)
  const [researchError, setResearchError] = useState<string | null>(null)
  const [researchResults, setResearchResults] = useState<Array<{title:string;url:string;summary:string;relevance:number|null}>>([])
  const [researchQuery, setResearchQuery] = useState("")

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        const value = JSON.parse(saved) as { path?: string[]; done?: boolean }
        if (Array.isArray(value.path) && value.path.every((id) => WORKFLOW[id])) setPath(value.path)
        setDone(Boolean(value.done))
      }
    } catch { /* Start clean if this browser cannot read saved progress. */ }
    setReady(true)
  }, [storageKey])

  useEffect(() => {
    let cancelled = false
    setContextLoading(true)
    loadFounderTaskContext(taskTitle).then((context) => {
      if (!cancelled) setTaskContext(context)
    }).catch(() => {
      if (!cancelled) setTaskContext(null)
    }).finally(() => {
      if (!cancelled) setContextLoading(false)
    })
    return () => { cancelled = true }
  }, [taskTitle])

  useEffect(() => {
    if (!ready) return
    try { window.localStorage.setItem(storageKey, JSON.stringify({ path, done })) } catch { /* Keep the workflow usable if storage is unavailable. */ }
  }, [path, done, ready, storageKey])

  const current = WORKFLOW[path[path.length - 1]] ?? WORKFLOW.start
  const canGoBack = path.length > 1
  const trail = useMemo(() => path.map((id) => WORKFLOW[id]?.title).filter(Boolean), [path])

  function choose(next: string) {
    if (!WORKFLOW[next]) return
    setPath((old) => [...old, next])
    setDone(false)
  }
  function back() {
    setPath((old) => old.length > 1 ? old.slice(0, -1) : old)
    setDone(false)
  }
  function restart() {
    setPath(["start"])
    setDone(false)
    setResearchResults([])
    setResearchError(null)
  }

  async function runResearch() {
    if (!taskContext) return
    const category = path.includes("visibility") ? "podcasts" : path.includes("partners") ? "partners" : path.includes("groups") ? "groups" : path.includes("referrals") ? "partners" : path.includes("customers") || path.includes("new") ? "customers" : "media"
    setResearchLoading(true)
    setResearchError(null)
    setResearchResults([])
    try {
      const response = await fetch("/api/founder-gps/research", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ taskTitle, category, businessName: taskContext.businessName, businessDescription: taskContext.businessDescription, idealAudience: taskContext.idealAudience, expertise: taskContext.expertise }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Research could not be completed.")
      setResearchQuery(data.query || "")
      setResearchResults(Array.isArray(data.results) ? data.results : [])
    } catch (error) {
      setResearchError(error instanceof Error ? error.message : "Research could not be completed.")
    } finally { setResearchLoading(false) }
  }

  return (
    <section className="mt-4 overflow-hidden rounded-3xl border border-[#E8B8C5]/70 bg-[#FFF9FA] shadow-sm" aria-label="Interactive workflow">
      <div className="border-b border-[#E8B8C5]/50 bg-gradient-to-r from-[#F8E9ED] to-[#F1F5EE] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2 text-[#668B58]">
          <Sparkles className="h-4 w-4" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-[0.16em]">Your guided workflow</p>
        </div>
        <h3 className="mt-1 text-lg font-bold text-[#382B31]">{taskTitle}</h3>
        <p className="mt-1 text-xs text-[#76656D]">Choose a path. Each choice opens the next part of the workflow.</p>
      </div>
      <div className="space-y-4 px-5 py-5 sm:px-6">
        <nav aria-label="Workflow path" className="flex flex-wrap items-center gap-1 text-xs text-[#76656D]">
          {trail.map((label, index) => <span key={index} className="inline-flex items-center gap-1">{index > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}<span className={index === trail.length - 1 ? "font-semibold text-[#668B58]" : ""}>{label}</span></span>)}
        </nav>
        <div>
          <h4 className="text-base font-bold text-[#382B31]">{current.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-[#66545D]">{current.prompt}</p>
        </div>
        {current.choices && (
          <div className="grid gap-2 sm:grid-cols-2">
            {current.choices.map((choice) => (
              <button key={choice.id} type="button" onClick={() => choose(choice.next)} className="group flex items-start justify-between gap-3 rounded-2xl border border-[#E8B8C5]/60 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#668B58]/60 hover:shadow-md">
                <span>
                  <span className="block text-sm font-semibold text-[#382B31]">{choice.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#76656D]">{choice.description}</span>
                </span>
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#668B58] transition group-hover:translate-x-0.5" aria-hidden />
              </button>
            ))}
          </div>
        )}
        {current.action && (
          <div className="rounded-2xl border border-[#E8B8C5]/60 bg-white px-4 py-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#668B58]">Your business context</p>
              <span className="rounded-full bg-[#F1F5EE] px-2 py-1 text-[11px] font-semibold text-[#557748]">Read-only · Source of Truth</span>
            </div>
            {contextLoading ? <p className="mt-2 text-sm text-[#76656D]">Loading your saved business information…</p> : taskContext ? (
              <>
                <p className="mt-2 text-sm font-semibold text-[#382B31]">{taskContext.businessName ?? "Business name not found in saved profiles"}</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div><p className="text-xs font-semibold text-[#76656D]">What you offer</p><p className="mt-1 text-sm text-[#382B31]">{taskContext.businessDescription ?? "Not yet available"}</p></div>
                  <div><p className="text-xs font-semibold text-[#76656D]">Who you serve</p><p className="mt-1 text-sm text-[#382B31]">{taskContext.idealAudience ?? "Not yet available"}</p></div>
                  <div><p className="text-xs font-semibold text-[#76656D]">Expertise and topics</p><p className="mt-1 text-sm text-[#382B31]">{taskContext.expertise.join(", ") || "Not yet available"}</p></div>
                  <div><p className="text-xs font-semibold text-[#76656D]">Business stage</p><p className="mt-1 text-sm text-[#382B31]">{taskContext.stage ?? "Not yet available"}</p></div>
                </div>
                <div className="mt-4 rounded-xl border border-[#D8E6CF] bg-[#F1F5EE] p-3">
                  <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#557748]">ERA · Task readiness</p><span className="text-xs font-semibold text-[#557748]">{taskContext.era.status === "ready" ? "Ready for research" : taskContext.era.status === "needs-input" ? "Some details needed" : "Limited business context"}</span></div>
                  {taskContext.era.available.length > 0 && <p className="mt-2 text-xs text-[#3E4939]">Available: {taskContext.era.available.join(" · ")}</p>}
                  {taskContext.era.missing.length > 0 && <p className="mt-1 text-xs text-[#8B5364]">Needed: {taskContext.era.missing.join(" · ")}</p>}
                  <p className="mt-2 text-[11px] text-[#76656D]">This is a task-specific readiness check, not a founder score. Missing details are not invented.</p>
                </div>
              </>
            ) : <p className="mt-2 text-sm text-[#8B5364]">Saved business context could not be loaded. Research should wait until the source records are available.</p>}
          </div>
        )}
        {current.action && (
          <div className="rounded-2xl border border-[#E8B8C5]/60 bg-white px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#668B58]">AI-assisted opportunity research</p>
            <p className="mt-1 text-sm text-[#66545D]">Search the web using your saved business context. Results include source links so you can check fit and current details.</p>
            <button type="button" onClick={runResearch} disabled={researchLoading || contextLoading || !taskContext} className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#668B58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#557748] disabled:cursor-not-allowed disabled:opacity-50">
              <Sparkles className="h-4 w-4" aria-hidden /> {researchLoading ? "Researching…" : "Research opportunities"}
            </button>
            {researchError && <p role="alert" className="mt-3 rounded-xl bg-[#FFF1F2] p-3 text-sm text-[#9B3F52]">{researchError}</p>}
            {researchQuery && <p className="mt-3 text-xs text-[#76656D]">Search: {researchQuery}</p>}
            {researchResults.length > 0 && <div className="mt-3 space-y-3"><p className="text-sm font-semibold text-[#382B31]">{researchResults.length} source results found</p>{researchResults.map((result, index) => <article key={result.url} className="rounded-xl border border-[#E8B8C5]/50 p-3"><a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#476D3E] underline underline-offset-2">{index + 1}. {result.title}</a><p className="mt-2 text-xs leading-relaxed text-[#66545D]">{result.summary}</p><p className="mt-2 break-all text-[11px] text-[#8A7880]">{result.url}</p></article>)}<p className="text-xs leading-relaxed text-[#76656D]">Search results are leads, not confirmed invitations. Check deadlines, eligibility, audience fit and contact details at the original source. No outreach has been sent.</p></div>}
          </div>
        )}
        {current.action && (
          <div className="rounded-2xl border border-[#668B58]/25 bg-[#F1F5EE] px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#668B58]">Your next action</p>
            <p className="mt-2 text-sm leading-relaxed text-[#3E4939]">{current.action}</p>
            <button type="button" onClick={() => setDone(true)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#668B58] px-4 py-2 text-sm font-semibold text-white hover:bg-[#557748]">
              <CheckCircle2 className="h-4 w-4" aria-hidden /> Mark this step done
            </button>
            {done && <p role="status" className="mt-3 text-sm font-semibold text-[#557748]">Step marked done. Your path is saved in this browser.</p>}
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E8B8C5]/40 pt-3">
          <button type="button" onClick={back} disabled={!canGoBack} className="inline-flex items-center gap-2 rounded-full border border-[#DCCBD0] bg-white px-4 py-2 text-sm font-semibold text-[#66545D] disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back
          </button>
          <button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#668B58] hover:bg-[#F1F5EE]">
            <RotateCcw className="h-4 w-4" aria-hidden /> Start again
          </button>
        </div>
        <p className="text-[11px] leading-relaxed text-[#8A7880]">Your path is saved in this browser on this device. Research runs only when you request it. No messages or external actions are sent automatically.</p>
      </div>
    </section>
  )
}
