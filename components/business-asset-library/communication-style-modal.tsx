"use client"

/**
 * Communication Style Modal — Business Asset Library™
 * ---------------------------------------------------------------------------
 * Wraps the existing, unmodified BusinessComprehensionCard in a shadcn
 * Dialog. Fixes the bug where "Explained in your ... style" navigated the
 * founder away to /member-profile (losing their in-progress build state,
 * especially when AssetDetailView is rendered inline inside the CEO
 * Workday's Today's Work queue). Opening this modal never navigates — the
 * founder can change their Communication Style™ and close right back into
 * the exact build state they were in.
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BusinessComprehensionCard } from "@/components/business-comprehension/business-comprehension-card"

interface Props {
  open: boolean
  onClose: () => void
}

export function CommunicationStyleModal({ open, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent className="max-w-2xl rounded-2xl border border-black/[0.06] bg-brand-cream p-0 shadow-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="sr-only">Your Communication Style™</DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-2 sm:px-4 sm:pb-4">
          <BusinessComprehensionCard />
        </div>
      </DialogContent>
    </Dialog>
  )
}
