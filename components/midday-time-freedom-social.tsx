"use client"

/**
 * MiddayTimeFreedomSocial — "Midday & Time Freedom Moments™", the community
 * feed that lives inside the real Extended Healthy Hybrid Lunch Break™
 * segment (`TodaysLunchCard`). Previously this was `TimeFreedomSocial`
 * rendered inside the "Extended Healthy Hybrid Lunch Break" collapsible in
 * Decide & Design™ — it has been moved here, into the actual lunch break
 * space, and renamed. Shares the same `time_freedom` post pool as the
 * standalone Time Freedom™ segment's feed, but uses its own Realtime
 * channel name so both can mount independently without colliding, and
 * raises the upload limits so members can share richer moments over lunch.
 */
import { CommunityMomentsFeed, type CommunityMomentsFeedConfig } from "@/components/community-moments-feed"

const CONFIG: CommunityMomentsFeedConfig = {
  postType: "time_freedom",
  channelName: "midday-time-freedom-moments",
  title: "Midday & Time Freedom Moments™",
  subtitle: "Celebrate the life you're reclaiming. Contained work. Expanded life.",
  composerPlaceholder: "Share a moment from your life — a walk, lunch with someone you love, a quiet afternoon...",
  shareButtonLabel: "Share Moment",
  uploadPath: "/api/time-freedom-social/upload",
  mediaPath: "/api/time-freedom-social/media",
  maxVideoSeconds: 120,
  maxVideoBytes: 250 * 1024 * 1024,
  maxImageBytes: 25 * 1024 * 1024,
  emptyStateTitle: "Be the first to share a Midday Moment",
  emptyStateSubtitle: "Post a photo or a short clip of the life you're reclaiming.",
  footerHint: "Photos up to 25MB · Videos up to 2 minutes",
  rememberEndpoint: "/api/time-freedom-moments/remember",
  layout: "grid",
}

export function MiddayTimeFreedomSocial({ active }: { active: boolean }) {
  return <CommunityMomentsFeed active={active} config={CONFIG} />
}
