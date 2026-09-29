"use client"

/**
 * TimeFreedomSocial — Time Freedom Moments™, the public community feed
 * celebrating the life members are reclaiming. Re-laid-out as a 4-wide grid
 * (filling row by row) instead of a vertical card list; all reaction/
 * comment/share logic lives in the shared `CommunityMomentsFeed` engine.
 */
import { CommunityMomentsFeed, type CommunityMomentsFeedConfig } from "@/components/community-moments-feed"

const CONFIG: CommunityMomentsFeedConfig = {
  postType: "time_freedom",
  channelName: "time-freedom-moments",
  title: "Time Freedom Moments™",
  subtitle: "Celebrate the life you're reclaiming. Contained work. Expanded life.",
  composerPlaceholder: "Share a moment from your life — a walk, lunch with someone you love, a quiet afternoon...",
  shareButtonLabel: "Share Moment",
  uploadPath: "/api/time-freedom-social/upload",
  mediaPath: "/api/time-freedom-social/media",
  maxVideoSeconds: 60,
  maxVideoBytes: 100 * 1024 * 1024,
  emptyStateTitle: "Be the first to share a Time Freedom Moment",
  emptyStateSubtitle: "Post a photo or a short clip of the life you're reclaiming.",
  footerHint: "Photos up to 10MB · Videos up to 60 seconds",
  rememberEndpoint: "/api/time-freedom-moments/remember",
  layout: "grid",
}

export function TimeFreedomSocial({ active }: { active: boolean }) {
  return <CommunityMomentsFeed active={active} config={CONFIG} />
}
