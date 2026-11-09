import { CHERRY_CORE_SYSTEM_PROMPT } from "@/lib/cherry-blossom/core-prompt"
import { buildMemoryContext } from "@/lib/cherry-blossom/memory-context"
import { CHERRY_BLOSSOM, EXECUTIVE_TEAM } from "@/lib/executive-team/executive-registry"

/**
 * Cherry Blossom's single shared brain.
 *
 * Every Cherry Blossom surface builds its system prompt here so there is only
 * one Cherry Blossom. Routine experiences (morning, workout, lunch, Reality
 * Check, Memory Vault, reminders) get exactly the identity + memory they had
 * before. The coordinator role is an expansion layered on top, and only for
 * surfaces that need it, so routine chats never see workday tools or delegation.
 */
export type CherrySurface = "routine" | "ceo-workday"

const COORDINATOR_SURFACES: ReadonlySet<CherrySurface> = new Set<CherrySurface>(["ceo-workday"])

export function isCoordinatorSurface(surface: CherrySurface): boolean {
  return COORDINATOR_SURFACES.has(surface)
}

/** Routine contexts sent by existing chat UIs. Anything else is treated as routine too. */
export function resolveSurface(context: unknown): CherrySurface {
  return context === "ceo-workday" ? "ceo-workday" : "routine"
}

function formatExecutiveRoster(): string {
  return EXECUTIVE_TEAM.map((exec) => `- ${exec.name} (id: ${exec.id}) — ${exec.mission}`).join("\n")
}

export function buildCoordinatorExpansion(): string {
  return [
    "",
    "---",
    `EXPANDED ROLE IN THE 4-HOUR CEO WORKDAY: ${CHERRY_BLOSSOM.executiveTitle} and Central AI Operations Coordinator™`,
    "You are still Cherry Blossom — same warmth, same memory, same voice. Inside the 4-Hour CEO Workday you also serve as the founder's Central AI Operations Coordinator.",
    "",
    "How you work with the founder:",
    "- Work with me: collaborate directly with the founder on the task in front of them.",
    "- Delegate: hand a well-scoped piece of work to ONE AI Executive, review what comes back, and return it to the founder.",
    "- Collaborate: bring several AI Executives and the founder together on one piece of work.",
    "",
    "The AI Executive team you coordinate:",
    formatExecutiveRoster(),
    "",
    "Non-negotiable integrity rules:",
    "- Never claim an executive did work unless you actually received their output in this conversation.",
    "- Never claim a capability you do not have. If something is not connected (live research, website access, email, follow-up tracking, opportunity records, activity logging), say so plainly.",
    "- The founder holds authority. External communications and consequential actions always require the founder's explicit approval.",
    "- Use only the workday information actually provided. If something is missing, say what is missing instead of guessing.",
    "---",
  ].join("\n")
}

export async function buildCherrySystemPrompt(surface: CherrySurface = "routine"): Promise<string> {
  const memoryContext = await buildMemoryContext()
  const base = CHERRY_CORE_SYSTEM_PROMPT + memoryContext
  return isCoordinatorSurface(surface) ? base + buildCoordinatorExpansion() : base
}
