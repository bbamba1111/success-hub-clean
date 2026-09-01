"use client"

/**
 * LunchShareSocial — full community social feed for the Extended Healthy
 * Hybrid Lunch Break™: photos and up to 2-minute videos, captions,
 * reactions, and comments, visible to the whole community. Uses the new
 * `lunch_break` post_type on the existing `community_posts` table (no
 * schema change) and shares all reaction/comment logic with Time Freedom
 * Moments™ via `CommunityMomentsFeed`.
 */
import { CommunityMomentsFeed, type CommunityMomentsFeedConfig } from "@/components/community-moments-feed"

const CONFIG: CommunityMomentsFeedConfig = {
  postType: "lunch_break",
  channelName: "lunch-share-moments",
  title: "Lunch Share™",
  subtitle: "Share what you're nourishing yourself with — a meal, a walk, a moment away from the desk.",
  composerPlaceholder: "Share your lunch break — a meal, a walk, a recipe, a moment of rest...",
  shareButtonLabel: "Share Lunch",
  uploadPath: "/api/lunch-share/upload",
  mediaPath: "/api/lunch-share/media",
  maxVideoSeconds: 120,
  maxVideoBytes: 150 * 1024 * 1024,
  emptyStateTitle: "Be the first to share your lunch break",
  emptyStateSubtitle: "Post a photo or a short clip of how you're protecting this time.",
  footerHint: "Photos up to 10MB · Videos up to 2 minutes",
  layout: "list",
}

export function LunchShareSocial({ active }: { active: boolean }) {
  return <CommunityMomentsFeed active={active} config={CONFIG} />
}
