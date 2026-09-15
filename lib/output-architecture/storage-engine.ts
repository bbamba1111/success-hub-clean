/**
 * The Storage Engine™ — Versioning & Persistence Types (Phase 5.3)
 * ---------------------------------------------------------------------------
 * Part of the Deliverable Output Architecture™. The Storage Engine™ owns the
 * lifecycle of a deliverable's content over time: templates → drafts → revisions
 * → final versions, plus future version history.
 *
 * Architecture only. Nothing is persisted this phase; these types define the
 * contract so the Deliverable Engine™, Harmony Library™, and future history UI
 * can be built WITHOUT redesigning how deliverables are stored.
 */

/** Where a stored deliverable sits in its lifecycle. */
export type StorageLifecycle = "template" | "draft" | "revision" | "final" | "archived"

/**
 * A single stored version of a deliverable's Structured Business Content™.
 * `content` is intentionally typed loosely here to avoid a circular import with
 * the registry; the Deliverable Engine™ owns the concrete StructuredBusinessContent.
 */
export interface DeliverableVersion {
  /** Stable version id. */
  id: string
  /** The deliverable this version belongs to. */
  deliverableId: string
  /** Monotonic version number (1-based). */
  version: number
  /** Lifecycle state of this version. */
  lifecycle: StorageLifecycle
  /** ISO timestamp when this version was created. */
  createdAt: string
  /** Optional human label ("First draft", "Board-ready"). */
  label?: string
  /** The structured content captured at this version (shape owned by the engine). */
  content?: unknown
}

/**
 * The persisted record for a deliverable across all its versions. A future phase
 * implements the actual store (DB, Blob, or Harmony Library™) behind this shape.
 */
export interface StoredDeliverable {
  deliverableId: string
  /** Ordered version history, oldest → newest. */
  versions: DeliverableVersion[]
  /** Convenience pointer to the current final/working version id. */
  currentVersionId?: string
}

/**
 * Reserved capabilities the Storage Engine™ will expose. Declared as a type (not
 * an implementation) so consumers can be written against a stable contract now.
 */
export interface StorageEngineCapabilities {
  versionHistory: boolean
  drafts: boolean
  finalVersions: boolean
  revisions: boolean
  templates: boolean
}

/** The capabilities this architecture is being built toward (all future). */
export const STORAGE_ENGINE_ROADMAP: StorageEngineCapabilities = {
  versionHistory: true,
  drafts: true,
  finalVersions: true,
  revisions: true,
  templates: true,
}
