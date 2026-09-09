/**
 * Business Articulation Training™ (Phase 4 MVP) — shared purpose map.
 * ---------------------------------------------------------------------------
 * Why the founder is communicating a given CEO Workday™ category's work, in
 * one short phrase. Drives the AI's recommended information order without
 * exposing a separate "purpose" picker — the work category already implies
 * it. Single source of truth so every entry point into articulation practice
 * (Today's Work™ CTA, the highlight banner) derives the same purpose for the
 * same category.
 */

import type { CeoWorkCategoryId } from "@/lib/ceo-workday/categories"

export const ARTICULATION_PURPOSE: Record<CeoWorkCategoryId, string> = {
  BUILD: "explain what you built and why it matters",
  DESIGN: "explain this operating rule or design",
  DECIDE: "explain this decision and the reasoning behind it",
  SOLVE: "explain how this problem was resolved",
  SYSTEMIZE: "explain this process to the people who'll follow it",
  DELEGATE: "hand this work off clearly",
  AUGMENT: "explain the human and AI roles in this work",
  SELL: "pitch this and make the ask",
  MARKET: "communicate this to build visibility",
  CONNECT: "prepare for this relationship conversation",
  DELIVER: "explain the outcome and value delivered",
  COMMUNICATE: "communicate this idea clearly",
}
