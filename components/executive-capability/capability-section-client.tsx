"use client"

/**
 * Capability Section Client™ (Phase 10.4)
 * ---------------------------------------------------------------------------
 * Thin client wrapper for the My Harmony page. Renders CapabilityProgressPanel
 * inside a padded container with no extra logic.
 */

import { CapabilityProgressPanel } from "@/components/executive-capability/capability-progress-panel"

export function CapabilitySectionClient() {
  return <CapabilityProgressPanel />
}
